Ext.define('Abraxa.view.settings.library.expense.DisbursementItemDetailsForm', {
    xtype: 'settings.lybrary.expenses.item.details.form',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    cls: 'a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="material-icons-outlined">numbers</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 480,
    padding: '8 24 8 72',
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
                    xtype: 'textfield',
                    label: false,
                    placeholder: 'Enter service name',
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
                    xtype: 'textfield',
                    label: 'System name',
                    cls: 'a-field-icon icon-numbers icon-rounded',
                    disabled: true,
                    bind: {
                        value: '{defaultDisbursementItem.system_name}',
                    },
                },
                {
                    xtype: 'textfield',
                    testId: 'accountingCodeFieldTestId',
                    label: 'Accounting code',
                    placeholder: 'Accounting code',
                    cls: 'a-field-icon icon-numbers icon-rounded',
                    bind: {
                        value: '{record.accounting_code}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Reference ID',
                    placeholder: 'Refenrece ID',
                    cls: 'a-field-icon icon-numbers icon-rounded',
                    bind: {
                        value: '{record.reference}',
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
                handler: function (me) {
                    let vm = me.upVM(),
                        store = vm.get('store');

                    store.rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                testId: 'settingsLibraryExpensesItemDetailsFormSaveButtonTestId',
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('store'),
                        defaultDisbursementItem = vm.get('defaultDisbursementItem');

                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');

                        store.sync({
                            success: function (rec, operation) {
                                defaultDisbursementItem.load({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                                dialog.destroy();
                            },
                            failure: function (batch, operations) {
                                me.toggle();
                                Ext.Msg.alert('Something went wrong', 'Cannot update record.');
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
