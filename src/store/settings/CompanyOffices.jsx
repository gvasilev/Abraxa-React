Ext.define('Abraxa.store.settings.CompanyOffices', {
    extend: 'Ext.data.Store',
    alias: 'store.CompanyOffices',
    model: 'Abraxa.model.office.Office',
    autoLoad: true,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/offices',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'offices',
            clientIdProperty: 'officeId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
