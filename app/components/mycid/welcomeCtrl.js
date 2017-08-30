define(['angularAMD'], function (angularAMD) {

    angularAMD.controller('welcomeCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModal', '$window', '$rootScope','GLOBALS','$uibModalInstance', function ($scope, authService, dyrctservice, $cookieStore, $state, $stateParams, $uibModal, $window, $rootScope,GLOBALS,$uibModalInstance) {
            $rootScope.welcome=false;
                $scope.cancel=function(){
                    $uibModalInstance.close();
                }
        }]);

});

