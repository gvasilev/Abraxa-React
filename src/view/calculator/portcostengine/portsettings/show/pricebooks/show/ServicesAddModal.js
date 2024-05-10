Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.ServicesAddModal', {
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services-add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Add service',
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
                    xtype: 'default.expense.items.combo',
                    label: 'Services',
                    placeholder: 'Choose service',
                    forceSelection: true,
                    valueField: 'id',
                    required: true,
                    labelAlign: 'top',
                    cls: 'a-field-icon icon-rounded icon-search',
                    ui: 'classic',
                    displayField: 'name',
                    queryMode: 'local',
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                    bind: {
                        value: '{record.default_expense_item_id}',
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
            text: 'Add service',
            ui: 'action',
            handler: function (me) {
                let store = me.upVM().getParent().getStore('calcpricebookservice');

                let record = me.upVM().get('record');
                let priceBookRecord = me.upVM().get('priceBookRecord');
                let form = me.up('dialog').down('formpanel');
                let selectionPort = me.upVM().get('calculatorPortSettingsGrid.selection');

                if (form.validate()) {
                    store.add(record);
                    store.sync({
                        success: function () {
                            Ext.toast('Record created', 1000);
                            me.up('dialog').destroy();
                            let newServiceCount = priceBookRecord.get('serviceCount') + 1;
                            priceBookRecord.set('serviceCount', newServiceCount);
                            Abraxa.utils.Functions.updatePortCost(selectionPort);
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
