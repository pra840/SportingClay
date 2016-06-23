define(
    function () {
        var localPreferences = {};
        var preferencesFetched = false;
        return {
            getObject: function (key) {
                if (!JSON && !JSON.parse) {
                    alert("browser does not natively support JSON parsing")
                }
                if (localPreferences[key] && localPreferences[key] != "undefined") {
                    return localPreferences[key];
                } else {
                    return false;
                }
            },
            setObject: function (key, obj) {
                if (!JSON && !JSON.parse) {
                    alert("browser does not natively support JSON parsing")
                }
                localPreferences[key] = obj;
                if (preferencesFetched){
                    // save changes to server
                    this.storeData();
                }
            },
            set: function (key, value) {
                localPreferences[key] = value;
                var deferred = $.Deferred();
                if (preferencesFetched){
                    // save changes to server
                    this.storeData(deferred);
                }
                return deferred.promise();
            },
            get: function (key) {
                if (localPreferences[key]) {
                    return localPreferences[key];
                } else {
                    return false;
                }
            },
            clear: function (key) {
                if (!_.isUndefined(localPreferences[key])){
                    delete localPreferences[key];
                    this.storeData();
                }
            },
            storeData: function (deferred) {
                var data = {
                    localPreferences: JSON.stringify(localPreferences),
                    preferenceId: 4
                };
                require(['core/prama.core.ajax'],
                    function(ajax) {
                        ajax.post("PostUserPreferences", data, function() {
                            if (deferred) { deferred.resolve(); }
                        });
                    });
            },
            populatePreferences: function(preferences){
                if (preferences){
                    _.extend(localPreferences, preferences);
                }
                preferencesFetched = true;
            }
        }
    }
);