define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('foldersubfolderaddcidCtrl', ['$scope', '$rootScope','dyrctservice', 'id', 'name', 'foldertype', 'subtype', '$state', '$stateParams', '$uibModalInstance','$cookieStore','subfolderdata','modifires','$filter',
        function($scope, $rootScope,dyrctservice, id, name, foldertype, subtype, $state, $stateParams, $uibModalInstance,$cookieStore,subfolderdata,modifires,$filter) {
            $scope.loader = true;
            $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
            $scope.productsss1 = []; 
            
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
                
            
                $scope.poidata = angular.copy(data.data.data.allPoi);
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
            $scope.MyCID = $cookieStore.get('_qu');
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
            
            
            $scope.poi = [];
            $scope.poiid = "";

            
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
           
            
            
            $scope.updatefolder = function() {

                var folderdata = {};
                folderdata.post_data_string = {
                    "method": "editfolder",
                    "folder_id": $scope.folderid,
                    "folder_name": $scope.subfoldername,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_poi_id": $scope.poiid,
                    "share_type_cid_id": $scope.contactid,
                    "sub_type": "device",
                    "parent_id": $scope.folderid
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