Ext.define('Abraxa.model.office.OfficeBank', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'office_id',
            type: 'integer',
        },
        {
            name: 'bank_id',
            type: 'auto',
        },
        {
            type: 'boolean',
            name: 'is_default',
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'bank',
            model: 'Abraxa.model.settings.CompanyBankDetails',
            associatedKey: 'bank',
            reference: 'bank_id',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/offices/${office_id}/banks',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'office_banks',
            clientIdProperty: 'officeBankId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
