define(
    [
        "core/prama.core.mvc",
        "core/prama.core.util",
        "core/prama.core.dateutility",
        "core/prama.core.domain",
        "impl/applicationconfiguration"
    ],

    function (mvc, util, dateUtil, domain, configuration, viewManager) {

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
        String.prototype.format = function () {
            var formatted = this;
            for (var i = 0; i < arguments.length; i++) {
                var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                formatted = formatted.replace(regexp, arguments[i]);
            }
            return formatted;
        };
        Number.prototype.isMultipleOf = function (secondNumber) {
            if (!secondNumber){
                return false;
            }

            //var remainder = Math.round(this % secondNumber); // round to two decimal places
            var remainder = this % secondNumber;
            return (remainder <= 0 || remainder == Math.round(secondNumber) ? true : false);
        };


        /*Array.prototype.findById = function(id, options){
            var collection = this,
                propName = "id",
                propValue = id,
                item;
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
        }*/

        return {
                mvc: mvc,
                util: util,
                dateUtil: dateUtil,
                domain: domain,
                navigate: function (key, urlParams) {
                    var path = configuration.pagePaths[key].url + (urlParams || '');

                    if (window.location.pathname == path.replace('..', '')){
                        window.location.reload();
                    } else {
                        window.location = path;
                    }
                },
                viewManager: viewManager
        };
    }
);