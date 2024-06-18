Ext.define('Abraxa.view.portcall.appointment.AddAdditionalQuantity', {
    extend: 'Ext.Dialog',
    xtype: 'additional.quantity.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 600,
    minHeight: 340,
    maxHeight: 860,
    padding: '8 24 8 72',
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">add_circle_outline</i></div>Add additional quantity',
    },
    items: [
        {
            xtype: 'formpanel',
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    docked: 'top',
                },
                {
                    xtype: 'container',
                    scrollable: 'y',
                    flex: 1,
                    cls: 'general_data_container',
                    items: [
                        {
                            xtype: 'container',
                            padding: '8 0',
                            cls: 'a-bb-100',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'unit.field',
                                    flex: 1,
                                    labelAlign: 'left',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    label: 'B/L quantity',
                                    maxValue: 999999999.999,
                                    required: true,
                                    slug: 'portcallDocumentaryInstructionsBlQty',
                                    bind: {
                                        value: '{cargoAdditional.quantity}',
                                        valueUnit: '{cargoAdditional.unit}',
                                        ui: 'hovered-border classic',
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : "a-field-icon icon-short icon-rounded"}',
                                        permission: '{userPermissions}',
                                        options: '{defaultCargoUnits}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    iconCls: 'md-icon-add-circle-outline',
                                    ui: 'tool-sm normal round',
                                    slug: 'portcallDocumentaryInstructionsBlQty',
                                    bind: {
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : ""}',
                                        permission: '{userPermissions}',
                                    },
                                    tooltip: {
                                        anchorToTarget: true,
                                        html: 'Add quantity',
                                        align: 'bc-tc?',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                    },
                                    handler: function (me) {
                                        let form = me.up('dialog').down('formpanel'),
                                            record = me.upVM().get('cargoAdditional'),
                                            cargo = me.upVM().get('cargo'),
                                            store = me.upVM().get('additionalQuantity');
                                        if (form.validate()) {
                                            store.add(record);
                                            store.sync({
                                                success: function (response, options) {
                                                    Ext.toast('Record created', 1000);
                                                    form.reset();
                                                    form.down('unit\\.field').setError(null);
                                                },
                                            });
                                            let model = Ext.create('Abraxa.model.cargo.CargoAdditional', {
                                                portcall_id: cargo.get('portcall_id'),
                                                cargo_id: cargo.get('id'),
                                            });
                                            me.upVM().set('cargoAdditional', model);
                                        } else {
                                            me.toggle(false);
                                            this.up('dialog')
                                                .down('form\\.error')
                                                .setHtml('Please fill all required fields')
                                                .show()
                                                .addCls('error');
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'list',
                    height: 400,
                    bind: {
                        store: '{additionalQuantityFiltered}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-bb-100',
                        padding: '8 0',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'unit.field',
                                label: 'B/L quantity',
                                flex: 1,
                                labelAlign: 'left',
                                cls: 'a-field-icon icon-short icon-rounded',
                                bind: {
                                    value: '{record.quantity}',
                                    valueUnit: '{record.unit}',
                                    ui: 'hovered-border classic',
                                    options: '{defaultCargoUnits}',
                                },
                            },
                            {
                                xtype: 'button',
                                margin: '0 0 0 8',
                                arrow: false,
                                focusable: false,
                                iconCls: 'md-icon-remove-circle-outline',
                                ui: 'tool-sm round',
                                slug: 'portcallDocumentaryInstructionsBlQty',
                                bind: {
                                    cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                    permission: '{userPermissions}',
                                },
                                tooltip: {
                                    anchorToTarget: true,
                                    html: 'Delete',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                                handler: function (me) {
                                    let record = me.upVM().get('record'),
                                        additionalQuantity = this.upVM().get('additionalQuantity');
                                    Ext.Msg.confirm(
                                        'Delete',
                                        'Are you sure you would like to delete this row?',
                                        function (answer) {
                                            if (answer != 'yes') return;
                                            additionalQuantity.remove(record);
                                            additionalQuantity.sync({
                                                success: function () {
                                                    Ext.toast('Record updated');
                                                },
                                            });
                                        },
                                        this,
                                        [
                                            {
                                                xtype: 'button',
                                                itemId: 'no',
                                                margin: '0 8 0 0',
                                                text: 'Cancel',
                                            },
                                            {
                                                xtype: 'button',
                                                itemId: 'yes',
                                                ui: 'decline alt',
                                                text: 'Delete',
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],

    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('cargoAdditional');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Save',
            enableToggle: true,
            ui: 'action loading',
            slug: 'portcallDocumentaryInstructionsBlQty',
            bind: {
                cls: '{nonEditable ? "hidden a-no-content-btn" : ""}',
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let form = me.up('dialog').down('formpanel'),
                    record = me.upVM().get('cargoAdditional'),
                    filteredStore = me.up('dialog').down('list').getStore(),
                    cargo = me.upVM().get('cargo'),
                    store = me.upVM().get('additionalQuantity');
                if (form.validate()) {
                    me.up('dialog').down('form\\.error').setHtml('').hide().removeCls('error');
                    store.add(record);
                    store.sync({
                        success: function (response, options) {
                            Ext.toast('Record created', 1000);
                            me.up('dialog').destroy();
                        },
                    });
                } else {
                    if (filteredStore.getSource().needsSync) {
                        filteredStore
                            .getSource()
                            .getProxy()
                            .setExtraParams({
                                cargo_id: cargo.get('id'),
                            });
                        filteredStore.getSource().sync({
                            success: function (response, options) {
                                me.toggle(false);
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    } else {
                        me.toggle(false);
                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please fill all required fields')
                            .show()
                            .addCls('error');
                    }
                }
            },
        },
    ],
});
