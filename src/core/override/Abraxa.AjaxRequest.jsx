Ext.define('Abraxa.DataConnection', {
    override: 'Ext.data.Connection',
    request: function (options) {
        let me = this,
            requestOptions,
            request;

        options = options || {};
        options.withCredentials = Env.isDev ?? false;
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
