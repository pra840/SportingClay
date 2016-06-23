define(
    function () {
        return {
            stasher: function (stashType, extender) {
                var stash = {};
                var stasher = {
                    set: function (id, it) {
                        stash[id] = it;
                    },
                    get: function (id) {
                        if (!stash[id]) {
                            throw (stashType + ": " + id + "' has not been registered.");
                        }
                        return stash[id];
                    }
                };
                if (extender) {
                    $.extend(stasher, extender);
                }
                return stasher;
            },
            duplicate: function(obj) {
                var clone = $.extend(true, {}, obj);
                return clone;
            },
            createLookup: function(collection, property) {
                var item, key, lookup = {};
                for (var i = 0, len = collection.length; i < len; i++) {
                    item = collection[i];
                    key = item[property];
                    if (lookup.hasOwnProperty(key)) {
                        throw "duplicate keys are not allowed: " + key;
                    }
                    lookup[key] = item;
                }
                return lookup;
            },
            compareNonModelsByName: function (a, b) {
                var nameA = a.name.toLowerCase();
                var nameB = b.name.toLowerCase();
                if (nameA < nameB) { return -1 }
                if (nameA > nameB) { return 1 }
                return 0;
            },
            sortBackgridColumnsByName: function(){

            },
            sortNonModelsByProp: function (collection, prop) {
                var sorter = function(a, b) {
                    var propA = a[prop].toLowerCase();
                    var propB = b[prop].toLowerCase();
                    if (propA < propB) { return -1 }
                    if (propA > propB) { return 1 }
                    return 0;
                }
                var sortedCollection = collection;
                sortedCollection.sort(sorter);
                return sortedCollection;
            },
            compareModelsByName: function (a, b) {
                var nameA = a.get('name').toLowerCase();
                var nameB = b.get('name').toLowerCase();
                if (nameA < nameB) { return -1 }
                if (nameA > nameB) { return 1 }
                return 0;
            },
            findById: function(collection, id){
                var object = _.find(collection, function(obj){
                    return obj.id == id;
                });
                return object;
            },
            extendObjectArrays: function(collection1, collection2, prop){
                if (!collection1 || !collection2) {
                    console.log("core.extendObjectArrays() must be passed two collections");
                    return false;
                }
                if (!_.isArray(collection1) || !_.isArray(collection2)) {
                    console.log("collection parameters must be arrays");
                    return false;
                }
                var key = (prop ? prop : "id");
                var objectArray = $.extend([], collection1);
                for (var i = 0; collection2.length > i; i++){
                    var itemA = collection2[i];
                    if (collection1.length){
                        var itemExists = false;
                        for (var c = 0; collection1.length > c; c++){
                            var itemB = collection1[c];
                            if (itemB[key] === itemA[key]){
                                itemExists = true;
                            }
                        }
                        if (!itemExists){
                            objectArray.unshift(itemA);
                        }
                    } else {
                        objectArray.unshift(itemA);
                    }
                }
                return objectArray;
            }
        }
    }
);


