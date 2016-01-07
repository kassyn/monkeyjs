MONKEY.Wrapper( 'MONKEY.ComponentWrapper', function(namespace, callback) {

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

});