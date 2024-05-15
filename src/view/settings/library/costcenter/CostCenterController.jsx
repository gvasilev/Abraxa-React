Ext.define('Abraxa.view.settings.library.cost_center.CostCenterController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.CostCenterController',

    control: {
        'field[cls~=cost_center_field]': {
            focusleave: 'updateCostCenterService',
        },
    },

    showCreateCostCenterPopup: function (cmp) {
        Ext.create({
            xtype: 'CreateCostCenterPopup',
            viewModel: {
                data: {
                    costCenter: new Abraxa.model.costcenter.CostCenter(),
                    costCenterStore: cmp.lookupViewModel().get('costCenterStore'),
                },
            },
        }).show();
    },

    createCostCenter: function (cmp) {
        const formpanel = cmp.up('dialog').down('formpanel');
        const costCenter = cmp.lookupViewModel().get('costCenter');
        const costCenterStore = cmp.lookupViewModel().get('costCenterStore');
        if (!formpanel.validate()) {
            cmp.toggle();
            return;
        }

        costCenterStore.add(costCenter);
        costCenterStore.sync({
            success: function () {
                Ext.toast('Record created');
                cmp.up('dialog').destroy();
            },
            failure: function (batch) {
                let errMsg;
                try {
                    errMsg = batch.operations[0].error.response.responseJson.message;
                } catch (e) {
                    errMsg = AbraxaConstants.messages.anErrorOccured.message;
                }
                costCenterStore.remove(costCenter);
                Ext.Msg.warning(AbraxaConstants.messages.anErrorOccured.title, errMsg);
                cmp.up('dialog').destroy();
            },
        });
    },

    showCreateSubCostCenterPopup: function (cmp) {
        Ext.create({
            xtype: 'CreateSubCostCenterPopup',
            viewModel: {
                data: {
                    subCostCenter: new Abraxa.model.costcenter.SubCostCenter(),
                    costCenter: cmp.lookupViewModel().get('record'),
                },
            },
        }).show();
    },

    createSubCostCenter: function (cmp) {
        let subCostCenter = cmp.lookupViewModel().get('subCostCenter'),
            costCenter = cmp.lookupViewModel().get('costCenter'),
            costCenterStore = costCenter.get('relatedRecord').store;

        subCostCenter.getProxy().setExtraParams({
            costCenterId: costCenter.get('incrementalId'),
        });

        subCostCenter.save({
            callback: function (record, operation, success) {
                if (success) {
                    costCenterStore.load({
                        callback: function () {
                            Ext.toast('Record created');
                            cmp.up('dialog').destroy();
                        },
                    });
                }
            },
        });
    },

    showAssignServiceToCostCenterPopup: function (cmp) {
        Ext.create({
            xtype: 'AssignServiceToCostCenterPopup',
            viewModel: {
                data: {
                    costCenter: cmp.lookupViewModel().get('record'),
                    costCenterServices: new Abraxa.model.costcenter.CostCenterService(),
                },
            },
        }).show();
    },

    assignServiceToCostCenter: function (cmp) {
        let costCenter = cmp.lookupViewModel().get('costCenter'),
            costCenterServices = cmp.lookupViewModel().get('costCenterServices'),
            selectedServices = cmp.lookupViewModel().get('selectedServices'),
            costCenterStore = costCenter.get('incrementalId')
                ? costCenter.get('relatedRecord').store
                : costCenter.parentNode.get('relatedRecord').store,
            defaultExpenseItemIds = [];

        Ext.each(selectedServices, function (service) {
            defaultExpenseItemIds.push(service.get('id'));
        });

        costCenterServices.set('default_expense_items_ids', defaultExpenseItemIds);

        if (!costCenter.isRoot()) costCenterServices.set('subcenter_id', costCenter.getId());

        costCenterServices.getProxy().setExtraParams({
            costCenterId: costCenter.get('incrementalId')
                ? costCenter.get('incrementalId')
                : costCenter.parentNode.get('incrementalId'),
        });

        costCenterServices.save({
            callback: function (record, operation, success) {
                if (success) {
                    costCenterStore.load({
                        callback: function () {
                            Ext.getStore('defaultExpenseItemsStore').load();
                            Ext.toast('Record created');
                            cmp.up('dialog').destroy();
                        },
                    });
                }
            },
        });

        // costCenter.sort(function (node1, node2) {
        //     const isLeaf1 = node1.isLeaf();
        //     const isLeaf2 = node2.isLeaf();

        //     // If both nodes are leaf nodes, sort by ID in descending order
        //     if (isLeaf1 && isLeaf2) {
        //         const id1 = node1.getId();
        //         const id2 = node2.getId();
        //         return id2 - id1;
        //     }

        //     // If only one of the nodes is a leaf, the leaf should come first
        //     if (isLeaf1) {
        //         return -1;
        //     } else if (isLeaf2) {
        //         return 1;
        //     }

        //     // If none of the nodes are leaf nodes, sort them by other criteria if needed
        //     // For example, you can sort them by text property
        //     const id1 = node1.getId();
        //     const id2 = node2.getId();
        //     return id2 - id1;
        // });
        // cmp.up('dialog').destroy();
    },

    removeServiceFromCostCenter: function (cmp) {
        let service = cmp.lookupViewModel().get('selectedService'),
            costCenter = cmp.lookupViewModel().get('record'),
            costCenterStore = cmp.lookupViewModel().get('costCenterStore'),
            costCenterFromStore = costCenterStore.getById(costCenter.get('id')),
            costCenterItem = costCenterFromStore
                .get('items')
                .find((item) => item.default_expense_item_id == service.get('id'));

        Ext.Msg.confirm(
            'Delete',
            'Are you sure you would like to delete this entry?',
            function (answer) {
                if (answer === 'yes') {
                    let model;

                    model = Ext.create('Abraxa.model.costcenter.CostCenterService', {
                        id: costCenterItem.id,
                    });

                    console.log(model);

                    model.getProxy().setExtraParams({
                        costCenterId: costCenter.get('id'),
                    });
                    model.erase({
                        callback: function () {
                            costCenterStore.reload({
                                callback: function () {
                                    service.load();
                                    Ext.toast('Record deleted');
                                },
                            });
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

    updateCostCenterService: function (cmp) {
        let service = cmp.lookupViewModel().get('selectedService');
        if (service) {
            let costCenter = cmp.lookupViewModel().get('record'),
                costCenterStore = cmp.lookupViewModel().get('costCenterStore'),
                costCenterFromStore = costCenterStore.getById(costCenter.get('id'));
            let costCenterItem = costCenterFromStore
                    .get('items')
                    .find((item) => item.default_expense_item_id === service.get('id')),
                model;
            model = Ext.create('Abraxa.model.costcenter.CostCenterService', {
                id: costCenterItem.id,
            });
            model.set(cmp.cost_center_value, cmp.getValue());
            model.getProxy().setExtraParams({
                costCenterId: costCenter.get('id'),
            });
            model.save({
                success: function () {
                    costCenterStore.reload({
                        callback: function () {
                            service.load();
                            Ext.toast('Record updated');
                        },
                    });
                },
            });
        }
    },
});
