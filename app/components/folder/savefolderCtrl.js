define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('savefolderCtrl', ['$scope', 'dyrctservice','GLOBALS','$state', 'flag', 'folder_id', 'folder_name', 'created_owner_id', '$stateParams','$uibModal','$uibModalInstance','$cookieStore','modifires','$timeout',
        function($scope, dyrctservice,GLOBALS,$state, flag, folder_id, folder_name, created_owner_id, $stateParams,$uibModal,$uibModalInstance,$cookieStore,modifires,$timeout) {
            
           $scope.MyCID = $cookieStore.get('_qu');
           $scope.flag = flag;
           $scope.folder_id = folder_id;
           $scope.folder_name = folder_name;
           $scope.created_owner_id = created_owner_id;        

           $scope.saveFolder = function (folderid,folder_name,created_owner_id,val_msg){
                var folderdata = {};

                folderdata.post_data_string = {
                "method": "savefolderhashtag",
                "userId": $scope.MyCID._id.$id,
                "web_token": $scope.MyCID.web_token,
                "folder_id": folderid,
                "folder_name": folder_name,
                "created_owner_id": created_owner_id,
                "val_msg": val_msg,                
                "type":"true"
                };
                console.log(folderdata);
                
                dyrctservice.post(folderdata, function (success) {
                    
                    $uibModalInstance.close();

                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/savefolder.html",
                        controller: 'savefolderCtrl',
                        resolve: {
                            flag: function () {
                                return success.data.flag;
                            },
                            folder_id: function () {
                                return folder_id;
                            },
                            folder_name: function () {
                                return folder_name;
                            },
                            created_owner_id: function () {
                                return created_owner_id;
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        $state.go($state.current, {}, {reload: true});
                        //$window.location.reload();
                    }, function () {
                        
                    });
                    
                }, function (error) {
                    console.log(error);
                });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.saved = function(){
                $uibModalInstance.close();
            }
            
        }])

});