Ext.define('Abraxa.core.components.Abraxa.PhoneField', {
    extend: 'Ext.field.Text',
    xtype: 'abraxa.phonefield',
    label: 'Phone',
    labelAlign: 'top',
    errorTarget: 'top',
    placeholder: '+999 999-9999',
    autoComplete: true,
    stripCharsRe: /[^0-9+,;\s-()_]?/g,
});
