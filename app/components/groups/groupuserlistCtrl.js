define(['angularAMD', 'components/groups/creategroupCtrl', 'components/home/showCtrl','components/groups/deletegroupCtrl'], function(angularAMD) {

    angularAMD.controller('groupuserlistCtrl', ['$scope', '$rootScope', '$uibModal', '$location', 'dyrctservice', 'getUserContactData', 'GLOBALS', 'getGroupData', '$window', 'getGroupUserListData', 'getOneGrouplistData', '$cookieStore','modifires','$stateParams','$filter','$state',
        function($scope, $rootScope, $uibModal, $location, dyrctservice, getUserContactData, GLOBALS, getGroupData, $window, getGroupUserListData, getOneGrouplistData, $cookieStore,modifires,$stateParams,$filter,$state) {
            $scope.onegrouplist = getOneGrouplistData.data;
            $scope.grouplist = getGroupData.data.result;
            $scope.grouphistory = getGroupUserListData.data.result;
            $scope.grouphistorylistData = getGroupUserListData.data
            if($scope.grouphistorylistData.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            //console.log($scope.grouphistory);
            $scope.MyCID = $cookieStore.get('_qu');
            $rootScope.topsearch=true;
            $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
            
            $scope.route1=true;
            $rootScope.$broadcast("route1group",$scope.route1);
        $rootScope.$on("userSearch", function(event, data) {


                $scope.search.searchName = data;
               // console.log("++" + $scope.search.searchName);
            })
            $scope.$watch('search.searchName', function(newVal) {
                
                $scope.productsss = $filter('searchdata')($scope.grouphistory, newVal,'name');
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
            //console.log([$scope.grouphistory, $scope.grouplist, $scope.onegrouplist]);
            $scope.openModalgroup = function(id, name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/creategroup.html",
                    controller: 'creategroupCtrl',
                    resolve: {
                        selectedcontactData: function() {
                            return getUserContactData;
                        },
                        id: function() {
                            return id;
                        },
                        name: function() {
                            return name;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $window.location.reload();
                }, function() {

                });
            }
            // $rootScope.$on("userSearch", function(event, data) {
            //     $scope.q = {};
            //     $scope.q.name = data;
            // })
            $scope.deletegroup = function(id, name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Do you want to remove this CID/POI from this group?';
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
                       $location.path('/groups') 
                    }, function(error) {
                        console.log(error);
                    });
                    
                }, function() {
                    console.log("cancel")

                });  
//                if (confirm('Do you want to delete this group.?')) {
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
//                       $location.path('/groups') 
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            }
            $scope.leavegroup = function(id) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Do you want to remove this CID/POI from this group?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("delete",id)
                   var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "method": "groupListAndAdd",
                        "group_id": id,
                        "group_edit_type": "delete_user",
                        "type": "edit",
                        "group_user_id": $scope.MyCID._id.$id,
                        "isSendPush": "true"

                    }
                    dyrctservice.post(groupdata, function(success) {
                            $location.path('/groups'); 
                    },function(){
                        console.log('error')
                    })
                    
                }, function() {
                    console.log("cancel")

                });  
            
//                if (confirm('Do you want to leave this group?')) {
//                    var groupdata = {};
//                    groupdata.post_data_string = {
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "method": "groupListAndAdd",
//                        "group_id": id,
//                        "group_edit_type": "delete_user",
//                        "type": "edit",
//                        "group_user_id": $scope.MyCID._id.$id,
//                        "isSendPush": "true"
//
//                    }
//                    dyrctservice.post(groupdata, function(success) {
//                        $location.path('/groups') 
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            }
            $scope.deletegroupuser = function(id,groupid) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Do you want to remove this CID/POI from this group?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("delete",id,groupid)
                    var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "method": "groupListAndAdd",
                        "group_id": groupid,
                        "group_edit_type": "delete_user",
                        "type": "edit",
                        "group_user_id": id,
                        "isSendPush": "false"

                    }
                    dyrctservice.post(groupdata, function(success) {
                            //$window.location.reload();
                        modifires.getGroupUserList($stateParams.id).then(function(data){
                        $scope.grouphistory = angular.copy(data.data.result);
                        
                        //console.log("success",$scope.grouphistory,data)
                    },function(){
                        console.log('error')
                    })
                    
                }, function() {
                    console.log("cancel")

                });  
            })
//                if (confirm('Do you want to remove this CiD / POI from this group?')) {
//                    var groupdata = {};
//                    groupdata.post_data_string = {
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "method": "groupListAndAdd",
//                        "group_id": groupid,
//                        "group_edit_type": "delete_user",
//                        "type": "edit",
//                        "group_user_id": id,
//                        "isSendPush": "false"
//
//                    }
//                    dyrctservice.post(groupdata, function(success) {
//                            //$window.location.reload();
//                        modifires.getGroupUserList($stateParams.id).then(function(data){
//                        $scope.grouphistory = angular.copy(data.data.result);
//                        
//                        console.log("success",$scope.grouphistory,data)
//                    },function(){
//                        console.log('error')
//                    })
////                    ,
////                    modifires.getOneGroupList($stateParams.id).then(function(data){
////                        $scope.onegrouplist = getOneGrouplistData.data;
////                        console.log("success")
////                    },function(){
////                        console.log('error')
////                    })
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            }
            

        }])

});