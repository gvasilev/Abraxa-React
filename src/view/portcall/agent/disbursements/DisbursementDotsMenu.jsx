import './DisbursementsUploadController';

Ext.define('Abraxa.view.portcall.disbursements.DisbursementDotsMenu', {
    extend: 'Ext.Button',
    xtype: 'disbursement.menu',
    text: 'More actions',
    iconAlign: 'right',
    iconCls: 'md-icon-expand-more',
    ui: 'small',
    cls: 'x-has-menu',
    margin: '0 0 0 8',
    controller: 'disbursements.uploadcontroller',
    arrow: false,
    menu: {
        ui: 'medium has-icons',
        items: [
            {
                xtype: 'menucheckitem',
                text: 'Show in groups',
                iconCls: 'md-icon-outlined md-icon-segment',
                hideOnClick: false,
                slug: 'portcallDisbursementShowInGroups',
                bind: {
                    checked: '{selectedDisbursement.grouped ? true : false}',
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let grid = this.find('disbursementItemsGrid'),
                        grouped = grid.getGrouped();

                    let selectedDisbursement = me.upVM().get('selectedDisbursement');

                    selectedDisbursement.set('grouped', !grouped);
                    grid.setGrouped(!grouped);
                    selectedDisbursement.save();
                },
            },
            {
                text: 'Display',
                // slug: 'portcallDisbursementColumns',
                bind: {
                    // hidden: '{nonEditable}',
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-outlined md-icon-visibility',
                menu: [
                    {
                        xtype: 'menucheckitem',
                        text: 'My accounting code',
                        iconCls: 'md-icon-outlined md-icon-numbers',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayAccountingCode',
                        hidableLabel: 'show_accounting',
                        bind: {
                            checked: '{selectedDisbursement.data.show_accounting ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'My cost center',
                        iconCls: 'md-icon-outlined md-icon-numbers',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayAccountingCode',
                        hidableLabel: 'show_my_cost_center',
                        bind: {
                            checked: '{selectedDisbursement.data.show_my_cost_center ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Quantity',
                        iconCls: 'md-icon-outlined md-icon-short-text',
                        hidableLabel: 'show_quantity',
                        hideOnClick: false,
                        bind: {
                            checked: '{selectedDisbursement.show_quantity ? true : false}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Vendor',
                        iconCls: 'md-icon-outlined md-icon-business-center',
                        hideOnClick: false,
                        hidableLabel: 'show_vendor',
                        bind: {
                            checked: '{selectedDisbursement.data.show_vendor ? true : false}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Variance',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayVariance',
                        iconCls: 'md-icon-outlined md-icon-trending-up',
                        hidableLabel: 'show_variance',
                        bind: {
                            checked: '{selectedDisbursement.data.show_variance ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Voucher No',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayVariance',
                        hidableLabel: 'show_voucher',
                        iconCls: 'md-icon-outlined md-icon-file-copy',
                        bind: {
                            checked: '{selectedDisbursement.data.show_voucher ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Variance comments',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayVariance',
                        iconCls: 'md-icon-outlined md-icon-mode-comment',
                        hidableLabel: 'show_variance_comment',
                        bind: {
                            checked: '{selectedDisbursement.data.show_variance_comment ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Customer code',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayVariance',
                        hidableLabel: 'show_account_number',
                        iconCls: 'md-icon-outlined md-icon-format-list-numbered',
                        bind: {
                            checked: '{selectedDisbursement.data.show_account_number ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Customer cost center',
                        hideOnClick: false,
                        slug: 'portcallDisbursementDisplayVariance',
                        hidableLabel: 'show_customer_cost_center',
                        iconCls: 'md-icon-outlined md-icon-database',
                        bind: {
                            checked: '{selectedDisbursement.data.show_customer_cost_center ? true : false}',
                            permission: '{userPermissions}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                ],
            },
            {
                text: 'Adjustment',
                bind: {
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-outlined md-icon-price-check',
                menu: [
                    {
                        xtype: 'menucheckitem',
                        text: 'TAX',
                        iconCls: 'md-icon-outlined md-icon-price-check',
                        hideOnClick: false,
                        slug: 'portcallDisbursementAdjustmentVAT',
                        hidableLabel: 'show_vat',
                        bind: {
                            checked: '{selectedDisbursement.data.show_vat ? true : false}',
                            permission: '{userPermissions}',
                            disabled: '{selectedDisbursement.status != "draft"}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                    {
                        xtype: 'menucheckitem',
                        text: 'Discount',
                        hideOnClick: false,
                        slug: 'portcallDisbursementAdjustmentDiscount',
                        hidableLabel: 'show_discount',
                        iconCls: 'md-icon-outlined md-icon-percent',
                        bind: {
                            checked: '{selectedDisbursement.data.show_discount ? true : false}',
                            permission: '{userPermissions}',
                            disabled: '{selectedDisbursement.status != "draft"}',
                        },
                        handler: 'hideDisbursementColumn',
                    },
                ],
            },
            {
                text: 'Template',
                slug: 'templateSave',
                bind: {
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-playlist-add-check md-icon-outlined',
                menu: [
                    {
                        text: 'Save as template',
                        iconCls: 'md-icon-playlist-add-check md-icon-outlined',
                        slug: 'settings',
                        subObject: 'disbursements',
                        bind: {
                            hidden: '{nonEditable}',
                            html: '{(currentUserPlan === "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                            permission: '{userPermissions}',
                            objectPermission: '{objectPermissions}',
                        },
                        handler: function (me) {
                            let vm = me.upVM(),
                                currentUserPlan = vm.get('currentUserPlan');
                            if (currentUserPlan === 'starter') {
                                Ext.create('Abraxa.view.main.UpgradeDialog').show();
                            } else {
                                mixpanel.track('Disbursements - Save as template');
                                Ext.create('Abraxa.view.portcall.disbursements.CreateDisbursementTemplate', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            template: Ext.create('Abraxa.model.template.Template', {
                                                type: 'disbursement',
                                            }),
                                            items: vm.get('disbursementItems'),
                                        },
                                    },
                                }).show();
                            }
                        },
                    },
                ],
            },
            {
                text: 'Export',
                slug: 'portcallDisbursementColumns',
                bind: {
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
            },
            {
                text: 'Export to excel',
                bind: {
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-outlined md-icon-difference',
                handler: function (me) {
                    let grid = this.find('disbursementItemsGrid');
                    let disbursement = grid.upVM().get('selectedDisbursement');
                    grid.saveDocumentAs({
                        type: 'xlsx',
                        title: disbursement.getData().name,
                        includeSummary: true, // Add this line to include the summary row
                        fileName: disbursement.getData().name + '.xlsx',
                    });
                },
            },
            {
                text: 'Request approval',
                slug: 'portcallDisbursementRequestApproval',
                bind: {
                    disabled: '{selectedDisbursement.status != "draft" ? true : false}',
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-outlined md-icon-check-circle',
                handler: function () {
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
                text: 'Delete',
                slug: 'portcallDisbursementDelete',
                ui: 'decline',
                bind: {
                    disabled: '{!disableDelete}',
                    permission: '{userPermissions}',
                },
                separator: true,
                iconCls: 'md-icon-outlined md-icon-delete',
                handler: 'deleteDisbursement',
            },
        ],
    },
});
