import './DirectoryController';
import './DirectoryViewModel';
import '../main/MainHeader';
import './agents/DirectoryAgentsGrid';
import './ports/DirectoryPortsGrid';

Ext.define('Abraxa.view.directory.DirectoryMainContainer', {
    extend: 'Ext.Container',
    xtype: 'DirectoryMainContainer',
    reference: 'DirectoryMainContainer',
    controller: 'DirectoryController',
    viewModel: 'DirectoryViewModel',
    bodyCls: 'a-layout-card-wrap a-directory-main-container',
    // bind: {
    //     permission: '{userPermissions}'
    // },
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'main.header',
                },
                {
                    xtype: 'DirectoryAgentsGrid',
                    bind: {
                        hidden: '{directroryMainTabbar.activeTabIndex == 0 ? false : true}',
                    },
                    showAnimation: 'fade',
                },
                {
                    xtype: 'DirectoryPortsGrid',
                    bind: {
                        hidden: '{directroryMainTabbar.activeTabIndex == 1 ? false : true}',
                    },
                    showAnimation: 'fade',
                },
            ],
        },
    },
    listeners: {
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'principal') {
                Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
