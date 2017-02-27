
http://jsfiddle.net/f8Hee/1/ -file upload

/*
 *mm_ActionController Defined in mm_actions.html partials
 *editActionController Defined in mm_edit_action.html partials/model
 *editActionController Defined in mm_view_action.htmlpartials/model
 *state is defined in /shared /routes.js
 *
 */
app.controller('mm_ActionController', function($scope, $location, SessionService, $rootScope, $modal, MeetingService) {

    $scope.mm_actions = [];
    //----------------------STO mmlist------------------------------
    $rootScope.LoadEditdata = function() {
      MeetingService.get_mm_ActionList().success(function(data, status) { // ActionList service call
        $scope.mm_actions = data.actions;
      }).error(function(data, status) {
        if (data.error = true && data.error_code == "USR_E_03") {
          $scope.$parent.open();
        } else if (data.error = true && data.error_code == "USR_E_04") {
          SessionService.destroy('uid');
          $location.path("/home");
        }
      });
    };

    //-------------------ENO mmlist----------------------------------
    //-------------------STO  mm_action_Edit model-------------------
    $scope.mm_action_Edit = function(action) {
      var modalInstance = $modal.open({
        animation: true,
        size: 'lg', //model size defined
        templateUrl: 'js/components/mm/partials/modal/mm_edit_action.html', // Deparmet action edit page(mm_edit_action.html)
        controller: 'editActionController', // controller for action edit page(mm_edit_action.html)
        //resolve function is start here
        resolve: {
          //STO  resolve mm_actions data form action list
          mm_actions: function() {
            return $scope.mm_actions;
          },
          //END  resolve mm_actions data form action list
          //STO  resolve  ng-repeat reference variable(action)
          action: function() {
              return action;

            }
            //ENO  resolve ng-repeat reference variable(action)
        }
        //resolve function is end here
      });
    };
    //-------------------ENO  mm_action_Edit model-------------------
    $scope.mm_action_details = function(action) {
      var modalInstance = $modal.open({
        animation: true,
        size: 'size',
        templateUrl: 'js/components/mm/partials/modal/mm_view_action.html', // Deparmet action view page(mm_view_action.html)
        controller: 'editActionController', // controller for action view page(mm_view_action.html)
        windowClass: 'mm-action-edit-modal', // class for model window width adjustment
        //resolve function is start here
        resolve: {
          //STO  resolve mm_actions data form action list
          mm_actions: function() {
            return $scope.mm_actions;
          },
          //ENO  resolve mm_actions data form action list
          //STO  resolve  ng-repeat reference variable(action)
          action: function() {
              return action;
            }
            //ENO  resolve  ng-repeat reference variable(action)
        }
        //resolve function is end here
      });
    };
  })
  //-------------------------------STO editActionController ----------------------------------
  .controller('editActionController', function($scope, $rootScope, $modalInstance, mm_actions, action, MeetingService) {
    $scope.action = action;
    //---------------------STO get_mm_ActionEdit-----------
    MeetingService.get_mm_ActionEdit(action).success(function(data) { // URL appending(action.Action_id) service call
      $rootScope.LoadEditdata(); //page reload
    });
    //---------------------ENO get_mm_ActionEdit-----------
    //---------------------STO mm_action_Update----------
    $scope.mm_action_Update = function(action) {
        MeetingService.get_mm_ActionEditUpdate(action).success(function(data) { //meeting Minutes action edit service call
          $rootScope.LoadEditdata();
        })
        $modalInstance.close();
      }
      //---------------------ENO mm_action_Update----------

    //----------- STO calender------------
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    //----------- ENO calender------------
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  })
  //-------------------------------ENO editActionController ----------------------------------
//=======================================================================================================================================


/* TAS App creation:
 *  This defines the Angular application which defines the dependent modules.
 *  This app depends on the following:
 *  -
 * Dependencies: This needs to be called after angular.js is included and first
 *               js of the TAS specific js code
 *               jquery.js
 *               angular.js
 *               TAS_app.js
 */

/* Home controller : index.html */

