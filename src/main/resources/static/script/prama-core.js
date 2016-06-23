//setup ajax
$.ajaxSetup({
    timeout: 1000000,
    contentType: "application/x-www-form-urlencoded; charset=UTF-8"
});
//clear out session
// sessionStorage.removeItem("prama.headerDetails");

if (localStorage.getItem("testmode") || 'false' == 'true') {
}

$(window).bind('beforeunload', function () {
    prama.abortServices();
});

if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
(function (prama, $, undefined) {
    //public properties and functions
    var useTestServer = false;
    var runInTestMode = false;

    var voiceCommands = {
    };

    var commandPrefixes = {
    };
    prama.registerVoiceCommands = function(commands) {
        $.extend(voiceCommands, commands);
    }
    prama.registerVoiceCommandPrefix = function (prefix, validator) {
        commandPrefixes[prefix] = validator;
    }
    prama.processVoiceCommand = function() {
        var command = $('#speechInput').val();

        var runVoiceCommand = function(cmd) {
            var raw = cmd;
            cmd = cmd.replace(/\s/g, '');
            cmd = cmd.toLowerCase();
            if (voiceCommands.hasOwnProperty(cmd)) {
                var toExecute = voiceCommands[cmd];
                toExecute();
                return true;
            }
            $.each(commandPrefixes,
                function (prefix, toExecute) {
                    if (cmd.indexOf(prefix) > -1) {
                        toExecute(cmd.replace(prefix, ''), raw);
                        return true;
                    }
                }
            );
            return false;
        };
        var setStatus = function (status) {
            $('#speechStatus').text(status);
        };
        setStatus("processing command");
        var setSuccessStatus = function () {
            setStatus("command processed");
            window.setTimeout(300,
                function () {
                   setStatus("waiting for your command");
                });
        }
        if (runVoiceCommand(command)) {
            setSuccessStatus();
            return;
        } else {
            setStatus("looking for match");
            var request = {
                voiceText: command
            }
            var onResponse = function(response) {
                if (response.success) {
                    if (runVoiceCommand(response.data.command)) {
                        setSuccessStatus();
                    } else {
                        setStatus("command not recognized");
                    }
                }
            }
            prama.getWithData("VoiceNavigation", request, onResponse);
        }
    }

    prama.autoLoad = true;


    prama.forceTestMode = function (val) {
        runInTestMode = val;
    };

    prama.getHeaderDetails = function() {
        require(['/script/src/core/prama.core.session.js'], function(session){
            prama.session = session;
            if (!isPublicPage) {
                var headerUrl = "../web/getHeader";
                var headerUrlKey = "GetHeaderDetails";

                serviceUrls[headerUrlKey] = headerUrl;

                var onServerResponse = function (response) {
                    prama.getHeaderResponse = response;
                    prama.session.set('prama.headerDetails', response);

                    prama.loadTemplates(prama.setupHeaderEvents);
                };
                prama.get(headerUrlKey, onServerResponse, { "pageKey": "Common" });
            } else {
                prama.loadTemplates(prama.setupHeaderEvents);
            }
        });
    };

    prama.setupHeaderEvents = function(){
        if (sessionStorage.getItem("DemoMode") === 'true') {
            $('#demoModeIndicator').show();
        } else {
            $('#demoModeIndicator').hide();
        }

        $('#actionLogout').click(
            function () {
                $('#userWelcome').csOptionShower("close");
                if (typeof(prama.demoServer) != "undefined") {
                    prama.demoServer.logout();
                }
                sessionStorage.setItem('DemoMode',false);
                /* the session keys below should be cleared by server when the user signs out */
                // prama.session.clear('selectedGraphFilters');
                // prama.session.clear('cardGraphSeen');
                window.location = "../web/logout";
            }
        );
        $('#actionPreferences').click(function () { Common.UserPreferences(); });
        $('#actionOrgPreferences').click(
            function () { prama.navigate("OrgPreferences"); }
        );
        prama.disableForDemo([
            { containerSelector: "#actionOrgPreferences", hide: true }
        ]);
        $('#userWelcome').csOptionShower({ container: $('#userWelcomeOptions'), restyleOnHover: false });
        $('#actionHelp a').click(function () { prama.showHelp(); });

    }

    prama.loadTemplates = function(callback) {
        var totalTemplates = $('.template').length;
        var loadedTemplates = 0;
        var afterLoad = function (data) {

        }
        $('.clipped').on("mouseenter", function () {
            var clipped = $(this);
            var text = clipped.text().replace(/\s+/g," ");

            //todo: temporary hack to disable tooltip on landing page probe cards.
            // need to modify this code so all clipped attr get "new tooltip"
            if(!$(this).hasClass("zone-title") && !$(this).hasClass("gateway-status")){
                var currentTitleTag = clipped.attr('title');
                if (!currentTitleTag || currentTitleTag != text) {
                    clipped.attr('title', text);
                }
            }
        });
        var templates = $('.template');
        templates.each(
            function (index, element) {
                var url = $(element).attr("data-url");
                url += "?v=" +  new Date().getTime();
                $.ajax(url,
                    {
                        success: function (data) {
                            loadedTemplates++;
                            var afterLoad = $(element).attr('data-after-replace');
                            $(element).replaceWith(data);
                            if (afterLoad) {
                                eval(afterLoad);
                            }
                            if (loadedTemplates == totalTemplates) {
                                if(callback){
                                    callback();
                                }
                                prama.reloadPage();
                            }
                        },
                        dataType: "html",
                        error: function (a, b, c) {
                            //this should only happen when running locally
                            loadedTemplates++;
                            if (loadedTemplates == totalTemplates) {
                                prama.reloadPage();
                            }
                        }
                    }
                );
            }
        );
        if (totalTemplates === 0) {
            prama.reloadPage();
        }
    };

    prama.currentLanguage = function () {
        var lang = ( navigator.languages ?
                     navigator.languages[0] :
                     ( navigator.language || navigator.userLanguage ) );
        return lang.toLowerCase();
    };

    prama.pageContext = {};
    prama.getHeaderResponse;

    //private properties
    var translations = null;
    var loadFunction = null;
    var globalPageTranslationDefaults = null;
    var serviceUrls = {};
    var isPublicPage = false;
    var isSupportPage = false;

    prama.pageKey = null;

    prama.unusedTranslations = [];
    prama.missingTranslations = [];

    prama.setTranslationsDictionary = function (data) {
        translations = data;
        $.extend(prama.unusedTranslations, data);
    };

    var additionalScriptToRunWhenLoading = [];
    prama.addScriptToRunWhenLoading = function (script) {
        additionalScriptToRunWhenLoading.push(script);
    }

    prama.selectedNavigationKey = "";
    prama.options;

    var commonServiceUrls = {
        "GetCountryList": "../web/GetCountryList",
        "GetCountryListForEula": "../public/getEULACountries",
        "AddOrganization": "createOrganization",
        "Login": "../web/login",
        "GetCountryDropDown":"../web/GetCountryDropDown"
    };

    prama.registerServices = function(urlObj) {
        $.extend(serviceUrls, urlObj);
    };

    prama.registerPart = function (partServiceUrls) {
        $.extend(serviceUrls, partServiceUrls);
    };
    prama.registerPage = function (key, translationDefaults, onLoadFunction, pageServiceUrls, selectedNavKey, extraOptions) {
        var options = {
            isPublic: false,
            isSupport: false
        }
        if (extraOptions) {
            $.extend(options, extraOptions);
        }
        if (pageServiceUrls) {
            $.extend(serviceUrls, pageServiceUrls);
        }
        if (options.isPublic) {
            isPublicPage = true;
        }
        if (options.isSupport) {
            isSupportPage = true;
        }
        prama.options = options;
        prama.pageKey = key;

        globalPageTranslationDefaults = $.extend(translationDefaults, globalTranslations);
        prama.selectedNavigationKey = selectedNavKey;
        if (options.headerNavKey) {
            prama.headerNavKey = options.headerNavKey;
        }
        if (onLoadFunction) {
            loadFunction = onLoadFunction;
        }
    };

    prama.reloadPage = function () {
        if (prama.skipLoad) { return; }

        if (prama.beforePageLoad) {
            prama.beforePageLoad();
        } else {
            prama.continuePageLoad();
        }
    }

    prama.loadScript = function(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        var done = false;
         // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
               done = true;
               if (callback) {
                  callback();
                }
               // Handle memory leak in IE
               script.onload = script.onreadystatechange = null;
            }
         };
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    prama.disabledForDemo = [
        { containerSelector: "#actionHelp", remove: true }
    ];
    prama.disableForDemo = function (items) {
        if (!prama.disabledForDemo) { prama.disabledForDemo = []; }
        prama.disabledForDemo.push.apply(prama.disabledForDemo, items);
        prama.checkDemo();
    };
    prama.showVoiceNav = false;
    prama.continuePageLoad = function () {
        var finalPageLoad = function () {
            var speechUtil = document.getElementById('speechInput');
            if(speechUtil && (speechUtil.onwebkitspeechchange || speechUtil.onspeechchange))
            {
                if (!prama.featureDisabled("VoiceNavigation") && prama.showVoiceNav) {
                    $('#speechNavigation').show();
                }
            }
            setupTextboxes();
            setupFilterBoxes();
            setupSearchBoxes();
            prama.setupDateTimeBoxes();
            $('body').show();
            // $('#viewport').show();
            $.each(additionalScriptToRunWhenLoading,
                function (item, script) {
                    script();
                }
            );
            if (loadFunction) {
                loadFunction();
            }
            if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
                $('body').css('overflow', 'hidden');
               /* var viewportmeta = document.querySelector('meta[name="viewport"]');
                if (viewportmeta) {
                    viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
                    document.body.addEventListener('gesturestart', function () {
                        viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
                    }, false);
                }*/
            }
            prama.checkDemo();
        };

        var setupHeader = function () {
            // $('#content').show();
            prama.waitMaskOn();
            if (isPublicPage) {
                finalPageLoad();
            } else {
                var response = prama.getHeaderResponse;
                var continueWithLoad = true;
                if (response.success) {
                    if (isSupportPage || response.data.selectedOrganizationId && response.data.agreementAccepted) {
                        sessionStorage.removeItem( 'landingToken' );
                        sessionStorage.removeItem( 'landingTokenType' );
                        prama.setupHeader(response);
                    } else {
                        if (!response.data.selectedOrganizationId &&
                                (!response.data.organizations || response.data.organizations.length < 1) &&
                                !response.data.superUser ) {
                            // this user is not authorized to any organizations
                            var afterAlert = function() {
                                sessionStorage.removeItem( 'landingToken' );
                                sessionStorage.removeItem( 'landingTokenType' );
                                window.location = "../public/login.htm";
                            };
                            prama.pageLoadComplete();
                            prama.alert(prama.translation("Msg_NotAuthorized"), prama.translation("NotAuthorizedTitle"), afterAlert);
                            return;
                        }
                        continueWithLoad = false;
                        var orgSelectorConfig = {
                            username: response.data.userName,
                            isSuperUser: response.data.superUser,
                            showSupportLink: response.data.superUser,
                            allowExit: false,
                            organizations: response.data.organizations,
                            showLoadingAfterClose: true
                        };
                        if (!response.data.selectedOrganizationId) {
                            orgSelectorConfig.skipToEula = false;
                        } else {
                            if (response.data.rights && !response.data.rights.canAcceptAgreement) {
                                var afterAlert = function() {
                                    window.location = "../web/logout";
                                };
                                $('#content').remove();
                                prama.pageLoadComplete();
                                prama.alert(prama.translation("EULANotAccepted"), prama.translation("EULANotAcceptedTitle"), afterAlert);
                                return;
                            }
                            orgSelectorConfig.skipToEula = true;
                        }
                        var afterSuccess = function(newOrgResponse, newOrg) {
                            var initialResponse = response;
                            var finishSetup = function (headerResponse) {
                                prama.setupHeader(headerResponse);
                                finalPageLoad();
                            };
                            var finishLater = false;
                            if (newOrgResponse) {
                                $.extend(true, initialResponse, newOrgResponse);
                                if (newOrg) {
                                    initialResponse.orgName = newOrg.name;
                                    if (prama.extraOnNewOrg) {
                                        finishLater = true;
                                        var afterExtra = function () {
                                            finishSetup(initialResponse);
                                        };
                                        prama.extraOnNewOrg(newOrgResponse.data, newOrg, afterExtra);
                                    }
                                }
                            }
                            if (!finishLater) {
                                finishSetup(initialResponse);
                            }
                        };
                        prama.showOrgSelector(orgSelectorConfig, afterSuccess);
                    }
                };
                if (continueWithLoad) {
                    finalPageLoad();
                }
            }
        };
        serverGetTranslations(prama.pageKey, globalPageTranslationDefaults, setupHeader);
    };

    prama.navigate = function (key, additionalParams) {
        if (!prama.Paths) {
            alert("Application Configuration is missing: Paths not found.");
        }
        if (!prama.Paths[key]) {
            alert("Application Configuration is missing the key: " + key);
        }
        window.location = prama.Paths[key].url + "?_=" + new Date().getTime() + (additionalParams || '');
    }
    prama.createLookup = function(collection, property) {
        var item, key, lookup = {};
        for (var i = 0, len = collection.length; i < len; i++) {
            item = collection[i];
            key = item[property];
//            if (lookup.hasOwnProperty(key)) {
//                throw "duplicate keys are not allowed: " + key;
//            }
            lookup[key] = item;
        }
        return lookup;
    }
    prama.translation = function (key) {
        if(translations){
            var value = translations[key];
        }
        if (!value) {
            if (errorOnMissingTranslation) {
                value = "Translation Missing: " + key;
                prama.addOrRefreshInCollection(prama.missingTranslations, { key: key }, "key") ;
            } else {
                if (prama.translationDefault) {
                    value = prama.translationDefault[key];
                    if (!value) {
                        value = key;
                    }
                }
            }
        }

        delete prama.unusedTranslations[key];

        return value;
    }

    prama.showTemporarily = function (item, seconds) {
        $(item).show();
        window.setTimeout(function () {
            $(item).hide();
        }, 1000 * seconds);
    };
    prama.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    prama.isString = function (obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    prama.logError = function (level, message, details) {
        prama.alert(prama.translation("Err_Log") + message);
    };
    prama.queueCode = function (theFunction) {
        window.setTimeout(theFunction, 0);
    };

    prama.compileErrorMessages = function (response) {
        var messageText = null;
        if (!response) { return; }
        if (response.messages && response.messages.length > 0) {
            messageText = "";
            for (var i = 0; i < response.messages.length; i++) {
                messageText += response.messages[i].message;
            }
            if (messageText.length == 0) {
                messageText = prama.translation("Err_Unknown") + ": message missing";
            }
        } else {
            if (!response.success) {
                messageText = prama.translation("Err_Unknown");
            }
        }
        return messageText;
    }
    prama.handleResponseMessages = function (response) {
        var messageText = prama.compileErrorMessages(response);
        if (messageText) {
            $('.wait-div-wrapper').hide();
            prama.showNotification(messageText);
        }
    };
    prama.onlyContainsNumbers = function (entry) {
        if (entry === "") return true;
        var RE = new RegExp("\^[0-9]+$");
        return (RE.test(entry));
    };
    prama.isDecimal = function (entry) {
        if (entry === "") return true;
        var RE = new RegExp("\^[0-9]+\.?[0-9]*$");
        return (RE.test(entry));
    };
    prama.runBatch = function (services, callback) {
        if (prama.batchRunner) {
            prama.batchRunner(services, callback);
        } else {
            //default: runs all services at once
            var servicesToRun = services.length;
            var servicesReturned = 0;
            var context, options;
            var responseMaker = function (runner) {
                return function (response) {
                    runner.callback(response);
                    servicesReturned++
                    if (servicesReturned === servicesToRun) {
                        callback();
                    }
                };
            };
            for (var i = 0; i < services.length; i++) {
                var serviceRunner = services[i];
                context = serviceRunner.buildContext ? serviceRunner.buildContext() : null;
                options = serviceRunner.options;
                options.context = context;
                prama.ajax(
                    serviceRunner.serviceKey,
                    serviceRunner.buildRequest(),
                    responseMaker(serviceRunner),
                    options
                );
            }
        }
    };
    prama.get = function (url, callback, options) {
        if (Object.prototype.toString.call(callback) !== "[object Function]") {
            //new parameters
            prama.ajax(url, callback, options);
        } else {
            prama.ajax(url, null, callback, options);
        }
    };
    prama.getWithData = function (url, data, callback, options) {
        prama.ajax(url, data, callback, options);
    }
//TODO: remove send
    prama.send = function (url, data, callback, options) {
        prama.ajax(url, data, callback, options);
    }
    prama.post = function (urlKey, data, callback, options) {
        if (!options) {
            options = {};
        }
        options.verb = "POST";
        prama.ajax(urlKey, data, callback, options);
    }
    var pageScriptsSetup = false;
    prama.serviceLog = {};
    prama.serviceQueue = [];
    prama.clearServiceFromQue = function(request) {
        if (prama.serviceQueue.length) {
            prama.serviceQueue.removeById(request.id);
        }
    }
    prama.abortServices = function() {
            for (var i = 0; prama.serviceQueue.length > i; i++) {
                prama.serviceQueue[i].abort();
            }
    }
    var contextualizeUrl = function(url, context) {
        var pattern = /\{(\w+)\}/g;
        url = url.replace(pattern, function (match, key) {
            if (!context[key]) {
                // alert("prama-core | Developer Error: URL context-key '" + key + "' cannot be found in context data.");
                if (window.console) {
                    window.console.log("prama-core | Developer Error: URL context-key " + key + " cannot be found in context data.");
                }
                return "";
            }
            return context[key];
        });
        return url;
    };
    prama.ajax = function (urlKey, data, callback, options) {
        if (!options) {
            options = {};
        }

        if (typeof(prama.demoServer) != "undefined" && !options.skipDemoServer) {
            if (prama.demoServer.handleUrl(urlKey)) {
                prama.demoServer.ajax(urlKey, data, callback, options);
                return;
            }
        }

        if (options.pageKey == "Common") {
            $.extend(serviceUrls, commonServiceUrls);
        }

        var url = (serviceUrls) ? serviceUrls[urlKey] : urlKey;
        // backwards compatibility
        if (!url) {
            url = urlKey;
        }

        var additionalContext = options && options.context ? options.context : {};
        var contextOptions = prama.header;
        var context = $.extend({}, (contextOptions ? contextOptions : {}), additionalContext);
        url = contextualizeUrl(url, context);

        var dataForRequest = data;
        var global;
        if (options && options.onAjaxError) {
            global = false;
        } else {
            global = true;
        }
        var defaultVerb = "GET";
        if (!options.verb) {
            options.verb = defaultVerb;
        }

        if (prama.urlBuilder) {
            var pageKey = options.pageKey ? options.pageKey : prama.pageKey;
            url = prama.urlBuilder(pageKey, urlKey, dataForRequest, options, prama.serviceQueue.length);
        }
        var postfix = "";
        if (url.indexOf("?") == -1) {
            postfix = "?";
        } else {
            postfix = "&";
        }
        postfix += "v="+ new Date().getTime();
        url += postfix;
        var request = $.ajax({
            url: url,
            dataType: 'json',
            type: options.verb,
            data: dataForRequest,
            success: function (responseData, textStatus, jqXHR) {
                prama.clearServiceFromQue(jqXHR);

                // Do something here
                if (!responseData && options && options.onAjaxError) {
                    //an error occurred
                    options.onAjaxError(jqXHR, textStatus);
                }
                if (responseData && responseData.sessionExpired) {
                    $('.wait-div-wrapper').hide();
                    prama.alert(prama.translation("Msg_WebSessionExpired"), prama.translation("SessionExpiredTitle"),
                        function () {
                            prama.pageReload();
                        });
                    return;
                }

                if (options && options.onResponseMessage) {
                    options.onResponseMessage(responseData);
                } else {
                    prama.handleResponseMessages(responseData);
                }
                if (callback) {
                    callback(responseData);
                }

            },
            cache: false,
            global: global,
            error: function (jqXHR, textStatus, errorThrown) {
                prama.clearServiceFromQue(jqXHR);
                //if the user's login session expires, the authentication provider will step in and redirect
                //  to the login page -- the browser will follow this redirect notice and return the login page
                //  as the ajax response (which will cause the call to fail since we have specified the dataType
                //  as 'json'
                var contentType = jqXHR.getResponseHeader("Content-Type");
                var isHtmlContent = ( contentType.toLowerCase().indexOf( "text/html" ) >= 0 );
                if ( jqXHR.status === 200 && isHtmlContent ) {
                    // assume that our login has expired, navigate to login
                    window.location = "../web/logout";
                    return;
                }

                if (options && options.onAjaxError) {
                    options.onAjaxError(jqXHR, textStatus, errorThrown);
                } else {
                    $( '.wait-div-wrapper' ).hide();
                    if ( jqXHR.status === 500 && isHtmlContent ) {
                        prama.alert( jqXHR.responseText );
                    } else {
                        prama.alert( prama.translation( "Err_Request" ) + url + ", " + jqXHR.responseText + ", " + errorThrown );
                    }
                }
                callback({ success: false });
            },
            complete: function () {

            }
        });

        request.id = parseInt(prama.serviceQueue.length + 1);
        prama.serviceQueue.push(request);

        return request;
    };
    prama.getQueryString = function () {
        var result = {}, queryString = location.search.substring(1),
            re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        return result;
    };
    prama.header = null;
    prama.setCookie = function (name, value, expireInNumberOfDays) {
        var expires = "";
        if (expireInNumberOfDays) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + expireInNumberOfDays)
            expires = "; expires=" + expireDate.toGMTString();
        }
        document.cookie = name + "=" + value + expires;
    };
    prama.getCookie = function (name) {
        var cookieString = document.cookie;
        var cookies = cookieString.split(';');
        var cookieValue = null;
        $.each(cookies,
            function (index, value) {
                var parts = value.split("=");
                if (parts.length === 2 && $.trim(parts[0]) === name) {
                    cookieValue = parts[1];
                }
            }
        );
        return cookieValue;
    };
    prama.pageReload = function() {
        if (prama.options && prama.options.pageReload) {
            prama.options.pageReload();
        } else {
            prama.waitMaskOn();
            window.location.reload(false);
        }
    };
    prama.setupHeader = function (headerWrapper) {
        var header = headerWrapper.data;
        header.disabledFeatures = headerWrapper.disabledFeatures || headerWrapper.data.disabledFeatures;
        if (header.userName) {
            prama.header = header;
            prama.session.set("prama.headerDetails", JSON.stringify(header));
            var textSpan = $('#userWelcome').find('.ui-button-text');
            if (!textSpan) {
                textSpan = $('#userWelcome');
            }

            textSpan.text(prama.translation("WelcomeMsg").format(header.userName));
            var container = $('#userWelcomeOptions');
            if(prama.header.orgName) {
                $('#actionOrgPreferences').show();
                $('#actionPreferences').show();
            } else {
                $('#actionOrgPreferences').hide();
                $('#actionPreferences').hide();
            }
            $('#userWelcome').find('.ui-button-text').attr("automation-id", "userWelcome-ui-button-text");
            $('#userWelcome').find('.ui-button-icon-secondary').attr("automation-id", "userWelcome-ui-button-icon-secondary");

            if (header.disabledFeatures && $.inArray("NewMobile", header.disabledFeatures) > -1) { // 'NewMobile' is disabled
                $('#lnkMobileWebsite').show();
            }

            if (header.orgName) {
                container.find('.header-org-label').remove();
                container.find('.header-org-display').remove();
                container.find('.header-org-switch').remove();
                var orgLabel = "<span class='header-org-label'>" + prama.translation("SelectedOrganization") + "</span>";
                var orgDisplay = $("<div class='header-org-display rounded clipped' automation-id='actionOrgName'>" +
                    header.orgName +
                    "</div>");
                var showSwitchOrgLink = header.superUser || (header.organizations && (header.organizations.length > 1));
                if (!prama.featureDisabled("SwitchOrg") && showSwitchOrgLink) {
                    var switchOrg = $("<a class='header-org-switch' automation-id='actionSwitchOrg'>" + prama.translation('SwitchOrgTitle') + "</a>");
                    container.prepend(switchOrg);
                    switchOrg.click(
                        function() {
                            prama.waitMaskOn();
                            var config = {
                                allowExit: true,
                                showLoadingAfterClose: false
                            };
                            var afterSuccess = function(newOrgResponse, newOrg) {
                                if (newOrg) {
                                    if (prama.extraOnNewOrg) {
                                        prama.extraOnNewOrg(newOrgResponse.data, newOrg, prama.pageReload);
                                    } else {
                                        prama.pageReload();
                                    }
                                }
                            };
                            prama.showOrgSelector(config, afterSuccess);
                        }
                    );

                }
                container.prepend(orgDisplay);
                container.prepend(orgLabel);
                orgDisplay.find('.header-org-text').addClass('clipped ');
            } else {
                var orgLabel = "<span class='header-org-label'>" + prama.translation("OrgNotSelectedText") + "</span>";
                container.prepend(orgLabel);
            }
            var headerTabs = [];

            if (prama.initNav) {
                prama.initNav();
            }

            if (header.disabledFeatures) {
                $("[data-feature]").each(
                    function (index, featureBlock) {
                        featureBlock = $(featureBlock);
                        if (prama.featureDisabled(featureBlock.attr('data-feature'))) {
                            featureBlock.remove();
                        }
                    }
                );
            }


        }
    };
    prama.featureDisabled = function (featureKey) {
        return (prama.header.disabledFeatures && $.inArray(featureKey, prama.header.disabledFeatures) > -1);
    };
    prama.changeOrganization = function (org) {
        var request = { organizationId: org.id, organizationName: org.name };
        var onServerResponse = function (response) {
            if (response.success) {
                window.location = response.data.successUrl;
            };
            finalPageLoad();
        };
        prama.post("SelectOrganization", request, onServerResponse);
    }
    prama.compareByName = function (a, b) {
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        if (nameA < nameB) { return -1 }
        if (nameA > nameB) { return 1 }
        return 0;
    };
    prama.showNotification = function (message, isError) {
        $('body').show();
        var callback = function(){
            if (message.indexOf("ERROR 500:") > -1){
                window.location = "../web/logout";
            }
        }
        prama.info(message, null, callback);
    };
    prama.confirm = function (callback, message, title, automationId, options) {
        var confirmOptions = {
            hideCloseInHeader: true
        };
        if (options){
            confirmOptions = $.extend({}, options, confirmOptions);
        }

        if (!title) {
            title = prama.translation("Confirm");
        }
        var dialogButtons = [
            {
                key: "Cancel",
                action: function() {
                    callback(false);
                }
            },
            {
                key: "Yes",
                action: function() {
                    callback(true);
                },
                primary: true
            }
        ];
        prama.info(message, title, null, dialogButtons, confirmOptions, automationId);
    };
    prama.alertActive;
    prama.alert = function (message, title, callback) {
        prama.alertActive = true;
        var alertCallback = function(){
            prama.alertActive = false;
            if (callback) {
                callback();
            }
        };
        prama.info(message, title, alertCallback);
    };

    prama.infoDialog;
    prama.info = function(message, title, callback, buttons, dialogOptions, automationId) {
        if (!title) {
            title = prama.translation("Alert");
        }

        var infoDialog;
        if (!prama.infoDialog) {
            infoDialog = $(".info-dialog");
        } else {

            infoDialog = prama.infoDialog;
        }
        var infoMessage = infoDialog.find('.info-message');
        infoMessage.html(message);
        if (automationId) {
            infoMessage.attr("automation-id", automationId + "Message");
        } else {
            infoMessage.attr("automation-id", title + "Message");
        }
        var dialogHeight = 295;
        var options = {
                title: title,
                width: 275,
                height: dialogHeight,
                modal: true,
                close: function(){
                    infoMessage.css('max-height', '');
                    if (callback) {
                        callback();
                    }
                },
                resizable: false
            };
        if (dialogOptions){
            options = $.extend({}, options, dialogOptions);
        }
        infoDialog.csDialog(options);

        var footer = infoDialog.find('.cs-dialog-footer').html("");
        if (buttons) {
            $.each(buttons, function(index, button){
                var buttonElement = $("<div>" + prama.translation(button.key) + "</div>");
                buttonElement.attr("automation-id", button.key);
                footer.append(buttonElement);
                buttonElement.csButton().click( function(){
                    infoDialog.csDialog('close');
                    if (button.action){
                        button.action();
                    }
                });
                if (button.primary){
                    buttonElement.addClass('yellow');
                }
            });
        } else {
            var closeButton = $('<div>' + prama.translation('CloseAction') + '</div>');
            closeButton.attr("automation-id", prama.translation('CloseAction'));
            footer.append(closeButton);
            closeButton.csButton().click(function(){
                infoDialog.csDialog('close');
            });
        }
        
        // ensure defaults
        var dialog = infoDialog.parent('.ui-dialog-content');
        infoMessage.css('max-height', '');
        dialog.css('height', dialogHeight - 10);

        // handle long messages
        if (infoMessage.get(0).scrollHeight > infoMessage.outerHeight()){
            var heightDifference = infoMessage.get(0).scrollHeight - infoMessage.outerHeight();
            dialog.css('height', parseInt(dialog.css('height')) + heightDifference);
            infoMessage.css('max-height', 'inherit');
        };

        prama.infoDialog = infoDialog;
    }
    // OLD: used for SupportLanding page.
    prama.askUser = function (message, title, buttons) {
        var confirmDialog = $("<div id='dialog-askuser' title='" + title + "'><p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>"
            + message + "</p></div>");
        confirmDialog.dialog({
            resizable: false,
            height: 250,
            width: 400,
            modal: true,
            buttons: buttons
        });
    };
    prama.mimicDateFromMillisUTC = function (millis) {
        if (!millis) { return null; }
        var d = new Date(millis);
        var mimicDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
        return mimicDate;
    };
    prama.formatDateTimeFromMillisUTC = function (millis) {
        if (!millis) { return ''; }
        return prama.formatDateTime(prama.mimicDateFromMillisUTC(millis));
    };
    prama.formatDateFromMillisUTC = function (millis) {
        if (!millis) { return ''; }
        return prama.formatDate(prama.mimicDateFromMillisUTC(millis));
    };
    prama.formatDateTimeFromMillis = function (millis) {
        if (!millis) { return ''; }
        return prama.formatDateTime(new Date(millis));
    };
    prama.formatDateTime = function (d) {
        return padToTwo((d.getMonth() + 1)) + "-" + padToTwo(d.getDate()) + "-" +
            d.getFullYear() + " " + padToTwo(d.getHours()) + ":" + padToTwo(d.getMinutes());
    };
    prama.formatTime = function (d) {
        var minutes = d.getMinutes();
        var hours = d.getHours();
        var meridiem = "AM";
        if (hours >= 12) {
            meridiem = "PM";
            if (hours > 12) {
                hours = hours - 12;
            }
        }else if (hours == 0){
            hours = 12;
        }
        return hours + ":" + padToTwo(minutes) + " " + meridiem;
    };
    prama.formatTimeFromMillis = function (millis) {
        if (!millis) { return ''; }
        return (prama.formatTime(prama.mimicDateFromMillisUTC(millis)));
    };
    prama.formatDateFromMillis = function (millis) {
        if (!millis) { return ''; }
        return prama.formatDate(new Date(millis));
    };
    prama.formatDate = function (d) {
        return padToTwo((d.getMonth() + 1)) + "-" + padToTwo(d.getDate()) + "-" +
            d.getFullYear();
    };
    prama.dateFromFormat = function (s) {
        var dateAndTime = s.split(" ");
        var dateParts = dateAndTime[0].split('-');
        var timeParts;
        if (dateAndTime.length == 2) {
            timeParts = dateAndTime[1].split(':');
        } else {
            timeParts = "00:00".split(':');
        }
        var d = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1], 0, 0);
        return d;
    };
    prama.smartGetDate = function (date) {
        if (Object.prototype.toString.call(date) === "[object Date]") {
            return date;
        }
        if (prama.onlyContainsNumbers(date)) {
            //from millis
            return new Date(date);
        } else {
            //from common format
            return prama.dateFromFormat(date);
        }
    };
    prama.dateIsToday = function (inDate) {
        var today = new Date();
        today = today.setHours(0, 0, 0, 0);
        checkDate = inDate.setHours(0, 0, 0, 0);
        return today == checkDate;
    };
    prama.dateIsInRange = function (inDate, inStart, inEnd) {
        var date = prama.smartGetDate(inDate);
        var start = prama.smartGetDate(inStart);
        var end = prama.smartGetDate(inEnd);
        if (date < end && date > start) {
            return true;
        }
        return false;
    };
    function padToTwo(number) {
        return (number < 10 ? '0' : '') + number
    };
    prama.removeFromCollectionByProperty = function (collection, testItem, key) {
        if (!testItem.hasOwnProperty(key)) {
            throw "removeFromCollectionByProperty requires a key that exists on the passed in testItem";
        }
        var item = prama.findItemByPropertyValue(collection, key, testItem[key]);
        var index = $.inArray(item, collection);
        if (index != -1) collection.splice(index, 1);
    }

    prama.addOrRefreshInCollection = function (collection, item, key) {
        if (!item.hasOwnProperty(key)) {
            throw "addOrRefreshInCollection requires a key that exists on the passed in item";
        }
        var existing = prama.findItemByPropertyValue(collection, key, item[key]);
        if (existing) {
            $.extend(existing, item);
        } else {
            collection.push(item);
        }
    }

    prama.isFunction = function (check) {
        var getType = {};
        return check && getType.toString.call(check) == '[object Function]';
    };

    prama.pageParts = [];
    prama.registerPagePart = function (part) {
        prama.pageParts.push(part);
        $.extend(serviceUrls, part.serviceUrls);
    }
    prama.loadPagePart = function (part, afterPartLoaded) {

        require(
            ['../script/appversion.js?v=' +  new Date().getTime()],
            function (versionHolder) {
                var cacheBuster = "?v=" + versionHolder.version;

                var div = $("<div id='" + part.partKey + "'></div>");

                var existingPart = $('#' + part.partKey);
                if (existingPart && existingPart.length) { // check if part already exists
                    existingPart.replaceWith(div);
                } else {
                    $('#parts').append(div);
                }
                var afterHtmlLoad = function () {
                    if (!part.useCommonTranslations && prama.retrieveTranslations) {
                        var u_PageTranslations =
                            translationUrl ? translationUrl : url_PageTranslations + "?screenName=UI_" + part.partKey;
                        var responseHandler = function (response) {
                            if (response && response.success) {
                                $.extend(translations, response.data.translations);
                                prama.populateTranslations(div);
                                afterPartLoaded();
                            }
                        };
                        prama.ajax(u_PageTranslations, null, responseHandler,
                            {
                                onResponseMessage: function (data) {
                                    if (!data.success) {
                                        $.extend(translations, part.translations());
                                        prama.populateTranslations(div);
                                        afterPartLoaded();
                                    }
                                }
                            }
                        )
                    } else {
                        if (part.translations) {
                            $.extend(translations, part.translations());
                        }
                        prama.populateTranslations(div);
                        afterPartLoaded();
                    }
                };
                var afterCssLoad = function() {
                    div.load(part.htmlPath+cacheBuster, afterHtmlLoad);
                };
                if (part.css) {
                    var url = "../html/parts/" + part.css + ".css" + cacheBuster;
                    //$('head').append("<link rel='stylesheet' type='text/css' href='../html/parts/" + part.css + ".css' />");
                    //var url = 'urlOfStyleSheet.css'
                    if(document.createStyleSheet) {
                        try { document.createStyleSheet(url); } catch (e) { }
                    }
                    else {
                        var css;
                        css         = document.createElement('link');
                        css.rel     = 'stylesheet';
                        css.type    = 'text/css';
                        css.media   = "all";
                        css.href    = url;
                        document.getElementsByTagName("head")[0].appendChild(css);
                    }
                    afterCssLoad();
                } else {
                    afterCssLoad();
                }
            }
        );
    };

    var translationUrl;

    prama.setTranslationUrl = function (url) {
        translationUrl = url;
    };

    var url_PageTranslations = "../public/translations";
    prama.translationDefault = null;
    var errorOnMissingTranslation = false;
    prama.setErrorOnMissingTranslation = function (val) {
        errorOnMissingTranslation = val;
    }
    prama.retrieveTranslations = true;
    function serverGetTranslations(pageKey, defaults, callback) {
        if (!prama.retrieveTranslations || !pageKey) {
            setTranslations(defaults);
            if (callback) {
                callback();
            }
            return;
        }
        prama.translationDefaults = defaults;
        var u_PageTranslations =
            translationUrl ? translationUrl : url_PageTranslations + "?screenName=UI_common,UI_" + pageKey;

        var responseHandler = function (response) {
            //prama.alert(JSON.stringify(response.data.translations));
            if (response && response.success) {
                setTranslations(response.data.translations);
                if (callback) {
                    callback();
                }
            }
        };

        var request = prama.ajax(u_PageTranslations, null, responseHandler,
            {
                onResponseMessage: function (data) {
                    if (!data.success) {
                        setTranslations(defaults);
                        if (callback) {
                            callback();
                        }
                    }
                },
                skipDemoServer: true
            }
        );
    }
    prama.extendTranslations = function(newTranslations){
        $.extend(translations, newTranslations);
    }
    prama.populateTranslations = function (container) {
        if (!container) {
            container = $(document);
        }
        container.find('[data-res-id]').each(
            function (index, value) {
                var translation = prama.translation($(value).attr('data-res-id'));
                if ($(value).is('input')) {
                    $(value).val(translation);
                } else {
                    $(value).html(translation);
                }
            }
        );
        container.find('[data-placeholder-res-id]').each(
            function (index, value) {
                var translation = prama.translation($(value).attr('data-placeholder-res-id'));
                $(value).attr("placeholder", translation);
            }
        );
    }
    function setTranslations(data) {
        prama.setTranslationsDictionary(data);
        prama.populateTranslations();
        if (data["PageTitle"]) {
            document.title = data["PageTitle"];
        }
        $('#footerCopyright').html(prama.translation("Copyright").format("\251",new Date().getFullYear()))
        //once this is done we can finish setting up the page

        // The footer was showing unstyled b/c the stylesheet was not added.
        // This checks the `content` property on #footer in prama.css;
        var totalWaitTime = 2000;
        var attemptInterval = 50;
        var attempts = totalWaitTime / attemptInterval;
        var showFooterTimeout = 0;
        var $footer = $('#footer');

        var showFooter = function(){
            if(attempts--) {
                if($footer.css('content')) {
                    $footer.show();
                } else {
                    showFooterTimeout = setTimeout(showFooter, attemptInterval);
                }
            }
        }
        showFooter();

        // In case it's taking too long, just show it
        setTimeout(function(){
            clearTimeout(showFooterTimeout);
            showFooter = function(){};
            $footer.show();
        }, totalWaitTime);
    }

    function setupSearchBoxes() {
        var searchBoxes = $('.search-box');
        searchBoxes.each(function (index, element) {
            $(element).focus(searchBoxFocused)
                .addClass('no-filter')
                .wrap("<div class='input-search'/>");
            $(element).after("<div onclick='clearSearch(this)' style='display:none'>")
        });
    }
    function setupFilterBoxes() {
        var searchBoxes = $('.filter-box');
        searchBoxes.each(function (index, element) {
            $(element).keyup(searchBoxChanged)
                .focus(searchBoxFocused)
                .val(prama.translation("Msg_SearchBox"))
                .addClass('no-filter')
                .wrap("<div class='input-search rounded'/>");
            $(element).after("<div onclick='clearSearch(this)' style='display:none'>")
        });
    }
    function setupTextboxes() {
        $('input[data-hint]').each(
            function (index, item) {
                $(item).csTextbox({ hintText: prama.translation($(item).attr('data-hint')) });
            }
        );
    }
    prama.setDateTimePickerTranslations = function () {
        var longMonths = [
            prama.translation("JanuaryText"),
            prama.translation("FebruaryText"),
            prama.translation("MarchText"),
            prama.translation("AprilText"),
            prama.translation("MayText"),
            prama.translation("JuneText"),
            prama.translation("JulyText"),
            prama.translation("AugustText"),
            prama.translation("SeptemberText"),
            prama.translation("OctoberText"),
            prama.translation("NovemberText"),
            prama.translation("DecemberText")
        ];
        var dayNamesMin = [
            prama.translation("SuText"),
            prama.translation("MoText"),
            prama.translation("TuText"),
            prama.translation("WeText"),
            prama.translation("ThText"),
            prama.translation("FrText"),
            prama.translation("SaText")
        ];
        var dayNamesMax = [
            prama.translation("SundayText"),
            prama.translation("MondayText"),
            prama.translation("TuesdayText"),
            prama.translation("WednesdayText"),
            prama.translation("ThursdayText"),
            prama.translation("FridayText"),
            prama.translation("SaturdayText")
        ];
        $.datepicker.regional['locale'] = {
	        prevText: prama.translation("PrevText"),
	        nextText: prama.translation("NextText"),
	        monthNames: longMonths,
	        dayNamesMin: dayNamesMin,
	        dayNames: dayNamesMax
        };
        $.datepicker.setDefaults($.datepicker.regional['locale']);
            $.timepicker.regional['locale'] = {
	            timeText: prama.translation("TimeText"),
	            hourText: prama.translation("HourText"),
	            minuteText: prama.translation("MinuteText"),
	            currentText: prama.translation("NowText"),
	            closeText: prama.translation("DoneText")
        };
        $.timepicker.setDefaults($.timepicker.regional['locale']);
    };
    prama.setupDateTimeBoxes = function (parent) {
        var inPageInit;
        var inputs;
        if (parent) {
            inputs = $(parent).find('.datetime')
            inPageInit = false;
        } else {
            inputs = $('.datetime');
            inPageInit = true;
        }
        if(inputs.length>0) {
           prama.setDateTimePickerTranslations();
        }
        inputs.each(
            function (index, item) {
                var jqItem = $(item);
                if (jqItem.hasClass('hasDatepicker')) {
                    return;
                }
                if (inPageInit && jqItem.hasClass('skipinit')) {
                    return;
                }
                var wrapper = $("<div class='input-calendar input-box rounded'></div>");
                //var calendar = $("<div class='calendar'></div>");
                if (jqItem.hasClass('dateonly')) {
                    var options = {
                        dateFormat: 'mm-dd-yy'
                    }
                    if ($(item).hasClass("future")) {
                        options.minDate = 1;
                    }
                    $(item).datepicker(options);
                    wrapper.css("width", "100px");
                    $(item).css("width", "72px");
                    //calendar.click(function () { $(this).prev('input').datepicker('show'); });
                } else {
                    var options = {
                            dateFormat: 'mm-dd-yy',
                            timeFormat: 'HH:mm',
                            beforeShow: function (input, inst) {
                                setTimeout(
                                    function () {
                                        inst.dpDiv.css('z-index', 999999);
                                        if ($(input).hasClass("down")) {
                                            var inputPosition = $(input).offset();
                                            var inputHeight = $(input).outerHeight();
                                            var newTop = inputPosition.top + inputHeight;
                                            inst.dpDiv.css('top', newTop);
                                            var newLeft = inputPosition.left - 3;
                                            inst.dpDiv.css('left', newLeft);
                                        }
                                    }, 10
                                )
                            }
                        };
                    if (jqItem.hasClass("end")) {
                        options.hour = 23;
                        options.minute = 59;
                    }
                    if ( jqItem.hasClass( 'notimezone' ) ) {
                        options.timezone = false;
                    }
                    jqItem.datetimepicker(options);
                    wrapper.css("width", "130px");
                    //calendar.click(function () { $(this).prev('input').datetimepicker('show'); });
                }


                //$(item).after(calendar);
                jqItem.wrapAll(wrapper);
            }
        );
    };
    function searchBoxChanged(event) {
        var box = event.currentTarget;
        evaluateFilter(box);
    }
    function evaluateFilter(box) {
        var filterValue = $(box).val();
        if (filterValue == prama.translation("Msg_SearchBox")) { return; }
        var container = $(box).parents($(box).attr('data-filter-container'));
        var filterParent = $(container).find($(box).attr('data-filter-parent'));
        if (filterValue != null && filterValue.length > 0) {
            var modifiers = 'gi';
            var regex = new RegExp(filterValue, modifiers);
            var matchFunction = function (n) {
                return regex.test(n);
            };
            $(filterParent).hideNonMatching(matchFunction, $(box).attr('data-filter-children'), $(box).attr('data-filter-searchselector'));
            var hideChildless = $(box).attr('data-filter-hide-childless-parent');
            if (hideChildless) {
                $(filterParent).each(
                    function (index, parent) {
                        $(parent).show();
                        if ($(parent).find(".mgmt-zone-details:visible").length == 0) {
                            $(parent).hide();
                        }
                    }
                );
            }
        } else {
            $(filterParent).showAll($(box).attr('data-filter-children'));
            $(filterParent).show();
        }
        return false;
    }
