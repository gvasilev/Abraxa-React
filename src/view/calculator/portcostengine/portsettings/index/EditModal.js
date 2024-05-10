Ext.define('Abraxa.view.calculator.portcostengine.portsettings.index.EditModal', {
    xtype: 'calculator.portcostengine.portsettings.index.edit',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Edit port',
    closable: true,
    centered: true,
    width: 380,
    scrollable: true,
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
            scrollable: false,
            items: [
                {
                    xtype: 'common-combo-currency',
                    label: 'Currency',
                    placeholder: 'Choose currency',
                    forceSelection: true,
                    matchFieldWidth: true,
                    valueField: 'currency',
                    required: true,
                    labelAlign: 'top',
                    margin: '16 0 0 0',
                    cls: 'a-field-icon icon-rounded icon-money',
                    ui: 'classic',
                    bind: {
                        value: '{record.currency}',
                    },
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Save',
            ui: 'action',
            handler: function (me) {
                let store = me.upVM().get('portsettings'),
                    form = me.up('dialog').down('formpanel');
                if (form.validate()) {
                    store.sync({
                        success: function () {
                            Ext.toast('Record updated', 1000);
                            me.up('dialog').destroy();
                        },
                        failure: function (batch, functions) {
                            store.rejectChanges();
                            me.up('dialog')
                                .down('form\\.error')
                                .setHtml('Please fill all required fields')
                                .show()
                                .addCls('error');
                        },
                    });
                }
            },
        },
    ],
});
