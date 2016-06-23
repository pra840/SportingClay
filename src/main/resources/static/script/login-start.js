require(
    [
        'require-configuration'
    ],
    function (configurator) {
        configurator.configure();

        require(
            [
                'core/prama.core',
                'core/prama.core.session',
                'impl/AuthorizationManager',
                '../script/appversion.js?v=' +  new Date().getTime()
            ],
            function (core, session, auth, versioner) {
                var loadCss = function (path) {
                    var link = document.createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = path + "?v=" + versioner.version;
                    document.getElementsByTagName("head")[0].appendChild(link);
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
                    if (!mobileFeatureDisabled && greaterDimension < 900) {
                        mobile = true;
                    }
                    var storedVersionPreference;
                    if (!switchVersionsDisabled) {
                        storedVersionPreference = sessionStorage.getItem("StoredVersionPreference");
                    }
                    if (storedVersionPreference) {
                        mobile = (storedVersionPreference == "mobile");
                    }

                    if (mobile) {
                        loadCss("../style/prama-mobile.css");
                        require(['lib/fastclick'], function (FastClick) {
                            window.addEventListener('load', function() {
                                new FastClick(document.body);
                            }, false);
                        });
                        requirejs.config(
                            {
                                paths: {
                                    "chrome.views": "impl/views/chrome/mobile",
                                    "public.chrome": "../../public/templates/mobile",
                                    "public.templates": "../../public/templates",
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
                                    "chrome.views": "impl/views/chrome/desktop",
                                    "chrome.templates": "../../public/templates/desktop",
                                    "targeted": "impl/targeted/desktop",
                                    "router": "impl/routers/DesktopRouter"
                                }
                            }
                        );
                    }
                    require(
                        [
                            'modules/LoginModule'
                        ],
                        function (loginModuleFunction) {
                            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                                $('body').css('overflow', 'hidden');
                               /* var viewportmeta = document.querySelector('meta[name="viewport"]');
                                if (viewportmeta) {
                                    viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
                                    document.body.addEventListener('gesturestart', function () {
                                        viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
                                    }, false);
                                }*/
                            }
                            var loginModule = loginModuleFunction();
                            loginModule.initialize();

                        }
                    );
                };
                auth.featureDisabled(["pramaMobile","SwitchToMobile"], onAuthResponse)
            }
        );

    }
);


