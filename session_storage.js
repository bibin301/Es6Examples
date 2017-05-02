// Code goes here

/*  App creation:
 *  This defines the Angular application which defines the dependent modules.
 *  This app depends on the following:
 *  -
 * Dependencies: This needs to be called after angular.js is included and first
 *               js of the  specific js code
 *               jquery.js
 *               angular.js
 *               _app.js
 */

/* Home controller : index.html */

/* global AppObj */

(function () {
    'use strict';

    angular.module(appObj.id)
            //           .factory('AuthInterceptor', AuthInterceptor)
            //           .config(AuthConfig)
            .controller('AppCtrl', AppCtrl)
            .factory('SessionService', SessionService);



    AppCtrl.$inject = ['$rootScope', '$scope',  '$location', '$state', '$window', 'toaster', '$timeout', 'AppSrv', 'SessionService'];
    function AppCtrl($rootScope, $scope, $location, $state, $window, toaster, $timeout, AppSrv, SessionService) {


        $scope.logout = logout;

        //$scope.appModel.createObj = createObj;


        /*
         * for badge notification
         */




        $rootScope.userData = {
            id: "",

            token: ""
        };













        function logout() {

            AppSrv.logout().success(function (data, status) {

                SessionService.destroyObj();

                $location.path('/login');


            }).error(function (data, status) {

                SessionService.destroyObj();

                $location.path('/login');

            });

        }


        /*
         * for geeting  ID alone in Array format
         */

        /*
         * getting approver
         */



        /*
         * for help Tab
         */


        /*
         * for date conversion
         */


    }

    //////////////////////////  Authentication Interceptor /////////////////////////////////
    /*
     * This section defines the logic to handle the following:
     * - Add the token for every request if logged in
     * - If we receive a authentication failure error, then
     *   this will help in raising an appropriate login before continuing
     * TODO: If a sessionTimeout happens, we need to defer the previous request so that
     *       user data of the previous request is continued after successful login
     */

    angular.module(appObj.id)
            .factory('myInterceptor', ['$log', '$rootScope', 'SessionService', function ($log, $rootScope, SessionService) {
                    //$log.debug('$log is here to show you that this is a regular factory with injection');
                    // //console.log(SessionService.userData.token);
                    var myInterceptor = {
                        request: function (config) {

                            if (!SessionService.anonymous) {
                                config.headers[appObj.tokenKey] = SessionService.userData.token;
                            }
                            return config;
                        }
                    };

                    return myInterceptor;
                }])
            .config(['$httpProvider', function ($httpProvider) {
                    $httpProvider.interceptors.push('myInterceptor');
                }]);
    ////////////////// END OF Authentication Interceptor /////////////////////////////////




    SessionService.$inject = ['$rootScope'];
    function SessionService($rootScope) {
        var sessObj = this;
        sessObj.anonymous = true;
        sessObj.userData = {};
        sessObj.create = createObj;
        sessObj.destroyObj = destroyObj;

        // Extract the session data on page refresh
        if (angular.isDefined(appObj.userStorage.getItem(appObj.userKey)) &&
                appObj.userStorage.getItem(appObj.userKey) != null) {
            sessObj.userData = JSON.parse(appObj.userStorage.getItem(appObj.userKey));
            //console.log("Sess: I am here");
            if (sessObj.userData == null)
                sessObj.userData = {};
            if (sessObj.userData.token != null) {
                sessObj.anonymous = false;
            }
        }

        return sessObj;

        function createObj(userData) {
            //console.log("Sess:createObj: " + userData.id);
            // //console.log(userData);
            sessObj.userData.id = userData.id;
            //sessObj.userData.roles = userData.roles;






            $rootScope.userData.token = userData.token


            //console.log("Sess:createObj: Taking from localStorage to coreModel(userData)");

            sessObj.anonymous = false;
            /*
             if (angular.isDefined( AppObj.userStorage.getItem( AppObj.userKey)) &&
             AppObj.userStorage.getItem( AppObj.userKey) != null) {
             */
            if (sessObj.userData != null) {

                //set the browser session, to avoid relogin on refresh
                appObj.userStorage.setItem(appObj.userKey, JSON.stringify(sessObj.userData));

                if (angular.isDefined(appObj.userStorage.getItem(appObj.userKey))) {
                    sessObj.userData = JSON.parse(appObj.userStorage.getItem(appObj.userKey));
                    //console.log(sessObj.userData);

                    $rootScope.userData.id = userData.id;
                    $rootScope.userData.name = sessObj.userData.userName;

                    $rootScope.userData.token = sessObj.userData.token;

                }
            }
        }

        function destroyObj() {

            $rootScope.userData.id = null;


            $rootScope.userData.Fname = null;

            $rootScope.userData.token = null;



            // Clear the browser session, to avoid session availability
            appObj.userStorage.removeItem(appObj.userKey);
            //console.log("Sess:destroyObj: Clear user data sess and sessionStorage");

            sessObj.userData.id = null;

            sessObj.userData.token = null;

            // Clear the browser session, to avoid session availability
            appObj.userStorage.removeItem(appObj.userKey);
            //console.log("Sess:destroyObj: Clear user data sess and sessionStorage");
        }

    }

    ////////////////// END OF Authentication Session Service /////////////////////////////////


    /*
     * directive for page title
     */


})();
//===============================login================
// Code goes here

/*  App creation:
 *  This defines the Angular application which defines the dependent modules.
 *  This app depends on the following:
 *  -
 * Dependencies: This needs to be called after angular.js is included and first
 *               js of the  specific js code
 *               jquery.js
 *               angular.js
 *               app.js
 */

/* Home controller : index.html */

(function() {
  'use strict';

  angular.module(appObj.id)
    .controller('loginCtrl', loginCtrl);


  loginCtrl.$inject = ['$rootScope', '$scope', '$uibModal', '$location', '$window', '$timeout', 'AppSrv', 'SessionService'];

  function loginCtrl($rootScope, $scope, $uibModal, $location, $window, $timeout, AppSrv, SessionService) {

    $scope.loginModel = {};
    $scope.loginModel.loginUser = loginUser;


    var sessionvalue = sessionStorage.getItem("data");
    if (sessionvalue != null) {
      $location.path('/dashboard');
    }

    function loginUser(loginData) {
      if (loginData) {
        if (loginData.un && loginData.pw && loginData.un.length > 1 && loginData.pw.length > 3) {



          AppSrv.login(loginData).success(function(data, status) {
            if (data.err === false) {
              //$rootScope.isLogged = true;
              $rootScope.userData.token = data.token;
              $rootScope.userData = {
                id: data.user.id,

                userName: data.user.userName,


                token: data.token

              };
              SessionService.create($rootScope.userData);
              //AppObj.userStorage.setItem(AppObj.userKey, JSON.stringify(sessObj.userData));


              $location.path('/dashboard/form');

            } else {

            }
          }).error(function(data, status) {

          });
        }
      }


    }


  }
})();
