require.config({
    baseUrl: '../script/src'
});

define(
    [
        '../../script/appversion.js?v=' + sessionStorage.getItem('sessionStart') || new Date().getTime()
    ],
    function (appVersion) {
        var debug = localStorage.getItem('debug') || 'false';
        //TODO: once we get the build generating minified files in bin, remove the line below
        //var debug = 'true';
        //var baseUrl = (debug === 'true') ? '../script/src' : '../script/bin';
        //var baseUrl = '../script/src';

        var runTestMode = (localStorage.getItem("OldTestMode") || "false") === 'true';

        define('jsapi', ['async!https://www.google.com/jsapi'],
            function(){
                return window.google.maps;
            });


        return {
            configure: function () {
                requirejs.config({
                    urlArgs: 'v=' + appVersion.version, // + '&_=' + (new Date()).getTime(),
                    //baseUrl: baseUrl,
                    waitSeconds: 15,
                    paths: {
                        applicationVersion: '../appversion',
                        jquery: 'lib/jquery-1.8.2',
                        jqueryui: ['lib/jquery-ui-1.9.2.custom'],
                        jquerytimepicker: ['lib/jquery-ui-timepicker'],
                        jqueryslider: ['lib/jquery-slider-access'],
                        underscore: 'lib/underscore',
                        backbone: 'lib/backbone',
                        backboneValidation: 'lib/backbone-validation-amd',
                        backbonePaginator: ['lib/backbone.paginator/lib/backbone.paginator'],
                        backboneSubviews: ['lib/backbone.subviews'],
                        backgrid: ['lib/backgrid/lib/backgrid'],
                        backgridSelectAll: ['lib/backgrid-select-all/backgrid-select-all'],
                        backgridFilter: ['lib/backgrid-filter/backgrid-filter'],
                        text: ['lib/text'],
                        async: ['lib/async'],
                        asyncjs: ['lib/asyncjs'],
                        publicTemplates: ['../../public/templates'],
                        highstock: ['lib/highstock'],
                        oldcore: ['../prama-core'],
                        oldui: ['../prama-ui'],
                        doT: ['lib/doT'],
                        coredata: (runTestMode ? 'demo/domain/CoreData_Test': 'demo/domain/CoreData_Demo')
                    },
                    shim: {
                        jquery: {

                        },
                        backbone: {
                            deps: ['underscore', 'jquery'],
                            exports: 'Backbone'
                        },
                        jqueryui: {
                            deps: ['jquery']
                        },
                        jqueryslider: {
                            deps: ['jqueryui']
                        },
                        jquerytimepicker: {
                            deps: ['jqueryui','jqueryslider']
                        },
                        'backboneSubviews': {
                            deps: ['backbone'],
                            exports: 'Backbone.Subviews'
                        },
                        underscore: {
                            exports: '_'
                        },
                        backgrid: {
                            deps: ['backbone', 'underscore'],
                            exports: 'Backgrid'
                        },
                        backgridSelectAll: {
                            deps: ['backgrid']
                        },
                        backgridFilter: {
                            deps: ['backgrid']
                        },
                        highstock: { } ,
                        doT: { },
                        oldcore: {
                            deps: ['jquery']
                        },
                        oldui: {
                            deps: ['jquery','jqueryui']
                        }
                    }
                });
            }
        }
    }
);



