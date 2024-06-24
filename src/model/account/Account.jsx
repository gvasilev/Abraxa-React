import '../disbursement/Disbursement';
import '../account/AccountMember';
import '../payment/Payment';

Ext.define('Abraxa.model.account.Account', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'org_id',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'org_name',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'co_id',
            type: 'auto',
        },
        {
            name: 'co_name',
            type: 'auto',
        },
        {
            name: 'base_currency',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'account_currency',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'exchange_rate',
            type: 'auto',
            allowBlank: false,
            defaultValue: 1,
        },
        {
            name: 'customer_reference',
            type: 'auto',
        },
        {
            name: 'extra_reference',
            type: 'auto',
        },
        {
            name: 'payment_term_id',
            type: 'auto',
        },
        {
            name: 'balance',
            type: 'number',
            // No obvious difference between float and number;
            // they are synonymous aliases according to the EXT.js docs.
        },
        {
            name: 'funded',
            type: 'auto',
            allowBlank: false,
            defaultValue: 'not funded',
        },
        {
            name: 'bank_id',
            type: 'auto',
        },
        {
            name: 'bank_name',
            type: 'auto',
        },
        {
            name: 'nomination_id',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'total_costs',
            type: 'float',
        },
        {
            name: 'updated_at',
            type: 'auto',
            persist: false,
        },
        {
            name: 'updated_by_user',
            type: 'auto',
            persist: false,
        },
    ],
    hasMany: [
        {
            name: 'disbursements',
            model: 'Abraxa.model.disbursement.Disbursement',
            // associationKey: 'disbursements',
        },
        {
            name: 'members',
            model: 'Abraxa.model.account.AccountMember',
            // associatedKey: 'members',
        },
        {
            name: 'payments',
            model: 'Abraxa.model.payment.Payment',
            associatedKey: 'payments',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'account',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
