Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.VariablesAddModal', {
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.variables-add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Add variable',
    closable: true,
    centered: true,
    width: 360,
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
                    xtype: 'textfield',
                    label: 'Variable name',
                    placeholder: 'Variable name',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic',
                    required: true,
                    labelAlign: 'top',
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                    bind: {
                        value: '{record.label}',
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
            text: 'Add variable',
            ui: 'action',
            handler: function (me) {
                let store = me.upVM().getParent().getStore('calcpricebookvariable');
                let selectionPort = me.upVM().getParent().get('calculatorPortSettingsGrid.selection');

                let record = me.upVM().get('record');
                let form = me.up('dialog').down('formpanel');

                if (form.validate()) {
                    store.add(record);
                    store.sync({
                        success: function () {
                            Ext.toast('Record created', 1000);
                            Abraxa.utils.Functions.updatePortCost(selectionPort);
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
