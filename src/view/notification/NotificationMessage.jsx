Ext.define('Abraxa.view.notification.NotificationMessage', {
    extend: 'Ext.Dialog',
    xtype: 'notification.message',
    id: 'notification',
    maxWidth: 420,
    modal: false,
    draggable: false,
    closable: false,
    top: 120,
    right: 64,
    bodyPadding: 0,
    header: false,
    hideAnimation: {
        type: 'slideOut',
        direction: 'right',
    },
    showAnimation: {
        type: 'slideIn',
        duration: 250,
        easing: 'ease-out',
    },
    layout: 'hbox',
    padding: 16,
    items: [
        {
            xtype: 'div',
            padding: '0 12 0 0',
            hidden: true,
            bind: {
                hidden: '{notification.type != "internal" ? false : true}',
                html: '<div class="part_abbr a-badge-abbr a-square" style="width: 28px; height: 28px;"><span>{notification.user.company.abbr}</span></div>',
            },
        },
        {
            xtype: 'public.updated.by',
            hidden: true,
            padding: 0,
            bind: {
                hidden: '{notification.type == "internal" ? false : true}',
                data: {
                    user: '{notification.user}',
                    hide_tooltip: true,
                },
            },
        },
        {
            xtype: 'container',
            flex: 1,
            padding: '0 38 0 0',
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-title',
                    bind: {
                        html: '<strong>{notification.category:uppercase}</strong>',
                    },
                },
                {
                    xtype: 'div',
                    flex: 1,
                    bind: {
                        html: '{notification.text}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a',
                            fn: function (el) {
                                el.preventDefault();
                                let record = this.component.upVM().get('notification');
                                if (record.category === 'invitation' || record.category === 'port call') {
                                    let mainVM = Ext.getCmp('main-viewport').getViewModel(),
                                        invitations = mainVM.get('invitations'),
                                        invitation = invitations.queryBy(function (rec, id) {
                                            return rec.get('invitable_id') === record.notifiable_id;
                                        }).items[0];
                                    if (invitation && invitation.get('status') === 'Pending') {
                                        let dialog = Ext.create('Abraxa.view.invitations.invite.InvitationMainDialog', {
                                                viewModel: {
                                                    parent: mainVM,
                                                },
                                            }),
                                            bodyItem = dialog.getItems().getAt(0),
                                            vm = bodyItem.getVM();

                                        vm.set('invitation', invitation);
                                        dialog.show();
                                    } else if (invitation && invitation.get('status') === 'Accepted') {
                                        window.location = record.url;
                                    } else if (!invitation && record.category === 'port call') {
                                        window.location = record.url;
                                    } else {
                                        Ext.Msg.alert('Info', 'This invitation no longer exists.', Ext.emptyFn);
                                    }
                                } else {
                                    window.location = record.url;
                                }
                            },
                        },
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
                this.up('dialog').destroy();
            },
        },
    ],
});
