Ext.define('Abraxa.view.common.combo.Vessel', {
    extend: 'Ext.field.ComboBox',
    xtype: 'vessel.combo',
    label: 'Vessel',
    placeholder: 'Vessel name or IMO',
    minChars: 3,
    forceSelection: true,
    clearable: false,
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<div class="combo-item item-uppercase a-verification a-verified">' +
            '<div class="sm-icon"><i class="md-icon-outlined md-18">directions_boat</i></div>' +
            '<label class="sm-type">IMO: {imo} ({general_type.name})</label>' +
            '<div class="sm-value hbox">{name}{[this.badge(values.compliance)]}</div>' +
            '</div>',
        {
            badge: function (compliance) {
                if (compliance) {
                    return '<i class="md-icon-outlined a-verification-icon ml-2"></i>';
                }

                return '';
            },
        }
    ),
    valueField: 'imo',
    displayField: 'name',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
        expand: null,
        tbn: {
            xtype: 'button',
            margin: '0 0 0 16',
            text: 'TBN',
            ui: 'default small outlined',
            tooltip: {
                html: 'Set vessel to TBN',
                anchorToTarget: true,
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                closeAction: 'destroy',
            },
            handler: function () {
                let field = this.field,
                    vm = field.upVM(),
                    voyage_data = vm.get('voyage_data');
                field.getStore().load({
                    params: {
                        query: 'TBN',
                    },
                });
                field.setValue(1);
                field.setInputValue('TBN');
                if (voyage_data) {
                    voyage_data.set('vessel_imo', 1);
                    voyage_data.set('vessel_name', 'TBN');
                    voyage_data.set('custom_vessel_id', 'NULL');
                }
            },
            getGroup: function () {
                return;
            },
            getSide: function () {
                return;
            },
        },
    },
    store: {
        type: 'vessel',
        // autoLoad: true,
        pageSize: 100,
    },
    queryMode: 'remote',
    itemConfig: {
        viewModel: {},
    },
});