(function () {
    'use strict';

    angular.module(tasAppObj.id)
            .controller('loginCtrl', loginCtrl);


    loginCtrl.$inject = ['$rootScope', '$scope', '$uibModal', '$location', '$window', 'toaster', '$timeout', 'TasAppSrv', 'SessionService'];
    function loginCtrl($rootScope, $scope, $uibModal, $location, $window, toaster, $timeout, TasAppSrv, SessionService) {

        $scope.loginModel = {};
        $scope.loginModel.loginUser = loginUser;


        var sessionvalue = sessionStorage.getItem("data");
        if (sessionvalue != null) {
            $location.path('/dashboard');
        }
        function loginUser(loginData) {
            if (loginData) {
                if (loginData.un && loginData.pw && loginData.un.length > 1 && loginData.pw.length > 3) {


                    var key = "this is a 24 byte key !!";
                    //var message = userData.pw;
                    //var ciphertext = des(key, message, 1, 0);
                    var ciphertext = des(key, loginData.pw, 1, 0);
                    loginData.pw = stringToHex(ciphertext);

                    //loginData.password = stringToHex(ciphertext);
                    console.log(loginData.pw);
                    //userData.pw  = Base64.encode(userData.pw)
                    loginData.tkn = '';
                    $scope.appModel.isLoading = true;
                    TasAppSrv.login(loginData).success(function (data, status) {
                        if (data.err === false) {
                            $rootScope.coreModel.isLogged = true;
                            $rootScope.coreModel.userData.token = data.token;
                            $rootScope.coreModel.userData = {
                                id: data.user.id,
                                empWindowsId: data.user.empWindowsId,
                                empFname: data.user.empFname,
                                empLname: data.user.empLname,
                                empHomeLocName: data.user.empHomeLocName,
                                empHomeLocNameId: data.user.empHomeLocName,
                                empEmailId: data.user.empEmailId,
                                userId: data.user.empNo,
                                gender: data.user.empGender,
                                dept: data.user.empDepName,
                                token: data.token,
                                isApprover: data.approver
                            };
                            SessionService.create($rootScope.coreModel.userData);
                            //tasAppObj.userStorage.setItem(tasAppObj.userKey, JSON.stringify(sessObj.userData));
                            $rootScope.coreModel.isLogged = true;
                            $scope.appModel.loader();
                            $location.path('/dashboard/form');

                        } else {
                            toaster.pop("error", data.msg);
                        }
                    }).error(function (data, status) {
                        //alert("Please Check the Details");
                        toaster.pop("error", data.msg);
                        console.log(data, "Failed to retrieve data from backend... Please try after sometime");
                    });
                } else {
                    toaster.pop("error", "Please fill require feild");
                    //alert("Please fill require feild");
                }
            } else {
                toaster.pop("error", "Please fill require feild");
//                /alert("Please fill require feild");
            }


        }

        var Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = Base64._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + this._keyStr.charAt(enc1) +
                            this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3)
                            + this._keyStr.charAt(enc4);

                }

                return output;
            },
            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0;n < string.length;n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },
        }
    }

})();



=======location finder=========

      function getLocation(val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        }
       
       
=======================================Log out section===========



/* TAS App creation:
 *  This defines the Angular application which defines the dependent modules.
 *  This app depends on the following:
 *  -
 * Dependencies: This needs to be called after angular.js is included and first
 *               js of the TAS specific js code
 *               jquery.js
 *               angular.js
 *               TAS_app.js
 */

/* Home controller : index.html */

