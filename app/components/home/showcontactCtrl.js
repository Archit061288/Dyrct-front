define(['angularAMD'], function(angularAMD) {

    angularAMD.controller('showcontactCtrl', ['$scope', '$rootScope', 'contact', '$location', '$uibModalInstance','$cookieStore',
        function($scope, $rootScope, contact, $location,$uibModalInstance,$cookieStore) {
            
            $scope.usercontact = contact;
            $scope.route1=true;
            $rootScope.$broadcast("route1home",$scope.route1);
            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }]);
});
