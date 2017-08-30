define(['angularAMD', 'components/groups/creategroupCtrl', 'components/groups/sendgroupCtrl','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('groupsCtrl', ['$scope', '$rootScope', '$uibModal', '$location', 'dyrctservice', 'GLOBALS', 'getGroupData', '$window', 'getGroupUserListData', 'modifires', '$cookieStore','$filter','$state',
        function($scope, $rootScope, $uibModal, $location, dyrctservice, GLOBALS, getGroupData, $window, getGroupUserListData, modifires, $cookieStore,$filter,$state) {
            // $rootScope.$on("userSearch", function(event, data) {
            //     $scope.q = {};
            //     $scope.q.group_name = data;
            // })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $rootScope.$emit("notificationservice")
        $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
            $scope.route1=true;
            $rootScope.$broadcast("route1group",$scope.route1);    
            
        $rootScope.$on("userSearch", function(event, data) {


                $scope.search.searchName = data;
               // console.log("++" + $scope.search.searchName);
            })
            $scope.$watch('search.searchName', function(newVal) {
                
                $scope.productsss = $filter('searchdata')($scope.grouplist, newVal,'group_name');
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
            if(getGroupData.data.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            $rootScope.openclass = false;
            $rootScope.topsearch = true;
            $scope.groupuserlist = getGroupUserListData;
            
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.grouplist = getGroupData.data.result;
            
//            console.log($scope.grouplist,$scope.MyCID);
            $scope.openModalgroup = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/creategroup.html",
                    controller: 'creategroupCtrl',
                    resolve: {
                        id: function() {
                            return '';
                        },
                        name: function() {
                            return '';
                        },
                        edit: function() {
                            return [];
                        },
                        getGroupUserListData: function() {
                            return [];
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    modifires.getGroup().then(function(data) {
                        $scope.grouplist = data.data.result;
                        //console.log("success")
                    }, function() {
                        console.log('error')
                    })
                }, function() {

                });
            }
            $scope.openmodelupdategroup = function(id, name, edit) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/creategroup.html",
                    controller: 'creategroupCtrl',
                    resolve: {
                        id: function() {
                            return id;
                        },
                        name: function() {
                            return name;
                        },
                        edit: function() {
                            return edit;
                        },
                        getGroupUserListData: function() {
                            return modifires.getGroupUserList(id)
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    modifires.getGroup().then(function(data) {
                        $scope.grouplist = data.data.result;
                        //console.log("success")
                    }, function() {
                        console.log('error')
                    })
                }, function() {

                });
            }
            $scope.openModalsendgroup = function(id, name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/sendgroup.html",
                    controller: 'sendgroupCtrl',
                    resolve: {
                        id: function() {
                            return id;
                        },
                        name: function() {
                            return name;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    modifires.getGroup().then(function(data) {
                        $scope.grouplist = data.data.result;
                        //console.log("success")
                    }, function() {
                        console.log('error')
                    })
                }, function() {

                });
            }
            $scope.deletegroup = function(id, name){
              var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Are you sure, Do you want to delete this group?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("delete",id,name)
                    var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "group_id": id,
                        "group_name": name,
                        "method": "groupListAndAdd",
                        "type": "delete",
                    }
                    dyrctservice.post(groupdata, function(success) {
                        modifires.getGroup().then(function(data) {
                            $scope.grouplist = data.data.result;
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        })
                        //$window.location.reload();
                    }, function (error) {
                        console.log(error);
                    });
                    
                }, function() {
                    console.log("cancel")

                });  
            }
//            $scope.deletegroup = function(id, name) {
//                if (confirm('Do you want to delete ' +name+ ' group.?')) {
//                    var groupdata = {};
//                    groupdata.post_data_string = {
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "group_id": id,
//                        "group_name": name,
//                        "method": "groupListAndAdd",
//                        "type": "delete",
//                    }
//                    dyrctservice.post(groupdata, function(success) {
//                        modifires.getGroup().then(function(data) {
//                            $scope.grouplist = data.data.result;
//                            console.log("success")
//                        }, function() {
//                            console.log('error')
//                        })
//                        //$window.location.reload();
//                    }, function (error) {
//                        console.log(error);
//                    });
//                }
//            }
            $scope.anchor = function(id){
            $state.go("common.grouphistory",{id:id})
            
        }
        }])
        
});