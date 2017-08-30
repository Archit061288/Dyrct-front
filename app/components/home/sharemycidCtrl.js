define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('sharemycidCtrl', ['$scope', '$rootScope','$uibModal', 'selectedShareData', '$location', 'check', 'id', '$uibModalInstance', 'dyrctservice', '$filter','$cookieStore','$filter','$timeout','GLOBALS',
        function($scope, $rootScope,$uibModal, getUserContactData, $location, check, id, $uibModalInstance, dyrctservice, $filter,$cookieStore,$filter,$timeout,GLOBALS){
            $scope.selectedAll = false;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.checktype = check;
            $scope.id = id;
            $scope.route1=true;
            $rootScope.$broadcast("route1home",$scope.route1);
            //console.log($scope.id,$scope.checktype);
            $scope.usercontects = getUserContactData.data;
            //$scope.userpoi = getUserContactData.data.data.allPoi;
            //$scope.userrecenttrip = getUserContactData.data.data.allRecentTrip[0];
            // $scope.userSearch = function(q) {
            //     $rootScope.$broadcast("userSearch", q);
            // }
            angular.forEach($scope.usercontects, function (user) {
                        
                            if (user.checked) {
                                user.checked = false;

                            }

                       
                    });
            $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
        
            $scope.$watch('search.searchName', function(newVal) {
                
                $scope.productsss = $filter('searchdata')($scope.usercontects, newVal,'firstName,lastName');
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

            if ($scope.checktype == 'mycid') {

                $scope.selectAll = function() {
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function(user) {
                        if (user.isUsingDYRCT == 'true') {
                            user.checked = true;
                            if (user.checked) {
                                $scope.contact.push(user.contact_id);

                            }

                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                };
                $scope.deselectAll = function() {
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function(user) {
                        if (user.isUsingDYRCT == 'true' ) {
                            user.checked = false;
                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                };
                $scope.checkedItems = function() {
                    $scope.contact = [];
                    angular.forEach($scope.usercontects, function(user) {
                        if (user.isUsingDYRCT == 'true') {
                            if (user.checked) {
                                $scope.contact.push(user.userId);
                            }

                        }
                    });
                    $scope.contactid = $scope.contact.toString();
                    //$scope.contact = [];
                }

                $scope.selecteduser = function() {
                    return $filter('filter')($scope.usercontects, {checked: true});
                };

                $scope.share = function() {
                    //console.log($scope.contactid,"here");
                    if (!$scope.contactid) {
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
                        "receivers_id": $scope.contactid,
                        "type": "contact",
                        "type_id": $scope.MyCID._id.$id
                    }
                    dyrctservice.post(poidata, function(success) {
                        if(success.data.message == 'Contact shared successfully.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Contact shared successfully.';
                        }
                    }
                });
                
                        } 
                        $uibModalInstance.close();
                    }, function(error) {
                        console.log(error);
                    });
                }

            }


            $scope.cancel = function() {
                $scope.contact = [];
                    angular.forEach($scope.usercontects, function (user) {
                        //console.log(user,"here")
                        if (user.isUsingDYRCT == 'true' && $scope.id != user.contact_id) {
                            if (user.checked) {
                                //console.log(user,"i")
                                user.checked = false;

                            }

                        }
                       // console.log($scope.contact);
                    });
               $uibModalInstance.dismiss('cancel');
            };
        }]);
});
