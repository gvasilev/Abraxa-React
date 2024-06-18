import './PaymentsGrid';

Ext.define('Abraxa.view.portcall.payments.PaymentContent', {
    extend: 'Ext.Container',
    xtype: 'payment.content',
    scrollable: true,
    hidden: true,
    bind: {
        hidden: '{payments.count ? false:true}',
    },
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'payments.grid',
            flex: 1,
        },
    ],
});
