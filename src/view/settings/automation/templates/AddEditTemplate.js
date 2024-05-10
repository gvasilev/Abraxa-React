Ext.define('Abraxa.view.settings.automation.templates.AddEditTemplate', {
    xtype: 'settings.automation.templates.add.edit.template',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    cls: 'a-dialog-create a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-tasks"><i class="material-icons-outlined">description</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 500,
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
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    testId: 'templateNameFieldAddEditTemplateTestIdDialog',
                    label: false,
                    placeholder: 'Enter template name',
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
                    xtype: 'textareafield',
                    testId: 'templateDescriptionFieldAddEditTemplateTestIdDialog',
                    ui: 'no-border no-underline',
                    cls: 'a-field-icon icon-short',
                    placeholder: 'Enter description',
                    flex: 1,
                    bind: {
                        value: '{record.description}',
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                },
                {
                    xtype: 'office.combo',
                    flex: 1,
                    bind: {
                        store: '{offices}',
                        value: '{record.office_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                this.upVM().get('record').set('office_name', selection.get('office_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
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
                handler: function (me) {
                    let vm = me.upVM(),
                        store = vm.get('templates');

                    store.rejectChanges();

                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'saveTemplateBtnAddEditTemplateTestIdDialog',
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('templates');
                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                        let record = vm.get('record'),
                            editMode = vm.get('editMode');
                        if (editMode) {
                            store.sync({
                                success: function (batch, opt) {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot update template!');
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
                                failure: function (batch, operations) {
                                    Ext.Msg.alert('Something went wrong', 'Cannot create template!');
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
