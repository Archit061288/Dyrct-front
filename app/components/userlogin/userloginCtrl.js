define(['angularAMD', 'components/userlogin/userloginCtrl'], function(angularAMD) {

    angularAMD.controller('userloginCtrl', ['$scope', 'authService', 'dyrctservice', '$cookieStore', '$state', '$stateParams', '$uibModalInstance', 'getcountrydata','signfor',
        function($scope, authService, dyrctservice, $cookieStore, $state, $stateParams, $uibModalInstance, getcountrydata,signfor) {
            $scope.showlogin = true;
            //$scope.showsignup = true;
            $scope.loginmsg = false;
            //console.log(signfor);
            if(signfor == 'signup')
            {
                $scope.showlogin = false;
            }
            if(signfor == 'login')
            {
                $scope.showlogin = true;
            }
            $scope.loginregister = function(forgotsign) {

                $scope.showlogin = false;
                $scope.forgott=forgotsign;
            }
            
            $scope.signupregister = function() {
                
               // $scope.activeTab = 'active';
                $scope.showlogin = true;
//                $scope.showsignup = false;
//                console.log($scope.showsignup,$scope.showlogin);
}

$scope.submitbtn = false;
$scope.userlogin = function()
{
    var data = {};
    if (!$scope.username) {
        $scope.username = "";
    }

    if (!$scope.password) {
        $scope.password = "";
    }
                //$scope.cc = '+' + $scope.countrycode;
                data.post_data_string = {"method": "webLogin", "phone": $scope.username, "user_pin": $scope.password}

                dyrctservice.post(data, function(success) {

                    if (success.data.error == 'invalid_user_no')
                    {
                        $scope.error = true;
                        $scope.loginmsg = true;
                        $scope.errormessage = "Invalid mobile number.";
                    }
                    else if (success.data.error == 'invalid_password')
                    {
                        $scope.error = true;
                        $scope.loginmsg = true;
                        $scope.errormessage = "Invalid password.";
                    }
                    else if (success.data.error == 'inactive_user' && success.data.flag == false)
                    {
                        $scope.error = true;
                        $scope.loginmsg = true;
                        $scope.errormessage = "Please register with DYRCT.";
                    }

                    else {
                        $scope.error = false;
                        //$scope.hidediv();
                        $uibModalInstance.dismiss('cancel');
                        $cookieStore.put('_qu', success.data);
                        $scope.usercid = $cookieStore.get('_qu');
                        
                        if ($scope.usercid && $scope.usercid.status == "active")
                        {
//                            $state.go("common.mycid");
                                if($stateParams.redirecturl)
                                {
                                   $state.go($stateParams.redirecturl,JSON.parse(localStorage.getItem("toParams"))); 
                                }
                                else
                                {
                                    $state.go("common.mycid");
                                }
                                //console.log($stateParams,JSON.parse(localStorage.getItem("toParams")))
                        }
                        else
                        {
                            $state.go("common.usercid", {id: success.data._id ? success.data._id.$id : ''});
                        }
                        //$cookieStore.get("_qu");
                        //$state.go("common.usercid", {id: success.data._id.$id});

                    }

                    //data.post_data_string={"method":"webotpVerification","country_code":$scope.countrycode,"country":$scope.country,"phone":$scope.phonenumber,"otp_verified":"false"}    

                    //$cookieStore.put('_qu',success.data);

                }, function(error) {

                    console.log(error);

                });


};

$scope.cancel = function() {
    
    $uibModalInstance.close();
    $uibModalInstance.dismiss();
};

$scope.hidediv = function() {
    $scope.showdiv = true;

};

$scope.countrydata = getcountrydata.data;
$scope.showdiv = true;
$scope.generatecode = function()
{

    if (!$scope.phonenumber) {
        $scope.errorphone = true;
        $scope.loginmsg = true;
        $scope.errorrmessage = "Please enter mobile number.";
    }

    var data = {};
                //$scope.cc = '+' + $scope.countrycode;
                if ($scope.selectedcountry)
                {
                    if( $scope.phonenumber.charAt(0) === '0' )
                    {
                        $scope.phonenumber = $scope.phonenumber.slice(1);
                    }
                    
                    $scope.loader = true;
                    data.post_data_string = {"method": "webotpVerification", "country_code": $scope.selectedcountry.d_code, "country": $scope.selectedcountry.name, "phone": $scope.phonenumber, "otp_verified": "false"}
                    dyrctservice.get(data, function(success) {
                        $scope.loader = false;
                        if (success.settings.message == 'Not valid phone number.') {
                            $scope.errorphone = true;
                            $scope.loginmsg = true;
                            $scope.errorrmessage = "Not valid mobile number or country.";
                        }

                        else if (success.settings.message == 'You have already registered with DYRCT. Use the pin for login to DYRCT')
                        {
                            $scope.error = true;
                            $scope.errorrmessage = "You have already registered with dyrct.Use the pin for login to dyrct.";
                        }
                        else {
                            $scope.error = false;
                            $scope.errorrmessage = "";
                            $scope.loginmsg = false;
                            $scope.hidediv();
                            $scope.footerbtn = true;
                        }

                        //data.post_data_string={"method":"webotpVerification","country_code":$scope.countrycode,"country":$scope.country,"phone":$scope.phonenumber,"otp_verified":"false"}    

                        //$cookieStore.put('_qu',success.data);

                    }, function(error) {
                        $scope.loader = false;
                        console.log(error);

                    });
}
else
{
    $scope.loginmsg = true;
    $scope.error = true;
    $scope.errorrmessage = "Please enter country code and mobile number.";
    
}


};

$scope.usersignup = function()
{

    var data = {};
    data.post_data_string = {"method": "webotpVerification", "country_code": $scope.selectedcountry.d_code, "country": $scope.selectedcountry.name, "phone": $scope.phonenumber, "otp_verified": "true", "otp_code": $scope.otpcode, "user_pin": $scope.userpass}
    dyrctservice.get(data, function(success) {

        if (success.settings.message == 'Incorrect OTP code.')
        {
            $scope.error = true;
            $scope.errorrmessage = "Incorrect otp code.";
        }
        else if (success.settings.message == 'Please Enter OTP Code.')
        {
            $scope.errorr = true;
            $scope.errorrmessage = "Please enter otp code.";
        }
        else
        {
            $uibModalInstance.dismiss('cancel');
            
            success.data.forgotpass=$scope.forgott;
            $scope.cookie = $cookieStore.put('_qu', success.data);
            $state.go("common.usercid", {id: success.data.userId});
        }

    }, function(error) {
        console.log(error);
    });


};

//            $scope.cancel = function() {
//                $uibModalInstance.dismiss('cancel');
//            };

$scope.hidediv = function() {
    $scope.showdiv = !$scope.showdiv;

};


$scope.selectcountryViaCode = function(data) {

    $scope.open = false;
    if (data && data != "")
    {

        for (var i = 0; i < $scope.countrydata.length; i++) {
            if (data == $scope.countrydata[i].d_code) {
                $scope.selectedcountry = $scope.countrydata[i];
                $scope.selectedState = $scope.countrydata[i];
                return;
            }
        }
    } else
    {

        $scope.selectedState = [];

    }

//                $scope.selectedcountry = {name: "select country"};

}

$scope.open = false;
//            $scope.selectedcountry = {name: "select country"};
$scope.toggleselect = function() {
    $scope.open = !$scope.open;
}

$scope.selectcountry = function(country) {
    $scope.toggleselect();
    $scope.selectedcountry = country;
    $scope.countrycode = country.d_code;
}

$scope.getAllStates = function(callback) {
    callback($scope.countrydata);
};

$scope.stateSelected = function(state) {
    
    if (state != null) {
        $scope.selectcountry(state)
    }
}

$scope.loginsignup = function()
{
    $scope.showlogin = true;
}
$scope.selectedState = null;

$scope.closeAlert = function() {
    $scope.loginmsg = false;
};
}]);


});

