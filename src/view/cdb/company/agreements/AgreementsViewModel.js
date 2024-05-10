Ext.define('Abraxa.view.cdb.company.AgreementsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.agreements-viewmodel',
    data: {
        selectedInstruction: null,
    },
    stores: {
        prefundings: {
            source: '{object_record.prefundings}',
            batchActions: true,
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            pageParam: false,
            startParam: false,
            limitParam: false,
            writer: {
                allowSingle: false,
            },

            grouper: {
                property: 'active',
                direction: 'DESC',
            },
            listeners: {
                datachanged: function (me) {
                    if (
                        !Ext.ComponentQuery.query('[itemId=agreementsMain]')[0]
                            .getVM()
                            .get('agreements_menu.selection') &&
                        Ext.ComponentQuery.query('[cls~=agreements_menu]')[0]
                    ) {
                        Ext.ComponentQuery.query('[cls~=agreements_menu]')[0].select(0);
                    }
                },
                remove: {
                    fn: function (store, record, index) {
                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                    },
                },
            },
        },
        discounts: {
            source: '{object_record.discounts}',
            batchActions: true,
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            pageParam: false,
            startParam: false,
            limitParam: false,
            writer: {
                allowSingle: false,
            },
            grouper: {
                property: 'active',
                direction: 'DESC',
            },
            listeners: {
                remove: {
                    fn: function (store, record, index) {
                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                    },
                },
            },
        },
        instructions: {
            source: '{object_record.instructions}',
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            pageParam: false,
            startParam: false,
            limitParam: false,
        },
        billings: {
            source: '{object_record.billings}',
            batchActions: true,
            extraParams: {
                org_id: '{object_record.org_id}',
            },
            pageParam: false,
            startParam: false,
            limitParam: false,
            writer: {
                allowSingle: false,
            },
            grouper: {
                property: 'active',
                direction: 'DESC',
            },
            listeners: {
                remove: {
                    fn: function (store, record, index) {
                        Ext.getCmp('main-viewport').getVM().get('agreements').reload();
                    },
                },
            },
        },
    },
    formulas: {
        selectFirst: {
            bind: {
                bindTo: '{object_record.org_id}',
                deep: true,
            },
            get: function (org_id) {
                if (Ext.isNumber(org_id)) {
                }
            },
        },
        selectedInstruction: {
            bind: {
                bindTo: '{instructionGrid.selection}',
            },
            get: function (selection) {
                if (selection) {
                    let organization = this.get('object_record');
                    selection.getProxy().setExtraParams({
                        org_id: organization.get('org_id'),
                    });
                }
                return selection;
            },
        },
    },
});
