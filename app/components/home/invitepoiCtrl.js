define(['angularAMD','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('invitepoiCtrl', ['$scope', '$rootScope', 'id', '$location', 'authService', 'dyrctservice', 'modifires', '$cookieStore', '$state', '$stateParams', 'uiGmapGoogleMapApi', '$uibModalInstance','$uibModal','GLOBALS',
        function ($scope, $rootScope, id, $location, authService, dyrctservice, modifires, $cookieStore, $state, $stateParams, GoogleMapApi, $uibModalInstance,$uibModal,GLOBALS) {
            $scope.MyCID = $cookieStore.get('_qu');
//            $scope.poiById = poiDataById.data;
//            $scope.poiListData = poiData.data;
//            
            $scope.route1=true;
            $rootScope.$broadcast("route1home",$scope.route1);
            $scope.mapshow = true;
            $scope.id = id;
            //console.log(id);
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
                $scope.map.zoom = 12;
                $scope.$apply();
            })
            $scope.$watch('location', function (newval, oldval) {
                //var markers = [];
                //$scope.markers = [];
                //console.log(newval,oldval,googlemap,"googlemap")
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
                        $scope.address = angular.copy(results[1].formatted_address);
                        $scope.$apply();
                    });
                }
            })
            //Google Map Code End

            $scope.InvitePoi = function () {
                if (!$scope.title) {
                    $scope.title = "";
                }
                var poidata = {};
//                if (type == 'add') {
                //console.log($scope.location)
                poidata.post_data_string = {
                    "method": "invitePoi",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "title": $scope.title,
                    "address": $scope.address,
                    "latitude": $scope.latlong[0],
                    "longitude": $scope.latlong[1],
                    "receivers_id": $scope.id
                }
                dyrctservice.post(poidata, function (success) {
                    if(success.data.error=="empty_address")
                    {
                        $scope.errorr=true;
                        $scope.error=false;
                    }
                    else if(success.data.error=="empty_title")
                    {
                        $scope.error=true;
                        $scope.errorr=false;
                    }
                    else
                    {
                        $uibModalInstance.close();
                    }
                    //
                }, function (error) {
                    console.log(error);
                });
            };

            if ($scope.poiById) {
                $scope.location = $scope.poiById.latitude + "," + $scope.poiById.longitude;
                $scope.title = $scope.poiById.title;
            }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
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
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'The geolocation is not supported by this browser.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
            }
        }]);
});