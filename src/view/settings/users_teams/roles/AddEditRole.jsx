Ext.define('Abraxa.view.settings.company.AddEditRole', {
    xtype: 'settings.users_teams.roles.add.edit.role',
    extend: 'Ext.Dialog',
    testId: 'settingsUsersAddEditRole',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined">manage_accounts</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: '0 24 0 0',
    viewModel: true,
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            cls: 'a-general-form',
            testId: 'settingsUsersAddEditRoleForm',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
                slug: 'settingsUserRole',
                bind: {
                    permission: '{userPermissions}',
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    label: false,
                    placeholder: 'Enter role name',
                    testId: 'settingsUsersAddEditRoleNameField',
                    ui: 'field-xl no-border classic',
                    required: true,
                    bind: {
                        value: '{record.name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'role.combo',
                    label: 'Choose template role',
                    testId: 'settingsUsersAddEditRoleTemplateField',
                    editable: false,
                    placeholder: 'Choose template role',
                    cls: 'a-field-icon icon-rounded icon-user non-editable',
                    bind: {
                        value: '{record.parent_role_id}',
                        hidden: '{editMode ? true:false}',
                    },
                },
                {
                    xtype: 'textareafield',
                    label: 'Role description',
                    testId: 'settingsUsersAddEditRoleDescField',
                    labelAlign: 'top',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Say something',
                    flex: 1,
                    margin: '12 0 0 0',
                    bind: {
                        value: '{record.description}',
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                testId: 'settingsUsersAddEditRoleCancelBtn',
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                slug: 'settingsUserRole',
                testId: 'settingsUsersAddEditRoleSaveBtn',
                bind: {
                    permission: '{userPermissions}',
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('roles');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                            dialog.destroy();
                        } else {
                            record.save({
                                success: function (batch, opt) {
                                    Ext.toast('Record created', 1000);
                                    record.load({
                                        scope: this,
                                        success: function () {
                                            store.add(record);
                                            Ext.toast('Record created', 1000);
                                            dialog.destroy();
                                        },
                                    });
                                },
                            });
                        }
                    } else {
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                        me.toggle();
                    }
                },
            },
        ],
    },
});
