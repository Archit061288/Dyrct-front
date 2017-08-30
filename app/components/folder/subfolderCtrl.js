define(['angularAMD', 'components/folder/foldersubfolderCtrl', 'components/folder/foldersubfolderaddcidCtrl','components/folder/sharefolderCtrl', 'components/folder/showCtrl','components/folder/foldermoveCtrl','components/groups/deletegroupCtrl','components/folder/sharecidpoiCtrl'], function (angularAMD) {

    angularAMD.controller('subfolderCtrl', ['$scope', '$rootScope', '$uibModal', '$location', 'dyrctservice', 'GLOBALS', 'getUserFolderData', 'getSubFolderData', '$window', 'getOneSubFolderData', 'modifires', '$cookieStore', '$stateParams',"$filter",'$timeout','$stateParams','$state',
        function ($scope, $rootScope, $uibModal, $location, dyrctservice, GLOBALS, getUserFolderData, getSubFolderData, $window, getOneSubFolderData, modifires, $cookieStore, $stateParams,$filter,$timeout,$stateParams,$state) {
            // $rootScope.$on("userSearch", function (event, data) {
            //     $scope.q = {};
            //     $scope.q.searchName = data;
            // })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $scope.search = {"searchName":""};
            $scope.usertype=false;
            $scope.productsss = []; 
            $scope.productsss1 = []; 
            $scope.route1=true;
            $rootScope.$broadcast("route1fol",$scope.route1);
            
            //$rootScope.route1Active="active";
        $rootScope.$on("userSearch", function(event, data) {


                $scope.search.searchName = data;
               // console.log("++" + $scope.search.searchName);
            })
            
            $scope.checkrecord=function(newVal){
                $scope.productsssnew = $filter('searchdata')($scope.subfolderlist, newVal,'folder_name') ? $filter('searchdata')($scope.subfolderlist, newVal,'folder_name'):[];
                $scope.productsss=[];
                for (var i = 0; i < $scope.productsssnew.length; i++) {
                    if($scope.productsssnew[i].status != "inactive"){
                        $scope.productsss.push($scope.productsssnew[i]);
                    }
                }
                $scope.productsss1new = $filter('searchdata')($scope.folderpoicontactslist, newVal,'title')?$filter('searchdata')($scope.folderpoicontactslist, newVal,'title'):[];                
                $scope.productsss1=[];
                for (var i = 0; i < $scope.productsss1new.length; i++) {
                    if($scope.productsss1new[i].status != "inactive"){
                        $scope.productsss1.push($scope.productsss1new[i]);
                    }
                }
             
                    if (($scope.productsss && $scope.productsss.length == 0) && ($scope.productsss1 && $scope.productsss1.length == 0))
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                        $scope.resultflag = false;
//                    }
                } else
                {
                    $scope.resultflag = true;
                }
                
                if($scope.subfolderlist)
                {
                    for (var i = 0; i < $scope.subfolderlist.length; i++) {
                        $scope.subfolderlist[i].isVisible = ($scope.subfolderlist[i].lock_folder == true) ? ($scope.subfolderlist[i].created_owner_id == $scope.MyCID._id.$id) ? true : false : true;                    
                    }
                } 
            }
            $scope.$watch('search.searchName', function(newVal) {
                $scope.checkrecord(newVal);
                
                //console.log(newVal)
                //$scope.products_new.push()
            });
            
            $rootScope.topsearch=true;
            $scope.showpopover = false;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.folderlist = getUserFolderData.data;
            $scope.currentfolderdata = getOneSubFolderData.data;
            //console.log("Login User: "+$scope.MyCID._id.$id);
            //console.log($scope.currentfolderdata);
            $scope.isVisible = ($scope.currentfolderdata.lock_folder) ? ($scope.currentfolderdata.created_owner_id == $scope.MyCID._id.$id) ? true : false : true;
            console.log($scope.isVisible);            
            //$scope.isVisible = $scope.currentfolderdata.lock_folder;
            //Check Folder Permission 
            /*
            $scope.parentid = ($scope.currentfolderdata.parent_id != '') ?  $scope.currentfolderdata.parent_id : $stateParams.id;            
            $scope.parentid = $stateParams.id;
            var parentIndex = $scope.folderlist.map(function(e) { return e.folder_id; });
            var parentIndex = $scope.folderlist.map(function(e) { return e.folder_id; }).indexOf($scope.parentid);
            if(parentIndex > -1)
            {
                $scope.parentFolder = $scope.folderlist[parentIndex];            
                $scope.isVisible = ($scope.parentFolder.lock_folder) ? ($scope.parentFolder.created_owner_id == $scope.MyCID._id.$id) ? true : false : true;
            }else{
                $scope.isVisible = true;
            }
            */
            
            if($scope.folderlist.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            $scope.templateUrl = 'myPopoverTemplate.html';
            if (getSubFolderData.data.length != 0) {
                $scope.subfolderlist = getSubFolderData.data.sub_folder_list;                
                //console.log($scope.subfolderlist);
            }
            
            $scope.folderpoicontactslist = getSubFolderData.data.folder_poi_contacts;            
            
            $scope.openModalfolder = function (id, name, foldertype, subtype, tags, lock_folder) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldersubfoldercreate.html",
                    controller: 'foldersubfolderCtrl',
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
                        subtype: function () {
                            return subtype;
                        },
                        tags: function () {
                            return tags;
                        },
                        lock_folder: function () {
                            return lock_folder;
                        },
                        parentfolderdata: function () {
                            return getOneSubFolderData.data;
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
                    modifires.getSubFolder($stateParams.id).then(function (data) {
                        $scope.subfolderlist = data.data.sub_folder_list;
                        $scope.checkrecord("");
                        angular.forEach($scope.subfolderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                   // console.log(data)
                }
                
                
            })
                    }, function (error) {
                    })
                }, function () {

                });

            };
            
            $scope.openModaladdcidfolder = function (id, name, foldertype, subtype) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldersubfolderaddcid.html",
                    controller: 'foldersubfolderaddcidCtrl',
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
                        subtype: function () {
                            return subtype;
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
                    modifires.getSubFolder($stateParams.id).then(function (data) {
                        $scope.subfolderlist = data.data.sub_folder_list;
                        $scope.checkrecord("");
                        angular.forEach($scope.subfolderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                   // console.log(data)
                }
                
                
            })
                    }, function (error) {
                    })
                }, function () {

                });

            };
            
            
            $scope.openModalsharefolder = function (idcur, idpre, name) {
                    //console.log(idcur, idpre, name);
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
                    $window.location.reload();
                }, function () {

                });

            };
            
            $scope.openModalmove = function (currentfolderdata,movefolderid,fldrname,flag,showsubfolder) {
                //console.log("move",showsubfolder);
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
                            return currentfolderdata;
                        },
                        showsubfolder: function () {
                            return showsubfolder;
                        },
                        currentfolderbyparam: function () {
                            return "";
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
                    if(showsubfolder == 'folder')
                    {
                    modifires.getUserFolder().then(function (data) {
                        $scope.folderlist = data.data;
//                        $scope.checkFolderlist();
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }
                if(showsubfolder == 'subfolder')
                {
                    modifires.getSubFolder($stateParams.id).then(function (data) {
                        $scope.subfolderlist = data.data.sub_folder_list;
                        $scope.folderpoicontactslist = data.data.folder_poi_contacts;
//                        $scope.checkFolderlist();
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }
                }, function () {

                });

            };
            
             $scope.openModalmovepoi = function (moveshareid,movefolderid,fldrname,flag,showsubfolder) {
                //console.log("move",moveshareid);
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/foldercidpoimove.html",
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
                            return moveshareid;
                        },
                        currentfolderdata: function () {
                            return "";
                        },
                        showsubfolder: function () {
                            return showsubfolder;
                        },
                        currentfolderbyparam: function () {
                            return $stateParams.id;
                        },
                        subfolderdata: function () {
                            
                            var returndata = modifires.getSubFolder($stateParams.id).then(function (data) {
                                //console.log(data.data);
                                return data.data;
                            });

                            return returndata;
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
                    modifires.getSubFolder($stateParams.id).then(function (data) {
                        $scope.subfolderlist = data.data.sub_folder_list;
                        $scope.folderpoicontactslist = data.data.folder_poi_contacts;
//                        $scope.checkFolderlist();
                    ga("send", "event", {eventCategory: "Move CID/POI", eventAction: "Move CID/POI", eventLabel: "Move Folder CID/POI", userId: $scope.MyCID._id.$id});
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };
            
            $scope.openModalsavepoi = function (type,typeid,public_note,url,phone) {
                var typepoi=type.toLowerCase();
                
                    var savepoidata={};
                    savepoidata.post_data_string = {
                        "method": "saveAsPoiCid",
                        "type":typepoi,
                        "type_id":typeid,
                        "public_note":public_note,
                        "url":url,
                        "phone":phone,
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token
                        
                    }
                    dyrctservice.post(savepoidata, function(success) {
                        ga("send", "event", {eventCategory: "Save CID/POI", eventAction: "Save CID/POI", eventLabel: "Save Folder CID/POI", userId: $scope.MyCID._id.$id});
                        if(success.data.message == 'Contact saved successfully.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Contact saved successfully.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("general")
                })
                        }    
                        if(success.data.message == 'Address saved successfully.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Address saved successfully.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("general")
                })
                        }
                        if(success.data.message == 'You already have this name in your Contacts.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this name in your Contacts.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("cid")
                })
                        }
                        if(success.data.message == 'You already have this Address in your Address list.')
                        {
                            console.log("console")
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this Address in your Address list.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("poi")
                })
                        }
                        if(success.data.message == 'Address deleted By Owner.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Address deleted By Owner.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("poi")
                })
                        }
                         if(success.data.message == 'Contact deleted by owner.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Contact deleted by Owner.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("poi")
                })
                        }
                        
                        
                    }, function(error) {
                        console.log(error);
                    });

            };
            
            $scope.openModalsharecidpoi = function(check, id, userid) {
                
                if (check == 'CID')
                {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/sharecidpoi.html",
                        controller: 'sharecidpoiCtrl',
                        resolve: {
                            check: function() {
                                return check;
                            },
                            id: function() {
                                return id;
                            },
                            userid: function() {
                                return userid;
                            }
                        }
                    });
                    modalInstance.result.then(function(selectedItem) {
                        modifires.getUserContacts().then(function(data) {
                            $scope.usercontects = data.data.data.allContact[0];
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        }),
                                modifires.getUserContacts().then(function(data) {
                            $scope.userpoi = data.data.data.allPoi;
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        })
                    }, function() {

                    });
                }
                else if (check == 'POI')
                {
                    
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/sharecidpoi.html",
                        controller: 'sharecidpoiCtrl',
                        resolve: {
                            check: function() {
                                return check;
                            },
                            id: function() {
                                return id;
                            },
                            userid: function() {
                                return userid;
                            }
                        }
                    });
                    modalInstance.result.then(function(selectedItem) {
                        modifires.getUserContacts().then(function(data) {
                            $scope.usercontects = data.data.data.allContact[0];
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        }),
                            modifires.getUserContacts().then(function(data) {
                            $scope.userpoi = data.data.data.allPoi;
                            //console.log("success")
                        }, function() {
                            console.log('error')
                        })
                    }, function() {

                    });
                }


            };
            
            $scope.showtooltip = function ()
            {
                $scope.tooltipText = "";
            }
            
            $scope.changeusertype=function()
            {
                $scope.usertype=true;
            }
            
            $scope.focus = function() {
                $scope.showstatus = true;
            }
            $scope.blur = function() {

                $timeout(function() {
                    $scope.showstatus = false;
                }, 5000);
            }
            
            $scope.openModalshow = function (check, obj,con) {
                //console.log(obj,check);
                $scope.showpopover = true;
                $scope.usercontactshowdata=obj;
                
                //console.log($scope.userfolderdata);
                 //======== Open Popup ========//
//                $('#dyrct_popup_listing').find('.dyrct_popup_btn').click(function(event) {
                var content = $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '');
                $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '').addClass('dyrct_popup_active');
                $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '').parent().parent().addClass('dyrct_popup_active');
                $('#dyrct_popup').show();
                //$(this).addClass('dyrct_popup_active');
                
                var getPosition = $(content).offset();
                var winscroll = $(window).scrollTop();
                var winhei = $(window).height();
                var currentPosition = getPosition.top;
                var popuptop = currentPosition - 130;
                var totalhei = popuptop + 350;
                if (popuptop < 15) {
                    var popuptop = 25;
                }
                if (totalhei > (winhei - 30)) {
                    var popuptop = winhei - 350;
                }
                var popupleft = getPosition.left - 585;
                $('body').css('overflow', 'hidden');
                var arrow_position = (currentPosition - popuptop) + 18;
                $('#dyrct_popup').find('.arrow_black').css('top', arrow_position + 'px');
                $('#dyrct_popup').find('.custom_popup').css({'top': popuptop + 'px', 'left': popupleft + 'px'});
