define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('addschedularCtrl', ['$scope', '$filter', 'dyrctservice', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$cookieStore', 'uiGmapGoogleMapApi',
        function($scope, $filter, dyrctservice, $state, $stateParams, $uibModalInstance, modifires, $cookieStore, uiGmapGoogleMapApi) {
            $scope.loader = true;

            modifires.getUserContacts().then(function(data) {

                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                $scope.poidata = angular.copy(data.data.data.allPoi);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            $scope.search = {"searchName":""};
            
            $scope.productsss = []; 
            $scope.productsss1 = []; 
            
            $scope.$watch('search.searchName', function(newVal) {
                
                $scope.productsss = $filter('searchdata')($scope.contactdata, newVal,'firstName,lastName');
                $scope.productsss1 = $filter('searchdata')($scope.poidata, newVal,'title,address');
               // console.log(newVal,$scope.productsss,$scope.productsss1)
                    if (($scope.productsss && $scope.productsss.length == 0))
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                        $scope.resultflag = false;
//                    }
                } else
                {
                    $scope.resultflag = true;
                }
                if (($scope.productsss1 && $scope.productsss1.length == 0))
                {
//                    if ( typeof(newVal) != undefined)
//                    {
                        $scope.resultflagpoi = false;
//                    }
                } else
                {
                    $scope.resultflagpoi = true;
                }
                
                //console.log(newVal)
                //$scope.products_new.push()
            });
            $scope.MyCID = $cookieStore.get('_qu');
            //$scope.schedular_reminder = 0;
            $('body').find('div.modal-backdrop').remove();
            $scope.error = false;
            $scope.today = function() {
                $scope.fromdatetime = new Date();
                $scope.fromtimedate = new Date().getTime();
                $scope.todatetime = new Date();
                $scope.totimedate = new Date().getTime();
//                $scope.remaindertimedate = new Date().setMinutes(new Date().getMinutes() - $scope.schedular_reminder);
            };
            $scope.today();
            $scope.clear = function() {
                $scope.fromdatetime = null;
                $scope.todatetime = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return //mode === 'day';
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.openfrom = function($event) {
                $scope.status.opened = true;
            };
            $scope.opento = function($event) {
                $scope.status.opened1 = true;
                $scope.errordate = false;
            };
            $scope.setDate = function(year, month, day) {
                $scope.fromdatetime = new Date(year, month, day);
                $scope.todatetime = new Date(year, month, day);

            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.open = false;
            $scope.toggleselect = function ()
            {
                $scope.open = !$scope.open;
            }   
            $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = 'dd-MM-yyyy';//$scope.formats[0];
            $scope.schedular_reminder = "Please select reminder.";
            $scope.reminderoption = [{name:'05'},{name: '10'},{name:  '15'},{name:  '20'},{name: '25'},{name: '30'},{name: '35'},{name: '40'},{name: '45'},{name: '50'},{name: '55'}];
            $scope.selectreminder = function (data)
            {
                $scope.schedular_reminder = data.name;
                $scope.toggleselect();
                $scope.changed();
                console.log($scope.schedular_reminder);
            }
            $scope.status = {
                opened: false
            };
            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };
            $scope.showdata = true;
            $scope.share_type = 'CID';
            console.log($scope.share_type)
            $scope.displaypoidata = function(name) {
                $scope.share_type = name;
                $scope.showdata = false;
                console.log($scope.share_type);
            }
            $scope.displaycontactdata = function(name) {
                $scope.share_type = name;
                $scope.showdata = true;
                console.log($scope.share_type);
            }
            $scope.checkedItems = function(object, check) {
                //var obj = {"id": id, "type": type, "name": name};
                console.log(object)
                if (check == 'contact')
                {
                    var obj = {"name": object.firstName+" "+object.lastName};
                    $scope.Selectedname = obj;
                    $scope.id = object.userId;
                    $scope.type = check;
                    $scope.cid_poi = object.location;
                    var latlong = $scope.cid_poi.split(",");
                    $scope.current_latitude = latlong[0];
                    $scope.current_longitude = latlong[1];
                    var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status) {

                        $scope.address = results[0].formatted_address;
                    })
                }
                if (check == 'poi')
                {
                    var obj = {"name": object.title};
                    $scope.Selectedname = obj;
                    console.log($scope.cid_poi);
                    $scope.id = object.poi_id;
                    $scope.type = check;
                    $scope.cid_poi = object.latitude + "," + object.longitude;
                    var latlong = $scope.cid_poi.split(",");
                    $scope.current_latitude = latlong[0];
                    $scope.current_longitude = latlong[1];
                    var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status) {

                        $scope.address = results[0].formatted_address;
                    })
                }
                //$scope.cid_poi = object;
                //console.log($scope.cid_poi);
            }
            $scope.changed = function() {
                console.log("FromTime", $filter('date')($scope.fromtimedate, 'shortTime'));
                console.log("FromDate", $filter('date')($scope.fromdatetime, 'dd-MM-yyyy'));
                console.log("ToTime", $filter('date')($scope.totimedate, 'shortTime'));
                console.log("ToDate", $filter('date')($scope.todatetime, 'dd-MM-yyyy'));
                if (!$scope.schedular_reminder) {
                    $scope.schedular_reminder = 0;
                }
                $scope.remaindertimedate = $scope.schedular_reminder * 60;
                //$scope.finalremaindertimedate = parseInt($scope.remaindertimedate);
                console.log($scope.remaindertimedate);
                //$scope.finalremaindertimedate = Date.parse($scope.remaindertimedate).getTime()/1000;

            }

            $scope.Addscheduler = function() {
                
                if (!$scope.contactscheduler) {
                        alert("Please select CID/POI.")
                        return false;
                    }
                $scope.nativedateid = new Date().getTime()/1000;
                $scope.finalnativedateid = parseInt($scope.nativedateid);
                var sendgroup = {};
                if (!$scope.scheduler_title || $scope.scheduler_title == '') {
                    $scope.error = true;
                }
                if ($scope.schedular_reminder == "Please select reminder.") {
                    //alert("Please select reminder.")
                    $scope.error = true;
                    return false;
                }
                ////from date timestamp
                var fromdatefilter = $filter('date')($scope.fromtimedate, 'shortTime').toString().split(" ");
                $scope.fromfiltertimeval = fromdatefilter[0];
                if (fromdatefilter[1] == "PM")
                {
                    var fromtimefilter = fromdatefilter[0].split(":");
                    if (fromtimefilter[0] != 12)
                    {
                        fromtimefilter[0] = parseInt(fromtimefilter[0]) + 12;
                    }
                    $scope.fromfiltertimeval = fromtimefilter[0] + ":" + fromtimefilter[1];
                }

                $scope.fromnewdate = $filter('date')($scope.fromdatetime, 'MM-dd-yyyy') + " " + $scope.fromfiltertimeval;
                console.log($scope.fromnewdate);
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.finalfromdatetime = Date.parse($scope.fromnewdate).getTime() / 1000;
                ///to date timestamp
                var todatefilter = $filter('date')($scope.totimedate, 'shortTime').toString().split(" ");
                $scope.tofiltertimeval = todatefilter[0];
                if (todatefilter[1] == "PM")
                {

                    var totimefilter = todatefilter[0].split(":");
                    if (fromtimefilter[0] != 12)
                    {
                        totimefilter[0] = parseInt(totimefilter[0]) + 12;
                    }
                    $scope.tofiltertimeval = totimefilter[0] + ":" + totimefilter[1];
                }

                $scope.tonewdate = $filter('date')($scope.todatetime, 'MM-dd-yyyy') + " " + $scope.tofiltertimeval;
                console.log($scope.tonewdate);
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.finaltodatetime = Date.parse($scope.tonewdate).getTime() / 1000;
                $scope.errordate = false;
//                console.log($scope.finalfromdatetime <= $scope.finaltodatetime,$scope.finalfromdatetime,$scope.finaltodatetime)
                if ($scope.finalfromdatetime > $scope.finaltodatetime) {
                        alert("To date should be greater than from date.")
                        $scope.errordate = true;
                        return false;
                    }
                var scheduler = {};
                scheduler.post_data_string = {
                    "method": "createschedule",
                    "group_history_id": "",
                    "share_type": "",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_id": "",
                    "scheduler_title": $scope.scheduler_title,
                    "from_date_time": $scope.finalfromdatetime,
                    "to_date_time": $scope.finaltodatetime,
                    "reminder": $scope.remaindertimedate,
                    "device_id": $scope.MyCID.web_token,
                    "event_id": $scope.MyCID.web_token +""+$scope.finalnativedateid,
                    "event_native_id": $scope.MyCID.web_token +""+$scope.finalnativedateid,
                    "lat_long": $scope.cid_poi,
                    "address": $scope.address
                }
                dyrctservice.post(scheduler, function(success) {
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });

            };
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }])

});