define(['angularAMD', 'components/mycid/addnewpersonalCtrl', 'components/mycid/editnewpersonalCtrl','components/mycid/welcomeCtrl', 'angular-socialshare'], function (angularAMD) {

    angularAMD.controller('mycidCtrl', ['$scope','$rootScope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModal', '$window', 'modifires','GLOBALS',
        function ($scope, $rootScope, authService, dyrctservice, $cookieStore, $state, $stateParams, $uibModal, $window, modifires,GLOBALS) {
           // $scope.openModalwelcome();
           
            $('body').click(function () {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            var data = {};
            
             if($rootScope.userinactive==false)
            {
                $("li.home").removeClass("disabled");
                $("li.logBook").removeClass("disabled");
                $("li.groups").removeClass("disabled");
                $("li.folders").removeClass("disabled");
                $("li.settings").removeClass("disabled");
                $("li.mbmenu-notification").removeClass("disabled");
            }
            $scope.hidepersonal = false;
            var personaladd = {};
            var privateadd = {};
            $rootScope.openclass = false;
            $rootScope.topsearch = false;
            $scope.animationsEnabled = true;
            $scope.mycid = $cookieStore.get('_qu');

            data.post_data_string = {"method": "getUserGLC", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token}

            dyrctservice.post(data, function (success) {
                //console.log(success);
                if(success.data[0].status=="inactive")
                {
                    $state.go('main.root');
                }
                $scope.editadd = success.data[0];
                
                
                            
//                $scope.editadd.address = $scope.editadd.address.substring(0,($scope.editadd.address.indexOf($scope.editadd.city)-2))//.replace($scope.editadd.city,"").replace($scope.editadd.state,"").replace($scope.editadd.country,"").replace($scope.editadd.zipcode,"").replace(',',"");
                
                //console.log($scope.editadd.address);
                $scope.personaladd = success.data[0].private_address;
                //console.log($scope.personaladd);
                
//                $scope.privateadd = success.data[0].public_address;
//                //console.log($scope.privateadd);
//                if ($scope.privateadd.length == 0)
//                {
//                    $scope.hideprivate = true;
//                }
//                if ($scope.personaladd.length == 0)
//                {
//                    $scope.hidepersonal = true;
//                }

                //console.log($scope.editadd);
            }, function (error) {

                console.log(error);

            });
//            $scope.deleteaddress = function(addressid) {
//                var index = $scope.privateadd.indexOf(addressid);
//                $scope.bdays.splice(index, 1);
//            }

            $scope.openModalshare = function (name) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/mycid/addnewpersonal.html",
                    controller: "addnewpersonalCtrl",
                    size: 'lg',
                    resolve: {
                        name: function () {
                            return name;
                        }

                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    //$uibModalInstance.dismiss('cancel');
                    data.post_data_string = {"method": "getUserGLC", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token}
                    dyrctservice.post(data, function (success) {
                        modifires.getglc().then(function (data) {

                            $scope.editadd = success.data[0];
                            $scope.personaladd = success.data[0].private_address;
                            $scope.privateadd = success.data[0].public_address;
                            //console.log(data);
//                            $scope.editadd = data.data[0];
//                            $scope.personaladd = data.data[0].private_address;
//                            $scope.privateadd = data.data[0].private_address;
                            
                        }, function () {
                            console.log('error')
                        })
                    }, function (error) {

                        console.log(error);

                    });

                }, function () {

                    //$window.location.reload();
                    //$log.info('Modal dismissed at: ' + new Date());
                });


            }
            console.log($rootScope.welcome,"wlcom")
            if($rootScope.welcome)
            {
            $scope.openModalwelcome = function () {
                //console.log(name);

                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/mycid/welcome.html",
                    controller: "welcomeCtrl",
                    resolve: {
                        
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    
                }, function () {

                });

            };
            $scope.openModalwelcome();
            $rootScope.welcome=false;
            }
            
          
            
            $scope.editopenModalshare = function (name, id, company_name, email, phone, address, country, state, city, location, zipcode) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/mycid/editnewpersonal.html",
                    controller: "editnewpersonalCtrl",
                    size: 'lg',
                    resolve: {
                        addid: function () {
                            return id;
                        },
                        name: function () {
                            return name;
                        },
                        companyname: function () {
                            return company_name;
                        },
                        email: function () {
                            return email;
                        },
                        phonenumber: function () {
                            return phone;
                        },
                        personaladdress: function () {
                            return address;
                        },
                        country: function () {
                            return country;
                        },
                        state: function () {
                            return state;
                        },
                        city: function () {
                            return city;
                        },
                        location: function () {
                            return location;
                        },
                        zipcode: function () {
                            return zipcode;
                        }

                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    //$uibModalInstance.dismiss('cancel');
                    data.post_data_string = {"method": "getUserGLC", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token}
                    dyrctservice.post(data, function (success) {
                        modifires.getglc().then(function (data) {

                            $scope.editadd = success.data[0];
                            $scope.personaladd = success.data[0].private_address;
                            $scope.privateadd = success.data[0].public_address;
                            //console.log(data);
//                            $scope.editadd = data.data[0];
//                            $scope.personaladd = data.data[0].private_address;
//                            $scope.privateadd = data.data[0].private_address;
                            
                        }, function () {
                            console.log('error')
                        })

                    }, function (error) {

                        console.log(error);

                    });
                }, function () {

                    //$window.location.reload();
                    //$log.info('Modal dismissed at: ' + new Date());
                });


            }

            $scope.openview = function (addoption)
            {
                if (addoption == "private")
                {
                    $scope.hidepersonal = true;
                }
                if (addoption == "public")
                {
                    $scope.hideprivate = true;
                }

            }

            $scope.delete = function (type, addid)
            {

                if (confirm('Do you want to delete this address. ?')) {
                    
                    data.post_data_string = {"method": "addPublicAndPrivateAddress", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token, "type": "delete", "address_id": addid, "address_type": type}

                    dyrctservice.post(data, function (success) {
                        modifires.getglc().then(function (data) {
                            $scope.editadd = data.data[0];
                            $scope.personaladd = data.data[0].private_address;
                            $scope.privateadd = data.data[0].public_address;
                        }, function (error) {
                        })
                    }, function (error) {

                        console.log(error);

                    });
                }
            }

            $scope.editcid = function ()
            {
                $rootScope.mapattr = true;
                $state.go("common.editcid");

//                


            }
            $scope.toogleselect = function ()
            {
                $scope.hidepersonal = !$scope.hidepersonal;
            }

            $scope.tooglehideselect = function ()
            {
                $scope.hideprivate = !$scope.hideprivate;
            }
           
           

        }]);

});

