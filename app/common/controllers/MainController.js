
define(['angularAMD'], function(angularAMD) {
//    angularAMD = angular.module('MainController', ['ngCookies', 'commonServices']);

    angularAMD.controller('MainController', ['$scope', '$rootScope', '$cookies', '$cookieStore', '$state', 'authService', 'resourceService',function($scope, $rootScope, $cookies, $cookieStore, $state, authService, resourceService) {
            //$scope.trafficCop = trafficCop;
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
//                console.log('$stateChangeError - fired when an error occurs during transition.');
                var flag = $cookieStore.get('_qu');
                if(flag){
                    if(flag.allData && flag.allData[0].status == 'inactive')
                    {
                        $rootScope.userinactive=true;
                        if(toState.name != 'common.usercid'){
                        $state.go('common.usercid',{id:flag.userId})
                        }
                            //console.log("in",toState.name);
                    }
                    else if(flag && flag.status == 'inactive')
                    {
                        $rootScope.userinactive=false;
                        if(toState.name != 'common.usercid'){
                        $state.go('common.usercid',{id:flag._id.$id})
                        }
                            //console.log("in",toState.name);
                    }
                }
                //console.log(arguments,flag);
                
            });
            $scope.getCountry = resourceService.GetAllCountry();
            $scope.getCountry.then(
                    function(success) {
                        $scope.dataObj = success.data;
                        //console.log($scope.dataObj.data);

                    });
            $scope.signout = function() {
                authService.clearAuthentication();
                $state.go('login')
            };
            
        }]);

});