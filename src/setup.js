(function(context, $) {

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
