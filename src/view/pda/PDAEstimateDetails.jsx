import '../common/combo/Berth';

Ext.define('Abraxa.view.pda.PDAEstimateDetails', {
    extend: 'Ext.Container',
    xtype: 'pda.estimate.details',
    cls: 'a-summary-left-container',
    layout: 'vbox',
    hidden: true,
    items: [
        {
            cls: 'a-portcall-info',
            flex: 1,
            scrollable: true,
            layout: 'vbox',
            items: [
                {
                    xtype: 'div',
                    height: 64,
                    cls: 'a-vessel-title a-bb-100',
                    bind: {
                        html: '{portTitle}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a.a-port-link',
                            fn: function(el) {
                                let portId = el.target.getAttribute('data-portid');
                                if (portId) {
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .showPortDialogById(portId);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    itemId: 'offerDataFieldsContainer',
                    cls: 'a-data-fields-container',
                    padding: '16 24 8',
                    defaults: {
                        ui: 'classic',
                        labelAlign: 'left',
                    },
                    items: [
                        {
                            xtype: 'port.terminals',
                            label: 'Terminal',
                            reference: 'defaultManualPdaTerminal',
                            bind: {
                                store: '{terminals}',
                                value: '{pda.terminal_id}',
                                disabled: '{nonEditable}',
                            },
                            listeners: {
                                select: function(me, selection) {
                                    if (selection) {
                                        let record = me.upVM().get('pda');
                                        record.set('berth_id', null);
                                    }
                                },
                                focusleave: function(me) {
                                    let inquiryOffer = me.upVM().get('pda'),
                                        object_record = me.upVM().get('object_record');

                                    if (inquiryOffer.dirty) {
                                        inquiryOffer.save({
                                            success: function(record, operation) {
                                                Abraxa.utils.Functions.updateInquiry(object_record);
                                                Ext.toast('Record updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },

                        {
                            xtype: 'port.berths',
                            placeholder: 'Enter berth',
                            store: [],
                            floatedPicker: {
                                loadingHeight: null,
                            },
                            bind: {
                                store: '{manualBerths}',
                                value: '{pda.berth_id}',
                                inputValue: '{pda.berth_name}',
                                disabled: '{nonEditable}',
                            },
                            listeners: {
                                focusleave: function(me) {
                                    let inquiryOffer = me.upVM().get('pda'),
                                        object_record = me.upVM().get('object_record');

                                    if (inquiryOffer.dirty) {
                                        inquiryOffer.save({
                                            success: function(record, operation) {
                                                Abraxa.utils.Functions.updateInquiry(object_record);
                                                Ext.toast('Record updated');
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'divider-offset offset-x24',
                            html: '<hr>',
                        },
                        {
                            xtype: 'container',
                            cls: 'a-portcall-info',
                            items: [
                                {
                                    xtype: 'list',
                                    cls: 'a-cargo-data a-dataview-cargos',
                                    deselectable: false,
                                    inline: true,
                                    html: '<div class="fw-b my-8 hbox"><div class="a-badge a-badge-cargo mr-12"><i></i></div>Cargoes</div>',
                                    store: [],
                                    bind: {
                                        hidden: '{object_record.cargoes.count ? false:true}',
                                        store: '{object_record.cargoes}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                recordIndex: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function(record) {
                                                        if (record) {
                                                            let store = record.store;
                                                            return store.indexOf(record);
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                        xtype: 'container',
                                        cls: 'a-cargo-container',
                                        margin: '0 0 0 46',
                                        items: [
                                            {
                                                xtype: 'container',
                                                cls: 'a-cargo-titlebar',
                                                padding: 0,
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        cls: 'hbox',
                                                        bind: {
                                                            html: '<div><div class="a-cargo-title"><span class="a-qty">{record.quantity} {record.unit}</span><span class="a-commodity">{record.commodity}</span></div><div class="a-cargo-subtitle">#Cargo {(recordIndex +1)}</div></div>',
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'my-8',
                    html: '<hr>',
                },
            ],
        },
    ],
});
