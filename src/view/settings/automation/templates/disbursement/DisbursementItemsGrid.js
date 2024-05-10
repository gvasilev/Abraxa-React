Ext.define('Abraxa.view.settings.automation.templates.disbursement.DisbursementItemsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.automation.disbursement.items.grid',
    cls: 'a-offset-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    infinite: true,
    flex: 1,
    bind: {
        store: '{templateItems}',
    },
    itemConfig: {
        height: 48,
        viewModel: true,
    },
    plugins: {
        gridcellediting: {
            selectOnEdit: true,
            triggerEvent: 'click',
        },
        gridrowdragdrop: true,
    },
    items: [
        {
            xtype: 'container',
            padding: 16,
            items: [
                {
                    xtype: 'button',
                    testId: 'addDisbursementItemBtnRulesAndTeamsSettingsTestId',
                    ui: 'normal small',
                    iconCls: 'md-icon-add',
                    text: 'Add row',
                    handler: function (me) {
                        let record = Ext.create('Abraxa.model.template.TemplateItem', {
                            order_id: me.upVM().get('templateItems').count() + 1,
                            template_id: me.upVM().get('templatesGrid.selection').get('id'),
                        });
                        me.up('grid').getStore().add(record);
                        me.up('grid')
                            .getStore()
                            .sync({
                                success: function () {
                                    Ext.toast('Record created', 1000);
                                    let template = me.upVM().get('templatesGrid.selection');
                                    template.set('updated_at', new Date());
                                    template.save();
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create template item!');
                                },
                            });
                        // Ext.create('Abraxa.view.settings.automation.templates.disbursement.AddEditDisbursementItem', {
                        //     viewModel: {
                        //         parent: me.upVM(),
                        //         data: {
                        //             title: 'Create item',
                        //             editMode: false,
                        //             record: Ext.create('Abraxa.model.template.TemplateItem', {
                        //                 order_id: me.upVM().get('templateItems').count() + 1
                        //             }),
                        //         }
                        //     }
                        // }).show();
                    },
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Main Port Costs',
            cls: 'a-column-offset-x32',
            dataIndex: 'default_expense_item_id',
            sortable: false,
            minWidth: 320,
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            flex: 1,
            menuDisabled: true,
            editable: true,
            editor: {
                field: {
                    xtype: 'default.expense.items.combo',
                    itemCls: 'a-disb-costs-combo',
                    displayField: 'name',
                    placeholder: 'Choose item',
                    // valueField: 'id',
                    matchFieldWidth: false,
                    listeners: {
                        painted: function (field) {
                            let record = field.up().ownerCmp.getRecord();

                            if (record && record.get('default_expense_item_name'))
                                this.setInputValue(record.get('default_expense_item_name'));
                        },
                    },
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        var val = editor.getField().getInputValue();
                        let gridRecord = editor.ownerCmp.getRecord();
                        if (val && val != '' && val != 0) {
                            gridRecord.set('default_expense_item_name', val);
                            // gridRecord.set('type', editor.getField().getSelection().get('type'));
                            store.sync({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                    let template = me.upVM().get('templatesGrid.selection');
                                    template.set('updated_at', new Date());
                                    template.save();
                                },
                            });
                        } else {
                            store.rejectChanges();
                        }
                    },
                },
            },

            renderer: function (val, selection) {
                if (val) {
                    return (
                        '<div class="hbox"><i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i><div class="ml-16"><div class="text-truncate fw-b c-blue">' +
                        selection.get('default_expense_item_name') +
                        '</div></div></div>'
                    );
                } else {
                    return '<div class="hbox"><i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i><span class="a-cell-placeholder ml-16">Choose item</span></div>';
                }
            },
        },
        {
            dataIndex: 'pda_price',
            menuDisabled: true,
            sortable: false,
            editable: true,
            text: 'PDA',
            flex: 1,
            align: 'right',
            cell: {
                cls: 'a-cell-amount a-final-da-cell',
                encodeHtml: false,
            },
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: '00.00',
                    clearable: false,
                    xtype: 'numberfield',
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    return Ext.util.Format.number(value, '0,000.00');
                } else {
                    return '<span class="a-cell-placeholder">00.00</span>';
                }
            },
        },
        {
            text: 'comment',
            dataIndex: 'comment',
            sortable: false,
            menuDisabled: true,
            editable: true,
            flex: 1.5,
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: AbraxaConstants.placeholders.emptyValue,
                    xtype: 'textfield',
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = this.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    },
                },
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (!value) return '<span class="a-cell-placeholder">---</span>';

                return value;
            },
        },
        {
            dataIndex: '',
            minWidth: 96,
            flex: 1,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            sortable: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        hideMode: 'opacity',
                        arrow: false,
                        iconCls: 'md-icon-remove-circle-outline',
                        ui: 'tool-xs round',
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
                        handler: function (owner, tool, event) {
                            let record = owner.toolOwner.getRecord(),
                                grid = owner.up('grid'),
                                templates = this.upVM().get('templates'),
                                store = grid.getStore();
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you would like to delete this row?',
                                function (answer) {
                                    if (answer != 'yes') return;
                                    store.remove(record);
                                    store.sync({
                                        success: function () {
                                            templates.reload();
                                            let template = grid.upVM().get('templatesGrid.selection');
                                            template.set('updated_at', new Date());
                                            template.save();
                                            Ext.toast('Record updated');
                                        },
                                    });
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
                                        testId: 'deleteDisbursementItemBtnAddEditTemplateTestIdDialogConfirm',
                                        itemId: 'yes',
                                        ui: 'decline alt',
                                        text: 'Delete',
                                    },
                                ]
                            );
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (me, selection) {
            let record = selection.record;
            if (record && selection.source.target.tagName != 'BUTTON') {
                let upContainer = Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=templateDetails]')[0];
                upContainer.setHidden(true);
                downContainer
                    .setShowAnimation({
                        type: 'slide',
                        direction: 'left',
                    })
                    .show();
            }
        },
        drop: function (node, data, overModel, dropPosition) {
            if (!overModel) {
                return false;
            }
            let store = this.upVM().get('templateItems');
            store.each(function (val, index) {
                val.set('order_id', index + 1);
                val.dirty = true;
            });
            store.sync({
                success: Ext.toast('Record updated'),
            });
        },
    },
});
