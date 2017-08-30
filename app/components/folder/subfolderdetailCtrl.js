define(['angularAMD', 'components/folder/foldersubfolderCtrl','components/folder/foldermoveCtrl','components/groups/deletegroupCtrl','components/folder/sharecidpoiCtrl'], function (angularAMD) {

    angularAMD.controller('subfolderdetailCtrl', ['$scope', '$stateParams', '$uibModal', '$location', 'dyrctservice', 'GLOBALS', '$window', 'getOneSubFolderData', 'getSubFolderData', '$cookieStore', '$stateParams', 'modifires', '$rootScope', '$filter','$timeout','$state',
        function ($scope, $stateParams, $uibModal, $location, dyrctservice, GLOBALS, $window, getOneSubFolderData, getSubFolderData, $cookieStore, $stateParams, modifires, $rootScope, $filter,$timeout,$state) {
            $scope.currentfolderdata = getOneSubFolderData.data;
            // $rootScope.$on("userSearch", function (event, data) {
            //     $scope.q = {};
            //     $scope.q.searchName = data;
            // })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $scope.usertype=false;
            $scope.search = {"searchName": ""};
            $scope.checkLength = function (newVal) {
                $scope.productsss = $filter('searchdata')($scope.folder_poi_contacts, newVal, 'title,address')?$filter('searchdata')($scope.folder_poi_contacts, newVal, 'title,address'):[];
                //console.log($scope.productsss)
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
            }
            $scope.productsss = [];
            $rootScope.$on("userSearch", function (event, data) {


                $scope.search.searchName = data;
                // console.log("++" + $scope.search.searchName);
            })
            $scope.$watch('search.searchName', function (newVal) {
                $scope.checkLength(newVal);


                //console.log(newVal)
                //$scope.products_new.push()
            });
            $rootScope.topsearch = true;
            $scope.folder_poi_contacts = getSubFolderData.data.folder_poi_contacts;
            $scope.folderpoicontacts = getSubFolderData.data;
            if($scope.folderpoicontacts.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
//            $scope.subfolderlist = getSubFolderData.data.sub_folder_list;
            //console.log($scope.folder_poi_contacts);
            $scope.id = $stateParams.id;
            //console.log($scope.folder_poi_contacts)
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.templateUrl = 'myPopoverTemplate.html';
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
                        //$window.location.reload();
                        modifires.getSubFolder($stateParams.id).then(function (data) {
                            $scope.folder_poi_contacts = data.data.folder_poi_contacts;
                            ga("send", "event", {eventCategory: "Delete CID/POI", eventAction: "Delete CID/POI", eventLabel: "Delete Sub Folder CID/POI", userId: $scope.MyCID._id.$id});
                            $scope.checkLength("");
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
//                    dyrctservice.post(folderdata, function (success) {
//                        //$window.location.reload();
//                        modifires.getSubFolder($stateParams.id).then(function (data) {
//                            $scope.folder_poi_contacts = data.data.folder_poi_contacts;
//                            $scope.checkLength("");
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
            
            $scope.openModalshow = function (check, type, id, con,obj) {
                $scope.showpopover = true;
                $scope.usercontactshowdata=obj;
                //console.log(obj);
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
                var currentPosition = getPosition.top - winscroll;
                var popuptop = currentPosition - 130;
                var totalhei = popuptop + 295;
                if (popuptop < 15) {
                    var popuptop = 25;
                }
                if (totalhei > (winhei - 30)) {
                    var popuptop = winhei - 295;
                }
                var popupleft = getPosition.left - 585;
                $('body').css('overflow', 'hidden');
                var arrow_position = (currentPosition - popuptop) + 18;
                $('#dyrct_popup').find('.arrow_black').css('top', arrow_position + 'px');
                $('#dyrct_popup').find('.custom_popup').css({'top': popuptop + 'px', 'left': popupleft + 'px'});
//                });


                $(window).resize(function () {
                    if ($('#dyrct_popup').css('display') == 'block') {

                        var getPosition = $('#dyrct_popup_listing').find('.dyrct_popup_btn.dyrct_popup_active').offset();
                        var winscroll = $(window).scrollTop();
                        var popupleft = getPosition.left - 500;
                        $('#dyrct_popup').find('.custom_popup').css({'left': popupleft + 'px'});
                    }
                });
//                var folderdata = {};
//                folderdata.post_data_string = {
//                    "method": "getpoicid",
//                    "userId": $scope.MyCID._id.$id,
//                    "web_token": $scope.MyCID.web_token,
//                    "type": type,
//                    "type_id": id
//                }
//                dyrctservice.post(folderdata, function (success) {
//                    //console.log(success.data[0]);
//                    $scope.usercontactshowdata = success.data[0];
//                    console.log($scope.userfolderdata);
//                    if($scope.userfolderdata.note!="")
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
//                }, function (error) {
//                    console.log(error);
//                });

//               
            };
            
            $scope.openModalmovepoi = function (moveshareid,movefolderid,fldrname,flag,showsubfolder) {
                //console.log("move");
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
                    ga("send", "event", {eventCategory: "Move CID/POI", eventAction: "Move CID/POI", eventLabel: "Move Sub Folder CID/POI", userId: $scope.MyCID._id.$id});
                    modifires.getSubFolder($stateParams.id).then(function (data) {
                        //$scope.subfolderlist = data.data.sub_folder_list;
                        $scope.folder_poi_contacts = data.data.folder_poi_contacts;
//                        $scope.checkFolderlist();
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                
                
                }, function () {

                });

            };
            
             $scope.openModalsavepoi = function (type,typeid) {
                var typepoi=type.toLowerCase();
                
                    var savepoidata={};
                    savepoidata.post_data_string = {
                        "method": "saveAsPoiCid",
                        "type":typepoi,
                        "type_id":typeid,
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token
                        
                    }
                    dyrctservice.post(savepoidata, function(success) {
                        ga("send", "event", {eventCategory: "Save CID/POI", eventAction: "Save CID/POI", eventLabel: "Save Sub Folder CID/POI", userId: $scope.MyCID._id.$id});
                        if(success.data.message == 'CID Added Successfully.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'CID/POI Saved Successfully';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("general")
                })
                        }    
                        if(success.data.message == 'POI Added Successfully.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'CID/POI Saved Successfully';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("general")
                })
                        }
                        if(success.data.message == 'You already have this CiD in your Contacts.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this CiD in your Contacts.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                     //console.log("cid")
                })
                        }
                        if(success.data.message == 'You already have this POI in your POI list.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this POI in your POI list.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log("poi")
                })
                        }
                        if(success.data.message == 'POI Deleted By Owner.')
                        {
                            var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'POI Deleted By Owner.';
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
                        ga("send", "event", {eventCategory: "Share CID/POI", eventAction: "Share CID/POI", eventLabel: "Share Sub Folder CID/POI", userId: $scope.MyCID._id.$id});
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
                        ga("send", "event", {eventCategory: "Share CID/POI", eventAction: "Share CID/POI", eventLabel: "Share Sub Folder CID/POI", userId: $scope.MyCID._id.$id});
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
            $scope.closepopup = function (id,sid) {
                // $('#dyrct_popup').hide();
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
                        "note": $scope.usercontactshowdata.note
                    }
                    dyrctservice.post(folderdata, function(success) {
                      modifires.getSubFolder(id).then(function (data) {
                         $scope.folder_poi_contacts = data.data.folder_poi_contacts;
                         //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function(error) {
                        console.log(error);
                    });
                }
                
                
                $scope.showpopover = false;
                $('#dyrct_popup_listing').find('.dyrct_popup_btn').removeClass('dyrct_popup_active');
                $('#dyrct_popup_listing').find('.btn-hover').removeClass('dyrct_popup_active');
                $('body').css('overflow', 'auto');
                $scope.usertype=false;
            }

        }])

});