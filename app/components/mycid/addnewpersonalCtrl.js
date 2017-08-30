define(['angularAMD', 'ng-map'], function (angularAMD) {

    angularAMD.controller('addnewpersonalCtrl', ['$scope', 'authService', '$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'GLOBALS', '$window', 'fileUpload', '$uibModalInstance', 'uiGmapGoogleMapApi', 'name', '$uibModalInstance', 'modifires',
        function ($scope, authService, $uibModal, dyrctservice, $cookieStore, $state, $stateParams, GLOBALS, $window, fileUpload, $uibModalInstance, GoogleMapApi, name, $uibModalInstance, modifires) {
            $scope.showmap = true;
            var data = {};
            data.post_data_string = {};
            $scope.name = name;
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.current_latitude = '40.74349';
            $scope.current_longitude = '-73.990822';
            GoogleMapApi.then(function (maps) {
                maps.visualRefresh = true;
                $scope.defaultBounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng($scope.current_latitude, $scope.current_longitude),
                        new google.maps.LatLng($scope.current_latitude, $scope.current_longitude));


                $scope.map.bounds = {
                    northeast: {
                        latitude: $scope.defaultBounds.getNorthEast().lat(),
                        longitude: $scope.defaultBounds.getNorthEast().lng()
                    },
                    southwest: {
                        latitude: $scope.defaultBounds.getSouthWest().lat(),
                        longitude: -$scope.defaultBounds.getSouthWest().lng()

                    }
                }
                $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
            });


            var markers = [];
            $scope.markers = [];
//            if (selectedMapData.loc && selectedMapData.loc.coordinates) {
//                $scope.current_latitude = selectedMapData.loc.coordinates[1] ? selectedMapData.loc.coordinates[1] : '4.5977483593555';
//                $scope.current_longitude = selectedMapData.loc.coordinates[0] ? selectedMapData.loc.coordinates[0] : '-74.072092';
//            } 
//            else {

//            }
            markers.latitude = $scope.current_latitude;
            markers.longitude = $scope.current_longitude;
            //console.log(markers.latitude,markers.longitude);
            markers.icon = "assets/img/map-pointer.png";
            $scope.markerOptions = {draggable: true}
            $scope.markerOptions.events = {
                dragend: function (marker, eventName, args) {
                    $scope.current_latitude = args.latitude;
                    $scope.current_longitude = args.longitude;
                    //console.log($scope.current_latitude,$scope.current_longitude);
                    $scope.map.zoom = 16;
                    $scope.location = $scope.current_latitude + "," + $scope.current_longitude;
                    var latlng = new google.maps.LatLng(args.latitude, args.longitude);
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function (results, status) {

                        $scope.address = results[0].formatted_address;
                        $scope.personaladdress = results[0].formatted_address;
                    });

                },
            }
            for (var i = 0; i <= markers.length; i++) {
                markers["id"] = i;
                $scope.markers.push(markers);
            }

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
                        latitude: 40.74349,
                        longitude: -73.990822
                    },
                    zoom: 12,
                    dragging: false,
                    bounds: {},
                    markers: [],
                    idkey: 'place_id',
                    events: {
                        idle: function (map) {

                        },
                        center_changed: function (map) {
                            //  $scope.map.zoom=12;
                        },
                        dragend: function (map) {
                            //update the search box bounds after dragging the map
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
                            markers.latitude = place.geometry.location.A;
                            markers.longitude = place.geometry.location.F;

                            $scope.markers.push(markers);
                            $scope.map.center.latitude = $scope.current_latitude = place.geometry.location.A;
                            $scope.map.center.longitude = $scope.current_longitude = place.geometry.location.F ? place.geometry.location.F : place.geometry.location.C;
//                            $scope.map.zoom = 10;

                        }
                    }



                }
            });

            var zoomChangeBoundsListener =
                    google.maps.event.addListenerOnce($scope.map, 'bounds_changed', function (event) {
                        //console.log(event)
                        if (this.getZoom()) {
                            this.setZoom(8);
                            //console.log($scope.map, $scope.map.control.getGMap(), $scope.map.control.getGMap().getZoom())
                        }
                    });

            $scope.$watch('location', function (newval, oldval) {
                //var markers = [];
                //$scope.markers = [];

                if (newval) {
                    $scope.latlong = newval.split(',');
                    GoogleMapApi.then(function (maps) {
                        maps.visualRefresh = true;
                        $scope.defaultBounds = new google.maps.LatLngBounds(
                                new google.maps.LatLng($scope.latlong[0], $scope.latlong[1]));


                        $scope.map.bounds = {
                            northeast: {
                                latitude: $scope.latlong[0],
                                longitude: $scope.latlong[1]
                            },
                            southwest: {
                                latitude: $scope.latlong[0],
                                longitude: $scope.latlong[1]

                            }
                        }
//                $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
                    });
                    //var place = autocomplete.getPlace();
//                    $scope.markerOptions = {draggable: true}
                    markers.latitude = parseFloat($scope.latlong[0]); //place.geometry.location.A;
                    markers.longitude = parseFloat($scope.latlong[1]); //place.geometry.location.F;
                    markers.icon = "assets/img/map-pointer.png";
                    $scope.markers.push(markers);
                    $scope.map.center.latitude = $scope.current_latitude = parseFloat($scope.latlong[0]);
                    $scope.map.center.longitude = $scope.current_longitude = parseFloat($scope.latlong[1]);
                    $scope.map.zoom = 12;
                    var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function (results, status) {

                        $scope.address = angular.copy(results[0].formatted_address);
                        $scope.personaladdress = angular.copy(results[0].formatted_address);
                        for (var i = 0; i < results[0].address_components.length; i++) {
                            var types = results[0].address_components[i].types;

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
                        $scope.latitdlongitd = $scope.current_latitude + "," + $scope.current_longitude,
                                //$scope.zipcode = angular.copy(results[3].address_components[0].long_name);
                                $scope.$apply();
                    });



                    // $scope.map.control.getGMap().zoom=8;

//                    setTimeout(function () {
//                        google.maps.event.removeListener(zoomChangeBoundsListener)
//                    }, 2000);
//                   
                }

            })

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.map.center.latitude = $scope.current_latitude = position.coords.latitude;
                    $scope.map.center.longitude = $scope.current_longitude = position.coords.longitude;
                    // $scope.map.center.latitude = $scope.current_latitude = '4.5977483593555';
                    //$scope.map.center.longitude = $scope.current_longitude = '-74.0760867';
                    $scope.map.zoom = 12;
                    markers = [];
                    markers.latitude = $scope.current_latitude;
                    markers.longitude = $scope.current_longitude;
                    markers.icon = "assets/img/map-pointer.png";
                    markers["id"] = 21212;
                    $scope.markers.push(markers);
                    $scope.$apply();
