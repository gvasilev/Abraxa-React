Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaVessel', {
    extend: 'Ext.Container',
    xtype: 'proforma.vessel',
    hidden: true,
    flex: 1,
    bind: {
        hidden: '{inquiryMenu.selection.tab == "vessel" ? false : true}',
    },
    layout: 'hbox',
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 64,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: 'Vessel details',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            defaults: {
                // listeners: {
                //     focusleave: function () {
                //         let record = this.upVM().get('pda_record'),
                //             vessel_data = this.upVM().get('vessel_data');
                //         record.set('vessel', vessel_data.getData());
                //         record.save({
                //             success: function () {
                //                 Ext.toast('Record updated', 1000);
                //             }
                //         });
                //     }
                // },
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-vessel-title a-bb-100',
                    height: 64,
                    bind: {
                        html: '{vesselTitle}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a.vessel',
                            fn: function () {
                                let imo,
                                    record = this.component.upVM().get('voyage');
                                if (record.get('vessel')) {
                                    imo = record.get('vessel').id;
                                }
                                if (record.get('custom_vessel_id')) {
                                    if (record.get('custom_vessel').company_id) {
                                        imo = record.get('custom_vessel').id;
                                    }
                                }
                                if (record.get('vessel') && record.get('vessel').imo == 5656) {
                                    Ext.create('AbraxaLiveShortVideo').show();
                                    return;
                                }
                                if (imo) {
                                    Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    padding: '16 24',
                    layout: 'vbox',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border classic',
                        cls: 'a-field-icon icon-rounded icon-short',
                        placeholder: '00.00',
                        clearable: false,
                        listeners: {
                            focusleave: function () {
                                let record = this.upVM().get('voyage'),
                                    vessel_data = this.upVM().get('vessel_data');

                                if (!this.getValue()) this.setValue(0);

                                if (JSON.stringify(record.get('vessel_data')) !== JSON.stringify(vessel_data)) {
                                    record.set('vessel_data', vessel_data);
                                    if (record.dirty) {
                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                }
                            },
                        },
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            label: 'DWT',
                            bind: {
                                value: '{vessel_data.dwt}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'GT',
                            bind: {
                                value: '{vessel_data.gt}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'NT',
                            bind: {
                                value: '{vessel_data.nt}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'LOA',
                            bind: {
                                value: '{vessel_data.loa}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'DRAFT',
                            bind: {
                                value: '{vessel_data.draft}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'BEAM',
                            bind: {
                                value: '{vessel_data.beam}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            label: 'LBP',
                            bind: {
                                value: '{vessel_data.lbp}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
