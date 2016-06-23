"use strict";
define(
    [
        '../script/require-configuration.js?v=' + new Date().getTime()
    ],
    function (configurator) {
        var start = function (customStart) {
            configurator.configure();
            require(
                [
                    'core/fc.core.session',
                    'impl/AuthorizationManager',
                    'impl/applicationconfiguration',
                    '/script/appversion.js',
                    'backbone',
                    'asyncjs'
                ],
                function (session, auth, appConfig, versioner) {
                    var loadCss = function (path) {
                        var needsCSS = true;
                        $('link').each(function(index, el){
                            if ($(el).attr('href').indexOf(path) >= 0){
                                needsCSS = false;
                            }
                        });
                        if (needsCSS){
                        var link = document.createElement("link");
                        link.type = "text/css";
                        link.rel = "stylesheet";
                        link.href = path + "?v=" + versioner.version;
                        document.getElementsByTagName("head")[0].appendChild(link);
                        }
                    };
                    var onAuthResponse = function (featureStatusDisabled) {
                        var mobileFeatureDisabled = featureStatusDisabled["pramaMobile"];
                        var switchVersionsDisabled = featureStatusDisabled["SwitchToMobile"];
                        var mobile = false;
                        var greaterDimension;
                        var screenWidth = screen.width;
                        var screenHeight = screen.height;
                        if (screenHeight > screenWidth) {
                            greaterDimension = screenHeight;
                        } else {
                            greaterDimension = screenWidth;
                        }

                        if (greaterDimension <= 800){
                            loadCss("../style/flat.css");
                        }
                        if (!mobileFeatureDisabled && greaterDimension < 900) {
                            mobile = true;
                        }
                        var storedVersionPreference;
                        if (!switchVersionsDisabled) {
                            storedVersionPreference = sessionStorage["StoredVersionPreference"];
                        }
                        if (storedVersionPreference) {
                            mobile = (storedVersionPreference == "mobile");
                        }
                        if (mobile) {
                            appConfig.disabledInterfaceFeatures.push("SensorAssignments.Edit");
                            loadCss("../style/prama-mobile.css");
                            require(['lib/fastclick'], function (FastClick) {
                                new FastClick(document.body);
                            });
                            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                                $('body').css('overflow', 'hidden');
                            }
                            requirejs.config(
                                {
                                    paths: {
                                        "device@ui.components": "ui/components/mobile",
                                        "chrome.views": "impl/views/chrome/mobile",
                                        "chrome.templates": "../../templates/chrome/mobile",
                                        "public.chrome": "../../public/templates/mobile",
                                        "targeted": "impl/targeted/mobile",
                                        "router": "impl/routers/MobileRouter"
                                    }
                                }
                            );

                        } else {
                            loadCss("../style/prama.css");
                            requirejs.config(
                                {
                                    paths: {
                                        "device@ui.components": "ui/components/desktop",
                                        "chrome.views": "impl/views/chrome/desktop",
                                        "chrome.templates": "../../templates/chrome/desktop",
                                        "public.chrome": "../../public/templates/desktop",
                                        "targeted": "impl/targeted/desktop",
                                        "router": "impl/routers/Router"
                                    }
                                }
                            );
                        }
                        require(
                            [
                                'router',
                                'impl/repositories/AuthorizationRepository',
                                'chrome.views/ChromeHeaderView',
                                'chrome.views/ChromeFooterView',
                                'impl/translations',
                                'core/fc.core'
                            ],
                            function (router, auth, headerViewConstructor, footerViewConstructor, translations, core) {
                                var onResponse = function (response) {
                                        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                                            $('body').css('overflow', 'hidden');
                                        }
                                        if (response.success) {
                                            if (customStart) {
                                                customStart();
                                            } else {
                                                var setupHeader = function () {
                                                    var authDetails = response.data;
                                                    var headerOptions = {
                                                        el: "#headerWrapper",
                                                        model: authDetails
                                                    };
                                                    var header = new headerViewConstructor(headerOptions);
                                                    var footerOptions = {
                                                        el: "#footerWrapper"
                                                    };
                                                    var footer = new footerViewConstructor(footerOptions);
                                                    router.start(header, footer);
                                                };
                                                translations.loadCommon(core.mvc.requestProvider, setupHeader);
                                            }
                                        }
                                };
                                auth.getHeaderDetails(onResponse);
                            }
                        );
                    };
                    var useDemo = sessionStorage.getItem("DemoMode") === 'true';
                    if (useDemo) {
                        require( [ 'demo/DemoServer' ], function( demoServer ) {
                                appConfig.demoServer = demoServer;
                                $('body').addClass("demo");
                                auth.featureDisabled(["pramaMobile","SwitchToMobile"], onAuthResponse);
                            }
                        );

                    } else {
                        auth.featureDisabled(["pramaMobile","SwitchToMobile"], onAuthResponse);
                    }


                }
            );
        };
        return start;
    }
);


