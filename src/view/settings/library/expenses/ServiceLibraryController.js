Ext.define('Abraxa.view.settings.library.expenses.ServiceLibraryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.ServiceLibraryController',

    assignCostCenterSingle: function (cmp) {
        let record = cmp.lookupViewModel().get('LibraryServicesGrid.selection');
        if (record) this.showAssignCostCenterPopup([record]);
    },

    assignCostCenterMultiple: function (cmp) {
        let selectedServices = cmp.lookupViewModel().get('serviceGridSelection');

        if (selectedServices.length) {
            this.showAssignCostCenterPopup(selectedServices);
        }
    },

    showAssignCostCenterPopup: function (records) {
        Ext.create('Abraxa.view.settings.library.expenses.AssignCostCenterPopup', {
            viewModel: {
                data: {
                    services: records,
                    costCenterStore: Ext.getStore('costCenterStore'),
                    servicesStore: Ext.getStore('defaultExpenseItemsStore'),
                },
            },
        }).show();
    },

    saveCostCenterAssignment: function (cmp) {
        let selectedCostCenters = cmp.lookupViewModel().get('selectedCostCenters'),
            services = cmp.lookupViewModel().get('services'),
            costCenterStore = cmp.lookupViewModel().get('costCenterStore'),
            servicesStore = cmp.lookupViewModel().get('servicesStore'),
            defaultExpenseItemIds = [],
            costCenterServices;

        Ext.each(services, function (service) {
            defaultExpenseItemIds.push(service.get('id'));
        });

        selectedCostCenters.each(function (record) {
            costCenterServices = new Abraxa.model.costcenter.CostCenterService();
            costCenterServices.set('default_expense_items_ids', defaultExpenseItemIds);
            costCenterServices.getProxy().setExtraParams({
                costCenterId: record.get('id'),
            });
            costCenterServices.save({
                success: function () {
                    costCenterStore.load({
                        callback: function () {
                            if (services.length == 1) {
                                services[0].load();
                            } else {
                                servicesStore.reload();
                            }

                            Ext.toast('Record created');
                            cmp.up('dialog').destroy();
                        },
                    });
                },
            });
        });
    },

    updateCostCenterFields(field) {
        let record = field.upVM().get('LibraryServicesGrid.selection');
        if (record) {
            let fieldModelName = field.fieldModelName;
            let alias = record.getAliases();
            if (alias) {
                alias.set(fieldModelName, field.getValue());
                if (alias.dirty) {
                    alias.save({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                            record.load();
                        },
                    });
                }
            } else {
                const alias = new Abraxa.model.expense.DefaultExpenseItemAlias({
                    default_expense_item_id: record.get('id'),
                });
                alias.set(fieldModelName, field.getValue());
                alias.save({
                    success: function () {
                        Ext.toast('Record updated', 1000);
                        record.load();
                    },
                });
            }
        }
    },
});
