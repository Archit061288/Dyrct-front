define(['angularAMD', 'components/scheduler/addschedularCtrl', 'components/scheduler/editschedulerCtrl'], function(angularAMD) {
    angularAMD.controller('schedulerCtrl', ['$scope', '$rootScope', '$filter', '$uibModal', 'GLOBALS', '$cookieStore', '$compile', 'modifires', 'dyrctservice', '$state', '$stateParams', '$timeout',
        function($scope, $rootScope, $filter, $uibModal, GLOBALS, $cookieStore, $compile, modifires, dyrctservice, $state, $stateParams, $timeout) {
            $scope.MyCID = $cookieStore.get('_qu');
            $('body').click(function () {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            console.log($('body').find('div.fade').remove());
            //console.log(getSchedulerListData)
            //$scope.schedulerlist = getSchedulerListData.data;
            $rootScope.openclass = false;
            $rootScope.topSearch = false;
            $scope.resolvedService = true;
            $scope.getSchedulerListData = function(fromtime, totime) {
                var schedulerlistdata = {}
                schedulerlistdata.post_data_string = {
                    "method": "getschedulelisttimestamp",
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "from_time": fromtime,
                    "to_time": totime
                }
                dyrctservice.post(schedulerlistdata, function(success) {
                    //console.log(success)
                    $scope.schedulerlist = success.data;
                    
                    $scope.loadEvents();
                    // $scope.pushAllEvents();
                    //console.log($scope.schedulerlist)
                    $scope.resolvedService = true;
                }, function(error) {
                    console.log(error);
                });
            }
            //            $scope.schedulerlistlength = [];
            //            angular.forEach($scope.schedulerlist, function(value) {
            //                if (value.status == 'active')
            //                {
            //                    $scope.schedulerlistlength.push(value);
            //                }
            //            })
            //            $scope.totalItems = $scope.schedulerlistlength.length;
            //            $scope.currentPage = 1;
            //            $scope.pageChanged = function() {
            //
            //            };
            //            $scope.maxSize = 5;
            $scope.finalfromtime = 1451174400;
            $scope.finaltotime = 1454803200;
            //$scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime)
            $scope.changeMode = function(mode) {
                $scope.mode = mode;
                
            };
            $scope.today = function() {
                $scope.currentDate = new Date();
            };
            $scope.createRandomEvents = function() {
                //console.log("createRandomEvents")
                var events = [];
                for (var i = 0; i < $scope.schedulerlist.length; i++) {
                    var value = $scope.schedulerlist[i];
                    var fromdate = new Date(value.from_date * 1000);
                    var todate = new Date(value.to_date * 1000);
                    var schedularevents = {
                        //id: value._id,
                        title: value.scheduler_title,
                        startTime: new Date(fromdate),
                        endTime: new Date(fromdate),
                        allDay: "",
                        url: ""
                    };
                    events.push(schedularevents)
                }
                //console.log(events)
                return events;
            }
            $scope.isToday = function() {
                var today = new Date(),
                        currentCalendarDate = new Date($scope.currentDate);
                today.setHours(0, 0, 0, 0);
                currentCalendarDate.setHours(0, 0, 0, 0);
                return today.getTime() === currentCalendarDate.getTime();
            };
            $scope.loadEvents = function() {
                $scope.eventSource = $scope.createRandomEvents();
                //console.log($scope.eventSource, "here");
            };
            $scope.$on("schedulermonth", function(event, data) {
                //console.log(data.range);
                $scope.fromtime = $filter('date')(data.range.startTime, 'MM-dd-yyyy') + " " + $filter('date')(data.range.startTime, 'shortTime');
                $scope.finalfromtime = Date.parse($scope.fromtime).getTime() / 1000;
                $scope.totime = $filter('date')(data.range.endTime, 'MM-dd-yyyy') + " " + $filter('date')(data.range.endTime, 'shortTime');
                $scope.finaltotime = Date.parse($scope.totime).getTime() / 1000;

                //$state.go('common.scheduler', {starttime: $scope.finalfromtime, endtime: $scope.finaltotime})
                $scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime);

            });
            $scope.$on("calenderInit", function(event, data) {
                $timeout(function() {
                    //console.log(data.range);
                    $scope.fromtime = $filter('date')(data.range.startTime, 'MM-dd-yyyy') + " " + $filter('date')(data.range.startTime, 'shortTime');
                    $scope.finalfromtime = Date.parse($scope.fromtime).getTime() / 1000;
                    $scope.totime = $filter('date')(data.range.endTime, 'MM-dd-yyyy') + " " + $filter('date')(data.range.endTime, 'shortTime');
                    $scope.finaltotime = Date.parse($scope.totime).getTime() / 1000;
                    $scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime);
                }, 500);
            })
            $scope.addEvent = function() {
                var date = new Date();
                //console.log(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 10)))
                $scope.eventSource.push({
                    title: 'All Day - Event add fdsgfgf',
                    startTime: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 10)),
                    endTime: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 11)),
                    allDay: true
                });
                $scope.$broadcast("refreshView", {});
                //console.log($scope.eventSource)
            }
            $scope.onEventSelected = function(event) {
                $scope.event = event;
            };
            $scope.onTimeSelected = function(selectedTime) {
                console.log('Selected time: ' + selectedTime);
            };


            //console.log($scope.eventSources);
            $scope.openModalschedular = function() {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/scheduler/addschedular.html",
                    controller: 'addschedularCtrl',
                    resolve: {}
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime);
                }, function() {
                });
            };
            $scope.openModaleditschedular = function(obj,eventid) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/scheduler/editscheduler.html",
                    controller: 'editschedulerCtrl',
                    resolve: {
                        obj: function() {
                            return obj;
                        },
                        eventid: function() {
                            return eventid;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    $scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime);
                }, function() {
                });
            };
            $scope.deleteschedular = function(id, index) {
                if (confirm('Do you want to delete this Scheduler?')) {
                    var schedulerdata = {};
                    schedulerdata.post_data_string = {
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "schedule_id": id,
                        "method": "deleteSchedule"
                    }
                    dyrctservice.post(schedulerdata, function(success) {
                        //$scope.remove(index)
                        $scope.getSchedulerListData($scope.finalfromtime, $scope.finaltotime);
                        //$window.location.reload();
                    }, function(error) {
                        console.log(error);
                    });
                }
            }
            //            $scope.filterByMonth = function(month) {
            //                $scope.schedulerlistN = [];
            //                angular.forEach($scope.schedulerlist, function(item) {
            //                    if ($filter('currentmonth')(item, month)) {
            //                        $scope.schedulerlistN.push($filter('currentmonth')(item, month));
            //                    }
            //
            //                });
            //                console.log($scope.schedulerlistN);
            //                $scope.$apply($scope.schedulerlistN);
            //            }
            $scope.displayschedulerdata = function(data, month) {
                $scope.displayscheduler = $filter('currentmonth')(data, month);
                //console.log($scope.displayscheduler);
            }
        }
    ]);
    angularAMD.filter('currentmonth', function() {
        return function(data, month) {
            //            console.log(data, month, new Date(data[0].from_date * 1000).getFullYear());
            var newData = [];
            if (month && month.length > 1 && data) {
                for (var i = 0; i < data.length; i++) {
                    if (new Date(data[i].from_date * 1000).getMonthName() == month[0] && new Date(data[i].from_date * 1000).getFullYear() == month[1] && data[i].status == 'active') {
                        newData.push(data[i])
                    }
                }
            }
            return newData;
        }
    });
});