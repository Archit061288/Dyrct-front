define(['angularAMD','components/groups/deletegroupCtrl','components/folder/folderlockconfirmationCtrl'], function(angularAMD) {

    angularAMD.controller('foldercreateeditCtrl', ['$rootScope','$scope', 'dyrctservice', 'id', 'name', 'tags', 'lock_folder', 'foldertype', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$cookieStore', 'subfolderdata','$filter','GLOBALS','$uibModal',
        function($rootScope,$scope, dyrctservice, id, name, tags, lock_folder, foldertype, $state, $stateParams, $uibModalInstance, modifires, $cookieStore, subfolderdata,$filter,GLOBALS,$uibModal) {
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
                
                angular.forEach($scope.contactdata, function(a, i) {

               // console.log($scope.contactasd['folder_poi_contacts'],"here",$scope.contactdata);
                $scope.contactdata[i]['checked'] = false;
                angular.forEach($scope.contactasd['folder_poi_contacts'], function(b) {
                    if (a.userId == b.id) {
                        $scope.contactdata[i]['checked'] = true;
                        $scope.contact.push(b.id);
                        $scope.contactid = $scope.contact.join(',');

                    }
                })
                //$scope.contactdata[i]['checked'] = "";
            });
                $scope.poidata = angular.copy(data.data.data.allPoi);
                
                angular.forEach($scope.poidata, function(a, i) {
                $scope.poidata[i]['checked'] = false;
                angular.forEach($scope.contactasd['folder_poi_contacts'], function(b) {
                    if (a.poi_id == b.id) {
                        $scope.poidata[i]['checked'] = true;
                        $scope.poi.push(b.id);
                        $scope.poiid = $scope.poi.join(',');
                    }
                })
            });
               
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            
            
            $scope.contactasd = subfolderdata;

            $scope.folderlock = (lock_folder == '') ? false : lock_folder;
            $scope.subfolderlock = false;  

            
            
            $scope.foldertype = foldertype;
            $scope.foldername = name;
            console.log();
            tags = tags.split(',');
            $scope.foldertag = [];
            angular.forEach(tags,function(tag){
                if(tag != ''){ $scope.foldertag.push({text:tag}); }                
            });
            
            $scope.lockUnlockFolder = function(state){
                $scope.folderlock = (state == 'lock')?true:false;
                if($scope.folderlock == true)
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
                            $scope.folderlock = true;
                            $scope.subfolderlock = true;
                        }, function () {
                            $scope.folderlock = false;
                        });
                    }else{
                        $scope.folderlock = true;
                        $scope.subfolderlock = true;
                    }                    
                    
                }
            };
            
            $scope.lockUnlockSubFolder = function(state){
                $scope.subfolderlock = (state == 'lock')?true:false;
            };
            
            $scope.folderid = id;
            //console.log($scope.folderid)
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.showdata = true;
            $scope.displaypoidata = function() {
                $scope.showdata = false;
            }
            $scope.displaycontactdata = function() {
                $scope.showdata = true;
            }
            

            if($scope.folderid)
            {
                var paramsStr = '{"method": "getlistSubfolder","timestamp":"1445332371","folder_id":"' + $scope.folderid + '","web_token":"' + $scope.MyCID.web_token + '","userId":"' + ($scope.MyCID._id ? $scope.MyCID._id.$id : $scope.MyCID.userId) + '"}';
                var query = {post_data_string: paramsStr};
                dyrctservice.post(query, function(success) {
                    if(success.data.sub_folder_list && success.data.sub_folder_list.length > 0)
                    {
                        var getSubfolder = success.data.sub_folder_list;
                        getSubfolder = getSubfolder.filter(function(value){
                                return value.status == 'active';
                        });                        
                        if(getSubfolder.length > 0)
                        {
                            $scope.subfolderlock = (getSubfolder[0].lock_folder) ? true : false;            
                            $scope.subfoldername = (getSubfolder[0].folder_name) ? getSubfolder[0].folder_name: '';                    
                        }                        
                    }
                });                                
            }

            $scope.contact = [];
            $scope.contactunchecked = [];
            $scope.contactid = "";
//            $scope.contactdata = angular.copy(selectedpoiData.allContact[0]);
//            $scope.poidata = angular.copy(selectedpoiData.allPoi);

                $scope.checkedcontactItems = function(cid, flag) {
                if (flag) {
                    angular.forEach($scope.contactdata, function(user) {
                        if (user.isUsingDYRCT == 'true') {
                            if (cid == user.userId) {
                                $scope.contact.push(user.userId);
                            }

                        }
                    });

                }
                else {
                    var index = 0;
                    angular.forEach($scope.contact, function(user) {
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

            $scope.checkedpoiItems = function(poi, flag) {
                if (flag) {
                    angular.forEach($scope.poidata, function(user) {
                        //console.log(user.poi_id);
                        if (poi == user.poi_id) {

                            $scope.poi.push(user.poi_id);
                        }

                    });
                }
                else {
                    var index = 0;
                    angular.forEach($scope.poi, function(user) {
                        if (user == poi) {
                            $scope.poi.splice(index, 1);
                        }
                        index++;
                    });
                }
                $scope.poiid = $scope.poi.join(',');
            };
            
//            $rootScope.$on("invalidfoldertag", function (event, data) {
//                
//                console.log("hihello")
//            })

             $scope.$on('invalidfoldertag', function () { 
                 
                 $scope.messagetag = "Please enter atleast 3 character."
                    
             
             });
             $scope.$on('validfoldertag', function () { 
                 
               $scope.messagetag = "";
             
             });
            
            $scope.createfolder = function() {
                if (!$scope.foldername || $scope.foldername == "") {
                    $scope.foldrcrt = true;
                    $scope.messageerror = "Please enter folder name."
                    return false;
                }
                if (!$scope.subfoldername) {
                    $scope.subfoldername = "";
                }
                if($scope.messagetag=="Please enter atleast 3 character.")
                {
                    $scope.messagetag = "Please enter atleast 3 character."
                    return false;
                }

                $scope.folder_hash_tag = [];                
                angular.forEach($scope.foldertag,function(tag){ 
                    if(tag.text != ''){ $scope.folder_hash_tag.push(tag.text); }                    
                });
                $scope.folder_hash_tag_str = ""
                $scope.folder_hash_tag_str = $scope.folder_hash_tag.toString(',');                                

                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "createfolderandsubfolder",
                    "folder_name": $scope.foldername,
                    "sub_folder_name": $scope.subfoldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "root_folder": true,
                    "folder_hash_tag":$scope.folder_hash_tag_str,
                    "lock_folder":$scope.folderlock,
                    "lock_subfolder":$scope.subfolderlock

                }
                dyrctservice.post(folderdata, function(success) {
                    if (success.data.error == 'Folder already created')
                    {
                        var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Folder is already exists.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    ga("send", "event", {eventCategory: "Create Folder", eventAction: "Create Folder", eventLabel: "Create Folder", userId: $scope.MyCID._id.$id});
                    $uibModalInstance.close();

                }, function(error) {
                    //console.log(error);
                });

            };

            $scope.updatefolder = function() {
                if (!$scope.foldername || $scope.foldername == "") {
                    $scope.foldrcrt = true;
                    $scope.messageerror = "Please enter folder name."
                    return false;
                }

                $scope.folder_hash_tag = [];                
                angular.forEach($scope.foldertag,function(tag){ 
                    if(tag.text != ''){ $scope.folder_hash_tag.push(tag.text); }                    
                });
                $scope.folder_hash_tag_str = ""
                $scope.folder_hash_tag_str = $scope.folder_hash_tag.toString(',');

                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "editfolder",
                    "folder_id": $scope.folderid,
                    "folder_name": $scope.foldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "sub_type": "web",
                    "parent_id":"",
                    "hash_tag": $scope.folder_hash_tag_str,
                    "lock_folder": $scope.folderlock
                }
                dyrctservice.post(folderdata, function(success) {
                    if (success.data.error == 'Folder already created')
                    {
                         var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Folder is already exists.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    $uibModalInstance.close();
                }, function(error) {
                    //console.log(error);
                });

            };
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});