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

    placeholdersRe: /\${([^}]*)}/g,

    /**
     * Generates a url based on a given Ext.data.Request object. Replaces the placeholders `${foo.bar.baz}`
     * by it's value of request parameters.
     * After the replacement, deletes the complete object of the parameters, for exaple `foo` if `foo.bar.baz`
     * is used.
     *
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function (request) {
        var me = this,
            url = me.getUrl(request),
            placeholderKeys = me._findPlaceholderKeys(url),
            params = request.getParams();

        // console.log('params', params);

        // Perform the replacements
        placeholderKeys.forEach(function (placeholderKey) {
            var value = this._findValue(params, placeholderKey);
            if (Ext.isDefined(value)) {
                url = url.replace('${' + placeholderKey + '}', value, 'g');
            }
        }, this);
        request.setUrl(url);

        // Delete the replaced object from params
        placeholderKeys.forEach(function (placeholderKey) {
            var tokens = placeholderKey.split('.');
            delete params[tokens[0]];
        }, this);

        // me.callParent([request]);
        url = me.getUrl(request);
        return url;
    },

    /**
     * Given an object/array and a path, returns the value on that path.
     * If the path does not exist, returns <code>undefined</code>.
     *
     * @param {Object} obj - Object to search a value into.
     * @param {String} path - Path with format `foo.bar.baz` for an object
     * @return {*} value at obj[foo][bar][baz]
     * @private
     */
    _findValue: function (obj, path) {
        var pathTokens = path.split('.'),
            pathTokensLength = pathTokens.length;

        for (var i = 0; i < pathTokensLength; i++) {
            if (obj === null || obj === undefined) {
                return undefined;
            } else {
                obj = obj[pathTokens[i]];
            }
        }
        return obj;
    },

    /**
     * Finds all the placeholder keys present in the target String.
     *
     * @param {String} targetString - String where to find placeholders with format `${foo.bar.baz}`
     * @returns {String[]} List with unique placeholders found
     * @private
     */
    _findPlaceholderKeys: function (targetString) {
        var matchedPlaceholder,
            placeholders = [];

        while ((matchedPlaceholder = this.placeholdersRe.exec(targetString)) !== null) {
            placeholders.push(matchedPlaceholder);
        }
        return Ext.Array.pluck(placeholders, '1');
    },
});