//function searchBoxBlurred(event) {f
//    var box = event.currentTarget;
//    var filterValue = $(box).val();
//    if (filterValue == null || filterValue.length == 0) {
//        if (!filtering) {
//            resetSearchBox(box);
//        }
//    }
//}
    function resetSearchBox(box) {
        if ($(box).hasClass('filter-box')) {
            $(box).val(prama.translation("Msg_SearchBox"));
        }
        $(box).addClass('no-filter');
        $(box).next('div').hide();
    }
    var filtering = false;
    function searchBoxFocused(event) {
        var box = event.currentTarget;
        if ($(box).val() == prama.translation("Msg_SearchBox")) {
            $(box).val('').removeClass('no-filter');
            filtering = true;
            window.setTimeout(function () {
                $(box).next('div').show();
                $(box).focus();
            }, 0);
        }
    }
    function clearSearch(div) {
        var box = $(div).prev('input');
        $(box).val('');
        if ($(box).hasClass('filter-box')) {
            evaluateFilter(box);
        } else {
            var onclear = $(box).attr('data-on-clear');
            eval(onclear);
        }
        resetSearchBox(box);
    }
    prama.findItemByPropertyValue = function (collection, propName, propValue, options) {
        var item;
        var comparator = (options && options.ignoreCase) ?
                function (testVal) {
                    if (testVal) {
                        return testVal.toLowerCase() == propValue.toLowerCase();
                    }
                    return false;
                }
                :
                function (testVal) {
                    return testVal == propValue;
                }
            ;
        var colLength;
        for (var i = 0, colLength = collection.length; i < colLength; i++) {
            if(options && options.trim && collection[i].hasOwnProperty(propName)) {
                collection[i][propName] = $.trim(collection[i][propName]);
            }
            if (collection[i].hasOwnProperty(propName) && comparator(collection[i][propName])) {
                item = collection[i];
                break;
            }
        }
        return item;
    };
    prama.findItemsByPropertyValue = function (collection, propName, propValue) {
        var items = [];
        for (var i = 0; i < collection.length; i++) {
            if (collection[i].hasOwnProperty(propName) && collection[i][propName] == propValue) {
                items.push(collection[i]);
            }
        }
        return items;
    };

    prama.registerKeyHandler = function (keyNumber, newHandler, type) {
        // use pushHandler
    };

    prama.refreshDOM = function(element) {
        setTimeout(function() {
            $('body').addClass('prama-refreshed');
            if (element){
                element.hover();
                element.addClass('prama-refreshed');
                element.removeClass('prama-refreshed');
            }
        }, 1);
    };

    prama.runAutoLoad = function () {

        var useDemo = sessionStorage.getItem("DemoMode") === 'true';
        if (useDemo) {
            require(
                ['../script/appversion.js?v=' +  new Date().getTime()],
                function (versionHolder) {
                    var cacheBuster = "v=" + versionHolder.version;
                    if (!prama.requireConfigured) {
                        require.config({
                            urlArgs: cacheBuster,
                            baseUrl: "../script/src",
                            paths: {
                                jquery: '../src/lib/jquery/jquery',
                                underscore: 'lib/underscore',
                                backbone: 'lib/backbone'
                            },
                            shim: {
                                backbone: {
                                    deps: ['jquery',"underscore"],
                                    exports: "Backbone"
                                },
                                underscore: {
                                    exports: "_"
                                }
                            }
                        });
                    }
                    require( [ 'backbone', 'demo/DemoServer' ], function( back, demoServer ) {
                            prama.demoServer = demoServer;
                            prama.getHeaderDetails();
                        }
                    );
                }
            );


        } else {
            prama.getHeaderDetails();
        }
    };

    var globalTranslations =
    {
        "MobileWebsiteTitle": "Mobile Website",
        "FullWebsiteTitle": "Full Website",
        "BackTitle": "Back",
        "EditTitle": "Edit",
        "ViewTitle": "View",
        "SaveTitle": "Save",
        "CancelTitle": "Cancel",
        "NewTitle": "New",
        "DeleteTitle": "Delete",
        "Msg_SearchBox": "type to search",
        "Msg_PageLoading": "Loading...",
        "Msg_PleaseWaitSaving": "Please wait while the data is saved.",
        "InvalidDateTime": "Invalid date/time",
        "RequiredMsg": "Required",
        "ItemNameInvalid": "Only A-Z, 0-9, - and ' allowed",
        "Msg_MaxChars": "Only {0} characters allowed",
        "LettersNumbers": "Letters and numbers only",
        "InvalidEmail": "Invalid email address",
        "InvalidNumber": "Please enter a valid number",
        "InvalidDecimal": "Invalid decimal",
        "WelcomeMsg": "Welcome, {0}",
        "SwitchOrgTitle": "Switch Org",
        "SelectOrgTitle": "Select Organization To Switch",
        "Copyright": "PRAMA. All Rights Reserved.",
        "Connect": "Connect with us on",
        "ManageTitle": "Manage",
        "LandHardwareTitle": "Land & Hardware",
        "GeneralPreferencesTitle": "General Preferences",
        "AlertPreferencesTitle": "Alert Preferences",
        "OrganizationsTitle": "Organizations",
        "UsersTitle": "Users",
        "Msg_PleaseSelect": "Please select...",
        "Err_MapData": 'You must provide an object that contains the options when marking an item as type "lookup"',
        "Err_Log": "An error happened. In the future this will be logged. The error was: ",
        "Err_Unknown": "An   server error occurred.",
        "Err_Request": "There was an error processing the request.",
        "Msg_BadEndDate": "End Date must be after Start Date",
        "Msg_EarlyDate": "Date cannot be earlier than tomorrow",
        "RunTitle": "Run",
        "SupportTitle": "Support",
        "ActivationsTitle": "Activations",
        "Err_Length": "{0} characters only",
        "Err_MaxLength": "< {0} characters required",
        "Err_MinLength": "at least {0} characters required",
        "Confirm": "Confirm",
        "Alert": "Alert",
        "LogOutTitle": "Log Out",
        "ContactUsTitle": "Contact Us",
        "AccessibilityTitle": "Accessibility",
        "Yes": "Yes",
        "Cancel": "Cancel",
        "prama": "PRAMA &trade;",
        "PreferencesTitle": "Preferences",
        "PramaTitle": "PRAMA",
        "HelpTitle": "Help",
        "SwitchOrgLink": "Switch Organization",
        "ConfirmLogOut": "Log out?",
        "PrivacyAndDataTitle": "Privacy and Data",
        "CookieSettingsTitle": "Cookie Settings",
        "LegalTitle": "Legal",
        "SaveSuccess": "The data was successfully saved.",
        "CloseAction": "Close",
        "TryAgainAction": "Try Again",
        "SaveFailure": "There was an error saving the data.",
        "ContinueAction": "Continue",
        "MustMatch": "Must match {0}",
        "OrgPreferences": "Org Preferences",
        "OrganizationPreferences": "Organization Preferences",
        "EnterEmail": "Please enter their email address",
        "SendInviteTitle": "Send Invite",
        "AddOrganizationTitle": "Add Organization",
        "OrgNameQuestion": "What is the name of the Organization?",
        "OrgCountryQuestion": "What country is it?",
        "NoDataFound": "No Data Found",
        "NotCurrentlyAvailable": "Not Currently Available",
        "Msg_WebSessionExpired": "Prama will automatically log in and load the previous page you were working on.  You may be asked to provide the Organization ID you wish to view.",
        "SessionExpiredTitle": "Session Expired",
        "Msg_PageLoading": "Assembling data for display...",
        "Select": "Select",
        "SearchForOrgTitle": "Search for an Organization",
        "SelectAnOrgTitle": "Select an Organization",
        "SelectOrgPrompt": "Please select an Organization",
        "SearchBy": "Search by ID or Organization Name",
        "Finishing": "FINISHING",
        "Searching": "SEARCHING",
        "Sorting": "SORTING",
        "SelectOrganizationTitle": "Select Organization",
        "OrganizationNameTitle": "Organization Name",
        "OrganizationIdTitle": "Organization Id",
        "EnterSearchCriteriaTitle": "Enter search criteria",
        "SearchTitle": "SEARCH",
        "Msg_UseKeys": "Press Arrow Keys to Navigate",
        "Msg_EnterKey": "Press Enter to Select",
        "Msg_SpaceBar": "Press Space Bar to Select",
        "Nav_Support": "Support",
        "Nav_SupportTools": "Tools",
        "Nav_Gateways": "Gateways",
        "Nav_Admin": "Admin",
        "Nav_GatewayList": "Gateway List",
        "Nav_GlobalAlerts": "Alerts",
        "Nav_Activations": "Activations",
        "Nav_Software": "Software",
        "Nav_OrgView": "Org View",
        "Nav_FieldMonitor": "Field Monitor",
        "Nav_Landing": "Field",
        "Nav_AlertRules": "Alerts Rules",
        "Nav_Assets": "Assets",
        "Nav_Land": "Land",
        "Nav_Hardware": "Hardware",
        "Nav_Sensors": "Sensor Assignments",
        "Nav_Groups": "Groups",
        "Nav_People": "People",
        "charactersremaining": "characters remaining",
        "Msg_NoResults": "No results found",
        "AllTitle": "All",
        "LogBackInTitle": "Log Back In",
        "UserIdLG": "ID",
        "UserPassword": "PASSWORD",
        "SignIn": "SIGN IN",
        "SignInHeader": "Sign In",
        "SignInHeaderprama": "PRAMA&trade;",
        "SigningIn": "SIGNING IN",
        "Continue": "CONTINUE",
        "InvalidLogin": "Invalid login",
        "Msg_MissingUserId": "Please enter a user Id",
        "Msg_NoItems": "No Items To Display",
        "ItemDeleteSuccess": "Successfully Deleted the Item",
        "JanuaryText": "January",
        "FebruaryText": "Febuary",
        "MarchText": "March",
        "AprilText": "April",
        "MayText": "May",
        "JuneText": "June",
        "JulyText": "July",
        "AugustText": "August",
        "SeptemberText": "September",
        "OctoberText": "October",
        "NovemberText": "November",
        "DecemberText": "December",
        "MondayText": "Monday",
        "TuesdayText": "Tuesday",
        "WednesdayText": "Wednesday",
        "ThursdayText": "Thursday",
        "FridayText": "Friday",
        "SaturdayText": "Saturday",
        "SundayText": "Sunday",
        "MoText": "Mo",
        "TuText": "Tu",
        "WeText": "We",
        "ThText": "Th",
        "FrText": "Fr",
        "SaText": "Sa",
        "SuText": "Su",
        "PrevText": "Prev",
        "NextText": "Next",
        "DoneText": "Done",
        "NowText": "Now",
        "HourText": "Hour",
        "MinuteText": "Minute",
        "TimeText": "Time",
        "OrgNotSelectedText":"Org Not Selected",
        "AgreementsTitle": "End User License Agreements",
        "SelectedOrganization": "Selected Organization",
        "EULANotAccepted": "The End User License Agreements have not been accepted for this Organization. An Organization administrator must accept the Agreements before the Organization can be accessed.",
        "EULANotAcceptedTitle": "EULA Not Accepted",
        "HaveReadLabel": "I have read and agree to the above",
        "GoToSupportTitle": "Go to Support page",
        "NotAuthorizedTitle": "Not Authorized",
        "Msg_NotAuthorized": "The current user is not authorized within PRAMA&trade;.",
        "TermsOfUse": "Terms of Use",
        "TermsUpdatedDate": "(updated 12/19/2014)",
        "ItemsFilteredOut": "No items to display. Please try clearing or changing the search box above.",
        "Msg_DisabledForDemo": "This feature has been disabled for the Demo Mode.",
        "DemoModeTitle": "Demo Mode",
        "NSlashA": "N/A",
        "Validation_DecimalTwoPlaces": "Number with up to 2 decimal places required",
        "ActiveNoDataLabel": "Active - No Data",
        "NotSetup": "Active - No Budget",
        "CellSignalStrengthLabel": "Cell Signal Strength",
        "BarsLabel": "Bars",
        "country_us": "USA",
        "country_it": "Italy",
        "country_fr": "France",
        "country_pt": "Portugal",
        "country_ca": "Canada",
        "country_au": "Australia",
        "country_nz": "New Zealand",
        "country_es": "Spain",
        "country_gb": "United Kingdom",
        "country_de": "Germany",
        "country_hu": "Hungary",

        "lang_en_US": "Englishman!",
        "lang_fr_FR": "French",
        "lang_es_ES": "Spanish",
        "lang_pt_PT": "Portuguese",
        "lang_it_IT": "Italian",
        "lang_pt_BR": "Portuguese(Brazil)",
        "lang_hu_HU": "Hungarian",

        "lang_1": "English",
        "lang_2": "French",
        "lang_3": "Spanish",
        "lang_4": "Portuguese",
        "lang_5": "Italian",
        "lang_6": "Portuguese(Brazil)",
        "lang_7": "Hungarian",

        "timezone_1": "America/Chicago",
        "timezone_2": "America/New_York",
        "timezone_3": "America/Knox_IN",
        "timezone_4": "America/Indiana/Knox",
        "timezone_6": "America/Los_Angeles",
        "timezone_7": "America/Phoenix",
        "timezone_8": "America/Indianapolis",
        "timezone_9": "America/Fort_Wayne",
        "timezone_10": "America/Indiana/Indianapolis",
        "timezone_11": "America/Indiana/Winamac",
        "timezone_12": "America/Denver",
        "timezone_13": "America/Indiana/Marengo",
        "timezone_14": "America/Shiprock",
        "timezone_15": "America/North_Dakota/New_Salem",
        "timezone_16": "America/Indiana/Petersburg",
        "timezone_17": "America/Menominee",
        "timezone_18": "America/Indiana/Vincennes",
        "timezone_19": "America/Adak",
        "timezone_20": "America/Atka",
        "timezone_21": "America/Nome",
        "timezone_22": "America/Yakutat",
        "timezone_23": "America/Detroit",
        "timezone_24": "America/Juneau",
        "timezone_26": "America/Indiana/Tell_City",
        "timezone_27": "Pacific/Honolulu",
        "timezone_28": "America/Boise",
        "timezone_29": "America/Louisville",
        "timezone_30": "America/Kentucky/Louisville",
        "timezone_31": "America/Anchorage",
        "timezone_32": "America/Kentucky/Monticello",
        "timezone_33": "America/North_Dakota/Center",
        "timezone_34": "America/Indiana/Vevay",
        "timezone_35": "America/Rankin_Inlet",
        "timezone_36": "America/Moncton",
        "timezone_37": "America/Whitehorse",
        "timezone_38": "America/Swift_Current",
        "timezone_39": "America/Pangnirtung",
        "timezone_40": "America/Yellowknife",
        "timezone_41": "America/Vancouver",
        "timezone_42": "America/Winnipeg",
        "timezone_43": "America/Dawson_Creek",
        "timezone_44": "America/Blanc-Sablon",
        "timezone_45": "America/Inuvik",
        "timezone_46": "America/Cambridge_Bay",
        "timezone_47": "America/Regina",
        "timezone_48": "America/Edmonton",
        "timezone_49": "America/Nipigon",
        "timezone_50": "America/Dawson",
        "timezone_51": "America/Toronto",
        "timezone_52": "America/Iqaluit",
        "timezone_53": "America/Montreal",
        "timezone_54": "America/St_Johns",
        "timezone_55": "America/Coral_Harbour",
        "timezone_56": "America/Atikokan",
        "timezone_57": "America/Halifax",
        "timezone_58": "America/Glace_Bay",
        "timezone_59": "America/Rainy_River",
        "timezone_60": "America/Resolute",
        "timezone_61": "America/Goose_Bay",
        "timezone_62": "America/Thunder_Bay",
        "timezone_63": "Australia/Adelaide",
        "timezone_64": "Australia/South",
        "timezone_65": "Australia/LHI",
        "timezone_66": "Australia/Lord_Howe",
        "timezone_67": "Australia/Melbourne",
        "timezone_68": "Australia/Victoria",
        "timezone_69": "Australia/Lindeman",
        "timezone_70": "Australia/Eucla",
        "timezone_71": "Australia/Darwin",
        "timezone_72": "Australia/North",
        "timezone_73": "Australia/Currie",
        "timezone_74": "Australia/Brisbane",
        "timezone_75": "Australia/Queensland",
        "timezone_76": "Australia/Hobart",
        "timezone_77": "Australia/Canberra",
        "timezone_78": "Australia/ACT",
        "timezone_79": "Australia/NSW",
        "timezone_80": "Australia/Sydney",
        "timezone_81": "Australia/Tasmania",
        "timezone_82": "Australia/Perth",
        "timezone_83": "Australia/West",
        "timezone_84": "Australia/Yancowinna",
        "timezone_85": "Australia/Broken_Hill",
        "timezone_86": "Europe/London",
        "timezone_87": "Europe/Belfast",
        "timezone_88": "Europe/Amsterdam",
        "timezone_89": "Europe/Paris",
        "timezone_90": "Europe/Rome",
        "timezone_91": "Europe/Stockholm",
        "timezone_92": "Europe/Zurich",
        "timezone_93": "Europe/Oslo",
        "timezone_94": "Atlantic/Jan_Mayen",
        "timezone_95": "Europe/Berlin",
        "timezone_96": "Europe/Prague",
        "timezone_97": "Europe/Luxembourg",
        "timezone_98": "Europe/Helsinki",
        "timezone_99": "Pacific/Chatham",
        "timezone_100": "Pacific/Auckland",
        "timezone_101": "Europe/Athens",
        "timezone_102": "Europe/Warsaw",
        "timezone_103": "Europe/Budapest",
        "timezone_104": "South Africa/Harare/Pretoria",

        "timezoneUTC_1": "(UTC-06:00) America/Chicago",
        "timezoneUTC_2": "(UTC-05:00) America/New_York",
        "timezoneUTC_3": "(UTC-06:00) America/Knox_IN",
        "timezoneUTC_4": "(UTC-06:00) America/Indiana/Knox",
        "timezoneUTC_6": "(UTC-08:00) America/Los_Angeles",
        "timezoneUTC_7": "(UTC-07:00) America/Phoenix",
        "timezoneUTC_8": "(UTC-05:00) America/Indianapolis",
        "timezoneUTC_9": "(UTC-05:00) America/Fort_Wayne",
        "timezoneUTC_10": "(UTC-05:00) America/Indiana/Indianapolis",
        "timezoneUTC_11": "(UTC-05:00) America/Indiana/Winamac",
        "timezoneUTC_12": "(UTC-07:00) America/Denver",
        "timezoneUTC_13": "(UTC-05:00) America/Indiana/Marengo",
        "timezoneUTC_14": "(UTC-07:00) America/Shiprock",
        "timezoneUTC_15": "(UTC-06:00) America/North_Dakota/New_Salem",
        "timezoneUTC_16": "(UTC-05:00) America/Indiana/Petersburg",
        "timezoneUTC_17": "(UTC-06:00) America/Menominee",
        "timezoneUTC_18": "(UTC-05:00) America/Indiana/Vincennes",
        "timezoneUTC_19": "(UTC-10:00) America/Adak",
        "timezoneUTC_20": "(UTC-10:00) America/Atka",
        "timezoneUTC_21": "(UTC-09:00) America/Nome",
        "timezoneUTC_22": "(UTC-09:00) America/Yakutat",
        "timezoneUTC_23": "(UTC-05:00) America/Detroit",
        "timezoneUTC_24": "(UTC-09:00) America/Juneau",
        "timezoneUTC_26": "(UTC-06:00) America/Indiana/Tell_City",
        "timezoneUTC_27": "(UTC-10:00) Pacific/Honolulu",
        "timezoneUTC_28": "(UTC-07:00) America/Boise",
        "timezoneUTC_29": "(UTC-05:00) America/Louisville",
        "timezoneUTC_30": "(UTC-05:00) America/Kentucky/Louisville",
        "timezoneUTC_31": "(UTC-09:00) America/Anchorage",
        "timezoneUTC_32": "(UTC-05:00) America/Kentucky/Monticello",
        "timezoneUTC_33": "(UTC-06:00) America/North_Dakota/Center",
        "timezoneUTC_34": "(UTC-05:00) America/Indiana/Vevay",
        "timezoneUTC_35": "(UTC-06:00) America/Rankin_Inlet",
        "timezoneUTC_36": "(UTC-04:00) America/Moncton",
        "timezoneUTC_37": "(UTC-08:00) America/Whitehorse",
        "timezoneUTC_38": "(UTC-06:00) America/Swift_Current",
        "timezoneUTC_39": "(UTC-05:00) America/Pangnirtung",
        "timezoneUTC_40": "(UTC-07:00) America/Yellowknife",
        "timezoneUTC_41": "(UTC-08:00) America/Vancouver",
        "timezoneUTC_42": "(UTC-06:00) America/Winnipeg",
        "timezoneUTC_43": "(UTC-07:00) America/Dawson_Creek",
        "timezoneUTC_44": "(UTC-04:00) America/Blanc-Sablon",
        "timezoneUTC_45": "(UTC-07:00) America/Inuvik",
        "timezoneUTC_46": "(UTC-07:00) America/Cambridge_Bay",
        "timezoneUTC_47": "(UTC-06:00) America/Regina",
        "timezoneUTC_48": "(UTC-07:00) America/Edmonton",
        "timezoneUTC_49": "(UTC-05:00) America/Nipigon",
        "timezoneUTC_50": "(UTC-08:00) America/Dawson",
        "timezoneUTC_51": "(UTC-05:00) America/Toronto",
        "timezoneUTC_52": "(UTC-05:00) America/Iqaluit",
        "timezoneUTC_53": "(UTC-05:00) America/Montreal",
        "timezoneUTC_54": "(UTC-03:30) America/St_Johns",
        "timezoneUTC_55": "(UTC-05:00) America/Coral_Harbour",
        "timezoneUTC_56": "(UTC-05:00) America/Atikokan",
        "timezoneUTC_57": "(UTC-04:00) America/Halifax",
        "timezoneUTC_58": "(UTC-04:00) America/Glace_Bay",
        "timezoneUTC_59": "(UTC-06:00) America/Rainy_River",
        "timezoneUTC_60": "(UTC-06:00) America/Resolute",
        "timezoneUTC_61": "(UTC-04:00) America/Goose_Bay",
        "timezoneUTC_62": "(UTC-05:00) America/Thunder_Bay",
        "timezoneUTC_63": "(UTC+10:30) Australia/Adelaide",
        "timezoneUTC_64": "(UTC+10:30) Australia/South",
        "timezoneUTC_65": "(UTC+11:00) Australia/LHI",
        "timezoneUTC_66": "(UTC+11:00) Australia/Lord_Howe",
        "timezoneUTC_67": "(UTC+11:00) Australia/Melbourne",
        "timezoneUTC_68": "(UTC+11:00) Australia/Victoria",
        "timezoneUTC_69": "(UTC+10:00) Australia/Lindeman",
        "timezoneUTC_70": "(UTC+08:45) Australia/Eucla",
        "timezoneUTC_71": "(UTC+09:30) Australia/Darwin",
        "timezoneUTC_72": "(UTC+09:30) Australia/North",
        "timezoneUTC_73": "(UTC+11:00) Australia/Currie",
        "timezoneUTC_74": "(UTC+10:00) Australia/Brisbane",
        "timezoneUTC_75": "(UTC+10:00) Australia/Queensland",
        "timezoneUTC_76": "(UTC+11:00) Australia/Hobart",
        "timezoneUTC_77": "(UTC+11:00) Australia/Canberra",
        "timezoneUTC_78": "(UTC+11:00) Australia/ACT",
        "timezoneUTC_79": "(UTC+11:00) Australia/NSW",
        "timezoneUTC_80": "(UTC+11:00) Australia/Sydney",
        "timezoneUTC_81": "(UTC+11:00) Australia/Tasmania",
        "timezoneUTC_82": "(UTC+08:00) Australia/Perth",
        "timezoneUTC_83": "(UTC+08:00) Australia/West",
        "timezoneUTC_84": "(UTC+10:30) Australia/Yancowinna",
        "timezoneUTC_85": "(UTC+10:30) Australia/Broken_Hill",
        "timezoneUTC_86": "(UTC) Europe/London",
        "timezoneUTC_87": "(UTC) Europe/Belfast",
        "timezoneUTC_88": "(UTC+01:00) Europe/Amsterdam",
        "timezoneUTC_89": "(UTC+01:00) Europe/Paris",
        "timezoneUTC_90": "(UTC+01:00) Europe/Rome",
        "timezoneUTC_91": "(UTC+01:00) Europe/Stockholm",
        "timezoneUTC_92": "(UTC+01:00) Europe/Zurich",
        "timezoneUTC_93": "(UTC+01:00) Europe/Oslo",
        "timezoneUTC_94": "(UTC+01:00) Atlantic/Jan_Mayen",
        "timezoneUTC_95": "(UTC+01:00) Europe/Berlin",
        "timezoneUTC_96": "(UTC+01:00) Europe/Prague",
        "timezoneUTC_97": "(UTC+01:00) Europe/Luxembourg",
        "timezoneUTC_98": "(UTC+02:00) Europe/Helsinki",
        "timezoneUTC_99": "(UTC+13:45) Pacific/Chatham",
        "timezoneUTC_100": "(UTC+13:00) Pacific/Auckland",
        "timezoneUTC_101": "(UTC+02:00) Europe/Athens",
        "timezoneUTC_102": "(UTC+01:00) Europe/Warsaw",
        "timezoneUTC_103": "(UTC+01:00) Europe/Budapest",
        "timezoneUTC_104": "(UTC+02:00) South Africa/Harare/Pretoria",
        "Msg_AsOfDateTime": "As of {0} at {1}",
        "UOM_Metric": "Metric",
        "UOM_English": "English"
    };

} (window.prama = window.prama || {}, jQuery));

