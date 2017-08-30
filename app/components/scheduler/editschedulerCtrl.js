define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('editschedulerCtrl', ['$scope', '$filter', 'dyrctservice', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$cookieStore','eventid',
        function($scope, $filter, dyrctservice, $state, $stateParams, $uibModalInstance, modifires, $cookieStore,eventid) {
            $scope.loader = true;
            $scope.MyCID = $cookieStore.get('_qu');
            modifires.getUserContacts().then(function(data) {

                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                $scope.poidata = angular.copy(data.data.data.allPoi);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            console.log(eventid);
            $scope.getSchedulerEventidData = function() {
                var schedulereventiddata = {}
                schedulereventiddata.post_data_string = {
                    "method": "getschedulelistbyid",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "schedule_id": eventid
                }
                dyrctservice.post(schedulereventiddata, function(success) {
                    console.log(success)
                    var obj = success.data;
                   if (success) {
                $scope.schedulerid = obj._id;
                $scope.latlong = obj.lat_long;
                console.log($scope.latlong);
                $scope.address = obj.address;

                //$scope.latlong = obj.lat_long.latitude+","+obj.lat_long.latitude;
                console.log(obj.address);
                //console.log(new Date().setMinutes(new Date(obj.remainder*1000)));
                $scope.device_id = obj.device_id;
                $scope.events_id = obj.event_id;
                $scope.event_native_id = obj.event_native_id;
                $scope.scheduler_title = obj.scheduler_title
                var fromtimestamp = obj.from_date;
                var totimestamp = obj.to_date;
                var fromdate = new Date(fromtimestamp * 1000);
                console.log(fromdate);
                var todate = new Date(totimestamp * 1000);
                $scope.schedular_reminder = obj.reminder / 60 
//                console.log($scope.schedular_reminder);
                
//                $scope.finalremaindertimedate = parseInt($scope.remaindertimedate);
//                console.log($scope.finalremaindertimedate);
                //$scope.finalremaindertimedate = $scope.schedular_reminder;
//                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear();
//                $scope.datetime = datevalues;
//                $scope.timeinterval = date.getHours() + ':' + (date.getMinutes().toString().length == 2 ? date.getMinutes() : "0" + date.getMinutes());
//                var timedate = $scope.datetime + " " +
//                console.log($scope.timeinterval,$scope.datetime);
                $scope.fromdatetime = fromdate;
                $scope.fromtimedate = fromdate;
                //console.log($scope.fromdatetime,$scope.fromtimedate);
                $scope.todatetime = todate;
                $scope.totimedate = todate;
                console.log($filter('date')(fromdate, 'dd-MM-yyyy'));
                console.log($filter('date')(todate, 'dd-MM-yyyy'));

            }
                }, function(error) {
                    console.log(error);
                });
            }
            $scope.getSchedulerEventidData();
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
            
            //$scope.schedular_reminder = 0;
//            console.log(obj);
            
            $scope.today = function() {
                $scope.fromdatetime = new Date();
                $scope.fromtimedate = new Date().getTime();
                $scope.todatetime = new Date();
                $scope.totimedate = new Date().getTime();
//                $scope.remaindertimedate = new Date().setMinutes(new Date().getMinutes() - $scope.schedular_reminder);
            };
//            $scope.today();
            $scope.clear = function() {
                $scope.fromdatetime = null;
                $scope.todatetime = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return (mode === 'day' && (date.getDay() === 0));
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
            $scope.toggleselect = function()
            {
                $scope.open = !$scope.open;
            }
            $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];
            //$scope.schedular_reminder = "Please select reminder.";
            $scope.reminderoption = [{name: '05'}, {name: '10'}, {name: '15'}, {name: '20'}, {name: '25'}, {name: '30'}, {name: '35'}, {name: '40'}, {name: '45'}, {name: '50'}, {name: '55'}];
            $scope.selectreminder = function(data)
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
            $scope.checkedItems = function(obj, check) {
                //var obj = {"id": id, "type": type, "name": name};
                console.log(obj)
                if (check == 'contact')
                {
                    var object = {"name": obj.firstName + " " + obj.lastName};
                    $scope.Selectedname = object;
                    $scope.id = obj.userId;
                    $scope.type = check;
                    $scope.latlong = obj.location;
                    console.log(obj)
                    var latlong = $scope.latlong.split(",");
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
                    var object = {"name": obj.title};
                    $scope.Selectedname = object;
                    $scope.id = obj.poi_id;
                    $scope.type = check;
                    $scope.latlong = obj.latitude + "," + obj.longitude;
                    console.log(obj)
                    var latlong = $scope.latlong.split(",");
                    $scope.current_latitude = latlong[0];
                    $scope.current_longitude = latlong[1];
                    var latlng = new google.maps.LatLng($scope.current_latitude, $scope.current_longitude);
                    var geocoder = geocoder = new google.maps.Geocoder();
                    geocoder.geocode({'latLng': latlng}, function(results, status) {

                        $scope.address = results[0].formatted_address;
                    })
                }
//                $scope.cid_poi = obj;
//                console.log($scope.cid_poi);
            }
            $scope.changed = function() {
                console.log("FromTime", $filter('date')($scope.fromtimedate, 'shortTime'));
                console.log("FromDate", $filter('date')($scope.fromdatetime, 'dd-MM-yyyy'));
                console.log("ToTime", $filter('date')($scope.totimedate, 'shortTime'));
                console.log("ToDate", $filter('date')($scope.todatetime, 'dd-MM-yyyy'));
                
//                $scope.remaindertimedate = new Date($scope.totimedate).setMinutes(new Date($scope.totimedate).getMinutes() - $scope.schedular_reminder) / 1000;
//                $scope.finalremaindertimedate = parseInt($scope.remaindertimedate);
//                console.log($scope.finalremaindertimedate);
            }

            $scope.Editscheduler = function() {
                var sendgroup = {};
//                if(!$scope.contactscheduler){
//                    alert("Please Select CID/POI")
//                    return false;
//                }
                $scope.nativedateid = new Date().getTime()/1000;
                $scope.finalnativedateid = parseInt($scope.nativedateid);
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
                console.log($filter('date')($scope.fromdatetime, 'MM-dd-yyyy'), $scope.fromnewdate, Date.parse($scope.fromnewdate));
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.finalfromdatetime = Date.parse($scope.fromnewdate).getTime() / 1000;
                console.log($scope.finalfromdatetime);
                ///to date timestamp
                var todatefilter = $filter('date')($scope.totimedate, 'shortTime').toString().split(" ");
                $scope.tofiltertimeval = todatefilter[0];
                if (todatefilter[1] == "PM")
                {
                    var totimefilter = todatefilter[0].split(":");
                    if (totimefilter[0] != 12)
                    {
                        totimefilter[0] = parseInt(totimefilter[0]) + 12;
                    }
                    $scope.tofiltertimeval = totimefilter[0] + ":" + totimefilter[1];
                }

                $scope.tonewdate = $filter('date')($scope.todatetime, 'MM-dd-yyyy') + " " + $scope.tofiltertimeval;
                console.log($filter('date')($scope.todatetime, 'MM-dd-yyyy'), $scope.tonewdate, Date.parse($scope.tonewdate));
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.finaltodatetime = Date.parse($scope.tonewdate).getTime() / 1000;
                console.log($scope.finaltodatetime,$scope.nativedateid);
                $scope.remaindertimedate = $scope.schedular_reminder * 60;
                if ($scope.finalfromdatetime > $scope.finaltodatetime) {
                        alert("To date should be greater than from date.")
                        $scope.errordate = true;
                        return false;
                    }
                var scheduler = {};
                scheduler.post_data_string = {
                    "method": "editschedule",
                    "group_history_id": "",
                    "share_type": "",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "share_type_id": "",
                    "scheduler_title": $scope.scheduler_title,
                    "from_date_time": $scope.finalfromdatetime,
                    "to_date_time": $scope.finaltodatetime,
                    "reminder": $scope.remaindertimedate,
                    "schedule_id": $scope.schedulerid,
                    "device_id": $scope.device_id,
                    "event_id": $scope.events_id,
                    "lat_long": $scope.latlong,
                    "event_native_id": $scope.event_native_id,
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