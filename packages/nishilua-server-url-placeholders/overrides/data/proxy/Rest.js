/*
 Server-url-placeholders package is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License 3.0 as published by
 the Free Software Foundation.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 http://www.gnu.org/licenses/gpl.html
 */
/**
 * Bugfix: this code makes the REST request to not add the id as a query parameter.
 * When `appendId === false` it only relies on placeholders
 */
Ext.define('Nishilua.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',

    // compatibility: [
    //     '6.0.1.250',
    //     '6.2.0.981'
    // ],

    buildUrl: function (request) {
        var me = this,
            url = this.callParent(arguments) ;

        // After performing all the substitutions, and before the query parameters are added,
        // the id parameter is deleted
        if (!me.getAppendId()) {
            params = request.getParams() ;
            if (params) {
                delete params[me.getIdParam()] ;
            }
        }

        return url ;
    }
}) ;
