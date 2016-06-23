define(
    function () {
        function checkJSON() {
            if ( !( JSON || JSON.parse || JSON.stringify ) ) {
                alert( "browser does not natively support JSON parsing" )
            }
        }

        return {
            getObject: function ( key ) {
                checkJSON();
                var val = localStorage.getItem( key );
                if ( val && !_.isUndefined( val ) ) {
                    return JSON.parse( val );
                } else {
                    return false;
                }
            },
            setObject: function ( key, obj ) {
                checkJSON();
                localStorage.setItem( key, JSON.stringify( obj ) );
            },
            set: function ( key, value ) {
                localStorage.setItem( key, value );
            },
            get: function ( key ) {
                var val = localStorage.getItem( key );
                if ( val ) {
                    return val;
                } else {
                    return false;
                }
            },
            remove: function ( key ) {
                localStorage.removeItem( key );
            },
            clear: function ( key ) {
                var val = localStorage.getItem( key );
                if ( !_.isUndefined( val ) ) {
                    localStorage.removeItem( key );
                }
            }
        }
    }
);