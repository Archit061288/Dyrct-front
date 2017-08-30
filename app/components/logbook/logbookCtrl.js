define(['angularAMD', 'components/logbook/movelogbookCtrl', 'components/logbook/exportlogbookCtrl'], function (angularAMD) {

    angularAMD.controller('logbookCtrl', ['$scope', '$rootScope', 'authService', '$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'GLOBALS', '$window', 'fileUpload', 'getlogbookData', 'modifires','$filter',
        function ($scope, $rootScope, authService, $uibModal, dyrctservice, $cookieStore, $state, $stateParams, GLOBALS, $window, fileUpload, getlogbookData, modifires,$filter) {
            $scope.search = {"searchName": ""};
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $rootScope.$emit("notificationservice")
            $scope.route1=true;
            $rootScope.$broadcast("route1log",$scope.route1);
            $rootScope.openclass = false;
            $rootScope.topsearch = true;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.categoryIndexKey = [];
            $scope.showme = false;
            $scope.showmee = true;
            var data = {};
            $scope.animationsEnabled = true;
            $scope.userid = $scope.MyCID._id ? $scope.MyCID._id.$id : $scope.MyCID.allData[0]._id.$id;
            $scope.web_token = $scope.MyCID.web_token ? $scope.MyCID.web_token : $scope.MyCID.allData[0].web_token;
            $scope.cookie = $cookieStore.get('_qu');
            $scope.getlogbook = getlogbookData.data;
            ga("send", "event", {eventCategory: "Logbook", eventAction: "Logbook Usage", eventLabel: "Logbook", userId: $scope.userid});
             if($scope.getlogbook.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            
            $scope.checkLength = function (newVal) {
               
                $scope.productsssnew = $filter('searchdata')($scope.getlogbook, newVal, 'title,start_address')?$filter('searchdata')($scope.getlogbook, newVal, 'title,start_address'):[];
                $scope.productsss=[];
                for (var i = 0; i < $scope.productsssnew.length; i++) {
                    if($scope.productsssnew[i].category_id == 0){
                        $scope.productsss.push($scope.productsssnew[i]);
                    }
                }
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
            }
            
            $rootScope.$on("userSearch", function (event, data) {


                $scope.search.searchName = data;
                // console.log("++" + $scope.search.searchName);
            })
            $scope.$watch('search.searchName', function (newVal) {
                $scope.checkLength(newVal);


                //console.log(newVal)
                //$scope.products_new.push()
            });
            $scope.checkedItems = function (_id) {
                $scope.category = [];

                var flag = false;
                angular.forEach($scope.getlogbook, function (user) {
                    if (user.checked) {
                        flag = true;
                        $scope.category.push(user._id);

                    }
                    if (flag) {
                        $scope.showme = true;
                    } else {
                        $scope.showme = false;
                    }

                });
                $scope.categoryId = $scope.category.toString();
                $scope.categoryIndexKey.push(_id);
            }
//            $scope.stateChanged = function () {
//                var flag = false;
//                angular.forEach($scope.getlogbook, function (log) {
//                    if (log.selected)
//                    {
//                        flag = true;
//                    }
//
//                });
//                if (flag) {
//                    $scope.showme = true;
//                } else {
//                    $scope.showme = false;
//                }
//            }

            $scope.openModalExportCsv = function (check) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/logbook/export-logbook.html",
                    controller: "exportlogbookCtrl",
                    size: 'lg',
                    resolve: {
                        getlogbookdetail: function () {
                            return getlogbookData;
                        },
                        getCategorylistData: function (modifires, $stateParams) {
                            return [];
                        },
                        check:function(){
                            return check;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                  
                }, function () {
                  console.log('error')
                });

            }

            $scope.openModalshare = function (check) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/logbook/movelogbook.html",
                    controller: "movelogbookCtrl",
                    size: 'lg',
                    resolve: {
                        getCategorylistData: function (modifires, $stateParams) {
                            return modifires.getCategory();
                        },
                        getarrayvalue: function () {
                            return $scope.categoryId
                        },
                        getlogbookdetail: function () {
                            return getlogbookData;
                        },
                        check:function(){
                            return check;
                        },
                        ids:function(){
                            return [];
                        }

                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;

                    modifires.getlogbook().then(function (data) {
                        //console.log(data);
                        $scope.getlogbook = data.data;
                        $scope.checkLength("");
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })

                }, function () {
                    // if (clickType == 'cancel') {


//                        $scope.getlogbookCopy = [];
//                        angular.forEach($scope.getlogbook, function (user, i) {
//                            if ($scope.categoryIndexKey.indexOf(user._id) == '-1') {
//                               
//                                $scope.getlogbookCopy.push($scope.getlogbook[i]);
//                            }
//                    });
//                        $scope.getlogbook = $scope.getlogbookCopy;  
//                        $scope.showme = false;

                    // }

                    //$window.location.reload();
                    //$log.info('Modal dismissed at: ' + new Date());

                });


            }
            $scope.deletelogbooktripdetail = function (id,name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Are you sure, Do you want to delete this Trip?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    var tripdetail = {};
                    tripdetail.post_data_string = {
                        "method": "deletelogbook",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "logbookid": id
                    }
                    dyrctservice.post(tripdetail, function (success) {
                        modifires.getlogbookdata().then(function (data) {
                            $scope.getlogbook = data.data;
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                        //$scope.getlogbook = success.data.data
                    }, function (error) {
                        console.log(error);
                    });
                    
                }, function() {
                    console.log("cancel")

                });
            }



        }]);

});

