import '../../../common/combo/Role';

Ext.define('Abraxa.view.settings.user_teams.users.ChangeUserRole', {
    xtype: 'settings.users_teams.users.change.user.role',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: '<div class="a-badge a-badge-person"><i class="md-icon-outlined">manage_accounts</i></div>Change role',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 480,
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: '0 24 0 72',
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
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'role.combo',
                    label: 'Choose role',
                    editable: false,
                    placeholder: 'Choose role',
                    cls: 'a-field-icon icon-rounded icon-user non-editable',
                    slug: 'settingsUser',
                    bind: {
                        permission: '{userPermissions}',
                        value: '{user.role_id}',
                    },
                    listeners: {
                        change: function (me, newValue, oldValue) {
                            if (newValue) {
                                let user = me.upVM().get('user');
                                let role = user.get('role');
                                role.role_id = newValue;
                                user.set('old_role_id', oldValue);
                            }
                        },
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
                margin: '0 8 0 0',
                handler: function () {
                    this.up('dialog').upVM().get('user').reject();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                text: 'Save',
                slug: 'settingsUser',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM();
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let user = vm.get('user');
                        user.save({
                            success: function (batch, opt) {
                                Ext.toast('Record updated', 1000);
                                dialog.destroy();
                            },
                        });
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
