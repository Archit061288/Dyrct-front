define(['angularAMD','components/groups/deletegroupCtrl'], function(angularAMD) {

    angularAMD.controller('sendgroupCtrl', ['$scope', '$filter', 'dyrctservice', 'id', 'name', '$state', '$stateParams', '$uibModalInstance', 'modifires', '$window', '$cookieStore','$timeout','GLOBALS','$uibModal',
        function($scope, $filter, dyrctservice, id, name, $state, $stateParams, $uibModalInstance, modifires, $window, $cookieStore,$timeout,GLOBALS,$uibModal) {
            $scope.loader = true;
            
            modifires.getUserContacts().then(function(data) {
                
                $scope.contactdata = angular.copy(data.data.data.allContact[0]);
                $scope.poidata = angular.copy(data.data.data.allPoi);
                $scope.loader = false;
            }, function() {
                console.log('error')
            })
            $scope.MyCID = $cookieStore.get('_qu');
            //console.log($scope.MyCID);
            $scope.today = function() {
                $scope.selectdate = new Date();
                $scope.selecttime = new Date().getTime();
                //console.log($scope.selecttime)
                $scope.currentdatetimenow = new Date();
            };
            $scope.today();
            $scope.contact = [];
            $scope.poi = [];
            $scope.clear = function() {
                $scope.selectdate = null;
            };

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ;
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.maxDate = new Date(2020, 5, 22);

            $scope.open = function($event) {
                $scope.status.opened = true;
            };

            $scope.setDate = function(year, month, day) {
                $scope.selectdate = new Date(year, month, day);
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            $scope.status = {
                opened: false
            };
            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = !$scope.ismeridian;
            };

            $scope.groupid = id;
            //console.log($scope.groupid);
            $scope.showdata = true;
            $scope.displaypoidata = function() {
                $scope.showdata = false;
            }
            $scope.displaycontactdata = function() {
                $scope.showdata = true;
            }
            
            $scope.checkedItems = function(id, type,name) {
                var obj = {"id": id, "type": type,"name":name};
                $scope.cid_poi = obj;
                //console.log($scope.cid_poi);
            }
            $scope.changed = function() {
                //console.log("Time", $filter('date')($scope.selecttime, 'shortTime'));
                //console.log("Date", $filter('date')($scope.selectdate, 'dd-MM-yyyy'));
                $scope.errortime = false;
            }
            if (!$scope.contactid) {
                $scope.contactid = "";
            }
            if (!$scope.poiid) {
                $scope.poiid = "";
            }
            $scope.errortime = false;
            $scope.sendgroup = function() {
                if (!$scope.description || $scope.description == '') {
                    $scope.contacterror = true;
                     $scope.messageerror = 'Please enter message.';
                    return false;
                }
                
                $scope.changed();
                var datefilter=$filter('date')($scope.selecttime, 'shortTime').toString().split(" ");
                $scope.filtertimeval=datefilter[0];
                if(datefilter[1]=="PM")
                {
                    var timefilter=datefilter[0].split(":");
                    if (timefilter[0] != 12)
                    {
                    timefilter[0]=parseInt(timefilter[0])+12;
                }
                    $scope.filtertimeval=timefilter[0]+":"+timefilter[1];
                }
                    
                $scope.newdate = $filter('date')($scope.selectdate, 'dd-MM-yyyy') + " " + $scope.filtertimeval;
                //console.log($scope.newdate);
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.finaldatetime=Date.parse($scope.newdate).getTime()/1000;
                
                //console.log(new Date(parseInt($scope.intdate.split("-")[2]),parseInt($scope.intdate.split("-")[1]),parseInt($scope.intdate.split("-")[0])));
                //$scope.finaldatetime = new Date(parseInt($scope.intdate.split("-")[2]),parseInt($scope.intdate.split("-")[1]),parseInt($scope.intdate.split("-")[0]),parseInt($filter('date')($scope.selecttime, 'shortTime').toString().split(" ")[0]),parseInt($filter('date')($scope.selecttime, 'shortTime').toString().split(" ")[1])).getTime() / 1000;
                //console.log($scope.finaldatetime);
                $scope.currentdate = new Date();
                $scope.currenttime = new Date().getTime();
                var currdatefilter=$filter('date')($scope.currentdate, 'shortTime').toString().split(" ");
                $scope.currfiltertimeval=currdatefilter[0];
                if(currdatefilter[1]=="PM")
                {
                    var currtimefilter=currdatefilter[0].split(":");
                    if (currtimefilter[0] != 12)
                    {
                    currtimefilter[0]=parseInt(currtimefilter[0])+12;
                }
                    $scope.currfiltertimeval=currtimefilter[0]+":"+currtimefilter[1];
                }
                    
                $scope.currnewdate = $filter('date')($scope.currentdate, 'dd-MM-yyyy') + " " + $scope.currfiltertimeval;
                //console.log($scope.currnewdate);
                //$scope.intdate=$filter('date')($scope.selectdate, 'dd-MM-yyyy') ;
                $scope.currfinaldatetime=Date.parse($scope.currnewdate).getTime()/1000;
                //console.log($scope.finaldatetime,$scope.currfinaldatetime)
                //return false;
                var sendgroup = {};
                if($scope.finaldatetime < $scope.currfinaldatetime)
                {
//                    var modalInstance = $uibModal.open({
//                    animation: true,
//                    size: 'sm',
//                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
//                    controller: 'deletegroupCtrl',
//                    resolve: {
//                        displaystr: function() {
//                            return 'Please select the proper time.';
//                        }
//                    }
//                });
//                modalInstance.result.then(function(selectedItem) {
//                    })
                    $scope.errortime = true;
                    $scope.errortimemessage = 'Please select the proper time.';
                    return false;
                }
                if(!$scope.contactsendgroup){
                    if ($scope.description || $scope.description != '') {
                        $scope.contacterror = false;
                    }
                    if($scope.finaldatetime >= $scope.currfinaldatetime)
                {
                    $scope.errortime = false;
                }
//                    $scope.activeclass = true;
                       $('.transptant-overlay').fadeIn(3000);
                       $('#boxscroll3').css('overflow-y','hidden');
//                    alert("Please Select CID/POI")
                $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                         $('#boxscroll3').css('overflow-y','auto');
//                    $('.modal-body').removeClass('transptant-overlay').fadeOut(3000);
                },2000)
                    return false;
                }
                
                sendgroup.post_data_string = {
                    "method": "shareGroupContactPoi",
                    "message_date_time": $scope.finaldatetime,
                    "type": $scope.cid_poi.type,
                    "group_id": $scope.groupid,
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "type_id": $scope.cid_poi.id,
                    "message_title": $scope.description

                }

                dyrctservice.post(sendgroup, function(success) {
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