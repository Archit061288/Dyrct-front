define(['angularAMD'], function (angularAMD) {

    angularAMD.controller('loginCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', function ($scope, authService, dyrctservice, $cookieStore, $state, $stateParams) {
            $scope.login = function () {
                //console.log($scope.username,$scope.pass);
                var data= {};
                data.post_data_string={"method":"webLogin","phone":$scope.username,"user_pin":$scope.pass}
                dyrctservice.get(data,function(success){
                	//console.log(success);
                	$cookieStore.put('_qu', success.data);
                	$state.go('main.home');
                },function(error){
                	console.log(error);
                });
                //authService.setAuthToken();
                //$state.go('main.home');

            };
        }])
});