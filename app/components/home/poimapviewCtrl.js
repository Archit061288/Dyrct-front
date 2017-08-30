define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('poimapviewCtrl', ['$scope', '$rootScope','$stateParams','modifires', 'uiGmapGoogleMapApi','$cookieStore',
        function($scope, $rootScope,$stateParams,modifires, GoogleMapApi,$cookieStore) {
            modifires.getUserPoi().then(function(success){
                getUserPoiData=success;
            $scope.userpoi = getUserPoiData.data ? getUserPoiData.data : '';
            $scope.userspoilist = [];
            $scope.route1=true;
            $rootScope.$broadcast("route1home",$scope.route1);
            angular.forEach($scope.userpoi, function(value) {
                if (value.status == 'active')
                {
                    $scope.userspoilist.push(value);
                }
            })
            $scope.mapmarker = $scope.userspoilist;
            if($scope.mapmarker.length==0)
            {
            var googlemap;
            $scope.current_latitude = '-25.845438200221842';
            $scope.current_longitude = '28.200346265625065';
            GoogleMapApi.then(function (maps) {
                googlemap = maps;
                if (googlemap)
                {
                    console.log(googlemap);
                }

            });
            $scope.map = {
                center: {
                    latitude: $scope.current_latitude,
                    longitude: $scope.current_longitude
                },
                zoom: 12,
                bounds: {}
            };
            if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        $scope.map.center.latitude = $scope.current_latitude = position.coords.latitude;
                        $scope.map.center.longitude = $scope.current_longitude = position.coords.longitude;
                        $scope.location = $scope.map.center.latitude + "," + $scope.map.center.longitude;
                        console.log(position, $scope.map)
                        $scope.$apply();
                    }, function () {
                    });
                }
                else {
                    alert("The geolocation is not supported by this browser.");
                }
            }
            else
            {
                
            
            $scope.map = {
                center: {
                    latitude: $scope.mapmarker[0].latitude,
                    longitude: $scope.mapmarker[0].longitude
                },
                zoom: 12,
                bounds: {}
            };
            $scope.options = {
                scrollwheel: true
            };
            $rootScope.topsearch = false;
            var createRandomMarker = function(i, bounds, mapdata,idKey) {
                if (idKey == null) {
                    idKey = "id";
                }
                var ret = {
                    latitude: mapdata.latitude,
                    longitude: mapdata.longitude,
                    title: mapdata.title,
                    address:mapdata.address,
                    icon:"assets/img/map-point.png"
                };
                ret[idKey] = i;
                return ret;
            };
            $scope.randomMarkers = [];
            // Get the bounds from the map once it's loaded
            $scope.$watch(function() {
                return $scope.map.bounds;
            }, function(nv, ov) {
                // Only need to regenerate once
                if (!ov.southwest && nv.southwest) {
                    var markers = [];
                    for (var i = 0; i < $scope.mapmarker.length; i++) {
                        markers.push(createRandomMarker(i, $scope.map.bounds,$scope.mapmarker[i]))
                    }
                    $scope.randomMarkers = markers;
                }
            }, true);
            }
            },function(error){

            });
            $scope.onClickTab = function(tab) {

                $scope.currentTab = tab;
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
            $rootScope.topSearch=false;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.mapview = true;
            $scope.open = false;
            $scope.mapviewclass = "active";
            $scope.toggleselect = function()
            {
                $scope.open = !$scope.open;
            }
            


        }])
});