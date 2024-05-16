Ext.define('Abraxa.model.inquiry.InquiryOfferService', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'value',
            type: 'float',
        },
        {
            name: 'exchange_rate',
            type: 'float',
            defaultValue: 1,
        },
        {
            name: 'discount',
            type: 'auto',
        },
        {
            name: 'vat',
            type: 'auto',
        },
        {
            name: 'calculated_price',
            type: 'float',
            depends: ['exchange_rate', 'value'],
            convert: function (v, rec) {
                let price = parseFloat(rec.get('value')),
                    exchangeRate = rec.get('exchange_rate');

                return price * exchangeRate;
            },
        },
        {
            name: 'final_price',
            type: 'float',
            depends: ['calculated_price', 'discounted_price', 'vat'],
            convert: function (v, rec) {
                let price = rec.get('discounted_price') ? rec.get('discounted_price') : rec.get('calculated_price'),
                    vat = rec.get('vat'),
                    vatValue = vat ? price * (parseFloat(vat) / 100) : 0;

                return price + vatValue;
            },
        },
        {
            name: 'discounted_price',
            type: 'float',
            depends: ['discount', 'calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('discount'),
                    calculated_price = rec.get('calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'final_amount',
            type: 'float',
            depends: ['final_price'],
            convert: function (v, rec) {
                return rec.get('final_price');
            },
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'inquiry/${inquiry_id}/pda/${pda_id}/service',
        batchActions: true,
        writer: {
            // allowSingle: false,
            // rootProperty: 'expenses',
            // clientIdProperty: 'expenseId'
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },

    applyDiscount: function (calculated_price, discount) {
        var value = discount,
            original_price = calculated_price,
            discounted_price = 0;

        if (value) {
            value = value.replace(/\s/g, '');
            var is_percentage = value.includes('%');

            value = value.replace(/\%+/i, '');
            value = parseFloat(value);
            if (is_percentage) {
                discounted_price = original_price - original_price * (value / 100);
            } else {
                discounted_price = original_price - value;
            }
        } else {
            discounted_price = original_price;
        }
        return discounted_price;
    },
});
