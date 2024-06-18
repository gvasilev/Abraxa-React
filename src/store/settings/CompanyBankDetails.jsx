import '../../model/settings/CompanyBankDetails';

Ext.define('Abraxa.store.settings.CompanyBankDetails', {
    extend: 'Ext.data.Store',
    alias: 'store.settingsCompanyBankDetails',
    model: 'Abraxa.model.settings.CompanyBankDetails',
    autoLoad: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/bank-details',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'company_bank_details',
            clientIdProperty: 'bankId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
