define(['angularAMD','owl-carousel', 'angular-route', 'MainController', 'angular-cookies', 'modalpopup',
    'commonServices', 'ocLazyLoad', 'angular-resource', 'angular-animate', "acute-select", "date-select", 'uiGmapgoogle', 'angular-calender','angular-sanitize','angulartics', 'angulartics.google.analytics', 'ng-tags-input', 'commonDirectives','toaster'], function (angularAMD) {
    var app = angular.module("webapp", ['ui.router', 'ngCookies', "oc.lazyLoad", "ngResource", "ngAnimate", "ui.bootstrap", "uiGmapgoogle-maps", "ui.rCalendar", "acute.select",'ngSanitize','angulartics', 'angulartics.google.analytics','ngTagsInput','toaster']);
    app.run(['$rootScope', '$state', '$stateParams', '$cookieStore', '$cookies', 'authService','$location',
        function ($rootScope, $state, $stateParams, $cookieStore, $cookies, authService,$location) {
            //$rootScope.$state = $state;
            //$rootScope.$stateParams = $stateParams;
            
            $rootScope.baseurl='http://uat.dyrct.com/';
            $rootScope.mycid = $cookieStore.get('_qu');
           //$rootScope.analyticsuserId = $rootScope.mycid._id.$id;

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {


            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (!authService.isAuthenticated() && toState.name != 'main.root' && toState.name != 'main.redirect') {
                    //console.log(toState, toParams, fromState, fromParams)
                    localStorage.setItem("toParams",JSON.stringify(toParams));
                    event.preventDefault();
                    $state.go('main.redirect',{redirecturl:toState.name});
                    
                    //return;
                }
//                console.log($cookieStore.get('_qu'));
//                $rootScope.$emit("notificationservice")
//                else if (toState.name.indexOf('common') > -1 && authService.isAuthenticated() == '') {
//                    // event.preventDefault();
//                    $state.go('common');
//                    //return;
//                } 

            });

        }
    ]);
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'GLOBALS', 'uiGmapGoogleMapApiProvider','$analyticsProvider',function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, GLOBALS, GoogleMapApi,$analyticsProvider) {
//            $locationProvider.hashPrefix('!');
//            $locationProvider.html5Mode(true);
            if (history.pushState) {
                //console.log($locationProvider)
                $locationProvider.hashPrefix('!');
                $locationProvider.html5Mode({
                    enabled: true,
                    requireBase: true
                });
            } else {
                $locationProvider.hashPrefix('!');
                $locationProvider.html5Mode({
                    enabled: false,
                    requireBase: false
                });
            }
            $httpProvider.interceptors.push(interceptHttp);
            function interceptHttp($q, trafficCop) {
                
                // Return the interceptor methods. They are all optional and get
                // added to the underlying promise chain.
                return ({
                    request: request,
                    requestError: requestError,
                    response: response,
                    responseError: responseError
                });
                // ---
                // PUBLIC METHODS.
                // -
                // Intercept the request configuration.
                function request(config) {
                    // NOTE: We know that this config object will contain a method as
                    // this is the definition of the interceptor - it must accept a
                    // config object and return a config object.
                    //console.log(config)
                    if(config.params && config.params.notificationloader)
                    {
                       // console.log(config.params && !config.params.notificationloader)
                        return (config);
                    }
                    console.log(config,"here")
                    trafficCop.startRequest(config.method);
                    // Pass-through original config object.
                    return (config);
                }
                // Intercept the failed request.
                function requestError(rejection) {
                    //console.log(rejection)
                    // At this point, we don't why the outgoing request was rejected.
                    // And, we may not have access to the config - the rejection may
                    // be an error object. As such, we'll just track this request as
                    // a "GET".
                    // --
                    // NOTE: We can't ignore this one since our responseError() would
                    // pick it up and we need to be able to even-out our counts.
                    trafficCop.startRequest("get");
                    // Pass-through the rejection.
                    return ($q.reject(rejection));
                }
                // Intercept the successful response.
                function response(response) {
                    //console.log(response)
                    if(response.config && response.config.params && response.config.params.notificationloader)
                    {
                         return (response);
                    }
                    trafficCop.endRequest(extractMethod(response));
                    // Pass-through the resolution.
                    return (response);
                }
                // Intercept the failed response.
                function responseError(response) {
                    //console.log(response)
                    trafficCop.endRequest(extractMethod(response));
                    // Pass-through the rejection.
                    return ($q.reject(response));
                }
                // ---
                // PRIVATE METHODS.
                // ---
                // I attempt to extract the HTTP method from the given response. If
                // another interceptor has altered the response (albeit a very
                // unlikely occurrence), then we may not be able to access the config
                // object or the the underlying method. If this fails, we return GET.
                function extractMethod(response) {
                    try {
                        return (response.config.method);
                    } catch (error) {
                        return ("get");
                    }
                }
            }
            // if (history.pushState) {
            //     $locationProvider.hashPrefix('!');
            //     $locationProvider.html5Mode({
            //         enabled: true,
            //         requireBase: true
            //     });
            // } else {
            //     $locationProvider.hashPrefix('!');
            //     $locationProvider.html5Mode({
            //         enabled: false,
            //         requireBase: false
            //     });
            // }

            $httpProvider.interceptors.push('resourceinterceptor');
            $stateProvider
                    .state('login', {
                        url: "/login",
                        data: {
                            pageTitle: 'Login'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/login/login.html",
                                controller: "loginCtrl",
                                controllerUrl: 'components/login/loginCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('usersignup', {
                        url: "/signup",
                        data: {
                            pageTitle: 'Login'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/usersignup/usersignup.html",
                                controller: "usersignupCtrl",
                                controllerUrl: 'components/usersignup/usersignupCtrl',
                                resolve: {
                                }
                            })
                        }

                    })
                    .state('common.usercid', {
                        url: "/cid/:id",
                        data: {
                            pageTitle: 'Dyrct - Create CID'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/usercid/usercid.html",
                                controller: "usercidCtrl",
                                controllerUrl: 'components/usercid/usercidCtrl',
                                resolve: {
                                }
                            })
                        }

                    })
                    .state('common.editcid', {
                        url: "/editprofile/:id",
                        data: {
                            pageTitle: 'Dyrct - Edit CID '
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/mycid/editcid.html",
                                controller: "editcidCtrl",
                                controllerUrl: 'components/mycid/editcidCtrl',
                                resolve: {
                                }
                            })
                        }

                    })
                    .state('common.mycid', {
                        url: "/myprofile",
                        data: {
                            pageTitle: 'Dyrct - My CID'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/mycid/mycid.html",
                                controller: "mycidCtrl",
                                controllerUrl: 'components/mycid/mycidCtrl',
                                resolve: {
                                }
                            })
                        }

                    })
                    .state('common.epoi', {
                        url: "/editplaces/:id",
                        data: {
                            pageTitle: 'Dyrct - Edit POI '
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/poi/edit_poi.html",
                                controller: "poiCtrl",
                                controllerUrl: 'app/components/poi/poiCtrl.js',
                                resolve: {
                                    poiDataById: function (modifires, $stateParams) {
                                        return modifires.getPoiDataById($stateParams.id);
                                    },
                                    poiData: function () {
                                        return [];
                                    }
                                }
                            })
                        }

                    })
