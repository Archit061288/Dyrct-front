define(['angularAMD', 'components/setting/blockusersCtrl', 'components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('settingCtrl', ['$scope', '$rootScope', '$location', '$uibModal', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'GLOBALS', '$window', '$cookieStore', 'getDefaultUseSetting', 'modifires',
        function ($scope, $rootScope, $location, $uibModal, authService, dyrctservice, $cookieStore, $state, $stateParams, GLOBALS, $window, $cookieStore, getDefaultUseSetting, modifires) {
            //console.log(getDefaultUseSetting)
            if (getDefaultUseSetting.data.isInvalidUser == "true")
            {
                $state.go('main.root');
            }
            $rootScope.$emit("notificationservice")
            $scope.defaultusersetting = getDefaultUseSetting.data;
            $scope.searchmap = "Map";
            $scope.defaultaddress = "both";
            $scope.showprofile = "true".toString();
            //console.log($scope.defaultusersetting);
            $('body').click(function () {
                $('body').find('div.modal-backdrop').remove();
            });
            $scope.route1 = true;
            $rootScope.$broadcast("route1setting", $scope.route1);

            $rootScope.openclass = false;
            $rootScope.topsearch = false;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.searchmap = $scope.defaultusersetting.default_search;
            $scope.defaultaddress = $scope.defaultusersetting.default_address;
            $scope.showprofile = $scope.defaultusersetting.profile_visibilty_flag.toString();
            //console.log($scope.showprofile);
            $scope.resetsetting = function ()
            {
                modifires.getusersetting().then(function (data) {
                    //console.log(data)
                    $scope.searchmap = data.data.default_search;
                    $scope.defaultaddress = data.data.default_address;
                    $scope.showprofile = data.data.profile_visibilty_flag;
                    //console.log("success")
                }, function () {
                    console.log('error')
                })
//                $scope.searchmap = $scope.defaultusersetting.default_search;
//                $scope.defaultaddress = $scope.defaultusersetting.default_address;
//                $scope.showprofile = $scope.defaultusersetting.profile_visibilty_flag;
            }
            $scope.contacterror = false;
            $scope.settingpassword = function () {
                
                //console.log("here");
                if ((!$scope.newpassword || $scope.newpassword == '') || (!$scope.oldpassword || $scope.oldpassword == '') || (!$scope.password_c || $scope.password_c == '')) {
                    $scope.contacterror = true;
                }
                if ((!$scope.newpassword || $scope.newpassword == '') || (!$scope.oldpassword || $scope.oldpassword == '') || (!$scope.password_c || $scope.password_c == '')) {
                    return false;
                }
                var setting = {}
                //console.log("here1");
                setting.post_data_string = {
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "method": "setWebUserPin",
                    "confirm_password": $scope.password_c,
                    "password": $scope.newpassword,
                    "flag": "true",
                    "old_password": $scope.oldpassword
                }
                dyrctservice.post(setting, function (success) {
                    $scope.contacterror = false;
                    $scope.msgerror = false;
                    if (success.settings.message == 'Empty Old Password.')
                    {
                        $scope.msgerror = true;
                        $scope.message = "Empty old password."
                        //console.log($scope.message, $scope.msgerror)
                    }
                    if (success.settings.message == 'Not match old password.')
                    {
                        $scope.msgerror = true;
                        $scope.message = "Not match old password."
                    }
                    if (success.settings.message == 'Password set successfully.')
                    {
//                        alert('Password set successfully.');
                        var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Password set successfully.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                }, function (error) {


                    console.log(error);
                });
            }
            $scope.openModalblockuser = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/setting/blockuser.html",
                    controller: 'blockusersCtrl',
                    resolve: {}
                });

            };
            $scope.openModalaboutus = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/setting/aboutus.html",
                    controller: '',
                    resolve: {}
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    modalInstance.dismiss();
                    //$log.info('Modal dismissed at: ' + new Date());
                });

            };

            $scope.togglepassword = function () {
                $scope.passwordsetting = !$scope.passwordsetting;
            }
            $scope.defaultAddressService = function () {
                var defaultaddress = {};
                defaultaddress.post_data_string = {
                    "method": "defaultAddressService",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "defaultAddressFlag": $scope.defaultaddress
                }
                dyrctservice.post(defaultaddress, function (success) {

                }, function (error) {
                    console.log(error);
                });
            };
            $scope.setProfileVisibiltyFlag = function () {
                var setProfileVisibiltyFlag = {};
                setProfileVisibiltyFlag.post_data_string = {
                    "method": "setProfileVisibiltyFlagService",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "ProfileVisibiltyFlag": $scope.showprofile
                }
                dyrctservice.post(setProfileVisibiltyFlag, function (success) {

                }, function (error) {
                    console.log(error);
                });
            };
            $scope.setdefaultSearch = function () {
                var setdefaultSearch = {};
                setdefaultSearch.post_data_string = {
                    "method": "setdefaultSearchService",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "ProfileVisibiltyFlag": $scope.searchmap
                }
                dyrctservice.post(setdefaultSearch, function (success) {

                }, function (error) {
                    console.log(error);
                });
            };

            $scope.savesetting = function () {
                $scope.setProfileVisibiltyFlag();
//                    $scope.defaultAddressService();
                    $scope.setdefaultSearch();
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function () {
                            return 'Setting changed successfully.';
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    
                }, function () {
                    console.log("cancel")

                });
            };


        }]);

});

