Ext.define('Abraxa.view.inquiry.InquiryViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.inquiry-viewmodel',
    stores: {
        inquiries: {
            type: 'inquiry',
            autoSort: true,
            autoDestroy: true,
            sorters: [
                {
                    property: 'created_at',
                    direction: 'DESC',
                },
            ],
        },
        inquiriesPdas: {
            type: 'inquiry.pdas',
            autoSort: true,
            sorters: [
                {
                    property: 'created_at',
                    direction: 'DESC',
                },
            ],
        },
    },
    formulas: {
        inquiryMainContainer: {
            bind: {
                bindTo: '{currentUserType}',
                deep: true,
            },
            get: function (type) {
                return [
                    {
                        xtype: 'main.header',
                    },
                    {
                        xtype: 'inquiry.agent.main.container',
                    },
                    {
                        xtype: 'inquiry.right.card',
                        itemId: 'inquiryRightContainer',
                    },
                ];
                // if (type) {
                //     if (type == 'agent') {
                //         return [{
                //             xtype: 'inquiry.agent.main.container'
                //         }];
                //     } else {
                //         return [{
                //             xtype: 'portcalls.principal.main'
                //         }];
                //     }
                // }
            },
        },
        totalInquiryRecords: {
            bind: {
                bindTo: '{inquiries}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
        totalInquiryPdaRecords: {
            bind: {
                bindTo: '{inquiriesPdas}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
        defaultHiddenItems: {
            bind: {
                bindTo: '{inquiries}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    if (store.getCount()) {
                        return false;
                    } else {
                        if (store.getFilters() && store.getFilters().length) {
                            return false;
                        }
                        return true;
                    }
                }

                return true;
            },
        },
    },
});
