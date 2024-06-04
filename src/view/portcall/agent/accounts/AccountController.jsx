Ext.define('Abraxa.view.portcall.agents.accounts.AccountController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.AccountController',

    updatePaymentAccount: function (me, selection) {
        let record = me.upVM().get('selectedAccount');
        if (record && selection) {
            record.set('bank_id', selection.get('id'));
            record.set('bank_name', selection.get('bank_name'));
            record.save({
                success: function () {
                    Ext.toast('Record updated', 1000);
                },
            });
        }
    },
});
