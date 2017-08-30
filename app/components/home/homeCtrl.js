define(['angularAMD', 'components/home/shareCtrl', 'components/home/showCtrl', 'components/home/invitepoiCtrl', 'components/home/sharemycidCtrl', 'components/groups/deletegroupCtrl', 'components/folder/poimoveCtrl' ,"ng-file-upload"], function (angularAMD) {

    angularAMD.controller('homeCtrl', ['$scope', '$rootScope', '$location', '$uibModal', 'authService', 'dyrctservice', 'dyrctpoiservice', 'modifires', '$cookieStore', '$state', '$stateParams', 'poiData', 'poiDataById', 'uiGmapGoogleMapApi', 'getUserContactData', 'GLOBALS', '$window', '$timeout', '$filter', 'flag','Upload','fileUpload','toaster',
        function ($scope, $rootScope, $location, $uibModal, authService, dyrctservice, dyrctpoiservice, modifires, $cookieStore, $state, $stateParams, poiData, poiDataById, GoogleMapApi, getUserContactData, GLOBALS, $window, $timeout, $filter, flag, Upload, fileUpload,toaster) {
            $rootScope.$emit("notificationservice")
            $scope.currentTab = 'poi';
            $scope.usertype = false;
            $scope.dyrctuser = false;
            $scope.imgactive = false;
            $scope.route1 = true;
            $scope.iodshow = false;
            $rootScope.poitypedata = "private";

            // $rootScope.$broadcast("route1home", $scope.route1);

            $('body').click(function () {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $scope.cid = $cookieStore.get("_qu");
//            $scope.onClickTab = function(tab) {
//                
//                $scope.currentTab = tab;
//            }
            var getUserContactData = [];
            var getuserdata = [];
            var getUserdata = [];
            var getUserPoiData = [];
            var getUserPoiglobalData = [];
            var getRecentTripData = [];
            var arrfirst = [];

            var new_letter = [];
            var i = 0;

            $timeout(function () {
                $rootScope.getuserdata = $rootScope.successdata;
            }, 1000);

            //console.log($rootScope.getuserdata)
            if (flag == 'contact')
            {
                $rootScope.$broadcast("route1home", "contact");
                modifires.getUserContactsdatahome().then(function (success) {

                    //console.log(success);
                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    getUserContactData = success;
                    $rootScope.getuserdata = success;

                    $scope.ucopy = getUserContactData.data ? getUserContactData.data : '';
                    $scope.usercontects = getUserContactData.data ? getUserContactData.data : '';
                    //$scope.ucopy=angular.copy($scope.usercontects);
                    //angular.copy($scope.usercontects,$scope.usercontectsdata)
                    $scope.usercontectsdata = [];
                    $scope.usercon = [];
                    $scope.usercontectsdataletter = [];
//                    angular.forEach($scope.usercontects,function(item,i){
//                        delete item.first_letter;
//                        $scope.usercontectsdataletter[i]=item;
//                    })
                    //console.log($scope.usercontectsdataletter)
                    // doesnot contain first letter usercontectsdataletter

                    var arrfirst = [];
                    var new_letter = [];
                    var i = 0;
                    angular.forEach($scope.usercontects, function (item, index) {

                        $scope.usercontects[index].newordername = ($scope.usercontects[index].firstName ? $scope.usercontects[index].firstName.charAt(0).toUpperCase() + $scope.usercontects[index].firstName.slice(1) : '') + ($scope.usercontects[index].lastName ? $scope.usercontects[index].lastName : '')

                    })
                    $scope.usercontects = $filter('orderBy')($scope.usercontects, 'newordername');
                    //console.log($scope.usercontects,"here");   


                    // contain letter
//                    

                    angular.forEach($scope.usercontects, function (item, index) {
                        if (item.firstName)
                        {
                            var firstletter = item.firstName;
                        }
                        else
                        {
                            var firstletter = item.lastName;
                        }
                        var fltr = firstletter.split("");
                        //console.log(fltr);

                        var firstltr = fltr[0] ? fltr[0].toUpperCase() : "";
                        if (arrfirst.indexOf(firstltr) >= 0)
                        {
                            item['first_letter'] = "";
                            item['firstName'] = firstletter.charAt(0).toUpperCase() + firstletter.slice(1);
                            new_letter.push(item);


                        } else
                        {
                            item['first_letter'] = firstltr;
                            new_letter.push(item);
                            arrfirst.push(firstltr);
                            //arrfirst.splice(0, 1);

                        }

                        //console.log(arrfirst)
                    })
                    //console.log(new_letter,"new");
                    angular.forEach(new_letter, function (item, i) {

                        $scope.usercontectsdata[i] = item;
                    })
                    //console.log($scope.usercontectsdata)
                    $scope.usercon = angular.copy($scope.usercontectsdata);
                    if ($rootScope.fullc)
                    {
                        $scope.imgactive = false;
                        $scope.activeuser("fullcont");
                    }
                    else
                    {
                        $scope.imgactive = true;
                        $scope.activeuser("halfcont");
                    }
//                   angular.forEach($scope.usercontects,function(item,index){
//                        
//                        $scope.usercontects[index].newordername = ($scope.usercontects[index].firstName?$scope.usercontects[index].firstName.charAt(0).toUpperCase()+$scope.usercontects[index].firstName.slice(1):'') + ($scope.usercontects[index].lastName?$scope.usercontects[index].lastName:'')
//                    
//                    })
//                   $scope.usercontects = $filter('orderBy')($scope.usercontects,'newordername');
                    //$scope.usernewcont=angular.copy($scope.usercontects);

                }, function (error) {

                });

            }


            if (flag == 'poi')
            {
                $rootScope.$broadcast("route1home", "poi");
                $scope.poiice = true;
                modifires.getUserPoi().then(function (success) {

                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    getUserPoiData = success;
                    $scope.userpoilen = true;
                    $scope.userpoi = getUserPoiData.data ? getUserPoiData.data : '';
                    $timeout(function () {
                        $scope.getheight();
                    }, 1000);
                    angular.forEach($scope.userpoi, function (nv, index) {
                        if (nv.status == "active")
                        {
                            $scope.userpoilen = false;
                        }
                    })
                }, function (error) {

                });

//                modifires.getUserContactsdatahome().then(function(success) {
//                    getUserContactData = success;
//                    $scope.usercontects = getUserContactData.data ? getUserContactData.data : '';
//                    $timeout(function() {
//                        $scope.getheight();
//                    }, 1000);
//
//                }, function(error) {
//
//                });
            }
            if (flag == 'ice')
            {
                $rootScope.$broadcast("route1home", "ice");
                console.log("ice")
                $scope.poiice = false;
                modifires.getUserPoi().then(function (success) {

                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    getUserPoiData = success;
                    $scope.userpoilen = true;
                    $scope.userpoi = getUserPoiData.data ? getUserPoiData.data : '';


                    $timeout(function () {
                        $scope.getheight();
                    }, 1000);
                    angular.forEach($scope.userpoi, function (nv, index) {
                        if (nv.status == "active")
                        {
                            $scope.userpoilen = false;
                        }
                    })
                }, function (error) {

                });

//                modifires.getUserContactsdatahome().then(function(success) {
//                    getUserContactData = success;
//                    $scope.usercontects = getUserContactData.data ? getUserContactData.data : '';
//                    $timeout(function() {
//                        $scope.getheight();
//                    }, 1000);
//
//                }, function(error) {
//
//                });
            }
            if (flag == 'recenttrip')
            {
                modifires.getRecentTrip().then(function (success) {
                    //console.log(success)
                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    getRecentTripData = success;
                    $scope.userrecenttrip = getRecentTripData.data ? getRecentTripData.data : '';
                    $timeout(function () {
                        $scope.getheight();
                    }, 1000);
                }, function (error) {

                });
            }

            $scope.changeusertype = function ()
            {
                $scope.usertype = true;
            }

            $scope.activeuser = function (flag)
            {

                $scope.usercontectsdata = [];
                $scope.usercon = [];
                $scope.usercontectsdataletter = [];
//                    angular.forEach($scope.usercontects,function(item,i){
//                        delete item.first_letter;
//                        $scope.usercontectsdataletter[i]=item;
//                    })
                //console.log($scope.usercontectsdataletter)
                // doesnot contain first letter usercontectsdataletter

                var arrfirst = [];
                var new_letter = [];
                var i = 0;
                if (flag == "halfcont")
                {
                    $rootScope.halfc = true;
                    $rootScope.fullc = false;
                    $rootScope.$broadcast("userSearch", "");
                    $scope.dyrctuser = true;
                    //console.log($scope.usercontectshalfcontent);
                    //console.log($scope.ucopy);
                    //console.log($scope.usercontectshalfcontent);

                    $scope.usercontectsha = $filter('orderBy')($scope.ucopy, 'newordername');

                    var output = [],
                            keys = [];
                    angular.forEach($scope.usercontectsha, function (item) {
                        var key = item['phone'];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
                    //console.log(output);
                    $scope.usercontectss = $filter('filter')(output, {isUsingDYRCT: "true"});

                    angular.forEach($scope.usercontectss, function (item, index) {
                        if (item.firstName)
                        {
                            var firstletter = item.firstName;
                        }
                        else
                        {
                            var firstletter = item.lastName;
                        }
                        var fltr = firstletter.split("");
                        //console.log(fltr);

                        var firstltr = fltr[0] ? fltr[0].toUpperCase() : "";
                        if (arrfirst.indexOf(firstltr) >= 0)
                        {
                            item['first_letter'] = "";
                            item['firstName'] = firstletter.charAt(0).toUpperCase() + firstletter.slice(1);
                            new_letter.push(item);


                        } else
                        {
                            item['first_letter'] = firstltr;
                            new_letter.push(item);
                            arrfirst.push(firstltr);
                            //arrfirst.splice(0, 1);

                        }

                        //console.log(arrfirst)
                    })
                    //console.log(new_letter,"new");
                    angular.forEach(new_letter, function (item, i) {

                        $scope.usercontectsdata[i] = item;
                    })

                    $scope.usercon = angular.copy($scope.usercontectsdata);
                    $scope.usercontects = angular.copy($scope.usercon);

                }
                if (flag == "fullcont")
                {
                    $rootScope.fullc = true;
                    $rootScope.halfc = false;
                    $scope.usercontectsdata = [];
                    $rootScope.$broadcast("userSearch", "");

                    $scope.dyrctuser = false;
                    //console.log($scope.ucopy,"here")
                    angular.forEach($scope.ucopy, function (item, index) {

                        $scope.ucopy[index].newordername = ($scope.ucopy[index].firstName ? $scope.ucopy[index].firstName.charAt(0).toUpperCase() + $scope.ucopy[index].firstName.slice(1) : '') + ($scope.ucopy[index].lastName ? $scope.ucopy[index].lastName : '')

                    })
                    $scope.usercontects = $filter('orderBy')($scope.ucopy, 'newordername');
                    //console.log($scope.usercontects,"here");   


                    // contain letter
//                    
                    var output = [],
                            keys = [];
                    angular.forEach($scope.usercontects, function (item) {
                        var key = item['phone'];
                        if (keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
                    //console.log(output);
                    angular.forEach(output, function (item, index) {
                        if (item.firstName)
                        {
                            var firstletter = item.firstName;
                        }
                        else
                        {
                            var firstletter = item.lastName;
                        }
                        var fltr = firstletter.split("");
                        //console.log(fltr);

                        var firstltr = fltr[0] ? fltr[0].toUpperCase() : "";
                        if (arrfirst.indexOf(firstltr) >= 0)
                        {
                            item['first_letter'] = "";
                            item['firstName'] = firstletter.charAt(0).toUpperCase() + firstletter.slice(1);
                            new_letter.push(item);


                        } else
                        {
                            item['first_letter'] = firstltr;
                            new_letter.push(item);
                            arrfirst.push(firstltr);
                            //arrfirst.splice(0, 1);

                        }

                        //console.log(arrfirst)
                    })
                    //console.log(new_letter,"new");
                    angular.forEach(new_letter, function (item, i) {

                        $scope.usercontectsdata[i] = item;
                    })
                    //console.log($scope.usercontectsdata)
                    $scope.usercon = angular.copy($scope.usercontectsdata);
                    $scope.usercontects = angular.copy($scope.usercon);

                }
                $scope.imgactive = !$scope.imgactive;

            }

            $scope.getheight = function () {

            }


            $scope.resultflag = true;
            $rootScope.openclass = false;
            $rootScope.topsearch = true;
            $scope.isCollapsed = false;
            $scope.usercontactshowdata = {};
            $scope.usercontactshowdata.note = "";
            $scope.usercontactshowdata.public_note = "";
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.showpopover = false;
            $scope.dyrctadd = true;
            $scope.dyrctaddcity = true;
            $scope.icepopover = false;
            $scope.globalpoi ="";
            $scope.dyrctshow = function (obj, con, mesg) {

                $scope.usercontactshowdata = obj;
                $scope.globalpoi = obj.poi_id;
                $scope.showpopover = true;
                if (mesg == "ice")
                {
                    console.log("here")
                    $scope.showpopover = false;
                    $scope.icepopover = true;

                }
                if ($scope.usercontactshowdata.address == "")
                {
                    $scope.dyrctadd = false;
                }
                if ($scope.usercontactshowdata.city == "" && $scope.usercontactshowdata.state == "" && $scope.usercontactshowdata.country == "") {
                    $scope.dyrctaddcity = false;
                }
                //console.log($scope.usercontactshowdata)
                //======== Open Popup ========//
//                $('#dyrct_popup_listing').find('.dyrct_popup_btn').click(function(event) {

                $timeout(function () {
                    console.log($('#dyrct_popup').length)
                    var content = $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '');
                    $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '').addClass('dyrct_popup_active');
                    $('#dyrct_popup_listing').find('.dyrct_popup_btnd_' + con + '').parent().parent().addClass('dyrct_popup_active');
                    $('#dyrct_popup').show();
                    var getPosition = $(content).offset();
                    var winscroll = $(window).scrollTop();
                    var winhei = $(window).height();
                    var currentPosition = getPosition.top - winscroll;
                    var popuptop = currentPosition - 130;
                    var totalhei = popuptop + 350;
                    if (popuptop < 15) {
                        var popuptop = 25;
                    }
                    if (totalhei > (winhei - 30)) {
                        var popuptop = winhei - 350;
                    }

                    var popupleft = getPosition.left - 590;
                    $('body').css('overflow', 'hidden');
                    var arrow_position = (currentPosition - popuptop) + 18;
                    $('#dyrct_popup').find('.arrow_black').css('top', arrow_position + 'px');
                    $('#dyrct_popup').find('.custom_popup').css({'top': popuptop + 'px', 'left': popupleft + 'px'});
//                });


                    $(window).resize(function () {
                        if ($('#dyrct_popup').css('display') == 'block') {

                            var getPosition = $('#dyrct_popup_listing').find('.dyrct_popup_btn.dyrct_popup_active').offset();
                            var winscroll = $(window).scrollTop();
                            var popupleft = getPosition.left - 605;
                            $('#dyrct_popup').find('.custom_popup').css({'left': popupleft + 'px'});
                        }
                    });
                }, 100)

                //$(this).addClass('dyrct_popup_active');



            }

            $scope.closepopup = function (id, check) {
                //console.log(id, check, $scope.usertype)
                if (check == 'contact' && $scope.usertype == true)
                {

                    var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "type_id": id,
                        "type": check,
                        "method": "addNoteByUserId",
                        "note": $scope.usercontactshowdata.note,
                        "public_note": $scope.usercontactshowdata.public_note,
                    }
                    dyrctservice.post(groupdata, function (success) {
                        // $uibModalInstance.close();
                    }, function (error) {
                        console.log(error);
                    });
                }
                if (check == 'poi' && $scope.usertype == true)
                {
                    console.log($scope.usercontactshowdata)
                    var groupdata = {};
                    groupdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "type_id": id,
                        "type": check,
                        "method": "addNoteByUserId",
                        "note": $scope.usercontactshowdata.note,
                        "public_note": $scope.usercontactshowdata.public_note,
                        "phone": $scope.usercontactshowdata.phone,
                        "url": $scope.usercontactshowdata.url
                    }
                    dyrctservice.post(groupdata, function (success) {
                        // $uibModalInstance.close();
                    }, function (error) {
                        console.log(error);
                    });
                }

                // $('#dyrct_popup').hide();
                $scope.showpopover = false;
                $('#dyrct_popup_listing').find('.dyrct_popup_btn').removeClass('dyrct_popup_active');
                $('#dyrct_popup_listing').find('.btn-hover').removeClass('dyrct_popup_active');
                $('body').css('overflow', 'auto');
                $scope.usertype = false;
            }

            $scope.closeicepopup = function () {
                //console.log(id, check, $scope.usertype)

                // $('#dyrct_popup').hide();
                $scope.showpopover = false;
                $scope.icepopover = false;
                $('#dyrct_popup_listing').find('.dyrct_popup_btn').removeClass('dyrct_popup_active');
                $('#dyrct_popup_listing').find('.btn-hover').removeClass('dyrct_popup_active');
                $('body').css('overflow', 'auto');
                $scope.usertype = false;
            }

//            $scope.myPopover = {
//                isOpen: false,
//                templateUrl: 'myPopoverTemplate.html',
//                open: function open(obj) {
//                    console.log("open", obj)
//                },
//                close: function close(obj) {
//                    console.log("close")
//                    obj.isOpen = false
//                }
//            };
//            $scope.templateUrl = 'myPopoverTemplate.html';
//            console.log($scope.MyCID);


            $scope.open = false;
            $scope.toggleselect = function ()
            {
                $scope.open = !$scope.open;

            }
            $scope.cancel = function () {
                $uibModal.close();
            };
            $scope.showdata = function (obj) {
                $scope.usercontactshowdata = obj;
                //obj.open(obj);
                //console.log($scope.usercontactshowdata)


            }

            $scope.closePopover = function () {
                //console.log("here");
                $scope.popover = false;
            };
            $scope.showdatapoi = function (obj) {
                $scope.usercontactshowdata = obj;
                //console.log($scope.usercontactshowdata)

            }
            if ($scope.usercontactshowdata.url != '')
            {
                $scope.urlactive = false;
            }
            else
            {
                $scope.urlactive = true;
            }
            $scope.toggleurl = function ()
            {
                $scope.urlactive = !$scope.urlactive;

            }
            $scope.focus = function (url) {
                $scope.showstatus = true;
            }
            $scope.blur = function () {

                $timeout(function () {
                    $scope.showstatus = false;
                }, 5000);
            }







            $scope.poiById = poiDataById.data;
            $scope.poiListData = poiData.data;

            $scope.deletecontact = function (contactid) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function () {
                            return 'Do you want to delete this Contact ?';
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    //console.log("delete",contactid)
                    var poidata = {};
                    poidata.post_data_string = {
                        "method": "deleteContact",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "contact_id": contactid
                    }
                    dyrctservice.post(poidata, function (success) {
                        modifires.getUserContacts().then(function (data) {
                            $scope.usercontects = data.data.data.allContact[0];
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function (error) {
                        console.log(error);
                    });
                })
//                if (confirm('Do you want to delete this Contact ?')) {
//                    var poidata = {};
//                    poidata.post_data_string = {
//                        "method": "deleteContact",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "contact_id": contactid
//                    }
//                    dyrctservice.post(poidata, function(success) {
//                        modifires.getUserContacts().then(function(data) {
//                            $scope.usercontects = data.data.data.allContact[0];
//                            console.log("success")
//                        }, function() {
//                            console.log('error')
//                        })
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            };
            $scope.deletepoi = function (poiid, type) {

                if (type == "poi")
                {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                        controller: 'deletegroupCtrl',
                        resolve: {
                            displaystr: function () {
                                return 'Do you want to delete this Address ?';
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        var poidata = {};
                        poidata.post_data_string = {
                            "method": "userPoiService",
                            "isUpdate": "delete",
                            "userId": $scope.MyCID._id.$id,
                            "web_token": $scope.MyCID.web_token,
                            "poi_id": poiid
                        }
                        dyrctpoiservice.post(poidata, function (success) {

                            modifires.getUserContacts().then(function (data) {
                                //console.log(data);
                                if (data.length == "")
                                {
                                    $scope.userpoilen = true;
                                }
                                $scope.poiice = true;
                                $scope.userpoi = data.data.data.allPoi;

                                //console.log("success")
                            }, function () {
                                console.log('error')
                            })
                            //console.log("deleted", poiid);
                        }, function (error) {
                            console.log(error);
                        });
                    })
                }
                else if (type == "ice")
                {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'sm',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                        controller: 'deletegroupCtrl',
                        resolve: {
                            displaystr: function () {
                                return 'Do you want to delete this Address ?';
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        var poidata = {};
                        poidata.post_data_string = {
                            "method": "userPoiService",
                            "isUpdate": "delete",
                            "userId": $scope.MyCID._id.$id,
                            "web_token": $scope.MyCID.web_token,
                            "poi_id": poiid
                        }
                        dyrctpoiservice.post(poidata, function (success) {

                            modifires.getUserContacts().then(function (data) {
                                //$scope.userpoilen=true;
                                $scope.poiice = false;
                                $scope.userpoi = data.data.data.allPoi;

                                //console.log("success")
                            }, function () {
                                console.log('error')
                            })
                            //console.log("deleted", poiid);
                        }, function (error) {
                            console.log(error);
                        });
                    })
                }
            };

            $scope.deleterecenttrip = function (tripid) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function () {
                            return 'Do you want to delete this Recent Trip ?';
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    var poidata = {};
                    poidata.post_data_string = {
                        "method": "deleteRecentTripList",
                        "isUpdate": "delete",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "trip_id": tripid
                    }
                    dyrctservice.post(poidata, function (success) {
                        modifires.getUserContacts().then(function (data) {
                            $scope.userrecenttrip = data.data.data.allRecentTrip[0];
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                        //console.log("deleted", tripid);
                    }, function (error) {
                        console.log(error);
                    });
                })
//                if (confirm('Do you want to delete this Recent Trip ?')) {
//                    var poidata = {};
//                    poidata.post_data_string = {
//                        "method": "deleteRecentTripList",
//                        "isUpdate": "delete",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "trip_id": tripid
//                    }
//                    dyrctservice.post(poidata, function(success) {
//                        modifires.getUserContacts().then(function(data) {
//                            $scope.userrecenttrip = data.data.data.allRecentTrip[0];
//                            console.log("success")
//                        }, function() {
//                            console.log('error')
//                        })
//                        console.log("deleted", tripid);
//                    }, function(error) {
//                        console.log(error);
//                    });
//                }
            };
            $scope.openModalshare = function (check, id, userid) {

                if (check == 'contact')
                {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/share.html",
                        controller: 'shareCtrl',
                        resolve: {
                            selectedShareData: function () {
                                return getUserContactData;
                            },
                            check: function () {
                                return check;
                            },
                            id: function () {
                                return id;
                            },
                            userid: function () {
                                return userid;
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        modifires.getUserContacts().then(function (data) {
                            $scope.usercontects = data.data.data.allContact[0];
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        }),
                                modifires.getUserContacts().then(function (data) {
                            $scope.userpoi = data.data.data.allPoi;
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function () {

                    });
                }
                else if (check == 'poi')
                {
                    //console.log($rootScope.getuserdata)
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg',
                        templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/share.html",
                        controller: 'shareCtrl',
                        resolve: {
                            selectedShareData: function () {
                                return $rootScope.getuserdata;
                            },
                            check: function () {
                                return check;
                            },
                            id: function () {
                                return id;
                            },
                            userid: function () {
                                return userid;
                            }
                        }
                    });
                    modalInstance.result.then(function (selectedItem) {
                        modifires.getUserContacts().then(function (data) {
                            $scope.usercontects = data.data.data.allContact[0];
                            ga("send", "event", {eventCategory: "Share POI", eventAction: "Share POI", eventLabel: "Share POI", userId: $scope.MyCID._id.$id});
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        }),
                                modifires.getUserContacts().then(function (data) {
                            $scope.userpoi = data.data.data.allPoi;
                            //console.log("success")
                        }, function () {
                            console.log('error')
                        })
                    }, function () {

                    });
                }


            };

            $scope.openModalpoimove = function (flag, showsubfolder, id, poititle) {

                //console.log("move");
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/poitofoldermove.html",
                    controller: 'poimoveCtrl',
                    resolve: {
                        flag: function () {
                            return flag;
                        },
                        movepoiid: function () {
                            return id;
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
                        poititle: function () {
                            return poititle;
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
                        //$scope.checkFolderlist();
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };

            $scope.openModalsharemycid = function (check, id) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/sharemycid.html",
                    controller: 'sharemycidCtrl',
                    resolve: {
                        selectedShareData: function () {
                            return getUserContactData;
                        },
                        check: function () {
                            return check;
                        },
                        id: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserContacts().then(function (data) {
                        $scope.usercontects = data.data.data.allContact[0];
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });

            };
            $scope.openModalshow = function (check, id) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: '',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/show.html",
                    controller: 'showCtrl',
                    resolve: {
                        check: function () {
                            return check;
                        },
                        id: function () {
                            return id;
                        }

                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserContacts().then(function (data) {
                        $scope.usercontects = data.data.data.allContact[0];
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });
            };
            $scope.openModalInvitePOI = function (id) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/invitepoi.html",
                    controller: 'invitepoiCtrl',
                    resolve: {
                        id: function () {
                            return id;
                        }

                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    modifires.getUserContacts().then(function (data) {
                        $scope.usercontects = data.data.data.allContact[0];
                        //console.log("success")
                    }, function () {
                        console.log('error')
                    })
                }, function () {

                });
            };

            $scope.$watch('usercontects', function (newVal, oldval) {
                //console.log(newVal,oldval);
            })
            $scope.invitecontact = [];
            $scope.checkedcontactItems = function (cid, flag) {
                $scope.iodshow = true;
                if (flag) {
                    $scope.invitecontact.push(cid);
                }
                else {
                    var index = 0;
                    angular.forEach($scope.invitecontact, function (user) {
                        if (user == cid) {
                            $scope.invitecontact.splice(index, 1);
                        }
                        index++;
                    });
                }
                if ($scope.invitecontact.length == "")
                {
                    $scope.iodshow = false;
                }
                else
                {
                    $scope.contactinvite = $scope.invitecontact.join();
                }


//                 if($scope.contactdata[index]['checked'] && $scope.contact.indexOf($scope.contactdata[index]['userId']) == -1 && $scope.contactdata[index]['isUsingDYRCT'] == 'true'){
//                    console.log('if');
//                    $scope.contact.push($scope.contactdata[index]['userId']);
//                 }else if(!$scope.contactdata[index]['checked'] && $scope.contact.indexOf($scope.contactdata[index]['userId']) != -1 &&  $scope.contactdata[index]['isUsingDYRCT']== 'true'){
//                    console.log('else');
//                    $scope.contact.splice($scope.contact.indexOf($scope.contactdata[index]['userId']),1);
//                 } 

                //$scope.contactid = $scope.contact.join(',');
                //$scope.contactid = $scope.contact.toString();
                //console.log($scope.contactid, $scope.contact, flag);

            };

            $scope.sendSms = function ()
            {
                var contactsmsdata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                contactsmsdata.post_data_string = {
                    "method": "sendInviteFriendsMultiple",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "contact_id": $scope.contactinvite
                }
                dyrctservice.post(contactsmsdata, function (success) {
                    if (success.data.message == "Message send successfully.")
                    {
                        $scope.iodshow = false;
                        $scope.invitecontact = [];
                        $scope.contactinvite = "";
                        angular.forEach($scope.usercontects, function (contvalue) {

                            contvalue.checked = false;
                        });
                        //$scope.usercontects.checked=false;
                        var modalInstance = $uibModal.open({
                            animation: true,
                            size: 'sm',
                            templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                            controller: 'deletegroupCtrl',
                            resolve: {
                                displaystr: function () {
                                    return 'Message send successfully.';
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                        })
                    }
                    else if (success.data.error == "fail_send")
                    {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            size: 'sm',
                            templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                            controller: 'deletegroupCtrl',
                            resolve: {
                                displaystr: function () {
                                    return 'Invalid Mobile Number- message not sent';
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                        })
                    }
                }, function (error) {
                    console.log(error);
                });
            }
            $scope.search = {"searchName": ""};

            $scope.getpublicpoidata = function (newVal) {
                $scope.globalpoi = false;
                modifires.postPoiListingdata(newVal).then(function (success) {

                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    getUserPoiglobalData = success;
                    console.log(getUserPoiglobalData.length)
                    if (getUserPoiglobalData.data && getUserPoiglobalData.data.length == 0)
                    {
//                    if ( typeof(newVal) != undefined)
//                    {
                        $scope.resultflag = false;
//                    }
                    } else
                    {
                        $scope.resultflag = true;
                    }
                    //console.log(getUserPoiglobalData.data)

                    $scope.userglobalpoi = getUserPoiglobalData.data ? getUserPoiglobalData.data : '';

                }, function (error) {

                });
            }
            $scope.productsss = [];
            $rootScope.$on("userSearch", function (event, data) {
                //console.log(data)
                $scope.search.searchName = data;
                //console.log(typeof(data),$rootScope.poitypedata)
                if (data == "" && $rootScope.poitypedata == "private")
                {
                    $scope.getsearchdata("");
                }
                if (data && $rootScope.poitypedata == "private")
                {
                    $scope.getsearchdata(data);
                }
                if (data && $rootScope.poitypedata == "public")
                {
                    $scope.getpublicpoidata(data);
                }
                //console.log($scope.search.searchName)


                // console.log("++" + $scope.search.searchName);
            })
            //var obj=$scope.usercontects;
            $scope.getsearchdata = function (newVal) {
                $scope.globalpoi = true;
                if (flag == 'poi') {
                    $scope.productsss = $filter('searchdata')($scope.userpoi, newVal, 'title');
                }
                else if (flag == 'recenttrip') {
                    $scope.productsss = $filter('searchdata')($scope.userrecenttrip, newVal, 'title');
                }
                else if (flag == 'contact') {
                    //console.log($scope.usercontectsdata)
//                    angular.forEach($scope.usercontectsdata,function(item,index){
//                        
//                        $scope.usercontectsdata[index].newordername = ($scope.usercontectsdata[index].firstName?$scope.usercontectsdata[index].firstName.charAt(0).toUpperCase()+$scope.usercontects[index].firstName.slice(1):'') + ($scope.usercontectsdata[index].lastName?$scope.usercontectsdata[index].lastName:'')
//                    
//                    })
                    //$scope.usercontectsdata = $filter('orderBy')($scope.usercontectsdata,'newordername');

                    $scope.productsss = $filter('searchdata')($scope.usercontectsdata, newVal, 'firstName,lastName');
                }
                else if (flag == 'ice') {
                    $scope.productsss = $filter('searchdata')($scope.userpoi, newVal, 'title');
                }

                // console.log(newVal,$scope.productsss)
                if ($scope.productsss && $scope.productsss.length == 0)
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                    $scope.resultflag = false;
//                    }
                } else
                {
                    $scope.resultflag = true;
                }
                var new_product = [];
                var arr_letter = [];
                var new_productt = [];

                if (newVal && flag == 'contact')
                {

                    //console.log(newVal,$scope.productsss)
                    //console.log($scope.productsss);
                    function squash(arr_prod) {
                        var tmp = [];
                        for (var i = 0; i < arr_prod.length; i++) {
                            if (tmp.indexOf(arr_prod[i]['phone']) == -1) {
                                tmp.push(arr_prod[i]['phone']);
                            }
                        }
                        return tmp;
                    }

                    var ress_prod = squash($scope.productsss);

                    angular.forEach(ress_prod, function (new_value, i) {

                        //console.log(new_value)
                        //console.log(new_value['first_letter']);
                        if (new_value['first_letter'])
                        {
                            //console.log("here")
                            arr_letter.push(new_value['first_letter']);
                            new_product.push(new_value);
                            //console.log(new_product)

                        }
                        else
                        {
                            //console.log("else")
                            var str = new_value['firstName'];
                            var res = str.split("");
                            new_value['first_letter'] = res[0].toUpperCase();
                            arr_letter.push(new_value['first_letter']);
                            new_product.push(new_value);
                            //console.log(new_product)
                        }
                    });
                    function squash(arr) {
                        var tmp = [];
                        for (var i = 0; i < arr.length; i++) {
                            if (tmp.indexOf(arr[i]) == -1) {
                                tmp.push(arr[i]);
                            }
                        }
                        return tmp;
                    }

                    var ress = squash(arr_letter);

                    angular.forEach(new_product, function (new_valuee, index) {
                        //console.log(res.indexOf(new_value['first_letter']));
                        if (ress.indexOf(new_valuee['first_letter']) >= 0)
                        {
                            new_productt.push(new_valuee);
                            ress.splice(0, 1);

                        }
                        else
                        {

                            new_valuee['first_letter'] = "";
                            new_productt.push(new_valuee);
                        }


                    });
                    var ressh = squashh(new_productt);
                    function squashh(arrr) {
                        var tmp = [];
                        for (var i = 0; i < arrr.length; i++) {
                            if (tmp.indexOf(arrr[i]) == -1) {
                                tmp.push(arrr[i]);
                            }
                        }
                        return tmp;
                    }

                    //console.log($scope.usercontects)
                    $scope.usercontects = ressh;
                    //console.log("dfdfdfd",$scope.usercontects);
                    // $scope.$apply();
                } else
                {
                    $scope.usercontects = angular.copy($scope.usercon);
                    //console.log($scope.usercontects,"else")
                    //$scope.usercontectsdata=$scope.usercon;
                }
            }

            $scope.$watch('search.searchName', function (newVal) {
                //console.log($rootScope.poitypedata,newVal)
                if ($rootScope.poitypedata == "private")
                {
                    $scope.getsearchdata(newVal);
                    //console.log(newVal)
                    //$scope.products_new.push()
                }
                if ($rootScope.poitypedata == "public")
                {

                    $scope.getpublicpoidata(newVal);


                }

            });

            $scope.addpoi = function (title, add, lati, long) {
                $rootScope.searchpoi = false;
                var poidata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                poidata.post_data_string = {
                    "method": "userPoiService",
                    "isUpdate": "add",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "title": title,
                    "address": add,
                    "latitude": lati,
                    "longitude": long,
                    "is_poi": "true",
                    "poi_type": "private"
                }
                dyrctpoiservice.post(poidata, function (success) {
                    if (success.settings.message == 'Address saved successfully.')
                    {
                        var modalInstance = $uibModal.open({
                            animation: true,
                            size: 'sm',
                            templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                            controller: 'deletegroupCtrl',
                            resolve: {
                                displaystr: function () {
                                    return 'Address saved successfully.';
                                }
                            }
                        });
                    }
                    ga("send", "event", {eventCategory: "Create POI", eventAction: "Create POI", eventLabel: "Create POI", userId: $scope.MyCID._id.$id});
                    //
                    $scope.q = "";
                    $rootScope.poitypedata = "private";
                    $rootScope.$broadcast("userSearch", $scope.q);
                    $window.location.reload();
                }, function (error) {
                    console.log(error);
                });
            };

            var baseurl= $rootScope.baseurl;
            console.log($scope.profile_pic,"t1")

           $scope.$watch('usercontactshowdata.phone', function (newVal, oldVal) {
                //console.log(newVal.length,newVal, oldVal)
                if (newVal && (newVal + "").length > 18) {
                    $scope.usercontactshowdata.phone = oldVal;
                }
            });
          
            $rootScope.$on('poiimage', function (event, data) {
                $scope.imgupl = true;
                if (data.data.imageurl) {
                    console.log("here")
                    $scope.usercontactshowdata.poi_pic = data.data.imageurl;
                        console.log($scope.usercontactshowdata.poi_pic,"pics")
                    $timeout(function(){
                        $scope.imgupl = false;
                        toaster.pop('success', "Image Replace Successfully");
                    }, 2000);
                }
            });
           
           $scope.profobj ={};
            $scope.$watch('profobj.profile_pic', function (newval, oldval) {
                console.log("newval")
                var data = {};
                data = {"method": "uploadPoiPic", "userId": $scope.MyCID._id.$id, "poiId":$scope.globalpoi, "web_token": $scope.MyCID.web_token}
                var file = $scope.profobj.profile_pic;
                console.log(data,file)
                $rootScope.typeimg = "placesimg";
                console.log($rootScope.typeimg)
//                console.log('file is ');
//                console.dir(file);
                var uploadUrl = baseurl+"dyrct_ws/public/rest/user";
                fileUpload.uploadFileToUrl(file, uploadUrl, data);
            });

        }]);

});

