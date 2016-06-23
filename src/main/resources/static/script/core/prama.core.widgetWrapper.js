define(
    [

    ],
    function () {
        var wrapper = {
            createWidget: function (jqObject, widgetName, options) {
                return jqObject[widgetName](options);
            },
            updateWidget: function (jqObject, widgetName, method, property, value) {
                return jqObject[widgetName](method, property, value);
            },
            queryWidget: function (jqObject, widgetName, method, property) {
                return jqObject[widgetName](method, property);
            },
            createSubmit: function (jqObject, options) {
                return this.createWidget(jqObject, 'csSubmit', options);
            },
            updateSubmit: function (jqObject, method, property, value) {
                return this.updateWidget(jqObject, 'csSubmit', method, property, value);
            },
            querySubmit: function (jqObject, method, property) {
                return this.queryWidget(jqObject, 'csSubmit', method, property);
            }
        };
        return wrapper;
    }
);