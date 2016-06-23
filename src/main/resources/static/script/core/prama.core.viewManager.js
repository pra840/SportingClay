define(
    [
    ],
    function () {
        var views = {};
        var currentView;
        var getView = function (path, callback, options) {
            if (views[path]) {
                callback(views[path]);
            } else {
                require([path],
                    function (view) {
                        var viewOptions = $.extend({ }, options);
                        var viewInstance = new view(viewOptions);
                        if (!viewOptions.preventSave) {
                            //TODO: destroy view when next view is shown
                            views[path] = viewInstance;
                        }
                        if (!viewOptions.fragment) {
                            viewInstance.add();
                        }
                        callback(viewInstance);
                        if (viewOptions.afterInit) {
                            viewOptions.afterInit(viewInstance);
                        }
                    }
                );
            }
        }
        return {
            showView: function (path, options) {
                var callback = function (view) {
                    options = options || {};
                    //what is the best way to inject functionality
                    // such as transitioning between views, etc.?
                    // events? master application transitions handler?
                    if (!options.fragment && currentView) {
                        currentView.hide();
                    }
                    if (options.beforeShow) {
                        options.beforeShow(view);
                    }
                    var viewInstance = view.show();
                    if (!options.fragment) {
                        currentView = viewInstance;
                    }
                };
                getView(path, callback, options);
            },
            showViewFragment: function (path, options) {
                options.fragment = true;
                this.showView(path, options);
            }
        };
    }
);