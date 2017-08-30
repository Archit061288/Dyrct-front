define(['angularAMD'], function (angularAMD) {

    angularAMD.controller('deletegroupCtrl', ['$scope', '$uibModalInstance','displaystr',
        function($scope, $uibModalInstance,displaystr) {
            $scope.name = displaystr;
            $scope.okbutton = false;
            if(displaystr == 'Setting changed successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Password set successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Folder is already exists.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Contact saved successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'You already have this name in your Contacts.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'You already have this Address in your Address list.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Address deleted By Owner.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Contact deleted By Owner.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Folder cannot be moved.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Sub folder already created.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Folder is already exists.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Please select the proper time.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Please enter group name.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'The geolocation is not supported by this browser.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Invalid Mobile Number- message not sent')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Message send successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'CID/POI cannot be moved')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'CID/POI Moved Successfully')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Address saved successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Address shared successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Address/Contact added successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Contact shared successfully.')
            {
                $scope.okbutton = true;
            }
            if(displaystr == 'Notification accepted/rejected successfully.')
            {
                $scope.okbutton = true;
            }
             if(displaystr == 'Contact Duplicate.')
            {
                $scope.okbutton = true;
            } 
             if(displaystr == 'Image Upload Successfully')
            {
                $scope.okbutton = true;
            } 
            
            $scope.cancel = function(){
                $uibModalInstance.dismiss();
            }
            $scope.deleted = function(){
                $uibModalInstance.close();
            }
        }])
        
});