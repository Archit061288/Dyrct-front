define(['angularAMD','components/groups/deletegroupCtrl','components/folder/folderlockconfirmationCtrl'], function(angularAMD) {

    angularAMD.controller('foldersubfolderCtrl', ['$scope', '$rootScope','dyrctservice', 'id', 'name', 'foldertype', 'parentfolderdata', 'subtype', 'tags', 'lock_folder', '$state', '$stateParams', '$uibModalInstance','$cookieStore','subfolderdata','modifires','$filter','GLOBALS','$uibModal',
        function($scope, $rootScope,dyrctservice, id, name, foldertype, parentfolderdata, subtype, tags, lock_folder, $state, $stateParams, $uibModalInstance,$cookieStore,subfolderdata,modifires,$filter,GLOBALS,$uibModal) {
            $scope.loader = true;
            $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
            $scope.productsss1 = []; 
             $scope.poi = [];
            $scope.poiid = "";
            $scope.$watch('search.searchName', function(newVal) {
                
                $scope.productsss = $filter('searchdata')($scope.contactdata, newVal,'firstName,lastName');
                $scope.productsss1 = $filter('searchdata')($scope.poidata, newVal,'title,address');
               // console.log(newVal,$scope.productsss,$scope.productsss1)
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
                if (($scope.productsss1 && $scope.productsss1.length == 0))
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                        $scope.resultflagpoi = false;
//                    }
                } else
                {
                    $scope.resultflagpoi = true;
                }
                
                //console.log(newVal)
                //$scope.products_new.push()
            });
            modifires.getUserContacts().then(function(data) {
                
                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                
            angular.forEach($scope.contactdata, function (a, i) {

                //console.log($scope.contactasd['folder_poi_contacts']);
                $scope.contactdata[i]['checked'] = false;
                angular.forEach($scope.contactasd['folder_poi_contacts'], function (b) {
                    if (a.userId == b.id) {
                        $scope.contactdata[i]['checked'] = true;
                        $scope.contact.push(b.id);
                        $scope.contactid = $scope.contact.join(',');

                    }
                })
                //$scope.contactdata[i]['checked'] = "";
            });
                $scope.poidata = angular.copy(data.data.data.allPoi);
                
                angular.forEach($scope.poidata, function (a, i) {
                $scope.poidata[i]['checked'] = false;
                angular.forEach($scope.contactasd['folder_poi_contacts'], function (b) {
                    if (a.poi_id == b.id) {
                        $scope.poidata[i]['checked'] = true;
                        $scope.poi.push(b.id);
                        $scope.poiid = $scope.poi.join(',');
                    }
                })
            });
                //console.log($scope.poidata);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            //$scope.foldertype = foldertype;
            $rootScope.topsearch=true;
            $scope.contactasd = subfolderdata;
            
            if (subtype != 'subcreate') {
                $scope.subfoldername = subtype;
            }

            tags = tags.split(',');
            $scope.subfoldertag = [];
            angular.forEach(tags,function(tag){
                if(tag != ''){ $scope.subfoldertag.push({text:tag}); }                      
            });
            $scope.MyCID = $cookieStore.get('_qu');
            
            $scope.parentfolderdata = parentfolderdata;
            
            $scope.folderlock = parentfolderdata.lock_folder;            
            $scope.subfolderlock = (parentfolderdata.lock_folder) ? true : (lock_folder == '') ? false : lock_folder;            
            
            $scope.foldername = foldertype;
            //console.log($scope.foldertype, subtype);
            $scope.folderid = id;
            
            $scope.showdata = true;
            $scope.displaypoidata = function() {
                $scope.showdata = false;
            }
            $scope.displaycontactdata = function() {
                $scope.showdata = true;
            }
            $scope.contact = [];
            $scope.contactunchecked = [];
            $scope.contactid = "";
//            $scope.contactdata = angular.copy(selectedpoiData.data.data.allContact[0]);
//            $scope.poidata = angular.copy(selectedpoiData.data.data.allPoi);
            
            $scope.lockUnlockFolder = function(state){
                $scope.folderlock = (state == 'lock')?true:false;
            };
                    
            $scope.lockUnlockSubFolder = function(state){
                $scope.subfolderlock = (state == 'lock')?true:false; 
                console.log($scope.subfolderlock);
                if($scope.subfolderlock == true)
                {                    
                    if($scope.folderid)
                    {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            size: '',
                            templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/folderlockconfirmation.html",
                            controller: 'folderlockconfirmationCtrl'
                        });
                        modalInstance.result.then(function (selectedItem) {
                            console.log("OK");
                            $scope.subfolderlock = true;
                        }, function () {
                            $scope.subfolderlock = false;
                        });
                    }else{
                        $scope.subfolderlock = true;                        
                    }                    
                    
                }
            }; 

            $scope.checkedcontactItems = function (cid, flag) {
                if (flag) {
                    angular.forEach($scope.contactdata, function (user) {
                        if (user.isUsingDYRCT == 'true') {
                            if (cid == user.userId) {
                                $scope.contact.push(user.userId);
                            }

                        }
                    });

                }
                else {
                    var index = 0;
                    angular.forEach($scope.contact, function (user) {
                        if (user == cid) {
                            $scope.contact.splice(index, 1);
                        }
                        index++;
                    });
                }

//                 if($scope.contactdata[index]['checked'] && $scope.contact.indexOf($scope.contactdata[index]['userId']) == -1 && $scope.contactdata[index]['isUsingDYRCT'] == 'true'){
//                    console.log('if');
//                    $scope.contact.push($scope.contactdata[index]['userId']);
//                 }else if(!$scope.contactdata[index]['checked'] && $scope.contact.indexOf($scope.contactdata[index]['userId']) != -1 &&  $scope.contactdata[index]['isUsingDYRCT']== 'true'){
//                    console.log('else');
//                    $scope.contact.splice($scope.contact.indexOf($scope.contactdata[index]['userId']),1);
//                 } 

                $scope.contactid = $scope.contact.join(',');
                //$scope.contactid = $scope.contact.toString();
                //console.log($scope.contactid, $scope.contact, flag);

            };
            $scope.checkedpoiItems = function (poi, flag) {
                if (flag) {
                    angular.forEach($scope.poidata, function (user) {
                        //console.log(user.poi_id);
                        if (poi == user.poi_id) {

                            $scope.poi.push(user.poi_id);
                        }

                    });
                }
                else {
                    var index = 0;
                    angular.forEach($scope.poi, function (user) {
                        if (user == poi) {
                            $scope.poi.splice(index, 1);
                        }
                        index++;
                    });
                }
                $scope.poiid = $scope.poi.join(',');
            };
            
            $scope.$on('invalidfoldertag', function () { 
                 
                 $scope.messagetag = "Please enter atleast 3 character."
                    
             
             });
             $scope.$on('validfoldertag', function () { 
                 
               $scope.messagetag = "";
             
             });
           
            $scope.createfolder = function() {
                if (!$scope.subfoldername || $scope.subfoldername == "") {
                    $scope.subfoldrcrt = true;
                    $scope.messageerror = "Please enter sub folder name.";
                    return false;
                }
                if($scope.messagetag=="Please enter atleast 3 character.")
                {
                    $scope.messagetag = "Please enter atleast 3 character."
                    return false;
                }
                $scope.subfolder_hash_tag = [];                
                angular.forEach($scope.subfoldertag,function(tag){ 
                    if(tag.text != ''){ $scope.subfolder_hash_tag.push(tag.text); }                    
                });
                $scope.subfolder_hash_tag_str = ""
                $scope.subfolder_hash_tag_str = $scope.subfolder_hash_tag.toString(',');


                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "createsubfolder",
                    "sub_folder_name": $scope.subfoldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "folder_id": parentfolderdata._id,
                    "sub_type": "device",
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "subfolder_hash_tag": $scope.subfolder_hash_tag_str,
                    "lock_subfolder": $scope.subfolderlock
                }
                dyrctservice.post(folderdata, function(success) {
                    //console.log(success);
                    if (success.data.error== 'Sub folder already created')
                    {
                    //  confirm("Sub folder already created.");
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                        controller: 'deletegroupCtrl',
                        resolve: {
                            displaystr: function() {
                                return 'Sub folder already created.';
                            }
                        }
                    });
                    modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    ga("send", "event", {eventCategory: "Create Sub Folder", eventAction: "Create Sub Folder", eventLabel: "Create Sub Folder", userId: $scope.MyCID._id.$id});
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });

            };
            
            $scope.updatefolder = function() {
                if (!$scope.subfoldername || $scope.subfoldername == "") {
                    $scope.subfoldrcrt = true;
                    $scope.messageerror = "Please enter sub folder name.";
                    return false;
                }

                console.log($scope.subfoldertag);
                $scope.subfolder_hash_tag = [];                
                angular.forEach($scope.subfoldertag,function(tag){ 
                    if(tag.text != ''){ $scope.subfolder_hash_tag.push(tag.text); }                    
                });
                $scope.subfolder_hash_tag_str = ""
                $scope.subfolder_hash_tag_str = $scope.subfolder_hash_tag.toString(',');
                
                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "editfolder",
                    "folder_id": $scope.folderid,
                    "folder_name": $scope.subfoldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "sub_type": "web",
                    "parent_id": parentfolderdata._id,
                    "hash_tag": $scope.subfolder_hash_tag_str,
                    "lock_folder": $scope.subfolderlock
                }
                dyrctservice.post(folderdata, function(success) {
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });

            };
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});