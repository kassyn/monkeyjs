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
            this.container = container;
            this.set( '[data-component]:not([data-depends],[data-cobj])' );
        },

        set : function(selector) {
            this.container.isExist( selector, this.constructor.bind( this ) );
        },

        constructor : function(elements) {
            console.log( elements );
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
            var $el    = $( target )
              , extend = $el.data( 'extend' )
              , behalf = $el.data( 'component' )
              , name   = MONKEY.utils.toTitleCase( behalf )
            ;

            if ( typeof components[name] != 'function' ) {
                return;
            }

            if ( extend ) {
                this.extend( MONKEY.utils.toTitleCase( extend ), components[name] );
            }

            this.build( name, $el, behalf );
        },

        build : function(name, $el, behalf) {
            var instance = components[name].call( null, $el );

            $el.data( '_component', instance );
            $el.attr( 'data-cobj', true );
            this.set( '[data-depends="' + behalf + '"]' );
        }
    };

})( window, LibraryDOM );
