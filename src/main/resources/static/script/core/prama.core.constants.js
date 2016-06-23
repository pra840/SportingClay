define(
    function ( require ) {
        var constants = {};

        constants.groups = {
            GROUP_ALL_ZONES: {
                id: -2,
                name: 'All Zones',
                landIds: []
            },
            GROUP_UNASSIGNED_ZONES: {
                id: -1,
                name: 'Unassigned Zones',
                landIds: []
            },
            ShowArchivedZonesKey: 'groups.showArchivedZones',
            HasDefaultFilterKey: 'groups.hasDefaultFilter',
            DefaultFilterLoadedKey: 'groups.defaultFilterLoaded',
            HasGroupFilterKey: 'groups.hasGroupFilter'
        };

        constants.graphs = {
            SideBySideEnabled: 'graphs.sideBySideEnabled'
        };

        constants.updateTranslations = function () {
            var core = require( 'core/prama.core' );
            var translations = require( 'impl/translations' );

            var updated = $.Deferred();
            $.when( translations.loadCommon( core.mvc.requestProvider ) ).done(
                function () {
                    constants.groups.GROUP_ALL_ZONES.name = translations.get( 'AllZonesLabel' );
                    constants.groups.GROUP_UNASSIGNED_ZONES.name = translations.get( 'UnassignedZonesLabel' );
                    updated.resolve();
                } );

            return updated.promise();
        };

        return constants;
    }
);
