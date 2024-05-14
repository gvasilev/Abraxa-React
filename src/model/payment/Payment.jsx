import '../account/Account.jsx';
import '../portcall/Attachment.jsx';
import '../portcall/Note.jsx';
import '../task/Task.jsx';
Ext.define('Abraxa.model.payment.Payment', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'org_id',
            type: 'auto',
        },
        {
            name: 'org_name',
            type: 'string',
        },
        {
            name: 'account_id',
            type: 'auto',
        },
        {
            name: 'paymentable_id',
            type: 'integer',
            allowNull: true,
        },
        {
            name: 'paymentable_type',
            type: 'auto',
        },
        {
            name: 'type',
            type: 'auto',
        },
        {
            name: 'status',
            type: 'auto',
        },
        {
            name: 'base_currency',
            type: 'auto',
        },
        {
            name: 'account_currency',
            type: 'auto',
        },
        {
            name: 'currency',
            type: 'auto',
        },
        {
            name: 'exchange_rate',
            type: 'float',
            defaultValue: 1,
        },
        {
            name: 'from_exchange_rate',
            type: 'float',
        },
        {
            name: 'to_exchange_rate',
            type: 'float',
        },
        {
            name: 'amount',
            type: 'float',
        },
        {
            name: 'incoming_amount',
            type: 'float',
            depends: ['calculated_amount', 'kind'],
            persist: false,
            convert: function (v, rec) {
                if (rec.get('kind') == 'incoming') {
                    return rec.get('calculated_amount');
                } else {
                    return 0;
                }
            },
        },
        {
            name: 'outgoing_amount',
            type: 'float',
            depends: ['calculated_amount', 'kind'],
            persist: false,
            convert: function (v, rec) {
                if (rec.get('kind') == 'outgoing') {
                    return rec.get('calculated_amount');
                } else {
                    return 0;
                }
            },
        },
        {
            name: 'requested_amount',
            type: 'float',
            depends: ['calculated_amount', 'kind'],
            persist: false,
            convert: function (v, rec) {
                if (rec.get('kind') == 'requested') {
                    return rec.get('calculated_amount');
                } else {
                    return 0;
                }
            },
        },
        {
            name: 'calculated_amount',
            type: 'float',
            // persist: false,
            depends: ['currency', 'amount', 'exchange_rate'],
            convert: function (v, rec) {
                let rate = rec.get('exchange_rate'),
                    price = rec.get('amount');

                if (!rate) rate = 1;

                return price * rate;
            },
        },
        {
            name: 'from_calculated_amount',
            type: 'float',
            persist: false,
            depends: ['currency', 'amount', 'from_exchange_rate'],
            convert: function (v, rec) {
                let rate = rec.get('from_exchange_rate'),
                    price = rec.get('amount');

                if (!rate) rate = 1;

                return price * rate;
            },
        },
        {
            name: 'to_calculated_amount',
            type: 'float',
            persist: false,
            depends: ['currency', 'amount', 'to_exchange_rate'],
            convert: function (v, rec) {
                let rate = rec.get('to_exchange_rate'),
                    price = rec.get('amount');

                if (!rate) rate = 1;

                return price * rate;
            },
        },
        {
            name: 'due_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'kind',
            type: 'auto',
        },
        {
            name: 'company_bank_id',
            type: 'auto',
        },
        {
            name: 'incoming_bank_id',
            type: 'auto',
        },
        {
            name: 'outgoing_bank_id',
            type: 'auto',
        },
        {
            name: 'payment_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'created_at',
            type: 'date',
        },
        {
            name: 'paid',
            type: 'integer',
        },
        {
            name: 'port_name',
            persist: false,
            convert: function (v, rec) {
                let owner = rec.get('owner');
                if (owner && owner.port_id) return owner.port_name;
            },
        },
        {
            name: 'vessel_name_id',
            persist: false,
            convert: function (v, rec) {
                let owner = rec.get('owner');
                if (owner && owner.port_id) return owner.voyage.vessel_name + owner.reference_number;
            },
        },
        {
            name: 'agency_cash',
            persist: false,
        },
        {
            name: 'agency_balance',
            persist: false,
        },
        {
            name: 'client_cash',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'account',
            model: 'Abraxa.model.account.Account',
            associationKey: 'account',
        },
    ],
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
        {
            name: 'notes',
            model: 'Abraxa.model.portcall.Note',
            associationKey: 'notes',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
            associationKey: 'tasks',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'payments',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            writeAllFields: true,
        },
    },
});
