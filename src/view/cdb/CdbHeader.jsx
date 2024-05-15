import '../../core/override/Abraxa.tab.Bar';
import './company/CompanyEditMenu';
Ext.define('Abraxa.view.cdb.CdbHeader', {
    extend: 'Ext.Container',
    xtype: 'cdb.header',
    layout: 'vbox',
    controller: 'cdb.maincontroller',
    flex: 1,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    cls: 'a-main-titlebar',
                    items: [
                        {
                            xtype: 'div',
                            itemId: 'mainTitle',
                            cls: 'a-main-title has-dropdown',
                            bind: {
                                html: '<h1>{viewTitle}</h1>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                            viewModel: {
                                                parent: Ext.getCmp('main-viewport').getViewModel(),
                                            },
                                        });
                                        menu.showBy(this);
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'tabbar',
                    cls: 'a-main-tabs',
                    slug: 'cdb',
                    hidden: true,
                    bind: {
                        permission: '{userPermissions}',
                        activeTabIndex: '{cdbActiveTab}',
                    },
                    activeTab: 0,
                    reference: 'cdbMainTabbar',
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
                            id: 'companies',
                            title: 'Companies',
                            slug: 'company',
                            tab: 'companies',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                        {
                            id: 'contacts',
                            title: 'Contacts',
                            slug: 'contact',
                            tab: 'contacts',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                    listeners: {
                        beforeactiveTabchange: 'onTabChange',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-main-right',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'verified.div',
                        },
                    ],
                },
            ],
            //     },
            //     //     {
            //     //     xtype: 'dataview',
            //     //     cls: 'dataview-horizontal participants',
            //     //     inline: {
            //     //         wrap: false
            //     //     },
            //     //     padding: '0 8',
            //     //     scrollable: false,
            //     //     itemTpl: new Ext.XTemplate(
            //     //         '<div class="cursor-pointer"><div class="a-person"><div class="part_abbr text-center" style="display: grid; align-items: center; font-size: 14px; color: #fff; height: 34px; width: 34px; border-radius: 50%; background-color: {color}"><span>{company.abbr}</span></div></a></div></div>', {
            //     //             createAbbr: function (invitation) {
            //     //                 if (invitation) {
            //     //                     var company_name = invitation.org_name;
            //     //                     var abbrArray = company_name.split(" ");

            //     //                     var abbr = abbrArray[0][0];
            //     //                     if (abbrArray[1])
            //     //                         abbr += abbrArray[1][0];
            //     //                     return abbr;
            //     //                 }
            //     //             }
            //     //         }
            //     //     ),
            //     //     bind: {
            //     //         store: '{participants}',
            //     //     },
            //     //     listeners: {
            //     //         click: {
            //     //             element: "element",
            //     //             delegate: ".a-person",
            //     //             fn: function fn(item, el, eOpts) {
            //     //                 var me = this;
            //     //                 var component = me.component;

            //     //                 if (item.currentTarget.getAttribute("data-person")) {
            //     //                     var user_id = item.currentTarget.getAttribute("data-person");
            //     //                     var tooltip_el = Ext.create("Abraxa.view.common.PersonToolTip", {
            //     //                         align: "tl-bl",
            //     //                         allowOver: true,
            //     //                         anchor: true,
            //     //                         margin: '12px 0px 0px -18px',
            //     //                         viewModel: {
            //     //                             data: {
            //     //                                 user_id: user_id,
            //     //                                 clickedElement: item.currentTarget
            //     //                             }
            //     //                         }
            //     //                     }).showBy(item.currentTarget); // PersonHoverShowNames.hide();
            //     //                 }
            //     //             }
            //     //         }
            //     //     }
            //     // }, {
            //     //     xtype: 'button',
            //     //     iconCls: 'md-icon-group-add',
            //     //     ui: 'round normal btn-normal',
            //     //     margin: '0 16 0 0',
            //     //     text: 'Sharing',
            //     //     bind: {
            //     //         hidden: '{object_record.parent_id ? true : false}'
            //     //     },
            //     //     handler: function () {
            //     //         let record = this.upVM().get('object_record');
            //     //         Ext.create('Abraxa.view.invitations.InviteDialog', {
            //     //             viewModel: {
            //     //                 data: {
            //     //                     object_id: 3,
            //     //                     object_meta_id: record.get('id'),
            //     //                     object_record: record,
            //     //                     organizations: this.upVM().get('organizations'),
            //     //                     invitations: this.upVM().get('invitations'),
            //     //                     participants: this.upVM().get('participants')
            //     //                 },
            //     //             }
            //     //         }).show();
            //     //     }
            //     //     }
            // ]
        },
    },
});
