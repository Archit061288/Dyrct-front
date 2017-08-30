define(['angularAMD','components/groups/deletegroupCtrl','components/logbook/movelogbookCtrl', 'components/logbook/exportlogbookCtrl'], function (angularAMD) {

    angularAMD.controller('categoriesCtrl', ['$scope', '$rootScope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'fileUpload', 'getCategoryData', 'getlogbookData', '$window', 'modifires','$filter','$uibModal','GLOBALS','$analytics',
        function ($scope, $rootScope, authService, dyrctservice, $cookieStore, $state, $stateParams, fileUpload, getCategoryData, getlogbookData, $window, modifires,$filter,$uibModal,GLOBALS,$analytics) {
            $rootScope.$on("userSearch", function (event, data) {
                $scope.q = data;
            })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $rootScope.$emit("notificationservice")
            $scope.route1=true;
            $rootScope.$broadcast("route1log",$scope.route1);
            $rootScope.topsearch = true;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.getlogbooklist = getlogbookData.data;
            $scope.in = [];
            var data = {};
            $scope.active = [];
            $scope.readonly = [];
            $scope.cathide = true;
            $scope.category = [];
            $scope.edithide = [];
            $scope.userid = $scope.MyCID._id.$id;
            $scope.web_token = $scope.MyCID.web_token;
            $scope.cookie = $cookieStore.get('_qu');
            $scope.getcategorylist = getCategoryData.data;
           
            angular.forEach($scope.getcategorylist, function (p, i) {
                $scope.in[i] = false;
                $scope.active[i] = true;
                $scope.readonly[i] = true;
            });
            //console.log($scope.getlogbooklist);
            $scope.search = {"searchName": ""};
            $scope.checkLength = function (newVal) {
               //console.log(newVal,$scope.getcategorylist)
                $scope.productsss = $filter('searchdata')($scope.getcategorylist, newVal, 'category_name')?$filter('searchdata')($scope.getcategorylist, newVal, 'category_name'):[];
                //$scope.productsss=[];
                //console.log($scope.productsss)
                if(newVal==""){
                    $scope.productsss=$scope.getcategorylist;
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
                //console.log("++" + $scope.search.searchName);
            })
            $scope.$watch('search.searchName', function (newVal) {
                $scope.checkLength(newVal);


                //console.log(newVal)
                //$scope.products_new.push()
            });

            //console.log($scope.getcategorylist,'1');
            //console.log($scope.getlogbooklist,'2');
            angular.forEach($scope.getcategorylist, function (item1, i) {
                $scope.getcategorylist[i]['logbooklist'] = [];
                angular.forEach($scope.getlogbooklist, function (item2, j) {
                    if (item1._id == item2.category_id) {
                        //$scope.category.push({cat: item1._id,data:item2});
                        $scope.getcategorylist[i].logbooklist.push(item2);
                    }
                });
                //console.log($scope.getcategorylist);
            });

            $scope.toggleselect = function (index)
            {

                angular.forEach($scope.in, function (v, i) {
                    if (i == index) {
                        $scope.in[index] = !$scope.in[index];
                        $scope.active[i] = !$scope.active[i];
                    }
                    else {
                        $scope.in[i] = false;
                    }
                });

            }

            $scope.createnewcategory = function (open)
            {
                if (open == true)
                {
                    $scope.catdisabled = false;
                }
                else
                {
                    $scope.catdisabled = true;
                }
                $scope.cathide = open;
                $scope.categoryname = "";
            }

            $scope.savenewcategory = function ()
            {
                $scope.catdisabled = false;
                if ($scope.categoryname == '')
                {
                    var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Please enter category.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    return false;
                }
                data.post_data_string = {"method": "createcategory", "web_token": $scope.web_token, "userId": $scope.userid, "category_name": $scope.categoryname}

                dyrctservice.post(data, function (success) {

                    if (success.settings.message == "Invalid User")
                    {
                        $scope.successmessage = "Invalid user.";
                    }
                    else if (success.settings.message == "This Category already created for this user")
                    {
                        var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'This category already created for this user.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    else
                    {
                        //console.log(success);
                        $scope.getcategorylist.push(success.data[0]);
                        $scope.checkLength("");
                        $scope.active[$scope.getcategorylist.length - 1] = true;
                        $scope.edithide = false;
                        $scope.cathide = true;
                        $scope.readonly[$scope.getcategorylist.length - 1] = !$scope.readonly[$scope.getcategorylist.length - 1];

                    }
                }, function (error) {
                    console.log(error);
                });
            }

            $scope.editcategory = function (catid, index, cat)
            {
                //console.log(catid, index);
                $scope.edithide[index] = !$scope.edithide[index];
                //console.log($scope.edithide);
                $scope.readonly[index] = !$scope.readonly[index];

                cat.edit = true;


            }

            $scope.saveeditcategory = function (catlist, index, cat)
            {
                cat.edit = false;
                $scope.edithide[index] = !$scope.edithide[index];
                $scope.readonly[index] = !$scope.readonly[index];

                data.post_data_string = {"method": "editcategory", "web_token": $scope.web_token, "userId": $scope.userid, "category_id": catlist._id, "category_name": catlist.category_name}
                dyrctservice.post(data, function (success) {

                    if (success.settings.message == "Did not found key category_name")
                    {
                        $scope.successmessage = "Invalid user.";
                    }
                    else
                    {
                        modifires.getCategory().then(function (data) {
                            $scope.getcategorylist = $scope.getcategorylist;
                            $scope.checkLength("");
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }

                }, function (error) {
                    console.log(error);
                });

            }
            $scope.deletecategory = function (catid, index,catname)
            {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            //return 'Are you sure want to delete <span class="delete-title">'+catname+' </span> category ?';
                            return 'Do you really want to delete Category? All Contacts/Addresses will be lost.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    data.post_data_string = {"method": "deletecategory", "web_token": $scope.web_token, "userId": $scope.userid, "category_id": catid}
                    dyrctservice.post(data, function (success) {

                        if (success.settings.message == "Did not found key category_name")
                        {
                            $scope.successmessage = "Invalid user.";
                        }
                        else
                        {

                            modifires.getCategory().then(function (data) {
                                
                                $scope.getcategorylist = data.data;
                                angular.forEach($scope.getcategorylist, function (item1, i) {
                                    $scope.getcategorylist[i]['logbooklist'] = [];
                                    angular.forEach($scope.getlogbooklist, function (item2, j) {
                                        if (item1._id == item2.category_id) {
                                            //$scope.category.push({cat: item1._id,data:item2});
                                            $scope.getcategorylist[i].logbooklist.push(item2);
                                        }
                                    });
                                    //console.log($scope.getcategorylist);
                                });
                                $scope.checkLength("");
                                //console.log('success');
                            }, function () {
                                console.log('error')
                            })
                        }

                    }, function (error) {
                        console.log(error);
                    });
                    }, function() {
                    console.log("cancel")

                });
                    $scope.readonly[index] = !$scope.readonly[index]; 
                
//                if (confirm('Are you sure want to delete category?')) {
//                    data.post_data_string = {"method": "deletecategory", "web_token": $scope.web_token, "userId": $scope.userid, "category_id": catid}
//                    dyrctservice.post(data, function (success) {
//
//                        if (success.settings.message == "Did not found key category_name")
//                        {
//                            $scope.successmessage = "Invalid user.";
//                        }
//                        else
//                        {
//
//                            modifires.getCategory().then(function (data) {
//                                $scope.getcategorylist = data.data;
//                                $scope.checkLength("");
//                                console.log('success');
//                            }, function () {
//                                console.log('error')
//                            })
//                        }
//
//                    }, function (error) {
//                        console.log(error);
//                    });
//                    $scope.readonly[index] = !$scope.readonly[index];
//                }
            }
             
            $scope.showme = false;
            $scope.showmee = true;
            $scope.checkedItems = function (_id,categoryid) {
                $scope.categoryId = categoryid
                $scope.logbook = [];

                var flag = false;
                angular.forEach($scope.getlogbooklist, function (user) {
                    if (user.checked) {
                        flag = true;
                        $scope.logbook.push(user._id);

                    }
                    if (flag) {
                        $scope.showme = true;
                    } else {
                        $scope.showme = false;
                    }

                });
                $scope.logbookId = $scope.logbook.toString();
                
            }
            
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
                            return $scope.getcategorylist;
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
            };  
            
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
                            return $scope.logbookId;
                        }

                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                    if(check == 'category')
                    {
                        $window.location.reload();
                    }
                    if(check == 'logbook')
                    {
                    modifires.getlogbook().then(function (data) {
                        //console.log(data);
                        $scope.getlogbook = data.data;
                        $scope.checkLength("");
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }

                }, function () {
             });


            }
//            $scope.move = function() {
//                    
//                    
//                    var categorydata = {};
//                    
//                    categorydata.post_data_string = {
//                        "method": "movelogbook",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "category_id": '',
//                        "log_book_id": $scope.logbookId
//                    }
//                    dyrctservice.post(categorydata, function(success) {
//                        $state.go('common.logbook')
//                        //$window.location.reload();
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            $scope.$watch('categoryname', function(newVal, oldVal) {
                //console.log(newVal.length,newVal, oldVal)
              if(newVal && (newVal+"").length > 30) {       
                $scope.categoryname = oldVal;
              }
            });

             $scope.limitChar=function(newVal){
                if(newVal && (newVal+"").length > 30) {   
                    return newVal.substring(0,30);
                }
                else{
                    return newVal;
                }
             }

        }]);

});

