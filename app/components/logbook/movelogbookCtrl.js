define(['angularAMD','components/groups/deletegroupCtrl'], function (angularAMD) {

    angularAMD.controller('movelogbookCtrl', ['$scope', '$rootScope','authService','$uibModal', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModalInstance','getCategorylistData','getarrayvalue','$window','getlogbookdetail','GLOBALS','check','ids',
        function ($scope,$rootScope, authService, $uibModal,dyrctservice, $cookieStore, $state, $stateParams, $uibModalInstance,getCategorylistData,getarrayvalue,$window,getlogbookdetail,GLOBALS,check,ids) {
            $scope.MyCID = $cookieStore.get('_qu');
//$scope.showlogin = true;
//console.log(check,getarrayvalue);
$scope.logbookids = ids;
$scope.currentcategoryid = getarrayvalue;
$scope.check = check;
            var data={};
            $scope.route1=true;
            $rootScope.$broadcast("route1log",$scope.route1);
            $rootScope.topsearch=true;
            $scope.getlogbookdata={};
            $scope.categoryId="";
            $scope.logbookdata = getarrayvalue;
            $scope.categorydata = getCategorylistData.data;
            //$scope.getlogbookdata = getlogbookdetail;
//            console.log($scope.getlogbookdata);
            $scope.checkedItems = function(category_id) {
                    
                    $scope.categoryId = category_id;
                    
                }
                $scope.move = function() {
                    if(check == 'category')
                    {
                        $scope.logbookdata = $scope.logbookids;
                    }
                    if($scope.categoryId.length <= 0)
                    {
                        var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'sm',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/deletegroup.html",
                    controller: 'deletegroupCtrl',
                    resolve: {
                        displaystr: function() {
                            return 'Please Select Category';
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    })
                        return false;
                    }
                    var categorydata = {};
                    
                    categorydata.post_data_string = {
                        "method": "movelogbook",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "category_id": $scope.categoryId,
                        "log_book_id": $scope.logbookdata
                    }
                    dyrctservice.post(categorydata, function(success) {
                        $uibModalInstance.close();
                        
                        //$window.location.reload();
                    }, function(error) {
                        console.log(error);
                    });
                }
                
                $scope.moverecent = function(){
                    var categorydata = {};
//                    
                    categorydata.post_data_string = {
                        "method": "movelogbook",
                        "userId": $scope.MyCID._id.$id,
                        "web_token": $scope.MyCID.web_token,
                        "category_id": '',
                        "log_book_id": $scope.logbookids
                    }
                    dyrctservice.post(categorydata, function(success) {
                        $uibModalInstance.close();
                        $state.go('common.logbook')
                        //$window.location.reload();
                    }, function(error) {
                        console.log(error);
                    });
                }
            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
//                
            };
        }]);
    

});

