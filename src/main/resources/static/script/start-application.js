"use strict";
define(
    [
        '../script/require-configuration.js?v=' + new Date().getTime()
    ],
    function (configurator) {
        var start = function (customStart) {

            //handle old school stuff
            (function (fc) {
                fc.skipAutoLoad = true;
            }(window.fc = window.fc || {}));
            configurator.configure();
            requirejs.config({
                paths: {
                    oldcore: ['../prama-core'],
                    oldui: ['../prama-ui']
                },
                shim: {
                    jqueryui: {
                        deps: ['jquery']
                    },
                    oldcore: {
                        deps: ['jquery']
                    },
                    oldui: {
                        deps: ['jquery','jqueryui']
                    }
                }
            });

            require(
                [
                    'impl/AuthorizationManager',
                    'impl/repositories/AuthorizationRepository',
                    'impl/applicationconfiguration',
                    '/script/appversion.js',
                    'backbone',
                    'asyncjs',
                    'oldcore',
                    'oldui'
                ],
                function (auth, authRepo, appConfig, versioner) {

                    fc.pageKey = "Landing";
                    fc.autoLoad = false;


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
                        var newMobileDisabled = featureStatusDisabled["NewMobile"];
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
                            storedVersionPreference = sessionStorage.getItem('StoredVersionPreference');
                        }
                        if (storedVersionPreference) {
                            mobile = (storedVersionPreference == "mobile");
                        }
                        if (mobile) {
                            if (newMobileDisabled) {
                                fc.navigate('FieldMonitor');
                            } else {
                                fc.navigate('FieldStatus');
                            }
                            return;
                        } else {
                            $('#pageLoadingWrapper').removeClass('complete');
                            loadCss("../style/prama.css");
                            loadCss("../script/src/lib/backgrid/lib/backgrid.min.css");
                            loadCss("../script/src/lib/backgrid-filter/backgrid-filter.min.css");
                            loadCss("../app/styles/css/desktop-partial.css");

                            loadCss("../html/Landing.css");
                            requirejs.config(
                                {
                                    paths: {
                                        "device@ui.components": "ui/components/desktop",
                                        "chrome.views": "impl/views/chrome/desktop",
                                        "chrome.templates": "../../templates/chrome/desktop",
                                        "public.chrome": "../../public/templates/desktop",
                                        "targeted": "impl/targeted/desktop",
                                        "router": "impl/routers/ApplicationRouter"
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
                                'core/fc.core',
                                'targeted/ViewManager',
                                'impl/views/HardwareAcceptanceView'
                            ],
                            function (router, auth, headerViewConstructor, footerViewConstructor, translations, core, viewManager, hardwareAcceptanceViewConstructor) {
                                fc.extraOnNewOrg = function(newOrgResponse, newOrg, callback) {
                                    var url = '/web/landing';
                                    var token = sessionStorage.getItem( 'landingToken' );
                                    var tokenType = sessionStorage.getItem( 'landingTokenType' );
                                    if ( token && tokenType ) {
                                        url += "?token=" + token + "&tokenType=" + tokenType;
                                        sessionStorage.removeItem( 'landingToken' );
                                        sessionStorage.removeItem( 'landingTokenType' );
                                    }
                                    window.location = url;
                                };
                                var onResponse = function (response) {
                                    if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                                        $('body').css('overflow', 'hidden');
                                    }
                                    if (response.success) {
                                        if (customStart) {
                                            customStart();
                                        } else {
                                            var setupHeader = function () {
                                                fc.requireConfigured = true;
                                                core.mvc.createPage(
                                                    {
                                                        key: "Landing",
                                                        translationDefaults: {},
                                                        initialize : function () {

                                                            if (core.mvc.view.request.token) {
                                                                auth.getTokenDetails(core.mvc.view.request.token, core.mvc.view.request.tokenType, function (data) {
                                                                    if (data.tokenType == "SharingInvitation" || data.tokenType == "AcceptHardwareTransfer") {
                                                                        viewManager.pageLoadComplete();
                                                                        data.token = core.mvc.view.request.token;

                                                                        var hardwareAcceptanceView = new hardwareAcceptanceViewConstructor({
                                                                            model: data
                                                                        });
                                                                        hardwareAcceptanceView.render();
                                                                    } else {
                                                                        router.start();
                                                                    }
                                                                });
                                                            } else {
                                                                router.start();
                                                            }
                                                        }
                                                    }
                                                );
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
                                auth.featureDisabled(["pramaMobile","SwitchToMobile","NewMobile"], onAuthResponse);
                            }
                        );

                    } else {
                        auth.featureDisabled(["pramaMobile","SwitchToMobile","NewMobile"], onAuthResponse);
                    }


                }
            );
        };
        return start;
    }
);


