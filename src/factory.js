(function(context, $) {

    'use strict';

    var components = MONKEY.Components || {};

    //define plugin js is exist
    $.fn.isExist = function(selector, callback) {
        var element = this.find( selector );

        if ( element.length && typeof callback == 'function' ) {
            callback.call( null, element, this );
        }

        return element.length;
    };

    $.fn.getComponent = function() {
        return this.data( '_component' );
    };

    MONKEY.factory = {
        create : function(container) {
            container.isExist( '[data-component]', this.constructor.bind( this ) );
        },

        constructor : function(elements) {
            elements.each( this.each.bind( this ) );
        },

        extend : function(name, reflection) {
            var mirror
              , method
            ;

            if ( typeof components[name] != 'function' ) {
                return;
            }

            mirror = components[name].fn;

            for ( method in mirror ) {
                if ( !~( reflection.overrides || [] ).indexOf( method ) ) {
                    reflection.fn[method] = mirror[method];
                }
            }
        },

        each : function(index, target) {
            var $el       = $( target )
              , extend    = $el.data( 'extend' )
              , name      = MONKEY.utils.toTitleCase( $el.data( 'component' ) )
              , instance  = null
            ;

            if ( typeof components[name] != 'function' ) {
                return;
            }

            if ( extend ) {
                this.extend( MONKEY.utils.toTitleCase( extend ), components[name] );
            }

            instance = components[name].call( null, $el );
            $el.data( '_component', instance );
        }
    };

})( window, LibraryDOM );
