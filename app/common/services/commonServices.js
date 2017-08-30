define(['angularAMD', 'jquery'], function(angularAMD) {
    //var angularAMD = angular.module('commonServices', ['ngCookies'])

    angularAMD.constant('GLOBALS', {
        //SITE_URL: "/ANGULARJS/SEED_PROJECT/SeedMaster/"

        SITE_URL: "",
        API_URL:"http://uat.dyrct.com/"

                //SITE_URL: "/dyrct-front/dyrct/dyrct-front/"

    });

    angularAMD.constant('API_HOST', {
        LOCAL: {
            "apiUrl": "http://local.dev/quantum-api/v1/apps/547d9e3b7c40af67db4350f5/"
        },
        STAGING: {
            "apiUrl": "http://stg.qdata.io/v1/apps/547d9e3b7c40af67db4350f5/"
        },
        PRODUCTION: {
            "apiUrl": "http://api.qdata.io/v1/apps/547d9e3b7c40af67db4350f5/"
        }
    });
    angularAMD.factory('TokenHandler', ['$cookieStore', function($cookieStore) {
            var tokenHandler = {};
            var token = "none";

            tokenHandler.set = function(newToken) {
                token = newToken;
            };

            tokenHandler.get = function() {
                return token;
            };

            // wrap given actions of a resource to send auth token with every
            // request
            tokenHandler.wrapActions = function(resource, actions) {
                // copy original resource
                var wrappedResource = resource;
                for (var i = 0; i < actions.length; i++) {
                    tokenWrapper(wrappedResource, actions[i]);
                }
                ;
                // return modified copy of resource
                return wrappedResource;
            };

            // wraps resource action to send request with auth token
            var tokenWrapper = function(resource, action) {
                // copy original action
                resource['_' + action] = resource[action];
                // create new action wrapping the original and sending token
                resource[action] = function(data, success, error) {
//                console.log(data.post_data_string,data.post_data_string.indexOf('"web_token":"2bbd39ef279a50b71ed61d7b4b2c3fa8"'));
//                data.post_data_string=data.post_data_string.replace('"web_token":"2bbd39ef279a50b71ed61d7b4b2c3fa8"','"web_token":"'+$cookieStore.get('_qu')?$cookieStore.get('_qu').web_token:+'"')
//                console.log(data)
                    return resource['_' + action](
                            angular.extend({}, data || {}, {web_token: $cookieStore.get('_qu') ? $cookieStore.get('_qu').web_token : ""}),
                            success,
                            error
                            );
                };
            };

            return tokenHandler;
        }]);
    angularAMD.service('authService', ['$cookies', '$cookieStore', '$http', '$state', function($cookies, $cookieStore, $http, $state) {
            var authService = {};
            authService.isAuthenticated = function() {
                //console.log(authService.authToken)
                var authToken = $cookieStore.get('_qu');
                authService.authToken = authToken ? authToken : '';
                return authService.authToken;
            };
            authService.setAuthToken = function(token) {
                $cookieStore.put('_qu', "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            };
            authService.clearAuthentication = function() {
                $cookieStore.remove('_qu');
            };
            authService.clearAuthenticationBack = function(err) {
                if (err == 401) {
                    $cookieStore.remove('_qu');
                    //$state.go('login');
                    //window.location = settings.url + '/login';
                }
            };
            return authService;
        }]);

    angularAMD.factory('encodeURL', function() {
        return {
            encode: function(array) {
                var r = '';
                for (var i in array) {
                    r += encodeURIComponent(i) + '=' + encodeURIComponent(array[i]) + '&';
                }
                r = r.slice(0, -1);
                return r;
            },
            serialize: function(obj, prefix) {
                var str = [];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        if (_.isArray(obj[p])) {
                            _.each(obj[p], function(arrayData) {
                                if (_.isObject(arrayData)) {
                                    str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(JSON.stringify(arrayData)));
                                } else {
                                    str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(arrayData));
                                }
                            });
                        } else if (_.isObject(obj[p])) {
                            str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(JSON.stringify(obj[p])));
                        } else if (_.isNull(obj[p]) || _.isUndefined(obj[p])) {

                        } else {
                            str.push(encodeURIComponent(p) + "%3D" + encodeURIComponent(obj[p]));
                        }
                    }
                }
                return str.join("%26");
            }
        }
    });

    angularAMD.factory('browserService', ["$window", function($window) {
            var uaMatch = function(ua) {
                ua = ua.toLowerCase();

                var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                        /(msie) ([\w.]+)/.exec(ua) ||
                        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

                return {
                    browser: match[1] || "",
                    version: match[2] || "0"
                };
            };
            var matched = uaMatch($window.navigator.userAgent);
            var browser = {};

            if (matched.browser) {
                browser[matched.browser] = true;
                browser.version = matched.version;
            }

            // Chrome is Webkit, but Webkit is also Safari.
            if (browser.chrome) {
                browser.webkit = true;
            } else if (browser.webkit) {
                browser.safari = true;
            }

            return browser;
        }]);

    angularAMD.factory('resourceinterceptor', ["$q", "browserService", "encodeURL", function($q, browserService, encodeURL) {
            return {
                // optional method
                'request': function(config) {
                    // do something on success
//                    console.log(config)
                    if (config.url.search('php54.indianic.com/healthcareiq/api') != -1) {
                        if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method == "GET") {
                            var querystring = encodeURL.serialize(config.params);
                            var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url);
                            if (querystring != "") {
                                encodedurl += "%3F" + querystring
                            }
                            config.params = {};
                            config.url = encodedurl;
                        } else if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method != "POST") {
                            var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url)
                            config.url = encodedurl;
                        } else if (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' && config.method != "PUT") {
                            var encodedurl = '_quantum_proxy.php?q=' + encodeURIComponent(config.url)
                            config.url = encodedurl;
                        }
                    }
                    return config;
                },
                // optional method
                'requestError': function(rejection) {
                    // do something on error

                    return $q.reject(rejection);
                },
                // optional method
                'response': function(response) {
                    // do something on success
                    return response;
                },
                // optional method
                'responseError': function(rejection) {
                    // do something on error
                    return $q.reject(rejection);
                }
            };
        }]);

    angularAMD.factory('resourceUrl', ["browserService", function(browserService) {
            return {
                proxify: function(url) {
                    //                    return (browserService.msie && browserService.version === '9.0' || browserService.version === '8.0' )
                    return (true) ? '_quantum_proxy.php?q=' + encodeURIComponent(url) : url;
                }
            }
        }]);
    angularAMD.service(
            "trafficCop",
            function setupService() {
                // I keep track of the total number of HTTP requests that have been
                // initiated with the application.
                var total = {
                    all: 0,
                    get: 0,
                    post: 0,
                    delete: 0,
                    put: 0,
                    head: 0
                };
                // I keep track of the total number of HTTP requests that have been
                // initiated, but have not yet completed (ie, are still running).
                var pending = {
                    all: 0,
                    get: 0,
                    post: 0,
                    delete: 0,
                    put: 0,
                    head: 0
                };
                // Return the public API.
                return({
                    pending: pending,
                    total: total,
                    endRequest: endRequest,
                    startRequest: startRequest,
                });
                // ---
                // PUBLIC METHODS.
                // ---
                // I stop tracking the given HTTP request.
                function endRequest(httpMethod) {
                    httpMethod = normalizedHttpMethod(httpMethod);
                    pending.all--;
                    pending[ httpMethod ]--;
                    // EDGE CASE: In the unlikely event that the interceptors were not
                    // able to obtain the config object; or, the method was changed after
                    // our interceptor reached it, there's a chance that our numbers will
                    // be off. In such a case, we want to try to redistribute negative
                    // counts onto other properties.
                    if (pending[ httpMethod ] < 0) {
                        redistributePendingCounts(httpMethod);
                    }
                }
                // I start tracking the given HTTP request.
                function startRequest(httpMethod) {

                    httpMethod = normalizedHttpMethod(httpMethod);
                    total.all++;
                    total[ httpMethod ]++;
                    pending.all++;
                    pending[ httpMethod ]++;
                }
                // ---
                // PRIVATE METHODS.
                // ---
                // I make sure the given HTTP method is recognizable. If it's not, it is
                // converted to "get" for consumption.
                function normalizedHttpMethod(httpMethod) {
                    httpMethod = (httpMethod || "").toLowerCase();
                    switch (httpMethod) {
                        case "get":
                        case "post":
                        case "delete":
                        case "put":
                        case "head":
                            return(httpMethod);
                            break;
                    }
                    return("get");
                }
                // I attempt to redistribute an [unexpected] negative count to other
                // non-negative counts. The HTTP methods are iterated in likelihood of
                // execution. And, while this isn't an exact science, it will normalize
                // after all HTTP requests have finished processing.
                function redistributePendingCounts(negativeMethod) {
                    var overflow = Math.abs(pending[ negativeMethod ]);
                    pending[ negativeMethod ] = 0;
                    // List in likely order of precedence in the application.
                    var methods = ["get", "post", "delete", "put", "head"];
                    // Trickle the overflow across the list of methods.
                    for (var i = 0; i < methods.length; i++) {
                        var method = methods[ i ];
                        if (overflow && pending[ method ]) {
                            pending[ method ] -= overflow;
                            if (pending[ method ] < 0) {
                                overflow = Math.abs(pending[ method ]);
                                pending[ method ] = 0;
                            } else {
                                overflow = 0;
                            }
                        }
                    }
                }
            }
    );
    angularAMD.factory('MetaInformation', [function() {
            var metaDescription = '';
            var metaKeyword = '';
            var metaTitle = '';
            return {
                metaDescription: function() {
                    return metaDescription;
                },
                metaKeyword: function() {
                    return metaKeyword;
                },
                metaTitle: function() {
                    return metaTitle;
                },
                reset: function() {
                    metaDescription = '';
                    metaKeyword = '';
                    metaTitle = '';
                },
                setMetaTitle: function(newMetaTitle) {
                    metaTitle = newMetaTitle;
                },
                setMetaDescription: function(newMetaDescription) {
                    metaDescription = newMetaDescription;
                },
                setMetaKeyword: function(newKeyword) {
                    metaKeyword = newKeyword;

                }
            };
        }]);

    angularAMD.service('resourceService', ['$cookies', '$cookieStore', '$http', '$state', 'resourceUrl', 'browserService', function($cookies, $cookieStore, $http, $state, resourceUrl, browserService) {
            var resourceService = {};
            resourceService.GetAllCountry = function() {

                //urls = 'http://php54.indianic.com/healthcareiq/api/landing/list_state';
                //urls = 'http://php54.indianic.com/healthcareiq/api/landing/list_speciality';
                //urls = 'http://windev.indianic.com/BRTdev/Package/GetPackages';
                return $http({
                    url: '',
                    method: 'POST',
                    data: $.param({
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            };
            return resourceService;
        }]);


    angularAMD.factory('dyrctservice', ['$rootScope','$resource', 'TokenHandler','GLOBALS', function($rootScope,$resource, tokenHandler,GLOBALS) {
            var baseurl= $rootScope.baseurl;
            var resource = $resource(baseurl+'dyrct_ws/public/rest/user', {post_data_string: '@post_data_string'}, {
                'get': {
                    method: 'GET'
                },
                'post': {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    cache:true
                },
                'getUser': {
                    method: 'GET'
                }
            });
            resource = tokenHandler.wrapActions(resource, ["getUser"]);
            return  resource;
        }]);
    angularAMD.factory('dyrctpoiservice', ['$rootScope','$resource', '$stateParams','GLOBALS', function($rootScope,$resource, $stateParams,GLOBALS) {
            var baseurl= $rootScope.baseurl;
            var resource = $resource(baseurl+'dyrct_ws/public/rest/poi', {post_data_string: '@post_data_string'}, {
                'get': {
                    method: 'GET'
                },
                'post': {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    cache:true

                }
            });
            return  resource;
        }]);


    angularAMD.factory('modifires', ['$resource', '$stateParams', 'dyrctpoiservice', 'dyrctservice', '$cookieStore', function($resource, $stateParams, dyrctpoiservice, dyrctservice, $cookieStore) {
            return {
                getPoiData: function(params) {
                    var query = {post_data_string: JSON.stringify(params)};
                    return dyrctpoiservice.post(query).$promise;
                },
                getPoiDataById: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "userPoiService","isUpdate":"getPoiById","poi_id":"' + params + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctpoiservice.post(query).$promise;
                },
                getUserContacts: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getUserPoiRecenttripList","timestamp":"","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getUserContactsdatahome: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getImportedContactServiceWeb","is_dyrct":"false","timestamp":"","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getUserContactsdatahomedyrct: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getImportedContactServiceWeb","is_dyrct":"true","timestamp":"","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getUserPoi: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "userPoiService","isUpdate":"get","timestamp":"0","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctpoiservice.post(query).$promise;
                },
                getRecentTrip: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getRecentTripList","timestamp":"0","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getUserFolder: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getuserfolder","timestamp":"1445331965","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getSubFolder: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getlistSubfolder","timestamp":"1445332371","folder_id":"' + params + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getOneSubFolder: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getfolderdata","timestamp":"","folder_id":"' + params + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getuserfolderhashtag: function(searchStr,type) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getuserfolderhashtag","timestamp":"","hash_tag":"' + searchStr + '","type":"' + type + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getGroupUserList: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getGroupUserList","timestamp":"","group_id":"' + params + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getOneGroupList: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getgroupuserdetail","group_id":"' + params + '","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getGroup: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "groupListAndAdd","type" : "list","timestamp":"","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getBlockList: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "blockListAndUnblockUser","type" : "list","timestamp":"","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getSchedulerList: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getschedulelist","timestamp":"1445425783","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","device_id":""}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.getUser(query).$promise;
                },
                getNotificationList: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getNotificationList","timestamp":"","web_token":"' + (_qu.web_token ? _qu.web_token : _qu.token) + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr,"notificationloader":true};
                    return dyrctservice.getUser(query).$promise;
                },
                postPoiData: function(params) {
                    var query = {post_data_string: JSON.stringify(params)};
                    return dyrctpoiservice.post(query).$promise;
                },
                getcountry: function() {
                    var params = {"method": "getcountry"};
                    var query = {post_data_string: JSON.stringify(params)};
                    return dyrctservice.post(query).$promise;
                },
                getCategory: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getcategorylist","timestamp":"0","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getlogbook: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getlogbook","timestamp":"0","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getlogbookdetail: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getlogbooktripdetail","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","logbookid":"' + params + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getgrouphistorydetail: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getGroupHistory","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","group_id":"' + params + '","timestamp":""}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getpoicid: function(type, typeid) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getpoicid","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","type":"' + type + '","type_id":"' + typeid + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getgroupstatus: function(groupid, messageid) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getGroupUserListWithStatus","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","group_id":"' + groupid + '","message_id":"' + messageid + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise.then(function(data){
                        return data.data;
                    });
                },
                getglc: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getUserGLC", "web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getusersetting: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getUserSettings","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '"}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                getlogbookdata: function() {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "getlogbook","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","timestamp": 0}';
                    var query = {post_data_string: paramsStr};
                    return dyrctservice.post(query).$promise;
                },
                postPoiListingdata: function(params) {
                    var _qu = $cookieStore.get('_qu');
                    var paramsStr = '{"method": "globalPoiListing","web_token":"' + _qu.web_token + '","userId":"' + (_qu._id ? _qu._id.$id : _qu.userId) + '","title":"'+ params +'" }';
                    var query = {post_data_string: paramsStr};
                    return dyrctpoiservice.post(query).$promise;
                }
            };
        }]);


    angularAMD.service('fileUpload', ['$http', '$rootScope', function($http, $rootScope) {
            this.uploadFileToUrl = function(file, uploadUrl, data) {
                console.log($rootScope.typeimg)
                var fileName = file?file.name:'';
                var ext = fileName.substring(fileName.lastIndexOf('.') + 1);
                if (ext == "gif" || ext == "GIF" || ext == "JPEG" || ext == "jpeg" || ext == "jpg" || ext == "JPG" || ext == "png" || ext == "PNG" || ext == "bmp")
                {   
                    var fd = new FormData();
                fd.append('profile_pic', file);
                fd.append('post_data_string', JSON.stringify(data));
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function(data) {
                    if($rootScope.typeimg == "placesimg"){
                        $rootScope.$broadcast('poiimage', data)
                    }else{
                        $rootScope.$broadcast('image', data)    
                    }
                    
                    //$rootScope.imageurl=data.data.imageurl;
                }).error(function() {
                });
                    return true;
                }
                else if(ext == "doc" || ext == "DOC" || ext == "TXT" || ext == "txt" || ext == "json" || ext == "xls" || ext == "ppt" || ext == "xlsx" || ext == "pdf" || ext == "docx" || ext == "pptx" || ext == "js" || ext == "php" || ext == "html")
                {
                    alert("Upload images only");
                    return false;
                }
                
            }



        }]);
    angularAMD.filter('searchdata', function(){
		return function(data,searchkey,searchparams) {
            if (angular.isArray(data)) {
				var new_prod = [];
                angular.forEach(data, function(value) {
                    //console.log(searchparams)
  					//this.push(key + ': ' + value);
                    var arrsearchparams=searchparams.split(',');
                    //console.log(arrsearchparams.length,"===",searchkey)
                    for (var i = 0; i < arrsearchparams.length; i++) {
                        //console.log(searchkey.toLowerCase())
//                        if(searchkey)
//                        {
//                            searchkey=searchkey.toLowerCase();
//                        }else
//                        {
//                           searchkey="";
//                        }
                    if(searchkey)
                    {
                        if(value[arrsearchparams[i]] && value[arrsearchparams[i]].toLowerCase().indexOf(searchkey.toLowerCase())>=0 ){
                            //console.log(value[arrsearchparams[i]])
                            //console.log("here","--",searchkey.toLowerCase())
                            new_prod.push(value);
                            //console.log(new_prod);
                        }
                    }
                    else
                    {
                            new_prod.push(value);
                    }
    					// if(value.firstName.toLowerCase().indexOf(searchkey)>=0 || value.lastName.toLowerCase().indexOf(searchkey)>=0)
    					// {
    					// 	new_prod.push(value)
    					// }
                    };
				});
               
//                       console.log(new_prod);
//                       var index = new_prod.map(function (el) {
//                    return el.first_letter;
//                });
//               console.log(index)
//               
//               if(index)
//               {
               //console.log(new_prod)
                   return new_prod;
                
                        
				//return new_productt;
				
				/*if (count > data.length || count < 1) {
                    return data;
                } else {
                    return data.slice(count);
                }*/
            }
        }
	});
        
        angularAMD.filter('searchfilterdata', function(){
		return function(data,searchkey,searchparams) {
            if (angular.isArray(data)) {
                //console.log(new_prod)
				var new_prod=[];
                angular.forEach(data, function(value) {
  					//this.push(key + ': ' + value);
                    var arrsearchparams=searchparams.split(',');
                    for (var i = 0; i < arrsearchparams.length; i++) {
                        
                        if(value[arrsearchparams[i]] && value[arrsearchparams[i]].toLowerCase().indexOf(searchkey.toLowerCase())>=0 ){
                            new_prod.push(value);
                            //console.log(new_prod);
                        }
    					// if(value.firstName.toLowerCase().indexOf(searchkey)>=0 || value.lastName.toLowerCase().indexOf(searchkey)>=0)
    					// {
    					// 	new_prod.push(value)
    					// }
                    };
				});

               var new_product = [];
               var arr_letter = [];
               //console.log(new_prod);
               if(new_prod)
               {    
                  
                                angular.forEach(new_prod, function(new_value,i) {
                                   // console.log(new_value)
                                    //console.log(new_value['first_letter']);
                                if(new_value['first_letter'])
                                {
                                    //console.log("here")
                                    arr_letter.push(new_value['first_letter']);
                                    new_product.push(new_value);
                                    //console.log(new_product)
                                   
                                }
                                else
                                {
                                    //console.log("else")
                                    var str=new_value['firstName'];
                                    var res = str.split("");
                                    new_value['first_letter']=res[0].toUpperCase();
                                    arr_letter.push(new_value['first_letter']);
                                    new_product.push(new_value);
                                    //console.log(new_product)
                                }
                                });
     //remove duplicate array
                            function squash(arr) {
                                var tmp = [];
                                for (var i = 0; i < arr.length; i++) {
                                    if (tmp.indexOf(arr[i]) == -1) {
                                        tmp.push(arr[i]);
                                    }
                                }
                                return tmp;
                            }

                        var ress=squash(arr_letter);
                               
    // for remove first letter
                                var new_productt=[];
                                //console.log(new_product);
                    angular.forEach(new_product, function (new_valuee, index) {
                    //console.log(res.indexOf(new_value['first_letter']));
                    if (ress.indexOf(new_valuee['first_letter'])>=0)
                    {
                        new_productt.push(new_valuee);
                        ress.splice(0,1);
                        
                    }
                    else
                    {

                        new_valuee['first_letter'] = "";
                        new_productt.push(new_valuee);
                    }


                });
                                //console.log(new_productt);
                                return new_productt;
                            }
                            else
                            {
                                return new_prod;
                            }
                        
                  
            }
        }
	});
        
});
