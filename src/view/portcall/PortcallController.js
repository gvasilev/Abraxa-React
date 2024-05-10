Ext.define('Abraxa.view.portcall.PortcallController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PortCallController',
    id: 'portcallController',
    bindings: {
        onWaspId: {
            waspId: '{portCallRecord.integration_data.wasp_id}',
            customComponents: '{currentCompany.custom_components}',
        },
    },
    onWaspId: function (data) {
        if (
            data.waspId ||
            data.customComponents.query('customComponentId', 'waspIdPortCall', false, false, true).length > 0
        ) {
            Ext.ComponentQuery.query('[cls~=current_port_combo]').forEach(function (field) {
                field.setDisabled(true);
            });
        }
    },
    deleteVouchers: function (vouchers) {
        let view = this.getView(),
            vm = view.getVM(),
            store = vm.get('vouchers'),
            payments = vm.get('payments'),
            expenses = vm.get('expenses');
        if (vouchers) {
            vouchers.forEach(function (voucher) {
                if (voucher) {
                    let expense = expenses.getById(voucher.get('expense_id'));
                    if (expense) {
                        if (expense.get('fda_id')) {
                            expense.set('fda_price', expense.get('fda_price') - voucher.get('calculated_price'));
                        } else if (expense.get('dda_id')) {
                            expense.set('dda_price', expense.get('dda_price') - voucher.get('calculated_price'));
                        } else if (expense.get('pda_id')) {
                            expense.set('pda_price', expense.get('pda_price') - voucher.get('calculated_price'));
                        }
                    }
                }
            });
            store.remove(vouchers);
            store.sync({
                success: function (err, msg) {
                    if (expenses.needsSync) {
                        expenses.sync();
                    } else {
                        expenses.reload();
                    }
                    payments.reload();
                    Ext.toast('Record updated', 1000);
                },
                failure: function (batch) {
                    var response = batch.operations[0].error.response.responseJson;
                    Ext.Msg.alert('Something went wrong', response.message);
                },
            });
        }
    },
});
