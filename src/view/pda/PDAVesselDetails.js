Ext.define('Abraxa.view.damanager.offer.VesselDetails', {
    extend: 'Abraxa.core.components.Container',
    xtype: 'pda.vessel.details',
    hidden: true,
    cls: 'a-vessel-data ',
    padding: 0,
    //   layout: "hbox",
    flex: 1,
    items: [
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'div',
                    height: 64,
                    cls: 'a-vessel-title a-bb-100',
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
                                if (imo) {
                                    Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'container',
                    padding: 16,
                    layout: 'vbox',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        cls: 'a-field-icon icon-rounded icon-short',
                        placeholder: '00.00',
                        clearable: false,
                        bind: {
                            disabled: '{pda.status !== "draft" || nonEditable}',
                        },
                        listeners: {
                            focusleave: function () {
                                let record = this.upVM().get('pda'),
                                    object_record = this.upVM().get('object_record'),
                                    vessel_data = this.upVM().get('vessel_data');

                                if (!this.getValue()) this.setValue(0);

                                if (record.get('template_id')) {
                                    let calculation = this.upVM().get('calculation');
                                    let calculationServices = this.upVM().get('calculationServices');

                                    vessel_params = calculation.get('vessel_params');
                                    const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

                                    if (!isEqual(vessel_params, vessel_data)) {
                                        calculation.set('vessel_params', vessel_data);
                                        calculation.save({
                                            success: function () {
                                                calculation.load({
                                                    callback: function () {
                                                        calculationServices.reload();
                                                    },
                                                });
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
                                } else {
                                    record.set('vessel_data', vessel_data);
                                    record.save({
                                        success: function () {
                                            Abraxa.utils.Functions.updateInquiry(object_record);
                                            Ext.toast('Record updated', 1000);
                                        },
                                    });
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
                            testId: 'lbpVesselMainDetailsPdaVesselDetails',
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
