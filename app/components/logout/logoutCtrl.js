define(['angularAMD'], function(angularAMD) {

    angularAMD.controller("logoutCtrl", ["$scope","$cookieStore", "$location", "$timeout", function($scope,$cookieStore, $location, $timeout) {
        $cookieStore.remove("_qu");
        $timeout(function() {
            $location.path('/');
        });
    }]);
    angularAMD.processQueue();
    });