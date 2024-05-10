Ext.define('Abraxa.view.portlog.MainView', {
    extend: 'Ext.Container',
    xtype: 'portcall.main',
    alias: 'widget.agentportcall.main',
    controller: 'PortCallController',
    flex: 1,
    layout: 'fit',
    slug: 'portcall',
    reference: 'portcallMainViewAgent',
    publishes: ['record'],
    bind: {
        activeItemIndex: '{mainTabbar.activeTabIndex}',
        permission: '{userPermissions}',
    },
    defaults: {
        hideMode: 'clip',
    },
    viewModel: 'portcall-viewmodel',
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
                    xtype: 'button',
                    ui: 'large raised',
                    margin: '112 0 0 0',
                    docked: 'right',
                    cls: 'position_fixed a-btn-internal-tools',
                    hidden: true,
                    testId: 'abxViewportConnectBtn',
                    // bind: {
                    //     hidden: '{hideTaskNotesTools}',
                    // },
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Connect',
                        align: 'r50-l50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                    },
                    iconCls: 'md-icon-electrical-services md-icon-outlined',
                    handler: function () {
                        Ext.ComponentQuery.query('integrations\\.panel')[0].show();
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
                    xtype: 'integrations.panel',
                },
                {
                    xtype: 'main.header',
                },
                {
                    xtype: 'summary.main',
                    hidden: false,
                    bind: {
                        hidden: '{object_record.read_only || mainTabbar.activeTabIndex == 0 ? false: true}',
                    },
                },
                {
                    xtype: 'appointment.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{object_record.read_only || mainTabbar.activeTabIndex == 1 ? false: true}',
                    },
                },
                {
                    xtype: 'sof.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 2 ? false: true}',
                    },
                },
                {
                    xtype: 'documents.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 3 ? false: true}',
                    },
                },
                {
                    xtype: 'husbandry.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 4 ? false: true}',
                    },
                },
                {
                    xtype: 'accounts.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 5 ? false: true}',
                    },
                },
                {
                    xtype: 'payments.main',
                    hideMode: 'display',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 6 ? false: true}',
                    },
                },
                {
                    xtype: 'portcall.sof.kpis',
                    hidden: true,
                    bind: {
                        hidden: '{!object_record.read_only && mainTabbar.activeTabIndex == 7 ? false: true}',
                    },
                },
                {
                    xtype: 'container',
                    flex: 1,
                    height: '100%',
                    docked: 'top',
                    cls: 'mask_container a-placeholder-mask a-bgr-white border-radius',
                    padding: 16,
                    margin: 8,
                    items: [
                        {
                            xtype: 'container',
                            margin: '0 0 32 0',
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-placeholder-badge',
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'div',
                                            width: 300,
                                            margin: '0 0 8 0',
                                            cls: 'a-placeholder-rect',
                                        },
                                        {
                                            xtype: 'div',
                                            html: '<div class="hbox"><div class="a-placeholder-tab mr-8"></div><div class="a-placeholder-tab mr-8"></div><div class="a-placeholder-tab mr-8"></div></div>',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-placeholder-circle',
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'div',
                                            width: 240,
                                            cls: 'a-placeholder-row',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    listeners: {
        painted: function (me) {
            Ext.Ajax.on('requestcomplete', function (conn, options, eOptions) {
                if (Ext.getCmp('main-viewport')) {
                    let vm = Ext.getCmp('main-viewport').getVM(),
                        routeHash = vm.get('routeHash');
                    if (routeHash == '#portcall') {
                        if (options.request.method !== 'GET') {
                            // let activeTab = Ext.ComponentQuery.query('[cls~=portcall_tabs]')[0].getActiveTab().type,
                            let object_record = vm.get('object_record');
                            if (object_record) {
                                if (
                                    options.request.url != '/server/api/system/recently_opened' &&
                                    options.request.url != '/server/api/company/upload_verification' &&
                                    !options.request.url.includes('verification') &&
                                    options.request.url != '/server/api/suggested-organizations'
                                ) {
                                    object_record.set('updated_at', Date.now());
                                    object_record.set('user', vm.get('currentUser').getData());
                                    object_record.dirty = false;

                                    // if (activeTab == "sof.main") {
                                    //     if (options.request.url !== '/server/api/sof_publish') {
                                    //         object_record.set('is_published', 0);
                                    //     }
                                    // }
                                } else if (
                                    options.request.method == 'POST' &&
                                    options.request.url == '/server/api/documents/generate'
                                ) {
                                    object_record.set('updated_at', Date.now());
                                    object_record.set('user', vm.get('currentUser').getData());
                                    object_record.dirty = false;
                                }
                            }
                        }
                    }
                }
            });
        },
        destroy: function (me) {
            Ext.getCmp('main-viewport').getVM().set('routeExtraParams', null);
        },
    },
    loadRecord: function (id, args) {
        let viewRecord = this.getRecord();
        if (viewRecord && viewRecord.get('id') == id) {
            return;
        }
        let portCall = Ext.create('Abraxa.model.portcall.Portcall', {
            id: id,
        });
        portCall.load({
            scope: this,
            success: function (record, operation) {
                this.setRecord(record);
            },
            failure: function (record, operation) {
                Ext.Msg.alert('Error', 'Could not load record');
            },
        });
    },
});
