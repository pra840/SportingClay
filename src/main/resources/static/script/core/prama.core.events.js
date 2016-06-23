define(
    ['backbone'],
    function () {
        var eventBroker = null;
        if ( Backbone && Backbone.Events ) {
            eventBroker = _.clone( Backbone.Events );
        } else {
            alert( 'Backbone or Backbone.Events not found' );
        }
        return eventBroker;
    }
);