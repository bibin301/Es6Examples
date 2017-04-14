/**
 *  auth management
 */

(function() {
	'use strict';

	angular
		.module(appObj.id)
		.constant('APP_AUTH_EVENT', {
			authLoginSuccess       : 'auth-login-success',
			authLoginFailed        : 'auth-login-failed',
			authLogoutSuccess      : 'auth-logout-success',
			authSessionTimeout     : 'auth-session-timeout',
			authNotAuthenticated   : 'auth-not-authenticated',
			authNotAuthorised      : 'auth-not-authorised',
			authNotFound           : 'auth-not-found'
		})
		.constant('APP_USER_ROLES', {
			superadmin  : '0',
			logged_in   : '*',
			all         : '1',
			mm_view     : 'a1',
			mm_admin    : 'a2',
			mm_deptadm  : 'a3',

		})
		.service('appSessionSrv',          appSessionSrv)
		.factory('appAuthReqQueue',        appAuthReqQueue)
		.factory('appAuthReqQueue',     appAuthReqQueue)
		.factory('appAuthSrv',             appAuthSrv)
		.config(appAuthConfig);


	//////////////////////////  Authentication Interceptor /////////////////////////////////
	/*
	* This section defines the logic to handle the following:
	* - Add the token for every request if logged in
	* - If we receive a authentication failure error, then
	*   this will help in raising an appropriate login before continuing
	* TODO: If a sessionTimeout happens, we need to defer the previous request so that
	*       user data of the previous request is continued after successful login
	*/

	appAuthReqQueue.$inject = ['$rootScope', '$q', 'appSessionSrv', 'appAuthReqQueue', 'APP_AUTH_EVENT'];
	function appAuthReqQueue  ( $rootScope,   $q,   appSessionSrv,   appAuthReqQueue,   APP_AUTH_EVENT) {
		console.log("APP.authInterceptor: Configured");
		return {
			request: requestInject,
			responseError: responseAuthManage
		};

		function requestInject(config) {
			console.log("APP.authInterceptor.request: " + config.url + "(Anonymous:" + appSessionSrv.anonymous + ")");
			if ((!appSessionSrv.anonymous) && (appSessionSrv.userData.token != "")) {
				config.headers = config.headers || {};
				config.headers[appObj.tokenKey] = appSessionSrv.userData.token;
			}
			return config || $q.when(config);
		}

		//TODO: Add the $q.defer later on to handle resending of previous request which
		//      results in a 401, 419, 420
		function responseAuthManage(response) {
			console.log("22APP.authInterceptor.response: " + response.config.url + "(" + response.status + ")");

			response.config.ignoreAPPAuth = true;
			if (!response.config.ignoreAPPAuth) {
				var deferred = null;
				if (response.status == 800 ||
					response.status == 401 ||
					response.status == 419 ||
					response.status == 440) {
					deferred = $q.defer();
					appAuthReqQueue.append(response.config, deferred);
				}

				$rootScope.$broadcast({
					800: APP_AUTH_EVENT.authNotAuthenticated,
					//401: APP_AUTH_EVENT.authNotAuthenticated,
					//403: APP_AUTH_EVENT.authNotAuthorized,
					404: APP_AUTH_EVENT.authNotFound,
					419: APP_AUTH_EVENT.authSessionTimeout,
					440: APP_AUTH_EVENT.authSessionTimeout
				}[response.status], response);

				if (deferred !== null) {
					return deferred.promise;
				}

			}

			return $q.reject(response);
		}
	}

	appAuthConfig.$inject = ['$httpProvider'];
	function appAuthConfig (  $httpProvider ) {
		$httpProvider.interceptors.push(['$injector',
			function($injector) {
				return $injector.get('appAuthReqQueue');
			}
		]);
	}

	////////////////// END OF Authentication Interceptor /////////////////////////////////

	//////////////////////////  Pending request manager /////////////////////////////////
	/*
	* This section defines the logic to handle the following:
	* - Store all requests that failed because of authentication failure
	* - This also stores even for sessionTimeout scenario as-well
	*/

	appAuthReqQueue.$inject = ['$injector'];
	function appAuthReqQueue  ( $injector) {
		console.log("APP.authReqQueue: Configured");
		var buffer = [];

		/** Service initialized later because of circular dependency problem. */
		var $http;

		function retryHttpRequest(config, deferred) {
			function successCallback(response) {
				deferred.resolve(response);
			}
			function errorCallback(response) {
				deferred.reject(response);
			}
			$http = $http || $injector.get('$http');
			$http(config).then(successCallback, errorCallback);
		}

		return {
			/**
			 * Appends HTTP request configuration object with deferred response attached to buffer.
			 */
			append: function(config, deferred) {
				console.log(" Auth Req Queue: Appending " + config.url);
				buffer.push({
					config: config,
					deferred: deferred
				});
			},

			/**
			 * Abandon or reject (if reason provided) all the buffered requests.
			 */
			rejectAll: function(reason) {
				console.log(" Auth Req Queue: Clearing " + buffer.length);
				if (reason) {
					for (var i = 0; i < buffer.length; ++i) {
						buffer[i].deferred.reject(reason);
					}
				}
				buffer = [];
			},

			/**
			 * Retries all the buffered requests clears the buffer.
			 */
			retryAll: function(updater) {
				console.log(" Auth Req Queue: Retrying " + buffer.length);
				if (typeof updater === "undefined" || updater === null) {
					updater = function(config) {return config;};
				}
				for (var i = 0; i < buffer.length; ++i) {
					retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
				}
				buffer = [];
			}
		};
	}
	///////////////////End of Pending request manager /////////////////////////////////


	//////////////////////////  Authentication Service /////////////////////////////////
	/*
	* This section provides the service to perform the actual authentication
	*  - This sends the authentication request to the backend and gets the
	*    appropriate token
	*  All the modules (sub systems) which needs Authentication needs to use this service
	*  injected
	*  API to use:
	*    - login(user, successCallback, errorCallback)
	*       user : has the credential info user has provided to login
	*    - wasLogged()
	*    - isAuthenticated()
	*    - isAuthorised(roleid)
	*    - logout()
	*/
	appAuthSrv.$inject = ['$http', '$rootScope', '$window', 'appSessionSrv', 'appAuthReqQueue', 'APP_AUTH_EVENT', 'APP_USER_ROLES'];
	function appAuthSrv (  $http,   $rootScope,   $window,   appSessionSrv,   appAuthReqQueue,   APP_AUTH_EVENT,   APP_USER_ROLES) {

		/*
		 * Section: Server PATHs
		 */
		var serverURls  = {};
		var serverURls  = {
			'LOGIN'    : "model/Login/login.json",
			'LOGOUT'   : appObj.serverBasePath + "/logout"
		};

		var authService = {};
		authService.login           = loginAPP;
		authService.wasLogged       = wasLogged;
		authService.isAuthenticated = isAuthenticated;
		authService.isAuthorised    = isAuthorised;
		authService.logout          = logoutAPP;

		return authService;




		//the login function
		function loginAPP(user, successCall, errorCall) {
			var loginData 			= {};
			loginData.id 			= '';
			loginData.roles 		= '';

			loginData.token 		= '';

			$http.post(serverURls['LOGIN'], user)
			.success(function(result) {
				alert("success");
				console.log("Data from server: Auth response");
				console.log(result);
				if ((typeof  result.data.userName === 'undefined') || (typeof result.data.id === 'undefined')) {
					//OR ELSE
					//unsuccessful login, fire login failed event for
					//the according functions to run
					$rootScope.$broadcast(APP_AUTH_EVENT.authLoginFailed);
					errorCall();

				}
				else {

					loginData.id 			= result.data.id;
					//loginData.roles = data.;
					loginData.userName 	= result.data.userName;

					loginData.token 		= result.token;
					//loginData.roles 		= data.roles;

					console.log(loginData);
					//update current user into the Session service
					appSessionSrv.create(loginData);

					//fire event of successful login
					$rootScope.$broadcast(APP_AUTH_EVENT.authLoginSuccess);

					// Resend all pending requests that are in the queue
					appAuthReqQueue.retryAll();
					//run success function
					successCall(loginData);
				}
			})
			.error(function(data) {
				//OR ELSE
				//unsuccessful login, fire login failed event for
				//the according functions to run
				$rootScope.$broadcast(APP_AUTH_EVENT.authLoginFailed);

				// Release all pending requests that are in the queue
				// appAuthReqQueue.rejectAll();

				errorCall();
			});
		}

		//check if the user is authenticated
		function isAuthenticated() {
			return !!appSessionSrv.result.token;
		}

		//Was the user previously logged in
		function wasLogged() {
			console.log(appSessionSrv.userData);
			return !!appSessionSrv.userData.id;
		}


		//check if the user is authorized to access the next route
		//this function can be also used on element level
		//e.g. <p ng-if="isAuthorised(authorisedRoles)">show this only to admins</p>
		function isAuthorised(authorisedRoles) {
			var retStatus = false;
			var i, j;
			if (!angular.isArray(authorisedRoles)) {
				authorisedRoles = [authorisedRoles];
			}
			console.log(typeof authorisedRoles[0] + " " + authorisedRoles[0] + ":" + authorisedRoles.length);
			//Empty array or if the user roles match
			if ((typeof authorisedRoles[0] === 'undefined') ||
				(authorisedRoles.length == 1 && authorisedRoles[0] == "")){
				retStatus = true;
			}
			else {
				if (isAuthenticated()) {
					console.log("Autghen");
					if (!angular.isArray(appSessionSrv.userData.roles)) {
						appSessionSrv.userData.roles = [appSessionSrv.userData.roles];
					}
					for (i = 0; i < appSessionSrv.userData.roles.length; i++) {
						if (appSessionSrv.userData.roles[i] == APP_USER_ROLES.superadmin) { return true; }
						for (j = 0; j < authorisedRoles.length; j++) {
							if (authorisedRoles[j] == appSessionSrv.userData.roles[i]) {
							console.log("Found " + authorisedRoles[j]);
								return true;
							}
						}
					}
				}
			}
			return retStatus;
		}

		//log out the user and broadcast the logoutSuccess event
		function logoutAPP() {
			$http.get(serverURls['LOGOUT'])
			.success(function(data) {
				appSessionSrv.destroy();
			})
			.error(function(data) {
				//OR ELSE
				//unsuccessful logout failed event
				console.log("Failed to logout. Still we are clearning locally" + data);
				appSessionSrv.destroy();
			});

			$rootScope.$broadcast(APP_AUTH_EVENT.authLogoutSuccess);
		}
	}

	////////////////// END OF Authentication Service /////////////////////////////////

	//////////////////////////  Session Service /////////////////////////////////
	/*
	* This section provides the session service for user
	* - Stores the currently logged in user details including token
	* - Loads from userstorage incase of any page refresh after login
	* This service is local and need to be exposed to the outside world
	*/

	appSessionSrv.$inject = ['$rootScope', 'APP_USER_ROLES'];
	function appSessionSrv (  $rootScope,   APP_USER_ROLES) {
		var sessObj = this;
		sessObj.anonymous  = true;
		sessObj.userData   = {};
		sessObj.create     = createObj;
		sessObj.destroy    = destroyObj;

		// Extract the session data on page refresh
		if (angular.isDefined(appObj.userStorage.getItem(appObj.userKey)) &&
			appObj.userStorage.getItem(appObj.userKey) != null) {
			sessObj.userData = JSON.parse(appObj.userStorage.getItem(appObj.userKey));
			console.log("APPSess: I am here");
			if (sessObj.userData == null) sessObj.userData = {};
			if (sessObj.userData.token != null) {
				sessObj.anonymous = false;
			}
		}

		return sessObj;

		function createObj(userData) {
			console.log("from session objects", userData);
			console.log("APPSess:createObj: " + userData.id);
			console.log(userData);
			sessObj.userData.id 		= userData.id;
			sessObj.userData.roles 		= userData.roles;

			sessObj.userData.token 		= userData.token;

			if (!angular.isArray(sessObj.userData.roles)) {
				if (sessObj.userData.roles == null) {
					sessObj.userData.roles = [ APP_USER_ROLES.logged_in ];
				}
				else {
					sessObj.userData.roles = [sessObj.userData.roles];
					sessObj.userData.roles.push(APP_USER_ROLES.logged_in);
				}
			}
			$rootScope.coreModel.userData.empWindowsId = userData.empWindowsId;
                        $rootScope.coreModel.userData.id = userData.id;


			console.log("APPSess:createObj: Taking from localStorage to coreModel(userData)");

			sessObj.anonymous = false;
/*
			if (angular.isDefined(appObj.userStorage.getItem(appObj.userKey)) &&
				appObj.userStorage.getItem(appObj.userKey) != null) {
*/
			if (sessObj.userData != null) {

				//set the browser session, to avoid relogin on refresh
				appObj.userStorage.setItem(appObj.userKey, JSON.stringify(sessObj.userData));

				if (angular.isDefined(appObj.userStorage.getItem(appObj.userKey))) {
					sessObj.userData = JSON.parse(appObj.userStorage.getItem(appObj.userKey));
					console.log(sessObj.userData);
					$rootScope.coreModel.userData.empWindowsId  = sessObj.userData.empWindowsId;
                                        $rootScope.coreModel.userData.id            = userData.id;


				}
			}
		}

		function destroyObj() {
			sessObj.userData.id   = null;
			sessObj.userData.roles = null;

			sessObj.anonymous      = true;
			// Clear the browser session, to avoid session availability
			appObj.userStorage.removeItem(appObj.userKey);
			console.log("APPSess:destroyObj: Clear user data sess and sessionStorage");
		}

	}

	////////////////// END OF Authentication Session Service /////////////////////////////////

})();
