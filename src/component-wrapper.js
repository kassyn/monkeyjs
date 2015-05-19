Module.Wrapper( 'Module.ComponentWrapper', function(namespace, callback) {

	'use strict';
    
    Module( ['Components', namespace].join( '.' ), function(Model, utils, $) {
		Model.fn.initialize = function(container) {
			this.$el      = container;
			this.elements = {};
			this.on       = null;
			this.fire     = null;
			
			//start component
			this.loadDefaultMethods();
			this.init();
		};

		Model.fn.loadDefaultMethods = function() {
      		this.setAttrs();
      		this.setElements();
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
			  ,	name   = utils.toCamelCase( target.data( 'element' ) )
			;

			//case is exist element
			if ( this.elements[name] ) {
				this.elements[name] = this.elements[name].add( target );
				return;
			}

			//set attr in object elements
			this.elements[name] = target;	    		
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

    	Model.fn.addEvent = function(event, action) {
    		var handle = utils.toCamelCase( [ '_on', event, action ].join( '-' ) );

    		this.on(
    			  event
    			, '[data-action=' + action + ']'
    			, ( this[handle] || $.noop ).bind( this )
    		);
    	};

    	Model.fn.init = function() {

    	};

		callback( Model, utils, $ );
	});

});