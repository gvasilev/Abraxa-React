import '../notification/NotificationList';
import '../main/DailyActions';

Ext.define('Abraxa.view.main.Notificationmenu', {
    extend: 'Ext.Sheet',
    xtype: 'main.notificationmenu',
    cls: 'a-notification-center a-bgr-white',
    bodyCls: 'a-bgr-white',
    width: 540,
    side: 'right',
    displayed: false,
    hideOnMaskTap: true,
    height: '100%',
    scrollable: 'y',
    header: false,
    collapsible: false,
    weighted: true,
    hideMode: 'offsets',
    showAnimation: {
        type: 'slide',
        direction: 'top',
    },
    hideAnimation: {
        type: 'slideOut',
        direction: 'right',
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        data: {
            createAnnouncement: false,
            editAnnouncement: false,
            announcementText: null,
            announcementRecord: null,
        },
        formulas: {
            newNotifications: {
                bind: {
                    bindTo: '{notifications}',
                    deep: true,
                },
                get: function(store) {
                    if (store) {
                        return (store = store.queryBy(function(record) {
                            return record.get('status') == 'new';
                        }).items.length);
                    }
                },
            },
            dailyActionsCount: {
                bind: {
                    bindTo: '{myTasks}',
                    deep: true,
                },
                get: function(store) {
                    if (store) {
                        let mentions = this.get('myMentions');
                        return store.count() + mentions.count();
                    }
                },
            },
        },
    },
    toggle: function() {
        if (this.isVisible()) {
            // Ext.query('[class=x-mask]')[0].classList.remove('no-opacity');
            this.hide();
        } else {
            this.show();
            // Ext.query('[class=x-mask]')[0].classList.add('no-opacity');
        }
    },
    tbar: {
        cls: 'a-notifications-tbar a-bb-100',
        border: true,
        weight: 1,
        items: [
            {
                xtype: 'tabbar',
                cls: 'a-notifications-tabs align-items-start',
                activeTab: 0,
                reference: 'actionCenterTabs',
                defaults: {
                    // ui: 'tab-lg',
                    iconAlign: 'top',
                    ripple: false,
                },
                publishes: {
                    activeTab: true,
                    activeTabIndex: true,
                },
                items: [
                    {
                        title: 'Notifications',
                        iconAlign: 'top',
                        iconCls: 'md-icon-outlined md-icon-notifications',
                        cls: 'a-tab-notifications',
                        bind: {
                            badgeText: '{newNotifications > 0 ? newNotifications : null}',
                        },
                    },
                    {
                        title: 'Action center',
                        iconCls: 'md-icon-outlined md-icon-insights',
                        cls: 'a-tab-actions',
                        bind: {
                            badgeText: '{dailyActionsCount > 0 ? dailyActionsCount : null}',
                        },
                    },
                ],
            },
            '->',
            {
                xtype: 'button',
                ui: 'round tool-round-md toggle',
                enableToggle: true,
                iconCls: 'md-icon-filter-alt md-icon-outlined',
                bind: {
                    hidden: '{actionCenterTabs.activeTabIndex == 0 ? false : true}',
                },
                tooltip: {
                    anchorToTarget: true,
                    html: 'Filters',
                    align: 'bc-tc?',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    closeAction: 'destroy',
                },
                handler: function(me) {
                    me.up('main\\.notificationmenu').down('[cls~=a-filters]').toggleCls('is-hidden');
                },
            },
            {
                xtype: 'button',
                ui: 'round tool-round-md',
                iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                handler: function(me) {
                    me.up('main\\.notificationmenu').hide();
                },
                tooltip: {
                    anchorToTarget: true,
                    html: 'Close',
                    align: 'bc-tc?',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                },
            },
        ],
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-filters is-hidden a-bgr-white',
            padding: '16 24',
            margin: 0,
            docked: 'top',
            weight: 2,
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            bind: {
                hidden: '{actionCenterTabs.activeTabIndex == 0 ? false : true}',
            },
            items: [
                {
                    xtype: 'searchfield',
                    flex: 1,
                    margin: '0 16 0 0',
                    placeholder: 'Search notifications',
                    ui: 'no-border classic',
                    listeners: {
                        change: function(field, newValue, oldValue, eOpts) {
                            var notifications = Ext.getCmp('main-viewport').getVM().get('notifications');
                            if (newValue == '') notifications.removeFilter('search');
                        },
                        action: function(me, newValue, oldValue, eOpts) {
                            const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                            var notifications = Ext.getCmp('main-viewport').getVM().get('notifications');
                            notifications.removeFilter('search');
                            if (query.length > 2) {
                                notifications.addFilter(
                                    new Ext.data.Query({
                                        id: 'search',
                                        source: 'text like "' + query + '"',
                                    }),
                                );
                            }
                        },
                        painted: function(me) {
                            me.focus();
                        },
                    },
                },
                {
                    text: 'Type',
                    ui: 'filter round',
                    xtype: 'splitbutton',
                    handler: function() {
                        this.showMenu();
                    },
                    arrowHandler: function() {
                        let button = this,
                            arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                            notifications = Ext.getCmp('main-viewport').getVM().get('notifications');
                        if (!arrowCls) {
                            let selected = Ext.ComponentQuery.query(
                                'menuitem[cls~=notificationsFilterItem][checked="true"]',
                            );
                            Ext.each(selected, function(value, index) {
                                value.setChecked(false);
                            });
                            button.setText('Type');
                            button.splitArrowElement.removeCls('md-icon-close');
                            button.splitArrowElement.addCls('x-arrow-el');
                            button.removeCls('active');
                            notifications.removeFilter('category');
                            return;
                        }
                    },
                    menu: {
                        cls: 'filter-menu',
                        defaults: {
                            cls: 'notificationsFilterItem',
                            handler: function(me) {
                                let button = this.up('button'),
                                    store = Ext.getCmp('main-viewport').getVM().get('notifications');

                                button.setText(this.getText());
                                button.getMenu().arrowCls = 'delete';
                                button.splitArrowElement.removeCls('x-arrow-el');
                                button.splitArrowElement.addCls('md-icon-close');
                                button.addCls('active');

                                store.addFilter({
                                    id: 'category',
                                    filterFn: function(record) {
                                        if (record.get('category') == me.getValue()) {
                                            return true;
                                        }
                                    },
                                });
                            },
                        },
                        items: [
                            {
                                text: 'Task',
                                group: 'type',
                                value: 'task',
                            },
                            {
                                text: 'Portcall',
                                group: 'type',
                                value: 'port call',
                            },
                            {
                                text: 'Document',
                                group: 'type',
                                value: 'document',
                            },
                            {
                                text: 'Invitation',
                                group: 'type',
                                value: 'invitation',
                            },
                            {
                                text: 'System',
                                group: 'type',
                                value: 'system',
                            },
                        ],
                    },
                },
            ],
        },
        {
            xtype: 'notifications.list',
            hidden: true,
            bind: {
                hidden: '{actionCenterTabs.activeTabIndex == 0 ? false : true}',
            },
        },
        {
            xtype: 'daily.actions',
            hidden: true,
            bind: {
                hidden: '{actionCenterTabs.activeTabIndex == 1 ? false : true}',
            },
        },
    ],
    listeners: {
        show: function() {
            let notifications = this.upVM().get('notifications');

            notifications.each(function(record) {
                record.set('is_seen', 1);
            });

            notifications.sync();
        },
    },
});
