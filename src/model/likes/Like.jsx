Ext.define('Abraxa.model.likes.Like', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'like',
        // batchActions: true,
        // appendId: false,
        // writer: {
        //     allowSingle: false
        // }
    },
});
