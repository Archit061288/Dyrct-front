define(['angularAMD',"ng-file-upload",'components/mycid/editmapCtrl'], function (angularAMD) {

    angularAMD.controller('editcidCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModal', '$window', "Upload", "fileUpload", 'uiGmapGoogleMapApi', '$rootScope','GLOBALS', function ($scope, authService, dyrctservice, $cookieStore, $state, $stateParams, $uibModal, $window, Upload, fileUpload, GoogleMapApi, $rootScope,GLOBALS) {
            var data = {};
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            var baseurl= $rootScope.baseurl;
            $scope.hidepersonal = false;
            $scope.items = [{name: "Business"}, {name: "Home"}, {name: "Others"}];
            var personaladd = {};
            var privateadd = {};
            $scope.animationsEnabled = true;
            $rootScope.topsearch=false;
            $rootScope.mapattr=true;
            $scope.selectedcategory = [];
            $scope.mycid = $cookieStore.get('_qu');
            data.post_data_string = {"method": "getUserGLC", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token}

            dyrctservice.post(data, function (success) {
                if(success.data[0].status=="inactive")
                {
                    $state.go('main.root');
                }
                $scope.selectedcategory['name'] = success.data[0].category;
                $scope.firstname = success.data[0].firstName;
                $scope.lastname = success.data[0].lastname;
                $scope.companyname = success.data[0].companyName;
                $scope.designation = success.data[0].designation;
                $scope.email = success.data[0].email;
                $scope.phone = success.data[0].phone;
                $scope.url = success.data[0].url;
                $scope.address = success.data[0].address;
                $scope.country = success.data[0].country;
                $scope.state = success.data[0].state;
                $scope.city = success.data[0].city;
                $scope.zip = success.data[0].zipcode;
                $scope.location = success.data[0].location;
                $scope.imageurl = success.data[0].profile_pic;
                $scope.altphone = success.data[0].alt_phone;
                $scope.othercategory=success.data[0].category;
                $scope.addresscomponent=$scope.address+","+$scope.country+","+$scope.state+","+$scope.city+","+$scope.zip;
//                var full_add=success.data[0].address+","+success.data[0].country+","+success.data[0].state+","+success.data[0].city+","+success.data[0].zip;
//              //console.log(full_add)
//              var strfulllength=full_add.split(",");
//                    var ress_letter=squashh(strfulllength);
//                
//                     function squashh(arr_le) {
//                               var tmp = [];
//                                for (var i = 0; i < arr_le.length; i++) {
//                                    if (tmp.lastIndexOf(arr_le[i]) == -1) {
//                                        tmp.push(arr_le[i]);
//                                    }
//                                }
//                                return tmp;
//                            }
//                            console.log(ress_letter)
//                         var add_location=ress_letter.join(",");
//                         console.log(add_location);
                if($scope.selectedcategory['name']=="Business")
                {
                    $scope.uploadpic=true;
//                    console.log("business");
                }
                if($scope.selectedcategory['name']=="Personal")
                {
                    $scope.uploadpic=false;
//                    console.log("perosnla");
                }

            }, function (error) {

                console.log(error);

            });
            var getHei = $(window).height() - 130;
            var wcHei = $(".wideColume").innerHeight();
//            console.log($(window).height());
            if(getHei > wcHei){
                $(".wideColume").css({
                    "height": wcHei,
                    "overflow":"auto"
                });
            }else{
                $(".wideColume").css({
                    "height": getHei,
                    "overflow":"auto"
                });
                
            }

            $(window).resize(function(){
                var getHei = $(window).height() - 130;
                var wcHei = $(".wideColume").innerHeight();
//                console.log($(window).height());
                if(getHei > wcHei){
                    $(".wideColume").css({
                        "height": wcHei,
                        "overflow":"auto"
                    });
                }else{
                    $(".wideColume").css({
                        "height": getHei,
                        "overflow":"auto"
                    });

                }
            });
            $rootScope.$on('image', function (event, data) {
                if (data.data.imageurl) {
                    $scope.imageurl = data.data.imageurl;
                }
            });

//            $scope.$watch("location", function (new_value, old_value) {
////                console.log(new_value, old_value);
//                var locationlatlong = [];
//                if (new_value) {
//                    locationlatlong = new_value.split(",");
//                }
//                $scope.current_latitude = locationlatlong[0];
//                $scope.current_longitude = locationlatlong[1];
//                var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
//                var geocoder = geocoder = new google.maps.Geocoder();
//                geocoder.geocode({'latLng': latlng}, function (results, status) {
//
//                    $scope.address = results[0].formatted_address;
//                    for (var i = 0; i < results[0].address_components.length; i++) {
//                        var types = results[0].address_components[i].types;
//
//                        for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
//                            if (types[typeIdx] == 'postal_code') {
//                                //console.log(results[0].address_components[i].long_name);
//                                $scope.zip = results[0].address_components[i].long_name;
//                            }
//                            if (types[typeIdx] == 'administrative_area_level_1') {
//                                //console.log(results[0].address_components[i].long_name);
//                                $scope.state = results[0].address_components[i].long_name;
//                            }
//                            if (types[typeIdx] == 'administrative_area_level_2') {
//                                //console.log(results[0].address_components[i].long_name);
//                                $scope.city = results[0].address_components[i].long_name;
//                            }
//                            if (types[typeIdx] == 'country') {
//                                //console.log(results[0].address_components[i].long_name);
//                                $scope.country = results[0].address_components[i].long_name;
//                            }
//                        }
//                    }
//                    $scope.$apply();
//                });
//            })
            $scope.changevalue=function(){
                //console.log($scope.othercategory,"here");
            }
            $scope.saveeditcid = function ()
            {
                if (!$scope.altphone) {
                    $scope.altphone = "";
                }
                if($scope.selectedcategory.name == 'Others')
            {   
                    $scope.selectedcategory.name = $scope.othercategory;
            }
            if(($scope.city=="" && $scope.state=="" && $scope.country=="" && $scope.address=="") || $scope.addresscomponent=="")
            {
                $scope.city="";
                $scope.state="";
                $scope.country="";
                $scope.location="";
                $scope.address="";
            }
           
            
                $scope.cookie = $cookieStore.get('_qu');
                data.post_data_string = {"state": $scope.state, "category": $scope.selectedcategory.name, "lastName": $scope.lastname, "alt_phone":$scope.altphone,"phone": $scope.phone, "firstName": $scope.firstname, "method": "createGLCService", "web_token": $scope.cookie.web_token, "url": $scope.url, "zipcode": $scope.zip, "userId": $scope.cookie._id.$id, "address": $scope.address, "location": $scope.location, "city": $scope.city, "companyName": $scope.companyname, "isUpdate": "true", "device_id": "", "country": $scope.country, "email": $scope.email, "designation": $scope.designation}

                dyrctservice.post(data, function (success) {
                    if (success.settings.message == 'GLC data added/updated Successfully.')
                    {
                        $scope.successmessage = "GLC data added/updated successfully.";
                    }
                   $state.go("common.mycid");
                }, function (error) {
                    console.log(error);
                });
            }


            $scope.open = false;
            $scope.toggleselect = function ()
            {
                $scope.open = !$scope.open;
            }
            $scope.selectedcategory = {name: "select category"};
            $scope.selectcategory = function (data)
            {
                $scope.selectedcategory = data;
                $scope.toggleselect();
//                console.log($scope.selectedcategory);
            }
            $scope.canceleditcid = function ()
            {
                $state.go("common.mycid");
            }
            $scope.editmap = function(location,address,city,state,country,zip,check){
                
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/mycid/editmap.html",
                    controller: 'editmapCtrl',
                    resolve: {
                        location: function() {
                            return location;
                        },
                        address: function() {
                            return address;
                        },
                        city: function() {
                            return city;
                        },
                        state: function() {
                            return state;
                        },
                        country: function() {
                            return country;
                        },
                        zip: function() {
                            return zip;
                        },
                        check: function() {
                            return check;
                        }
//                        ,
//                        id: function() {
//                            return id;
//                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    //console.log(selectedItem)
                    $scope.address = selectedItem.address;
                    $scope.location = selectedItem.location;
                    $scope.country = selectedItem.country;
                    $scope.state = selectedItem.state;
                    $scope.city = selectedItem.city;
                    $scope.zip = selectedItem.zipcode;
                    
                   $scope.addresscomponent=$scope.address+","+$scope.country+","+$scope.state+","+$scope.city+","+$scope.zip;
                }, function() {

                });
            }

            $scope.$watch('profile_pic', function (newval, oldval) {
                console.log("newval")
                var data = {};
                data = {"method": "uploadProfilePic", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token}
                var file = $scope.profile_pic;
                console.log(data,file)
                $rootScope.typeimg = "mainimg";
//                console.log('file is ');
//                console.dir(file);
                var uploadUrl = baseurl+"dyrct_ws/public/rest/user";
                fileUpload.uploadFileToUrl(file, uploadUrl, data);
            });

        }]);

});