//                    .state('poi', {
//                        url: "/poi",
//                        data: {
//                            pageTitle: 'Poi '
//                        },
//                        views: {
//                            'main': angularAMD.route({
//                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/poi/poi.html",
//                                controller: "poiCtrl",
//                                controllerUrl: 'components/poi/poiCtrl',
//                                resolve: {
//                                    poiData: function(modifires, $stateParams) {
//                                        return modifires.getPoiData({"method": "userPoiService", "isUpdate": "get", "userId": $rootScope.mycid._id.$id, "web_token": $rootScope.mycid.web_token});
//                                    },
//                                    poiDataById: function(modifires, $stateParams) {
//                                        return [];
//                                    },
//                                }
//                            })
//                        }
//
//                    })
                    .state('poiadd', {
                        url: "/poiadd",
                        data: {
                            pageTitle: 'Dyrct - Add Poi'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/poi/add_poi.html",
                                controller: "poiCtrl",
                                controllerUrl: 'app/components/poi/poiCtrl.js',
                                resolve: {
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    },
                                }
                            })
                        }

                    })
                    .state('main', {
                        url: "",
                        data: {
                            pageTitle: 'Dyrct - Home Page'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/common/components/mainLayout/mainLayout.html",
                                controller: "mainLayoutCtrl",
                                controllerUrl: 'common/components/mainLayout/mainLayoutCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }]
                                }
                            }),
                        }

                    })
                    .state('common', {
                        url: "",
                        data: {
                            pageTitle: 'Dyrct - Home Page'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/common/components/commonLayout/commonLayout.html",
                                controller: "commonlayoutCtrl",
                                controllerUrl: 'app/common/components/commonLayout/commonlayoutCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }],
                                    getNotificationListData: ['modifires', function (modifires) {
                                            //return modifires.getNotificationList()
                                        }]
                                }
                            }),
                        }

                    })
                    .state('main.root', {
                        url: "/",
                        data: {
                            pageTitle: 'Dyrct - Home Page'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/common/components/mainLayout/mainLayout.html",
                                controller: "mainLayoutCtrl",
                                controllerUrl: 'common/components/mainLayout/mainLayoutCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }]
                                }
                            }),
                        }

                    })
                    .state('main.redirect', {
                        url: "/redirect?redirecturl",
                        data: {
                            pageTitle: 'Dyrct - Home Page'
                        },
                        views: {
                            'main': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/common/components/mainLayout/mainLayout.html",
                                controller: "mainLayoutCtrl",
                                controllerUrl: 'common/components/mainLayout/mainLayoutCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }]
                                }
                            }),
                        }

                    })
