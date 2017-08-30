define(['angularAMD'], function (angularAMD) {

    angularAMD.controller("notificationhistoryCtrl", ["$scope", "$location", "$cookieStore", "$timeout", "$rootScope", 'dyrctservice', '$filter', 'modifires','$state', function ($scope, $location, $cookieStore, $timeout, $rootScope, dyrctservice, $filter, modifires,$state) {
            $scope.mycid = $cookieStore.get('_qu');
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $rootScope.topsearch = false;
            $scope.currentPage = 1;
            $scope.items_per_page = 20;
            $scope.notificationhistorylist = [];
            $scope.notificationhistorylistfun = function (page) {
                var currentPage = page != null?page:$scope.currentPage;
                
                var notificationhistorylist = {};
//                if (type == 'add') {
                notificationhistorylist.post_data_string = {
                    "method": "getNotificationList",
                    "userId": $scope.mycid._id.$id,
                    "web_token": $scope.mycid.web_token,
                    "timestamp": "",
                    "type": "all",
                    "page": currentPage,
                    "limit": 20
                }
                dyrctservice.post(notificationhistorylist, function (success) {
                    //console.log(success);   
                    
                    if(!page)
                    {
                        
                        $scope.currentPage++;
                    }
                    else
                    {
                        $scope.notificationhistorylist = [];
                    }
                    
                    angular.forEach(success.data.data, function (value, key) {
                        $scope.notificationhistorylist.push(value);
                       
                    })
//                    $scope.totalItems = success.data.total_count;
//                    if(!page)
//                    {
//                        $scope.currentPage++;
//                    }
                    
                    //console.log($scope.notificationhistorylist)
                    if (success.data.isInvalidUser == "true")
                    {
                        $state.go('main.root');
                    }
                    //console.log(success);
                }, function (error) {
                    console.log(error);
                });
            }
            $scope.notificationhistorylistfun();
//            $scope.pageChanged = function (id) {
//                console.log(id, $scope.currentPage)
//                $scope.notificationhistorylistfun();
//            }
            $scope.updatenotification = function (id, status) {
                var currentPage = $scope.currentPage > 1?($scope.currentPage - 1):1;
                var notification = {};
                notification.post_data_string = {
                    "method": "updateNotification",
                    "userId": $scope.mycid._id.$id,
                    "web_token": $scope.mycid.web_token,
                    "notification_id": id,
                    "notification_status": status
                }
                dyrctservice.post(notification, function (success) {
                   $scope.notificationhistorylistfun(currentPage);
                    //$scope.$apply();
                    //console.log(success);
                }, function (error) {
                    console.log(error);
                });
            }
        }]);
});
