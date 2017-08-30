define(['angularAMD', 'components/folder/foldercreateeditCtrl', 'components/folder/foldercreatecidCtrl','components/folder/sharefolderCtrl','components/folder/foldermoveCtrl','components/groups/deletegroupCtrl', 'components/folder/savefolderCtrl'], function (angularAMD) {

    angularAMD.controller('folderCtrl', ['$scope', '$rootScope', '$uibModal', '$location', 'dyrctservice', 'GLOBALS', 'getUserFolderData', '$window', 'getOneSubFolderData', 'modifires', '$cookieStore', "$filter",'$state',
        function ($scope, $rootScope, $uibModal, $location, dyrctservice, GLOBALS, getUserFolderData, $window, getOneSubFolderData, modifires, $cookieStore, $filter,$state) {
            // $rootScope.$on("userSearch", function(event, data) {
            //     $scope.q = data;
            // })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $rootScope.$emit("notificationservice")
            $scope.search = {"searchName": ""};
            $scope.route1=true;
            $scope.subfolderactive=false;
            $rootScope.$broadcast("route1fol",$scope.route1);
            $scope.searchFolderData = [];
            $scope.localfolderlist = true;
            var folder_value=[];
            $scope.productsss = [];
            $rootScope.$on("userSearch", function (event, data) {
                
                if($scope.search.type == undefined || $scope.search.type == '')
                {
                    $scope.search.searchName = data;
                    
                }
                $scope.search.searchGlobelName = data;                    
                
                // console.log("++" + $scope.search.searchName);
            })
            $rootScope.$on("userSearchType", function (event, data) {
                
                $scope.search.type = data;
                console.log($scope.search.type,"hello")
                
            })
            $scope.$watch('search.type', function (newVal) {
                //console.log("By Type");
                //console.log("search.searchGlobelName "+$scope.search.searchGlobelName);
                //console.log("search.type "+newVal);                
                
                if($scope.search.searchGlobelName != undefined && $scope.search.searchGlobelName != '' && newVal != undefined && newVal != '')
                {
                    console.log("hello2")
                    $scope.localfolderlist = false;
                    $scope.search.searchName = '';
                    // Search By Tag
                    modifires.getuserfolderhashtag($scope.search.searchGlobelName,newVal).then(function (data) {
                        $scope.searchFolderData = data.data;
                        console.log($scope.searchFolderData);
                        if($scope.searchFolderData.length==0){
                            console.log($scope.searchFolderData.length)
                            $scope.resultsubfolderlist=true;
                            $scope.resultflag=true;
                        }
                        else
                        {
                            angular.forEach($scope.searchFolderData,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                    console.log(data)
                }
                
                
            })
                            $scope.resultflag=true;
                            $scope.resultsubfolderlist=false;
                        }
                    });                   
                }else{
                    //console.log("hello3")
                    //console.log("if")
                    $scope.localfolderlist = true;
                    $scope.subfolderactive = false;
                    $scope.resultsubfolderlist=false;
                }

            });
            
            $scope.$watch('search.searchName', function (newVal) {                
                if($scope.search.type == undefined)
                {
                    //console.log("hello0")
                    $scope.subfolderactive=false;
                    //console.log($scope.subfolderactive,"subfactive")
                    //console.log("folderacitve")
                    $scope.localfolderlist = true;
                    $scope.productsss = $filter('searchdata')($scope.folderlist, newVal, 'folder_name');
                    
                    if ($scope.productsss && $scope.productsss.length == 0)
                    {
                        //console.log("herete")
                        $scope.resultflag = false;
                    } else {
                        $scope.resultflag = true;
                    } 
                }
            });

            $scope.$watch('search.searchGlobelName', function (newVal) {
                //console.log("By Name");
                //console.log("search.searchGlobelName "+newVal);
                //console.log("search.type "+$scope.search.type);
                //console.log("hello1")
                // Search By Tag
                if(newVal != undefined && newVal != '' && $scope.search.type != undefined && $scope.search.type != ''){
//                    if($scope.search.type=="tag")
//                    {
//                        var hashtag=newVal.slice(0,1);
//                        if(hashtag=="#")
//                        {
//                            $scope.localfolderlist = false;
//                            $scope.resultsubfolderlist=true;
//                            $scope.resultflag=true;
//                        }
//                        else
//                        {
//                            $scope.localfolderlist = false;
//                    $scope.search.searchName = '';
//                    modifires.getuserfolderhashtag(newVal,$scope.search.type).then(function (data) {                        
//                        $scope.searchFolderData = data.data;
//                        console.log($scope.searchFolderData,"here");
//                        //console.log($scope.searchFolderData.length);
//                        if($scope.searchFolderData.length==0){
//                            $scope.resultsubfolderlist=true;
//                            $scope.resultflag=true;
//                        }
//                        else
//                        {
//                            $scope.resultsubfolderlist=false;
//                        }
//                    }); 
//                        }
//                    }
//                    else
//                    {
                    $scope.localfolderlist = false;
                    $scope.search.searchName = '';
                    modifires.getuserfolderhashtag(newVal,$scope.search.type).then(function (data) {                        
                        $scope.searchFolderData = data.data;
                        //console.log($scope.searchFolderData,"here");
                        //console.log($scope.searchFolderData.length);
                        if($scope.searchFolderData.length==0){
                            console.log("hello5")
                            $scope.resultsubfolderlist=true;
                            $scope.resultflag=true;
                        }
                        else
                        {
                            $scope.resultsubfolderlist=false;
                        }
                    });                  
                
            }
                else
                {
                    $scope.productsss = $filter('searchdata')($scope.folderlist, newVal, 'folder_name');
                    
                    if ($scope.productsss && $scope.productsss.length == 0)
                    {
                        
                        $scope.resultflag = false;
                    } else {
                        $scope.resultflag = true;
                    }
                }
                
            });
                

            $rootScope.openclass = false;
            $rootScope.topsearch = true;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.folderlist = getUserFolderData.data;
            //console.log($scope.folderlist);
            
            if($scope.folderlist.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            
            $scope.currentfolderdata = getOneSubFolderData.data;
            $scope.checkFolderlist = function () {
                $scope.finalFolderlist = [];
                for (var i = 0; i < $scope.folderlist.length; i++) {
                    if ($scope.folderlist[i].status != "inactive") {
                        $scope.finalFolderlist.push($scope.folderlist[i])
                    }
                    $scope.folderlist[i].isVisible = ($scope.folderlist[i].lock_folder == true) ? ($scope.folderlist[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                }
            }
            $scope.checkFolderlist();
            
            //console.log(getSubFolderData);
//            $scope.subfolderlist = getSubFolderData.data.sub_folder_list;
            $scope.openModalfolder = function (id, name, tags, lock_folder, foldertype) {
                //console.log(name);

                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldercreateedit.html",
                    controller: 'foldercreateeditCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        },
                        name: function () {
                            return name;
                        },
                        tags: function () {
                            return tags;
                        },
                        lock_folder:function() {
                            return lock_folder;
                        },
                        foldertype: function () {
                            return foldertype;
                        },
                        subfolderdata: function () {
                            var returndata = modifires.getSubFolder(id).then(function (data) {
                                //console.log(data.data);
                                return data.data;
                            });

                            return returndata;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserFolder().then(function (data) {
                        $scope.folderlist = data.data;
                        $scope.checkFolderlist();
                        angular.forEach($scope.folderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                    //console.log(data)
                }
                
                
            })
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };
            
            $scope.openModalAddcid = function (id, name, foldertype) {
                //console.log(name);

                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldercreatecid.html",
                    controller: 'foldercreatecidCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        },
                        name: function () {
                            return name;
                        },
                        foldertype: function () {
                            return foldertype;
                        },
                        subfolderdata: function () {
                            var returndata = modifires.getSubFolder(id).then(function (data) {
                                //console.log(data.data);
                                return data.data;
                            });

                            return returndata;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserFolder().then(function (data) {
                        $scope.folderlist = data.data;
                        $scope.checkFolderlist();
                        angular.forEach($scope.folderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                    //console.log(data)
                }
                
                
            })
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };
            
            $scope.getsubfolderlist=function(id,value)
            {
                $rootScope.$emit("forldereq");
                folder_value.push(id);
                console.log(folder_value);
                modifires.getSubFolder(id).then(function (data) {
                    $scope.subfolderactive=true;
                        $scope.subfolderlist = data.data.sub_folder_list;
                $scope.folderpoicontactslist = data.data.folder_poi_contacts;            
                        if(!$scope.subfolderlist && !$scope.folderpoicontactslist)
                        {
                            console.log("if")
                            $scope.resultsubfolderlist=true;
                        }
                        else
                        {
                            console.log("else")
                            $scope.resultsubfolderlist=false;
                        }
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
            }
            
             $scope.back = function () {
                 console.log("back")
                 //$rootScope.$emit("forldeback");
                console.log(folder_value[folder_value.length-1],folder_value.length);
                if(folder_value.length==1)
                {
                    $rootScope.$emit("forldeback");
                    folder_value=[];
                    $scope.subfolderactive=false;
                    //console.log($scope.searchFolderData,$scope.localfolderlist);
//                    console.log("search.searchGlobelName "+$scope.search.searchGlobelName);
//                console.log("search.type "+$scope.search.type);
//                if($scope.search.searchGlobelName != undefined && $scope.search.searchGlobelName != '' && $scope.search.type != undefined && $scope.search.type != ''){
//                    $scope.localfolderlist = false;
//                    $scope.search.searchName = '';
//                    modifires.getuserfolderhashtag($scope.search.searchGlobelName,$scope.search.type).then(function (data) {                        
//                        $scope.searchFolderData = data.data;
//                        console.log($scope.searchFolderData,"here");
//                        //console.log($scope.searchFolderData.length);
//                        if($scope.searchFolderData.length==0){
//                            $scope.resultsubfolderlist=true;
//                            $scope.resultflag=true;
//                        }
//                        else
//                        {
//                            $scope.resultsubfolderlist=false;
//                        }
//                    });                  
//                }
                }
                else
                {
                modifires.getSubFolder(folder_value[folder_value.length-2]).then(function (data) {
                    $scope.subfolderactive=true;
                        $scope.subfolderlist = data.data.sub_folder_list;
                $scope.folderpoicontactslist = data.data.folder_poi_contacts;
                console.log($scope.subfolderlist)
                        if(!$scope.subfolderlist && !$scope.folderpoicontactslist)
                        {
                            //console.log("if")
                            $scope.resultsubfolderlist=true;
                        }
                        else
                        {
                            //console.log("else")
                            $scope.resultsubfolderlist=false;
                        }
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                    folder_value.pop();
                    //console.log(folder_value);
                }
                //javascript:history.go(-1);
            }
            
            $scope.openModalmove = function (movefolderid,fldrname,flag,showsubfolder) {
                
                //console.log("move");
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldermove.html",
                    controller: 'foldermoveCtrl',
                    resolve: {
                        movefolderid: function () {
                            return movefolderid;
                        },
                        fldrname: function () {
                            return fldrname;
                        },
                        flag: function () {
                            return flag;
                        },
                        moveshareid: function () {
                            return "";
                        },
                        currentfolderdata: function () {
                            return "";
                        },
                        currentfolderbyparam: function () {
                            return "";
                        },
                        showsubfolder: function () {
                            return showsubfolder;
                        },
                        subfolderdata: function () {
                            return "";
                        },
                        folderdata: function () {
                            var returndata = modifires.getUserFolder().then(function (data) {
                                //console.log(data.data);
                                return data.data;
                          });

                            return returndata;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserFolder().then(function (data) {
                        $scope.folderlist = data.data;
                        $scope.checkFolderlist();
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };
            
            
            $scope.openModalsharefolder = function (idcur, idpre, name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/sharefolder.html",
                    controller: 'sharefolderCtrl',
                    resolve: {
                        idcur: function () {
                            return idcur;
                        },
                        idpre: function () {
                            return idpre;
                        },
                        name: function () {
                            return name;
                        }

                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    //$window.location.reload();
                }, function () {

                });

            };
            $scope.deletefolder = function (folderid,foldername) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            //return 'Do you want to delete <span class="delete-title">'+foldername+'</span> folder ?';
                            return 'Are you sure, Do you want to delete <span class="delete-title">'+foldername+'</span> folder?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                   var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "deletefolder",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "folder_id": folderid
                    }
                    dyrctservice.post(folderdata, function (success) {
                        modifires.getUserFolder().then(function (data) {
                            $scope.folderlist = data.data;
                            $scope.checkFolderlist();
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function (error) {
                        console.log(error);
                    }); 
            })
//                if (confirm('Do you want to delete this folder ?')) {
//                    var folderdata = {};
//                    folderdata.post_data_string = {
//                        "method": "deletefolder",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "folder_id": folderid
//                    }
//                    dyrctservice.post(folderdata, function (success) {
//                        modifires.getUserFolder().then(function (data) {
//                            $scope.folderlist = data.data;
//                            $scope.checkFolderlist();
//                            console.log("success")
//                        }, function () {
//                            console.log('error')
//                        })
//                    }, function (error) {
//                        console.log(error);
//                    });
//                }
            };
           
            // Save Folder
            $scope.saveFolder = function (folderid,folder_name,created_owner_id){
                var folderdata = {};

                folderdata.post_data_string = {
                "method": "savefolderhashtag",
                "userId": $scope.MyCID._id.$id,
                "web_token": $scope.MyCID.web_token,
                "folder_id": folderid,
                "folder_name": folder_name,
                "created_owner_id": created_owner_id,
                "val_msg": "",                
                "type":"false"
                };
                
                dyrctservice.post(folderdata, function (success) {
                    
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
                                return folderid;
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
            
            angular.forEach($scope.folderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                    //console.log(data)
                }
                
                
            })
            angular.forEach($scope.subfolderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                    //console.log(data)
                }
                
                
            })
            
            
            
            
//            $scope.folderclick = function(folderid)
//            {
//                $scope.go("common.subfolder({id:folderid})")
//            }


        }])

});