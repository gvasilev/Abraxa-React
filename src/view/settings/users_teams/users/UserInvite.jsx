import './UserController';
import '../../../common/combo/Role';

Ext.define('Abraxa.view.settings.users.UserInvite', {
    extend: 'Ext.Dialog',
    xtype: 'settings.users.invite',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined md-icon-person"></i></div>Invite user',
    manageBorders: false,
    closable: true,
    centered: true,
    controller: 'settings.users.controller',
    width: 540,
    padding: '0 24 0 72',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    padding: 0,
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            scrollable: 'y',
                            flex: 1,
                            cls: 'general_data_container a-dialog-wrap',
                            padding: '0 0 24 0',
                            items: [
                                {
                                    xtype: 'container',
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        required: true,
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.emailfield',
                                            testId: 'settingsUserCreateEmailTestIdInviteDialog',
                                            label: 'Email',
                                            placeholder: 'Company email address',
                                            cls: 'a-field-icon icon-rounded icon-email',
                                            name: 'email',
                                        },
                                        {
                                            xtype: 'textfield',
                                            testId: 'settingsUserCreateFirstNameTestIdInviteDialog',
                                            label: 'First name',
                                            name: 'first_name',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            placeholder: 'Enter first name',
                                        },
                                        {
                                            xtype: 'textfield',
                                            testId: 'settingsUserCreateLastNameTestIdInviteDialog',
                                            label: 'Last name',
                                            name: 'last_name',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            placeholder: 'Enter last name',
                                        },
                                        {
                                            xtype: 'role.combo',
                                            testId: 'settingsUserCreateRoleTestIdInviteDialogCombo',
                                            label: 'Choose role',
                                            placeholder: 'Choose role',
                                            cls: 'a-field-icon icon-user icon-rounded non-editable',
                                            editable: false,
                                            name: 'role_id',
                                            value: 2,
                                        },
                                        {
                                            xtype: 'combobox',
                                            testId: 'settingsUserCreateOfficeTestIdInviteDialogCombo',
                                            label: 'Choose office',
                                            placeholder: 'Choose office',
                                            cls: 'a-field-icon icon-office icon-rounded',
                                            editable: false,
                                            name: 'current_office_id',
                                            displayField: 'office_name',
                                            valueField: 'id',
                                            queryMode: 'local',
                                            required: false,
                                            bind: {
                                                store: '{offices}',
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
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                handler: 'inviteUser',
                testId: 'settingsUserCreateInviteTestIdInviteDialog',
                text: 'Invite',
            },
        ],
    },
});
