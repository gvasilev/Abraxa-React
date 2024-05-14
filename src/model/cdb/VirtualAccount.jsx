import '../payment/Payment';

Ext.define('Abraxa.model.cdb.VirtualAccount', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'account_number',
            type: 'string',
        },
        {
            type: 'string',
            name: 'bank_branch_number',
        },
        {
            type: 'string',
            name: 'aba_number',
        },
        {
            name: 'currency',
            type: 'string',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'balance',
            type: 'auto',
        },
        {
            name: 'minimum_balance',
            type: 'auto',
            defaultValue: 0,
        },
        {
            name: 'allow_negative_balance',
            type: 'boolean',
        },
        {
            name: 'allow_overdraft',
            type: 'boolean',
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'payments',
            model: 'Abraxa.model.payment.Payment',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${org_id}/virtual-accounts',
        // reader: {
        //     type: 'json',
        //     rootProperty: 'data'
        // }
    },
});
