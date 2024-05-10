Ext.define('Abraxa.view.pda.PDALeftMenu', {
    extend: 'Ext.Container',
    xtype: 'pda.left.menu',
    cls: 'a-left-container pda_left_menu',
    stateful: ['width', 'userCls'],
    stateId: 'pdaLeftMenu',
    reference: 'pdaLeftMenu',
    publishes: ['userCls'],
    userCls: 'not-expanded',
    docked: 'left',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-menu-heading a-bb-100',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading',
                    html: '<h5>Inquiry data</h5>',
                },
                {
                    xtype: 'button',
                    testId: 'expandButtonPdaLeftMenu',
                    ui: 'round',
                    iconCls: 'md-icon-outlined md-icon-first-page',
                    focusable: false,
                    bind: {
                        tooltip: {
                            html: '<span class="tooltip_expand">{pdaLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
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
                        let panel = Ext.ComponentQuery.query('[cls~=pda_left_menu]')[0],
                            cls = panel.getUserCls() == 'is-expanded';

                        if (cls != '') {
                            panel.setUserCls('');
                            panel.setWidth(64);
                        } else {
                            panel.setUserCls('is-expanded');
                            panel.setWidth(464);
                        }
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-br-100',
                    docked: 'left',
                    width: 64,
                    items: [
                        {
                            xtype: 'list',
                            cls: 'pda_menu',
                            reference: 'pdaMenu',
                            deselectable: false,
                            variableHeights: true,
                            store: [],
                            bind: {
                                store: '{pdaSections}',
                            },
                            itemConfig: {
                                xtype: 'container',
                                cls: 'a-item',
                                viewModel: true,
                                items: [
                                    {
                                        cls: 'a-tab',
                                        bind: {
                                            html: '{record.html}',
                                            slug: '{record.slug}',
                                            tooltip: {
                                                html: '{pdaLeftMenu.userCls ? "" : record.title}',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                                // anchorToTarget: false,
                                                align: 'bc-tc?',
                                                anchor: true,
                                            },
                                            // objectPermission: '{objectPermissions}'
                                        },
                                    },
                                ],
                            },
                            listeners: {},
                        },
                    ],
                },
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-titlebar a-bb-100',
                    weight: 2,
                    height: 64,
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "vessel" || pdaMenu.selection.tab == "inquiry" ? true:false}',
                    },
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{pdaMenu.selection.title}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'pda.estimate.details',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "inquiry" && !isCalculation ? false:true}',
                    },
                },
                {
                    xtype: 'pda.calculation.fields',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "inquiry" && isCalculation ? false:true}',
                    },
                },
                {
                    xtype: 'pda.vessel.details',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "vessel" ? false:true}',
                    },
                },
                {
                    xtype: 'pda.terms',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "terms" ? false:true}',
                    },
                },
                {
                    xtype: 'pda.notes',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "notes" ? false:true}',
                    },
                },
                {
                    xtype: 'pda.attachments',
                    bind: {
                        hidden: '{pdaMenu.selection.tab == "attachments" ? false:true}',
                    },
                },
            ],
        },
    ],
    listeners: {
        painted: function (me) {
            if (
                Ext.ComponentQuery.query('[cls=pda_menu]')[0] &&
                Ext.ComponentQuery.query('[cls=pda_menu]')[0].getStore() &&
                Ext.ComponentQuery.query('[cls=pda_menu]')[0].getStore().count()
            ) {
                Ext.ComponentQuery.query('[cls=pda_menu]')[0].select(0);
            }
        },
    },
});