//                    .state('main.root', {
//                        url: "/",
//                        data: {
//                            pageTitle: 'Dyrct - Home Page'
//                        },
//                        views: {
//                            'home': angularAMD.route({
//                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/homeView.html",
//                                controller: "homeCtrl",
//                                controllerUrl: 'app/components/home/homeCtrl.js',
//                                resolve: {
//                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                            return $ocLazyLoad.load({
//                                                insertBefore: document.querySelector('#load_plugins_before'),
//                                                files: [
//                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
//                                                ]
//                                            });
//                                        }],
//                                    flag: function (modifires, $stateParams) {
//                                        return '';
//                                    }
//                                }
//                            })
//                        }
//                    })
                    .state('common.notification', {
                        url: "/notification",
                        data: {
                            pageTitle: 'Dyrct - Home Page'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/notification/notification.html",
                                controller: "notificationCtrl",
                                controllerUrl: 'app/components/notification/notificationCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }],
                                    getNotificationListData: ['modifires', function (modifires) {
                                            return modifires.getNotificationList()
                                        }]
                                }
                            }),
                        }

                    })
                    .state('common.notificationhistory', {
                        url: "/notificationhistory",
                        data: {
                            pageTitle: 'Dyrct - Notification History'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/notification/notificationhistory.html",
                                controller: "notificationhistoryCtrl",
                                controllerUrl: 'app/components/notification/notificationhistoryCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                ]
                                            });
                                        }]
                                }
                            }),
                        }

                    })
                    .state('common.home', {
                        url: "/home",
                        data: {
                            pageTitle: 'Dyrct - CID'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/homeView.html",
                                controller: "homeCtrl",
                                controllerUrl: 'app/components/home/homeCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return [];//modifires.getUserContacts()
                                        }],
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    flag: function (modifires, $stateParams) {
                                        return 'contact';
                                    }
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.poi', {
                        url: "/createpoi",
                        data: {
                            pageTitle: 'Dyrct - Create POI'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/poi/add_poi.html",
                                controller: "poiCtrl",
                                controllerUrl: 'app/components/poi/poiCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    }

                                }
                            })
                        }
                    })
                    .state('common.mapview', {
                        url: "/mapview",
                        data: {
                            pageTitle: 'Dyrct - POI Map View'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/poimapview.html",
                                controller: "poimapviewCtrl",
                                controllerUrl: 'app/components/home/poimapviewCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return modifires.getUserContacts()
                                        }]

                                }
                            })
                        }

                    })
                    .state('common.poilistview', {
                        url: "/poilistview",
                        data: {
                            pageTitle: 'Dyrct - POI List View'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/poilistview.html",
                                controller: "homeCtrl",
                                controllerUrl: 'app/components/home/homeCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return [];//modifires.getUserContacts()
                                        }],
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    flag: function (modifires, $stateParams) {
                                        return 'poi';
                                    }

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.icelistview', {
                        url: "/icelistview",
                        data: {
                            pageTitle: 'Dyrct - POI List View'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/poilistview.html",
                                controller: "homeCtrl",
                                controllerUrl: 'app/components/home/homeCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return [];//modifires.getUserContacts()
                                        }],
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    flag: function (modifires, $stateParams) {
                                        return 'ice';
                                    }

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.recenttrip', {
                        url: "/recenttrip",
                        data: {
                            pageTitle: 'Dyrct - Recent Trip'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/recenttrip.html",
                                controller: "homeCtrl",
                                controllerUrl: 'app/components/home/homeCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return [];//modifires.getUserContacts()
                                        }],
                                    poiData: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    poiDataById: function (modifires, $stateParams) {
                                        return [];
                                    },
                                    flag: function (modifires, $stateParams) {
                                        return 'recenttrip';
                                    }

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.subfolder', {
                        url: "/subfolder/:id",
                        data: {
                            pageTitle: 'Dyrct - Sub Folders'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/subfolder.html",
                                controller: "subfolderCtrl",
                                controllerUrl: 'app/components/folder/subfolderCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getSubFolderData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getSubFolder($stateParams.id)
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            //return modifires.getUserContacts()
                                        }],
                                    getUserFolderData: ['modifires', function (modifires) {
                                            return modifires.getUserFolder()
                                        }],
                                    getOneSubFolderData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getOneSubFolder($stateParams.id)
                                        }]

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.folder', {
                        url: "/folders",
                        data: {
                            pageTitle: 'Dyrct - Folders'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/folder.html",
                                controller: "folderCtrl",
                                controllerUrl: 'app/components/folder/folderCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            //return modifires.getUserContacts()
                                        }],
                                    getUserFolderData: ['modifires', function (modifires) {
                                            return modifires.getUserFolder()
                                        }],
                                    getSubFolderData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            //return modifires.getSubFolder();
                                        }],
                                    getOneSubFolderData: function (modifires, $stateParams) {
                                        return [];
                                    }
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.subfolderdetail', {
                        url: "/subfolderdetail/:id",
                        data: {
                            pageTitle: 'Dyrct - Sub Folder Detail'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/folder/subfolderdetail.html",
                                controller: "subfolderdetailCtrl",
                                controllerUrl: 'app/components/folder/subfolderdetailCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getSubFolderData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getSubFolder($stateParams.id)
                                        }],
                                    getOneSubFolderData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getOneSubFolder($stateParams.id)
                                        }]
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.groups', {
                        url: "/groups",
                        data: {
                            pageTitle: 'Dyrct - Groups'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/groups.html",
                                controller: "groupsCtrl",
                                controllerUrl: 'app/components/groups/groupsCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            //return modifires.getUserContacts()
                                        }],
                                    getGroupData: ['modifires', function (modifires) {
                                            return modifires.getGroup()
                                        }],
                                    getGroupUserListData: ['modifires', function (modifires) {
                                            return []
                                        }]

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.groupuserlist', {
                        url: "/groupuser/:id",
                        data: {
                            pageTitle: 'Dyrct - Groups History'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/groupuserlist.html",
                                controller: "groupuserlistCtrl",
                                controllerUrl: 'app/components/groups/groupuserlistCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            return [];
                                        }],
                                    getGroupData: ['modifires', function (modifires) {
                                            return modifires.getGroup()
                                        }],
                                    getGroupUserListData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getGroupUserList($stateParams.id)
                                        }],
                                    getOneGrouplistData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getOneGroupList($stateParams.id)
                                        }]

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.grouphistory', {
                        url: "/grouphistory/:id",
                        data: {
                            pageTitle: 'Dyrct - Group History'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/grouphistory.html",
                                controller: "grouphistoryCtrl",
                                controllerUrl: 'app/components/groups/grouphistoryCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserContactData: ['modifires', function (modifires) {
                                            //return modifires.getUserContacts()
                                        }],
                                    getGroupData: ['modifires', function (modifires) {
                                            return modifires.getGroup()
                                        }],
                                    getGroupUserListData: ['modifires', function (modifires) {
                                            return []
                                        }],
                                    getOneGrouplistData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getOneGroupList($stateParams.id)
                                        }],
                                    getGroupHistoryData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getgrouphistorydetail($stateParams.id)
                                        }]

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.groupstatus', {
                        url: "/grouphistory/:groupid/:messageid",
                        data: {
                            pageTitle: 'Dyrct - Group Historymodifires.getgroupstatus($stateParams.groupid,$stateParams.messageid);'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/groups/groupstatus.html",
                                controller: "groupstatusCtrl",
                                controllerUrl: 'app/components/groups/groupstatusCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]

                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.logbook', {
                        url: "/logbook",
                        data: {
                            pageTitle: 'Dyrct - Log Book'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/logbook/logbook.html",
                                controller: "logbookCtrl",
                                controllerUrl: 'components/logbook/logbookCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getlogbookData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getlogbookdata()
                                        }],
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.tripdetail', {
                        url: "/log-book-tripdetail/:id",
                        data: {
                            pageTitle: 'Dyrct - Log Book'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/logbook/log-book-tripdetail.html",
                                controller: "log-book-tripdetailCtrl",
                                controllerUrl: 'app/components/logbook/log-book-tripdetailCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getlogbookdetailData: ['modifires', '$stateParams', function (modifires, $stateParams) {
                                            return modifires.getlogbookdetail($stateParams.id)
                                        }],
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
                    .state('common.categories', {
                        url: "/categories",
                        data: {
                            pageTitle: 'Dyrct - Categories'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/logbook/categories.html",
                                controller: "categoriesCtrl",
                                controllerUrl: 'components/logbook/categoriesCtrl',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getCategoryData: ['modifires', function (modifires) {
                                            return modifires.getCategory()
                                        }],
                                    getlogbookData: ['modifires', function (modifires) {
                                            return modifires.getlogbook()
                                        }]
                                }
                            }),
                            'search': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
                                controller: "searchCtrl",
                                controllerUrl: 'app/components/search/searchCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    })
