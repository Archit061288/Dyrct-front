define(['angularAMD','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('exportlogbookCtrl', ['$scope', '$rootScope','authService','$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModalInstance','$window','getlogbookdetail','getCategorylistData','GLOBALS','check','$timeout',
        function ($scope,$rootScope, authService, $uibModal,dyrctservice, $cookieStore, $state, $stateParams, $uibModalInstance,$window,getlogbookdetail,getCategorylistData,GLOBALS,check,$timeout) {
            $scope.MyCID = $cookieStore.get('_qu');
            
            $scope.logbookdata = getlogbookdetail.data;   
            $scope.category = []; // pop-up checked category
            $scope.exportLogBookData = [];
            $scope.exportLogBookDataPreview = [];
            $scope.exportCategoryPreview = [];
            $scope.getcategorylist = getCategorylistData;
            
            $scope.showCategory = (check == 'categories') ? true : false;
            $scope.animationsEnabled = true;
            
            var today = new Date();
//            $scope.tempCategory={
//                logbooklist:[]
//            }
            $scope.todayDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' +  today.getFullYear();
            
            if(check == 'home')
            {
                angular.forEach($scope.logbookdata, function (trip,index) {                    
                    if(trip.category_id == 0 && trip.trip_status=='end')
                    {
                        
                        $scope.logbookdata[index]['category_name'] = 'home';
                        $scope.exportLogBookData.push(trip);
                        
                        var datesd = new Date(trip.start_date_time* 1000);
                        $scope.tsd=(datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                        if(new Date($scope.tsd).getTime() == new Date($scope.todayDate).getTime())
                        {
                            //console.log("here")
                            $scope.exportLogBookDataPreview.push(trip);
                        }
                        $scope.exportLogBookDataPreview.push(trip);
                       // console.log($scope.exportLogBookDataPreview)
                    }
                });
            }
            
            if(check == 'categories')
            {
                angular.forEach($scope.getcategorylist, function (item1, i) {
                    
                    $scope.getcategorylist[i]['logbooklist'] = [];
                    $scope.getcategorylist[i]['is_open'] = false;
                    $scope.categoryLogbookPreview = [];     
                    
                    angular.forEach($scope.logbookdata, function (trip, j) {
                        if (item1._id == trip.category_id) {
                            //$scope.category.push({cat: item1._id,data:item2});
                            $scope.getcategorylist[i].logbooklist.push(trip);
                            
                            var datesd = new Date(trip.start_date_time* 1000);
                            $scope.tsd=(datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                            if(new Date($scope.tsd).getTime() == new Date($scope.todayDate).getTime())
                            {
                                $scope.categoryLogbookPreview.push(trip);
                            } 
                            $scope.categoryLogbookPreview.push(trip);
                            
                        }                        
                    });
                    
                    if($scope.categoryLogbookPreview.length > 0)
                    {
                        //console.log($scope.categoryLogbookPreview)
                        //$scope.tempCategory.logbooklist = $scope.categoryLogbookPreview;
                        $scope.tempCategory = item1;
                        
                       // console.log($scope.tempCategory)
                        angular.forEach($scope.tempCategory.logbooklist,function(item2,ind){
                            if(item2.trip_status=="end")
                            {
                            $scope.tempCategory.logbooklist[ind] = item2;
                            }
                        })
                       
                        $scope.exportCategoryPreview.push($scope.tempCategory);
                        //console.log($scope.exportCategoryPreview)
                    }                    
                });
            }            
            
            
            $scope.checkedItems = function () {
                $scope.category = [];
                angular.forEach($scope.exportCategoryPreview, function (user) {
                    if (user.checked) {
                        $scope.category.push(user);
                    }
                }); 
                
            };
            
            $scope.checkBoxToggle = function (category) {
                return (category.is_open) ? category.is_open = false : category.is_open = true;                
            }
//            $scope.categorydata={
//                    checked:false
//                }
            $scope.previewCategory = function(checkstatus){
                
                //console.log($scope.categorydata.checked)
                if(checkstatus=="nb")
                {
                    $scope.exportCategoryPreview = [];
                    //$scope.exportLogBookDataPreview = [];
                }
                else
                {
                    $scope.exportCategoryPreview = [];
                    console.log("here")
                }
                //$scope.exportCategoryPreview = [];
                $scope.expstartdate = false;
                $scope.expenddate = false;
                
                if (!$scope.startdate || $scope.startdate == "") {
                    $scope.expstartdate = true;
                    $scope.messageerror = "Please select start-date."
                    return false;
                }
                
                if (!$scope.enddate || $scope.enddate == "") {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select end-date."
                    return false;
                }
                
                if($scope.startdate.getTime() > $scope.enddate.getTime())
                {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select valid end-date."                 
                    return false;
                }
                
                var startd = new Date($scope.startdate);
                startd = (startd.getMonth() + 1) + '/' + startd.getDate() + '/' +  startd.getFullYear();
                
                var endd = new Date($scope.enddate);
                endd = (endd.getMonth() + 1) + '/' + endd.getDate() + '/' +  endd.getFullYear();
                
                angular.forEach($scope.getcategorylist, function (item1, i) {
                    $scope.getcategorylist[i]['logbooklist'] = [];
                    $scope.getcategorylist[i]['is_open'] = false;
                    $scope.categoryLogbookPreview = [];
                    
                    angular.forEach($scope.logbookdata, function (trip, j) {
                        if (item1._id == trip.category_id) {
                            
                            var datesd = new Date(trip.start_date_time* 1000);
                            $scope.tsd=(datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                            if(checkstatus=="nb")
                            {
                               $scope.categoryLogbookPreview.push(trip);
                               //console.log($scope.categoryLogbookPreview)
                            }
                            else
                            {
                            if(new Date($scope.tsd).getTime() >= new Date(startd).getTime() && new Date($scope.tsd).getTime() <= new Date(endd).getTime())
                            {
                                $scope.categoryLogbookPreview.push(trip);
                            }
                            }
                        }
                    });
                    //console.log($scope.categoryLogbookPreview)
                    if($scope.categoryLogbookPreview.length > 0)
                    {
                        $scope.tempCategory = item1;
                        $scope.tempCategory.logbooklist=$scope.categoryLogbookPreview
                        
                        angular.forEach($scope.tempCategory.logbooklist,function(item2,ind){
                            if(item2.trip_status=="end")
                            {
                            $scope.tempCategory.logbooklist[ind] = item2;
                            }
                        })
                        
                        $scope.exportCategoryPreview.push($scope.tempCategory);
                    }
                });
            }
            
            $scope.previewTrip = function(checkstatus){
                //
                if(checkstatus=="nb")
                {
                    //$scope.exportLogBookDataPreview = [];
                }
                else
                {
                    $scope.exportLogBookDataPreview = [];
                }
                $scope.expstartdate = false;
                $scope.expenddate = false;
                
                if (!$scope.startdate || $scope.startdate == "") {
                    $scope.expstartdate = true;
                    $scope.messageerror = "Please select start-date."
                    return false;
                }
                
                if (!$scope.enddate || $scope.enddate == "") {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select end-date."
                    return false;
                }
                
                if($scope.startdate.getTime() > $scope.enddate.getTime())
                {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select valid end-date."                 
                    return false;
                }
                
                var startd = new Date($scope.startdate);
                startd = (startd.getMonth() + 1) + '/' + startd.getDate() + '/' +  startd.getFullYear();

                var endd = new Date($scope.enddate);
                endd = (endd.getMonth() + 1) + '/' + endd.getDate() + '/' +  endd.getFullYear();
                
                angular.forEach($scope.logbookdata, function (trip,index) {
                    //$scope.exportLogBookDataPreview = [];
                    if(trip.category_id == 0 && trip.trip_status=='end')
                    {
                        
                        var datesd = new Date(trip.start_date_time* 1000);
                        $scope.tsd= (datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                        
                        //console.log(new Date($scope.tsd).getTime()+"---"+new Date(startd).getTime()+"---"+new Date(endd).getTime());
                        //console.log("--");
                        
                        if(new Date($scope.tsd).getTime() >= new Date(startd).getTime() && new Date($scope.tsd).getTime() <= new Date(endd).getTime())
                        {
                            
                            $scope.exportLogBookDataPreview.push(trip);
                        }                        
                    }
                });
                                
            }
            
            
            //Date Function
            $scope.$watch('startdate', function (newVal,oldval) {
                console.log($scope.statuscheck)
                if($scope.statuscheck)
                {
                    console.log("if")
                    $scope.previewTrip("");
                    $scope.previewCategory("");
                }else
                {
                    console.log("else")
                    $scope.previewTrip("nb");
                    $scope.previewCategory("nb");
                }
                
            });
            $scope.$watch('enddate', function (newVal,oldval) {
                console.log($scope.statuscheck)
                if($scope.statuscheck)
                {
                    $scope.previewCategory("");
                    $scope.previewTrip("");
                }else
                {
                    $scope.previewCategory("nb");
                    $scope.previewTrip("nb");
                }
                
            
            });
            
            $scope.selectAll = function () {
                $scope.category = [];
                angular.forEach($scope.exportCategoryPreview, function (user) {                    
                    $scope.category.push(user);
                    user.checked = true;                        
                });
            };
                
            $scope.deselectAll = function () {
                $scope.category = [];
                angular.forEach($scope.exportCategoryPreview, function (user) {
                    if (user.checked) {
                        user.checked = false;                        
                    }
                });
            };
             angular.forEach($scope.exportCategoryPreview,function(user,ind){
                if (user.checked) {
                    console.log(user)
                        user.checked=false;
                    }
            })
            //console.log($scope.exportCategoryPreview)
            //Export CSV By Date
            $scope.export = function () {
               
                $scope.exportLogBookData=[];
               
                if(check == 'categories')
                {
                    angular.forEach($scope.logbookdata, function (trip,index) {
                        angular.forEach($scope.category, function (cat) {                            
                            if(trip.category_id == cat._id && trip.trip_status=='end')
                            {
                                $scope.logbookdata[index]['category_name'] = cat.category_name;
                                $scope.exportLogBookData.push(trip);
                            }
                        });                        
                    });
                    //console.log($scope.exportLogBookData);
                }
                if(check == 'home')
                {
                    angular.forEach($scope.logbookdata, function (trip,index) {                    
                    if(trip.category_id == 0 && trip.trip_status=='end')
                    {
                        
                        $scope.exportLogBookData.push(trip);
                        
                    }
                });
                }
                
                if(!$scope.statuscheck)
                {
                     
                $scope.tripdetailcsv = [];
                
                angular.forEach($scope.exportLogBookData, function (trip) {
                    
                    $scope.tripdetail = trip;
                    
                    var date1 = $scope.tripdetail.start_date_time;
                    var date2 = $scope.tripdetail.end_date_time; 
                    
                    date_future = new Date(date2 * 1000);
                    date_now = new Date(date1 * 1000);
                    seconds = Math.floor((date_future - (date_now)) / 1000);
                    minutes = Math.floor(seconds / 60);
                    hours = Math.floor(minutes / 60);
                    days = Math.floor(hours / 24);
                    hours = hours - (days * 24);
                    minutes = minutes - (days * 24 * 60) - (hours * 60);
                    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                    var hms = hours + ":" + minutes + ":" + seconds;
                    //var json = $.parseJSON($scope.tripdetailcsv);
                    var datesd = new Date($scope.tripdetail.start_date_time* 1000);
                    $scope.tsd=(datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                    $scope.tst=datesd.getHours() + ":" + datesd.getMinutes() + ":" + datesd.getSeconds();
                    
                    var dateed = new Date($scope.tripdetail.end_date_time* 1000);
                    $scope.ted=(dateed.getMonth() + 1) + '/' + dateed.getDate() + '/' +  dateed.getFullYear();
                    $scope.tet=dateed.getHours() + ":" + dateed.getMinutes() + ":" + dateed.getSeconds();                    
                    
                     
                        $scope.tripdetailcsv.push({
                            'Trip Start Date': $scope.tsd,
                            'Trip End Date': $scope.ted,
                            'Trip Start Time': $scope.tst,
                            'Trip End Time': $scope.tet,
                            'Distance': parseFloat($scope.tripdetail.kilometer / 1000).toFixed(2),
                            'Duration': hms,
                            'Departure': $scope.tripdetail.start_address,
                            'Destination': $scope.tripdetail.end_address,
                            'Category': $scope.tripdetail.category_name
                        });
                        
                    
                    
                });
                
                if($scope.tripdetailcsv.length > 0)
                {
                    var csv = JSONToCSVConvertor($scope.tripdetailcsv, "My LogBook Report", true);
                    $scope.exportCategoryPreview = [];                    
                    $uibModalInstance.close();
                }else{
                    $('.transptant-overlay').fadeIn(3000);
                    $('#boxscroll3').css('overflow-y','hidden');

                    $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                        $('#boxscroll3').css('overflow-y','auto');
                    },2000)
                    return false;
                }
            
                }
                else
                {
                $scope.expstartdate = false;
                $scope.expenddate = false;
                
                if (!$scope.startdate || $scope.startdate == "") {
                    
                    $scope.expstartdate = true;
                    $scope.messageerror = "Please select start-date."
                    return false;
                }
                
                if (!$scope.enddate || $scope.enddate == "") {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select end-date."
                    return false;
                }
                
                if($scope.startdate.getTime() > $scope.enddate.getTime())
                {
                    $scope.expenddate = true;
                    $scope.messageerror = "Please select valid end-date."                 
                    return false;
                }
                
                var startd = new Date($scope.startdate);
                startd = (startd.getMonth() + 1) + '/' + startd.getDate() + '/' +  startd.getFullYear();

                var endd = new Date($scope.enddate);
                endd = (endd.getMonth() + 1) + '/' + endd.getDate() + '/' +  endd.getFullYear();
                
                $scope.tripdetailcsv = [];
                
                angular.forEach($scope.exportLogBookData, function (trip) {
                    
                    $scope.tripdetail = trip;
                    
                    var date1 = $scope.tripdetail.start_date_time;
                    var date2 = $scope.tripdetail.end_date_time; 
                    
                    date_future = new Date(date2 * 1000);
                    date_now = new Date(date1 * 1000);
                    seconds = Math.floor((date_future - (date_now)) / 1000);
                    minutes = Math.floor(seconds / 60);
                    hours = Math.floor(minutes / 60);
                    days = Math.floor(hours / 24);
                    hours = hours - (days * 24);
                    minutes = minutes - (days * 24 * 60) - (hours * 60);
                    seconds = seconds - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);
                    var hms = hours + ":" + minutes + ":" + seconds;
                    //var json = $.parseJSON($scope.tripdetailcsv);
                    var datesd = new Date($scope.tripdetail.start_date_time* 1000);
                    $scope.tsd=(datesd.getMonth() + 1) + '/' + datesd.getDate() + '/' +  datesd.getFullYear();
                    $scope.tst=datesd.getHours() + ":" + datesd.getMinutes() + ":" + datesd.getSeconds();
                    
                    var dateed = new Date($scope.tripdetail.end_date_time* 1000);
                    $scope.ted=(dateed.getMonth() + 1) + '/' + dateed.getDate() + '/' +  dateed.getFullYear();
                    $scope.tet=dateed.getHours() + ":" + dateed.getMinutes() + ":" + dateed.getSeconds();                    
                    
                    if(new Date($scope.tsd).getTime() >= new Date(startd).getTime() && new Date($scope.tsd).getTime() <= new Date(endd).getTime())
                    {
                        
                        $scope.tripdetailcsv.push({
                            'Trip Start Date': $scope.tsd,
                            'Trip End Date': $scope.ted,
                            'Trip Start Time': $scope.tst,
                            'Trip End Time': $scope.tet,
                            'Distance': parseFloat($scope.tripdetail.kilometer / 1000).toFixed(2),
                            'Duration': hms,
                            'Departure': $scope.tripdetail.start_address,
                            'Destination': $scope.tripdetail.end_address,
                            'Category': $scope.tripdetail.category_name
                        });
                        
                    }
                    
                });
                
                if($scope.tripdetailcsv.length > 0)
                {
                    var csv = JSONToCSVConvertor($scope.tripdetailcsv, "My LogBook Report", true);
                    $scope.exportCategoryPreview = [];                    
                    $uibModalInstance.close();
                }else{
                    $('.transptant-overlay').fadeIn(3000);
                    $('#boxscroll3').css('overflow-y','hidden');

                    $timeout(function(){
                        $('.transptant-overlay').fadeOut(3000);
                        $('#boxscroll3').css('overflow-y','auto');
                    },2000)
                    return false;
                }
            }
                
            };            
            
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');                
            };
           
            $scope.previewcheck={
               'checked':false
            }
            $scope.previewtripclick=function(){
                if($scope.previewcheck.checked)
                {
                 $scope.showtext=true;   
                }
                else
                {
                    $scope.showtext=false;   
                }
               // console.log()
            }
            
            
            //Date Function
            $scope.startdate = new Date();
            $scope.enddate = new Date();
            
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
            $scope.maxDate = new Date();
            $scope.statuscheck=false;
            $scope.open = function($event) {
                $scope.status.opened = true;
                $scope.statuscheck=true;
            };
            
            $scope.open1 = function($event) {
                $scope.status1.opened = true;
                $scope.statuscheck=true;
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
            $scope.status1 = {
                opened: false
            };
            
           
            
        }]);
    

});

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';
    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {

            //Now convert each value to string and comma-seprated
            row += index + ',';
        }

        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;
    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";
    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
