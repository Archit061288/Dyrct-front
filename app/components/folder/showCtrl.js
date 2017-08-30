define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('showCtrl', ['$scope', '$rootScope', '$location', '$uibModalInstance','$cookieStore','getcontactdetail',
        function($scope, $rootScope, $location,$uibModalInstance,$cookieStore,getcontactdetail) {
            //console.log(getcontactdetail[0]);
            $scope.userdetail = getcontactdetail[0];
            //console.log($scope.userdetail);

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
});
