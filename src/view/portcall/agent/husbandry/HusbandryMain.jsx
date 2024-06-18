import './HusbandryViewModel';
import './supplies/SuppliesGrid';
import './crewing/CrewingGrid';
import './supplies/SuppliesRightCard';
import './crewing/CrewingRightCard';
import '../../agent/accounts/AccountsCombo';
import './crewing/CrewingActionsCombo';

Ext.define('Abraxa.view.portcall.husbandry.HusbandryMain', {
    extend: 'Ext.Container',
    xtype: 'husbandry.main',
    viewModel: 'husbandry-viewmodel',
    bodyCls: 'a-ops-general-info a-layout-card-wrap',
    layout: 'fit',
    flex: 1,
    weighted: true,
    listeners: {
        keydown: {
            element: 'element',
            fn: function (browserEvent, target) {
                if (browserEvent.event.keyCode == 221) {
                    let panel = Ext.ComponentQuery.query('[cls~=husbandry_left_menu]')[0],
                        cls = panel.getUserCls() == 'is-expanded';

                    if (cls != '') {
                        panel.setUserCls('');
                    } else {
                        panel.setUserCls('is-expanded');
                    }
                }
            },
        },
    },
    items: [
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-left-menu husbandry_left_menu',
                    stateful: ['width', 'userCls'],
                    stateId: 'husbandryLeftMenu',
                    reference: 'husbandryLeftMenu',
                    publishes: ['userCls'],
                    userCls: 'not-expanded',
                    scrollable: true,
                    docked: 'left',
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
                                            html: '<span class="tooltip_expand">{husbandryLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
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
                                        let panel = Ext.ComponentQuery.query('[cls~=husbandry_left_menu]')[0],
                                            cls = panel.getUserCls() == 'is-expanded';

                                        if (cls != '') {
                                            panel.setUserCls('not-expanded');
                                        } else {
                                            panel.setUserCls('is-expanded');
                                        }
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            // margin: '16 0 0 0',
                            cls: 'husbandry_menu',
                            reference: 'husbandryMenu',
                            deselectable: false,
                            variableHeights: true,
                            store: [],
                            bind: {
                                store: '{husbandrySections}',
                            },
                            itemConfig: {
                                xtype: 'container',
                                cls: 'a-item',
                                viewModel: true,
                                items: [
                                    {
                                        cls: 'a-tab',
                                        bind: {
                                            html: '<div class="hbox">{record.html}</div>',
                                            slug: '{record.slug}',
                                            tooltip: {
                                                html: '{husbandryLeftMenu.userCls ? "" : record.title}',
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
                            listeners: {
                                childsingletap: function () {
                                    Ext.ComponentQuery.query('husbandry\\.supplies\\.grid')[0].deselectAll();
                                    Ext.ComponentQuery.query('husbandry\\.crewing\\.grid')[0].deselectAll();
                                },
                                select: function (list, record) {
                                    let VM = Ext.ComponentQuery.query(
                                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                                        )[0].upVM(),
                                        store = list.getStore();
                                    VM.set('selectedInquirySection', store.indexOf(record));
                                },
                                painted: function () {
                                    this.select(0);
                                },
                                // initialize: function () {
                                //     Ext.ComponentQuery.query(Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main')[0].upVM().set('husbandryMenuPainted', true);
                                // }
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    weighted: true,
                    scrollable: true,
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
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
                                                html: "<div class='a-badge a-badge-{husbandryMenu.selection.slug}'><i class='md-icon-outlined'>{husbandrySectionIcon}</i></div>",
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-container-title',
                                            items: [
                                                {
                                                    xtype: 'title',
                                                    bind: {
                                                        title: '<span>{husbandryMenu.selection.title}</span>',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'a-subtitle',
                                                    bind: {
                                                        html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{husbandryMenuMembers.length} members</a>',
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
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'fit',
                            bind: {
                                hidden: '{husbandryMenu.selection.tab == "services" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'husbandry.supplies.grid',
                                    // flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'fit',
                            hidden: true,
                            bind: {
                                hidden: '{husbandryMenu.selection.tab == "crewing" ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'husbandry.crewing.grid',
                                    flex: 1,
                                },
                            ],
                        },
                        {
                            xtype: 'husbandry.supplies.right.card',
                            showAnimation: {
                                type: 'slide',
                                direction: 'left',
                            },
                            hideAnimation: null,
                            flex: 1,
                            height: '100%',
                            // zIndex: 1001,
                            docked: 'right',
                        },
                        {
                            xtype: 'husbandry.crewing.right.card',
                            showAnimation: {
                                type: 'slide',
                                direction: 'left',
                            },
                            hideAnimation: null,
                            flex: 1,
                            height: '100%',
                            weight: 0,
                            // height: 'calc(100vh - 72px)',
                            // zIndex: 1001,
                            docked: 'right',
                        },
                    ],
                },
            ],
        },
    ],
});
