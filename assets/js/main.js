require.config({
    baseUrl: "app",
    paths: {
        //'angular': '../assets/js/vendor/angular.min',
        'jquery': '../assets/js/jquery.min',
        'angular': '../assets/js/vendor/angular.min',
        'angular-sanitize':'../assets/js/vendor/angular-sanitize.min',
        'angular-route': '../assets/js/vendor/angular-ui-router.min',
        'angular-resource': '../assets/js/vendor/angular-resource',
        'angular-cookies': '../assets/js/vendor/angular-cookies.min',
        'ocLazyLoad': '../assets/libs/ocLazyLoad.min',
        'angularAMD': '../assets/js/vendor/angularAMD.min',
        'angular-file-upload': '../assets/js/vendor/angular-file-upload.min',
        'bootstrap': '../assets/libs/bootstrap.min',
        'bootstrap-select': '../assets/js/vendor/bootstrap-select',
        'modernizr': '../assets/libs/modernizr',
        'MainController': '../app/common/controllers/MainController',
        'commonServices': '../app/common/services/commonServices',
        'commonDirectives': '../app/common/directives/commonDirectives',
        'ngload': '../assets/js/vendor/ngload',
        'lodash':'../assets/js/vendor/lodash',
        'uiGmapgoogle': '../assets/js/vendor/angular-google-maps.min',
        'angular-animate':'../assets/js/vendor/angular-animate.min',
        'ui-bootstrap': '../assets/libs/ui-bootstrap-tpls-0.13.0.min',
        'modalpopup':'../assets/js/vendor/ui-bootstrap-tpls',
        //'calender':'../assets/js/vendor/fullcalendar.min',
        'angular-calender':'../assets/js/vendor/calendar-tpls',
        //'moment':'../assets/js/vendor/moment',
        'ng-map':'../assets/js/vendor/ng-map.min',
        'angular-socialshare':'../assets/js/vendor/angular-socialshare',
        'ng-file-upload': '../assets/js/vendor/ng-file-upload',
        'acute-select': '../assets/libs/acute.select',
        'date-select': '../assets/js/date',
        'html2canvas':'../assets/js/vendor/html2canvas',
        'angulartics':'../assets/js/vendor/angulartics.min',
        'angulartics.google.analytics':'../assets/js/vendor/angulartics-ga',
        'owl-carousel':'../assets/js/vendor/owl.carousel',
        'ng-tags-input':'../assets/js/vendor/ng-tags-input',
        'toaster':'../assets/js/vendor/toaster'        
        
        
        
    },
    shim: {
        "angular": {exports: "angular"},
        'angular-route': ['angular'],
        'angular-sanitize':['angular'],
        'angular-resource': ['angular'],
        'ngload': ['angularAMD'],
        'angular-animate': ['angular'],
        'textAngular-sanitize': ['angular'],
        'textAngular': ['angular'],
        'angular-cookies': ['angular'],
        'ocLazyLoad': ['jquery','angular'],
        'ui-bootstrap': ['angular','bootstrap','jquery'],
        'jquery-fileupload-angular': ['angular','jquery-fileupload','jquery'],
        'MainController': ['angular'],
        'commonServices': ['angular'],
        'commonDirectives': ['angular','owl-carousel'],
        'angular-file-upload': ['angular','jquery'],
        'bootstrap': ['jquery'],
        'bootstrap-select': ['jquery'],
        'angularAMD': ['angular'],
        'lodash': ['jquery'],
        'uiGmapgoogle': ['angularAMD','lodash',"ocLazyLoad"],
        'modalpopup': ['angular'],
        //'moment':['jquery'],
        'ng-map':['angular'],
        'angular-calender':['jquery','angular'],
        //'calender':['jquery','angular'],
        'angular-socialshare':['angular'],
        'ng-file-upload':['angular'],
        'acute-select':['angular'],
        'date-select':['angular'],
        'angulartics':['angular'],
        'angulartics.google.analytics':['angular'],
        'owl-carousel':['jquery'],
        'ng-tags-input':['angular'],
        'toaster': ['angular']
        
        
        
        
    },
    waitSeconds: 0,
    deps: ['app']
    //urlArgs: "v=" + new Date().getTime()

});
