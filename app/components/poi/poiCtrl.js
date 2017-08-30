define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('poiCtrl', ['$scope', '$rootScope', '$location', 'authService', 'dyrctpoiservice', 'modifires', '$cookieStore', '$state', '$stateParams', 'poiData', 'poiDataById', 'uiGmapGoogleMapApi',
        function($scope, $rootScope, $location, authService, dyrctpoiservice, modifires, $cookieStore, $state, $stateParams, poiData, poiDataById, GoogleMapApi) {
            //console.log("poictrl");
            $rootScope.topsearch = false;
            $scope.poi_type="private";
            var markerID = 99;
            var getHei = $(window).height() - 130;
            var wcHei = $(".wideColume").innerHeight();
            //console.log($(window).height());
            if(getHei > wcHei){
                $(".wideColume").css({
                    "height": wcHei,
                    "overflow":"auto"
                });
//                $(".angular-google-map-container").css({
//                    "height": $(window).height() - 160,
//                    "overflow":"auto"
//                });
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
//                    $(".angular-google-map-container").css({
//                        "height": $(window).height() - 160,
//                        "overflow":"auto"
//                    });
                }else{
                    $(".wideColume").css({
                        "height": getHei,
                        "overflow":"auto"
                    });

                }
            });
            $scope.poiById = poiDataById.data;
            
            $scope.poiListData = poiData.data;
            $scope.MyCID = $cookieStore.get('_qu');
            //console.log($scope.poiById,$scope.poiListData)
            if ($scope.poiById) {
                $scope.latlong = [];
                $scope.latlong[0] = $scope.poiById.latitude
                $scope.latlong[1] = $scope.poiById.longitude
            }
           //Google Map Code Start
            var googlemap;
            $scope.current_latitude = '-25.845438200221842';
            $scope.current_longitude = '28.200346265625065';
            GoogleMapApi.then(function (maps) {
                googlemap = maps;
                if (googlemap)
                {
                    //console.log(googlemap);
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
                            var bounds = map.getBounds();
                            var ne = bounds.getNorthEast();
                            var sw = bounds.getSouthWest();
                            $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
                            //$scope.searchbox.options.visible = true;
                        },
                        zoom_changed: function (map) {
                             var center = map.getCenter();

//                            console.log($scope.map.center, "dragend",center.lat(),center.lng());
                            $scope.location = center.lat() + "," + center.lng();
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
                            //console.log(place.geometry.location, $scope.map.center, "place_changed")
                            $scope.location = place.geometry.location.A + "," + (place.geometry.location.F ? place.geometry.location.F : place.geometry.location.C);

                        }
                    }



                }
            });
            $scope.$on("place_changed",function(){
                //console.log("call-----",$scope.map)
                $scope.map.zoom = 18;
                $scope.$apply();
            })
            $scope.$watch('location', function (newval, oldval) {
                //var markers = [];
                //$scope.markers = [];
                //console.log(newval,oldval,googlemap,"googlemap")
                if (newval) {
                    $scope.latlong = newval.split(',');
                    //console.log($scope.latlong,"here");
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
                        $scope.address = angular.copy(results[1].formatted_address);
                        $scope.$apply();
                    });
                }
            })
            //Google Map Code End
            
            $scope.checkpublic=function(publictype){
                console.log(publictype)
                if(publictype==true)
                {
                    $scope.poi_type="public";
                }
                else
                {
                    $scope.poi_type="private";
                }
                
            }
            
            $scope.addpoi = function() {
                if (!$scope.title || $scope.title == '' && !$scope.address || $scope.address == '') {
                    $scope.contacterror = true;
                }
                var poidata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                poidata.post_data_string = {
                    "method": "userPoiService",
                    "isUpdate": "add",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "title": $scope.title,
                    "address": $scope.address,
                    "latitude": $scope.latlong[0],
                    "longitude": $scope.latlong[1],
                    "is_poi": "true",
                    "poi_type":$scope.poi_type
                }
                dyrctpoiservice.post(poidata, function(success) {
                    if (success.settings.message == 'Address saved successfully.')
                    {
                        $scope.successmessage = "Address saved successfully.";
                    }
                    ga("send", "event", {eventCategory: "Create POI", eventAction: "Create POI", eventLabel: "Create POI", userId: $scope.MyCID._id.$id});
                    $location.path('/poilistview');
                }, function(error) {
                    console.log(error);
                });
            };
            $scope.editpoi = function() {
                if($scope.public.checked)
                {
                    $scope.poi_type="public";
                }
                else
                {
                    $scope.poi_type="private";
                }
                if (!$scope.title || $scope.title == '' && !$scope.address || $scope.address == '') {
                    $scope.contacterror = true;
                }
                var poidata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                poidata.post_data_string = {
                    "method": "userPoiService",
                    "poi_id": $stateParams.id,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "isUpdate": "update",
                    "title": $scope.title,
                    "address": $scope.address,
                    "latitude": $scope.latlong[0],
                    "longitude": $scope.latlong[1],
                    "is_poi": "true",
                    "poi_type":$scope.poi_type

                }
                //console.log(poidata);
                dyrctpoiservice.post(poidata, function(success) {
                    if (success.settings.message == 'GLC data added/updated Successfully.')
                    {
                        $scope.successmessage = "GLC data added/updated successfully.";
                    }
                    $location.path('/poilistview');
                }, function(error) {
                    console.log(error);
                });
            };
            if ($scope.poiById) {
                
                //$scope.location = $scope.poiById.latitude + "," + $scope.poiById.longitude;
                $scope.address=$scope.poiById.address;
                if($scope.poiById.poi_type=="public")
                {
                    $scope.public={'checked':true}
                }
                $scope.map.center.latitude = $scope.current_latitude = $scope.poiById.latitude;
                $scope.map.center.longitude = $scope.current_longitude = $scope.poiById.longitude;
                $scope.map.center.zoom = 18;
                    
                //console.log($scope.map)
                $scope.title = $scope.poiById.title;
            }
            else{
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        $scope.map.center.latitude = $scope.current_latitude = position.coords.latitude;
                        $scope.map.center.longitude = $scope.current_longitude = position.coords.longitude;
                        $scope.location = $scope.map.center.latitude + "," + $scope.map.center.longitude;
                        //console.log(position, $scope.map)
                        $scope.$apply();
                    }, function () {
                    });
                }
                else {
                    alert("The geolocation is not supported by this browser.");
                }
            }
            
            
        }]);
});

