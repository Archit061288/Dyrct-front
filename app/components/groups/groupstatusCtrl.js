define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('groupstatusCtrl', ['$scope','$stateParams','$rootScope','$uibModal', '$location', 'dyrctservice',  'GLOBALS','$window','$cookieStore','modifires','modifires',
        function($scope,$stateParams,$rootScope ,$uibModal, $location, dyrctservice, GLOBALS, $window,$cookieStore,modifires) {
             
            $('body').click(function() {
                $('body').find('div.modal-backdrop').remove();

            });
            $('body').find('div.fade').remove();   
            $rootScope.$on("userSearch", function(event, data) {
                $scope.q = {};
                $scope.q.group_data.title = data;
            })
            
            modifires.getgroupstatus($stateParams.groupid, $stateParams.messageid).then(function(data) {
                        $scope.groupstatus = data.result;
                        //console.log("success",$scope.groupstatus)
                    }, function() {
                        console.log('error')
                    })
            $rootScope.topsearch=true;
//            $scope.groupstatus = getGroupStatusData.data;
//            console.log($scope.groupstatus);
//            $scope.grouphistory = getGroupHistoryData.data.result.result_data;
//            $scope.grouplist = getGroupData.data.result;
            $scope.MyCID = $cookieStore.get('_qu');
            
            $rootScope.$on("userSearch", function(event, data) {
                $scope.q = data;
            })
            
            $scope.back = function(){
                $window.history.back();
            }
            
            
        }])
    

});