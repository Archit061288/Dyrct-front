define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('blockusersCtrl', ['$scope', 'dyrctservice', '$state', '$stateParams','$uibModalInstance','$window','$cookieStore','modifires',
        function($scope, dyrctservice, $state, $stateParams,$uibModalInstance,$window,$cookieStore,modifires) {
            modifires.getBlockList().then(function(data) {
                        $scope.contactdata = data.data.result;
                    }, function() {
                        console.log('error')
                    })
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.checkedcontactItems = function(cid,name) {
                    $scope.contact = [];
                    angular.forEach($scope.contactdata, function(user) {
                            if (user.checked) {
                                $scope.contact.push(user.userId);
                            }
                    });
                    $scope.contactid = $scope.contact.toString();
                    $scope.checkname = name;
                    //console.log($scope.contactid,$scope.checkname)
                };
                $scope.unblockuser = function() {
                    
                    var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "unblock_ids": $scope.contactid,
                        "type": $scope.checkname,
                        "method": "blockListAndUnblockUser"
                    }
                    dyrctservice.post(groupdata, function(success) {
//                        $window.location.reload();
                    modifires.getBlockList().then(function(data) {
                            $scope.contactdata = data.data.result;
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        })
                    $uibModalInstance.close();
                    }, function(error) {
                        console.log(error);
                    });
            }
           $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});