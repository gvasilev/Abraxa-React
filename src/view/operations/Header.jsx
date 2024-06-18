import '../portcalls/agent/PortcallsAgentController';

Ext.define('Abraxa.view.operations.Header', {
    extend: 'Ext.Container',
    xtype: 'OperationsHeader',
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-main-titlebar',
            items: [
                {
                    xtype: 'div',
                    itemId: 'mainTitle',
                    cls: 'a-main-title',
                    bind: {
                        html: '<h1>Operations</h1>',
                    },
                },
            ],
        },
        {
            xtype: 'tabbar',
            cls: 'a-main-tabs portcall_tabs',
            controller: 'portcalls-agent-controller',
            activeTab: 0,
            publishes: {
                activeTab: true,
                activeTabIndex: true,
            },
            layout: {
                type: 'hbox',
                pack: 'start',
            },
            defaults: {
                ui: 'tab-main',
                ripple: false,
            },

            items: [
                {
                    id: 'PortcallsPrincipalMain',
                    title: 'Port calls',
                    url: 'port-calls',
                    index: 0,
                },
                {
                    id: 'DisbursementsPrincipalMain',
                    title: 'Disbursements',
                    url: 'disbursements',
                    index: 1,
                },
                {
                    id: 'VoyagePrincipalMain',
                    title: 'Voyage planner',
                    url: 'voyage-planner',
                    index: 2,
                },
            ],

            listeners: {
                painted: function(tabbar) {
                    const url = Ext.util.History.getHash().replace(/operations\//g, '');
                    const tab = tabbar.items.items.find((tab) => url.includes(tab.url));

                    if (tab && tab.index) {
                        tabbar.setActiveTab(tab.index);
                    }
                },

                activeTabchange: function(tabbar, newTab, oldTab) {
                    Ext.util.History.suspendEvents();
                    Ext.util.History.add('operations/' + newTab.url);

                    Ext.getCmp('operationsMainContainer').getViewModel().set('activeTabXtype', newTab.id);

                    Ext.ComponentQuery.query('public\\.person\\.tooltip').forEach((tooltip) => tooltip.hide());
                    Ext.ComponentQuery.query('dialog').forEach((dialog) => dialog.hide());
                    Ext.ComponentQuery.query('tooltip').forEach((tooltip) => tooltip.hide());

                    setTimeout(() => {
                        Ext.util.History.resumeEvents();
                    }, 0);
                },
            },
        },
    ],
});