//                });


                $(window).resize(function() {
                    if ($('#dyrct_popup').css('display') == 'block') {

                        var getPosition = $('#dyrct_popup_listing').find('.dyrct_popup_btn.dyrct_popup_active').offset();
                        var winscroll = $(window).scrollTop();
                        var popupleft = getPosition.left - 500;
                        $('#dyrct_popup').find('.custom_popup').css({'left': popupleft + 'px'});
                    }
                });
//                var folderdata = {};
//                    folderdata.post_data_string = {
//                        "method": "getpoicid",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "type": $scope.userfolderdata.share_type,
//                        "type_id":$scope.userfolderdata.share_type_id
//                    }
//                    dyrctservice.post(folderdata, function (success) {
//                       
//                        $scope.usercontactshowdata=success.data[0];
//                        if($scope.userfolderdata.note!="")
//                        {
//                            $scope.usercontactshowdata.note=$scope.userfolderdata.note;
//                        }
//                        else
//                        {
//                           $scope.usercontactshowdata.note="";
//                        }
////                        modifires.getpoicid($stateParams.id).then(function (data) {
////                            $scope.subfolderlist = data.data.sub_folder_list;
////                            console.log("success")
////                        }, function () {
////                            console.log('error')
////                        })
//                    }, function (error) {
//                        console.log(error);
//                    });
                

            };
            $scope.closepopup = function(id,sid) {
                //console.log(id, sid, $scope.usertype)
                if ($scope.usertype==true)
                {
                    
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "folder_id": id,
                        "share_type_id": sid,
                        "method": "addnotesbyfolder",
                        "note": $scope.usercontactshowdata.note,
                        "public_note": $scope.usercontactshowdata.public_note,
                        "url": $scope.usercontactshowdata.url,
                        "phone": $scope.usercontactshowdata.phone
                    }
                    dyrctservice.post(folderdata, function(success) {
                      modifires.getSubFolder(id).then(function (data) {
                            $scope.subfolderlist = data.data.sub_folder_list;
                            $scope.folderpoicontactslist = data.data.folder_poi_contacts;
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function(error) {
                        console.log(error);
                    });
                }
                // $('#dyrct_popup').hide();
                $scope.showpopover = false;
                $('#dyrct_popup_listing').find('.dyrct_popup_btn').removeClass('dyrct_popup_active');
                $('#dyrct_popup_listing').find('.btn-hover').removeClass('dyrct_popup_active');
                $('body').css('overflow', 'auto');
                $scope.usertype=false;
            }
            $scope.deletefolder = function (folderid,foldername) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Do you want to delete <span class="delete-title">'+foldername+'</span> folder ?';
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
                        modifires.getSubFolder($stateParams.id).then(function (data) {
                            $scope.subfolderlist = data.data.sub_folder_list;
                            
                            $scope.checkrecord("");
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function (error) {
                        console.log(error);
                    });
            })
//                if (confirm('Do you want to delete this folder. ?')) {
//                    var folderdata = {};
//                    folderdata.post_data_string = {
//                        "method": "deletefolder",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "folder_id": folderid
//                    }
//                    dyrctservice.post(folderdata, function (success) {
//                        modifires.getSubFolder($stateParams.id).then(function (data) {
//                            $scope.subfolderlist = data.data.sub_folder_list;
//                            $scope.checkrecord("");
//                            console.log("success")
//                        }, function () {
//                            console.log('error')
//                        })
//                    }, function (error) {
//                        console.log(error);
//                    });
//                }
            };
            $scope.deletefolderpoicontacts = function (contactid, folderid) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Do you want to delete this Contact/Address from this folder ?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "deletefoldercontactpoi",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "folder_id": folderid,
                        "contact_id": contactid
                    }

                    dyrctservice.post(folderdata, function (success) {
                        modifires.getSubFolder($stateParams.id).then(function (data) {
                            //console.log(data);
                            $scope.subfolderlist = data.data.sub_folder_list;
                            $scope.checkrecord("");
                            $scope.folderpoicontactslist = data.data.folder_poi_contacts;
                            ga("send", "event", {eventCategory: "Delete CID/POI", eventAction: "Delete CID/POI", eventLabel: "Delete Folder CID/POI", userId: $scope.MyCID._id.$id});
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function (error) {
                        console.log(error);
                    }); 
            })
//                if (confirm('Do you want to delete this POI?')) {
//                    var folderdata = {};
//                    folderdata.post_data_string = {
//                        "method": "deletefoldercontactpoi",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "folder_id": folderid,
//                        "contact_id": contactid
//                    }
//
//                    dyrctservice.post(folderdata, function (success) {
//                        modifires.getSubFolder($stateParams.id).then(function (data) {
//                            console.log(data);
//                            $scope.subfolderlist = data.data.sub_folder_list;
//                            $scope.checkrecord("");
//                            $scope.folderpoicontactslist = data.data.folder_poi_contacts;
//                            console.log("success")
//                        }, function () {
//                            console.log('error')
//                        })
//                    }, function (error) {
//                        console.log(error);
//                    });
//                }
            };
            $scope.back = function () {
                $window.history.back();
            }
            
            angular.forEach($scope.subfolderlist,function(data,index){
                
                if(data.hash_tag)
                {
                    var str=data.hash_tag;
                    //console.log(data.hash_tag)
                    data.hash_tag=str.split(',').join(', ');
                   // console.log(data)
                }
                
                
            })

        }])
   
});