(function (Probes, $, undefined) {
    Probes.getProbeStatus = function (id) {
        switch (id) {
            case "0NoData":
                return { cssClass: "status-nodata", display: prama.translation("ActiveNoDataLabel"), thermometerWidth: "0%" };
                break;
            case "0":
                return { cssClass: "status-normal", display: prama.translation("Normal"), gaugeWidth: "50%" };
                break;
            case "1":
                return { cssClass: "status-wet", display: prama.translation("FullPointError"), gaugeWidth: "93%" };
                break;
            case "2":
                return { cssClass: "status-wetwarning", display: prama.translation("FullPointWarning"), gaugeWidth: "79%" };
                break;
            case "3":
                return { cssClass: "status-dry", display: prama.translation("RefillPointError"), gaugeWidth: "7%" };
                break;
            case "4":
                return { cssClass: "status-drywarning", display: prama.translation("RefillPointWarning"), gaugeWidth: "21%" };
                break;
            case "5":
                return { cssClass: "status-inactive", display: prama.translation("Inactive"), gaugeWidth: "100%" };
                break;
            case "6":
                return { cssClass: "status-notsetup", display: prama.translation("NotSetup"), gaugeWidth: "100%" };
                break;
            case "00NotYetReceived":
                return {cssClass: "", display: "", thermometerWidth: "0%" };
                break;
        }
    };
    Probes.buildProbeList = function(probes, onclick) {
        var container = $("<div class='probe-list' style='display: none;'></div>");
        var isFirst = true;
        $.each(probes,
            function (index, probeInfo) {
                if (!isFirst) {
                    container.append($("<span class='divider'></span>"));
                } else {
                    isFirst = false;
                }
                var probeStatus = Probes.getProbeStatus(probeInfo.probeStatusId);
                var probe = $("<div class='probe-button'>"
                    + "<span class='probe-status " + probeStatus.cssClass + "'></span>"
                    + "<span class='name'>" + probeInfo.name + "</span><span class='status-text'>" + probeStatus.display + "</span></div>");
                probe.click(probeInfo, onclick);
                container.append(probe);
            }
        );
        return container;
    };
    Probes.statusSorter = function (a, b) {
        var valueA = Probes.probeStatusByOrder[a.probeStatusId];
        var valueB = Probes.probeStatusByOrder[b.probeStatusId];
        if (valueA < valueB) { return -1 }
        if (valueA > valueB) { return 1 }
        //if they have the same value, sort by name
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();
        if (nameA < nameB) { return -1 }
        if (nameA > nameB) { return 1 }
        return 0;
    };
    Probes.probeStatusByOrder = {
        "3": 0,
        "4": 1,
        "1": 2,
        "2": 3,
        "0": 4,
        "6": 5,
        "5": 6
    };
} (window.Probes = window.Probes || {}, jQuery));

