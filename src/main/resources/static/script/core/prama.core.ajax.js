define(
    [
        'core/prama.core.domain',
        'core/prama.core.local',
        'impl/errorhandler',
        'impl/applicationconfiguration',
        'ApplicationContext',
        'jquery'
    ],
    function (domain, local, errorHandler, configuration, appContext) {

        var dataModifierFn = null;
        var serviceQueue = [];
        var offlineServices = [
            'Translations',
            'GetAuthorizationDetails',
            'GetCacheKeys',
            'GetDeviceDetails',
            'GetDomain',
            'GetHeaderDetails',
            'GetLands',
            'GetOrgAlerts',
            'GetOrgGroups',
            'GetOrgNodesAndStatus',
            'GetOrgProbes',
            'GetUserGroups'
        ];
        var clearServiceFromQue = function(request) {
            var index = serviceQueue.indexOf(request);
            if (index > -1) {
                serviceQueue.splice(index, 1);
            }
        };
        var abortServices = function() {
            $(serviceQueue).each(function(idx, jqXHR) {
                jqXHR.abort();
            });
            serviceQueue.length = 0
        };
        var inited = false;
        var checkInit = function () {
            if (!inited) {
                $(window).bind('beforeunload', function () {
                    abortServices();
                });
                $.ajaxSetup({
                    timeout: 1000000,
                    cache: false,
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8"
                });
                inited = true;
            }
        };
        var contextualizeUrl = function(url, context) {
            var pattern = /\{(\w+)\}/g;
            url = url.replace(pattern, function (match, key) {
                if (!context.hasOwnProperty(key)) {
                    // alert("Developer Error: URL context-key " + key + " cannot be found in context data.");
                    if (window.console) {
                        window.console.log("Developer Error: URL context-key " + key + " cannot be found in context data.");
                    }
                    return "";
                }
                return context[key];
            });
            return url;
        };
        var ajax = function (serviceKey, data, callback, optionsIn) {
            if (configuration.demoServer) {
                if (configuration.demoServer.handleUrl(serviceKey)) {
                    configuration.demoServer.ajax(serviceKey, data, callback, optionsIn);
                    return;
                }
            }
            checkInit();

            var options = {
                verb: "GET",
                checkResponse: function (response) {
                    if(!options.handleErrorOutside){
                        if (!response.success) {
                            errorHandler.handle(response);
                        }
                    }
                    return true;
                }
            };
            $.extend(options, optionsIn);

            var url = options.translationsUrl || domain.services[serviceKey];
            var additionalContext = optionsIn && optionsIn.context ? optionsIn.context : {};
            if (!options.ignoreContext) {
                var context = $.extend({}, appContext.get(), additionalContext);
                url = contextualizeUrl(url, context);
            };
            var dataForRequest = data;
            var global;
            if (options && options.onAjaxError) {
                global = false;
            } else {
                global = true;
            }
            if (configuration.urlBuilder) {
                var pageKey = options.pageKey;
                dataForRequest = dataForRequest || {};
                url = configuration.urlBuilder(pageKey, serviceKey, dataForRequest, options, serviceQueue.length);
            }

            if ( dataModifierFn && typeof( dataModifierFn ) == 'function' ) {
                dataForRequest = dataModifierFn( serviceKey, dataForRequest );
            }

            if (!window.OFFLINE_MODE) {
                var postfix = "";
                if (url.indexOf("?") == -1) {
                    postfix = "?";
                } else {
                    postfix = "&";
                }
                postfix += "v=" + new Date().getTime();
                url += postfix;
            }

            var ajaxConfig = {
                url: url,
                dataType: 'json',
                data: options.stringify ? JSON.stringify(dataForRequest) : dataForRequest,
                type: options.verb,
                success: function (responseData, textStatus, jqXHR) {
                    if (!responseData && options && options.onAjaxError) {
                        //an error occurred
                        options.onAjaxError(jqXHR, textStatus);
                    }
                    if (responseData && responseData.sessionExpired) {
                        errorHandler.sessionExpired();
                        return;
                    }

                    if (window.IS_MOBILE && offlineServices.indexOf(serviceKey) > -1){
                        if (serviceKey == "Translations") {
                            local.setObject(data.screenName, responseData);
                        } else if (appContext.getValue('selectedOrganizationId') ||
                            serviceKey == 'GetAuthorizationDetails' ||
                            serviceKey == 'GetHeaderDetails'){
                            local.setObject(serviceKey, responseData);
                        }
                    }
                    if (options.checkResponse(responseData) && callback) {
                        callback(responseData);
                    }
                },
                cache: false,
                global: global,
                error: function ( jqXHR, textStatus, errorThrown ) {
                    //if the user's login session expires, the authentication provider will step in and redirect
                    //  to the login page -- the browser will follow this redirect notice and return the login page
                    //  as the ajax response (which will cause the call to fail since we have specified the dataType
                    //  as 'json'
                    var contentType = jqXHR.getResponseHeader( "Content-Type" );
                    var isHtmlContent = ( contentType.toLowerCase().indexOf( "text/html" ) >= 0 );
                    if ( jqXHR.status === 200 && isHtmlContent ) {
                        errorHandler.loginExpired();
                        return;
                    }
                    if ( options && options.onAjaxError ) {
                        options.onAjaxError( jqXHR, textStatus, errorThrown );
                    } else {
                        if ( jqXHR.status === 500 && isHtmlContent ) {
                            var uiUtil = require( 'ui/prama.ui.util' );
                            uiUtil.info( null, { message: jqXHR.responseText, flexibleHeight: true } );
                            $( '.dialog-view-wrapper' ).css( 'z-index', 9999 );
                        } else if ( window.console && window.console.log ) {
                            console.log( "Error in request: " + url + ", " + jqXHR.responseText + ", " + errorThrown );
                        }
                    }
                    callback( { success: false } );
                },
                complete: function (jqXHR) {
                    clearServiceFromQue(jqXHR);
                }
            };
            if (options.stringify) {
                ajaxConfig.contentType = "application/json";
            }
            if (window.OFFLINE_MODE){
                var cachedData = (serviceKey == "Translations" ? local.getObject(data.screenName) : local.getObject(serviceKey));
                if (cachedData){
                    callback(cachedData);
                } else {
                    console.log('No cached data for- '+ serviceKey + ": "+ url);
                    console.trace();
                }
            } else {
                var request = $.ajax(ajaxConfig);
                request.id = parseInt(serviceQueue.length + 1);
                serviceQueue.push(request);
                return request;
            }
        };
        return {
            runBatch: function(services, callback){
                var that = this;
                //default: runs all services at once
                var servicesToRun = services.length;
                var servicesReturned = 0;
                var context, options;
                var responseMaker = function (runner) {
                    return function (response) {
                        runner.callback(response);
                        if (response.success){
                            servicesReturned++;
                        }
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
                    that.get(
                        serviceRunner.serviceKey,
                        serviceRunner.buildRequest(),
                        responseMaker(serviceRunner),
                        options
                    );
                }
            },
            get: function (urlKey, data, callback, options) {
                return ajax(urlKey, data, callback, options);
            },
            post: function (urlKey, data, callback, options) {
                options = options || {};
                options.verb = "POST";
                return ajax(urlKey, data, callback, options);
            },
            delete: function (urlKey, data, callback, options) {
                options = options || {};
                options.verb = "DELETE";
                return ajax(urlKey, data, callback, options);
            },
            cancel: function (xhr) {
                //TODO: make sure xhr hasn't been completed before aborting...
                xhr.abort();
                clearServiceFromQue(xhr);
            },
            abortAll: function(){
                abortServices();
            },
            setDataModifier: function( fn ) { dataModifierFn = fn; }
        }
    }
);