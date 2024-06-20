Ext.define('Abraxa.data.Connection', {
    override: 'Ext.data.Connection',

    constructor: function (config) {
        this.callParent([config]);

        this.on('requestexception', function (conn, response, options) {
            // Skip canceled requests
            if (response.status === -1 && response.statusText === 'transaction aborted') {
                return;
            }
            switch (response.status) {
                case 401:
                    this.handle401Status();
                    break;
                case 404:
                    this.handle404Status();
                    break;
                default:
                    AbraxaFunctions.showExceptionMessage(response);
                    break;
            }
        });
    },
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

    handle401Status: function () {
        let tipExist = Ext.getCmp('sessionExpired'),
            userExists = Ext.Viewport.getViewModel().get('currentUser'),
            dialogs = Ext.ComponentQuery.query('dialog');

        if (dialogs.length > 0) {
            Ext.Array.each(dialogs, function (dialog) {
                if (dialog.id != 'sessionExpired') {
                    dialog.hide();
                }
            });
        }

        if (!tipExist && userExists) {
            Ext.create('Ext.MessageBox', {
                zIndex: 9999,
                id: 'sessionExpired',
                ui: 'info',
                innerCls: 'a-bgr-white text-center',
                message:
                    "<h3>Your session has expired</h3><br>Please refresh and log in again.<br>Don't worry we kept all of your data in place.",
                width: 300,
                dataTitle: 'Info',
                modal: true,
                bbar: {
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            text: 'Log in',
                            handler: function (me) {
                                me.up('dialog').destroy();
                                Ext.getApplication().logout();
                            },
                        },
                    ],
                },
            }).show();
        }
        let els = document.getElementsByClassName('x-mask');
        Ext.Array.each(els, function (el) {
            el.classList.add('a-blurred');
        });
    },
    handle404Status: function () {
        window.location.hash = '404';
    },
});
