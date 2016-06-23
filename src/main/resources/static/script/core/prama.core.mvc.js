define(
    [
        'core/prama.core.util',
        'core/prama.core.session',
        'doT',
        'core/prama.core.domain',
        'core/prama.core.ajax',
        'core/prama.core.dateutility',
        'impl/translations',
        'backbone',
        'lib/backbone-validation-amd'
    ],
    function (fcUtil, session, doT, domain, ajaxProvider, dateUtil, translations) {
        //setup validation
        Backbone.Validation.configure({
            selector: 'class'
        });
        _.extend(Backbone.Validation.callbacks, {
            valid: function(view, attr, selector) {
                view.$('[' + selector + '~=' + attr + ']')
                    .removeClass('has-validation-error')
                    .removeAttr('data-error')
                    .next('.validation-error').remove();
                view.trigger("model:valid:"+attr);
                view.model.trigger("valid:"+attr);
            },
            invalid: function(view, attr, error, selector) {     
            	$invalidErrorSelector = view.$('[' + selector + '~=' + attr + ']');
            	if (!$invalidErrorSelector.hasClass('has-validation-error'))
            	{
                    // check to avoid displaying the same error message
                    if ($invalidErrorSelector.next() && error != $invalidErrorSelector.next().text()) {
                        $invalidErrorSelector
                            .attr('data-error', error)
                            .after("<span class='validation-error' automation-id='"+ attr + "-" + error +"'>" + error + "</span>");
                    }
                    $invalidErrorSelector.addClass('has-validation-error');
            	}  else {
                    // check to avoid displaying the same error message
            		if (error != $invalidErrorSelector.next().text()) {
            			$invalidErrorSelector.next().text(error)
                            .attr("automation-id",attr + "-" + error );
            		} 
            	}

                view.trigger("model:invalid:"+attr);
                view.model.trigger("invalid:"+attr);
            }
        });
        _.extend(Backbone.Validation.validators, {
            //TODO: load translations earlier so that we can use standard backbone pattern validator
            pattern: function(value, attr, options, model) {
                if (value && !value.toString().match(options.pattern)) {
                    return translations.get(options.msg);
                }
            },
            required: function (value) {
                if (typeof(value) === "undefined" || $.trim(value.toString()).length === 0) {
                    return translations.get("RequiredMsg");
                }
            },
            maxLength: function(value, attr, maxLength, model) {
                if (value && $.trim(value).length > maxLength) {
                    return this.format(Backbone.Validation.messages.maxLength, this.formatLabel(attr, model), maxLength);
                }
            },
            before: function (value, attr, afterAttr, model) {
                var afterValue = model.get(afterAttr);
                if (value && afterValue) {
                    if (value >= afterValue) {
                        //TODO: make a real error message
                        return this.formatLabel(attr, model) + " " + translations.get("Msg_MustBeBefore") +" " + this.formatLabel(afterAttr, model);
                    }
                }
            },
            after: function (value, attr, beforeAttr, model) {
                var beforeValue = model.get(beforeAttr);
                if (value && beforeValue) {
                    if (value >= beforeValue) {
                        //TODO: make a real error message
                        return this.formatLabel(attr, model) + " " + translations.get("Msg_MustBeAfter") +" " + this.formatLabel(beforeAttr, model);
                    }
                }
            },
            decimal: function (value, attr, options, model) {
                var defaultOptions = {
                    maxDigits: 3,
                    decimals: 2,
                    allowNegatives: true
                };

                var options = _.extend(defaultOptions, options);
                if(options.allowNegatives) {
                    var regex = new RegExp("^-?\\d{0," + options.maxDigits + "}(?:\\.\\d{1," + options.decimals + "})?$");
                } else {
                    var regex = new RegExp("^\\d{0," + options.maxDigits + "}(?:\\.\\d{1," + options.decimals + "})?$");
                }
                var valid = regex.test(value);
                if (!valid) {
                    return translations.format(translations.get("Msg_InvalidDecimal"), options.maxDigits, options.decimals);
                }
            },
            minMaxDecimal: function (value, attr, options, model) {
                var defaultOptions = {
                    minDigits:1,
                    maxDecimals: 2,
                    allowNegatives: true,
                    minDecimals: 1
                };

                var options = _.extend(defaultOptions, options);
                if(options.allowNegatives) {
                    var regex = new RegExp("^-?\\d{" + options.minDigits + ",}\\.\\d{"+options.minDecimals +"," + options.maxDecimals + "}$");
                } else {
                    var regex = new RegExp("^\\d{" + options.minDigits + ",}\\.\\d{"+options.minDecimals+"," + options.maxDecimals + "}$");
                }
                var valid = regex.test(value);
                if (!valid) {
                    return translations.format(translations.get("Msg_InvalidDecimalMinMaxForLatLong"), options.minDecimals, options.maxDecimals);
                }
            },
            afterDate: function (value, attr, options){
                if(value){
                    var afterDate = new Date();
                    afterDate.setHours(0, 0, 0, 0);
                    afterDate.setDate(afterDate.getDate() + options.days);
                    if(value < afterDate.getTime())  {
                        return translations.get(options.message);
                    }
                }
            },
            date: function(value, attr, options){
                if (value){
                    var date = new Date(value);
                    if (!date || isNaN(date.getDate())){
                        return translations.get("InvalidDateTime");
                    }
                }
            }
        });
        _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);
        var request = {}, queryString = location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g, m;
        while (m = re.exec(queryString)) {
            request[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }
        //add some functions to async
        //async.callservice = function ()
        return {
            controllers: fcUtil.stasher("Controller",
                {
                }
            ),
            repositories: fcUtil.stasher("Repository",
                {
                }
            ),
            views: fcUtil.stasher ("View",
                {
                    showView: function (viewId, model) {
                        var view = this.get(viewId);
                        if (view) {
                            view.show(model);
                        }
                    }

                }
            ),
            requestProvider: ajaxProvider,
            bindValidation: function (view) {
                Backbone.Validation.bind(view);
            },
            createModel: function (obj) {
                var model = {
                    equals: function (b) {
                        var a = this;
                        return a.id == b.id;
                    },
                    hashCode: function () {
                        return this.id;
                    },
                    startEdit: function () {
                        this._revertAttributes = _.clone(this.attributes);
                    },
                    revertEdit: function () {
                        var that = this;
                        var previous = this._revertAttributes;
                        if (previous){
                            _.each(_.keys(this.attributes), function (attr) {
                                if (!_.has(previous, attr)) {
                                   that.unset(attr);
                                }
                            });
                            that.set(previous);
                        }
                    }
                };
                var converted = $.extend(model, obj);
                return Backbone.Model.extend(converted);
            },

            createCollection: function ( options ) {
                var constructor = Backbone.Collection.extend( options );
                return new constructor();
            },
            extendCollection: function ( options ) {
                return Backbone.Collection.extend( options );
            },
            createRouter: function (definition) {
                var constructor = Backbone.Router.extend(definition);
                return new constructor();
            },
            prepView: function (definition) {
                var mvcCore = this;
                var viewBase = {
                    templates: {},
                    children: {},
//                    add: function () {
//                        $('#content').append(this.$el);
//                    },
                    show: function (options) {
                        this.trigger("view:shown", options);
                        this.$el.show();
                        this.trigger("view:show");
                        return this;
                    },
                    hide: function () {
                        this.trigger("view:hide");
                        this.$el.hide();
                        return this;
                    },
                    destroy: function() {
                        this.trigger("destroy");
                        this.undelegateEvents();
                        this.$el.removeData().unbind();
                        $.each(this.backgroundRequests, function (xhr) {
                            ajaxProvider.cancel(xhr);
                        });
                        this.remove();
                        Backbone.View.prototype.remove.call(this);
                    },
                    backgroundRequests: [],
                    loadInBackground: function (backgroundFunction) {
                        var xhr = backgroundFunction();
                        if (xhr) {
                            this.backgroundRequests.push(xhr);
                            xhr.always(
                                function () {
                                    this.backgroundRequests.remove(xhr);
                                }
                            );
                        }
                    },
                    bindValidationOnChildren: function (model, options) {
                        var that = this;
                        _.each(model.attributes, function (val) {
                            if (val instanceof Backbone.Model) {
                                Backbone.Validation.bindSpecificModel(that, val, options);
                                that.bindValidationOnChildren(val, options);
                            }
                        });
                    },
                    bindValidation: function (options) {
                        Backbone.Validation.bind(this);
                        options = _.extend({}, Backbone.Validation.defaultOptions, Backbone.Validation.defaultCallbacks, options);
                        this.bindValidationOnChildren(this.model, options);
                    },
                    constructor: function() {
                        var that = this;
                        this.on("view:wait:start", function (message) {
                            that.options.hideWaitView = false;
                            that.startWait(message);
                        }, that);
                        this.on("view:wait:update", function (updates) {
                            that.updateWait(updates);
                        }, that);
                        this.on("view:wait:close", function (options, message) {
                            that.endWait(options);
                        }, that);
                        // Call the original constructor
                        Backbone.View.apply(this, arguments);
                    },
                    updateWait: function (updates) {
                        var waitView = this.options.waitView;
                        if (waitView) {
                            waitView.model.set(updates);
                        }
                    },
                    endWait: function (options) {
                        this.options.hideWaitView = true;
                        var waitView = this.options.waitView;
                        if (waitView) {
                            //waitView.hide();
                            waitView.destroy();
                        }
                    },
                    startWait: function (message, callback, waitOptions) {
                        this.options.hideWaitView = false;
                        var view = this;
                        require(['ui/components/MessageComponent'], function (vw) {
                            var ModelConstructor = mvcCore.createModel({});
                            var options = waitOptions || {};
                            var model = new ModelConstructor(
                                {
                                    message: message ? message : translations.get("Msg_PageLoading")
                                }
                            );
                            options.model = model;
                            if (!options.container){
                                var dialog = $('.dialog-view:visible');
                                if (!dialog || dialog.length === 0) {
                                    options.container = view.$el;
                                } else if (dialog.length > 1) {
                                    options.container = $(dialog[dialog.length-1]);
                                } else {
                                    options.container = dialog;
                                }
                            }
                            var existingWait = view.options.waitView;
                            view.options.waitView = new vw(options);
                            if (!view.options.hideWaitView){
                                options.container.append(view.options.waitView.$el);
                            }
                            if (existingWait) {
                                existingWait.destroy();
                            }
                            if (callback) {
                                callback();
                            }
                        });
                    },
                    validateModelAndChildren: function (model) {
                        model.validate();
                        var that = this;
                        var valid = model.isValid();
                        if (!valid) { return false; }
                        var childrenValid = true;
                        var val;
                        _.each(model.attributes, function (val) {
                            if (val instanceof Backbone.Model) {
                                var childValid = that.validateModelAndChildren(val);
                                if (!childValid) {
                                    childrenValid = false;
                                }
                            }
                        });
                        return childrenValid;
                    },
                    isThisAValidModel: function(options) {
                        var valid;
                        if(options && options.propertiesToSave) {
                            valid = this.validateModelAndChildren(this.model.get(options.propertiesToSave));
                        } else {
                            var that = this;
                            _.each(this.model.attributes, function(val, key) {
                                if(val instanceof Backbone.Model) {
                                    if(val.get("blankModel")) {
                                        delete that.model.attributes[key];
                                    }
                                }
                            });
                            valid = this.validateModelAndChildren(this.model);
                        }
                        return valid;
                    },
                    saveModel: function (repository, saveFunction, options, callback) {
                        var valid = this.isThisAValidModel(options);
                        var that = this;
                        if (valid) {
                            if (options && options.beforeSave) {
                                options.beforeSave();
                            }
                            //TODO: rework to use events instead of all of these callbacks?
                            var onWaitStarted = function () {
                                var onResponse = function(response) {
                                    if (response.success) {

                                        var finish = function () {
                                            if (options && options.updateModel){
                                                options.updateModel(response.data);
                                            }
                                            if(that.viewContext) {
                                                that.viewContext.set("editing", false);
                                            } else {
                                                that.options.editing = false;
                                            }
                                            that.model.trigger('saved', that.model);
                                            that.render();
                                            that.trigger("view:wait:close");
                                            that.trigger("view-action-save");
                                            if(callback){
                                                callback(response.data);
                                            }
                                        };

                                        if (options && options.successMessage){
                                            that.trigger("view:wait:update", {
                                                action: finish,
                                                imageClass: "icon-success",
                                                message: translations.get(options.successMessage),
                                                actionText: translations.get("CloseAction")
                                            });
                                        }   else{
                                              finish();
                                        }
                                    } else {
                                        if (options && options.customErrorHandler) {
                                            that.trigger("view:wait:close");
                                        } else {
                                            var finish = function () {
                                                that.trigger("view:wait:close");
                                            };
                                            var message = translations.get("SaveFailure");
                                            var messageText = null;
                                            if (!response) {
                                                return;
                                            }
                                            if (response.messages && response.messages.length > 0) {
                                                messageText = "";
                                                for (var i = 0; i < response.messages.length; i++) {
                                                    messageText += response.messages[i].message;
                                                }
                                                if (messageText.length == 0) {
                                                    messageText = translations.get("Err_Unknown") + ": message missing";
                                                }
                                            } else {
                                                if (!response.success) {
                                                    messageText = translations.get("Err_Unknown");
                                                }
                                            }
                                            message += " " + messageText;
                                            that.trigger("view:wait:update", {
                                                action: finish,
                                                imageClass: "icon-error",
                                                message: message,
                                                actionText: translations.get("TryAgainAction")
                                            });
                                        }
                                    }
                                };
                                repository[saveFunction].call(repository, that.model, onResponse, options);
                            };
                            this.startWait(translations.get("Msg_PleaseWaitSaving"), onWaitStarted);
                        }
                    }
                };
                return $.extend(viewBase, definition);
            },
            createView: function (definition) {
                definition = this.prepView(definition)
                var view = Backbone.View.extend(definition);
                return view;
                //returns the constructor, not an actual instance
                //  as the view constructor requires additional parameters
            },
            extendViewDefinition: function (viewDefinition, extension) {
                var clone_ext = $.extend(true, {}, extension);
                var clone_view = $.extend(true, {}, viewDefinition);
                if(_.has(clone_view, "subviewCreators") && _.has(clone_ext, "subviewCreators")) {
                    $.extend(clone_view.subviewCreators, clone_ext.subviewCreators);
                    delete clone_ext.subviewCreators;
                }
                if(_.has(clone_view, "events") && _.has(clone_ext, "events")) {
                    $.extend(clone_view.events, clone_ext.events);
                    delete clone_ext.events;
                }
                $.extend(clone_view, clone_ext);
                return $.extend({}, clone_view, clone_ext);
            },
            createRepository: function (definition) {
                var repoBase = {
                    async: function (functionName) {
                        var that = this;
                        var args = Array.prototype.slice.call(arguments, 1);
                        return function (asyncCallback) {
                            args.unshift(
                                function (response) {
//                                    if (response.success) {
//                                        callback(response.data);
//                                    }
                                    asyncCallback(response.message, response.data);
                                }
                            );
                            that[functionName].apply(this, args);
                        }
                    }
                };
                _.extend(repoBase, definition);
                return repoBase;
            },
            createPage: function (definition) {
                var page = {
                    load: function () {
                        this.initialize();
                    }
                };
                $.extend(page, definition);

                //backwards compatibility
                this.page = page;
                if (prama) {
                    prama.registerPage(page.key, page.translationDefaults, function () { page.load(); }, domain.services);
                    prama.runAutoLoad();
                }
            },
            eventify: function (obj) {
                _.extend(obj, Backbone.Events);
            },
            dataSuccess: function (data) {
                return {
                    success: true,
                    data: data
                };
            },
            dataFail: function (response) {
                return response;
            },
//            mergeModels: function (deep, a, b) {
//                if (typeof deep !== "boolean") {
//                    a = deep;
//                    b = a;
//                    deep = false;
//                }
//                if (a == null || b == null) {
//                    return a;
//                }
//                var c = $.extend(true, {}, a);
//                for (var propertyName in b)
//                    if (b.hasOwnProperty(propertyName)) {
//                        if (deep && a.hasOwnProperty(propertyName)) {
//                            var type = Object.prototype.toString.call(b[propertyName]);
//                            switch (type) {
//                                case '[object Array]':
//                                    if (Object.prototype.toString.call(c[propertyName]) === '[object Array]') {
//                                        c[propertyName] = this.mergeArrays(a[propertyName], b[propertyName]);
//                                    } else {
//                                        c[propertyName] = b[propertyName];
//                                    }
//                                    break;
//                                case '[object Object]':
//                                case '[object Function]':
//                                    c[propertyName] = this.mergeModels(a[propertyName], b[propertyName], deep);
//                                    break;
//                                default:
//                                    c[propertyName] = b[propertyName];
//                            }
//
//                        } else {
//                            c[propertyName] = b[propertyName];
//                        }
//                    }
//
//                return c;
//            },
//            mergeArrays: function (a, b) {
//                var result = [];
//                var hashed = {};
//                var item;
//                var hasHashCode = function (o) {
//                    return typeof o.hashCode === 'function';
//                };
//                for (var i = 0, len = a.length; i < len; i++) {
//                    item = a[i];
//                    if (item) {
//                        if (hasHashCode(item)) {
//                            hashed[item.hashCode()] = { position: i, item: item };
//                        } else {
//                            result.push(item);
//                        }
//                    }
//                }
//                var matchingItem;
//                var mergedItemHashes = [];
//                var itemHash;
//                for (var i = 0, len = b.length; i < len; i++) {
//                    item = b[i];
//                    if (item) {
//                        if (hasHashCode(item)) {
//                            itemHash = item.hashCode();
//                            matchingItem = hashed[itemHash];
//                            var foundMatch = matchingItem != null && matchingItem != 'undefined';
//                            if (foundMatch) {
//                                mergedItemHashes.push(itemHash.toString());
//                                result.splice(matchingItem.position, 0, this.mergeModels(true, matchingItem.item, item));
//                            } else {
//                                result.push(item);
//                            }
//                        } else {
//                            result.push(item);
//                        }
//                    }
//                }
//                //add back in any models from original list that weren't merged with matches from second list
//                for (hash in hashed) {
//                    if (hashed.hasOwnProperty(hash)) {
//                        if (!hash) { continue; }
//                        if (mergedItemHashes.indexOf(hash) === -1) {
//                            matchingItem = hashed[hash];
//                            result.splice(matchingItem.position, 0, matchingItem.item);
//                        }
//                    }
//                }
//                return result;
//            },
            transformToCollection: function (inArray) {
                var coll = this.createCollection();
                var modelConstructor = this.createModel({});
                var item;
                for (var i = 0, len = inArray.length; i < len; i++) {
                    item = inArray[i];
                    coll.push(new modelConstructor(item));
                }
                return coll;
            },
            view: {
                compileTemplate: function (text, subtemplates) {
                    //can add in caching of templates, etc.?
                    if (subtemplates) {
                        return doT.template(text, null, subtemplates);
                    } else {
                        return doT.template(text);
                    }
                },
                request: request,
                showMessage: function (message) {
                    alert(message);
                }
            }
        };
    }
);