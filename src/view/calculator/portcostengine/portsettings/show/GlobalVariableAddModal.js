Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.GlobalVariableAddModal', {
    xtype: 'calculator.portcostengine.portsettings.show.globalvariable.add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Create variable',
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
            text: 'Create',
            ui: 'action',
            handler: function (me) {
                let store = me.upVM().get('calcglobalvariable'),
                    record = me.upVM().get('record'),
                    form = me.up('dialog').down('formpanel'),
                    list = Ext.ComponentQuery.query('list[reference=calcGlobalVariablesList]')[0];

                if (form.validate()) {
                    store.add(record);
                    store.sync({
                        success: function () {
                            // Toast message
                            Ext.toast('Record created', 1000);

                            // Auto select the last record in the list
                            list.select(list.getStore().getAt(list.getStore().getCount() - 1));
                            me.upVM().set(
                                'subpageXtype',
                                'calculator.portcostengine.portsettings.show.globalvariables.show.subpage'
                            );

                            // Resets error div on variable change
                            if (Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]) {
                                Ext.ComponentQuery.query('container[reference=globalVariableForm]')[0]
                                    .down('form\\.error')
                                    .hide()
                                    .removeCls('error');
                            }

                            // Destroy modal
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
