import './CompanyController.jsx';
import '../../../core/plugins/Abraxa.LazyItems.jsx';
import './CompanyViewModel.jsx';
import '../../portcall/InternalToolsPanel.jsx';
import '../../internal/TasksPanel.jsx';
import '../../main/MainHeader.jsx';
import './Summary.jsx';
import './Balance.jsx';
import './Portcalls.jsx';
import '../../../core/components/InfoIcon.jsx';
import './financials/overview/OpenBalances.jsx';
import './contacts/Main.jsx';
import './financials/Main.jsx';
import './financials/virtualAccounts/VirtualAccountsGrid.jsx';
import './financials/virtualAccounts/VirtualAccountRightCard.jsx';
import './agreements/Main.jsx';
import './Compliance.jsx';
import './Documents.jsx';
Ext.define('Abraxa.view.cdb.company.Company', {
    extend: 'Ext.Container',
    alias: 'widget.company',
    xtype: 'company',
    flex: 1,
    bodyCls: 'a-layout-card-wrap',
    viewModel: 'company-viewmodel',
    controller: 'cdb.company.controller',
    scrollable: true,
    layout: {
        type: 'card',
        deferRender: false,
    },
    bind: {
        activeItemIndex: '{companyMainTabbar.activeTabIndex}',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'button',
                    ui: 'large raised',
                    cls: 'position_fixed a-btn-internal-tools',
                    hidden: true,
                    slug: 'portcall',
                    docked: 'right',
                    skipEditPermission: true,
                    bind: {
                        badgeText: '{notes.count}',
                        hidden: '{hideTaskNotesTools}',
                        permission: '{userPermissions}',
                    },
                    iconCls: 'md-icon-mode-comment md-icon-outlined',
                    testId: 'abxViewportInternalNotesBtn',
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Internal notes',
                        align: 'r50-l50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                    },
                    handler: function () {
                        Ext.ComponentQuery.query('internal\\.tools\\.panel')[0].show();
                    },
                },
                {
                    xtype: 'button',
                    ui: 'large raised',
                    margin: '56 0 0 0',
                    cls: 'position_fixed a-btn-internal-tools',
                    hidden: true,
                    docked: 'right',
                    slug: 'task',
                    skipEditPermission: true,
                    testId: 'abxViewportTasksBtn',
                    bind: {
                        badgeText: '{tasksCount}',
                        hidden: '{hideTaskNotesTools}',
                        permission: '{userPermissions}',
                    },
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Tasks',
                        align: 'r50-l50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                    },
                    iconCls: 'md-icon-outlined md-icon-task-alt',
                    handler: function () {
                        Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].show();
                    },
                },
                {
                    xtype: 'internal.tools.panel',
                },
                {
                    xtype: 'internal.tasks.panel',
                },
                {
                    xtype: 'tasks.right.container',
                },
                {
                    xtype: 'main.header',
                },
                {
                    xtype: 'cdb.company.summary',
                    hidden: false,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 0 ? false: true}',
                    },
                },
                {
                    xtype: 'cdb.company.contacts.main',
                    hidden: true,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 1 ? false: true}',
                    },
                },
                {
                    xtype: 'cdb.company.financials.main',
                    hidden: true,
                    flex: 1,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 2 ? false: true}',
                    },
                },
                {
                    xtype: 'cdb.company.agreements.main',
                    hidden: true,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 3 ? false: true}',
                    },
                },
                {
                    xtype: 'cdb.copany.compliance',
                    hidden: true,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 4 ? false: true}',
                    },
                },
                {
                    xtype: 'cdb.company.documents',
                    hidden: true,
                    flex: 1,
                    cls: 'a-bgr-white',
                    bind: {
                        hidden: '{companyMainTabbar.activeTabIndex == 5 ? false: true}',
                    },
                },
            ],
        },
    },
    listeners: {
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'agent') {
                // Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
