define(['angularAMD', 'ng-map', 'html2canvas','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('log-book-tripdetailCtrl', ['$rootScope', '$scope', 'authService', '$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', 'GLOBALS', '$window', 'fileUpload', 'getlogbookdetailData',
        function ($rootScope, $scope, authService, $uibModal, dyrctservice, $cookieStore, $state, $stateParams, GLOBALS, $window, fileUpload, getlogbookdetailData) {
            //console.log(getlogbookdetailData.data);
            $scope.startlatlong = [];
            $scope.tripdetaildata = getlogbookdetailData.data;
            //console.log($scope.tripdetaildata)
            if($scope.tripdetaildata.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            $scope.tripdetail = getlogbookdetailData.data[0];
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $scope.route1 = true;
            $rootScope.$broadcast("route1log", $scope.route1);
            //console.log($scope.tripdetail);
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.userid = $scope.MyCID._id.$id;
            //console.log($scope.tripdetail.start_latlong);
            ga("send", "event", {eventCategory: "Logbook Export CSV", eventAction: "Logbook Export CSV", eventLabel: "Logbook Export CSV", userId: $scope.userid});
            $scope.travelMode = 'DRIVING';
            $scope.origin = $scope.tripdetail.start_address;
            $scope.destination = $scope.tripdetail.end_address;
            $scope.distancekilo = parseFloat($scope.tripdetail.kilometer / 1000).toFixed(2);
            $scope.expdistancekilo = parseFloat($scope.tripdetail.expected_distance / 1000).toFixed(2);
            //$scope.distancekilo=parseFloat($scope.tripdetail.kilometer).toFixed(2);

//            $scope.exportpng= function()
//            {
//            console.log("heree"); 
//            html2canvas($(".trip-detail"), {
//            onrendered: function(canvas) {
//                //theCanvas = canvas;
//                        var ctx = canvas;
//                        ctx.width = 200;
//                        ctx.height = 100;
//                        var ctx1 = ctx.getContext("2d");
//                        var tan30 = Math.tan(0.1);
//                        ctx1.setTransform(1, tan30, 0, 1, 0, 0);
//                        ctx1.lineWidth = 10;
//                        ctx1.beginPath();
//                        ctx1.moveTo(0, 0);
//                        ctx1.lineTo(200, 0);
//                        ctx1.stroke();
//                        var asd = convertCanvasToImage(canvas)
//                        console.log(asd)
//
//                        function convertCanvasToImage(aaa) {
//                            var image = new Image();
//                            image.src = aaa.toDataURL("image/png");
//                            return image;
//                        }
//                
//                
////                var img = ReImg.fromCanvas(document.querySelector('.trip-detail')).toPng();
////                var output = document.querySelector('.output');
////                output.innerHTML = '';
////                output.appendChild(img);
//                 
//                
//            }
//        });
//
//               
//            }
            $scope.downloadPNG = function () {
                
                var element = $("#show_button");

                html2canvas(element, {
                    useCORS: true,
                    onrendered: function (canvas) {
                        var dataUrl = canvas.toDataURL("image/jpeg");
                        var d = new Date();
                        var imagecanvas = dataUrl.replace(dataUrl,'logbook - '+d.toString()+'.jpeg')
                        
                    var save = document.createElement('a');
                    save.href = dataUrl;
                    save.target = '_blank';
                    save.download = imagecanvas || 'unknown';

                     if(window.webkitURL)
                    {
                        var event = document.createEvent('Event');
                    event.initEvent('click', true, true);
                    save.dispatchEvent(event);
                    (window.URL || window.webkitURL).revokeObjectURL(save.href);
                    }
                    else
                    {
                        var event = document.createEvent("MouseEvents");
                        event.initMouseEvent(
                                "click", true, false, window, 0, 0, 0, 0, 0
                                , false, false, false, false, 0, null
                                );
                        save.dispatchEvent(event);
                    }
                        // DO SOMETHING WITH THE DATAURL
                        // Eg. write it to the page
                        //document.write('<img src="' + dataUrl + '"/>');
                    }
                });
//                html2canvas($('#show_button'), {
//                    onrendered: function (canvas) {
//                        var img = canvas.toDataURL("image/jpeg")
//                        var imagecanvas = img.replace(img,'logbook.jpeg')
////                        window.open(img);
//                    
//                    
//                    var save = document.createElement('a');
//                    save.href = img;
//                    save.target = '_blank';
//                    save.download = imagecanvas || 'unknown';
//
//                    var event = document.createEvent('Event');
//                    event.initEvent('click', true, true);
//                    save.dispatchEvent(event);
//                    (window.URL || window.webkitURL).revokeObjectURL(save.href);
//                }
//                });

//            $scope.imagecanvas = img;
//                html2canvas($('#show_button'), {
//                    onrendered: function (canvas) {
//                        document.body.appendChild(canvas);
//                        Canvas2Image.saveAsPNG(canvas);
//                        $("#img-out").append(canvas);
//                    }
//
//                });

            }
            $scope.tripdiff = function (date1, date2)
            {

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
                return hms;
            }
            var startlatlong = $scope.tripdetail.start_latlong.split(",");
            var endlatlong = $scope.tripdetail.end_latlong.split(",");
            $scope.wayPoints = [];
//            $scope.wayPoints = [
//                {location: {lat: parseFloat(startlatlong[0]), lng: parseFloat(startlatlong[1])}, stopover: true},
//                {location: {lat: parseFloat(endlatlong[0]), lng: parseFloat(endlatlong[1])}, stopover: true},
//            ];
            $scope.deletelogbooktripdetail = function (id,name) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Are you sure want to delete <span class="delete-title">'+name+' </span> group ?';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    var tripdetail = {};
                    tripdetail.post_data_string = {
                        "method": "deletelogbook",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "logbookid": id
                    }
                    dyrctservice.post(tripdetail, function (success) {
                        $state.go('common.logbook');
                    }, function (error) {
                        console.log(error);
                    });
                    
                }, function() {
                    console.log("cancel")

                });  
//                if (confirm('Do you want to delete this Trip Detail ?')) {
//                    var tripdetail = {};
//                    tripdetail.post_data_string = {
//                        "method": "deletelogbook",
//                        "userId": $scope.MyCID._id.$id,
//                        "web_token": $scope.MyCID.web_token,
//                        "logbookid": id
//                    }
//                    dyrctservice.post(tripdetail, function (success) {
//                        $state.go('common.logbook');
//                    }, function (error) {
//                        console.log(error);
//                    });
//                }
            }

            $scope.exportcsv = function (date1, date2)
            {
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
                $scope.tripdetailcsv = [{
                        'Trip Start Date': $scope.tsd,
                        'Trip End Date': $scope.ted,
                        'Trip Start Time': $scope.tst,
                        'Trip End Time': $scope.tet,
                        'Distance': parseFloat($scope.tripdetail.kilometer / 1000).toFixed(2),
                        'Duration': hms,
                        'Departure': $scope.tripdetail.start_address,
                        'Destination': $scope.tripdetail.end_address,

                    }];
                var csv = JSONToCSVConvertor($scope.tripdetailcsv, "My LogBook Report", true);
            }

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

