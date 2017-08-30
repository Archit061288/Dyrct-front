define(['angularAMD','components/groups/addappointmentCtrl'], function(angularAMD) {

    angularAMD.controller('grouphistoryCtrl', ['$scope', '$rootScope','$uibModal', '$location', 'dyrctservice', 'GLOBALS', 'getGroupData','$window','getGroupUserListData','getOneGrouplistData','$cookieStore','getGroupHistoryData','modifires','$state',
        function($scope,$rootScope ,$uibModal, $location, dyrctservice, GLOBALS, getGroupData,$window,getGroupUserListData,getOneGrouplistData,$cookieStore,getGroupHistoryData,modifires,$state) {
            
            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();
            $rootScope.$on("userSearch", function(event, data) {
                $scope.q = {};
                if($scope.q.group_data){
                    $scope.q.group_data.title = data;
                }
            })
            
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();
            $scope.route1=true;
            $rootScope.$broadcast("route1group",$scope.route1);
            
            $rootScope.topsearch=true;
            $scope.onegrouplist = getOneGrouplistData.data;
            $scope.grouphistorylistData = getGroupHistoryData.data;
            if($scope.grouphistorylistData.isInvalidUser=="true")
            {
                $state.go('main.root');
            }
            $scope.grouphistorylist = getGroupHistoryData.data.result?getGroupHistoryData.data.result.result_data:'';
            
            //console.log($scope.grouphistorylist);
            $scope.grouplist = getGroupData.data.result;
            $scope.MyCID = $cookieStore.get('_qu');
            $scope.openModaladdappointment = function(obj) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/addappointment.html",
                    controller: 'addappointmentCtrl',
                    resolve: {
                        obj: function() {
                            return obj;
                        }
                    }
                });
                modalInstance.result.then(function(selectedItem) {
                    modifires.getGroup().then(function(data) {
                        $scope.grouplist = data.data.result;
                        //console.log("success")
                    }, function() {
                        console.log('error')
                    })
                }, function() {

                });
            }
            
            $rootScope.$on("userSearch", function(event, data) {
                $scope.q = data;
            })
            
            $scope.back = function(){
                $window.history.back();
            }
            
        }])

});