//                    $scope.processMarkers();
//                console.log(position,$scope.map)
                }, function () {
                });
            }
            else {
                alert("The geolocation is not supported by this browser.");
            }

            $scope.addpersonaladd = function ()
            {
                if (!$scope.phonenumber || $scope.phonenumber == '')
                {
                    $scope.phoneerror = true;
                }
                
                else{
                    $scope.phoneerror = false;
                }
                if (!$scope.email || $scope.email == '')
                {
                    $scope.emailerror = true;
                }
                else{
                    $scope.emailerror = false;
                }
                if (!$scope.companyname || $scope.companyname == '')
                {
                    $scope.companynameerror = true;
                }
                else{
                    $scope.companynameerror = false;
                }

                if ((!$scope.phonenumber || $scope.phonenumber == '') || (!$scope.email || $scope.email == '') || (!$scope.companyname || $scope.companyname == ''))
                {
                    return false;
                }
                if ((!$scope.latitdlongitd || $scope.latitdlongitd == ''))
                {
                    alert("Please select address from map.");
                    return false;
                }
                var data = {};
                $uibModalInstance.close();
                $scope.mycid = $cookieStore.get('_qu');
                data.post_data_string = {"method": "addPublicAndPrivateAddress", "userId": $scope.mycid._id.$id, "web_token": $scope.mycid.web_token, "type": "add", "address_type": name, "company_name": $scope.companyname, "email": $scope.email, "address": $scope.personaladdress, "phone": $scope.phonenumber, "country": $scope.country, "state": $scope.state, "city": $scope.city, "zipcode": $scope.zipcode, "latlong": $scope.latitdlongitd}
                dyrctservice.post(data, function (success) {
                    
                }, function (error) {
                    console.log(error);
                });
            }
            
            $scope.$watch('phonenumber', function(newVal, oldVal) {
                //console.log(newVal.length,newVal, oldVal)
                if (newVal && (newVal + "").length > 18) {
                    $scope.phonenumber = oldVal;
                }
            });
        }]);
});

