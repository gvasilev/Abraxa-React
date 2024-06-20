Ext.define('Abraxa.view.settings.users_teams.teams.CreateTeam', {
    extend: 'Ext.Dialog',
    xtype: 'settings.teams.create',
    testId: 'createTeamDialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-teams"><i class="md-icon-outlined">groups</i></div>{editMode ? "Edit team":"Create team"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 540,
    minHeight: 340,
    padding: '0 24 0 72',
    items: [
        {
            xtype: 'form.error',
            testId: 'createTeamDialogFormError',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            testId: 'createTeamDialogFormPanel',
            flex: 1,
            layout: 'vbox',
            margin: 0,
            padding: 0,
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    testId: 'createTeamDialogTeamNameField',
                    label: false,
                    flex: 1,
                    required: true,
                    clearable: false,
                    placeholder: 'Enter team name',
                    bind: {
                        value: '{team.name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    testId: 'createTeamDialogTeamDescField',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{team.description}',
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                testId: 'createTeamDialogCancelBtn',
                handler: function () {
                    this.up('dialog').upVM().get('team').reject();
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                testId: 'createTeamDialogSaveBtn',
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save":"Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('teams');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('team'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record created', 1000);
                                    dialog.destroy();
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
