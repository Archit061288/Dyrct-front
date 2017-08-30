define(['angularAMD', 'ng-map'], function (angularAMD) {

    angularAMD.controller('editmapCtrl', ['$scope', 'authService', '$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'GLOBALS', '$window', 'fileUpload', '$uibModalInstance', 'uiGmapGoogleMapApi', '$uibModalInstance', 'modifires','address','location','check','city','state','country','zip',
        function ($scope, authService, $uibModal, dyrctservice, $cookieStore, $state, $stateParams, GLOBALS, $window, fileUpload, $uibModalInstance, GoogleMapApi, $uibModalInstance, modifires,address,location,check,city,state,country,zip) {
            //console.log(address,location,check);
            $scope.checkmapvalue = check;
            if($scope.checkmapvalue == true)
            {
                $scope.personaladdress = address;
                $scope.city=city;
                $scope.state=state;
                $scope.country=country;
                $scope.zipcode=zip;
            }
            var addresstypescomponent=['street_number','street_address','route','intersection','political','locality','sublocality','sublocality_level_1','sublocality_level_2','premise','neighborhood'];
            $scope.location = location;
            $scope.showmap = true;
            var data = {};
            data.post_data_string = {};
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            //Google Map Code Start
            var googlemap;
            $scope.current_latitude = '-25.845438200221842';
            $scope.current_longitude = '28.200346265625065';
            GoogleMapApi.then(function (maps) {
                googlemap = maps;
                if (googlemap)
                {
//                    console.log(googlemap);
                }

            });




            angular.extend($scope, {
                selected: {
                    options: {
                        visible: false

                    },
                    templateurl: 'window.tpl.html',
                    templateparameter: {}
                },
                map: {
                    control: {},
                    center: {
                        latitude: $scope.current_latitude,
                        longitude: $scope.current_longitude
                    },
                    zoom: 13,
                    dragging: false,
                    bounds: {},
                    markers: [],
                    idkey: 'place_id',
                    events: {
                        idle: function (map) {

                        },
                        dragend: function (map) {
                            var center = map.getCenter();

//                            console.log($scope.map.center, "dragend",center.lat(),center.lng());
                            $scope.location = center.lat() + "," + center.lng();
                            //update the search box bounds after dragging the map
                           //  $scope.checkmapvalue = false;
                            var bounds = map.getBounds();
                            var ne = bounds.getNorthEast();
                            var sw = bounds.getSouthWest();
                            $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                            //$scope.searchbox.options.visible = true;
                        },
                        zoom_changed: function (map) {
//                            console.log($scope.map.center, "zoom");
                             var center = map.getCenter();

//                            console.log($scope.map.center, "dragend",center.lat(),center.lng());
                            $scope.location = center.lat() + "," + center.lng();
                            //update the search box bounds after dragging the map
                           // $scope.checkmapvalue = false;
                            var bounds = map.getBounds();
                            var ne = bounds.getNorthEast();
                            var sw = bounds.getSouthWest();
                            $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                            //$scope.searchbox.options.visible = true;
                        }
                    }
                },
                searchbox: {
                    template: 'searchbox.tpl.html',
                    options: {
                        autocomplete: true,
                        //  types: ['(cities)'],
                        // componentRestrictions: {country: 'fr'}
                    },
                    events: {
                        place_changed: function (autocomplete, arg1, arg2) {
                            var place = autocomplete.getPlace();
//                            console.log(place.geometry.location, $scope.map.center, "place_changed")
                            $scope.location = place.geometry.location.A + "," + (place.geometry.location.F ? place.geometry.location.F : place.geometry.location.C);

                        }
                    }



                }
            });
            $scope.$on("place_changed",function(){
//                console.log("call-----",$scope.map)
                $scope.map.zoom = 18;
                $scope.$apply();
            })
            $scope.$watch('location', function (newval, oldval) {
                
                //var markers = [];
                //$scope.markers = [];
//                console.log(newval,oldval)
                if (newval) {
                    $scope.latlong = newval.split(',');

//                    $scope.map.zoom = 14;
                    $scope.map.center.latitude = $scope.current_latitude = parseFloat($scope.latlong[0]);
                    $scope.map.center.longitude= $scope.current_longitude = parseFloat($scope.latlong[1]);
                    //  console.log($scope.map,$scope.map.center,"center")
//                    $scope.map.zoom = 10;
                    var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
                    //console.log(latlng,"latlong")
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function (results, status) {
                            //console.log(results)
                        $scope.address = angular.copy(results[0].formatted_address);
                       // console.log($scope.address);
                       $scope.persaddress=[];
                        if($scope.checkmapvalue){
                            $scope.checkmapvalue=false;
                        }
                        else{
                            angular.forEach(results[0].address_components,function(item,index){
                                //console.log(item.types[0]);
                            angular.forEach(item.types,function(itemtypes,i){
                                //console.log(addresstypescomponent,itemtypes);
                                if(i==0)
                                {
                                if(addresstypescomponent.indexOf(itemtypes)>=0)
                                {
                                    $scope.persaddress.push(item.long_name);
                                }
                                }
                            });    
                            });
                            $scope.personaladdress=$scope.persaddress.join(",");
                            //console.log($scope.personaladdress);
                            //$scope.personaladdress = angular.copy(results[0].address_components[0].long_name+","+results[0].address_components[1].long_name);
                        
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            var types = results[0].address_components[i].types;
//                            console.log(results);
                            for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
                                if (types[typeIdx] == 'postal_code') {
                                    //console.log(results[0].address_components[i].long_name);
                                    $scope.zipcode = results[0].address_components[i].long_name;
                                }
                                if (types[typeIdx] == 'administrative_area_level_1') {
                                    //console.log(results[0].address_components[i].long_name);
                                    $scope.state = results[0].address_components[i].long_name;
                                }
                                if (types[typeIdx] == 'administrative_area_level_2') {
                                    //console.log(results[0].address_components[i].long_name);
                                    $scope.city = results[0].address_components[i].long_name;
                                }
                                if (types[typeIdx] == 'country') {
                                    //console.log(results[0].address_components[i].long_name);
                                    $scope.country = results[0].address_components[i].long_name;
                                }
                            }
                        }
                        }
                        $scope.latitdlongitd = $scope.current_latitude + "," + $scope.current_longitude,
                        $scope.$apply();
                    });
                }
            })
            //Google Map Code End
            if (location) {
                
                //$scope.location = $scope.poiById.latitude + "," + $scope.poiById.longitude;
                $scope.address=address;
                var maplocation = location.split(',')
                //console.log(location);
                $scope.map.center.latitude = $scope.current_latitude = maplocation[0];
                $scope.map.center.longitude = $scope.current_longitude = maplocation[1];
                $scope.map.center.zoom = 18;
                    
                //console.log($scope.map)
            }
            if(!location)
            {
             if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.map.center.latitude = $scope.current_latitude = position.coords.latitude;
                    $scope.map.center.longitude = $scope.current_longitude = position.coords.longitude;
                    $scope.location = $scope.map.center.latitude + "," + $scope.map.center.longitude;
//                    console.log(position, $scope.map)
                    $scope.$apply();
                }, function () {
                });
            }
            else {
                alert("The geolocation is not supported by this browser.");
            }
            }
        $scope.saveaddress = function(){
            var location ={'address':$scope.personaladdress,'location':$scope.location,'city':$scope.city,'state':$scope.state,'country':$scope.country,'zipcode':$scope.zipcode}
            $uibModalInstance.close(location)
            //$scope.personaladdress 
        }
            //console.log($scope.personaladdress);
        }]);
});

