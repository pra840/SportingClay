define(
    function () {
        //var debug = localStorage.getItem("debug") || "false";
        //TODO: once we get the build generating minified files in bin, remove the line below
        var debug = "true";
        var baseUrl = (debug === "true") ? '../script/src' : '../script/bin';
        return {
            configure: function () {
                requirejs.config({
                    baseUrl: baseUrl,
                    waitSeconds: 15,
                    paths: {
                        jquery: 'lib/jquery/jquery',
                        jqueryui: ['lib/jquery-ui'],
                        underscore: 'lib/underscore',
                        backbone: 'lib/backbone',
                        doT: ['lib/doT.min'],
                        text: ['lib/text'],
                        async: ['lib/async'],
                        templates: ['../../templates'],
                        publicTemplates: ['../../public/templates'],
                        highstock: ['lib/highstock']
                    },
                    shim: {
                        jquery: {

                        },
                        jqueryui: {
                            deps: ['jquery']
                        },
                        fccore: {
                            deps: ['jquery']
                        },
                        backbone: {
                            deps: ["underscore", "jquery"],
                            exports: "Backbone"
                        },
                        underscore: {
                            exports: "_"
                        } ,
                        highstock: { }
                    }
                });
            }
        }
    }
);




