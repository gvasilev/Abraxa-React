import '../../../../../../../store/TestTreeStore';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.nomenclatures.show._Subpage', {
    extend: 'Ext.grid.Tree',
    xtype: 'calculator.portcostengine.portsettings.show.nomenclatures.show.subpage',
    testId: 'calculatorNomencaltureListSubpage',
    cls: 'calculator_nomenclature_list',
    flex: 1,
    infinite: false,
    viewModel: {
        data: {
            nomenclatureSelection: null,
        },
        formulas: {
            setRecord: {
                bind: {
                    bindTo: '{nomenclaturesList.selection}',
                },
                get: function(record) {
                    if (record) {
                        this.set('nomenclatureSelection', record);
                    }
                },
            },
            treeStore: {
                bind: {
                    bindTo: '{nomenclatureSelection}',
                    deep: true,
                },
                get: function(record) {
                    if (record) {
                        if (Ext.getStore('treeStore')) {
                            Ext.getStore('treeStore').destroy();
                        }
                        let store = Ext.create('Abraxa.store.TestTreeStore', {
                            root: {
                                text: Ext.String.capitalize(record.get('type')),
                                expanded: true,
                                loaded: true,
                                id: 'root',
                            },
                            data: record.get('items'),
                        });
                        return store;
                    }
                },
            },
        },
    },
    hideHeaders: true,
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{nomenclaturesList.selection.type:capitalize}',
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            right: 16,
                            items: [],
                        },
                    ],
                },
            ],
        },
    ],
    bind: {
        store: '{treeStore}',
    },
    itemConfig: {
        viewModel: {},
        cls: 'cursor-pointer hbox',
    },
    selectable: false,
    columns: [
        {
            xtype: 'treecolumn',
            text: '',
            dataIndex: 'text',
            width: 420,
        },
        {
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            flex: 1,
            cell: {
                align: 'right',
                toolDefaults: {
                    zone: 'start',
                },
                tools: [
                    {
                        xtype: 'button',
                        ui: 'normal small round',
                        iconCls: 'md-icon-add',
                        hideMode: 'opacity',
                        bind: {
                            hidden: '{record.leaf ? true : false}',
                            tooltip: {
                                anchorToTarget: true,
                                html: '{record.parentId != \'root\' ? \'Add category\' : \'Add item\'}',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                            },
                        },
                        handler: function(me) {
                            let record = me.upVM().get('record'),
                                nomenclature = me.upVM().get('nomenclaturesList.selection'),
                                portId = me.upVM().get('calculatorPortSettingsGrid.selection.id'),
                                selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection'),
                                realPortId = me.upVM().get('calculatorPortSettingsGrid.selection.port_id'),
                                store = me.upVM().get('treeStore'),
                                rootRecord = store.queryBy(function(rec) {
                                    return rec.get('id') === 'root';
                                }).items[0];
                            nomenclature.getProxy().setExtraParams({
                                portSettingsId: portId,
                                type: nomenclature.get('type'),
                            });
                            if (record.get('parentId') === 'root') {
                                Ext.create('Ext.Dialog', {
                                    title: 'Add item',
                                    testId: 'calculatorNomenclatureSubpageAddItemDialog',
                                    closable: true,
                                    alwaysOnTop: 2,
                                    viewModel: {
                                        parent: me.upVM(),
                                        formulas: {
                                            terminalFilter: {
                                                bind: {
                                                    bindTo: '{treeStore}',
                                                },
                                                get: function(store) {
                                                    let data = [];
                                                    store.each(function(record) {
                                                        if (record.get('leaf')) data.push(record.get('id'));
                                                    });
                                                    return [
                                                        {
                                                            property: 'id',
                                                            value: data,
                                                            operator: 'notin',
                                                        },
                                                    ];
                                                },
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'form.error',
                                            hidden: true,
                                            margin: 0,
                                            padding: 8,
                                            docked: 'top',
                                        },
                                        {
                                            xtype: 'formpanel',
                                            padding: 0,
                                            scrollable: false,
                                            items: [
                                                {
                                                    xtype: 'commodity.combo',
                                                    label: 'Commodity',
                                                    required: true,
                                                    clearable: true,
                                                    valueField: 'id',
                                                    displayField: 'name',
                                                    placeholder: 'Choose commodity',
                                                    reference: 'itemName',
                                                    labelAlign: 'top',
                                                    forceSelection: true,
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    floatedPicker: {
                                                        minWidth: 220,
                                                    },
                                                    bind: {
                                                        hidden: '{nomenclaturesList.selection.type === "cargo" ? false:true}',
                                                        required:
                                                            '{nomenclaturesList.selection.type === "cargo" ? true:false}',
                                                    },
                                                    triggers: {
                                                        search: null,
                                                    },
                                                    listeners: {
                                                        painted: function() {
                                                            this.focus();
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    labelAlign: 'top',
                                                    label: 'Name',
                                                    clearable: false,
                                                    reference: 'itemVessel',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    placeholder: 'Name',
                                                    required: true,
                                                    bind: {
                                                        hidden: '{nomenclaturesList.selection.type === "vessel" ? false:true}',
                                                        required:
                                                            '{nomenclaturesList.selection.type === "vessel" ? true:false}',
                                                    },
                                                    listeners: {
                                                        painted: function() {
                                                            this.focus();
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'port.terminals',
                                                    label: 'Terminal',
                                                    ui: 'classic',
                                                    cls: 'a-field-icon icon-short icon-rounded',
                                                    reference: 'itemTerminal',
                                                    labelAlign: 'top',
                                                    queryMode: 'local',
                                                    minChars: 3,
                                                    required: true,
                                                    bind: {
                                                        hidden: '{nomenclaturesList.selection.type === "region" ? false:true}',
                                                        required:
                                                            '{nomenclaturesList.selection.type === "region" ? true:false}',
                                                        store: {
                                                            type: 'port.terminals',
                                                            filters: '{terminalFilter}',
                                                        },
                                                    },
                                                    listeners: {
                                                        painted: function() {
                                                            let store = this.getStore();
                                                            store.getProxy().setExtraParams({
                                                                port_id: realPortId,
                                                            });
                                                            store.load();
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            testId: 'calculatorNomenclatureSubpageAddItemDialogCancelBtn',
                                            margin: '0 8 0 0',
                                            handler: function() {
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            text: 'Save',
                                            testId: 'calculatorNomenclatureSubpageAddItemDialogSaveBtn',
                                            ui: 'action',
                                            handler: function() {
                                                const me = this;
                                                const portCostEngineVM = me.upVM();
                                                const form = me.up('dialog').down('formpanel');
                                                const nomenclature =
                                                    portCostEngineVM.get('nomenclaturesList.selection');
                                                const nomenclatureType = nomenclature.get('type');

                                                let item = null;

                                                switch (nomenclatureType) {
                                                    case 'cargo': {
                                                        item = portCostEngineVM.get('itemName.selection');
                                                        if (item) {
                                                            record.appendChild({
                                                                text: item.get('name'),
                                                                parentId: record.get('id'),
                                                                leaf: true,
                                                            });
                                                            nomenclature.get('items').push({
                                                                text: item.get('name'),
                                                                parentId: record.get('id'),
                                                                expanded: true,
                                                                loaded: true,
                                                                id: item.get('id'),
                                                            });
                                                        }
                                                        break;
                                                    }
                                                    case 'vessel': {
                                                        record.appendChild({
                                                            text: portCostEngineVM.get('itemVessel.value'),
                                                            parentId: record.get('id'),
                                                            leaf: true,
                                                        });
                                                        nomenclature.get('items').push({
                                                            text: portCostEngineVM.get('itemVessel.value'),
                                                            parentId: record.get('id'),
                                                            expanded: true,
                                                            loaded: true,
                                                            id: Ext.id(),
                                                        });

                                                        break;
                                                    }
                                                    case 'region': {
                                                        item = portCostEngineVM.get('itemTerminal.selection');
                                                        const pcUid = item.get('pc_uid');
                                                        if (item) {
                                                            record.appendChild({
                                                                text: item.get('name'),
                                                                parentId: record.get('id'),
                                                                leaf: true,
                                                            });
                                                            nomenclature.get('items').push({
                                                                text: item.get('name'),
                                                                parentId: record.get('id'),
                                                                expanded: true,
                                                                loaded: true,
                                                                id: pcUid,
                                                            });
                                                        }

                                                        break;
                                                    }
                                                }

                                                if (form.validate()) {
                                                    nomenclature.save({
                                                        success: function() {
                                                            Ext.toast('Record created', 1000);
                                                            portCostEngineVM.set('nomenclatureSelection', nomenclature);

                                                            // Reloading tariff table store
                                                            portCostEngineVM.get('tarifftable').reload();
                                                            Abraxa.utils.Functions.updatePortCost(selectionPort);

                                                            me.up('dialog').destroy();
                                                        },
                                                        failure: function(batch, functions) {
                                                            portCostEngineVM.get('treeStore').rejectChanges();
                                                            const form = me.up('dialog').down('form\\.error');
                                                            if (form) {
                                                                form.setHtml('Please fill all required fields')
                                                                    .show()
                                                                    .addCls('error');
                                                            }
                                                        },
                                                    });
                                                } else {
                                                    me.up('dialog')
                                                        .down('form\\.error')
                                                        .setHtml('Please fill all required fields')
                                                        .show()
                                                        .addCls('error');
                                                }
                                            },
                                        },
                                    ],
                                }).show();
                            } else {
                                Ext.create('Ext.Dialog', {
                                    closable: true,
                                    alwaysOnTop: 2,
                                    viewModel: {
                                        parent: me.upVM(),
                                    },
                                    title: 'Add category',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            labelAlign: 'top',
                                            label: 'Name',
                                            clearable: false,
                                            reference: 'categoryName',
                                            ui: 'classic',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            placeholder: 'Category name',
                                            listeners: {
                                                painted: function() {
                                                    this.focus();
                                                },
                                            },
                                        },
                                    ],
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            margin: '0 8 0 0',
                                            handler: function() {
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            text: 'Save',
                                            ui: 'action',
                                            handler: function() {
                                                let me = this;
                                                rootRecord.appendChild({
                                                    text: me.upVM().get('categoryName.value'),
                                                    parentId: rootRecord.get('id'),
                                                    expanded: true,
                                                    loaded: true,
                                                });
                                                nomenclature.get('items').push({
                                                    text: me.upVM().get('categoryName.value'),
                                                    parentId: rootRecord.get('id'),
                                                    expanded: true,
                                                    loaded: true,
                                                    id: Ext.id(),
                                                });
                                                nomenclature.save({
                                                    success: function() {
                                                        Ext.toast('Record created', 1000);
                                                        me.upVM().set('nomenclatureSelection', nomenclature);

                                                        // Reloading tariff table store
                                                        me.upVM().get('tarifftable').reload();
                                                        Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                        me.up('dialog').destroy();
                                                    },
                                                    failure: function(batch, functions) {
                                                        me.upVM().get('treeStore').rejectChanges();
                                                        const form = me.up('dialog').down('form\\.error');
                                                        if (form) {
                                                            form.setHtml('Please fill all required fields')
                                                                .show()
                                                                .addCls('error');
                                                        }
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                }).show();
                            }
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'small round',
                        iconCls: 'md-icon-delete md-icon-outlined',
                        bind: {
                            hidden: '{record.id == "root" ? true : false}',
                        },
                        handler: function(me) {
                            let record = this.upVM().get('record'),
                                nomenclature = this.upVM().get('nomenclaturesList.selection'),
                                portId = this.upVM().get('calculatorPortSettingsGrid.selection.id'),
                                selectionPort = this.upVM().get('calculatorPortSettingsGrid.selection'),
                                store = this.upVM().get('treeStore');
                            nomenclature.getProxy().setExtraParams({
                                portSettingsId: portId,
                                type: nomenclature.get('type'),
                            });
                            nomenclature.get('items').forEach(function(item, val) {
                                if (item.id === record.get('id')) {
                                    Ext.Array.remove(nomenclature.get('items'), item);
                                }
                            });
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you would like to delete this entry?',
                                function(answer) {
                                    if (answer === 'yes') {
                                        record.removeAll(true);
                                        store.remove(record);
                                        nomenclature.save({
                                            success: function() {
                                                me.upVM().set('nomenclatureSelection', nomenclature);

                                                // Reloading tariff table store
                                                me.upVM().get('tarifftable').reload();
                                                Abraxa.utils.Functions.updatePortCost(selectionPort);
                                                Ext.toast('Record created', 1000);
                                            },
                                            failure: function(batch, functions) {
                                                me.upVM().get('treeStore').rejectChanges();
                                                me.up('dialog')
                                                    .down('form\\.error')
                                                    .setHtml('Please fill all required fields')
                                                    .show()
                                                    .addCls('error');
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
                                        itemId: 'yes',
                                        ui: 'decline alt',
                                        text: 'Delete',
                                    },
                                ],
                            );
                        },
                    },
                ],
            },
        },
    ],
});
