import './ChangeUserRole';

Ext.define('Abraxa.view.settings.users_teams.users.UserDetailsMain', {
    extend: 'Ext.Container',
    xtype: 'user.details.main',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    style: 'max-width: 800px; margin: auto;',
                    items: [
                        {
                            xtype: 'div',
                            html: '<h1 class="fw-n">Profile</h1>',
                        },
                        {
                            xtype: 'div',
                            html: '<p class="text-info">Personalizing your profile and photo helps your teammates and clients recognize you better in Abraxa.</p>',
                        },
                        {
                            xtype: 'div',
                            margin: '16 0',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'general_data_container',
                            items: [
                                {
                                    xtype: 'container',
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        slug: 'settingsUser',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            disabled: true,
                                            label: 'Company',
                                            cls: 'a-field-icon icon-business icon-rounded',
                                            placeholder: 'Company name',
                                            bind: {
                                                value: '{userGrid.selection.company.name}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Position',
                                            cls: 'a-field-icon icon-business_center icon-rounded',
                                            placeholder: 'Add your position',
                                            disabled: true,
                                            bind: {
                                                value: '{userGrid.selection.position}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.emailfield',
                                            label: 'Email',
                                            cls: 'a-field-icon icon-email icon-rounded',
                                            placeholder: 'Add your email address',
                                            disabled: true,
                                            bind: {
                                                value: '{userGrid.selection.email}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.phonefield',
                                            label: 'Phone number',
                                            cls: 'a-field-icon icon-phone icon-rounded',
                                            disabled: true,
                                            bind: {
                                                value: '{userGrid.selection.phone}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            label: 'Birthday',
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            placeholder: 'dd/mm/yy',
                                            cls: 'a-field-icon icon-birthday icon-rounded',
                                            disabled: true,
                                            bind: {
                                                value: '{userGrid.selection.birthDay}',
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            label: 'Skype',
                                            cls: 'a-field-icon icon-skype icon-rounded',
                                            placeholder: 'Add a Skype name',
                                            disabled: true,
                                            bind: {
                                                value: '{userGrid.selection.skype}',
                                            },
                                        },
                                        {
                                            xtype: 'country.combo',
                                            label: 'Location',
                                            placeholder: 'Choose location',
                                            disabled: true,
                                            cls: 'a-field-icon icon-rounded icon-location',
                                            bind: {
                                                value: '{userGrid.selection.location}',
                                            },
                                            triggers: {
                                                search: false,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-profile-access',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-item',
                                    bind: {
                                        html: '{userRole}',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'i.edit_role',
                                            fn: function (cmp, a) {
                                                let vm = this.component.upVM();
                                                var record = vm.get('userGrid.selection');
                                                Ext.create('Abraxa.view.settings.user_teams.users.ChangeUserRole', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            user: record,
                                                        },
                                                    },
                                                }).showBy(this);
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-item',
                                    hidden: true,
                                    bind: {
                                        hidden: '{userTeam ? false:true}',
                                        html: '{userTeam}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-item',
                                    hidden: true,
                                    bind: {
                                        hidden: '{userOffice ? false:true}',
                                        html: '{userOffice}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '0 0 24 0',
                            cls: 'a-profile-access a-bgr-white',
                            bind: {
                                hidden: '{userGrid.selection.id == currentUser.id ? true : false}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-item',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    showNoPermissions: true,
                                    slug: 'settingsUserSuspend',
                                    bind: {
                                        permission: '{userPermissions}',
                                        hidden: '{userGrid.selection.auth0id ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            bind: {
                                                html: '<h3>Suspend user</h3><div class="text-info">Suspend user</div>',
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Suspend user',
                                            slug: 'settingsUserSuspend',
                                            bind: {
                                                permission: '{userPermissions}',
                                                ui: '{isActiveUser == 1 ? "decline alt":"confirm alt"}',
                                                text: '{isActiveUser == 1 ? "Suspend user":"Activate user" }',
                                            },
                                            margin: '8 0 0 0',
                                            handler: function () {
                                                let record = this.upVM().get('userGrid').selection,
                                                    isActiveUser = this.upVM().get('isActiveUser'),
                                                    msg = 'Do you want to activate ' + record.get('full_name') + ' ?',
                                                    ui = 'action',
                                                    title = 'Activate',
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
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Cannot update user!'
                                                                    );
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
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
