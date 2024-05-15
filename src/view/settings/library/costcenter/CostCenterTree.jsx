Ext.define('Abraxa.view.settings.library.cost_center.CostCenterTree', {
    extend: 'Ext.grid.Tree',
    xtype: 'CostCenterTree',
    cls: 'calculator_nomenclature_list a-cost-center-tree',
    flex: 1,
    infinite: false,
    hideHeaders: true,
    expanderOnly: false,
    requires: ['Ext.grid.plugin.RowDragDrop'],
    plugins: {
        gridrowdragdrop: true,
    },
    viewModel: {
        links: {
            selectedCostCenter: '{costCenterGrid.selection}',
        },
        // stores: {
        //     costCenterTree: {
        //         type: 'tree',
        //         rootVisible: true,
        //         parentIdProperty: 'parent_id',
        //         root: {
        //             text: '{selectedCostCenter.name}',
        //             id: 'root',
        //             expanded: true,
        //             loaded: true,
        //             incrementalId: '{selectedCostCenter.id}',
        //         },
        //         data: '{selectedCostCenter.items}',
        //     },
        // },
        formulas: {
            costCenterTree: {
                bind: {
                    bindTo: '{selectedCostCenter}',
                },
                get: function (record) {
                    if (record) {
                        return new Ext.data.TreeStore({
                            rootVisible: true,
                            parentIdProperty: 'parent_id',
                            root: {
                                text: record.get('name'),
                                id: 'root',
                                expanded: true,
                                loaded: true,
                                incrementalId: record.get('id'),
                                relatedRecord: record,
                            },
                            data: record.get('items'),
                        });
                    }
                },
            },
        },
    },
    bind: {
        store: '{costCenterTree}',
    },
    // items: [
    //     {
    //         xtype: 'container',
    //         docked: 'top',
    //         items: [
    //             {
    //                 xtype: 'container',
    //                 height: 64,
    //                 cls: 'a-titlebar a-bb-100',
    //                 items: [
    //                     {
    //                         xtype: 'title',
    //                         bind: {
    //                             title: '{costCenterGrid.selection.name}',
    //                         },
    //                     },
    //                     {
    //                         xtype: 'container',
    //                         cls: 'a-tools',
    //                         right: 16,
    //                         items: [],
    //                     },
    //                 ],
    //             },
    //         ],
    //     },
    // ],
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
                        ui: 'normal small',
                        iconCls: 'md-icon-add',
                        hideMode: 'opacity',
                        text: 'Add sub-center',
                        bind: {
                            hidden: '{record.id == "root" ? false : true}',
                        },
                        handler: 'showCreateSubCostCenterPopup',
                    },
                    {
                        xtype: 'button',
                        margin: '0 8',
                        ui: 'normal small',
                        iconCls: 'md-icon-add',
                        hideMode: 'opacity',
                        text: 'Assign service',
                        hidden: true,
                        bind: {
                            hidden: '{record.leaf ? true : false}',
                        },
                        handler: 'showAssignServiceToCostCenterPopup',
                    },
                    {
                        xtype: 'button',
                        ui: 'small round',
                        iconCls: 'md-icon-delete md-icon-outlined',
                        bind: {
                            hidden: '{record.id == "root" ? true : false}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            anchor: true,
                            html: 'Delete',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            let record = this.upVM().get('record'),
                                costCenter = this.upVM().get('costCenterGrid.selection');

                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you would like to delete this entry?',
                                function (answer) {
                                    if (answer === 'yes') {
                                        let costCenterStore = this.lookupViewModel().get('costCenterStore'),
                                            recordType = record.get('type'),
                                            model;

                                        if (recordType === 'subCenter') {
                                            model = Ext.create('Abraxa.model.costcenter.SubCostCenter', {
                                                id: record.get('id'),
                                            });
                                        } else if (recordType === 'service') {
                                            model = Ext.create('Abraxa.model.costcenter.CostCenterService', {
                                                id: record.get('id'),
                                            });
                                        }

                                        model.getProxy().setExtraParams({
                                            costCenterId: costCenter.get('id'),
                                        });
                                        model.erase({
                                            callback: function () {
                                                costCenterStore.reload();
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
                                ]
                            );
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        beforedrop: function (node, data, overModel, dropPosition, dropHandlers) {
            if (data.records[0].get('id') === 'root' || data.records[0].get('type') === 'subCenter') {
                return false;
            }
            let costCenter = this.lookupViewModel().get('costCenterGrid.selection'),
                subCenterId =
                    overModel.get('type') === 'subCenter'
                        ? overModel.get('id')
                        : overModel.parentNode.get('type') === 'subCenter'
                          ? overModel.parentNode.get('id')
                          : null;

            let service = Ext.create('Abraxa.model.costcenter.CostCenterService', {
                id: data.records[0].get('id'),
            });
            service.set('subcenter_id', subCenterId);
            service.getProxy().setExtraParams({
                costCenterId: overModel.getTreeStore().getRoot().get('incrementalId'),
            });
            service.save({
                callback: function (record, operation, success) {
                    costCenter.load();
                },
            });

            overModel.parentNode
                ? overModel.parentNode.appendChild(data.records[0])
                : overModel.appendChild(data.records[0]);
        },
    },
});
