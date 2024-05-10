Ext.define('Abraxa.view.portcall.disbursements.DisbursementsMain', {
    extend: 'Ext.Container',
    xtype: 'disbursements.main',
    testId: 'disbursementsMain',
    controller: 'disbursements.uploadcontroller',
    reference: 'disbursementsMain',
    publishes: ['activeItemIndex'],
    layout: 'fit',
    flex: 1,
    bind: {
        activeItemIndex: '{selectedDisbursement && showDetails ? 1 : 0}',
    },
    items: [
        {
            xtype: 'disbursements.grid',
            hideAnimation: 'fadeOut',
            flex: 1,
            bind: {
                hidden: '{disbursementsMain.activeItemIndex == 0 ? false: true}',
            },
        },
        {
            xtype: 'disbursement.details',
            hidden: true,
            bind: {
                hidden: '{disbursementsMain.activeItemIndex == 1 ? false: true}',
            },
        },
    ],
});
