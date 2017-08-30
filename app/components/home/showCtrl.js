define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('showCtrl', ['$scope', '$rootScope', 'id', 'check', 'dyrctservice', '$location', '$uibModalInstance', '$window', '$cookieStore','$timeout',
        function($scope, $rootScope, id, check, dyrctservice, $location, $uibModalInstance, $window, $cookieStore,$timeout) {
            $scope.check = check;
            $scope.usercontact = {};
            $scope.usercontact.note = '';
            $scope.route1=true;
            $rootScope.$broadcast("route1home",$scope.route1);
            $scope.MyCID = $cookieStore.get('_qu');
            //$scope.notes = "";
            if ($scope.check == 'contact') {
                $scope.usercontact = id;
                $scope.checkval = true
                //console.log(check);
            }
            else if ($scope.check == 'poi') {
                $scope.userpoi = id;
                //console.log(check);
            }
            else if ($scope.check == 'trip') {
                $scope.trip = id;
            }
//            else if($scope.check == 'user'){
//                $scope.groupuser = id;
//                
//            }
            $scope.focus = function() {
                $scope.showstatus = true;
            }
            $scope.blur = function() {
                
                $timeout(function() {
                    $scope.showstatus = false;
                }, 5000);
            }
            $scope.addnote = function(id, check) {
                //$scope.note = $scope.notes;
               if(check == 'contact'){
                  var groupdata = {};
                groupdata.post_data_string = {
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "type_id": id,
                    "type": check.toString(),
                    "method": "addNoteByUserId",
                    "note": $scope.usercontact.note
                }
                dyrctservice.post(groupdata, function(success) {
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });  
               }
               else if(check == 'poi'){
                    var groupdata = {};
                groupdata.post_data_string = {
                    "userId": $scope.MyCID._id.$id,
                    "web_token": $scope.MyCID.web_token,
                    "type_id": id,
                    "type": check.toString(),
                    "method": "addNoteByUserId",
                    "note": $scope.userpoi.note
                }
                dyrctservice.post(groupdata, function(success) {
                    $uibModalInstance.close();
                }, function(error) {
                    console.log(error);
                });
               }
               
            }
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }]);
});
