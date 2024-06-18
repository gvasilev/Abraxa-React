Ext.define('Abraxa.data.Connection', {
    override: 'Ext.data.Connection',

    request: function (options) {
        var me = this,
            requestOptions,
            request;

        options = options || {};
        //override default property of Ext.Ajax.request
        //By default all requests it sends the _dc parameter
        //JIRA ticket CORE-2912
        options.disableCaching = options.disableCaching ? options.disableCaching : false;

        if (me.fireEvent('beforerequest', me, options) !== false) {
            requestOptions = me.setOptions(options, options.scope || Ext.global);

            request = me.createRequest(options, requestOptions);

            return request.start(requestOptions.data);
        }

        // Reusing for response
        request = {
            status: -1,
            statusText: 'Request cancelled in beforerequest event handler',
        };

        Ext.callback(options.callback, options.scope, [options, false, request]);

        return Ext.Deferred.rejected([options, false, request]);
    },
});
