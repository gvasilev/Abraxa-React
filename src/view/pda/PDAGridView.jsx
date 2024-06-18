import './PDAItemsGrid';
import './PDADotsMenu';
import '../portcall/agent/accounts/AgreementsList';

Ext.define('Abraxa.view.pda.PDAGridView', {
    extend: 'Ext.Container',
    xtype: 'pda.items',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    bind: {
        cls: 'a-bgr-white no-shadow',
    },
    itemId: 'pdaGridView',
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
                            handler: function(me) {
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
                                                title: '<div><div class="fw-b">{pda.name}</div><div class="sm-title">{pda.group_id}</div></div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            subObject: 'disbursements',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 16',
                                    ui: 'status-md default',
                                    // ui: 'status default',
                                    bind: {
                                        cls: 'status-{pda.status}',
                                        text: '{pda.status:capitalize}',
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        defaults: {
                                            handler: function(me) {
                                                let selection = me.upVM().get('pda'),
                                                    calculation = me.upVM().get('calculation');

                                                if (selection) {
                                                    selection.set('status', me.value);
                                                }
                                                if (selection.dirty) {
                                                    selection.save({
                                                        success: function() {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'Draft',
                                                value: 'draft',
                                                bind: {
                                                    disabled: '{selectedDisbursement.status == "draft" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Under Review',
                                                value: 'under review',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "under review" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Submitted',
                                                value: 'submitted',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "submitted" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Pending approval',
                                                value: 'pending approval',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "pending approval" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Changes requested',
                                                value: 'changes requested',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "changes requested" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Approved',
                                                value: 'approved',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "approved" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Completed',
                                                value: 'completed',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "completed" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Canceled',
                                                value: 'canceled',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "canceled" ? true : false}',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            hidden: true,
                            margin: '0 0 0 16',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{pda.status}">{pda.status:capitalize}</div>',
                                hidden: '{!nonEditable}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 16',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'progress-light color-default small',
                                    iconCls: 'md-icon-outlined md-icon-info',
                                    cls: 'a-has-counter x-has-menu',
                                    hidden: true,
                                    bind: {
                                        hidden: '{pdaAgreements.count ? false : true}',
                                        text: 'Agreements <em>{pdaAgreements.count}</em>',
                                    },
                                    menu: {
                                        minWidth: '340',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                bind: {
                                                    html: 'Agreements',
                                                },
                                            },
                                            {
                                                xtype: 'agreements.list',
                                                bind: {
                                                    store: '{pdaAgreements}',
                                                },
                                            },
                                        ],
                                    },
                                    listeners: {
                                        tap: function() {
                                            mixpanel.track('Agreements (disb screen) - button');
                                        },
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
            padding: '0 16 0 24',
            minHeight: 64,
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action small',
                            testId: 'addItemButtonPdaGridView',
                            iconCls: 'md-icon-add',
                            text: 'Item',
                            bind: {
                                disabled: '{(pda.status !="draft" || nonEditable) || isSyncingPdaGrid}',
                            },
                            handler: function(me) {
                                let store = me.upVM().get('services'),
                                    object_record = me.upVM().get('object_record'),
                                    pda = me.upVM().get('pda'),
                                    record = Ext.create('Abraxa.model.inquiry.InquiryOfferService', {
                                        inquiry_offer_id: pda.get('id'),
                                        value: 0,
                                        currency: pda.get('currency'),
                                        custom_amount: 0,
                                        exchange_rate: pda.get('exchange_rate'),
                                    });

                                store.add(record);
                                me.upVM().set('isSyncingPdaGrid', true);
                                store.sync({
                                    success: function(rec) {
                                        Ext.toast('Record updated');
                                        Abraxa.utils.Functions.updateInquiry(object_record);
                                        me.upVM().set('isSyncingPdaGrid', false);
                                    },
                                });
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'pda.dots.menu',
                            testId: 'pdaGridViewDotsMenu',
                            subObject: 'disbursements',
                            // ui: 'tool-text-sm round',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'pda.items.grid',
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
                    xtype: 'div',
                    bind: {
                        html: '<div class="h5">Total disbursement costs</div><div class="a-billed-price"><span class="a-billed-currency">{pda.currency}</span><span class="a-billed-amount">{totalDisbursementCostsManual:number("0,000.00")}</span><i class="md-icon-outlined">info</i></div>',
                    },
                },
                {
                    flex: 1,
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action large',
                            text: 'Preview',
                            testId: 'previewButtonPdaGridView',
                            cls: 'no_show',
                            bind: {
                                disabled: '{isSyncingPdaGrid}',
                            },
                            handler: function(me) {
                                me.upVM().set('isSyncingPdaGrid', true);
                                const pdaItems = me.up('pda\\.items');
                                let pda = me.upVM().get('pda');
                                let vm = me.upVM();
                                let model = Ext.create('Abraxa.model.portcall.Attachment', {
                                        name: pda.get('name'),
                                        pdf: true,
                                        id: 1001,
                                        extension: 'pdf',
                                        folder_file: null,
                                        nonEditable: true,
                                        is_locked: true,
                                        document: {
                                            extension: 'pdf',
                                            folder_file: null,
                                            name: pda.get('name'),
                                        },
                                    }),
                                    dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                        viewModel: {
                                            data: {
                                                documentForSelect: model,
                                                selectedDocuments: Ext.create('Ext.data.Store', {
                                                    data: [model],
                                                }),
                                                needsPanel: false,
                                                object_record: vm.get('object_record'),
                                                isReadOnly: true,
                                                previewOnly: true,
                                            },
                                            formulas: {
                                                selectedDocument: {
                                                    bind: {
                                                        bindTo: '{documentsList.selection}',
                                                    },
                                                    get: function(record) {
                                                        return record;
                                                    },
                                                },
                                                loadDocument: {
                                                    bind: {
                                                        bindTo: '{selectedDocument.id}',
                                                        // deep: true
                                                    },
                                                    get: function(id) {
                                                        let record = this.get('selectedDocument');
                                                        if (record) {
                                                            // Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(true);
                                                            var me = this;
                                                            let file = record,
                                                                pdf = record.get('pdf') ? true : false;

                                                            me.getView()
                                                                .getController()
                                                                .loadDocument(
                                                                    Env.ApiEndpoint +
                                                                    'pdf/generate/' +
                                                                    pda.get('id') +
                                                                    '/inquiryOffer',
                                                                );
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    });

                                dialog.on('destroy', (dialog) => {
                                    const pdaGridView = Ext.ComponentQuery.query('#pdaGridView')[0];
                                    const vm = pdaGridView ? pdaGridView.upVM() : null;
                                    if (vm) {
                                        vm.set({
                                            isSyncingPdaGrid: false,
                                        });
                                    }
                                });

                                dialog.show();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
