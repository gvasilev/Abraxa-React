Ext.define('Abraxa.view.pda.PDAServiceForm', {
    extend: 'Ext.Dialog',
    xtype: 'pda.service.form',
    testId: 'pdaServiceForm',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 580,
    // height: '100%',
    height: 280,
    draggable: false,
    padding: 0,
    title: '<div class="a-badge a-badge-services"><i class="md-icon-outlined md-icon-layers"></i></div>Add service',
    items: [
        {
            xtype: 'container',
            cls: 'a-dialog-form a-general-form',
            defaults: {
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'default.expense.items.combo',
                    label: 'Service',
                    testId: 'pdaServiceFormServiceCombo',
                    placeholder: 'Choose type',
                    cls: 'a-field-icon icon-short icon-rounded',
                    itemCls: 'a-disb-costs-combo',
                    required: true,
                    clearable: true,
                    store: {
                        type: 'default-expense-items',
                        autoLoad: true,
                    },
                    bind: {
                        value: '{record.default_expense_item_id}',
                    },
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                let record = me.upVM().get('record');
                                record.set('default_expense_item_name', selection.get('name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'numberfield',
                    placeholder: '0,000.00',
                    label: 'Price',
                    testId: 'pdaServiceFormPriceField',
                    required: true,
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{record.custom_amount}',
                    },
                    listeners: {
                        painted: function () {
                            this.setError(false);
                        },
                    },
                },
            ],
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'pdaServiceFormCancelBtn',
            margin: '0 8 0 0',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Add',
            testId: 'pdaServiceFormAddBtn',
            ui: 'action',
            handler: function () {
                let store = this.upVM().get('serviceStore'),
                    record = this.upVM().get('record');

                record.save({
                    success: function (rec) {
                        store.load();
                    },
                });
                this.up('dialog').destroy();
            },
        },
    ],
});
