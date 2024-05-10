Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.DataFieldAddModal', {
    xtype: 'calculator.portcostengine.portsettings.show.datafield.add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Create offer data field',
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
                    label: 'Label',
                    placeholder: 'Enter label',
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
                {
                    xtype: 'selectfield',
                    margin: '16 0 0 0',
                    labelAlign: 'top',
                    label: 'Data field type',
                    placeholder: 'Choose type',
                    reference: 'dataFieldType',
                    ui: 'classic',
                    cls: 'a-field-icon icon-short icon-rounded',
                    options: [
                        {
                            value: 'number',
                            text: 'Number field',
                        },
                        {
                            value: 'choice',
                            text: 'Dropdown field',
                        },
                        {
                            value: 'complex',
                            text: 'Complex field',
                        },
                    ],
                    bind: {
                        value: '{record.control}',
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
                let store = me.upVM().get('calcdatafield'),
                    record = me.upVM().get('record'),
                    form = me.up('dialog').down('formpanel'),
                    list = Ext.ComponentQuery.query('list[reference=calcDataFieldsList]')[0];

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
                                'calculator.portcostengine.portsettings.show.datafields.show.subpage'
                            );

                            // Resets error div on data field change
                            if (Ext.ComponentQuery.query('container[reference=numberForm]')[0]) {
                                Ext.ComponentQuery.query('container[reference=numberForm]')[0]
                                    .down('form\\.error')
                                    .hide()
                                    .removeCls('error');
                            }

                            if (Ext.ComponentQuery.query('container[reference=choiceForm]')[0]) {
                                Ext.ComponentQuery.query('container[reference=choiceForm]')[0]
                                    .down('form\\.error')
                                    .hide()
                                    .removeCls('error');
                            }

                            if (Ext.ComponentQuery.query('container[reference=complexForm]')[0]) {
                                Ext.ComponentQuery.query('container[reference=complexForm]')[0]
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
