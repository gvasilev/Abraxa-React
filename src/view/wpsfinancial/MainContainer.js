Ext.define('Abraxa.view.wpsfinancial.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'wps.financial.main',
    cls: 'a-main-container',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            disbursementsStore: {
                type: 'disbursements',
            },
        },
        formulas: {
            selectedDisbursement: {
                bind: {
                    bindTo: '{wpsFinancialGrid.selection}',
                },
                get: function (selection) {
                    return selection;
                },
            },
            subObjects: {
                bind: {
                    bindTo: '{disbursementsStore}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    store.each(function (record, index) {
                        var disbursement = record.getData();
                        disbursement.name = disbursement.name;
                        disbursement.icon = 'md-icon-attach-money';
                        disbursement.type = 'disbursement';
                        disbursement.subOject = 'portcallDisbursements';
                        disbursement.model = disbursement.model_name;
                        disbursement.subobject_id = disbursement.id;

                        data.push(disbursement);
                    });
                    Ext.getCmp('main-viewport').getVM().set('subObjects', data);
                    return data;
                },
            },
            relatedObjects: {
                bind: {
                    bindTo: '{disbursementsStore}',
                    deep: true,
                },
                get: function (store) {
                    let data = [];
                    if (store) {
                        store.each(function (rec) {
                            data.push(rec);
                        });
                    }
                    return data;
                },
            },
        },
    },
    items: [
        {
            xtype: 'wps.financial.grid',
        },
        {
            xtype: 'wps.financial.right.card',
        },
    ],
});
