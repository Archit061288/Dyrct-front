var siteObj = function() {

    // Global variables
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;

    var resizeHandlers = [];

    var assetsPath = '../../assets/';

    var globalImgPath = 'global/img/';

    var globalPluginsPath = 'global/plugins/';

    var globalCssPath = 'global/css/';

    //* START:PAGE LOAD FUNCTION *//

    // initializes main settings
    var handleInit = function() {

        if ($('body').css('direction') === 'rtl') {
            isRTL = true;
        }

        isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

        if (isIE10) {
            $('html').addClass('ie10'); // detect IE10 version
        }

        if (isIE10 || isIE9 || isIE8) {
            $('html').addClass('ie'); // detect IE10 version
        }
    };
    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function() {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {
                var input = $(this);

                if (input.val() === '' && input.attr("placeholder") !== '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function() {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function() {
                    if (input.val() === '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

    var anchorPrevent = function() {
        $('a[href="#"]').click(function(e) {
            e.preventDefault();
        });
    };

// Setup Labels

    var setupLabel = function(){
        if ($('.label_check input').length) {
            $('.label_check').each(function(){ 
                $(this).removeClass('c_on');
            });
            $('.label_check input:checked').each(function(){ 
                $(this).parent('label').addClass('c_on');
            });                
        };
        if ($('.label_radio input').length) {
            $('.label_radio').each(function(){ 
                $(this).removeClass('r_on');
            });
            $('.label_radio input:checked').each(function(){ 
                $(this).parent('label').addClass('r_on');
            });
        };
    };
    // Left Navigation

    var customscroll = function(){
        $(".custom-scrollbar").mCustomScrollbar({
            autoHideScrollbar: true,
            theme: "light-thin"
        });
    };

    var resp_memu = function(){

        $('#resp-menu').click(function(){
            $(this).css('z-index','10000');
            $(this).find('.top-line').toggleClass('top-line-rotate');
            $(this).find('.bot-line').toggleClass('bot-line-rotate');
            $(this).find('.mid-line').toggle();
            $('.mainNav ul li a').removeClass('active');
            $('.mainNav ul li a').next('.sub-menu').hide();
            $('.mainNav ul li').removeClass('active');
            if ($('nav').hasClass('cbp-spmenu-open')) {
                $('html').addClass('overlay');
            }
            else
                $('html').removeClass('overlay');
        });
        var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
        showLeftPush = document.getElementById( 'resp-menu' ),
        body = document.body;
        setTimeout(function(){
            showLeftPush = $('#resp-menu');
            showLeftPush.onclick = function() {
                classie.toggle( this, 'active' );
                classie.toggle( document.body, 'cbp-spmenu-push-toright' );
                classie.toggle( menuLeft, 'cbp-spmenu-open' );

            };
        },1000);
    };

    //* END:PAGE LOAD FUNCTION *//

    return {
        //main function to initiate the theme
        init: function() {

            //Core handlers
            handleInit(); // initialize core variables
            // Hacks
            handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
            anchorPrevent();
            //slide();
            //scrollup();
            resp_memu();
        },
        getUniqueID: function(prefix) {
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },
        ajaxInit: function() {
            newsCarousel();
            galleryCarousel();
            fancybox();
            customscroll();
            //resp_memu();
            $('.label_check, .label_radio').click(function () { setupLabel(); });
            $('.tab-content .btn-group .gen').click(function() {
                if($('.tab-content select').prop("selectedIndex") == 0){
                    $('.tab-content select').next().css({'border':'2px solid #f26a5a','border-radius':'4px 0 4px 4px'});
                }
            });
            /*if($('.tab-content select').length > 0){
                $('.tab-content select').next().onchange(function(){
                    $(this).css('border','1px solid #eaecee');
                });
}*/
            $('.cbp-spmenu ul li a').off('click').on('click',function(e){
                if($(this).parent().find('ul').hasClass('sub-menu')){
                    $('.cbp-spmenu ul li .sub-menu').slideUp('fast');
                    $('.cbp-spmenu ul li a').removeClass('active');
                    $(this).next('.sub-menu').slideToggle('fast');   
                }
                //$(this).next('.sub-menu').slideToggle('fast');

                $(this).addClass('active');
            });
            //$('select').selectpicker();
            scrollup();
        },
        selectPicker: function(){
            setTimeout(function(){
                //$('select').selectpicker('refresh');
            },1000);
        },
        navigation: function() {
            menu();
        },
        // check IE8 mode
        isIE8: function() {
            return isIE8;
        },

        // check IE9 mode
        isIE9: function() {
            return isIE9;
        },

        //check RTL mode
        isRTL: function() {
            return isRTL;
        },

        // check IE8 mode
        isAngularJsApp: function() {
            return (typeof angular == 'undefined') ? false : true;
        },

        getAssetsPath: function() {
            return assetsPath;
        },

        setAssetsPath: function(path) {
            assetsPath = path;
        },

        setGlobalImgPath: function(path) {
            globalImgPath = path;
        },

        getGlobalImgPath: function() {
            return assetsPath + globalImgPath;
        },

        setGlobalPluginsPath: function(path) {
            globalPluginsPath = path;
        },

        getGlobalPluginsPath: function() {
            return assetsPath + globalPluginsPath;
        },

        getGlobalCssPath: function() {
            return assetsPath + globalCssPath;
        },

        getResponsiveBreakpoint: function(size) {
            // bootstrap responsive breakpoints
            var sizes = {
                'xs': 480, // extra small
                'sm': 768, // small
                'md': 992, // medium
                'lg': 1200 // large
            };

            return sizes[size] ? sizes[size] : 0;
        }


    };

}();