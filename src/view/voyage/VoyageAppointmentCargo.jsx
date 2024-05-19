Ext.define('Abraxa.view.voyage.VoyageAppointmentCargo', {
    extend: 'Abraxa.core.AbraxaFormList',
    cls: 'a-itinerary-list',
    xtype: 'VoyageAppointmentCargo',

    itemConfig: {
        viewModel: {
            formulas: {
                recordIndex: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            let store = record.store;
                            return store.indexOf(record);
                        }
                    },
                },
            },
        },
        xtype: 'container',
        cls: 'a-card-form',
        items: [
            {
                xtype: 'container',
                cls: 'a-form-heading',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'h5',
                        bind: {
                            html: 'Cargo #{recordIndex+1}',
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'tool-md round',
                        iconCls: 'md-icon md-icon-delete remove_cargo',
                        bind: {
                            hidden: '{activePortcall.is_locked_for_editing}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            anchor: true,
                            html: 'Delete cargo',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                    },
                ],
            },
            {
                xtype: 'container',
                cls: 'a-form-body',
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-form-container a-form-4cols',
                        layout: {
                            type: 'hbox',
                            wrap: true,
                        },
                        defaults: {
                            xtype: 'container',
                            cls: 'a-field-container',
                            defaults: {
                                clearable: false,
                                labelAlign: 'top',
                                ui: 'classic',
                            },
                        },
                        items: [
                            {
                                items: [
                                    {
                                        xtype: 'unit.field',
                                        decimals: 3,
                                        placeholder: '0000.00',
                                        required: true,
                                        cls: 'x-quantityunit a-field-icon icon-rounded icon-short',
                                        label: 'Quantity',
                                        bind: {
                                            value: '{record.quantity}',
                                            valueUnit: '{record.unit}',
                                            options: '{defaultCargoUnits}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                        listeners: {
                                            painted: function (me) {
                                                me.setError(null);
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'commodity.combo',
                                        label: 'Commodity',
                                        required: true,
                                        clearable: true,
                                        valueField: 'id',
                                        displayField: 'name',
                                        placeholder: 'Choose commodity',
                                        cls: 'a-field-icon icon-rounded icon-short',
                                        floatedPicker: {
                                            minWidth: 220,
                                        },
                                        triggers: {
                                            search: null,
                                        },
                                        bind: {
                                            value: '{record.commodity_id}',
                                            permission: '{userPermissions}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                        listeners: {
                                            change: function (combo, value, eOpts) {
                                                if (value && value != '') {
                                                    // All cargoes as cargoes array
                                                    var allCargoesRecord = combo.upVM().get('record');
                                                    var selection = combo.getSelection();
                                                    if (selection) {
                                                        var commodity_name = selection.get('name');
                                                        allCargoesRecord.set('commodity', commodity_name);
                                                    }
                                                }
                                            },
                                            painted: function (me) {
                                                let record = me.upVM().get('record');

                                                if (record.get('commodity')) {
                                                    me.setInputValue(record.get('commodity'));
                                                }
                                                me.setError(null);
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'selectfield',
                                        valueField: 'name',
                                        displayField: 'name',
                                        queryMode: 'local',
                                        placeholder: 'Choose function',
                                        required: true,
                                        cls: 'a-field-icon icon-rounded icon-short',
                                        label: 'Function',
                                        bind: {
                                            value: '{record.function}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                        options: ['Loading', 'Discharging', 'Transshipment', 'Lightering'],
                                        listeners: {
                                            painted: function (me) {
                                                me.setError(null);
                                            },
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'abraxa.datefield',
                                        cls: 'a-field-icon icon-rounded icon-calendar',
                                        label: 'C/P date',
                                        placeholder: 'dd/mm/yy',
                                        dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                        bind: {
                                            value: '{record.cp_date}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Charterer',
                                        placeholder: 'Enter company',
                                        cls: 'a-field-icon icon-rounded icon-domain',
                                        bind: {
                                            value: '{record.charterer_name}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'textfield',
                                        label: 'Charterer’s nominated agent',
                                        placeholder: 'Enter company',
                                        cls: 'a-field-icon icon-rounded icon-business-center',
                                        bind: {
                                            value: '{record.charterer_nominated}',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'abraxa.datefield',
                                        label: 'Laycan start',
                                        placeholder: 'Choose date',
                                        cls: 'a-field-icon icon-rounded icon-calendar',
                                        dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                        bind: {
                                            value: '{record.laycan_from}',
                                            hidden: '{record.function ==="Loading" ? false:true  }',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                ],
                            },
                            {
                                items: [
                                    {
                                        xtype: 'abraxa.datefield',
                                        label: 'Laycan end',
                                        placeholder: 'Choose date',
                                        cls: 'a-field-icon icon-rounded icon-calendar',
                                        dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                        bind: {
                                            value: '{record.laycan_to}',
                                            hidden: '{record.function ==="Loading" ? false:true }',
                                            disabled: '{activePortcall.is_locked_for_editing}',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
});
