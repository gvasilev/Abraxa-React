Ext.define('Abraxa.view.settings.library.ports.BerthsRightCard', {
    extend: 'Ext.Container',
    xtype: 'settings.library.berths.right.card',
    cls: 'a-right-container',
    hidden: true,
    itemId: 'berthRightCard',
    // bind: {
    //     hidden: '{berthsGrid.selection ? false : true}',
    // },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        stores: {
            terminalsPerPort: {
                source: '{portsServerGrid.selection.terminals}',
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">place</i></div>{berthsGrid.selection.name}',
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
                            iconCls: 'md-icon-outlined md-icon-edit',
                            ui: 'round tool-round-md',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Edit',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            slug: 'settingsLibraryBerth',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{berthsGrid.selection.company_id ? true : false}',
                            },
                            handler: function (btn, e) {
                                let me = this,
                                    record = me.upVM().get('berthsGrid.selection'),
                                    currentUser = Ext.Viewport.getViewModel().get('currentUser'),
                                    port = me.upVM().get('portsServerGrid.selection');
                                let recordData = record.getData();
                                delete recordData['id'];
                                let newRecord = new Abraxa.model.common.Berth(Object.assign({}, recordData));
                                newRecord.set('port_id', port.get('port_id'));
                                newRecord.set('duplicates', record.get('id'));
                                newRecord.set('company_id', currentUser.get('current_company_id'));
                                Ext.create('Abraxa.view.settings.library.ports.AddBerth', {
                                    viewModel: {
                                        parent: btn.upVM(),
                                        stores: {
                                            terminalsPerPort: {
                                                source: '{portsServerGrid.selection.terminals}',
                                            },
                                        },
                                        data: {
                                            editMode: false,
                                            store: btn.upVM().get('portsServerGrid.selection').berths(),
                                            berth: newRecord,
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'deleteBerthRightCardBtn',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryBerthDelete',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{berthsGrid.selection.company_id ? false:true}',
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
                                    store = vm.get('portsServerGrid.selection').berths(),
                                    container = this.find('berthRightCard'),
                                    portserveRecord = vm.get('portserveRecord'),
                                    currentUser = vm.get('currentUser'),
                                    record = vm.get('berthsGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                                    portserveRecord.set('updated_at', new Date());
                                                    portserveRecord.save();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
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
                                            testId: 'deleteBerthRightCardBtnConfirm',
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
                                let record = this.upVM().get('berthsGrid.selection'),
                                    grid = Ext.ComponentQuery.query('settings\\.library\\.berths\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=settings\\.library\\.berths\\.right\\.card]').hide();
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
            testId: 'berthRightCardFormEditInfoContainer',
            padding: '0 24',
            layout: 'vbox',
            scrollable: 'y',
            flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
                listeners: {
                    blur: function (me) {
                        let record = me.upVM().get('berthsGrid.selection'),
                            portserveRecord = me.upVM().get('portserveRecord'),
                            currentUser = me.upVM().get('currentUser');
                        if (record.dirty) {
                            record.save({
                                success: function () {
                                    portserveRecord.set('updated_by_user', currentUser.getData());
                                    portserveRecord.set('updated_at', new Date());
                                    portserveRecord.save();
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                    },
                },
                slug: 'settingsLibraryBerth',
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
                            testId: 'berthRightCardFormEditInfoContainerNameField',
                            ui: 'field-xl no-border classic',
                            label: false,
                            clearable: false,
                            bind: {
                                value: '{berthsGrid.selection.name}',
                                ui: '{berthsGrid.selection.company_id ? "field-xl no-border classic":"viewonly field-xl no-border classic"}',
                                readOnly: '{berthsGrid.selection.company_id ? false : true}',
                            },
                            required: true,
                            listeners: {
                                blur: function (me) {
                                    let record = me.upVM().get('berthsGrid.selection'),
                                        portserveRecord = me.upVM().get('portserveRecord'),
                                        currentUser = me.upVM().get('currentUser');
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                portserveRecord.set('updated_by_user', currentUser.getData());
                                                portserveRecord.set('updated_at', new Date());
                                                portserveRecord.save();
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
                    xtype: 'port.terminals',
                    testId: 'berthRightCardFormEditInfoContainerTerminalsComboField',
                    label: 'Terminal',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{berthsGrid.selection.terminal_id}',
                        store: '{terminalsPerPort}',
                        ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                    listeners: {
                        beforequery: function (me) {
                            let combo = me.combo,
                                store = combo.getStore(),
                                portSelection = this.upVM().get('berthPortCombo.selection');

                            if (!store.autoLoad && portSelection) {
                                if (!store.getProxy().extraParams.port_id) {
                                    store.getProxy().setExtraParams({
                                        port_id: portSelection.get('id'),
                                    });
                                    store.load();
                                } else {
                                    if (store.getProxy().extraParams.port_id != portSelection.get('id')) {
                                        store.getProxy().setExtraParams({
                                            port_id: portSelection.get('id'),
                                        });
                                        store.load();
                                    }
                                }
                            } else if (store.autoLoad && portSelection) {
                                if (!store.getProxy().extraParams.port_id) {
                                    store.getProxy().setExtraParams({
                                        port_id: portSelection.get('id'),
                                    });
                                    store.load();
                                } else {
                                    if (store.getProxy().extraParams.port_id != portSelection.get('id')) {
                                        store.getProxy().setExtraParams({
                                            port_id: portSelection.get('id'),
                                        });
                                        store.load();
                                    }
                                }
                            }
                            store.clearFilter();
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'berthRightCardFormEditInfoContainerBerthIMOField',
                    label: 'IMO',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'IMO number',
                    bind: {
                        value: '{berthsGrid.selection.imo}',
                        ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'berthRightCardFormEditInfoContainerBerthUNField',
                    label: 'UN Locator code',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Enter UN code',
                    bind: {
                        value: '{berthsGrid.selection.un_locator_code}',
                        ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'berthRightCardFormEditInfoContainerBerthTypeComboField',
                    label: 'Type',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Choose type',
                    options: [
                        {
                            text: 'Berth',
                            value: 'berth',
                        },
                        {
                            text: 'Buoy',
                            value: 'buoy',
                        },
                        {
                            text: 'Anchorage',
                            value: 'anchorage',
                        },
                        {
                            text: 'Jetty',
                            value: 'jetty',
                        },
                    ],
                    bind: {
                        value: '{berthsGrid.selection.type}',
                        ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'berthRightCardFormEditInfoContainerBerthFunctionComboField',
                    label: 'Function',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    forceSelection: true,
                    placeholder: 'Function',
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    bind: {
                        value: '{berthsGrid.selection.function}',
                        ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                    store: {
                        type: 'berth.function',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                // Restrictions
                {
                    xtype: 'container',
                    html: '<div class="h3 mt-0">Restrictions</div>',
                },
                {
                    xtype: 'container',
                    defaults: {
                        slug: 'settingsLibraryBerth',
                        bind: {
                            permission: '{userPermissions}',
                        },
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            testId: 'berthRightCardFormEditInfoContainerBerthDraftField',
                            label: 'Draft',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berthsGrid.selection.draft}',
                                ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                                readOnly: '{berthsGrid.selection.company_id ? false : true}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthRightCardFormEditInfoContainerBerthAirDraftField',
                            label: 'Air draft',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berthsGrid.selection.air_draft}',
                                ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                                readOnly: '{berthsGrid.selection.company_id ? false : true}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthRightCardFormEditInfoContainerBerthBeamField',
                            label: 'Beam',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berthsGrid.selection.beam}',
                                ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                                readOnly: '{berthsGrid.selection.company_id ? false : true}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'berthRightCardFormEditInfoContainerBerthLoaField',
                            label: 'Loa',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: '00.00',
                            clearable: false,
                            bind: {
                                value: '{berthsGrid.selection.loa}',
                                ui: '{berthsGrid.selection.company_id ? "hovered-border classic":"viewonly classic"}',
                                readOnly: '{berthsGrid.selection.company_id ? false : true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                // DESCRIPTION
                {
                    xtype: 'container',
                    html: '<div class="h3 mt-0">Description</div>',
                },
                {
                    xtype: 'textareafield',
                    testId: 'berthRightCardFormEditInfoContainerBerthDescriptionField',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{berthsGrid.selection.description}',
                        ui: '{berthsGrid.selection.company_id ? "no-border no-underline":"viewonly no-border no-underline"}',
                        readOnly: '{berthsGrid.selection.company_id ? false : true}',
                    },
                },
            ],
        },
    ],
});
