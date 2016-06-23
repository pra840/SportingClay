define(
    function () {
        var sessionPreferences = {};
        var preferencesFetched = false;
        return {
            getObject: function (key) {
                if (!JSON && !JSON.parse) {
                    alert("browser does not natively support JSON parsing")
                }
                if (sessionPreferences[key] && sessionPreferences[key] != "undefined") {
                    return sessionPreferences[key];
                } else {
                    return false;
                }
            },
            setObject: function (key, obj) {
                if (!JSON && !JSON.parse) {
                    alert("browser does not natively support JSON parsing")
                }
                sessionPreferences[key] = obj;
                if (preferencesFetched){
                    // save changes to server
                    this.storeData();
                }
            },
            set: function (key, value, callback) {
                sessionPreferences[key] = value;
                if (preferencesFetched){
                    // save changes to server
                    this.storeData(( callback ? callback : null));
                }
            },
            get: function (key) {
                if (sessionPreferences[key]) {
                    return sessionPreferences[key];
                } else {
                    return false;
                }
            },
            clear: function (key, callback) {
                if (!_.isUndefined(sessionPreferences[key])){
                    delete sessionPreferences[key];
                    this.storeData(callback);
                } else if (callback) {
                    callback();
                }
            },
            storeData: function (callback) {
                var data = {
                    sessionPreferences: JSON.stringify(sessionPreferences)
                }
                require(['core/prama.core.ajax'],
                    function(ajax) {
                        if (!window.OFFLINE_MODE) {
                            ajax.post("PostSessionPreferences", data, function () {
                                if (callback) {
                                    callback();
                                }
                            }, { onAjaxError: function () { /* du nuthin */
                            } });
                        } else {
                            if (callback) {
                                callback();
                            }
                        }
                });
            },
            populatePreferences: function(preferences){
                if (preferences){
                    $.extend(true, sessionPreferences, preferences);
                }
                preferencesFetched = true;
            }
        }
    }
);