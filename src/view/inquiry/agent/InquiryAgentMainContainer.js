Ext.define('Abraxa.view.inquiry.agent.InquiryAgentMainContainer', {
    extend: 'Ext.Container',
    xtype: 'inquiry.agent.main.container',
    slug: 'inquiry',
    controller: 'inquiry-controller',
    // bind: {
    //     permission: '{userPermissions}'
    // },
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'inquiry.agent.active.grid',
            bind: {
                hidden: '{inquiryMainTabbar.activeTabIndex == 0 ? false : true}',
            },
            showAnimation: 'fade',
        },
        {
            xtype: 'inquiry.estimate.grid',
            showAnimation: 'fade',
            bind: {
                hidden: '{inquiryMainTabbar.activeTabIndex == 1 ? false : true}',
            },
        },
    ],
});