(function () {
    'use strict';

    angular.module(tasAppObj.id)
            //           .factory('TasAuthInterceptor', TasAuthInterceptor)
            //           .config(TasAuthConfig)
            .controller('TasAppCtrl', TasAppCtrl)
            .factory('SessionService', SessionService);


    TasAppCtrl.$inject = ['$rootScope', '$scope', '$uibModal', '$location', '$window', 'toaster', '$timeout', 'TasAppSrv', 'SessionService'];
    function TasAppCtrl($rootScope, $scope, $uibModal, $location, $window, toaster, $timeout, TasAppSrv, SessionService) {

        $scope.appModel = {};
        $scope.appModel.logout = logout;
        //$scope.appModel.createObj = createObj;
        $scope.appModel.loadEmp = loadEmp;

        $scope.appModel.isLoading = true;
        $scope.appModel.loader = changeLoader;

        $scope.appModel.taOptions = [
            ['h1', 'h2', 'h3'],
            ['bold', 'italics', 'underline'],
//            ['justifyLeft', 'justifyCenter', 'justifyRight'],
//            ['ul', 'ol']
        ];


        $rootScope.coreModel = {};
        $rootScope.coreModel.userData = {
            id: "",
            empWindowsId: "",
            empFname: "",
            empLname: "",
            empHomeLocName: "",
            empHomeLocNameId: "",
            empEmailId: "",
            userId: "",
            gender: "",
            dept: "",
            empDesgName: "",
            token: ""
        };
        $rootScope.coreModel.isLogged = false;

        $scope.appModel.employeeMenu = [

            {
                menuName: "My Travel",
                iconName: "soap-icon-plane",
                state: "dashboard.form",
                RESPONSE: 4,
                REQUEST: 2
            },
            {
                menuName: "Reports",
                iconName: "soap-icon-businessbag",
                state: "dashboard.reports",
            },
            {
                menuName: "Help",
                iconName: "soap-icon-user",
                state: "dashboard.help"
            }
        ];
        $scope.appModel.approverMenu = [

            {
                menuName: "My Travel",
                iconName: "soap-icon-plane",
                state: "dashboard.form",
                RESPONSE: 4,
                REQUEST: 2
            },
            {
                menuName: "Travel Approval",
                iconName: "soap-icon-departure",
                state: "dashboard.appForm",
                REQUEST: 5,
                RESPONSE: 3
            },
            {
                menuName: "Reports",
                iconName: "soap-icon-businessbag",
                state: "dashboard.reports",
            },
            {
                menuName: "Help",
                iconName: "soap-icon-user",
                state: "dashboard.help"
            }
        ];
        //$scope.appModel.menu  = ($rootScope.coreModel.userData.isApprover ? approverMenu : employeeMenu)


        function changeLoader() {
            $timeout(function () {
                $scope.appModel.isLoading = false;
            }, 3000);
        }

        function changeLoaderFast() {
            $timeout(function () {
                $scope.appModel.isLoading = false;
            }, 500);
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            console.log("stateChangeStart" + toState);
            //if (toState.name == 'state.with.resolve') {
            $scope.appModel.isLoading = true;

            console.log("I am called to spin");
            //$scope.showSpinner();  //this is a function you created to show the loading animation
            //}
        });

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //if (toState.resolve) {
            //    $scope.appModel.isLoading = false;
            changeLoaderFast();
            console.log("I am called to stop spin");
            //}
        });




        function logout() {
            $scope.appModel.isLoading = true;
            TasAppSrv.logout().success(function (data, status) {
                $rootScope.coreModel.isLogged = false;
                SessionService.destroyObj();
                $location.path('/login');

            }).error(function (data, status) {
                $rootScope.coreModel.isLogged = false;
                SessionService.destroyObj();
                $location.path('/login');

            });

        }

        /*
         * for geeting employeee ID alone in Array format
         */
        function loadEmp(val1) {
            var v2 = [];
            angular.forEach(val1, function (value, key) {
                if (value.empId)
                    v2.push(value.empId);
            }, v2);
            return v2;
        }
        /*
         * getting approver
         */
         function getApprover(){
            TasAppSrv.getApprover().success(function (data, status) {
                $scope.appModel.approverList = data.approvers;
                $scope.appModel.passportDetails = data.passportInfo;
            }).error(function (data, status) {

            });
        }
        (function isLogin() {
            if (JSON.parse(tasAppObj.userStorage.getItem(tasAppObj.userKey))){
                SessionService.create(JSON.parse(tasAppObj.userStorage.getItem(tasAppObj.userKey)));
                getApprover()

            }
            else
                $location.path('/login')

        })();

        /*
         * for help Tab
         */
        $scope.appModel.tab = 1;
        $scope.appModel.setTab = function (tabId) {
            $scope.appModel.tab = tabId;
        };
        $scope.appModel.isSet = function (tabId) {

            return $scope.appModel.tab === tabId;
        };

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

    angular.module(tasAppObj.id)
            .factory('myInterceptor', ['$log', '$rootScope', 'SessionService', function ($log, $rootScope, SessionService) {
                    $log.debug('$log is here to show you that this is a regular factory with injection');
                   // console.log(SessionService.userData.token);
                    var myInterceptor = {
                        request: function (config) {

                            if (!SessionService.anonymous) {
                                config.headers[tasAppObj.tokenKey] = SessionService.userData.token;
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
        if (angular.isDefined(tasAppObj.userStorage.getItem(tasAppObj.userKey)) &&
                tasAppObj.userStorage.getItem(tasAppObj.userKey) != null) {
            sessObj.userData = JSON.parse(tasAppObj.userStorage.getItem(tasAppObj.userKey));
            console.log("CartSess: I am here");
            if (sessObj.userData == null)
                sessObj.userData = {};
            if (sessObj.userData.token != null) {
                sessObj.anonymous = false;
            }
        }

        return sessObj;

        function createObj(userData) {
            console.log("CartSess:createObj: " + userData.id);
           // console.log(userData);
            sessObj.userData.id = userData.id;
            sessObj.userData.roles = userData.roles;
            sessObj.userData.empDesgName = userData.empDesgName;
            sessObj.userData.empWindowsId = userData.empWindowsId;
            sessObj.userData.empid = userData.empid;
            sessObj.userData.empFname = userData.empFname;
            sessObj.userData.empLname = userData.empLname;
            sessObj.userData.empEmailId = userData.empEmailId;
            sessObj.userData.empHomeLocName = userData.empHomeLocName;
            sessObj.userData.token = userData.token;
            sessObj.userData.isApprover = userData.isApprover




            $rootScope.coreModel.userData.empWindowsId = userData.empWindowsId;
            $rootScope.coreModel.userData.id = userData.id;
            $rootScope.coreModel.userData.empFname = userData.empFname;
            $rootScope.coreModel.userData.empLname = userData.empLname;
            $rootScope.coreModel.userData.empEmailId = userData.empEmailId;
            $rootScope.coreModel.userData.empHomeLocName = userData.empHomeLocName;
            $rootScope.coreModel.userData.token = userData.token
            $rootScope.coreModel.userData.isApprover = userData.isApprover;

            console.log("CartSess:createObj: Taking from localStorage to coreModel(userData)");

            sessObj.anonymous = false;
            /*
             if (angular.isDefined( tasAppObj.userStorage.getItem( tasAppObj.userKey)) &&
             tasAppObj.userStorage.getItem( tasAppObj.userKey) != null) {
             */
            if (sessObj.userData != null) {

                //set the browser session, to avoid relogin on refresh
                tasAppObj.userStorage.setItem(tasAppObj.userKey, JSON.stringify(sessObj.userData));

                if (angular.isDefined(tasAppObj.userStorage.getItem(tasAppObj.userKey))) {
                    sessObj.userData = JSON.parse(tasAppObj.userStorage.getItem(tasAppObj.userKey));
                    console.log(sessObj.userData);
                    $rootScope.coreModel.userData.empWindowsId = sessObj.userData.empWindowsId;
                    $rootScope.coreModel.userData.id = userData.id;
                    $rootScope.coreModel.userData.empFname = sessObj.userData.empFname;
                    $rootScope.coreModel.userData.empLname = sessObj.userData.empLname;
                    $rootScope.coreModel.userData.empEmailId = sessObj.userData.empEmailId;
                    $rootScope.coreModel.userData.empHomeLocName = sessObj.userData.empHomeLocName;
                    $rootScope.coreModel.userData.token = sessObj.userData.token;
                    $rootScope.coreModel.userData.isApprover = userData.isApprover;

                }
            }
        }

        function destroyObj() {

            $rootScope.coreModel.userData.id = null;
            $rootScope.coreModel.userData.roles = null;
            $rootScope.coreModel.userData.empWindowsId = null;
            $rootScope.coreModel.userData.empid = null;
            $rootScope.coreModel.userData.empFname = null;
            $rootScope.coreModel.userData.empLname = null;
            $rootScope.coreModel.userData.empEmailId = null;
            $rootScope.coreModel.userData.token = null;
            $rootScope.coreModel.userData.empHomeLocName = null;
            $rootScope.coreModel.userData.empDesgName = null;
            $rootScope.coreModel.isLogged = false;
            $rootScope.coreModel.isApprover = null;
            // Clear the browser session, to avoid session availability
            tasAppObj.userStorage.removeItem(tasAppObj.userKey);
            console.log("TasSess:destroyObj: Clear user data sess and sessionStorage");

            sessObj.userData.id = null;
            sessObj.userData.roles = null;
            sessObj.userData.empWindowsId = null;
            sessObj.userData.empid = null;
            sessObj.userData.empFname = null;
            sessObj.userData.empLname = null;
            sessObj.userData.empEmailId = null;
            sessObj.userData.token = null;
            sessObj.userData.empHomeLocName = null;
            sessObj.userData.empDesgName = null;
            sessObj.anonymous = true;
            // Clear the browser session, to avoid session availability
            tasAppObj.userStorage.removeItem(tasAppObj.userKey);
            console.log("CartSess:destroyObj: Clear user data sess and sessionStorage");
        }

    }

    ////////////////// END OF Authentication Session Service /////////////////////////////////
})();