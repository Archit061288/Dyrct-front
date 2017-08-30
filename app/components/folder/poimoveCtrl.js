define(['angularAMD','components/groups/deletegroupCtrl'], function(angularAMD) {

    angularAMD.controller('poimoveCtrl', ['$scope', '$rootScope','dyrctservice', '$state', '$stateParams', '$uibModalInstance','$cookieStore','modifires','$filter','folderdata','flag','$window','movepoiid','currentfolderdata','showsubfolder','subfolderdata','currentfolderbyparam','$timeout','GLOBALS','$uibModal','poititle',
        function($scope, $rootScope,dyrctservice, $state, $stateParams, $uibModalInstance,$cookieStore,modifires,$filter,folderdata,flag,$window,movepoiid,currentfolderdata,showsubfolder,subfolderdata,currentfolderbyparam,$timeout,GLOBALS,$uibModal,poititle) {
            //console.log(moveshareid,movefolderid,fldrname,flag,showsubfolder);
            $scope.showpoifolder='false';
            $scope.poititle=poititle;
            $scope.movemainfolder=false;
            $scope.showsubfolder=showsubfolder;
            $scope.clickfolder = true;
            $scope.folderarray=[];
            $scope.foldernamedata=[];
            if($scope.showsubfolder=="POI" || $scope.showsubfolder=="CID")
            {
               $scope.showpoifolder='true'; 
               
            }
            if(currentfolderbyparam)
            {
               $scope.currentfolderbyparam=currentfolderbyparam;
               
            }
            $scope.subfolderdata=subfolderdata.sub_folder_list;
            //console.log($scope.subfolderdata)
            //$scope.movefolderid=movefolderid;
            $scope.currentfolderdata=currentfolderdata;
            
//            $scope.moveshareid=moveshareid;
            //console.log($scope.movefolderid);
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.folderdata=folderdata;
            
            $scope.checkFolderlist = function () {
                $scope.finalFolderlist = [];
                for (var i = 0; i < $scope.folderdata.length; i++) {
                    $scope.folderdata[i].isVisible = ($scope.folderdata[i].lock_folder == true) ? ($scope.folderdata[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                }
            }
            $scope.checkFolderlist();
            
            
            $scope.newfolderdata=folderdata;
           
//            angular.forEach($scope.folderdata, function (b,i) {
//                $scope.folderdata[i]['subfolderlist']= [];
//                $scope.folderdata[i]['folder_poi_contacts']= [];
//                if(b.status=="active")
//                {
//                 modifires.getSubFolder(b.folder_id).then(function (data) {
//                     console.log(data);
//                            $scope.folderdata[i].subfolderlist.push(data.data.sub_folder_list);
//                            $scope.folderdata[i].folder_poi_contacts.push(data.data.folder_poi_contacts);
//                            //$scope.checkLength("");
//                            console.log("success")
//                        }, function () {
//                            console.log('error')
//                        })
//                }
//                })
                
                //console.log($scope.folderdata);
                $scope.clickfolder = true;
                $scope.clicksubfolder = true;
                $scope.clicksubfolder2 = true;
            $scope.folderclick = function(folderid,foldername){
                $scope.movemainfolder=true;
                $scope.folderarray.push(folderid);
                $scope.foldernamedata.push(foldername);
                $scope.folderid = folderid;
                $scope.mainfolderid = folderid
                $scope.mainfoldername = foldername
                $scope.clickfolder = false;
                $scope.clicksubfolder = false;
                $scope.clicksubfolder2 = true;
//                angular.forEach($scope.newfolderdata, function (b,i) {
//                $scope.newfolderdata[i]['newsubfolderlist']= [];
//                $scope.newfolderdata[i]['newfolder_poi_contacts']= [];
//                if(b.status=="active")
//                {
//                 $timeout(function(){
                     modifires.getSubFolder(folderid).then(function (data) {
                     //console.log(data);
                     $scope.newsubfolderlist = data.data.sub_folder_list;
                     //Check folder permission
                     if($scope.newsubfolderlist)
                     {
                     for (var i = 0; i < $scope.newsubfolderlist.length; i++) {
                        $scope.newsubfolderlist[i].isVisible = ($scope.newsubfolderlist[i].lock_folder == true) ? ($scope.newsubfolderlist[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                     }
                    }
                     $scope.newfolder_poi_contactslist = data.data.folder_poi_contacts;
//                            $scope.newfolderdata[i].newsubfolderlist.push(data.data.sub_folder_list);
//                            $scope.newfolderdata[i].newfolder_poi_contacts.push(data.data.folder_poi_contacts);
                            //$scope.checkLength("");
                            //$scope.$apply();
                            //console.log("success",$scope.newsubfolderlist,$scope.newfolder_poi_contactslist)
                        }, function () {
                            console.log('error')
//                        })
//                }
                })
//            },500)
//                console.log($scope.newfolderdata);
            }
            $scope.subfolderclick = function(subfolderid,subfoldername){
                $scope.movemainfolder=true;
                console.log("subfolderclick")
                $scope.folderarray.push(subfolderid);
                $scope.foldernamedata.push(subfoldername);
                $scope.folderid = subfolderid;
                $scope.mainfolderid = $scope.mainfolderid;
                $scope.clickfolder = false;
                $scope.clicksubfolder = false;
                $scope.clicksubfolder2 = false;
                //console.log($scope.mainfolderid)
//                angular.forEach($scope.newfolderdata, function (b,i) {
//                $scope.newfolderdata[i]['newsubfolderlist']= [];
//                $scope.newfolderdata[i]['newfolder_poi_contacts']= [];
//                if(b.status=="active")
//                {
//                 $timeout(function(){
                     modifires.getSubFolder(subfolderid).then(function (data) {
                     $scope.mainfoldername = subfoldername;
                     
                     $scope.newsubfolderlist = data.data.sub_folder_list;
                     if($scope.newsubfolderlist)
                     {
                     for (var i = 0; i < $scope.newsubfolderlist.length; i++) {
                        $scope.newsubfolderlist[i].isVisible = ($scope.newsubfolderlist[i].lock_folder == true) ? ($scope.newsubfolderlist[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                     }
                 }
                     $scope.newfolder_poi_contactslist = data.data.folder_poi_contacts;
                     console.log($scope.newsubfolderlist)
//                            $scope.newfolderdata[i].newsubfolderlist.push(data.data.sub_folder_list);
//                            $scope.newfolderdata[i].newfolder_poi_contacts.push(data.data.folder_poi_contacts);
                            //$scope.checkLength("");
                            $scope.$apply();
//                            console.log("success",$scope.newsubfolderlist,$scope.newfolder_poi_contactslist)
                        }, function () {
                            console.log('error')
//                        })
//                }
                })
//            },500)
//                console.log($scope.newfolderdata);
            }
            $scope.backfolder = function(folderobj){
                //$scope.console.log($scope.folderarray)
                console.log($scope.folderarray)
                $scope.folderarray.pop();
                 $scope.foldernamedata.pop();
                console.log($scope.folderarray.length)
                if($scope.folderarray.length=="")
                {
                    $scope.movemainfolder=false;
                    console.log($scope.movemainfolder,"backfol")
                $scope.folderid = "";
                $scope.clickfolder = true;
                $scope.clicksubfolder = true;
                $scope.clicksubfolder2 = true;
                
                }
                else
                {
                    
                console.log("here")
                 
                //console.log($scope.folderarray[$scope.folderarray-1]);
                $scope.backsubfolder($scope.folderarray[$scope.folderarray.length-1],$scope.foldernamedata[$scope.foldernamedata.length-1]);
                }
            }
            $scope.backsubfolder = function(main,fname){
                $scope.mainfolderid=main;
                $scope.mainfoldername=fname;
                //$scope.folderid=$scope.mainfolderid;
                modifires.getSubFolder($scope.mainfolderid).then(function (data) {
                     console.log(data);
                     $scope.newsubfolderlist = data.data.sub_folder_list;
                     if($scope.newsubfolderlist)
                     {
                     for (var i = 0; i < $scope.newsubfolderlist.length; i++) {
                        $scope.newsubfolderlist[i].isVisible = ($scope.newsubfolderlist[i].lock_folder == true) ? ($scope.newsubfolderlist[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                     }
                 }
                     $scope.newfolder_poi_contactslist = data.data.folder_poi_contacts;
                     
//                            $scope.newfolderdata[i].newsubfolderlist.push(data.data.sub_folder_list);
//                            $scope.newfolderdata[i].newfolder_poi_contacts.push(data.data.folder_poi_contacts);
                            //$scope.checkLength("");
                            $scope.$apply();
                           // console.log("success",$scope.newsubfolderlist,$scope.newfolder_poi_contactslist)
                        }, function () {
                            console.log('error')
//                        })
//                }
                })
                //console.log("backsubfolder",subfolderobj)
                $scope.clicksubfolder = false;
                 $scope.clicksubfolder2 = true;
            }
            //$scope.foldername=fldrname;
//            $scope.checkedItems= function(folderid)
//            {
//                
//                $scope.folderid = folderid;
//            }
           $scope.movefolder = function() {
               //console.log($scope.folderid,flag,moveshareid)
////               if(!$scope.folderid)
//               {
//                    $('.transparent-move-overlay').fadeIn(1000);
//                       $('#boxscroll3').css('overflow-y','hidden');
////                    alert("Please Select CID/POI")
//                $timeout(function(){
//                        $('.transparent-move-overlay').fadeOut(1000);
//                        $('#boxscroll3').css('overflow-y','auto');
////                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
//                },1000)
//                    return false;
////               }
            if(!$scope.folderid && flag=="false" && moveshareid=="")
            {
                $scope.folderid="";
            }else if(!$scope.folderid)
            {
                $('.transparent-move-overlay').fadeIn(1000);
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transparent-move-overlay').fadeOut(1000);
                        $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },1000)
                    return false; 
            }
                    var movedata={};
                    movedata.post_data_string = {
                        "method": "editfolder",
                        "folder_name": $scope.mainfoldername,
                        "folder_id":$scope.folderid,
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "share_type_poi_id": movepoiid,
                        "share_type_cid_id": "",
                        "sub_type": "device",
                        "parent_id":""
                    }
                    dyrctservice.post(movedata, function(success) {
                        if(success.data.message=="Folder can not move.")
                        {
                            
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Folder cannot be moved.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("cid")
                })                            

                            $uibModalInstance.close();
                            return false;
                        }
                        if(success.data.message=="CID/POI cannot moved")
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'CID/POI cannot be moved';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("cid")
                })                            

                            $uibModalInstance.close();
                            return false;
                        }
                        if(success.settings.message=="Address/Contact added successfully.")
                        {
                            console.log("addes")
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Address/Contact added successfully.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("cid")
                })                            

                            $uibModalInstance.close();
                            return false;
                        }
                        
                        $uibModalInstance.close();
//                        $window.location.reload();
                    }, function(error) {
                        console.log(error);
                    });
            }
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
            
        }])

});