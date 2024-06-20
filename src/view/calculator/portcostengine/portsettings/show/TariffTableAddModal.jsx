Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.TariffTableAddModal', {
    xtype: 'calculator.portsettings.portcostengine.tarifftable.show.add',
    extend: 'Ext.Dialog',
    draggable: false,
    showAnimation: 'pop',
    title: 'Create tariff table',
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
                    label: 'Table name',
                    placeholder: 'Table name',
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
                let store = me.upVM().get('tarifftable'),
                    record = me.upVM().get('record'),
                    form = me.up('dialog').down('formpanel'),
                    list = Ext.ComponentQuery.query('list[reference=tariffTablesList]')[0];

                if (form.validate()) {
                    record.getProxy().setExtraParams({
                        portSettingsId: me.upVM().get('calculatorPortSettingsGrid.selection.id'),
                    });
                    record.save({
                        success: function (rec) {
                            rec.columns().setData(rec.get('columns'));
                            store.add(rec);
                            store.commitChanges();

                            // Toast message
                            Ext.toast('Record created');

                            // Auto select the last record in the list
                            list.select(list.getStore().getAt(list.getStore().getCount() - 1));
                            me.upVM().set(
                                'subpageXtype',
                                'calculator.portcostengine.portsettings.show.tarifftables.grid'
                            );

                            // Destroy modal
                            me.up('dialog').destroy();
                        },
                    });
                }
            },
        },
    ],
});
