define(['angularAMD','components/groups/deletegroupCtrl'], function(angularAMD) {

    angularAMD.controller('foldercreatecidCtrl', ['$scope', 'dyrctservice', 'id', 'name', 'foldertype', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$cookieStore', 'subfolderdata','$filter','GLOBALS',
        function($scope, dyrctservice, id, name, foldertype, $state, $stateParams, $uibModalInstance, modifires, $cookieStore, subfolderdata,$filter,GLOBALS) {
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
                
//                angular.forEach($scope.contactdata, function(a, i) {
//
//                console.log($scope.contactasd['folder_poi_contacts'],"here",$scope.contactdata);
//                $scope.contactdata[i]['checked'] = false;
//                angular.forEach($scope.contactasd['folder_poi_contacts'], function(b) {
//                    if (a.userId == b.id) {
//                        $scope.contactdata[i]['checked'] = true;
//                        $scope.contact.push(b.id);
//                        $scope.contactid = $scope.contact.join(',');
//
//                    }
//                })
//                //$scope.contactdata[i]['checked'] = "";
//            });
                $scope.poidata = angular.copy(data.data.data.allPoi);
                
//                angular.forEach($scope.poidata, function(a, i) {
//                $scope.poidata[i]['checked'] = false;
//                angular.forEach($scope.contactasd['folder_poi_contacts'], function(b) {
//                    if (a.poi_id == b.id) {
//                        $scope.poidata[i]['checked'] = true;
//                        $scope.poi.push(b.id);
//                        $scope.poiid = $scope.poi.join(',');
//                    }
//                })
//            });
               
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            $scope.contactasd = subfolderdata;

            //console.log(subfolderdata);
            $scope.foldertype = foldertype;
            $scope.foldername = name;
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

            $scope.updatefolder = function() {
                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "editfolder",
                    "folder_id": $scope.folderid,
                    "folder_name": $scope.foldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "sub_type":"device",
                    "parent_id":""
                }
                dyrctservice.post(folderdata, function(success) {
                    if (success.data.error == 'folder already created')
                    {
//                        confirm("Folder is already exists.");
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