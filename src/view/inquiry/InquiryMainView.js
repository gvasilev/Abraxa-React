Ext.define('Abraxa.view.inquiry.InquiryMainView', {
    extend: 'Ext.Container',
    xtype: 'inquiries.main',
    layout: 'fit',
    bodyCls: 'a-layout-card-wrap',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: 'inquiry-viewmodel',
    bind: {
        items: '{inquiryMainContainer}',
    },

    // items: [{
    //     cls: 'errorHandler',
    //     flex: 1,
    //     layout: 'fit',
    //     items: [{
    //         xtype: 'container',
    //         cls: 'a-container-coming-soon',
    //         items: [{
    //             xtype: 'inquiry.agent.main.container',
    //             flex: 1
    //         }]
    //     }]
    // }]
});
