define(
    [
        'impl/repositories/HardwareRepository',
        'impl/repositories/LandRepository',
        'core/prama.core.events',
        'core/prama.core.mvc'
    ],
    function ( hardwareRepo, landRepo, events, mvc ) {
        var isLoaded = {
            unfiltered: false
        };
        var collections = { unfiltered: {} };

        events.on("zone:modified", function (zone) {
            var trigger = false;
            _.each(collections, function (collectionSet) {
                if (collectionSet.zones) {
                    collectionSet.zones.add(zone);
                    trigger = true;
                }
            });
            if (trigger) {
                events.trigger("zones:modified");
            }
        });
        events.on("zone:deleted", function (zone) {
            var trigger = false;
            _.each(collections, function (collectionSet) {
                if (collectionSet.zones) {
                    //todo: why is this model not the same?
                    var deletedZone = collectionSet.zones.where({id: zone.id});
                    if (deletedZone) {
                        collectionSet.zones.remove(deletedZone);
                        trigger = true;
                    }
                }
            });
            if (trigger) {
                events.trigger("zones:modified");
            }
        });
        events.on("field:saved", function (field) {
            var Field = mvc.createModel(landRepo.fieldModelDefinition);
            _.each(collections, function (collectionSet) {
                if (collectionSet.fields) {
                    if (!collectionSet.fields.get(field)) {
                        var fieldModel = new Field(field);
                        collectionSet.fields.add(fieldModel);
                        events.trigger("field:added", fieldModel);
                    }
                }
            });
        });
        events.on( "field:deleted", function ( fieldId ) {
            var trigger = false;
            _.each( collections, function ( collectionSet ) {
                if ( collectionSet.fields ) {
                    //todo: why is this model not the same?
                    var deletedField = collectionSet.fields.get( fieldId );
                    if ( deletedField ) {
                        collectionSet.fields.remove( deletedField );
                        trigger = true;
                    }
                }
            } );
            if ( trigger ) {
                events.trigger( "fields:modified" );
            }
        } );

        return {
            load: function (filter) {
                var loaded = $.Deferred();
                var that = this;
                if (!collections[filter]) {
                    collections[filter] = {};
                }
                var collectionSet = filter ? collections[filter] : collections.unfiltered;
                var filterKey = filter ? filter : "unfiltered";
                $.when( hardwareRepo.loadProbeData( null, filter ) )
                    .then( function ( probes ) {
                               collectionSet.probes = probes;
                               return hardwareRepo.loadGatewayData( filter, probes );
                           } )
                    .then( function ( gateways ) {
                               collectionSet.gateways = gateways;
                               return hardwareRepo.loadAlertData( filter );
                           } )
                    .then( function ( alertData ) {
                               collectionSet.alerts = alertData;
                               hardwareRepo.assignAlertsToGateways( collectionSet.gateways, alertData );
                               hardwareRepo.assignProbesToGateways( collectionSet.gateways, collectionSet.probes );
                               return that.refreshLand( filter );
                           } )
                    .then( function ( landCollections ) {
                               collectionSet.zones = landCollections.zones;
                               collectionSet.fields = landCollections.fields;
                               collectionSet.totalLands = landCollections.totalLands;
                           } )
                    .done( function () {
                               isLoaded[filterKey] = true;
                               loaded.resolve( collectionSet );
                           } )
                    .fail( function ( reason ) {
                               console.log( '- data: load() fail: %s', reason );
                           } );

                return loaded.promise();
            },
            loadCollections: function (filter) {
                var deferred = $.Deferred();
                var filterKey = filter ? filter : "unfiltered";
                if (isLoaded[filterKey]) {
                    return deferred.resolve(collections[filterKey]).promise();
                }
                this.load(filter).then( function () { deferred.resolve(collections[filterKey]) } );
                return deferred.promise();
            },
            findItemInCurrentCollections: function (itemType, itemId) {
                var item = null;
                _.each(collections, function (collectionSet) {
                    if (collectionSet[itemType]) {
                        item = collectionSet[itemType].get(itemId) || item;
                    }
                });
                return item;
            },
            findItemInCollection: function (itemType, itemId) {
                var deferred = $.Deferred();
                var item = this.findItemInCurrentCollections(itemType, itemId);
                var that = this;
                if (item) {
                    deferred.resolve(item);
                } else {
                    this.loadCollections().done( function () {
                        item = that.findItemInCurrentCollections(itemType, itemId);
                        deferred.resolve(item);
                    });
                }
                return deferred.promise();
            },
            addToAllCollections: function (itemType, item) {
                _.each(collections, function (collectionSet) {
                    if (collectionSet[itemType]) {
                        collectionSet[itemType].push(item);
                    }
                });
            },
            refreshLand: function (filter) {
                var refreshed = $.Deferred();
                var landCollections = null;
                var filterKey = filter ? filter : "unfiltered";
                $.when( landRepo.loadLandData(filter) )
                    .then( function ( landData ) {
                               landCollections = landRepo.buildLandCollections( landData, collections[filterKey].probes );
                               landCollections.totalLands = landData.totalLands;
                           } )
                    .done( function () {
                               refreshed.resolve( landCollections );
                           } )
                    .fail( function ( reason ) {
                               console.log( '- data: refreshLand() fail: %s', reason );
                           } );

                return refreshed.promise();
            },
            getCollections: function (filter) {
                var filterKey = filter ? filter : "unfiltered";
                if ( ! isLoaded[ filterKey ] ) {
                    console.log( '- data: getCollections() called before load()!' );
                }
                return collections[filterKey];
            }
        };
    }
);