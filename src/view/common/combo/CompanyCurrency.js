Ext.define('Abraxa.view.common.combo.CompanyCurrency', {
    extend: 'Ext.field.Select',
    xtype: 'common-combo-company-currency',
    valueField: 'currency',
    displayField: 'currency',
    labelAlign: 'top',
    placeholder: 'Choose',
    bind: {
        store: '{companyCurrencies}',
    },
    forceSelection: true,
    queryMode: 'local',
});
