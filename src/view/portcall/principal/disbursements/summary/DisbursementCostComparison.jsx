Ext.define('Abraxa.view.portcall.principal.disbursements.summary.DisbursementCostComparison', {
    extend: 'Ext.Container',
    xtype: 'DisbursementCostComparison',
    flex: 1,
    padding: '8 24 16',
    margin: '0 0 0 16',
    cls: 'border-radius bordered',
    items: [
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    defaults: {
                        xtype: 'container',
                        cls: 'a-display-item',
                        padding: '4 0',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        defaults: {
                            //every container have also defaults
                            xtype: 'div',
                        },
                    },
                    items: [
                        {
                            docked: 'top',
                            margin: '0 0 6',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'text-uppercase fw-b',
                                    html: 'Cost comparison',
                                },
                                {
                                    bind: {
                                        html: '<span>{disbursementTotalVariance}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            hidden: true,
                            bind: {
                                hidden: '{selectedDisbursement.type != "pda" ? (selectedDisbursement.pda_id ? false : true) : (selectedDisbursement.type == "pda" ? false : true)}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'sm-title mb-4',
                                            html: 'PDA price',
                                        },
                                        {
                                            xtype: 'progressbarwidget',
                                            flex: 1,
                                            height: 8,
                                            bind: {
                                                cls: 'a-disbursements-progress {selectedDisbursement.type === "pda" ? "current" : ""}',
                                                value: '{pdaPriceProgressBar}',
                                            },
                                            // html: 'PDA price',
                                            // textTpl: '{percent}%',
                                        },
                                    ],
                                },
                                {
                                    cls: 'a-display-value fw-b text-right',
                                    bind: {
                                        html: '<span class="fw-n c-grey mr-6">{selectedDisbursement.disbursement_currency}</span>{selectedDisbursement.pda_final_price:number("0,000.00")}',
                                    },
                                },
                            ],
                        },
                        {
                            hidden: true,
                            bind: {
                                hidden: '{selectedDisbursement.type != "dda" ? (selectedDisbursement.dda_id ? false : true) : (selectedDisbursement.type == "dda" ? false : true)}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'sm-title mb-4',
                                            html: 'DDA price',
                                        },
                                        {
                                            xtype: 'progressbarwidget',
                                            flex: 1,
                                            height: 8,
                                            bind: {
                                                cls: 'a-disbursements-progress {selectedDisbursement.type === "dda" ? "current" : ""}',
                                                value: '{ddaPriceProgressBar}',
                                            },
                                            // html: 'PDA price',
                                            // textTpl: '{percent}%',
                                        },
                                    ],
                                },
                                {
                                    cls: 'a-display-value fw-b text-right',
                                    bind: {
                                        html: '<span class="fw-n c-grey mr-6">{selectedDisbursement.disbursement_currency}</span>{selectedDisbursement.dda_final_price:number("0,000.00")}',
                                    },
                                },
                            ],
                        },
                        {
                            hidden: true,
                            bind: {
                                hidden: '{selectedDisbursement.type != "fda" ? (selectedDisbursement.fda_id ? false : true) : (selectedDisbursement.type == "fda" ? false : true)}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'sm-title mb-4',
                                            html: 'FDA price',
                                        },
                                        {
                                            xtype: 'progressbarwidget',
                                            flex: 1,
                                            height: 8,
                                            bind: {
                                                cls: 'a-disbursements-progress {selectedDisbursement.type === "fda" ? "current" : ""}',
                                                value: '{fdaPriceProgressBar}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    cls: 'a-display-value fw-b text-right',
                                    bind: {
                                        html: '<span class="fw-n c-grey mr-6">{selectedDisbursement.disbursement_currency}</span>{selectedDisbursement.fda_final_price:number("0,000.00")}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
