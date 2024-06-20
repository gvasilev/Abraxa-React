Ext.define('Abraxa.view.settings.offices.CreateOffice', {
    extend: 'Ext.Dialog',
    xtype: 'settings.offices.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-office"><i class="md-icon-outlined">maps_home_work</i></div>{editMode ? "Edit office":"Create office"}',
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
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            flex: 1,
            layout: 'vbox',
            margin: 0,
            padding: 0,
            items: [
                {
                    xtype: 'textfield',
                    testId: 'officeNameCreateDialogTestId',
                    ui: 'field-xl no-border classic',
                    label: false,
                    flex: 1,
                    required: true,
                    clearable: false,
                    placeholder: 'Enter office name',
                    bind: {
                        value: '{office.office_name}',
                    },
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    testId: 'officeDescriptionCreateDialogTestId',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    bind: {
                        value: '{office.description}',
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
                handler: function () {
                    this.up('dialog').upVM().get('office').reject();
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                testId: 'officeCreateDialogTestId',
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save":"Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('companyOffices');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('office'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                    Ext.getCmp('main-viewport').upVM().get('currentCompany').load();
                                },
                            });
                            dialog.destroy();
                        } else {
                            store.add(record);
                            store.sync({
                                success: function (batch, opt) {
                                    mixpanel.track('Create office - button');
                                    Ext.toast('Record created', 1000);
                                    Ext.getCmp('main-viewport').upVM().get('currentCompany').load();
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
