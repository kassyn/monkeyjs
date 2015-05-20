;(function(context, $) {

    'use strict';

    Module.utils = {
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

})( window, jQuery );
