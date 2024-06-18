import '../../../../../view/common/combo/SofGeneralEvents';

Ext.define('Abraxa.view.settings.automation.templates.sof.SofItemsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.automation.sof.items.grid',
    cls: 'a-offset-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    infinite: false,
    flex: 1,
    scrollable: 'y',
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
                    testId: 'addSofItemBtnRulesAndTeamsSettingsTestId',
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
                        // Ext.create('Abraxa.view.settings.automation.templates.sof.AddEditSofItem', {
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
            width: 48,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            sortable: true,
            cls: 'a-column-actions',
            cell: {
                encodeHtml: false,
                cls: 'no_expand a_grid_action a-cell-more',
                tpl: '<i class="md-icon-outlined fs-16 cursor-drag">drag_indicator</i>',
            },
        },
        {
            dataIndex: 'default_sof_event_id',
            text: 'Event',
            sortable: false,
            editable: true,
            menuDisabled: true,
            width: 300,
            cell: {
                encodeHtml: false,
            },
            editor: {
                field: {
                    xtype: 'sof.general.events',
                    padding: '0 4',
                    ui: 'classic hovered-border',
                    placeholder: 'Event name',
                    bind: {
                        store: '{sofEvents}',
                    },
                    listeners: {
                        select: function (cmp, selection) {
                            if (cmp.parent) {
                                let grid = cmp.up('grid'),
                                    record = grid.getSelection();
                                record.set('event_name', selection.get('name'));
                                record.set('event_alias', selection.get('event_alias'));
                            }
                        },
                        keydown: function (cmp, e) {
                            let key = e.event.key,
                                shiftKey = e.shiftKey;

                            if (key == 'Tab' && shiftKey) {
                                let grid = cmp.up('grid'),
                                    record = grid.getSelection(),
                                    editor = grid.getPlugin(),
                                    store = grid.getStore(),
                                    index = store.indexOf(record);

                                if (index != 0) {
                                    editor.startEdit(index - 1, 1);
                                    grid.select(index - 1);
                                }
                            }
                        },
                    },
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = this.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                            },
                        });
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    if (record && record.get('event')) {
                        let cls = '';
                        let eventName = record.get('event_name');
                        switch (record.get('event').type.default_sof_event_category_id) {
                            case 1:
                                cls = 'sof-event';
                                break;
                            case 4:
                                cls = 'sof-working';
                                break;
                            case 5:
                                cls = 'sof-stoppage';
                                break;
                            case 3:
                                cls = 'sof-shifting';
                                break;
                            case 2:
                                cls = 'sof-waiting';
                                break;
                            default:
                                cls = 'sof-miscellaneous';
                        }
                        return (
                            '<div class="hbox"><div class="a-badge-sof ' +
                            cls +
                            '"></div><span>' +
                            eventName +
                            '</span>'
                        );
                    }
                }
                return '<span class="a-cell-placeholder">Select event</span>';
            },
        },
        {
            text: 'Event comment',
            dataIndex: 'event_comment',
            sortable: false,
            menuDisabled: true,
            editable: true,
            flex: 1,
            editor: {
                field: {
                    ui: 'classic',
                    placeholder: 'Comment',
                    xtype: 'textfield',
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
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
            dataIndex: 'portcall_status_trigger',
            text: 'Portcall status',
            sortable: false,
            editable: true,
            menuDisabled: true,
            minWidth: 180,
            cell: {
                cls: 'a-cell-status',
                encodeHtml: false,
            },
            editor: {
                field: {
                    xtype: 'selectfield',
                    ui: 'classic hovered-border',
                    placeholder: 'Status',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    anyMatch: true,
                    typeAhead: false,
                    forceSelection: true,
                    matchFieldWidth: false,
                    clearable: true,
                    bind: {
                        store: '{portcallAgentStatus}',
                    },
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                            },
                        });
                    },
                },
            },
            renderer: function (value, record) {
                if (value) {
                    let status = this.upVM().get('portcallAgentStatus').getById(value);
                    if (status) {
                        return (
                            '<div class="a-status-badge status-' +
                            status.get('name').toLocaleLowerCase() +
                            '">' +
                            status.get('name') +
                            '</div></div>'
                        );
                    }
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'port_itinerary_trigger',
            text: 'Port itinerary',
            sortable: false,
            editable: true,
            menuDisabled: true,
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            editor: {
                field: {
                    xtype: 'selectfield',
                    ui: 'classic hovered-border',
                    placeholder: 'Port itinerary',
                    valueField: 'value',
                    displayField: 'text',
                    queryMode: 'local',
                    clearable: true,
                    options: [
                        {
                            text: 'ATA',
                            value: 'port_ata',
                        },
                        {
                            text: 'ATD',
                            value: 'port_atd',
                        },
                    ],
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                            },
                        });
                    },
                },
            },
            renderer: function (value, record) {
                if (value) return value.split('_')[1].toUpperCase();

                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'berth_itinerary_trigger',
            text: 'Berth itinerary',
            sortable: false,
            editable: true,
            menuDisabled: true,
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            editor: {
                field: {
                    xtype: 'selectfield',
                    ui: 'classic hovered-border',
                    placeholder: 'Berth itinerary',
                    valueField: 'value',
                    displayField: 'text',
                    queryMode: 'local',
                    clearable: true,
                    options: [
                        {
                            text: 'Berthed',
                            value: 'berthed',
                        },
                        {
                            text: 'Completed',
                            value: 'completed',
                        },
                        {
                            text: 'Departed',
                            value: 'departed',
                        },
                    ],
                },
                listeners: {
                    complete: function (editor) {
                        let me = this,
                            store = me.upVM().get('templateItems');
                        store.sync({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                                let template = me.upVM().get('templatesGrid.selection');
                                template.set('updated_at', new Date());
                                template.save();
                            },
                        });
                    },
                },
            },
            renderer: function (value, record) {
                if (value) return '<span class="text-capitalize">' + value + '</span>';
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: '',
            width: 32,
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
                                        testId: 'deleteSofItemBtnAddEditTemplateTestIdDialogConfirm',
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
