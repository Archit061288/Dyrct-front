define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('folderlockconfirmationCtrl', ['$scope', 'dyrctservice','GLOBALS','$state', '$stateParams','$uibModal','$uibModalInstance','$cookieStore','modifires','$timeout',
        function($scope, dyrctservice,GLOBALS,$state, $stateParams,$uibModal,$uibModalInstance,$cookieStore,modifires,$timeout) {
            
           $scope.MyCID = $cookieStore.get('_qu');
          
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.ok = function(){
                $uibModalInstance.close();
            }
            
        }])

});