Ext.define('Abraxa.model.disbursement.Voucher', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'disbursement_id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'document_id',
            type: 'integer',
        },
        {
            name: 'expense_id',
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
            name: 'price',
            type: 'float',
        },
        {
            name: 'calculated_price',
            type: 'float',
            depends: ['currency', 'price', 'exchange_rate'],
            convert: function (v, rec) {
                let rate = rec.get('exchange_rate'),
                    price = rec.get('price');

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'reference_number',
            type: 'auto',
        },
        {
            name: 'invoice_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'note',
            type: 'string',
        },
        {
            name: 'pdf',
            type: 'auto',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'document',
            model: 'Abraxa.model.document.Document',
            associatedKey: 'document',
            reference: 'document_id',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement_files/${portcall_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
