
define(['angularAMD', 'bootstrap-select', 'components/usersignup/usersignupCtrl', 'components/userlogin/userloginCtrl','common/components/mainLayout/dyrctvideoCtrl'], function(angularAMD) {
//    angularAMD = angular.module('MainController', ['ngCookies', 'commonServices']);

    angularAMD.controller('mainLayoutCtrl', ['$scope', '$rootScope', '$cookies', '$cookieStore', '$state', 'authService', 'resourceService', "$uibModal", "dyrctservice","GLOBALS", function($scope, $rootScope, $cookies, $cookieStore, $state, authService, resourceService, $uibModal, dyrctservice,GLOBALS) {
            $scope.items = ['item1', 'item2', 'item3'];
//    $('body').find('div.modal-backdrop').remove();
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();
            });
            $('body').find('div.modal-backdrop').remove();
            $('body').find('div.fade').remove();
//    $('body').find('.modal').removeClass('modal-backdrop');
            setInterval(function(){ $('.round').toggleClass('animation'); }, 700);
            $scope.tabClass1 = true;
            $scope.tab = function(tab) {
                if (tab == 'tab1') {
                    $scope.tabClass1 = true;
                    $scope.tabClass2 = false;
                    $scope.tabClass3 = false;
                }
                if (tab == 'tab2') {
                    $scope.tabClass1 = false;
                    $scope.tabClass2 = true;
                    $scope.tabClass3 = false;
                }
                if (tab == 'tab3') {
                    $scope.tabClass1 = false;
                    $scope.tabClass2 = false;
                    $scope.tabClass3 = true;
                }
            }
		$scope.tab = 'ios';
		$scope.selecttab = function(name){
		$scope.tab = name;

		}		
             $scope.slidesios = [
        {id:1, name:'item1', img:'assets/img/slider/previews_ios/01-My-Profile.jpg'},
        {id:2, name:'item2', img:'assets/img/slider/previews_ios/02-People.jpg'},
        {id:3, name:'item3', img:'assets/img/slider/previews_ios/03-Create-Place.jpg'},
        {id:4, name:'item4', img:'assets/img/slider/previews_ios/04-Drawer.jpg'},
        {id:5, name:'item5', img:'assets/img/slider/previews_ios/05-Invite-Share-Go.jpg'},
        {id:6, name:'item6', img:'assets/img/slider/previews_ios/06-Navigating.jpg'},
        {id:7, name:'item7', img:'assets/img/slider/previews_ios/07-Log-Book.jpg'},
	{id:8, name:'item8', img:'assets/img/slider/previews_ios/08-Groups.jpg'},
        {id:9, name:'item9', img:'assets/img/slider/previews_ios/09-Groups-Continued.jpg'},
        {id:10, name:'item10', img:'assets/img/slider/previews_ios/10-Folders.jpg'},
    ];
    $scope.slidesandroid = [
        {id:1, name:'item1', img:'assets/img/slider/previews_android/01-My-Profile.jpg'},
        {id:2, name:'item2', img:'assets/img/slider/previews_android/02-People.jpg'},
        {id:3, name:'item3', img:'assets/img/slider/previews_android/03-Create-Place.jpg'},
        {id:4, name:'item4', img:'assets/img/slider/previews_android/04-Drawer.jpg'},
        {id:5, name:'item5', img:'assets/img/slider/previews_android/05-Invite-Share-Go.jpg'},
        {id:6, name:'item6', img:'assets/img/slider/previews_android/06-Navigating.jpg'},
        {id:7, name:'item7', img:'assets/img/slider/previews_android/07-Logbook.jpg'},
	{id:8, name:'item8', img:'assets/img/slider/previews_android/08-Groups.jpg'},
        {id:9, name:'item9', img:'assets/img/slider/previews_android/09-Gropus-Continued.jpg'},
        {id:10, name:'item10', img:'assets/img/slider/previews_android/10-Folders.jpg'},
    ];
	
            $scope.datashow = true;
            $("#intro_link").click(function() {
                var offset = $("#intro").offset();
                $("html, body").animate({scrollTop: offset.top}, "slow");
            });
            $("#features_link").click(function() {
                var offset = $("#features").offset();
                $("html, body").animate({scrollTop: offset.top}, "slow");
            });
	    $("#contactus_link").click(function() {
                var offset = $("#contactus").offset();
                $("html, body").animate({scrollTop: offset.top}, "slow");
            });
        $scope.hidesearch = false;
        $scope.tooglehidesearch = function ()
            {
                $scope.hidesearch = !$scope.hidesearch;
            }
            $scope.dismissModel = function(glu) {
                if (glu == 'outside') {
                    //console.log("in");
                    $('body').find('div.modal-backdrop').css('z-index', '-1 !important');
//            $('body').find('div.modal-backdrop').remove();
                    //console.log("out");
                    $uibModal.close();
                }
            }
            
            $scope.openModalvideo = function () {
                //console.log("video")
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/common/components/mainLayout/dyrctvideo.html",
                    controller: 'dyrctvideoCtrl',
                    resolve: {}
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    modalInstance.dismiss();
                    //$log.info('Modal dismissed at: ' + new Date());
                });

            };
            $scope.toggleaction = function () {
                $scope.actionbutton = !$scope.actionbutton;
            }
            $scope.toggleicon = function () {
                $scope.iconbutton = !$scope.iconbutton;
            }
            $scope.togglegeneral = function () {
                $scope.generalbutton = !$scope.generalbutton;
            }
            
            $scope.faqdata = [
            {
                "title":"Must I sign up to use Dyrct?",
                "content":"Yes, Dyrct requires users to create a unique Contact that includes chosen location information. This Contact is linked to your mobile number and can only be edited by the user."
            },
            {
                "title":"Can I de-activate my profile?",
                "content":"Yes, de-activation options are available in SETTINGS on the mobile app and website. Once permanantly de-activated a users details will be permanently removed."
            },
            {
                "title":"Can I register with a landline number?",
                "content":"No, Dyrct is a secure mobile app and it requires One Time Pin (OTP) validation sent to a users mobile number."
            },
            {
                "title":"What happens if I lose or replace my mobile device?",
                "content":"Users’ profiles are backed-up to a cloud server and can be reactivated through your mobile number and unique password."
            },
            {
                "title":"What operating systems does Dyrct support?",
                "content":"We support all late-model iOS and Android devices."
            },
            {
                "title":"What mapping platforms does Dyrct support?",
                "content":"Users have a choice of Google Maps or Waze however they must be downloaded first in order for Dyrct navigation to work."
            },
            {
                "title":"Do I need to keep location services enabled on my mobile device?",
                "content":"Yes, this is very important as Dyrct is a location based service."
            },
            {
                "title":"What is a Contact?",
                "content":"Your connected Identity (Contact) is the key to your Dyrct experience – it includes some basic information and your chosen fixed location. The CiD is user-created so it is personalised, editable and accurate."
            },
            {
                "title":"Am I able to keep my Contact private?",
                "content":"No – a visible Contact is your key to using DYRCT, However you can chose to not make your profile visible. This will temporarily make you invisible in your contacts’ lists. These options are available in SETTINGS on the Mobile App and the website."
            },
            {
                "title":" Are all notes I make in a Address visible when the Address is shared?",
                "content":"Information saved in the notes section is personal and wont be shared, however the telephone and email fields are saved and will be shared when the Address is shared."
            }
            ]
            $scope.numoffaq = 5;
            $scope.loadmore = function(){
                $scope.numoffaq += 5;
            }
            $scope.animationsEnabled = true;
            $scope.signup = function(signforgot) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/usersignup/usersignup.html",
                    controller: "userloginCtrl",
                    size: 'lg',
                    resolve: {
                        getcountrydata: function(modifires, $stateParams) {
                            return modifires.getcountry();
                        },
                        signfor:function(){
                            return signforgot;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    modalInstance.dismiss();
                    //$log.info('Modal dismissed at: ' + new Date());
                });


            }

            $scope.login = function(login) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/userlogin/userlogin.html",
                    controller: "userloginCtrl",
                    size: 'lg',
                    resolve: {
                        getcountrydata: function(modifires, $stateParams) {
                            return modifires.getcountry();
                        },
                        signfor:function(){
                            return login;
                        }
                    }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    modalInstance.close();
                    //$log.info('Modal dismissed at: ' + new Date());
                });


            }
            $scope.disclaimer = function() {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: "app/components/usersignup/disclaimer.html",
                    controller: "userloginCtrl",
                    size: 'lg',
                    resolve: {
                        getcountrydata: function(modifires, $stateParams) {
                            return []
                        },
                        signfor:function(){
                            return [];
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                }, function() {
                    modalInstance.dismiss();
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            }
            $scope.contactus = function() {
                var contact = {};
                contact.post_data_string = {
                    "method": "mailToAdmin",
                    "web_token": "",
                    "userId": "",
                    "email": $scope.email,
                    "first_name": $scope.firstname,
                    "last_name": $scope.lastname,
                    "comment": $scope.comment
                }
                dyrctservice.post(contact, function(success) {
                    // $uibModalInstance.close();
                    if (success.data.message == 'Mail Send Successfully.')
                    {
                        alert("Mail sent successfully.");
//                        $scope.email = "";
//                        $scope.firstname = "";
//                        $scope.lastname = "";
//                        $scope.comment = "";
                           //delete $scope.firstname;
                    }
                }, function(error) {
                    console.log(error);
                });
            }
        }]);


});
