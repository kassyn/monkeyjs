;(function(factory) {
	if ( typeof window.MONKEY != 'function' ) {
		factory( jQuery || Zepto );
	}
}(function(LibraryDOM) {
(function(context, $) {

    'use strict';

    // Build a new module with the correct attributes and methods.
    function build() {
        var Constructor, Instance;

        Constructor = function() {
            // Initialize a new instance, which won't do nothing but
            // inheriting the prototype.
            var instance = new Instance();

            // Apply the initializer on the given instance.
            instance.initialize.apply( instance, arguments );

            return instance;
        };

        // Define the function that will be used to
        // initialize the instance.
        Instance = function() {};
        Instance.prototype = Constructor.prototype;

        // Save some typing and make an alias to the prototype.
        Constructor.fn = Constructor.prototype;

        // Define a noop initializer.
        Constructor.fn.initialize = function() {};

        return Constructor;
    }

    var MONKEY = function(namespace, callback, object, isGlobalScope) {
        var components = namespace.split(/[.:]+/)
          , scope      = context
          , component
          , last
        ;

        if ( !isGlobalScope ) {
            scope = scope.MONKEY = scope.MONKEY || {};
        }

        if ( typeof callback !== 'function' ) {
            object   = callback;
            callback = null;
        }

        object = object || build();

        // Process all components but the last, which will store the
        // specified object attribute.
        for ( var i = 0, count = components.length; i < count; i++ ) {
            last = ( i == count - 1 );
            scope[components[i]] = ( last ? object : ( scope[components[i]] || {} ) );
            scope = scope[components[i]];
        }

        if ( callback ) {
            callback.call( scope, scope, MONKEY.utils, $ );
        }

        return scope;
    };

    MONKEY.Wrapper = function(namespace, initializer) {
        return MONKEY(namespace, function(definition) {
            definition.fn.initialize = function(namespace, callback) {
                initializer.apply( definition, arguments );
            };

            return definition;
        }, null, true );
    };

    context.MONKEY = MONKEY;

})( window, LibraryDOM );
;(function(context, $) {

    'use strict';

    MONKEY.vars = {
        add : function(attr, value) {
            MONKEY.vars[attr] = value;
        },

        extend : function(vars) {
            $.extend( MONKEY.vars, vars );
        },

        body : $( 'body' ),
        main : $( document ),
        win  : $( window )
    };

    MONKEY.Components = {};
    MONKEY.Ajax       = {};

})( window, LibraryDOM );
;(function(context, $) {

    'use strict';

    MONKEY.utils = {
        toTitleCase : function(text) {
            text = text.replace(/(?:^|-)\w/g, function(match) {
                return match.toUpperCase();
            });

            return text.replace(/-/g, '');
        },

        toCamelCase : function(text) {
            text = text.replace(/(?:^|-)\w/g, function(match, index) {
                return ( !index ) ? match : match.toUpperCase();
            });

            return text.replace(/-/g, '');
        }
    };

})( window, LibraryDOM );
;(function(context) {

	'use strict';

	function call(callback, args) {
		if ( typeof callback === 'function' ) {
			callback.apply( null, ( args || [] ) );
		}
	}

	MONKEY.dispatcher = function(application, route, args) {
		//execute all application
		call( application.init, args );
		call( application[route], args );
	};

})( window );
;(function(context, $) {

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
;MONKEY.Wrapper( 'MONKEY.ComponentWrapper', function(namespace, callback) {

    'use strict';    

    MONKEY( ['Components', namespace].join( '.' ), function(Model, utils, $) {
        
        var global = $( 'body' );

        Model.fn.initialize = function(container) {
            this.$el      = container;
            this.elements = {};
            this.on       = null;
            this.fire     = null;
            this.parent   = null;

            //start component
            this.loadDefaultMethods();
            this.init();
        };

        Model.fn.loadDefaultMethods = function() {
            this.setAttrs();
            this.setElements();
            this.setParent();
            this.emitter();
        };

        Model.fn.setElements = function() {
            this.$el
                .find( '[data-element]' )
                    .each( this._assignEachElements.bind( this ) )
            ;
        };

        Model.fn._assignEachElements = function(index, element) {
            var target = $( element )
              , name   = target.data( 'element' )
            ;

            this._insertElement( target, name );
        };

        Model.fn._insertElement = function(target, name) {
            name = utils.toCamelCase( name );

            //ser flag for captured element
            target.attr( 'data-eobj', true );

            //case is exist element
            if ( this.elements[name] ) {
                this.elements[name] = this.elements[name].add( target );
                return;
            }

            //set attr in object elements
            this.elements[name] = target;
        };

        Model.fn.reloadElements = function() {
            this.$el
                .find( '[data-element]:not([data-eobj])' )
                    .each( this._assignEachElements.bind( this ) )
            ;
        };

        Model.fn.getElement = function(name, isGlobalWrapper) {
            var wrapper = this.$el
              , target  = null
            ;
            
            if ( isGlobalWrapper ) {
                wrapper = global;
            }

            target = wrapper.find( '[data-element="' + name + '"]' );

            if ( !target.length ) {
                return false;
            }

            this._insertElement( target, name );
            return target;
        };

        Model.fn.setAttrs = function() {
            var attrs = this.$el.data();

            for ( var name in attrs ) {
                this[name] = attrs[name];
            }
        };

        Model.fn.emitter = function() {
            this.on   = $.proxy( this.$el, 'on' );
            this.fire = $.proxy( this.$el, 'trigger' );
        };

        Model.fn.addEvent = function(event, action, isGlobalEvent) {
            var handle  = utils.toCamelCase( [ '_on', event, action ].join( '-' ) )
              , context = isGlobalEvent ? global : this
            ;
            
            context.on(
                  event
                , '[data-action="' + action + '"]'
                , $.proxy( this, 'onHandleEvent', handle )
            );
        };

        Model.fn.onHandleEvent = function(handle, event) {
            ( this[handle] || $.noop ).call( this, event, $( event.currentTarget ) );
        };

        Model.fn.setParent = function() {
            if ( this.depends ) {
                this.parent = $( '[data-component="' + this.depends + '"]' ).getComponent();
            }
        };

        Model.fn.init = function() {

        };

        callback( Model, utils, $ );
    });

});}));