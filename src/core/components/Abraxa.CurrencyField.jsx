Ext.define('Abraxa.CurrencyField', {
    extend: 'Ext.field.Number',
    decimals: 3,
    xtype: 'abraxa.currency.field',
    placeholder: '0.000000',
    maxValue: 9999999.999,
    clearable: false,
    setNumeralValue: function (value) {
        this.setInputValue(numeral(value).format('0,0.[0000000]'));
    },
    parseValue: function (value, errors) {
        if (value) {
            value = numeral(value).format('0,0.[0000000]');
        } else {
            this.setValue(null);
        }
        return this.callParent([value, errors]);
    },

    applyInputValue: function (value) {
        // Force numberFormat creation
        this.getDecimals();
        if (typeof value === 'number') {
            value = numeral(value).format('0,0.[0000000]');
        }
        return value;
    },
});
