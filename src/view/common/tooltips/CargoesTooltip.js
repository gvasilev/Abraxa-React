//let companyTooltipTimeout;

Ext.define('Abraxa.view.common.tooltips.CargoesTooltip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'CargoesTooltip',
    // minWidth: 480,
    // minHeight: 200,
    padding: 20,
    cls: 'a-company-tooltip',
    showAnimation: 'pop',
    id: 'cargoesTooltip',
    viewModel: {
        data: {
            cargoes: '',
            record: null,
            clickedElement: null,
            timeOutToHide: 1000,
        },

        formulas: {
            tpl: {
                bind: {
                    bindTo: '{cargoes}',
                },

                get: function (cargoes) {
                    let tooltip_str = '';
                    if (cargoes && cargoes.length > 0) {
                        cargoes.forEach(function (cargo, index) {
                            if (cargo) {
                                let str = '';

                                if (cargo.function) {
                                    switch (cargo.function) {
                                        case 'Loading':
                                            str = 'L';
                                            break;
                                        case 'Discharging':
                                            str = 'D';
                                            break;
                                        case 'Transshipment':
                                            str = 'TS';
                                            break;
                                        case 'Lightering':
                                            str = 'LT';
                                            break;

                                        default:
                                            break;
                                    }
                                }

                                if (cargoes.length > 1) {
                                    const commodity = cargo.id
                                        ? '</span><span id="' +
                                          cargo.id +
                                          '" class="a-commodity a-link">' +
                                          (cargo.commodity || AbraxaConstants.placeholders.emptyValue) +
                                          '</span>'
                                        : '</span><span class="a-commodity">' +
                                          (cargo.commodity || AbraxaConstants.placeholders.emptyValue) +
                                          '</span>';

                                    tooltip_str +=
                                        '<div class="a-cargo-item"><div class="a-cargo-title"><span class="a-qty">' +
                                        (cargo.quantity
                                            ? Ext.util.Format.number(cargo.quantity, '0,000.000')
                                            : AbraxaConstants.placeholders.emptyValue) +
                                        ' ' +
                                        cargo.unit +
                                        '</span>' +
                                        commodity +
                                        '<span class="a-function a-function-sm function-' +
                                        cargo.function +
                                        '"  data-qtip="' +
                                        cargo.function +
                                        '"data-qalign="bc-tc" data-qanchor="true">' +
                                        str +
                                        '</span></div></div>';
                                }
                            }
                        });

                        return tooltip_str;
                    } else {
                        return AbraxaConstants.placeholders.emptySpan;
                    }
                },
            },
        },
    },

    bind: {
        data: '{cargoes}',
        html: '{tpl}',
    },
    listeners: {
        click: {
            element: 'element',
            delegate: 'span.a-link',
            fn: function (element, htmlEl, c) {
                Ext.ComponentQuery.query('CargoesTooltip')[0].hide();
                const recordId = +htmlEl.id;
                if (recordId) {
                    Abraxa.Global.showCommodityDialog(recordId);
                }
            },
        },
    },
    anchorToTarget: true,

    // tpl: ['tpl'],
    // bbar: {
    //     items: [
    //         '->',
    //         {
    //             xtype: 'button',
    //             margin: '8 0 8 8',
    //             ui: 'action',
    //             text: 'Close',
    //             handler: function (me) {
    //                 let record = me.upVM().get('record');
    //                 if (record) {
    //                     me.up('[xtype=AgentTooltip]').hide();
    //                     // Ext.getCmp('main-viewport')
    //                     //     .getController()
    //                     //     .redirectTo('company/' + record.org_id);
    //                 }
    //             },
    //         },
    //     ],
    // },
});
