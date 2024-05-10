Ext.define('Abraxa.core.components.fields.RangeField', {
    extend: 'Ext.field.Text',
    xtype: 'rangefield',
    placeholder: '0-100',
    autoComplete: true,
    stripCharsRe: /[^\d+-.]$/,
    validators: /[\d.]+-[\d.]+$/,
    applyInputValue: function (value, oldValue) {
        if (!this.isValid()) {
            this.clearValue();
        }
        return this.callParent([value, oldValue]);
    },
});
