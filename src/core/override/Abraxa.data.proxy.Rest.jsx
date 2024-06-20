Ext.define('Abraxa.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',

    config: {
        actionMethods: {
            create: 'POST',
            read: 'GET',
            update: 'PATCH',
            destroy: 'DELETE',
        },
    },

    setException: function (operation, response) {
        operation.setException({
            status: response.status,
            statusText: response.statusText,
            response: response,
        });
        const models = operation.getRecords();
        if (models && models.length > 0) {
            models.forEach((model) => {
                model.reject();
            });
        }
    },
});
