Ext.define('Abraxa.store.taxes.Taxes', {
    extend: 'Ext.data.Store',
    alias: 'store.taxes',
    storeId: 'taxes',
    model: 'Abraxa.model.tax.Tax',
    autoLoad: true,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'taxes',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'taxes',
            writeAllFields: true,
        },
    },
});
