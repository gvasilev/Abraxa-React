Ext.define('Abraxa.view.notification.NotificationList', {
    extend: 'Ext.dataview.List',
    xtype: 'notifications.list',
    flex: 1,
    bind: {
        store: '{notifications}',
    },
    itemTpl: null,
    pinHeaders: false,
    variableHeights: true,
    items: [
        {
            xtype: 'button',
            ui: 'normal small',
            text: 'Clear all notifications',
            top: 16,
            right: 16,
            hidden: true,
            bind: {
                hidden: '{notifications.count ? false : true}',
            },
            handler: function () {
                let store = this.upVM().get('notifications');

                store.removeAll();
                store.sync({
                    success: function () {
                        Ext.toast('Records deleted', 1000);
                    },
                });
            },
        },
    ],
    groupHeader: {
        cls: 'a-notifications-group',
        tpl: '{name} <em>({count})</em>',
    },
    emptyText:
        '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-10234 -18910)"><g transform="translate(9400 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M121.966,101.881a1.716,1.716,0,0,0-1.682,1.351,3.32,3.32,0,0,1-.662,1.444,2.5,2.5,0,0,1-2.133.782,2.545,2.545,0,0,1-2.133-.782,3.32,3.32,0,0,1-.662-1.444,1.724,1.724,0,1,0-3.365.755,6.318,6.318,0,0,0,12.32,0,1.734,1.734,0,0,0-1.682-2.106Zm16.2-6.73c-2.04-2.689-6.054-4.266-6.054-16.307,0-12.36-5.458-17.327-10.545-18.52-.477-.119-.821-.278-.821-.782v-.384a3.249,3.249,0,0,0-3.179-3.259h-.079a3.249,3.249,0,0,0-3.179,3.259v.384c0,.49-.344.662-.821.782-5.1,1.206-10.545,6.16-10.545,18.52,0,12.042-4.014,13.6-6.054,16.307A2.63,2.63,0,0,0,99,99.364H136.1A2.632,2.632,0,0,0,138.168,95.152ZM133,95.92H102.109a.581.581,0,0,1-.437-.967,16.049,16.049,0,0,0,2.782-4.425c1.272-2.994,1.894-6.822,1.894-11.684,0-4.941.927-8.809,2.769-11.5a8.5,8.5,0,0,1,5.127-3.656,4.643,4.643,0,0,0,2.464-1.391,1.048,1.048,0,0,1,1.576-.026,4.8,4.8,0,0,0,2.49,1.417,8.5,8.5,0,0,1,5.127,3.656c1.841,2.689,2.769,6.557,2.769,11.5,0,4.862.623,8.69,1.894,11.684a16.232,16.232,0,0,0,2.848,4.491.548.548,0,0,1-.411.9Z" transform="translate(10178.647 18889.1)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No notifications available</div></div>',
    // emptyText: 'No notifications available',
    itemConfig: {
        xtype: 'container',
        layout: 'hbox',
        flex: 1,
        bind: {
            cls: 'a-notification-item {record.status}',
        },
        viewModel: {},
        items: [
            {
                xtype: 'div',
                cls: 'a-notification-badge',
                padding: '0 16 0 0',
                hidden: true,
                bind: {
                    hidden: '{record.type != "internal" ? false : true}',
                    html: '<div class="part_abbr a-badge-abbr a-square" style="width: 30px; height: 30px;"><span>{record.user.company.abbr}</span></div>',
                },
            },
            {
                xtype: 'public.updated.by',
                cls: 'a-notification-user',
                style: 'pointer-events: none;',
                hidden: true,
                padding: 0,
                bind: {
                    hidden: '{record.type == "internal" ? false : true}',
                    data: {
                        user: '{record.user}',
                        hide_tooltip: true,
                    },
                },
            },
            {
                xtype: 'container',
                cls: 'a-notification-body',
                flex: 1,
                padding: '0 32 0 0',
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-notification-category sm-title',
                        bind: {
                            html: '<strong>{record.category:uppercase}</strong>',
                        },
                    },
                    {
                        xtype: 'div',
                        flex: 1,
                        cls: 'a-notification-text',
                        bind: {
                            html: '{record.text}',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a',
                                fn: function (el) {
                                    el.preventDefault();
                                    let record = this.component.upVM().get('record');

                                    let menu = Ext.ComponentQuery.query('[xtype=main\\.notificationmenu]')[0];

                                    if (
                                        record.get('category') == 'invitation' ||
                                        record.get('category') == 'port call'
                                    ) {
                                        let mainVM = Ext.getCmp('main-viewport').getViewModel(),
                                            invitations = mainVM.get('invitations'),
                                            invitation = invitations.queryBy(function (rec, id) {
                                                return rec.get('invitable_id') == record.get('notifiable_id');
                                            }).items[0];

                                        if (invitation && invitation.get('status') == 'Pending') {
                                            let dialog = Ext.create(
                                                    'Abraxa.view.invitations.invite.InvitationMainDialog',
                                                    {
                                                        viewModel: {
                                                            parent: mainVM,
                                                        },
                                                    }
                                                ),
                                                bodyItem = dialog.getItems().getAt(0),
                                                vm = bodyItem.getVM();

                                            vm.set('invitation', invitation);
                                            if (menu) menu.hide(false);
                                            dialog.show();
                                        } else if (invitation && invitation.get('status') == 'Accepted') {
                                            window.location = record.get('url');
                                            if (menu) menu.hide(false);
                                        } else if (!invitation && record.get('category') == 'port call') {
                                            window.location = record.get('url');
                                            if (menu) menu.hide(false);
                                        } else {
                                            Ext.Msg.alert('Info', 'This invitation no longer exists.', Ext.emptyFn);
                                        }
                                    } else {
                                        window.location = record.get('url');
                                        if (menu) menu.hide(false);
                                    }
                                },
                            },
                        },
                    },
                    {
                        xtype: 'div',
                        bind: {
                            cls: 'a-notification-date {record.status}',
                            html: '{record.parsed_date}',
                        },
                    },
                ],
            },
            {
                xtype: 'tool',
                iconCls: 'md-icon-close',
                ui: 'tool-md',
                top: 8,
                right: 8,
                handler: function () {
                    let record = this.upVM().get('record'),
                        store = this.up('notifications\\.list').getStore();

                    store.remove(record);
                    store.sync({
                        success: function () {
                            Ext.toast('Record deleted', 1000);
                        },
                    });
                },
                tooltip: {
                    anchorToTarget: true,
                    html: 'Delete',
                    align: 'bc-tc?',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                },
            },
            {
                xtype: 'button',
                ui: 'small normal-light',
                text: 'View',
                bottom: 8,
                right: 8,
                bind: {
                    hidden: '{record.url ? false : true}',
                },
                handler: function () {
                    let record = this.upVM().get('record');
                    if (record.get('category') == 'invitation' || record.get('category') == 'port call') {
                        let mainVM = Ext.getCmp('main-viewport').getViewModel(),
                            invitations = mainVM.get('invitations'),
                            invitation = invitations.queryBy(function (rec, id) {
                                return rec.get('invitable_id') == record.get('notifiable_id');
                            }).items[0];
                        if (invitation && invitation.get('status') == 'Pending') {
                            let dialog = Ext.create('Abraxa.view.invitations.invite.InvitationMainDialog', {
                                    viewModel: {
                                        parent: mainVM,
                                    },
                                }),
                                bodyItem = dialog.getItems().getAt(0),
                                vm = bodyItem.getVM();

                            vm.set('invitation', invitation);
                            this.up('main\\.notificationmenu').hide(false);
                            dialog.show();
                        } else if (invitation && invitation.get('status') == 'Accepted') {
                            window.location = record.get('url');
                            this.up('main\\.notificationmenu').hide(false);
                        } else if (!invitation && record.get('category') == 'port call') {
                            window.location = record.get('url');
                            this.up('main\\.notificationmenu').hide(false);
                        } else {
                            Ext.Msg.alert('Info', 'This invitation no longer exists.', Ext.emptyFn);
                        }
                    } else {
                        window.location = record.get('url');
                        this.up('main\\.notificationmenu').hide(false);
                    }
                },
            },
        ],
    },
    listeners: {
        childtap: function (list, location, eOpts) {
            let record = location.record,
                store = this.upVM().get('notifications');

            if (record) {
                record.set('status', 'read');
                if (store.needsSync) {
                    store.sync();
                }
            }
        },
    },
});
