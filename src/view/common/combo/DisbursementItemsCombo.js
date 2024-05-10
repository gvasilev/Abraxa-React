Ext.define('Abraxa.view.common.combo.DisbursementItemsCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'disbursements.items.combo',
    queryModel: 'local',
    displayField: 'title',
    valueField: 'id',
    ui: 'classic',
    clearable: false,
    anyMatch: true,
    bodyPadding: 0,
    minChars: 2,
    queryMode: 'local',
    forceSelection: true,
    bind: {
        store: '{disbursementsItems}',
    },
    config: {
        category: null,
    },

    itemTpl:
        '<div class="combo-item hbox">' +
        '<div class="mini-icon" data-type="{type}"><i class="md-icon-outlined {icon} md-24"></i></div>' +
        '<div>{name}</div>' +
        '</div>',

    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<tpl><div class="combo-item">' +
            '<div class="mini-icon" data-type="{[this.getType(values.type)]}"><i class="md-icon-outlined {[this.getTypeIcon(values.type)]} md-18"></i></div>' +
            '<label class="sm-type">{type:capitalize}</label>' +
            '<div class="sm-value">{title}</div>' +
            '</div></tpl>',
        {
            getTypeIcon: function (type) {
                let icon = '';
                if (type) {
                    switch (type) {
                        case 'supplies':
                            icon = 'abraxa-icon-layers';
                            break;
                        case 'disposal':
                            icon = 'abraxa-icon-recycle';
                            break;
                        case 'bunkers':
                            icon = 'abraxa-icon-oil';
                            break;
                        case 'services':
                            icon = 'md-icon-assistant';
                            break;
                        default:
                            icon = 'md-icon-attach-money';
                            break;
                    }
                }
                return icon;
            },
            getType: function (type) {
                let icon = '';
                if (type) {
                    switch (type) {
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
        beforequery: function () {
            let store = this.getStore(),
                category = this.getCategory();
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
        focusleave: function () {
            if (this.getStore()) this.getStore().clearFilter();
        },
    },
});
