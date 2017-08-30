define(['angularAMD','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('creategroupCtrl', ['$scope', '$location', 'id', 'name', 'dyrctservice', '$uibModalInstance', 'modifires', '$window', '$cookieStore', 'getGroupUserListData', 'edit','$timeout','GLOBALS','$uibModal',
        function ($scope, $location, id, name, dyrctservice, $uibModalInstance, modifires, $window, $cookieStore, getGroupUserListData, edit,$timeout,GLOBALS,$uibModal) {
            $scope.loader = true;
            $scope.edit = edit;
            modifires.getUserContacts().then(function (data) {
                //console.log(data);
                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                $scope.checkContact()
                $scope.loader = false;
                if ($scope.group_id) {
                    angular.forEach($scope.groupuserlist, function (groupuser) {
                        angular.forEach($scope.contactdata, function (contact) {
                            if (contact.isUsingDYRCT == 'true' && contact.userId == groupuser.userId && contact.userId != $scope.MyCID._id.$id && contact.profile_visibilty_flag == 'true') {
                                //console.log("zxczxc")
                                contact.checked = true
                                $scope.contact.push(contact.userId);
                            }

                        })
                    })
                    $scope.contactid = $scope.contact.toString();
                    //console.log($scope.contactid, $scope.contact)
                }
            }, function () {
                console.log('error')
            })

            $scope.groupuserlist = angular.copy(getGroupUserListData.data ? getGroupUserListData.data.result : []);
            $scope.MyCID = $cookieStore.get('_qu');
            //console.log($scope.MyCID._id.$id)
            $scope.contact = [];
            $scope.group_id = id;
            $scope.groupname = name;
            //console.log($scope.contactdata);
            $scope.checkContact = function () {

                $scope.contactlistdata = [];
                angular.forEach($scope.contactdata, function (contact) {
                    if (contact.isUsingDYRCT == 'true' && contact.userId != $scope.MyCID._id.$id && contact.profile_visibilty_flag == 'true') {

                        $scope.contactlistdata.push(contact.userId);
                    }

                })
                //console.log($scope.contactlistdata);
            }

            $scope.selectAll = function () {
                $scope.contact = [];
                angular.forEach($scope.contactdata, function (user) {
                    user.checked = true;
                    if (user.isUsingDYRCT == 'true' && user.userId != $scope.MyCID._id.$id && user.profile_visibilty_flag == 'true') {
                        if (user.checked) {
                            $scope.contact.push(user.userId);

                        }
                    }
                });
                $scope.contactid = $scope.contact.toString();
            };
            $scope.deselectAll = function () {
                $scope.contact = [];
                angular.forEach($scope.contactdata, function (user) {
                    user.checked = false;
                });
                $scope.contactid = $scope.contact.toString();
            };
            $scope.checkedItems = function (id, flag) {
                //console.log(id, flag);
                if (flag) {
                    angular.forEach($scope.contactdata, function (user) {
                        if (user.isUsingDYRCT == 'true' && user.profile_visibilty_flag == 'true') {
                            if (user.userId == id && user.userId != $scope.MyCID._id.$id) {
                                $scope.contact.push(user.userId);

                            }
                        }
                    });
                }
                else {
                    var index = 0;
                    angular.forEach($scope.contact, function (user) {
                        if (id == user) {
                            $scope.contact.splice(index, 1);
                        }
                        index++;
                    });
                }
                $scope.contactid = $scope.contact.toString();
                //console.log($scope.contactid)
            }

            $scope.creategroup = function () {
                if (!$scope.groupname || $scope.groupname == '') {
//                    var modalInstance = $uibModal.open({
//                    animation: true,
//                    size: 'sm',
//                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
//                    controller: 'deletegroupCtrl',
//                    resolve: {
//                        displaystr: function() {
//                            return 'Please enter group name.';
//                        }
//                    }
//                });
//                modalInstance.result.then(function(selectedItem) {
//                    })
                    $scope.contacterror = true;
                    $scope.messageerror = 'Please enter group name.';
                    return false;
                }
                if ($scope.contact.length == 0) {
                    if ($scope.groupname || $scope.groupname != '') {
                        $scope.contacterror = false;
                    }
//                    alert("Please select the contact.");
                    $('.transptant-overlay').fadeIn('slow');
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transptant-overlay').fadeOut('slow');
                         $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },1000)
                    return false;
                }
                
                var groupdata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                groupdata.post_data_string = {
                    "method": "groupListAndAdd",
                    "group_name": $scope.groupname,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "group_user_id": $scope.contactid,
                    "type": "add"
                }
                dyrctservice.post(groupdata, function (success) {
                    $uibModalInstance.close();
                    //$window.location.reload();
                }, function (error) {
                    console.log(error);
                });
            }
            $scope.updategroup = function () {
                if (!$scope.contact) {
                    $('.transptant-overlay').fadeIn(3000);
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                         $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },1000)
                    return false;
                }
                if (!$scope.groupname || $scope.groupname == '') {
                    var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Please enter group name.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    $scope.contacterror = true;
                    return false;
                }
                var groupdata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                groupdata.post_data_string = {
                    "method": "groupListAndAdd",
                    "group_name": $scope.groupname,
                    "group_id": $scope.group_id,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "group_user_id": $scope.contactid,
                    "type": "edit",
                    "group_edit_type": "update_name_user"
                }
                dyrctservice.post(groupdata, function (success) {
                    $uibModalInstance.close();
                }, function (error) {
                    console.log(error);
                });
            }

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});