define(['angularAMD'], function(angularAMD) {
    angularAMD.directive('pageTitle', ['$rootScope', '$timeout', function($rootScope, $timeout) {
            // Runs during compile
            return {
                link: function(scope, element) {
                    var listener = function(event, toState, toParams, fromState, fromParams) {
                        // Default title - load on Dashboard 1
                        var title = 'Project Name';
                        // Create your own title pattern
                        if (toState.data.pageTitle) {
                            title = toState.data.pageTitle;
                        }
                        $timeout(function() {
                            element.text(title);
                        });
                    };
                    $rootScope.$on('$stateChangeStart', listener);
                }
            };
        }]);

    angularAMD.directive('fileModel', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    //console.log(element[0].files[0])
                    element.bind('change', function() {
                        console.log(element[0].files[0],"test")
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);

    angularAMD.directive('selectpicker', ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.selectpicker();
                }
            };
        }]);


    angularAMD.directive('googlePlaces', function() {
        return {
            restrict: 'AE',
            replace: true,
            // transclude:true,
            scope: {location: '='},
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level"/>',
            link: function($scope, elm, attrs) {
                var autocomplete = new google.maps.places.Autocomplete($("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    //console.log(place.geometry)
                    if (place.geometry) {
                        $scope.location = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                        $scope.$emit("place_changed");
                    }
                    $scope.$apply();
                });
            }
        }
    });
    angularAMD.directive('datepicker', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {
                $(function() {
                    element.datepicker({
                        dateFormat: 'dd/mm/yy',
                        onSelect: function(date) {
                            scope.$apply(function() {
                                ngModelCtrl.$setViewValue(date);
                            });
                        }
                    });
                });
            }
        }
    });

    angularAMD.directive('validPasswordC', function() {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ngModel) {
                ngModel.$parsers.unshift(function(viewValue, $scope) {
                    var noMatch = viewValue != scope.signup.userpass.$viewValue
                    //console.log(noMatch)
                    ngModel.$setValidity('noMatch', !noMatch)
                    //ctrl.$setValidity('parse', !noMatch)
                })
            }
        }
    });
    
    angularAMD.directive('customPopover', function () {
    return {
        restrict: 'A',
        template: '<span>{{label}}</span>',
        link: function (scope, el, attrs) {
            scope.label = attrs.popoverLabel;
            $(el).popover({
                trigger: 'click',
                html: true,
                content: attrs.popoverHtml,
                placement: attrs.popoverPlacement
            });
        }
    };
});



    angularAMD.directive("passwordVerify", function() {
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function(scope, element, attrs, ctrl) {
                scope.$watch(function() {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if (value) {
                        ctrl.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    });
    angularAMD.directive('routeLoader', function($rootScope,$timeout) {
        return {
            restrict: 'EA',
            link: function(scope, element) {
                // Store original display mode of element
                var shownType = element.css('display');
                function hideElement() {
                    element.css('display', 'none');
//                    console.log("hide");

                }

                scope.$on('$stateChangeStart', function() {
                    element.css('display', shownType);
                    $rootScope.frontview = false;

                });
//                scope.$on('$stateChangeSuccess', hideElement);
//                scope.$on('$stateChangeError', hideElement);
                // Initially element is hidden
                scope.$on('$viewContentLoaded', function() {
                    $timeout(function() {
                        hideElement();
                        $rootScope.frontview = true;
                    }, 1000);
                    

                });
                hideElement();
            }
        }
    });
    
    angularAMD.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9+]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});
    angularAMD.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9]/g, '');
            
            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseInt(digits,10);
          }
          else{
              return true;
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});

angularAMD.directive('showonlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
             
            var digits = val.replace(/[^0-9+()-]/g, '');
            
            if (digits !== val) {
                
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            //console.log(digits);
            return String(digits);
          }
          return undefined;
        }            
        ctrl.$parsers.push(inputValue);
      }
    };
});

angularAMD.directive('capitalizeFirst', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if (inputValue === undefined) { inputValue = ''; }
           var capitalized = inputValue.charAt(0).toUpperCase() +
                             inputValue.substring(1);
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
   };
});

    angularAMD.directive('getheight', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, modelCtrl) {
                scope.$watch(attrs.getheight, function (newval, oldval) {
//                    console.log(newval, oldval);
                    $timeout(function () {
                        if (newval) {
                            scope.setheight();
                        }
                    }, 100);
                });
                scope.setheight = function () {
                    var getHei = $(window).height() - 130;
                    var wcHei = $(window).height();// $(".wideColume").innerHeight();
//                    console.log($(window).height(), wcHei);
                    if (getHei > wcHei) {
                        $(".wideColume").css({
                            "height": wcHei,
                            "overflow": "auto"
                        });
//                $(".angular-google-map-container").css({
//                    "height": $(window).height() - 160,
//                    "overflow":"auto"
//                });
                    } else {
                        $(".wideColume").css({
                            "height": getHei,
                            "overflow": "auto"
                        });

                    }

                    $(window).resize(function () {
                        scope.setheight()
                    });
                }

            }
        };
    });
    angularAMD.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var funCheckBounds = function(evt) {
           // console.log("event fired: " + evt.type);
            var rectObject = raw.getBoundingClientRect();
            //console.log(rectObject.bottom === window.innerHeight,rectObject.bottom , window.innerHeight)
            if (parseInt(rectObject.bottom) === window.innerHeight) {
                scope.$apply(attr.whenScrolled);
            }

        };
        
        angular.element(window).bind('scroll load', funCheckBounds);
        
        
    };
});
angularAMD.directive('passwordConfirm', ['$parse', function ($parse) {
 return {
    restrict: 'A',
    scope: {
      matchTarget: '=',
    },
    require: 'ngModel',
    link: function link(scope, elem, attrs, ctrl) {
      var validator = function (value) {
        ctrl.$setValidity('match', value === scope.matchTarget);
        return value;
      }
 
      ctrl.$parsers.unshift(validator);
      ctrl.$formatters.push(validator);
      
      // This is to force validator when the original password gets changed
      scope.$watch('matchTarget', function(newval, oldval) {
        validator(ctrl.$viewValue);
      });

    }
  };
}]);
 angularAMD.directive('owlCarousel', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, el, attrs) {
                //console.log(scope);
                scope.$watch(attrs.items,function(newval,oldval){
//                console.log(newval,oldval)
$timeout(function(){
    el.owlCarousel({
        margin:30,
        responsiveClass:true,
        center:true,
        items:4,
        dots:true
    });
},500)
})


            }
        };
    });
});
