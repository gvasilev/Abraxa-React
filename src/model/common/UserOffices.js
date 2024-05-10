Ext.define('Abraxa.model.common.UserOffices', {
    extend: 'Abraxa.model.office.Office',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'user_offices',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
