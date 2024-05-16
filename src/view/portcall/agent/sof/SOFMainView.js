Ext.define('Abraxa.view.portcall.sof.SOFMainView', {
    extend: 'Ext.Container',
    xtype: 'sof.main',
    viewModel: 'sof-viewmodel',
    testId: 'sofMainView',
    scrollable: true,
    weighted: true,
    bodyCls: 'a-ops-general-info a-layout-card-wrap',
    layout: 'fit',
    flex: 1,
    items: [
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-bb-100',
                    weight: 2,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            height: 64,
                            items: [
                                {
                                    xtype: 'div',
                                    margin: '0 16 0 0',
                                    hidden: true,
                                    bind: {
                                        html: "<div class='a-badge a-badge-{opsMenu.selection.slug}'><i class='md-icon-outlined'>{opsSectionIcon}</i></div>",
                                    },
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-container-title',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>{opsMenu.selection.title}</span>',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-subtitle',
                                            bind: {
                                                html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{opsMenuMembers.length} members</a>',
                                                // hidden: '{nonEditable}'
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    fn: function () {
                                                        let vm = this.component.upVM(),
                                                            menu = Ext.create(
                                                                'Abraxa.view.portcall.MembersPreviewMenu',
                                                                {
                                                                    viewModel: {
                                                                        parent: vm,
                                                                    },
                                                                }
                                                            );
                                                        menu.showBy(this);
                                                    },
                                                },
                                            },
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
                            padding: '0 16 0 0',
                            hidden: true,
                            bind: {
                                hidden: '{opsMenu.selection.slug == "sof" && currentUser.current_company_id == 106 ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'a-main-updated',
                                    hidden: true,
                                    margin: '0 16',
                                    bind: {
                                        hidden: '{object_record.updated_by ? false : true}',
                                        data: {
                                            user: '{object_record.user}',
                                            updated_at: '{object_record.updated_at}',
                                            updated_text: 'Last submitted by ',
                                            hide_tooltip: true,
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    text: 'Submit',
                                    iconCls: 'a-icon-total',
                                    ui: 'custom-total',
                                    handler: function () {
                                        let title = 'For training purposes only',
                                            content =
                                                'Please note SOF data has not been submitted. This process is indicative until integration is concluded.';
                                        Abraxa.popup.showSuccessDialog(title, content);
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    docked: 'left',
                    cls: 'a-left-menu ops_left_menu',
                    stateful: ['width', 'userCls'],
                    stateId: 'opsLeftMenu',
                    reference: 'opsLeftMenu',
                    publishes: ['userCls'],
                    userCls: 'is-expanded',
                    scrollable: true,
                    weight: 1,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-menu-heading',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'sm-heading',
                                    html: '<h5>Sections</h5>',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'round',
                                    iconCls: 'md-icon-outlined md-icon-first-page',
                                    focusable: false,
                                    bind: {
                                        tooltip: {
                                            html: '<span class="tooltip_expand">{opsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                            anchor: true,
                                            align: 'bc-tc?',
                                        },
                                    },
                                    handler: function () {
                                        let panel = Ext.ComponentQuery.query('[cls~=ops_left_menu]')[0],
                                            cls = panel.getUserCls() == 'is-expanded';

                                        if (cls != '') {
                                            panel.setUserCls('');
                                        } else {
                                            panel.setUserCls('is-expanded');
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            margin: '0 0 0 0',
                            cls: 'ops_menu',
                            reference: 'opsMenu',
                            deselectable: false,
                            variableHeights: true,
                            store: [],
                            bind: {
                                store: '{opsSections}',
                            },
                            itemConfig: {
                                xtype: 'container',
                                cls: 'a-item',
                                viewModel: {
                                    formulas: {
                                        showBerthsMenu: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record.get('tab') == 'berths') {
                                                    //added for multiple calls on this formula in pricipal side
                                                    //posible anomaly !!
                                                    let menuExist = Ext.getCmp('berthListMenu');
                                                    if (menuExist) {
                                                        menuExist.destroy();
                                                    }
                                                    return {
                                                        xtype: 'ops.berth.menu',
                                                        bind: {
                                                            hidden: '{berths.count ? false: true}',
                                                            store: '{berths}',
                                                            objectPermission: '{objectPermissions}',
                                                        },
                                                    };
                                                }
                                            },
                                        },
                                    },
                                },
                                bind: {
                                    permission: '{userPermissions}',
                                    slug: '{record.slug}',
                                    subObject: '{record.subObject}',
                                },
                                items: [
                                    {
                                        bind: {
                                            html: '<div class="hbox">{record.html}</div>',
                                            cls: 'a-tab {record.cls}',
                                            tooltip: {
                                                html: '{opsLeftMenu.userCls ? "" : record.title}',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                                // anchorToTarget: false,
                                                align: 'bc-tc?',
                                                anchor: true,
                                            },
                                        },
                                    },
                                    {
                                        bind: {
                                            items: '{showBerthsMenu}',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function () {
                                    let grid = Ext.ComponentQuery.query('sof\\.cargolist')[0];

                                    this.upVM().set('selectedCargo.selection', null);
                                    grid.deselectAll();
                                },
                                select: function (list, record) {
                                    let VM = Ext.ComponentQuery.query(
                                            window.CurrentUser.get('company').type + 'portcall\\.main'
                                        )[0].upVM(),
                                        store = list.getStore();
                                    VM.set('selectedOpsSection', store.indexOf(record));
                                },
                                painted: function () {
                                    this.select(0);
                                },
                                // initialize: function () {
                                //     Ext.ComponentQuery.query(window.CurrentUser.get('company').type + 'portcall\\.main')[0].upVM().set('opsMenuPainted', true);
                                // }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    bind: {
                        hidden: '{opsMenu.selection.tab == "port_info" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'sof.port.info',
                            testId: 'sofMainViewOpsGeneral',
                            slug: 'portcallOpsGeneral',
                            showNoPermissions: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    hidden: true,
                    bind: {
                        hidden: '{opsMenu.selection.tab == "berths" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'sof.berths',
                            slug: 'portcallOpsBerths',
                            testId: 'sofMainViewOpsBerths',
                            showNoPermissions: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    hidden: true,
                    bind: {
                        hidden: '{opsMenu.selection.tab == "sof" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'sof.events',
                            slug: 'portcallOpsSof',
                            testId: 'sofMainViewOpsSof',
                            showNoPermissions: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    hidden: true,
                    bind: {
                        hidden: '{opsMenu.selection.tab == "cargo_progress" ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'sof.cargo.progress',
                            slug: 'portcallOpsCargoProgress',
                            testId: 'sofMainViewOpsCargoProgress',
                            showNoPermissions: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'cargo.right.card',
                    hideMode: 'offsets',
                    weight: 0,
                },
            ],
        },
    ],
});
