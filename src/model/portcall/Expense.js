Ext.define('Abraxa.model.portcall.Expense', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'disbursement_id',
            type: 'auto',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'default_expense_item_id',
            type: 'auto',
        },
        {
            name: 'default_expense_item_name',
            type: 'auto',
        },
        {
            name: 'quantity',
            type: 'number',
        },
        {
            name: 'vendor_name',
            type: 'string',
        },
        {
            name: 'quantity_unit',
            type: 'auto',
        },
        {
            name: 'place_id',
            type: 'auto',
        },
        {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'paid',
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
            name: 'category',
            type: 'auto',
        },
        {
            name: 'pda_price',
            type: 'float',
        },
        {
            name: 'dda_price',
            type: 'float',
        },
        {
            name: 'fda_price',
            type: 'float',
        },
        {
            name: 'sda_price',
            type: 'float',
        },
        {
            name: 'discounted_price',
            type: 'float',
            depends: ['discount_amount', 'calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('discount_amount'),
                    calculated_price = rec.get('calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'pda_discounted_price',
            type: 'float',
            depends: ['pda_discount_amount', 'pda_calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('pda_discount_amount'),
                    calculated_price = rec.get('pda_calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'dda_discounted_price',
            type: 'float',
            depends: ['dda_discount_amount', 'dda_calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('dda_discount_amount'),
                    calculated_price = rec.get('dda_calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'fda_discounted_price',
            type: 'float',
            depends: ['fda_discount_amount', 'fda_calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('fda_discount_amount'),
                    calculated_price = rec.get('fda_calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'sda_discounted_price',
            type: 'float',
            depends: ['sda_discount_amount', 'sda_calculated_price'],
            convert: function (v, rec) {
                var discount = rec.get('sda_discount_amount'),
                    calculated_price = rec.get('sda_calculated_price');

                return rec.applyDiscount(calculated_price, discount);
            },
        },
        {
            name: 'pda_final_price',
            type: 'float',
            depends: ['pda_calculated_price', 'pda_discounted_price', 'pda_vat_amount'],
            convert: function (v, rec) {
                let price = rec.get('pda_discount_amount')
                        ? rec.get('pda_discounted_price')
                        : rec.get('pda_calculated_price'),
                    vat = rec.get('pda_vat_amount');

                return price + price * (parseFloat(vat) / 100);
            },
        },
        {
            name: 'dda_final_price',
            type: 'float',
            depends: ['dda_calculated_price', 'dda_discounted_price', 'dda_vat_amount'],
            convert: function (v, rec) {
                let price = rec.get('dda_discount_amount')
                        ? rec.get('dda_discounted_price')
                        : rec.get('dda_calculated_price'),
                    vat = rec.get('dda_vat_amount');

                return price + price * (parseFloat(vat) / 100);
            },
        },
        {
            name: 'fda_final_price',
            type: 'float',
            depends: ['fda_calculated_price', 'fda_discounted_price', 'fda_vat_amount'],
            convert: function (v, rec) {
                let price = rec.get('fda_discount_amount')
                        ? rec.get('fda_discounted_price')
                        : rec.get('fda_calculated_price'),
                    vat = rec.get('fda_vat_amount');

                return price + price * (parseFloat(vat) / 100);
            },
        },
        {
            name: 'sda_final_price',
            type: 'float',
            depends: ['sda_calculated_price', 'sda_discounted_price', 'sda_vat_amount'],
            convert: function (v, rec) {
                let price = rec.get('sda_discount_amount')
                        ? rec.get('sda_discounted_price')
                        : rec.get('sda_calculated_price'),
                    vat = rec.get('sda_vat_amount');

                return price + price * (parseFloat(vat) / 100);
            },
        },
        {
            name: 'calculated_price',
            type: 'float',
            depends: ['fda_price', 'dda_price'],
            convert: function (v, rec) {
                return rec.get('fda_price');
            },
        },
        {
            name: 'pda_calculated_price',
            type: 'float',
            depends: ['pda_price', 'currency', 'exchange_rate'],
            convert: function (v, rec) {
                let currency = rec.get('currency'),
                    rate = rec.get('exchange_rate'),
                    price = rec.get('pda_price');

                if (rec.vouchers().count()) return price;

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'dda_calculated_price',
            type: 'float',
            depends: ['dda_price', 'currency', 'exchange_rate'],
            convert: function (v, rec) {
                let currency = rec.get('currency'),
                    rate = rec.get('exchange_rate'),
                    price = rec.get('dda_price');

                if (rec.vouchers().count()) return price;

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'fda_calculated_price',
            type: 'float',
            depends: ['fda_price', 'currency', 'exchange_rate'],
            convert: function (v, rec) {
                let currency = rec.get('currency'),
                    rate = rec.get('exchange_rate'),
                    price = rec.get('fda_price');

                if (rec.vouchers().count()) return price;

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'sda_calculated_price',
            type: 'float',
            depends: ['sda_price', 'currency', 'exchange_rate'],
            convert: function (v, rec) {
                let currency = rec.get('currency'),
                    rate = rec.get('exchange_rate'),
                    price = rec.get('sda_price');

                if (rec.vouchers().count()) return price;

                if (rate) return price * rate;

                return price;
            },
        },
        {
            name: 'include_in_balance',
            type: 'auto',
        },
        {
            name: 'discount',
            type: 'auto',
        },
        {
            name: 'discount_amount',
            type: 'auto',
        },
        {
            name: 'pda_discount_amount',
            type: 'auto',
        },
        {
            name: 'dda_discount_amount',
            type: 'auto',
        },
        {
            name: 'fda_discount_amount',
            type: 'auto',
        },
        {
            name: 'sda_discount_amount',
            type: 'auto',
        },
        {
            name: 'vat',
            type: 'auto',
        },
        {
            name: 'vat_amount',
            type: 'number',
        },
        {
            name: 'pda_vat_amount',
            type: 'number',
        },
        {
            name: 'dda_vat_amount',
            type: 'number',
        },
        {
            name: 'fda_vat_amount',
            type: 'number',
        },
        {
            name: 'sda_vat_amount',
            type: 'number',
        },
        {
            name: 'account_id',
            type: 'auto',
        },
        {
            name: 'account_name',
            type: 'auto',
        },
        {
            name: 'vouchers',
            type: 'auto',
        },
        {
            name: 'paid',
            type: 'number',
        },
        {
            name: 'pda_id',
            type: 'number',
        },
        {
            name: 'dda_id',
            type: 'number',
        },
        {
            name: 'fda_id',
            type: 'number',
        },
        {
            name: 'sda_id',
            type: 'number',
        },
        {
            name: 'variance',
            type: 'auto',
            persist: false,
            depends: ['pda_final_price', 'dda_final_price', 'fda_final_price'],
            convert: function (v, rec) {
                let start_price = rec.get('pda_final_price') ? rec.get('pda_final_price') : rec.get('dda_final_price'),
                    final_price = rec.get('fda_final_price') ? rec.get('fda_final_price') : rec.get('dda_final_price');

                //OLD BETTER LOGIC

                // if (final_price == 0 && start_price)
                //     final_price = start_price;

                // if (start_price == 0 && final_price)
                //     start_price = final_price;

                // if (!start_price && !final_price)
                //     return;

                if (final_price == 0 && start_price) return '<span class="a-cell-placeholder">---</span>';

                if (!start_price && final_price) return '<span class="a-cell-placeholder">---</span>';

                if (!start_price && !final_price) return '<span class="a-cell-placeholder">---</span>';

                if (start_price == final_price) return '<span class="a-cell-placeholder">---</span>';

                const reDiff = function relDiff(a, b) {
                    return Math.abs((b - a) / a) * 100;
                };

                let variance = parseFloat(reDiff(start_price, final_price)).toFixed(1),
                    sign = start_price > final_price ? '-' : start_price < final_price ? '+' : '',
                    cls = start_price > final_price ? 'c-red' : start_price < final_price ? 'c-green' : 'c-blue',
                    icon =
                        start_price > final_price
                            ? 'trending_down'
                            : start_price < final_price
                              ? 'trending_up'
                              : 'trending_flat';

                return (
                    '<div class="hbox ' +
                    cls +
                    '"><i class="material-icons-outlined md-16 ' +
                    cls +
                    '">' +
                    icon +
                    '</i><span class="ml-8">' +
                    sign +
                    '' +
                    variance +
                    '%</span></div>'
                );
            },
        },
        {
            name: 'comment',
            type: 'string',
        },
        {
            name: 'checked',
            persist: false,
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
        {
            name: 'is_locked',
            type: 'auto',
            persist: false,
        },
        {
            name: 'lockItem',
            type: 'auto',
            persist: false,
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
            name: 'accounting_code',
            type: 'string',
            persist: false,
            mapping: function (data) {
                if (data.default_expense_item && data.default_expense_item.aliases) {
                    if (data.default_expense_item.cost_center_accounting_code) {
                        return data.default_expense_item.cost_center_accounting_code;
                    }
                    return data.default_expense_item.account_code;
                }

                return '<div class="a-cell-placeholder">---</div>';
            },
        },
        {
            name: 'account_number',
            type: 'string',
        },
        {
            name: 'notes_count',
            type: 'number',
            defaultValue: 0,
            persist: false,
        },
        {
            name: 'customer_cost_center',
            type: 'string',
        },
        {
            name: 'customer_cost_center_id',
            type: 'int',
            allowNull: true,
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
        {
            name: 'vouchers',
            model: 'Abraxa.model.disbursement.Voucher',
            associatedKey: 'vouchers',
        },
        {
            name: 'comments',
            model: 'Abraxa.model.comments.Comment',
            associatedKey: 'comments',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/expense',
        batchActions: true,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'expenses',
            clientIdProperty: 'expenseId',
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
