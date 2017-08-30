define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('sharefolderCtrl', ['$scope', 'dyrctservice','idcur','idpre','name', '$state', '$stateParams','$uibModalInstance','$cookieStore','modifires','$timeout',
        function($scope, dyrctservice,idcur,idpre,name, $state, $stateParams,$uibModalInstance,$cookieStore,modifires,$timeout) {
            $scope.loader = true;
            modifires.getUserContacts().then(function(data) {
                
                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                //console.log($scope.poidata);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            //console.log(idcur,idpre,name);
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.idpre = idpre;
            $scope.idcur = idcur;
            $scope.checkname = name;
//            $scope.contactdata = selectedcontactData.data.data.allContact[0];
            $scope.checkedcontactItems = function(cid,name) {
                    $scope.contact = [];
                    $scope.contactname = [];
                    angular.forEach($scope.contactdata, function(user) {
                            if (user.checked) {
                                $scope.contact.push(user.userId);
                                $scope.contactname.push(user.firstName +""+user.lastName);
                            }
                    });
                    $scope.contactid = $scope.contact.toString();
                    $scope.selecteditem = $scope.contactname.toString();
                    
                    //console.log($scope.checkname);
                };
            $scope.sharefolder = function() {
                if (!$scope.contact) {
//                    alert("Please select the contact.");
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
                if($scope.checkname == 'folder'){
                    var sharefolder = {};
                    sharefolder.post_data_string = {
                        "method": "sharefolder",
                        "receivers_id": $scope.contactid,
                        "type":"folder",
                        "type_id":$scope.idpre,
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token
                    }
                }
               else if($scope.checkname == 'subfolder'){
                    //console.log($scope.checkname);
                    var sharefolder = {};
                    sharefolder.post_data_string = {
                        "method": "sharefolder",
                        "receivers_id": $scope.contactid,
                        "type":"subfolder",
                        "type_id":$scope.idcur,
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "folder_id":$scope.idpre
                        
                    }
                }
                    dyrctservice.post(sharefolder, function(success) {
                        if($scope.checkname == 'folder')
                        {
                            ga("send", "event", {eventCategory: "Share Folder", eventAction: "Share Folder", eventLabel: "Share Folder", userId: $scope.MyCID._id.$id});
                        }
                        if($scope.checkname == 'subfolder')
                        {
                            ga("send", "event", {eventCategory: "Share Sub Folder", eventAction: "Share Sub Folder", eventLabel: "Share Sub Folder", userId: $scope.MyCID._id.$id});
                        }
                        modifires.getUserFolder().then(function (data) {
                        $scope.folderlist = data.data;
                        $uibModalInstance.dismiss('cancel');
                    }, function (error) {
                    })
                    }, function(error) {
                        console.log(error);
                    });
            };
           $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});