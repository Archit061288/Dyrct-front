
define(['angularAMD'], function(angularAMD) {
//    angularAMD = angular.module('MainController', ['ngCookies', 'commonServices']);

    angularAMD.controller('dyrctvideoCtrl', ['$scope', '$rootScope', '$cookies', '$cookieStore', '$state', 'authService', 'resourceService', "$uibModal", "dyrctservice","GLOBALS", function($scope, $rootScope, $cookies, $cookieStore, $state, authService, resourceService, $uibModal, dyrctservice,GLOBALS) {
          $scope.videoval = true;
          $scope.dyrctmp4video = 'assets/img/video/Dyrct_Demo_AV_MP4.mp4';
          $scope.dyrctwebmvideo = 'assets/img/video/Dyrct_Demo_AV_MP4.webm';
            ga("send", "event", {eventCategory: "Video", eventAction: "Play", eventLabel: "Video Played"});
        }]);


});
