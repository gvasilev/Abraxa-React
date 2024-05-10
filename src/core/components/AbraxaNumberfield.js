Ext.define('Abraxa.Numberfield', {
    extend: 'Ext.field.Number',
    decimals: 3,
    xtype: 'abraxa.numberfield',
    placeholder: '0,000.00',
    maxValue: 9999999.999,
    clearable: false,
    parseValue: function (value, errors) {
        var me = this,
            parser = me.getParseValidator(),
            field,
            i,
            k,
            len,
            v,
            validators;

        if (parser) {
            // If the derived class has specified a default parseValidator, then this
            // pass is needed. Consult the component's validators first for a more
            // specific validator, followed by the bound model field (if we have one).
            field = me._validationField;

            for (k = 2; k-- > 0 /* empty */; ) {
                validators = k ? me.getValidators() : field && field.getValidators();
                len = validators && validators.length;

                for (i = 0; i < len; ++i) {
                    v = validators[i];

                    if (v.parse) {
                        v = v.parse(value);

                        // The first parse validator to achieve a parse wins. Returns
                        // its result.
                        if (v !== null) {
                            return numeral(v).format('0,0.[000]');
                        }
                    }
                }
            }

            // No user-defined parse validator found, so run the default one. It must
            // succeed or the value is invalid.
            value = parser.parse(value);

            if (value === null && errors) {
                errors.push(me.badFormatMessage);
            }
        }

        return value;
    },

    applyInputValue: function (value) {
        // Force numberFormat creation
        // this.getDecimals();
        if (typeof value === 'number') {
            value = numeral(value).format('0,0.[000]');
        }
        return value;
    },

    // listeners: {
    //     painted: function () {
    //         this.setNumeralValue(this.getValue());
    //     }
    // }
});