String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

Array.prototype.group = function(keyFun) {
    var group = {
        keys: []
    };
    var key;
    for (var i = 0, len = this.length; i < len; i++) {
        key = keyFun(this[i]);
        if (!group[key]) {
            group[key] = [];
            group.keys.push(key);
        }
        group[key].push(this[i]);
    }
    return group;
}

Array.prototype.findById = function (id) {
    return prama.findItemByPropertyValue(this, "id", id);
}

Array.prototype.findItemByLambda = function(key, propFunction) {
    var testItem;
    for (var i = 0, len = this.length; i < len; i++) {
       testItem = this[i];
       if (propFunction(testItem) == key) {
            return testItem;
       }
    }
    return null;
};

Array.prototype.removeById = function (id) {
    return prama.removeFromCollectionByProperty(this, { id: id }, "id");
}


prama.start = function () {
    if (prama.autoLoad) {
        if (prama.skipAutoLoad) {
            return;
        }
        prama.runAutoLoad();
    }
};



var runTestMode = (localStorage.getItem("testmode") || 'false') === 'true';
var runDemoMode = sessionStorage.getItem("DemoMode") === 'true';
if (runTestMode || runDemoMode) {
    prama.Paths = {
        Landing: { url: "../html/Monitor.htm" },
        Land: { url: "Monitor.htm#land" },
        Manage_Hardware: { url: "Hardware.htm" },
        Sensors: { url: "Sensors.htm" },
        People: { url: "Manage_Users.htm" },
        OrgPreferences: { url: "OrganizationPreferences.htm" },
        AlertsPreferences: { url: "AlertsPreferences.htm" },
        SupportLanding: { url: "SupportLanding.htm" },
        Support_Alerts: { url: "Support_Alerts.htm" },
        Support_PushSoftware: { url: "Support_PushSoftware.htm", feature: "GetFirmwareVersion", downgrade: "Support_Alerts" },
        OrgView: { url: "Landing.htm" },
        HardwareManualUpload: { url: "../web/hardwareManualUpload" },
        SoftwareUpload: { url: "../web/addFirmwareVersion" },
        Support_ManageSoftware: { url: "Support_ManageSoftware.htm" },
        Support_Tools: { url: "Support_Tools.htm", feature: "support" },
        FieldMonitor: { url: "../web/four/index.htm" },
        ExportGraph: { url: "https://export.highcharts.com"}
    };

    // prama.setTranslationUrl("getTranslations");
    prama.allowTransReport = true;
    prama.setErrorOnMissingTranslation(true);
    // prama.retrieveTranslations = false;
    /*prama.urlBuilder = function (pageKey, urlKey, data, options, requestNumber) {
        var handler;
        handler = "../test/test" + requestNumber + ".py";
        var scenario = prama.getCookie("testScenarioId");
        if (!scenario) {
            scenario = "default";
        }
        if (options.verb === "GET") {
            return handler + "?pageKey=" + pageKey + "&key=" + urlKey + "&scenario=" + scenario;
        } else {
            data.key = urlKey;
            data.pageKey = pageKey;
            data.scenario = scenario;
            return handler;
        }
    };*/
    prama.beforePageLoad = function () {
//        var onServerResponse = function (data) {
//            try {
//                if (!data.scenarios) {
//                    data.scenarios = [];
//                }
//                data.scenarios.unshift({ "id": "default", "name": "Default" });
//                $('#listScenarios').csSelectors(
//                        {
//                            data: data.scenarios,
//                            click: function (event, data) {
//                                setCookie("testScenarioId", data.selectedItem.id);
//                                window.location.reload(true);
//                            }
//                        });
//                $('#listScenarios').csSelectors("selectbyid", getCookie("testScenarioId"));
//            } catch (ex) { }
//            prama.continuePageLoad();
//        }
//        prama.ajax("TestScenarios", null, onServerResponse, { onResponseMessage: function () { } });
        prama.continuePageLoad();
    };
    prama.batchRunner = function (services, callback) {
        //this batch runner runs services synchronously (so it'll work with the cheesy local server)
        var servicesToRun = services.length;
        var currentService = 0;
        var context, options;
        var runService = function(serviceNumber) {
            var serviceRunner = services[serviceNumber];
            context = serviceRunner.buildContext ? serviceRunner.buildContext() : null;
            options = serviceRunner.options;
            options.context = context;
            prama.ajax(
                serviceRunner.serviceKey,
                serviceRunner.buildRequest(),
                responseMaker(serviceRunner),
                options
            );
        };
        var responseMaker = function (runner) {
            return function (response) {
                runner.callback(response);
                currentService++
                if (currentService === servicesToRun) {
                    callback();
                } else {
                    runService(currentService);
                }
            };
        };
        runService(0);
    };
} else {
    prama.Paths = {
        Landing: { url: "../web/landing" },
        Graph: { url: "../web/graphs" },
        Land: { url: "../web/land" },
        Manage_Hardware: { url: "../web/manageHardware" },
        Sensors: { url: "../web/manageSensors" },
        People: { url: "../web/userManagement" },
        OrgPreferences: { url: "../web/organizationPreferencesPage" },
        AlertsPreferences: { url: "../web/alertPreferences" },
        SupportLanding: { url: "../web/support" },
        Support_Alerts: { url: "../web/alertsSupport" },
        Support_PushSoftware: { url: "../web/gatewaysVersionPage", feature: "GetFirmwareVersion", downgrade: "Support_Alerts" },
        HardwareManualUpload: { url: "../web/hardwareManualUpload" },
        OrgView: { url: "../web/landing" },
        Support_ManageSoftware: { url: "../web/firmwareVersionPage" },
        SoftwareUpload: { url: "../web/addFirmwareVersion" },
        Support_Tools: { url: "../web/supportToolsPage", feature: "support" },
        FieldStatus: { url: "../web/four/index" },
        FieldMonitor: { url: "../web/fieldmonitor" },
        ExportGraph: { url: "../web/generateDocument"}
    };
    prama.setErrorOnMissingTranslation(true);
    prama.loginTimeout = 1860000; // 31 minutes
}