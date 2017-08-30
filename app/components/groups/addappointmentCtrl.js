define(['angularAMD','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('addappointmentCtrl', ['$scope', '$filter', 'dyrctservice', 'obj', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$window', '$cookieStore', 'uiGmapGoogleMapApi','GLOBALS','$uibModal',
        function ($scope, $filter, dyrctservice, obj, $state, $stateParams, $uibModalInstance, modifires, $window, $cookieStore, GoogleMapApi,GLOBALS,$uibModal) {
//            $scope.loader = true;
//            
//            modifires.getUserContacts().then(function(data) {
//                
//                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
//                $scope.poidata = angular.copy(data.data.data.allPoi);
//                $scope.loader = false;
//            }, function() {
//                console.log('error')
//            })
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.mapview = true;

            $scope.groupid = obj;
            //console.log($scope.groupid);
            //console.log(obj)
            var timestamp = $scope.groupid.message_date_time;
            var date = new Date(timestamp * 1000);
            var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
            $scope.datetime = datevalues;
//            console.log(date.getMonth())
            $scope.timeinterval = date.getHours() + ':' + (date.getMinutes().toString().length == 2 ? date.getMinutes() : "0" + date.getMinutes());
            var newdate = new Date(timestamp * 1000);
            var newdatevalues = ((date.getDate()+1) +'-'+ ('0' + (date.getMonth() + 1)).slice(-2) +'-'+ date.getFullYear())
            
            $scope.totimeinterval = (date.getHours()) + ':' + (date.getMinutes().toString().length == 2 ? date.getMinutes() : "0" + date.getMinutes());
            $scope.todatetime = $filter('date')(newdatevalues, 'dd-MM-yyyy') + " " + $scope.totimeinterval;
            $scope.finaltodatetime = Date.parse($scope.todatetime).getTime()/1000;
            $scope.reminderinterval = (date.getHours() - 1) + ':' + (date.getMinutes().toString().length == 2 ? date.getMinutes() : "0" + date.getMinutes());
            $scope.reminder = $filter('date')(newdatevalues, 'dd-MM-yyyy') + " " + $scope.reminderinterval;
            $scope.finalreminder = Date.parse($scope.reminder).getTime()/1000;
//            console.log($scope.groupid.message_date_time,$scope.finaltodatetime,$scope.finalreminder)
            if ($scope.groupid.group_data.location)
            {
                
                var location = $scope.groupid.group_data.location.split(",");
                $scope.groupid.group_data.latitude = location[0];
                $scope.groupid.group_data.longitude = location[1];
            }
            
            
            
            $scope.mapmarker = [];
            $scope.mapmarker.push($scope.groupid.group_data);
            if($scope.mapmarker[0].location=="")
            {
                $scope.mapview=false;
            }else
            {
            $scope.map = {
                center: {
                    latitude: $scope.mapmarker[0].latitude,
                    longitude: $scope.mapmarker[0].longitude
                },
                zoom: 14,
                bounds: {}
            };

            $scope.options = {
                scrollwheel: true
            };

            var createRandomMarker = function (i, bounds, mapdata, idKey) {
                if (idKey == null) {
                    idKey = "id";
                }
                var ret = {
                    latitude: mapdata.latitude,
                    longitude: mapdata.longitude,
                    title: mapdata.title,
                    address: mapdata.address,
                    icon:"assets/img/map-point.png"
                };
                ret[idKey] = i;
                return ret;
            };
            $scope.randomMarkers = [];
            // Get the bounds from the map once it's loaded
            $scope.$watch(function () {
                return $scope.map.bounds;
            }, function (nv, ov) {
                // Only need to regenerate once
                if (!ov.southwest && nv.southwest) {
                    var markers = [];
                    for (var i = 0; i < $scope.mapmarker.length; i++) {
                        markers.push(createRandomMarker(i, $scope.map.bounds, $scope.mapmarker[i]))
                    }
                    $scope.randomMarkers = markers;
                }
            }, true);
        }
            $scope.savecidpoi = function () {
                var savecidpoi = {};
                savecidpoi.post_data_string = {
                    "method": "saveAsPoiCid",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "type": $scope.groupid.type,
                    "type_id": $scope.groupid.type_id
                    
                }
                dyrctservice.post(savecidpoi, function(success) {
                    if(success.data.message == 'You already have this CiD in your Contacts.')
                    {
                         var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this CiD in your Contacts.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    if(success.data.message == 'You already have this POI in your POI list.')
                    {
                        var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'You already have this POI in your POI list.';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                    }
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });
            };
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});