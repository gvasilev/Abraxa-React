Ext.define('Abraxa.store.View', {
    extend: 'Ext.data.Store',
    alias: 'store.view',

    data: [
        {
            id: 'portcalls',
            xtype: 'portcalls.main.container',
            text: 'Home',
            icon: 'home',
        },
        {
            id: 'operations',
            xtype: 'OperationsMainContainer',
            text: 'Home',
            icon: 'home',
        },
        {
            id: 'companydatabase',
            xtype: 'cdb.main',
            text: 'Employees',
            icon: 'users',
        },
        {
            id: 'directory',
            xtype: 'DirectoryMainContainer',
            text: 'Directory',
            icon: 'contacts',
        },
        {
            id: 'dashboard',
            xtype: 'dashboard.main',
            text: 'Organizations',
            icon: 'sitemap',
        },
        {
            id: 'taskmanager',
            xtype: 'tasks.main',
            text: 'Offices',
            icon: 'globe',
        },
        {
            id: 'inquiries',
            xtype: 'inquiries.main',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: 'inquiry',
            xtype: 'inquiry.main',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: 'pda',
            xtype: 'pda.layout',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: 'settings',
            xtype: 'settings.main',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: 'billing',
            xtype: 'billing.main',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: '404',
            xtype: 'notfound',
            text: 'Activity',
            icon: 'history',
        },
        {
            id: 'design',
            xtype: 'design',
        },
        {
            id: 'profile',
            xtype: 'profile.main.container',
        },
        {
            id: 'financial',
            xtype: 'financial.main',
            text: 'Financial board',
        },
        {
            id: 'wpsboard',
            xtype: 'wps.financial.main',
            text: 'Financial board',
        },
        {
            id: 'inbox',
            xtype: 'inbox.main.view',
            text: 'Inbox',
        },
        {
            id: 'voyage',
            xtype: 'VoyageMainView',
            text: 'Voyage',
        },
        {
            id: 'calculator',
            xtype: 'calculator.portcostengine.main',
            text: 'Port cost engine',
            fullscreen: false,
        },
        {
            id: 'portnews',
            xtype: 'PortNewsMain',
            text: 'News feed',
        },
        {
            id: 'comingsoon',
            xtype: 'ComingSoon',
            text: 'Coming soon',
        },
        {
            id: 'createVoyage',
            xtype: 'CreateVoyage',
            text: 'Create voyage',
        },
    ],
});
