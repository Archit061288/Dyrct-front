define(['angularAMD', 'components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller("commonlayoutCtrl", ["$scope", "$location", "$cookieStore", "$timeout", "$rootScope", 'getNotificationListData', 'dyrctservice', 'dyrctpoiservice', '$filter', 'modifires', 'trafficCop', '$uibModal', 'GLOBALS','$interval', function ($scope, $location, $cookieStore, $timeout, $rootScope, getNotificationListData, dyrctservice, dyrctpoiservice, $filter, modifires, trafficCop, $uibModal, GLOBALS,$interval) {
            //console.log(getnotificationListData);
            //console.log("here");
            $rootScope.fullc=true;
            $scope.notificatiolist = function () {
                modifires.getNotificationList().then(function (data) {

                    $scope.notificationlist = angular.copy(data.data.data);
                    angular.forEach($scope.notificationlist, function (user, key) {
                        $scope.strr = $scope.notificationlist[key].message;
                        $scope.notificationlist[key].message = $scope.notificationlist[key].message.replace($scope.notificationlist[key].sender_name, ' ')
//                console.log($scope.notificationlist[key].message);
                    });
                }, function () {
                    console.log('error')
                })
            }
            
            
           
             //$scope.notificatiolist();
            $rootScope.$on("notificationservice", function () {
                //console.log("callnotification")
              $scope.notificatiolist();
            })
            $scope.notificatiolist();
            $('body').click(function () {
                $('body').find('div.modal-backdrop').remove();
            });
            
             $scope.notificationcall = function () {
              //$scope.trafficCop.pending.all=-1;
              $scope.notificatiolist();
             };
//             $interval(function () {
//              $scope.trafficCop.pending.all=0;
//               
//            }, 1000);
            $scope.trafficCop = trafficCop;
            

            if($rootScope.userinactive==true)
            {
                $("li.home").addClass("disabled");
                $("li.logBook").addClass("disabled");
                $("li.groups").addClass("disabled");
                $("li.folders").addClass("disabled");
                $("li.settings").addClass("disabled");
                $("li.mbmenu-notification").addClass("disabled");
            }
            if($rootScope.userinactive==false)
            {
                $("li.home").removeClass("disabled");
                $("li.logBook").removeClass("disabled");
                $("li.groups").removeClass("disabled");
                $("li.folders").removeClass("disabled");
                $("li.settings").removeClass("disabled");
                $("li.mbmenu-notification").removeClass("disabled");
            }
            
            $rootScope.$on("route1fol", function (event, data) {
                $scope.routegroup = false;
                $scope.routesetting = false;
                $scope.routehome = false;
                $scope.routelog = false;
                $scope.routefolder = data;
                $scope.routepoi = false; 
                $scope.routeice = false;

            });

            $rootScope.$on("route1group", function (event, data) {
                $scope.routesetting = false;
                $scope.routefolder = false;
                $scope.routehome = false;
                $scope.routelog = false;
                $scope.routegroup = data;
                $scope.routepoi = false; 
                $scope.routeice = false;

            });

            $rootScope.$on("route1setting", function (event, data) {

                $scope.routefolder = false;
                $scope.routegroup = false;
                $scope.routehome = false;
                $scope.routelog = false;
                $scope.routesetting = data;
                $scope.routepoi = false; 
                $scope.routeice = false;

            });

            $rootScope.$on("route1log", function (event, data) {

                $scope.routefolder = false;
                $scope.routegroup = false;
                $scope.routesetting = false;
                $scope.routehome = false;
                $scope.routelog = data;
                $scope.routepoi = false; 
                $scope.routeice = false; 

            });

            $rootScope.$on("route1home", function (event, data) {
                console.log(data,"data")
                $scope.routefolder = false;
                $scope.routegroup = false;
                $scope.routesetting = false;
                if(data == "contact"){
                    $scope.routehome = true;
                    $scope.routepoi = false; 
                    $scope.routeice = false;       
                }else if(data == "poi"){
                    $scope.routepoi = true;
                    $scope.routeice = false;
                    $scope.routehome = false;    
                }else if(data == "ice"){
                    $scope.routeice = true;
                    $scope.routepoi = false;
                    $scope.routehome = false;    
                }
                
                $scope.routelog = false;

            });

            $scope.status = {
                isopen: false
            };
            $scope.isCollapsed = true;
            $scope.check = false;
            $scope.mycid = $cookieStore.get('_qu');
            //console.log($scope.mycid)
            var data = {};
            data.post_data_string = {"method": "getUserGLC", "userId": ($scope.mycid._id ? $scope.mycid._id.$id : $scope.mycid.userId), "web_token": ($scope.mycid.web_token ? $scope.mycid.web_token : $scope.mycid.token)}

            dyrctservice.post(data, function (success) {
                $scope.mycid.profile_pic = success.data[0].profile_pic;
            });
            if ($scope.mycid.allData && $scope.mycid.allData[0].status == 'inactive') {
                //console.log("here");
                $scope.check = true;

            }
            else if ($scope.mycid && $scope.mycid.status == 'inactive')
            {

                $scope.check = true;

            }

            $rootScope.$on('mycid', function (event, data) {
                //console.log('mycid------ on', data)
                $scope.mycid = $cookieStore.get('_qu');
                $scope.check = false;
            });
            $rootScope.$on('image', function (event, data) {
                if (data.data.imageurl) {
                    $scope.mycid.profile_pic = data.data.imageurl;
                    $cookieStore.put('_qu', $scope.mycid);

                }
            });
            $rootScope.openclass = false;
            $scope.open = function () {
                //console.log("click");
                $rootScope.openclass = !$rootScope.openclass;
            }

            $scope.datetimestamp = new Date();
            $scope.datetime = new Date().getTime();
            $scope.finaldate = parseInt($scope.datetime / 1000);
            $scope.acceptnotification = function (notification, $event) {
                //console.log($event, notification.method_type, 'share', notification.data.share_type, 'POI')
                if (notification.method_type == 'invite')
                {
                    var poidata = {};
//                if (type == 'add') {
                    //console.log($scope.location)
                    poidata.post_data_string = {
                        "method": "userPoiService",
                        "isUpdate": "add",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "title": notification.data.title,
                        "address": notification.data.address,
                        "latitude": notification.data.latitude,
                        "longitude": notification.data.longitude,
                        "is_poi": "true"
                        
                    }
                    dyrctpoiservice.post(poidata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });

                }
                if (notification.method_type == 'share' && notification.data.share_type == 'contact')
                {
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "contact",
                        "type_id": notification.data.share_type_id,
                        "status": "accept"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share' && notification.data.share_type == 'poi')

                {
                    //console.log(notification.data);
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "poi",
                        "type_id": notification.data.share_type_id,
                        "status": "accept"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_group')
                {
                    //console.log(notification.data);
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptRejectGroupDetail",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "group_history_id": notification.data.group_history_user_id,
                        "group_id": notification.data.group_id,
                        "status": "accept"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder' && notification.data.share_type == 'folder')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockfolder",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "folder",
                        "type_id": notification.data.share_type_id,
                        "status": "accept"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder' && notification.data.share_type == 'subfolder')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockfolder",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "subfolder",
                        "type_id": notification.data.share_type_id,
                        "folder_id": notification.data.folder_id,
                        "status": "accept"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder_poi_cid')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockContactPoifolder",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "cid",
                        "type_id": notification.data.share_type_id,
                        "status": "accept"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        if (success.settings.message == 'You already have this CiD in your Contacts.')
                        {
                            var modalInstance = $uibModal.open({
                                animation: true,
                                size: 'sm',
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                                controller: 'deletegroupCtrl',
                                resolve: {
                                    displaystr: function () {
                                        return 'You already have this CiD in your Contacts.';
                                    }
                                }
                            });
                            modalInstance.result.then(function (selectedItem) {
                                //console.log("cid")
                            })
                        }
                        $scope.updatenotification(notification.notification_id, $event,"accept");

                    }, function (error) {
                        console.log(error);
                    });
                }
            }
            $scope.blocknotification = function (notification, $event) {
                //console.log(notification);
                if (notification.method_type == 'invite')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "status": "block"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share' && notification.data.share_type == 'contact')
                {
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "contact",
                        "type_id": notification.data.share_type_id,
                        "status": "block"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share' && notification.data.share_type == 'poi')
                {
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "poi",
                        "type_id": notification.data.share_type_id,
                        "status": "block"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }

                if (notification.method_type == 'share_group' && notification.data.type == 'contact')
                {
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "contact",
                        "type_id": notification.data.type_id,
                        "status": "block"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_group' && notification.data.type == 'poi')
                {
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "poi",
                        "type_id": notification.data.type_id,
                        "status": "block"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_group')
                {
                    //console.log(notification.data);
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptRejectGroupDetail",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "group_history_id": notification.data.group_history_user_id,
                        "group_id": notification.data.group_id,
                        "status": "reject"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"reject");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder' && notification.data.share_type == 'folder')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "folder",
                        "type_id": notification.data.share_type_id,
                        "status": "block"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder' && notification.data.share_type == 'subfolder')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockContactPoi",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "subfolder",
                        "type_id": notification.data.share_type_id,
                        "folder_id": notification.data.folder_id,
                        "status": "block"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }
                if (notification.method_type == 'share_folder_poi_cid')
                {
                    var folderdata = {};
                    folderdata.post_data_string = {
                        "method": "acceptBlockContactPoifolder",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "type": "cid",
                        "type_id": notification.data.share_type_id,
                        "status": "block"
                    }
                    dyrctservice.post(folderdata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"block");

                    }, function (error) {
                        console.log(error);
                    });
                }

            }
            $scope.rejectnotification = function (notification, $event) {
                //console.log("rejected", notification.method_type == 'share_group' && notification.data.type == 'poi', notification.method_type, notification)
                if (notification.method_type == 'share_group')
                {
                    //console.log("if");
                    //console.log(notification.data);
                    var ciddata = {};
                    ciddata.post_data_string = {
                        "method": "acceptRejectGroupDetail",
                        "userId": $scope.mycid._id.$id,
                        "web_token": $scope.mycid.web_token,
                        "sender_id": notification.created_by_user,
                        "group_history_id": notification.data.group_history_user_id,
                        "group_id": notification.data.group_id,
                        "status": "reject"
                    }
                    dyrctservice.post(ciddata, function (success) {
                        $scope.updatenotification(notification.notification_id, $event,"reject");

                    }, function (error) {
                        console.log(error);
                    });
                }
                else
                {
                    //console.log("else");
                    $scope.updatenotification(notification.notification_id, $event,"reject");
                }
            }
            $scope.updatenotification = function (id, $event,statusurl) {
                var notification = {};
//                if (type == 'add') {
                //console.log($scope.location)
                notification.post_data_string = {
                    "method": "updateNotification",
                    "notification_id": id,
                    "userId": $scope.mycid._id.$id,
                    "web_token": $scope.mycid.web_token,
                    "notification_status": statusurl
                }
                dyrctservice.post(notification, function (success) {

                    modifires.getNotificationList().then(function (data) {
                        $scope.notificationlist = data.data.data;
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                    $scope.status.isopen = false;
                }, function (error) {
                    console.log(error);
                });
            }
             modifires.getUserContactsdatahome().then(function (data) {
                 if(data)
                 {
                        $rootScope.successdata = data;
                        $rootScope.successflag=true;
                        //console.log($rootScope.successdata)
                 }
                        
                    }, function () {
                        console.log('error')
                    })
            
            //console.log("here")
        }]);
});
