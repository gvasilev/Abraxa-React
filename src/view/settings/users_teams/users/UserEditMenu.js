Ext.define('Abraxa.view.settings.users_teams.UserEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'users.edit.menu',
    controller: 'settings.users.controller',
    items: [
        {
            slug: 'settingsUserSuspend',
            bind: {
                permission: '{userPermissions}',
                text: '{selectedActiveUser == 1 ? "Suspend user":"Activate user" }',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('record'),
                    isActiveUser = vm.get('selectedActiveUser'),
                    msg = 'Do you want to activate ' + record.get('full_name') + ' ?',
                    ui = 'action',
                    title = 'Acvivate',
                    btnText = 'Activate';
                if (isActiveUser) {
                    title = 'Suspend';
                    ui = 'decline alt';
                    btnText = 'Suspend';
                    msg = 'Do you want to suspend ' + record.get('full_name') + ' ?';
                }
                Ext.Msg.confirm(
                    title,
                    msg,
                    function (answer) {
                        if (answer == 'yes') {
                            if (isActiveUser) {
                                record.set('is_active', 0);
                            } else {
                                record.set('is_active', 1);
                            }
                            record.save({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update user!');
                                },
                            });
                        }
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            itemId: 'yes',
                            ui: ui,
                            text: btnText,
                        },
                    ]
                );
            },
        },
        {
            text: 'Request password change',
            slug: 'settingsUser',
            bind: {
                permission: '{userPermissions}',
                hidden: '{userStatus === "pending" || userStatus === "suspended"}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('record');

                if (record) {
                    let params = {
                        userId: record.get('id'),
                    };
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Do you want to request password change for ' + record.get('full_name') + ' ?',
                        function (answer) {
                            if (answer == 'yes') {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'companies/users/request-change',
                                    method: 'POST',
                                    params: params,
                                    success: function (response, opts) {
                                        Ext.toast('Request sent', 2000);
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.alert('Something went wrong', 'Could not request password change!');
                                    },
                                });
                            }
                        }
                    );
                }
            },
        },
        {
            text: 'Resend invite',
            slug: 'settingsUser',
            // hidden: true,
            bind: {
                permission: '{userPermissions}',
                // hidden: '{inviteExpired}'
                hidden: '{userStatus !== "pending"}',
            },
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('record');

                if (record) {
                    let params = {
                        userId: record.get('id'),
                    };
                    Ext.Msg.confirm(
                        'Confirmation',
                        'Do you want to resend invite for ' + record.get('full_name') + ' ?',
                        function (answer) {
                            if (answer == 'yes') {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'companies/users/resend-invite',
                                    method: 'POST',
                                    params: params,
                                    success: function (response, opts) {
                                        Ext.toast('Request sent', 2000);
                                    },
                                    failure: function (response, opts) {
                                        Ext.Msg.alert('Something went wrong', 'Could not resend invitation!');
                                    },
                                });
                            }
                        }
                    );
                }
            },
        },
    ],
});
