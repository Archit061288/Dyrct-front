define(['angularAMD',"ng-file-upload",'components/usercid/editmapCtrl'], function (angularAMD) {

    angularAMD.controller('usercidCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'fileUpload', '$rootScope','GLOBALS','$uibModal',
        function ($scope, authService, dyrctservice, $cookieStore, $state, $stateParams, fileUpload, $rootScope,GLOBALS,$uibModal) {
            var baseurl= $rootScope.baseurl;
            $scope.displayadd=false;
            $scope.openmoredeatil=false;
            console.log($scope.displayadd);
            $scope.items = [{name: "Home"},{name: "Business"}, {name: "Others"}];
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();
                $('body').find('div.modal').find('div.fade').remove();
            });
            $('body').find('div.fade').remove();
            $scope.fileSelected = function (file) {
                //console.log(file);
            }
            var getHei = $(window).height() - 130;
            var wcHei = $(".wideColume").innerHeight();
            //console.log($(window).height());
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
                //console.log($(window).height());
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
            $rootScope.mapattr=true;
            $rootScope.topsearch=false;
            $scope.selectedcategory = {};
            var data = {};
            $scope.selectedcategory = {name: "Business"};
            $scope.cookie = $cookieStore.get('_qu');
            
            
            
            
            
            if ($scope.cookie.category || $scope.cookie.allData[0].category)
            {
                $scope.selectedcategory.name = $scope.cookie.category?$scope.cookie.category:$scope.cookie.allData[0].category;
            }
            
            $scope.firstname = $scope.cookie.first_name?$scope.cookie.first_name:$scope.cookie.allData[0].firstName;
            $scope.lastname = $scope.cookie.last_name?$scope.cookie.last_name:$scope.cookie.allData[0].lastname;
            $scope.companyname = $scope.cookie.company_name?$scope.cookie.company_name:$scope.cookie.allData[0].companyName;
            $scope.designation = $scope.cookie.designation?$scope.cookie.designation:$scope.cookie.allData[0].designation;
            $scope.email = $scope.cookie.email?$scope.cookie.email:$scope.cookie.allData[0].email;
            $scope.phone = $scope.cookie.phone?$scope.cookie.phone:$scope.cookie.allData[0].phone;
            $scope.url = $scope.cookie.url?$scope.cookie.url:$scope.cookie.allData[0].url;
            //$scope.address = $scope.cookie.default_address?$scope.cookie.default_address:$scope.cookie.allData[0].default_address;
            $scope.address = $scope.cookie.address?$scope.cookie.address:$scope.cookie.allData[0].address;
            $scope.country = $scope.cookie.country?$scope.cookie.country:$scope.cookie.allData[0].country;
            $scope.state = $scope.cookie.state?$scope.cookie.state:$scope.cookie.allData[0].state;
            $scope.city = $scope.cookie.city?$scope.cookie.city:$scope.cookie.allData[0].city;
            $scope.zip = $scope.cookie.zipcode?$scope.cookie.zipcode:$scope.cookie.allData[0].zipcode;
            $scope.location = $scope.cookie.location?$scope.cookie.location:$scope.cookie.allData[0].location;
            $scope.imageurl = $scope.cookie.profile_pic?$scope.cookie.profile_pic:$scope.cookie.allData[0].profile_pic;
            $scope.altphone = $scope.cookie.alt_phone?$scope.cookie.alt_phone:$scope.cookie.allData[0].alt_phone;
            $scope.addresscomponent=$scope.address+","+$scope.country+","+$scope.state+","+$scope.city+","+$scope.zip;
            if ($scope.selectedcategory.name == "Business")
            {
                $scope.uploadpic = true;
                $scope.matchval=true;

            }
            if($scope.address!="" || $scope.country!="" || $scope.state!="" || $scope.city!="")
            {
            $scope.displayadd=true;
            }
            if($scope.companyname!="" || $scope.designation!="" || $scope.email!="" || $scope.url!="")
            {
            $scope.openmoredeatil=true;
            }
            if ($scope.selectedcategory.name == "Personal")
            {
                $scope.uploadpic = false;
                $scope.matchval=false;
            }
            
            if($scope.cookie.forgotpass=="fp" && $scope.firstname!="" && $scope.lastname!=""  && $scope.email!="" && $scope.url!="" && $scope.address!="" && $scope.country!="" && $scope.state!="" && $scope.city!="" && $scope.zip!="" && $scope.location!="")
            {
                console.log("herefirst")
               if (!$scope.altphone) {
                    $scope.altphone = "";
                }
                data.post_data_string = {
                    "state": $scope.state, 
                    "category": $scope.selectedcategory.name, 
                    "lastName": $scope.lastname, 
                    "phone": $scope.phone, 
                    "firstName": $scope.firstname, 
                    "method": "createGLCService", 
                    "web_token": $scope.cookie.token, 
                    "url": $scope.url, 
                    "zipcode": $scope.zip, 
                    "userId": $scope.cookie.userId, 
                    "address": $scope.address, 
                    "location": $scope.location, 
                    "city": $scope.city, 
                    "companyName": $scope.companyname, 
                    "isUpdate": "true", 
                    "device_id": "", 
                    "country": $scope.country, 
                    "email": $scope.email, 
                    "designation": $scope.designation,
                    "status": "active", 
                    "alt_phone":$scope.altphone
                }
                if ($scope.cookie.allData && $scope.cookie.allData[0].status == 'inactive') {
                    data.post_data_string.isUpdate = 'false';
                }
                else if ($scope.cookie && $scope.cookie.status == 'inactive')
                {
                    data.post_data_string.isUpdate = 'false';
                }


                dyrctservice.post(data, function (success) {
                    
                    $cookieStore.put('_qu', success.data.user_data);
                    $rootScope.$broadcast('mycid', success.data.user_data)
                    $state.go("common.mycid");
                }, function (error) {
                    //console.log(error);
                });
                
            }
            $scope.changevalue=function(){
                //console.log($scope.othercategory,"here");
            }
            
            $scope.savecid = function ()
            {
             console.log("geee")   
                $rootScope.userinactive=false;
                if (!$scope.altphone) {
                    $scope.altphone = "";
                }
                if($scope.selectedcategory.name == 'Others')
            {
                $scope.selectedcategory.name = $scope.othercategory;
            }
           
            console.log($scope.addresscomponent,"addresscom")
            console.log($scope.city,"city")
            if($scope.city=="" && $scope.state=="" && $scope.country=="" && $scope.addresscomponent=="" )
            {
                
                $scope.location="";
                $scope.address="";
            }
            
            data.post_data_string = {
                    "state": $scope.state, 
                    "category": $scope.selectedcategory.name, 
                    "lastName": $scope.lastname, 
                    "phone": $scope.phone, 
                    "firstName": $scope.firstname, 
                    "method": "createGLCService", 
                    "web_token": $scope.cookie.token, 
                    "url": $scope.url, 
                    "zipcode": $scope.zip, 
                    "userId": $scope.cookie.userId, 
                    "address": $scope.address, 
                    "location": $scope.location, 
                    "city": $scope.city, 
                    "companyName": $scope.companyname, 
                    "isUpdate": "true", 
                    "device_id": "", 
                    "country": $scope.country, 
                    "email": $scope.email, 
                    "designation": $scope.designation,
                    "alt_phone":$scope.altphone
                }
                if ($scope.cookie.allData && $scope.cookie.allData[0].status == 'inactive') {
                    data.post_data_string.isUpdate = 'false';
                }
                else if ($scope.cookie && $scope.cookie.status == 'inactive')
                {
                    data.post_data_string.isUpdate = 'false';
                }


                dyrctservice.post(data, function (success) {
                    //console.log(success.data.user_data);
                    if (success.settings.message == 'Contact data added/updated successfully.')
                    {
                        $scope.successmessage = "Contact data added/updated successfully.";
                    }
                    $cookieStore.put('_qu', success.data.user_data);
                    $rootScope.$broadcast('mycid', success.data.user_data)
                    $rootScope.welcome=true;
                    $state.go("common.mycid");
                }, function (error) {
                    //console.log(error);
                });
            };
            
            $scope.moredetail=function(){
                $scope.openmoredeatil=!$scope.openmoredeatil;
            }
            
            $scope.uploadFile = function ()
            {
                var file = $scope.myFile;
                var uploadUrl = "/fileUpload";
                fileUpload.uploadFileToUrl(file, uploadUrl);
            };

            $scope.open = false;
            $scope.toggleselect = function ()
            {
                $scope.open = !$scope.open;
            }

            $scope.selectcategory = function (data)
            {
                $scope.selectedcategory = data;
                $scope.toggleselect();
            }

//            $scope.$watch("location", function (new_value, old_value) {
//                //console.log(new_value, old_value);
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

            data.post_data_string = {"method": "getUserGLC", "userId": ($scope.cookie._id) ? $scope.cookie._id.$id : $scope.cookie.allData[0]._id.$id, "web_token": ($scope.cookie.web_token) ? $scope.cookie.web_token : $scope.cookie.allData[0].web_token}
            dyrctservice.post(data, function (success) {
                $scope.profile_pic = "";

                $scope.imageurl = success.data[0].profile_pic;


            }, function (error) {
                //console.log(error);

            });
            
            $scope.editmap = function(location,address,city,state,country,zip,check){
                
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/usercid/editmap.html",
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
//                        id: function() {
//                            return id;
//                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.displayadd=true;
                    //console.log(selectedItem)
                    $scope.address = selectedItem.address;
                    $scope.location = selectedItem.location;
                    $scope.country = selectedItem.country;
                    $scope.state = selectedItem.state;
                    $scope.city = selectedItem.city;
                    $scope.zip = selectedItem.zipcode;
                     $rootScope.mapattr=true;
                   $scope.addresscomponent=$scope.address+","+$scope.country+","+$scope.state+","+$scope.city+","+$scope.zip;
                }, function() {

                });
            }
            $rootScope.$on('image', function (event, data) {
                if (data.data.imageurl) {
                    $scope.imageurl = data.data.imageurl;
                }
            });
            $scope.$watch('profile_pic', function (newval, oldval) {
                var data = {};
                data = {"method": "uploadProfilePic", "userId": ($scope.cookie._id) ? $scope.cookie._id.$id : $scope.cookie.allData[0]._id.$id, "web_token": ($scope.cookie.web_token) ? $scope.cookie.web_token : $scope.cookie.allData[0].web_token}
                var file = $scope.profile_pic;
                var uploadUrl = baseurl+"dyrct_ws/public/rest/user";
                fileUpload.uploadFileToUrl(file, uploadUrl, data);

            });
            //console.log($scope.selectedcategory);

        }]);

});

