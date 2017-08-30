define(['angularAMD','components/userlogin/userloginCtrl'], function(angularAMD) {

    angularAMD.controller('usersignupCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModalInstance', 'getcountrydata','$uibModal',
        function($scope, authService, dyrctservice, $cookieStore, $state, $stateParams, $uibModalInstance, getcountrydata,$uibModal) {
            $scope.countrydata = getcountrydata.data;
            $scope.showdiv = true;
            $scope.showlogin = false;
            $scope.login = function() {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/userlogin/userlogin.html",
                    controller: "userloginCtrl",
                    size: 'lg',
                    resolve: {
                        getcountrydata: function(modifires, $stateParams) {
                            return modifires.getcountry();
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    //$log.info('Modal dismissed at: ' + new Date());
                });


            }
            $scope.loginregister = function(forgotsign) {

                $scope.showlogin = false;
                $scope.forgott=forgotsign;
            }
            
            $scope.signupregister = function() {
                //console.log("call")
               // $scope.activeTab = 'active';
                $scope.showlogin = true;
//                $scope.showsignup = false;
//                console.log($scope.showsignup,$scope.showlogin);
}
            $scope.generatecode = function()
            {
                if (!$scope.phonenumber) {

                }
                var data = {};
                //$scope.cc = '+' + $scope.countrycode;
                data.post_data_string = {"method": "webotpVerification", "country_code": $scope.selectedcountry.d_code, "country": $scope.selectedcountry.name, "phone": $scope.phonenumber, "otp_verified": "false"}
                dyrctservice.get(data, function(success) {

                    if (success.settings.message == 'Not valid phone number.') {
                        $scope.error = true;
                        $scope.errormessage = "Not valid phone number.";
                    }
                    else if (success.settings.message == 'You have already registered with DYRCT. Use the pin for login to DYRCT')
                    {
                        $scope.error = true;
                        $scope.errormessage = "You have already registered with DYRCT. Use the pin for login to DYRCT";
                    }
                    else {
                        $scope.error = false;
                        $scope.hidediv();
                        $scope.footerbtn = true;
                    }

                    //data.post_data_string={"method":"webotpVerification","country_code":$scope.countrycode,"country":$scope.country,"phone":$scope.phonenumber,"otp_verified":"false"}    

                    //$cookieStore.put('_qu',success.data);

                }, function(error) {
                    console.log(error);

                });


            };

            $scope.usersignup = function()
            {

                var data = {};
                data.post_data_string = {"method": "webotpVerification", "country_code": $scope.selectedcountry.d_code, "country": $scope.selectedcountry.name, "phone": $scope.phonenumber, "otp_verified": "true", "otp_code": $scope.otpcode, "user_pin": $scope.userpass}
                dyrctservice.get(data, function(success) {

                    if (success.settings.message == 'Incorrect OTP code.')
                    {
                        $scope.errorr = true;
                        $scope.errormessage = "Incorrect OTP code.";
                    }
                    else
                    {
                        $uibModalInstance.dismiss('cancel');
                        $scope.cookie = $cookieStore.put('_qu', success.data);
                        $state.go("common.usercid", {id: success.data.userId});
                    }

                }, function(error) {
                    console.log(error);
                });


            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.hidediv = function() {
                $scope.showdiv = !$scope.showdiv;

            };


            $scope.selectcountryViaCode = function(data) {
                $scope.open = false;
                for (var i = 0; i < $scope.countrydata.length; i++) {
                    if (data == $scope.countrydata[i].d_code) {
                        $scope.selectedcountry = $scope.countrydata[i];
                        return;
                    }
                }
                $scope.selectedcountry = {name: "select country"};

            }

            $scope.open = false;
            $scope.selectedcountry = {name: "select country"};
            $scope.toggleselect = function() {
                $scope.open = !$scope.open;
            }

            $scope.selectcountry = function(country) {
                $scope.toggleselect();
                $scope.selectedcountry = country;
                $scope.countrycode = country.d_code;
            }

        }]);

});

