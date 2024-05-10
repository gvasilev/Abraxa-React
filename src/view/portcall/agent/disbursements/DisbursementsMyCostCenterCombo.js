Ext.define('PortCall.view.portcall.agent.disbursements.DisbursementsMyCostCenterCombo', {
    extend: 'Ext.field.Select',
    xtype: 'myCostcentersCombo',
    ui: 'classic',
    displayField: 'name',
    matchFieldWidth: true,
    valueField: 'id',
    placeholder: 'Choose center',
    viewModel: true,
    forceSelection: true,
    listeners: {
        painted: function (field) {
            const defaultExpenseItem = field.up('editor').ownerCmp.getRecord().get('default_expense_item');
            const costCenters = defaultExpenseItem ? defaultExpenseItem.cost_centers : [];
            field.setStore(costCenters);
        },
        focus: function (field) {
            const defaultExpenseItem = field.up('editor').ownerCmp.getRecord().get('default_expense_item');
            const costCenters = defaultExpenseItem ? defaultExpenseItem.cost_centers : [];
            field.setStore(costCenters);
            field.expand();
        },
    },
    floatedPicker: {
        cls: 'a-selectfield-cost-center-picker',
        listeners: {
            select: function (picker, selection) {
                let selectedExpense = this.up().up().ownerCmp.getRecord();
                if (!selectedExpense) return;
                selectedExpense.set({ cost_center_id: selection.get('id') });
                if (selectedExpense && selectedExpense.dirty) {
                    selectedExpense.getProxy().setExtraParams({
                        portcall_id: selectedExpense.get('portcall_id'),
                    });
                    selectedExpense.save({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                        },
                    });
                }
            },
        },
    },
});
