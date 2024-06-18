import '../../store/pda/PdaOfferServices';
import '../../store/common/port/Berths';

Ext.define('Abraxa.view.pda.PDAViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.pda-viewmodel',
    data: {
        isSyncingPdaGrid: false,
        locked_mode: false,
        pda_record: null,
        defaultManualPdaTerminal: null,
        defaultPdaTerminal: null,
    },
    stores: {
        pdaSections: {
            data: [
                {
                    html: '<i class="md-icon-outlined" data-qtip="Estimate details" data-qalign="bc-tc" data-qanchor="true">view_agenda</i><span>Details</span>',
                    tab: 'inquiry',
                    title: 'Estimate details',
                    slug: 'inquiry',
                    subObject: 'inquiry',
                },
                {
                    html: '<i class="md-icon-outlined" data-qtip="Vessel" data-qalign="bc-tc" data-qanchor="true">directions_boat</i><span>Vessel</span>',
                    tab: 'vessel',
                    title: 'Vessel details',
                    slug: 'vessel',
                    subObject: 'vessel',
                },
                {
                    html: '<i class="md-icon-outlined" data-qtip="Terms" data-qalign="bc-tc" data-qanchor="true">description</i><span>Terms</span>',
                    tab: 'terms',
                    title: 'Billing details',
                    slug: 'terms',
                    subObject: 'terms',
                },
                {
                    html: '<i class="md-icon-outlined" data-qtip="Notes" data-qalign="bc-tc" data-qanchor="true">short_text</i><span>Notes</span>',
                    tab: 'notes',
                    title: 'Notes',
                    slug: 'notes',
                    subObject: 'notes',
                },
                {
                    html: '<i class="md-icon-outlined" data-qtip="Attachments" data-qalign="bc-tc" data-qanchor="true">attach_file</i><span>Attachments</span>',
                    tab: 'attachments',
                    title: 'Attachments',
                    slug: 'attachments',
                    subObject: 'attachments',
                },
            ],
        },
        calculationServices: {
            type: 'pda.offer.services',
            autoLoad: true,
            proxy: {
                extraParams: {
                    calculation_id: '{calculationId}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function() {
                                if (this.getProxy().getExtraParams().calculation_id) this.load();
                            },
                            this,
                        );
                    }
                }
            },
            listeners: {
                beforesync: function(store) {
                    let object_record = Ext.ComponentQuery.query('[xtype=pda]')[0].getVM().get('object_record');
                    Abraxa.utils.Functions.updateInquiry(object_record);
                },
            },
        },
        services: {
            source: '{pda.services}',
            extraParams: {
                inquiry_id: '{object_record.id}',
                pda_id: '{pda.id}',
            },
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
            listeners: {
                update: function(store) {
                    let object_record = Ext.ComponentQuery.query('[xtype=pda]')[0].getVM().get('object_record');
                    Abraxa.utils.Functions.updateInquiry(object_record);
                },
            },
        },
        offerDataFieldsStore: {
            source: '{calculation.dataFields}',
            id: 'offerDataFieldsStore',
            extraParams: {
                calculation_id: '{calculation.id}',
            },
        },
        defaultExpenseItems: {
            type: 'default-expense-items',
            autoLoad: true,
        },
        terminals: {
            type: 'port.terminals',
            autoLoad: true,
            proxy: {
                extraParams: {
                    port_id: '{pda.port_id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function() {
                                if (this.getProxy().getExtraParams().port_id) this.load();
                            },
                            this,
                        );
                    }
                }
            },
        },
        berths: {
            type: 'port.berths',
            autoLoad: true,
            autoDestroy: false,
            proxy: {
                extraParams: {
                    port_id: '{pda.port_id}',
                },
            },
            remoteFilter: true,
            filters: [
                {
                    property: 'terminal_id',
                    value: '{defaultPdaTerminal.selection.value ? defaultPdaTerminal.selection.value : defaultPdaTerminal.selection.id}',
                    operator: '=',
                },
            ],
        },
        manualBerths: {
            type: 'port.berths',
            autoLoad: false,
            autoDestroy: false,
            proxy: {
                extraParams: {
                    port_id: '{pda.port_id}',
                },
            },
            remoteFilter: true,
            filters: [
                {
                    property: 'terminal_id',
                    value: '{defaultManualPdaTerminal.selection.value ? defaultManualPdaTerminal.selection.value : defaultManualPdaTerminal.selection.id}',
                    operator: '=',
                },
            ],
        },
        pdaAgreements: {
            source: '{agreements}',
            filters: '{agreementsFilter}',
        },
        amails: {
            source: '{object_record.amails}',
            extraParams: {
                object_id: 6,
                object_meta_id: '{object_record.id}',
            },
        },
    },
    formulas: {
        isDocumentReadOnly: function(get) {
            return get('pda.status') !== 'draft';
        },
        totalDisbursementCosts: {
            bind: {
                bindTo: '{calculationServices}',
                deep: true,
            },
            get: function(store) {
                if (store) {
                    let pda = this.get('pda'),
                        total = 0;

                    store.each(function(rec) {
                        if (rec.get('enabled')) total += rec.get('final_price');
                    });
                    total = parseFloat(total).toFixed(2);
                    if (pda.get('total_costs') != total && total > 0) {
                        pda.set('total_costs', total);
                        pda.save();
                    }
                    return total;
                }
            },
        },
        totalDisbursementCostsManual: {
            bind: {
                bindTo: '{services}',
                deep: true,
            },
            get: function(store) {
                if (store) {
                    let pda = this.get('pda'),
                        total = 0;

                    store.each(function(rec) {
                        total += rec.get('final_price');
                    });
                    total = parseFloat(total).toFixed(2);
                    if (pda.get('total_costs') != total && total > 0) {
                        pda.set('total_costs', total);
                        pda.save();
                    }
                    return total;
                }
            },
        },
        doDefaults: {
            bind: {
                bindTo: '{execPdaDefaults}',
                deep: true,
            },
            get: function(rec) {
                if (rec) {
                    return rec;
                }
            },
        },
        pda: {
            bind: {
                bindTo: '{doDefaults}',
            },
            get: function(doDefaults) {
                let id = this.get('pda_id');
                if (id) {
                    if (this.get('routeHash') == '#pda') {
                        let record = new Abraxa.model.inquiry.InquiryOffer({
                            id: id,
                        });
                        record.getProxy().setExtraParams({
                            inquiry_id: this.get('inquiry_id'),
                        });
                        record.load({
                            success: function(rec) {
                                if (
                                    Ext.ComponentQuery.query('[cls=pda_menu]')[0] &&
                                    Ext.ComponentQuery.query('[cls=pda_menu]')[0].getStore() &&
                                    Ext.ComponentQuery.query('[cls=pda_menu]')[0].getStore().count()
                                ) {
                                    Ext.ComponentQuery.query('[cls=pda_menu]')[0].select(0);
                                }
                                if (rec.getInquiry()) {
                                    Ext.getCmp('main-viewport').getVM().set('object_record', rec.getInquiry());
                                }
                                Ext.getCmp('main-viewport').setMasked(false);
                            },
                            // failure: function (batch, operation) {
                            //     Ext.getCmp('main-viewport').getController().redirectTo('404');
                            // },
                        });
                        return record;
                    }
                }
            },
        },
        calculation: {
            bind: {
                bindTo: '{pda.pc_calculation.id}',
                deep: true,
            },
            get: function(calculation) {
                return this.get('pda.pc_calculation');
            },
        },
        setCalculationId: {
            bind: {
                bindTo: '{calculation.id}',
                deep: true,
            },
            get: function(id) {
                if (id) {
                    this.set('calculationId', id);
                }
            },
        },
        buildOfferDataFields: {
            bind: {
                bindTo: '{calculation}',
            },
            get: function(calculation) {
                if (calculation) {
                    let VM = this;
                    let controller = VM.getView().getController();
                    controller.buildOfferDataFields(calculation, VM);
                }
            },
        },
        showView: {
            bind: {
                bindTo: '{pda.status}',
            },
            get: function(status) {
                let pda = this.get('pda');
                if (!pda.get('template_id')) {
                    return [
                        {
                            xtype: 'pda.items',
                            flex: 1,
                        },
                    ];
                }
                if (status == 'draft' && pda.get('template_id')) {
                    return [
                        {
                            xtype: 'pda.calculation.items',
                            flex: 1,
                        },
                    ];
                }
                return [
                    {
                        xtype: 'pda.calculation.items',
                        flex: 1,
                    },
                ];
            },
        },
        isCalculation: {
            bind: {
                bindTo: '{pda.template_id}',
            },
            get: function(calculation) {
                return calculation ? true : false;
            },
        },
        vessel: {
            bind: {
                bindTo: '{pda}',
            },
            get: function(pda) {
                if (pda && pda.getVessel()) {
                    return pda.getVessel();
                }
            },
        },
        vesselTitle: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function(vessel) {
                if (vessel) {
                    let flag = null;
                    if (vessel && vessel.get('flags') && vessel.get('flags').country_code) {
                        flag =
                            'src="' +
                            AbraxaConstants.urls.staticAbraxa +
                            'flags/1x1/' +
                            vessel.get('flags').country_code.toLocaleLowerCase() +
                            '.svg"';
                    }
                    return (
                        '<img height=24" ' +
                        flag +
                        '  title="" alt=""/><div><a href="javascript:void(0);" class="vessel-name vessel">' +
                        vessel.get('name') +
                        '</a><div class="vessel-imo">IMO: ' +
                        vessel.get('imo') +
                        '</div></div>'
                    );
                }
            },
        },
        vessel_data: {
            bind: {
                bindTo: '{pda}',
            },
            get: function(record) {
                if (record) {
                    if (record.get('template_id') && record.getPc_calculation()) {
                        return Object.assign({}, record.getPc_calculation().get('vessel_params'));
                    } else {
                        return Object.assign({}, record.get('vessel_data'));
                    }
                }
            },
        },
        portTitle: {
            bind: {
                bindTo: '{pda.port}',
                deep: true,
            },
            get: function(port) {
                if (port) {
                    return (
                        // '<img height=24" ' +
                        // flag +
                        // '  title="" alt=""/>' +
                        '<div class="a-badge a-badge-anchor mr-16"><i class="md-icon-outlined">anchor</i></div><div><a data-portid="' +
                        port.id +
                        '" href="javascript:void(0);" class="a-port-link vessel-name vessel">' +
                        port.name +
                        '</a><div class="vessel-imo">CODE: ' +
                        port.code +
                        '</div></div>'
                    );
                }
            },
        },
        showExchangeRateColumn: {
            bind: {
                bindTo: '{pda}',
                deep: true,
            },
            get: function(pda) {
                if (pda && pda.get('port').pc_configuration) {
                    return pda.get('currency') === pda.get('port').pc_configuration.currency;
                }
            },
        },
        showCalculatedPriceColumn: {
            bind: {
                bindTo: '{pda}',
                deep: true,
            },
            get: function(pda) {
                if (pda && (pda.get('show_vat') || pda.get('show_discount'))) {
                    return true;
                }
                return false;
            },
        },
        currencyData: {
            bind: {
                bindTo: '{pda}',
                deep: true,
            },
            get: function(pda) {
                if (pda && pda.get('port').pc_configuration) {
                    return {
                        offer_currency: pda.get('currency'),
                        port_currency: pda.get('port').pc_configuration.currency,
                        exchange_rate: pda.get('exchange_rate'),
                    };
                }
                return false;
            },
        },
        agreementsFilter: {
            bind: {
                bindTo: '{pda}',
            },
            get: function(pda) {
                if (pda) {
                    let store = this.get('pdaAgreements'),
                        inquiry = pda.getInquiry(),
                        port_id = pda.get('port_id'),
                        port_function = inquiry.get('port_function'),
                        total_billed_converted = pda.get('total_costs');

                    if (store) store.clearFilter();

                    return function(rec) {
                        if (rec.get('organization_org_id') == inquiry.get('requesting_party_id')) {
                            let agreementable = rec.get('agreementable'),
                                port_array = agreementable ? agreementable.port_ids : null,
                                sholdReturn = true;

                            if (agreementable && agreementable.active) {
                                if (port_array) {
                                    if (port_array.includes(port_id)) {
                                        if (agreementable.port_function) {
                                            if (agreementable.port_function == port_function) {
                                                sholdReturn = true;
                                                if (agreementable.payment_term_id) {
                                                    if (
                                                        eval(
                                                            total_billed_converted.toString() +
                                                            ' ' +
                                                            agreementable.threshold_operator +
                                                            ' ' +
                                                            agreementable.threshold_amount,
                                                        )
                                                    ) {
                                                        sholdReturn = true;
                                                    } else {
                                                        sholdReturn = false;
                                                    }
                                                }
                                            } else {
                                                sholdReturn = false;
                                            }
                                        } else {
                                            sholdReturn = true;
                                            if (agreementable.payment_term_id) {
                                                if (
                                                    eval(
                                                        total_billed_converted.toString() +
                                                        ' ' +
                                                        agreementable.threshold_operator +
                                                        ' ' +
                                                        agreementable.threshold_amount,
                                                    )
                                                ) {
                                                    sholdReturn = true;
                                                } else {
                                                    sholdReturn = false;
                                                }
                                            }
                                        }
                                    } else {
                                        sholdReturn = false;
                                    }
                                } else {
                                    if (agreementable.payment_term_id) {
                                        if (
                                            eval(
                                                total_billed_converted.toString() +
                                                ' ' +
                                                agreementable.threshold_operator +
                                                ' ' +
                                                agreementable.threshold_amount,
                                            )
                                        ) {
                                            sholdReturn = true;
                                        } else {
                                            sholdReturn = false;
                                        }
                                    }
                                }
                            } else {
                                sholdReturn = false;
                            }
                            return sholdReturn;
                        }
                    };
                } else {
                    return function(item) {
                        return false;
                    };
                }
            },
        },
        setAmailsUrl: {
            bind: {
                bindTo: '{amails}',
            },
            get: function(store) {
                if (store) {
                    store.getProxy().setUrl(Env.ApiEndpoint + 'inquiry/${object_meta_id}/amails');
                }
            },
        },
        nonEditable: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function(record) {
                if (record && this.get('currentUser')) {
                    if (
                        record.get('company_id') != this.get('currentUser').get('current_company_id') ||
                        record.get('is_archived') ||
                        record.get('parent_id')
                    )
                        return true;

                    return false;
                }
            },
        },
    },
});
