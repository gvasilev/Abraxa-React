Ext.define('Abraxa.view.portcall.PortcallController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PortCallController',
    id: 'portcallController',

    control: {
        'field[cls~=current_port_combo]': {
            painted: 'onWaspId',
        },
    },

    onWaspId: function (field) {
        let wasp_id = this.getViewModel().get('portCallRecord.integration_data.wasp_id'),
            customComponents = this.getViewModel().get('currentCompany.custom_components');

        if (wasp_id || customComponents.query('customComponentId', 'waspIdPortCall', false, false, true).length > 0) {
            field.setDisabled(true);
        }
    },
    deleteVouchers: function (vouchers) {
        const me = this,
            view = me.getView(),
            vm = view.getVM(),
            vouchersStore = vm.get('vouchers'),
            payments = vm.get('payments'),
            expenses = vm.get('expenses');
        if (!vouchers || !vouchers.length) return;
        vouchers.forEach(function (voucher) {
            if (!voucher || !voucher.get('expense_id')) return;
            const expense = expenses.getById(voucher.get('expense_id'));
            // Subtract the deleted voucher amount from the expense
            if (expense.get('fda_id')) {
                me.updateExpensePrice(expense, 'fda_price', voucher);
            } else if (expense.get('dda_id')) {
                me.updateExpensePrice(expense, 'dda_price', voucher);
            } else if (expense.get('pda_id')) {
                me.updateExpensePrice(expense, 'pda_price', voucher);
            }
        });

        vouchersStore.remove(vouchers);
        // TODO: CORE-2969 Rework deletion of vouchers to send a single bulk request
        vouchersStore.sync({
            success: function (err, msg) {
                if (expenses.getSource().needsSync) {
                    expenses.sync();
                } else {
                    expenses.reload();
                }
                payments.reload();
                Ext.toast(AbraxaConstants.messages.updateRecord, 1000);
            },
        });
    },

    updateExpensePrice: function (expense, priceKey, voucher) {
        const expensePrice = this.convertToNumber(expense.get(priceKey));
        const voucherPrice = this.convertToNumber(voucher.get('calculated_price'));
        let newPrice = expensePrice - voucherPrice;
        if (newPrice < 0) {
            newPrice = 0;
        }
        expense.set(priceKey, newPrice);
        expense.vouchers().remove(voucher);
        expense.vouchers().commitChanges();
    },

    convertToNumber: function (value) {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    },
});
