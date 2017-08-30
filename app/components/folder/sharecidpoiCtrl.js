define(['angularAMD'], function (angularAMD) {

    angularAMD.controller('sharecidpoiCtrl', ['$scope', '$rootScope', '$location', 'check', 'id', 'userid', '$uibModalInstance', 'dyrctservice', '$filter', '$window', '$cookieStore', '$filter','$timeout','modifires',
        function ($scope, $rootScope, $location, check, id, userid, $uibModalInstance, dyrctservice, $filter, $window, $cookieStore, $filter,$timeout,modifires) {
            $scope.selectedAll = false;
            $scope.userid = userid;
            modifires.getUserContacts().then(function(data) {
                
                $scope.usercontects = angular.copy(data.data.data.allContact[0]);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.checktype = check;
            $scope.id = id;
            $scope.route1=true;
            //console.log(check, id, userid,$scope.MyCID._id.$id)
            $rootScope.$broadcast("route1home",$scope.route1);
      
            $scope.search = {"searchName": ""};

            $scope.productsss = [];

            $scope.$watch('search.searchName', function (newVal) {

                $scope.productsss = $filter('searchdata')($scope.usercontects, newVal, 'firstName,lastName');
                if (($scope.productsss && $scope.productsss.length == 0))
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                    $scope.resultflag = false;
//                    }
                } else
                {
                    $scope.resultflag = true;
                }

                //console.log(newVal)
                //$scope.products_new.push()
            });


            if ($scope.checktype == 'CID') {

                $scope.selectAll = function () {
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            user.checked = true;
                            if (user.checked) {
                                $scope.contact.push(user.userId);

                            }

                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                };
                $scope.deselectAll = function () {
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            user.checked = false;
                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                };
                $scope.checkedItems = function () {
                    //console.log($scope.id);
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            if (user.checked) {
                                $scope.contact.push(user.userId);

                            }

                        }
                        else if (user.isUsingDYRCT == 'true') {
                            if (user.checked) {
                                $scope.contact.push(user.contact_id);

                            }

                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                }

                $scope.selecteduser = function () {
                    return $filter('filter')($scope.usercontects, {checked: true});
                };

                $scope.share = function () {
                    if (!$scope.contact) {
                         $('.transptant-overlay').fadeIn(3000);
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                         $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },2000)
                        return false;
                    }
                    var poidata = {};
//                if (type == 'add') {
                    //console.log($scope.location)
                    poidata.post_data_string = {
                        "method": "shareContactPoifolder",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "receivers_id": $scope.contactid,
                        "type": "cid",
                        "type_id": $scope.id
                    }
                    dyrctservice.post(poidata, function (success) {
                        $uibModalInstance.close()
                    }, function (error) {
                        console.log(error);
                    });
                }

            }
            if ($scope.checktype == 'POI') {

                //console.log($scope.checktype);
                $scope.selectAll = function () {
                    $scope.poi = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            user.checked = true;
                            if (user.checked) {
                                $scope.poi.push(user.userId);

                            }

                        }
                    });
                    $scope.poiId = $scope.poi.toString();
                };
                $scope.deselectAll = function () {
                    $scope.poi = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            user.checked = false;
                            if (user.checked) {
                                //$scope.poi.push(user.poi_id);

                            }

                        }
                    });
                    $scope.poiId = $scope.poi.toString();
                };
                $scope.checkedItems = function () {
                    $scope.poi = [];
                    angular.forEach($scope.usercontects, function (user) {
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            if (user.checked) {
                                $scope.poi.push(user.userId);

                            }

                        }
                    });
                    $scope.poiId = $scope.poi.toString();
                    //console.log($scope.poiId);
                    $scope.poi = [];
                }
                $scope.selecteduser = function () {
                    return $filter('filter')($scope.usercontects, {checked: true});
                };
                $scope.share = function () {
                    if (!$scope.poi) {
                         $('.transptant-overlay').fadeIn(3000);
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                         $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },2000)
                        return false;
                    }
                    var poidata = {};
//                if (type == 'add') {
                    //console.log($scope.location)
                    poidata.post_data_string = {
                        "method": "shareContactPoi",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "receivers_id": $scope.poiId,
                        "type": "poi",
                        "type_id": $scope.id
                    }
                    dyrctservice.post(poidata, function (success) {
                        $uibModalInstance.close();
                    }, function (error) {
                        console.log(error);
                    });
                }
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
});
