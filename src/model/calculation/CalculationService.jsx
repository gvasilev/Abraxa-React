import './CalculationField';

Ext.define('Abraxa.model.calculation.CalculationService', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'amount',
            type: 'float',
        },
        {
            name: 'custom_amount',
            type: 'float',
            allowNull: true,
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
            name: 'fields',
            // critical: true,
            type: 'auto',
            serialize: function (value) {
                let data = [];
                value.forEach((element) => {
                    if (element.children && element.children.length) {
                        element.children = JSON.parse(element.childrenRaw);
                    }
                    data.push({
                        fieldID: element.fieldID,
                        value: element.value,
                        children: element.children,
                    });
                });
                return data;
            },
        },
        {
            name: 'type',
            critical: true,
            type: 'auto',
        },
        // {
        //     name: 'serviceFields',
        //     critical: true,
        //     mapping: function (data) {
        //         return data.fields;
        //     },
        // },
        {
            name: 'fieldsRaw',
            persist: false,
            mapping: function (data) {
                return JSON.stringify(data.offer_fields);
            },
        },
        {
            name: 'display_amount',
            persists: false,
            depends: ['amount', 'custom_amount'],
            convert: function (value, record) {
                if (record.get('custom_amount') !== null && record.get('custom_amount') >= 0)
                    return record.get('custom_amount');

                return record.get('amount');
            },
        },
        {
            name: 'calculated_price',
            type: 'float',
            depends: ['exchange_rate', 'display_amount'],
            convert: function (v, rec) {
                let price = parseFloat(rec.get('display_amount')),
                    exchangeRate = rec.get('exchange_rate');

                return price * exchangeRate;
            },
            validate: function (value) {
                return AbraxaFunctions.validateNonNegativeFieldValue('Calculated price', value);
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
            validate: function (value) {
                return AbraxaFunctions.validateNonNegativeFieldValue('Final price', value);
            },
        },
        {
            name: 'final_amount',
            type: 'float',
            depends: ['final_price'],
            convert: function (v, rec) {
                let price = rec.get('final_price');

                return price;
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
            validate: function (value) {
                return AbraxaFunctions.validateNonNegativeFieldValue('Discounted price', value);
            },
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'serviceFields',
            associationKey: 'offer_fields',
            model: 'Abraxa.model.calculation.CalculationField',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/calculations/${calculation_id}/services',
        appendId: false,
        batchActions: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            allowSingle: false,
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
