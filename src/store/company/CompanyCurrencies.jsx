import '../../model/settings/company/CompanyCurrency';

Ext.define('Abraxa.store.company.CompanyCurrencies', {
    extend: 'Ext.data.Store',
    alias: 'store.company.currencies',
    autoLoad: false,
    model: 'Abraxa.model.settings.company.CompanyCurrency',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/currencies',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'company_currencies',
        },
    },
});
