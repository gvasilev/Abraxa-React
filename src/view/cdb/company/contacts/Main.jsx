import './ContactsGrid';
import './ContactsViewModel';
import './DepartmentsGrid';
import './ContactsRightCard';
import './DepartmentsRightCard';

Ext.define('Abraxa.view.cdb.company.contacts.Main', {
    extend: 'Ext.Container',
    xtype: 'cdb.company.contacts.main',
    scrollable: true,
    itemId: 'contactsMain',
    testId: 'contactsMain',
    flex: 1,
    weighted: true,
    viewModel: 'contacts-viewmodel',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 65,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<span>{contacts_menu.selection.title}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'left',
            cls: 'a-left-menu contacts_left_menu',
            stateful: ['width', 'userCls'],
            stateId: 'contactsLeftMenu',
            reference: 'contactsLeftMenu',
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
                            html: '<h5>Contacts</h5>',
                        },
                        {
                            xtype: 'button',
                            testId: 'contactsMainExpandTogglBtn',
                            ui: 'round',
                            iconCls: 'md-icon-outlined md-icon-first-page',
                            focusable: false,
                            bind: {
                                tooltip: {
                                    html: '<span class="tooltip_expand">{contactsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                    anchor: true,
                                    align: 'bc-tc?',
                                },
                            },
                            handler: function() {
                                let panel = Ext.ComponentQuery.query('[cls~=contacts_left_menu]')[0],
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
                    testId: 'contactsMainListMenu',
                    reference: 'contacts_menu',
                    cls: 'contacts_menu',
                    deselectable: false,
                    variableHeights: true,
                    store: {
                        data: [
                            {
                                html: '<i class="md-icon-outlined">people</i><span>Contacts</span>',
                                tab: 'contacts',
                                title: 'Contacts',
                            },
                            {
                                html: '<i class="md-icon-outlined">corporate_fare</i><span>Departments</span>',
                                tab: 'departments',
                                title: 'Departments',
                            },
                        ],
                    },
                    itemConfig: {
                        xtype: 'container',
                        cls: 'a-item',
                        viewModel: true,
                        items: [
                            {
                                cls: 'a-tab',
                                testId: 'contactsMainRecordTitleTab',
                                bind: {
                                    tooltip: {
                                        html: '{contactsLeftMenu.userCls ? "" : record.title}',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                        // anchorToTarget: false,
                                        align: 'bc-tc?',
                                        anchor: true,
                                    },
                                    html: '<div class="hbox">{record.html}</div>',
                                },
                            },
                        ],
                    },
                    listeners: {
                        childsingletap: function() {
                            Ext.ComponentQuery.query('contacts\\.grid')[0].deselectAll();
                            Ext.ComponentQuery.query('departments\\.grid')[0].deselectAll();
                        },
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
            bind: {
                hidden: '{contacts_menu.selection.tab == "contacts" ? false : true}',
            },
            items: [
                {
                    xtype: 'contacts.grid',
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbContacts',
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
            hidden: true,
            bind: {
                hidden: '{contacts_menu.selection.tab == "departments" ? false : true}',
            },
            items: [
                {
                    xtype: 'departments.grid',
                    showNoPermissions: true,
                    skipEditPermission: true,
                    slug: 'cdbDepartments',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
        {
            xtype: 'contacts.right.card',
            testId: 'contactsMainContactsRightCard',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            docked: 'right',
        },
        {
            xtype: 'departments.right.card',
            testId: 'contactsMainDepartmentsRightCard',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            docked: 'right',
        },
    ],
});
