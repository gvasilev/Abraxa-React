Ext.define('Abraxa.view.settings.library.taxes.TaxesRightCard', {
    extend: 'Ext.Container',
    xtype: 'taxes.right.card',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{taxGrid.selection ? false : true}',
    },
    itemId: 'taxRightCard',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">receipt_long</i></div>{taxGrid.selection.name}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            testId: 'taxesRightCardDeleteButton',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryTaxDelete',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('taxes'),
                                    container = this.find('taxRightCard'),
                                    record = vm.get('taxGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            testId: 'taxesRightCardDeleteConfirmButton',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let record = this.upVM().get('taxGrid.selection'),
                                    grid = Ext.ComponentQuery.query('settings\\.library\\.taxes\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=taxes\\.right\\.card]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
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
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-info',
            layout: 'vbox',
            scrollable: 'y',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            defaults: {
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                listeners: {
                                    blur: function (me) {
                                        let record = me.upVM().get('taxGrid.selection');
                                        if (record.dirty) {
                                            record.save({
                                                success: function (rec) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    },
                                },
                                slug: 'settingsLibraryTax',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'general_data_container a-dialog-wrap',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            testId: 'taxesRightCardNameField',
                                            ui: 'field-xl no-border classic',
                                            label: false,
                                            clearable: false,
                                            required: true,
                                            placeholder: 'Enter tax name',
                                            bind: {
                                                value: '{taxGrid.selection.name}',
                                            },
                                            listeners: {
                                                blur: function (me) {
                                                    let record = me.upVM().get('taxGrid.selection');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function (rec) {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'textfield',
                                    testId: 'taxesRightCardCodeField',
                                    label: 'Code',
                                    placeholder: 'Enter code',
                                    labelAlign: 'left',
                                    cls: 'a-field-icon icon-numbers icon-rounded',
                                    ui: 'classic hovered-border',
                                    bind: {
                                        value: '{taxGrid.selection.code}',
                                    },
                                },
                                {
                                    xtype: 'numberfield',
                                    testId: 'taxesRightCardAmountField',
                                    label: 'Amount',
                                    labelAlign: 'left',
                                    minValue: 0,
                                    maxValue: 100,
                                    placeholder: '00.00',
                                    cls: 'a-field-icon icon-percent icon-rounded',
                                    ui: 'classic hovered-border',
                                    bind: {
                                        value: '{taxGrid.selection.amount}',
                                    },
                                    listeners: {
                                        change: function () {
                                            if (this.getValue() > this.getMaxValue()) {
                                                this.setValue(this.getMaxValue());
                                                this.setError(false);
                                            }
                                        },
                                        focusleave: function () {
                                            this.setError(false);
                                        },
                                    },
                                },
                                {
                                    xtype: 'ports.served.combo',
                                    testId: 'taxesRightCardPortsServedCombo',
                                    label: 'Ports applicable',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-port icon-rounded',
                                    multiSelect: true,
                                    forceSelection: false,
                                    bind: {
                                        placeholder: '{taxGrid.selection.port_ids ? null:"Choose ports"}',
                                        value: '{taxGrid.selection.port_ids}',
                                    },
                                },
                                {
                                    xtype: 'default.expense.items.combo',
                                    testId: 'taxesRightCardDefaultExpenseItemsCombo',
                                    label: 'Service',
                                    labelAlign: 'left',
                                    placeholder: 'Choose service',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    itemCls: 'a-disb-costs-combo',
                                    multiSelect: true,
                                    forceSelection: false,
                                    bind: {
                                        value: '{taxGrid.selection.services_ids}',
                                    },
                                    listeners: {
                                        beforequery: function () {
                                            let store = this.getStore();
                                            if (store) {
                                                store.removeFilter(8787);
                                                store.addFilter({
                                                    id: 8787,
                                                    filterFn: function (record) {
                                                        if (
                                                            record &&
                                                            record.get('category') &&
                                                            record.get('category').name == 'port'
                                                        )
                                                            return true;
                                                    },
                                                });
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
