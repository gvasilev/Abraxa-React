Ext.define('Abraxa.core.components.EmailField', {
    extend: 'Ext.field.Text',
    xtype: 'abraxa.emailfield',
    label: 'Email',
    labelAlign: 'top',
    errorTarget: 'top',
    validators: [
        {
            type: 'email',
        },
    ],
});
