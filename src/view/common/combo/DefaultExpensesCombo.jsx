Ext.define('Abraxa.view.common.combo.DefaultExpenseItemsCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'default.expense.items.combo',
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
        store: '{defaultExpenseItems}',
    },
    config: {
        category: null,
    },
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<tpl><div class="hbox">' +
            '<div class="a-badge a-badge-{category.name}"><i class="md-icon-outlined"></i></div>' +
            '<div class="ml-12"><label class="sm-type">{type.name:capitalize}</label>' +
            '<div class="sm-value">{name}</div>' +
            '</div></div></tpl>',
        {
            getTypeIcon: function (category) {
                let icon = '';
                if (category) {
                    switch (category.name) {
                        case 'agency':
                            icon = 'abraxa-icon-layers';
                            break;
                        case 'cargo expenses':
                            icon = 'abraxa-icon-recycle';
                            break;
                        case 'husbandry':
                            icon = 'abraxa-icon-oil';
                            break;
                        case 'port expenses':
                            icon = 'md-icon-assistant';
                            break;
                        case 'charterers expenses':
                            icon = 'md-icon-assistant';
                            break;
                        default:
                            icon = 'md-icon-attach-money';
                            break;
                    }
                }
                return icon;
            },
            getType: function (category) {
                let icon = '';
                if (category) {
                    switch (category.name) {
                        case 'supplies':
                            type = 'supply';
                            break;
                        case 'disposal':
                            type = 'disposal';
                            break;
                        case 'bunkers':
                            type = 'bunker';
                            break;
                        case 'services':
                            type = 'service';
                            break;
                        default:
                            type = 'financial';
                            break;
                    }
                }
                return type;
            },
        }
    ),
    listeners: {
        expand: function () {
            let combo = this,
                pickerRecords = combo.getPicker().getItems(),
                category = combo.getCategory(),
                type = null,
                store = this.getStore(),
                editor = this.up('editor'),
                buttonExists = pickerRecords.keys.indexOf('addDisbItemButton');
            if (store && category) {
                store.addFilter({
                    id: 8787,
                    property: 'type',
                    operator: '=',
                    value: category,
                    exactMatch: true,
                });
            }
        },
    },
});