//                    .state('common.scheduler', {
//                        url: "/scheduler",
//                        data: {
//                            pageTitle: 'Scheduler'
//                        },
//                        views: {
//                            'front': angularAMD.route({
//                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/scheduler/scheduler.html",
//                                controller: "schedulerCtrl",
//                                controllerUrl: 'app/components/scheduler/schedulerCtrl.js',
//                                resolve: {
//                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                            return $ocLazyLoad.load({
//                                                insertBefore: document.querySelector('#load_plugins_before'),
//                                                files: [
//                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
//                                                    "assets/css/jquery.fileupload.css",
//                                                ]
//                                            });
//                                        }],
//                                    getSchedulerListData: ['modifires', function (modifires) {
//                                            return //modifires.getSchedulerList()
//                                        }],
//                                    getUserContactData: ['modifires', function (modifires) {
//                                            //return modifires.getUserContacts()
//                                        }]
//                                }
//                            }),
//                            'search': angularAMD.route({
//                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/search/searchview.html",
//                                controller: "searchCtrl",
//                                controllerUrl: 'app/components/search/searchCtrl.js',
//                                resolve: {
//                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//                                            return $ocLazyLoad.load({
//                                                insertBefore: document.querySelector('#load_plugins_before'),
//                                                files: [
//                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
////                                                    "assets/css/jquery.fileupload.css",
//                                                ]
//                                            });
//                                        }]
//                                }
//                            })
//                        }
//
//                    })
                    .state('common.setting', {
                        url: "/setting",
                        data: {
                            pageTitle: 'Dyrct - Setting'
                        },
                        views: {
                            'front': angularAMD.route({
                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/setting/setting.html",
                                controller: "settingCtrl",
                                controllerUrl: 'app/components/setting/settingCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }],
                                    getUserBlockListData: ['modifires', function (modifires) {
                                            //return modifires.getBlockList()
                                        }],
                                    getDefaultUseSetting: ['modifires', function (modifires) {
                                            return modifires.getusersetting()
                                        }]
                                }
                            })

                        }

                    })
                    .state('common.logout', {
                        url: "/logout",
                        data: {
                            pageTitle: 'Dyrct - Setting'
                        },
                        views: {
                            'front': angularAMD.route({
//                                templateUrl: "" + GLOBALS.SITE_URL + "app/components/home/homeView.html",
                                controller: "logoutCtrl",
                                controllerUrl: 'app/components/logout/logoutCtrl.js',
                                resolve: {
                                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                                            return $ocLazyLoad.load({
                                                insertBefore: document.querySelector('#load_plugins_before'),
                                                files: [
                                                    // "app/common/components/fileupload/blueimp-gallery.min.css",
                                                    "assets/css/jquery.fileupload.css",
                                                ]
                                            });
                                        }]
                                }
                            })
                        }

                    });
            $urlRouterProvider.otherwise(function ($injector, $location) {
                var state = $injectmapviewor.get('$state');
                //console.log(state.current.name);
                if (state.current.name == "main.root" || state.current.name == "")
                {
                    alert("404 Error-Not Found. We are redirecting you to Landing Page.");
                    state.go('main.root');
                    return $location.path();
                }
                else
                {
                    state.go(state.current.name);
                    return $location.path();
                }
                //state.go('main.root');
                //return $location.path();
            });

            GoogleMapApi.configure({
                //    key: 'your api key',
                v: '3.17',
                libraries: 'places'
            });
            //$urlRouterProvider.otherwise("/signup");
        }]);
    app.run(["$rootScope", "$state", "$templateCache", function ($rootScope, $state, $templateCache) {
            $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
            $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
//                console.log('$stateChangeError - fired when an error occurs during transition.');
                //console.log(arguments);
            });
            
            $rootScope.$state = $state; // state to be accessed from view    
        }]);

    return angularAMD.bootstrap(app);
});

function setMetaData($scope, $rootScope, MetaInformation, seo) {
    if (typeof seo != "undefined") {
        if (typeof seo.seo_title != "undefined") {
            MetaInformation.setMetaTitle(seo.seo_title);
        }
        if (typeof seo.seo_description != "undefined") {
            MetaInformation.setMetaDescription(seo.seo_description)
        }
        if (typeof seo.seo_keywords != "undefined") {
            MetaInformation.setMetaKeyword(seo.seo_keywords)
        }
        $rootScope.metaData = MetaInformation;
    }
}
