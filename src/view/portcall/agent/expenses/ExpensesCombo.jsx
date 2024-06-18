Ext.define('Abraxa.view.portcall.expesnes.ExpensesCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'portcall.expenses.combo',
    queryModel: 'local',
    displayField: 'name',
    valueField: 'id',
    ui: 'classic',
    clearable: false,
    anyMatch: true,
    bodyPadding: 0,
    minChars: 2,
    queryMode: 'local',
    forceSelection: true,
    bind: {
        store: '{expenses}',
    },
    config: {
        category: null,
    },
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<tpl><div class="hbox">' +
            '<div class="a-badge a-badge-{[this.category(values)]}"><i class="md-icon-outlined"></i></div>' +
            '<div class="ml-8"><label class="sm-type">{[this.type(values)]}</label>' +
            '<div class="sm-value">{default_expense_item_name}</div>' +
            '</div></div></tpl>',
        {
            category: function (record) {
                return record.default_expense_item.category.name;
            },
            type: function (record) {
                return Ext.String.capitalize(record.default_expense_item.type.name);
            },
        }
    ),
    listeners: {},
});
