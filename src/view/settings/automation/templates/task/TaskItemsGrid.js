Ext.define('Abraxa.view.settings.automation.templates.task.TaskItemsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.automation.tasks.items.grid',
    cls: 'a-offset-grid abraxa-grid',
    testId: 'templatesTaskItemsGrid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    infinite: false,
    flex: 1,
    bind: {
        store: '{templateItems}',
    },
    itemConfig: {
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
                    testId: 'addRowtaskItemGridtestId',
                    ui: 'normal small',
                    iconCls: 'md-icon-add',
                    text: 'Add row',
                    handler: function (me) {
                        let record = Ext.create('Abraxa.model.template.TemplateItem', {
                            order_id: me.upVM().get('templateItems').count() + 1,
                            priority: 'normal',
                            template_id: me.upVM().get('templatesGrid.selection').get('id'),
                        });
                        me.up('grid').getStore().add(record);
                        me.up('grid')
                            .getStore()
                            .sync({
                                success: function () {
                                    let template = me.upVM().get('templatesGrid.selection');
                                    template.set('updated_at', new Date());
                                    template.save();
                                    Ext.toast('Record created', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create template item!');
                                },
                            });
                        // Ext.create('Abraxa.view.settings.automation.templates.task.AddEditTaskItem', {
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
            text: 'Task',
            cls: 'a-column-offset-x32',
            dataIndex: 'name',
            groupable: false,
            flex: 3,
            editable: true,
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            editor: {
                field: {
                    ui: 'classic',
                    clearable: false,
                    xtype: 'textfield',
                    placeholder: 'Task name',
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = editor.upVM().get('templateItems');
                        if (store) {
                            store.sync({
                                success: function (batch, opt) {
                                    let template = me.upVM().get('templatesGrid.selection');
                                    template.set('updated_at', new Date());
                                    template.save();
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update template item!');
                                },
                            });
                        }
                    },
                },
            },
            renderer: function (value) {
                if (value) {
                    return (
                        '<div class="hbox"><i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i><div class="ml-16 text-truncate"><div class="text-truncate fw-b c-blue">' +
                        value +
                        '</div></div></div>'
                    );
                }
                return '<div class="hbox"><i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i><span class="a-cell-placeholder ml-16">Task name</span></div>';
            },
        },
        {
            text: 'Priority',
            dataIndex: 'priority',
            // flex: 1,
            minWidth: 160,
            cell: {
                encodeHtml: false,
            },
            editor: {
                field: {
                    xtype: 'selectfield',
                    label: false,
                    placeholder: 'Choose priority',
                    displayField: 'name',
                    valueField: 'value',
                    options: [
                        {
                            name: 'Normal',
                            value: 'normal',
                        },
                        {
                            name: 'High',
                            value: 'high',
                        },
                    ],
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = editor.upVM().get('templateItems');
                        if (store) {
                            store.sync({
                                success: function (batch, opt) {
                                    let template = me.upVM().get('templatesGrid.selection');
                                    template.set('updated_at', new Date());
                                    template.save();
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update template item!');
                                },
                            });
                        }
                    },
                },
            },
            renderer: function renderer(value) {
                if (value) {
                    if (value == 'high')
                        return (
                            '<span class="a-status-badge rounded status-high no-border">' +
                            Ext.String.capitalize(value) +
                            '</span>'
                        );
                    else {
                        // return Ext.String.capitalize(value);
                        return (
                            '<span class="a-status-badge rounded status-normal no-border">' +
                            Ext.String.capitalize(value) +
                            '</span>'
                        );
                    }
                }
                return '<span class="a-cell-placeholder">---</span>';
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
                                            let template = grid.upVM().get('templatesGrid.selection');
                                            template.set('updated_at', new Date());
                                            template.save();
                                            templates.reload();
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
                                        testId: 'deleteRowtaskItemGridtestIdConfirm',
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
        // beforedrop: function (node, data, overModel, dropPosition) {
        //     let store = this.upVM().get('templateItems');
        //     store.each(function (val, index) {
        //         val.set('order_id', store.indexOf(val) + 1);
        //         val.dirty = true;
        //     });
        //     store.sync({
        //         success: Ext.toast('Record updated'),
        //     });
        //     return false;
        // },
        drop: function (node, data, overModel, dropPosition) {
            let mainStore = this.upVM().get('templateItems');

            mainStore.each(function (val, index) {
                val.set('order_id', index + 1);
                val.dirty = true;
            });
            mainStore.sync({
                success: Ext.toast('Record updated'),
            });
        },
    },
});
