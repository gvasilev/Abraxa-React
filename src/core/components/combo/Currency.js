Ext.define('Abraxa.core.components.combo.Currency', {
    extend: 'Ext.field.ComboBox',
    xtype: 'common-combo-currency',
    queryMode: 'local',
    displayField: 'currency',
    forceSelection: true,
    matchFieldWidth: false,
    valueField: 'currency',
    itemTpl:
        '<div class="hbox">' +
        '<div>{currency:capitalize()}</div>' +
        '<div class="sm-title">&nbsp;({description})</div>' +
        '</div>',
    bind: {
        store: '{companyCurrencies}',
    },
});
