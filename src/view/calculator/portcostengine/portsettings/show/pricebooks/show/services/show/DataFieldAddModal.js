Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.DataFieldAddModal', {
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafield.add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Create question',
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
                let store = me.upVM().get('questionStore'),
                    record = me.upVM().get('record'),
                    form = me.up('dialog').down('formpanel');

                if (form.validate()) {
                    store.add(record);
                    store.sync({
                        success: function () {
                            Ext.toast('Record created', 1000);
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
