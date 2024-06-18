import './DisbursementControllerPrincipal';
import './DisbursementsMenuList';
import './services/DisbursementServicesRightPanel';
import './summary/DisbursementSummaryData';
import './summary/DisbursementCostComparison';
import './paymentdetails/DisbursementPaymentDetails';
import './approvals/DisbursementApprovals';

Ext.define('Abraxa.view.portcall.principal.disbursements.DisbursementDetails', {
    extend: 'Ext.Container',
    xtype: 'DisbursementDetails',
    reference: 'disbursementDetailsView',
    publishes: ['record'],
    controller: 'DisbursementControllerPrincipal',
    items: [
        {
            xtype: 'container',
            cls: 'a-disbursements-inner-container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-main-titlebar',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    shadow: false,
                    margin: '0 32 0 24',
                    padding: 0,
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-main-title hbox',
                            bind: {
                                html: '<h1 class="a-link a_billing_party_link cursor-pointer mr-8">{selectedDisbursement.organization_name}</h1><i class="md-icon-outlined md-icon-arrow-right mr-8">chevron_right</i>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: '.a_billing_party_link',
                                    fn: function fn() {
                                        const me = this.component;

                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo(
                                                'portcall/' +
                                                    me
                                                        .up('DisbursementDetails')
                                                        .upVM()
                                                        .get('selectedDisbursement')
                                                        .get('portcall_id') +
                                                    '/disbursements'
                                            );
                                        me.upVM().set({ selectedDisbursement: false });
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-main-title has-dropdown hbox cursor-pointer',
                            bind: {
                                html: '<h1>{selectedDisbursement.name}</h1>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let menu = this.component.up().down('DisbursementsMenuList');
                                        menu.showBy(this);
                                    },
                                },
                            },
                        },
                        {
                            //inline menu in order to pubish the selection
                            xtype: 'DisbursementsMenuList',
                        },
                        {
                            flex: 1,
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-card-container',
                    items: [
                        {
                            xtype: 'DisbursementServicesRightPanel',
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar a-bb-100',
                                    minHeight: 64,
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>Summary</span>',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    ui: 'blue-light color-default small',
                                                    iconCls: 'md-icon-outlined md-icon-file-copy',
                                                    cls: 'a-has-counter',
                                                    bind: {
                                                        text: 'Invoices <em>{disbursementInvoices.count}</em>',
                                                    },
                                                    handler: 'showInvoiceDialog',
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-disbursement-summary-container',
                            padding: 24,
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'DisbursementSummaryData',
                                    flex: 3.5,
                                },
                                {
                                    flex: 2,
                                    xtype: 'DisbursementCostComparison',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-bt-100',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar a-bb-100',
                                    minHeight: 64,
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>Disbursement costs</span>',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'center',
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    ui: 'small',
                                                    margin: '0 8 0 0',
                                                    text: 'Group by',
                                                    iconCls: 'md-icon-outlined md-icon-view-agenda',
                                                    enableToggle: true,
                                                    hidden: true,
                                                    bind: {
                                                        ui: 'small {disbursementItemsGrid.grouped ? "normal-light" : ""}',
                                                        hidden: '{disbursementServicesStore.count ? false : true}',
                                                    },
                                                    menu: [
                                                        {
                                                            xtype: 'menucheckitem',
                                                            text: 'Cost center',
                                                            bind: {
                                                                checked: '{disbursementItemsGrid.grouped}',
                                                            },
                                                            handler: function (me) {
                                                                me.up('DisbursementDetails')
                                                                    .down('DisbursementServicesGrid')
                                                                    .toggleGrouped();

                                                                me.up('menu').hide();
                                                            },
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'DisbursementServicesGrid',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    minHeight: 64,
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>Payment details</span>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'DisbursementPaymentDetails',
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-approvals-container a-card-container',
                    items: {
                        xtype: 'DisbursementApprovals',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'bottom',
            cls: 'a-disbursements-footer a-total-billed-docked',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    bind: {
                        html: '<div class="h5">Total disbursement costs</div><div class="a-billed-price"><span class="a-billed-currency">{selectedDisbursement.disbursement_currency}</span><span class="a-billed-amount">{selectedDisbursement.total_costs:number("0,000.00")}</span></div>',
                    },
                    flex: 1,
                },
                {
                    xtype: 'container',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'end',
                            },
                            hidden: true,
                            bind: {
                                hidden: '{disbursementApproval.status == "pending" && disbursementApproval.current_approval_data.can_approve ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 12',
                                    ui: 'premium',
                                    text: 'Request changes',
                                    iconCls: 'md-icon md-icon-published-with-changes',
                                    cls: 'no_show',
                                    handler: function () {
                                        let dialog = Ext.create(
                                            'Abraxa.view.portcall.principal.disbursements.approvals.DisbursementRejectDialog',
                                            {
                                                viewModel: {
                                                    data: {
                                                        disbursementRecord: this.upVM().get('selectedDisbursement'),
                                                        approvalRecord: this.upVM().get('disbursementApproval'),
                                                    },
                                                },
                                            }
                                        );

                                        mixpanel.track('Reject (disb screen) - button');
                                        dialog.show();
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'completed',
                                    text: 'Approve',
                                    iconCls: 'md-icon md-icon-check-circle',
                                    cls: 'no_show',
                                    handler: function () {
                                        mixpanel.track('Approve (disb screen) - button');
                                        let dialog = Ext.create(
                                            'Abraxa.view.portcall.principal.disbursements.approvals.DisbursementApproveDialog',
                                            {
                                                viewModel: {
                                                    data: {
                                                        disbursementRecord: this.upVM().get('selectedDisbursement'),
                                                        approvalRecord: this.upVM().get('disbursementApproval'),
                                                    },
                                                },
                                            }
                                        );
                                        dialog.show();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    loadRecord: function (id, args) {
        let view = this,
            viewRecord = this.getRecord(),
            disbursement;

        if (viewRecord && viewRecord.get('id') == id) {
            return;
        }
        disbursement = Ext.create('Abraxa.model.disbursement.Disbursement', {
            id: id,
        });
        disbursement.load({
            scope: this,
            success: function (record, operation) {
                let disbursementViewModel = this.find('disbursementsMainPrincipal').getViewModel();

                disbursementViewModel.set('selectedBillingParty', record.getAccount());
                this.setRecord(record);
            },
            failure: function (record, operation) {
                Ext.Msg.alert('Error', 'Could not load disbursement');
            },
            callback: function (record, operation) {
                view.fireEvent('disbursementLoadEnd', record);
            },
        });
        view.fireEvent('disbursementLoadStart', disbursement);
    },
});
