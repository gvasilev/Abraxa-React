Ext.define('Abraxa.view.pda.PDAGridViewReadOnly', {
    extend: 'Ext.Container',
    xtype: 'pda.items.preview',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    bind: {
        cls: 'a-bgr-white no-shadow',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function (me) {
                                Ext.getCmp('main-viewport')
                                    .getController()
                                    .redirectTo('inquiry/' + me.upVM().get('object_record').get('id'));
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-title',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    margin: '0 12 0 0',
                                    bind: {
                                        html: '<span class="file-icon-badge file-icon-x32" data-type="pda" data-icon="money"></span>',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<div><div class="fw-b">{pda.name}</div><div class="sm-title">{pda.group_id} PREVIEW ONLY</div></div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 16',
                            // hidden: true,
                            bind: {
                                html: '<div class="a-status-badge a-status-md status-{pda.status_string}">{pda.status_string:capitalize}</div>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '8 16 8 24',
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-send',
                            text: 'Send via Email',

                            handler: function () {
                                mixpanel.track('Request approval (disb screen) - button');
                                Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            selectedRecords: [this.upVM().get('disbursementsGrid.selection')],
                                            approvalMembers: this.upVM().get('disbursementSectionMembers'),
                                        },
                                    },
                                }).show();
                                mixpanel.track('Request approval button clicked (Disbursement)');
                            },
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 8',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                            text: 'Preview',
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-add',
                            text: 'Download',
                            margin: '0 0 0 8',

                            menu: {
                                defaults: {
                                    handler: function (me) {},
                                },
                                items: [
                                    {
                                        text: 'Download as PDF',
                                        docType: 8,
                                    },
                                    {
                                        text: 'Download as Excel',
                                        docType: 9,
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'pda.dots.menu',
                            subObject: 'disbursements',
                            ui: 'tool-text-sm round',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'pda.items.read.only.grid',
        },
        {
            xtype: 'container',
            // docked: 'bottom',
            cls: 'a-total-billed-docked',
            padding: '8 24',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    bind: {
                        html: '<div class="h5">Total billed</div><div class="a-billed-price"><span class="a-billed-currency">{selectedDisbursement.disbursement_currency}</span><span class="a-billed-amount">{totalFinal:number("0,000.00")}</span><i class="md-icon-outlined">info</i></div>',
                        tooltip: {
                            html:
                                '<div class="a-info-row"><label class="a-info-label">Discount:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-yellow">-{totalDiscount:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">VAT:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalVAT:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">Final price:</label><div class="a-info-data a-bt-100 pt-8"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-700 fs-16 c-blue">{totalFinal:number("0,000.00")}</b></div></div>',
                            align: 'bc-tc?',
                            cls: 'a-tooltip-balance',
                            ui: 'info-card',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                            anchorToTarget: true,
                        },
                    },
                },
                {
                    flex: 1,
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'confirm alt',
                                    text: 'Edit',
                                    cls: 'no_show',
                                    handler: function () {},
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
