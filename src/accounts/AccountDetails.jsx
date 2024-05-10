//ViewModel
import '../view/portcall/agent/accounts/AccountsViewModel.js';

//Stores
import '../store/common/OrganizationsRemote.jsx';

// Core Components
import '../core/components/AbraxaContainer.js';
import '../core/components/AbraxaDiv.js';
import '../core/components/AbraxaPanel.js';

// Common Components
import '../view/common/components/UpdatedBy.js';
import '../view/common/components/PublicUpdatedBy.jsx';
import '../view/common/button/ImportButton.js';

// Portcall Components
import '../view/portcall/MembersPreviewMenu.js';
import '../view/portcall/MembersCombo.js';
import '../view/portcall/agent/accounts/AccountData.js'; // Assuming AccountData is in the same directory
import '../view/portcall/agent/accounts/AccountBalance.js'; // Assuming AccountBalance is in the same directory
import '../view/portcall/agent/disbursements/DisbursementsGrid.js';
import '../view/portcall/agent/disbursements/DisbursementRightCard.js';
import '../view/portcall/agent/disbursements/DisbursementDetails.js';

// Agreements Components
import '../view/portcall/agent/accounts/AgreementsList.js';

// Voucher Components
import '../view/vouchers/VouchersDialog.js';

// ADocs Components
import '../view/adocs/FinancialDocumentForm.js';

import '../view/portcall/agent/disbursements/DisbursementsUploadController.js'
import '../view/common/combo/DefaultExpensesCombo.jsx'
import '../view/portcall/agent/disbursements/DisbursementsMyCostCenterCombo.js'
import '../core/components/AbraxaNumberfield.js'
import '../core/components/combo/OrganizationNoFilters.js'
import '../core/components/Abraxa.PriceField.jsx'
import '../core/components/combo/Currency.jsx'
import '../core/components/Abraxa.CurrencyField.jsx'
import '../view/common/combo/CostCentersCombo.js'

import '../core/override/Abraxa.Component.js'

Ext.define('Abraxa.view.portcall.account.AccountDetails', {
    extend: 'Ext.Container',
    xtype: 'account.details',
    reference: 'accountDetails',
    viewModel: 'accounts-viewmodel',
    testId: 'accountDetails',
    cls: 'a-account-details',
    flex: 1,
    publishes: ['activeItemIndex'],
    layout: {
        type: 'vbox',
        // deferRender: false,
    },
    bind: {
        layout: {
            type: 'vbox',
            animation: '{selectedDisbursement && showDetails ? "cover" : "reveal"}',
        },
        activeItem: '{selectedDisbursement && showDetails ? 1 : 0}',
        cls: 'a-bgr-white no-shadow slideIn',
    },
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        'SHIFT+37': {
            scope: 'this',
            shift: true,
            //event: 'keydown',
            handler: function (event, component) {
                let grid = Ext.ComponentQuery.query('accounts\\.grid')[0];

                if (grid) {
                    grid.deselectAll();
                    component.upVM().set('showDetails', false);
                }
            },
        },
    },
    items: [
        {
            xtype: 'container',
            testId: 'accountDetailsScrollContainer',
            scrollable: true,
            weighted: true,
            items: [
                {
                    xtype: 'disbursement-right-card',
                    docked: 'right',
                    height: '100%',
                },
                {
                    xtype: 'container',
                    weight: 1,
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
                                    tooltip: {
                                        html: '<span class="tooltip_expand">Back <em>shift</em><em>⇦</em></span>',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                        anchor: true,
                                        align: 'bc-tc?',
                                    },
                                    handler: function () {
                                        let grid = Ext.ComponentQuery.query('accounts\\.grid')[0];

                                        if (grid) {
                                            // this.up('[cls~=a-right-container]').removeCls('a-right-container-full');
                                            // grid.canceledit();
                                            grid.deselectAll();
                                            this.upVM().set('showDetails', false);
                                        }
                                    },
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-husbandry-title',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<span>{selectedAccount.org_name}</span><em class="a-id">(#CR-{selectedAccount.id})</em>',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-subtitle',
                                            bind: {
                                                html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)">{memberCount.length} members</a>',
                                                // hidden: '{nonEditable}'
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    fn: function () {
                                                        let vm = this.component.upVM(),
                                                            menu = Ext.create(
                                                                'Abraxa.view.portcall.MembersPreviewMenu',
                                                                {
                                                                    viewModel: {
                                                                        parent: vm,
                                                                    },
                                                                }
                                                            );
                                                        menu.showBy(this);
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            padding: '0 24',
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
                                                hidden: '{accountAgreements.count ? false : true}',
                                                text: 'Agreements <em>{accountAgreements.count}</em>',
                                            },
                                            menu: {
                                                minWidth: '320',
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
                                                            store: '{accountAgreements}',
                                                        },
                                                    },
                                                ],
                                            },
                                            listeners: {
                                                tap: function () {
                                                    mixpanel.track('Agreements (disb screen) - button');
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'blue-light color-default small',
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            subObject: 'disbursements',
                                            slug: 'portcallInvoices',
                                            skipDisabledPrmission: true,
                                            bind: {
                                                permission: '{userPermissions}',
                                                cls: '{nonEditable ? "hidden a-has-counter" : "a-has-counter"}',
                                                objectPermission: '{objectPermissions}',
                                                text: 'Invoices <em>{accountVouchers.count}</em>',
                                            },
                                            handler: function () {
                                                let account_id = this.upVM().get('selectedAccount').get('id'),
                                                    vouchers = this.upVM().get('accountVouchers'),
                                                    expenses = this.upVM().get('accountExpenses'),
                                                    vm = this.upVM();
                                                mixpanel.track('Invoices (disb screen) - button');
                                                Ext.create('Abraxa.view.vouchers.VouchersDialog', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            selectVoucher: null,
                                                            vouchers: vouchers,
                                                            account_id: account_id,
                                                            expenses: expenses,
                                                            nonEditable: vm.get('nonEditable'),
                                                        },
                                                        formulas: {
                                                            selectedVoucher: {
                                                                bind: {
                                                                    bindTo: '{vouchersList.selection}',
                                                                    deep: true,
                                                                },
                                                                get: function (record) {
                                                                    if (record) {
                                                                        return record;
                                                                    }
                                                                },
                                                            },
                                                            loadDodument: {
                                                                bind: {
                                                                    bindTo: '{vouchersList.selection.id}',
                                                                    // deep: true
                                                                },
                                                                get: function (id) {
                                                                    let record = this.get('vouchersList.selection');
                                                                    if (record) {
                                                                        Ext.ComponentQuery.query(
                                                                            '[cls~=pdf-preview]'
                                                                        )[0].setMasked(true);
                                                                        var me = this;
                                                                        let file = record.getDocument(),
                                                                            pdf = record.get('pdf') ? true : false;

                                                                        me.getView()
                                                                            .getController()
                                                                            .loadDocument(
                                                                                Env.ApiEndpoint +
                                                                                    'get_pdf/' +
                                                                                    file.get('id')
                                                                            );

                                                                        // return me.getView().getController().previewFile(file);

                                                                        // if (!pdf) {
                                                                        // 	record.loadPDF2().then(function (blob) {
                                                                        // 		let test = {
                                                                        // 			blob: blob,
                                                                        // 			name:
                                                                        // 				record.get('name') +
                                                                        // 				'.' +
                                                                        // 				file.get('extension'),
                                                                        // 		};
                                                                        // 		me.getView()
                                                                        // 			.getController()
                                                                        // 			.loadDocument(test);
                                                                        // 	});
                                                                        // } else {
                                                                        //
                                                                        // 	let blob = record.get('pdf');
                                                                        // 	let test = {
                                                                        // 		blob: blob,
                                                                        // 		name:
                                                                        // 			record.get('name') +
                                                                        // 			'.' +
                                                                        // 			file.get('extension'),
                                                                        // 	};
                                                                        // 	me.getView()
                                                                        // 		.getController()
                                                                        // 		.loadDocument(test);
                                                                        // }
                                                                    }
                                                                },
                                                            },
                                                            canEditPerm: {
                                                                bind: {
                                                                    bindTo: '{disbursementRecord}',
                                                                    deep: true,
                                                                },
                                                                get: function (record) {
                                                                    if (record) {
                                                                        let objectPermissions =
                                                                                this.get('objectPermissions'),
                                                                            nonEditable = this.get('nonEditable'),
                                                                            store = this.get('userPermissions'),
                                                                            result = false;
                                                                        if (record.get('is_locked')) {
                                                                            return false;
                                                                        } else {
                                                                            if (!nonEditable) {
                                                                                if (
                                                                                    store &&
                                                                                    Object.keys(store).length > 0
                                                                                ) {
                                                                                    let record = store['disbursements'];
                                                                                    if (record && record.edit) {
                                                                                        return true;
                                                                                    } else {
                                                                                        return false;
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                if (
                                                                                    objectPermissions &&
                                                                                    objectPermissions['disbursements']
                                                                                ) {
                                                                                    if (
                                                                                        objectPermissions[
                                                                                            'disbursements'
                                                                                        ].can_edit
                                                                                    ) {
                                                                                        result = true;
                                                                                        if (
                                                                                            store &&
                                                                                            Object.keys(store).length >
                                                                                                0
                                                                                        ) {
                                                                                            let record =
                                                                                                store['disbursements'];
                                                                                            if (
                                                                                                record &&
                                                                                                !record.edit
                                                                                            ) {
                                                                                                result = false;
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                                return result;
                                                                            }
                                                                        }
                                                                    } else {
                                                                        return false;
                                                                    }
                                                                },
                                                            },
                                                            dragListeners: {
                                                                bind: {
                                                                    bindTo: '{userPermissions}',
                                                                    deeP: true,
                                                                },
                                                                get: function (store) {
                                                                    if (store && Object.keys(store).length > 0) {
                                                                        let record = store['portcallInvoiceCreate'];
                                                                        if (record && record.edit) {
                                                                            return {
                                                                                element: 'element',
                                                                                drop: 'onDrop',
                                                                                dragleave: 'onDragLeaveListItem',
                                                                                dragover: 'onDragOverListItem',
                                                                            };
                                                                        } else {
                                                                            return {};
                                                                        }
                                                                    } else {
                                                                        return {};
                                                                    }
                                                                },
                                                            },
                                                            nonEditableForSharing: {
                                                                bind: {
                                                                    bindTo: '{member}',
                                                                    deep: true,
                                                                },
                                                                get: function (member) {
                                                                    if (member && member.get('role') == 'can edit') {
                                                                        this.set('nonEditable', false);
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    },
                                                }).show();
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
                    padding: '16 24',
                    docked: 'top',
                    weight: 2,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'progressbarwidget',
                                    width: 100,
                                    height: 10,
                                    bind: {
                                        cls: 'a-disbursements-progress {accountProgress == 1 ? "completed" : ""}',
                                        value: '{accountProgress}',
                                    },
                                    textTpl: '{percent}%',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-progress-text',
                                    margin: '0 6',
                                    bind: {
                                        html: '{accountProgress:percent()}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-add',
                                    text: 'Document',
                                    slug: 'portcallDocuments',
                                    subObject: 'documents',
                                    bind: {
                                        hidden: '{nonEditable ? true : false}',
                                        objectPermission: '{objectPermissions}',
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (me) {
                                        mixpanel.track('FDA document (disb screen) - button');
                                        let record = me.upVM().get('selectedAccount'),
                                            selectedAccounts = me
                                                .upVM()
                                                .get('expenses')
                                                .queryBy(function (rec, id) {
                                                    return (
                                                        rec.get('disbursement_id') == record.get('id') &&
                                                        rec.get('checked')
                                                    );
                                                }).items,
                                            docForm = Ext.create('Abraxa.view.adocs.FinancialDocumentForm', {
                                                viewModel: {
                                                    data: {
                                                        object_record: this.upVM().get('object_record'),
                                                        organizations: this.upVM().get('organizations'),
                                                        organizationTypesFilter:
                                                            this.upVM().get('organizationTypesFilter'),
                                                        disbursementGrouping: this.upVM().get('disbursementGrouping'),
                                                        documentTypes: this.upVM().get('documentTypes'),
                                                        document_data: {},
                                                        subObjects: this.upVM().get('subObjects'),
                                                        currentUser: this.upVM().get('currentUser'),
                                                        expenses: this.upVM().get('expenses'),
                                                        recieptExpenses: this.upVM().get('recieptExpenses'),
                                                        accounts: this.upVM().get('accounts'),
                                                        bankAccounts: this.upVM().get('bankAccounts'),
                                                    },
                                                    formulas: {
                                                        selectedDisbursementItems: {
                                                            bind: {
                                                                bindTo: '{selectedDisbursement.selection}',
                                                                deep: true,
                                                            },
                                                            get: function (record) {
                                                                if (record) {
                                                                    let expenses = this.get('expenses'),
                                                                        data = [];

                                                                    expenses.each(function (item) {
                                                                        if (
                                                                            item.get(record.get('type') + '_id') ==
                                                                                record.get('id') &&
                                                                            item.get('default_expense_item_id')
                                                                        ) {
                                                                            data.push(item);
                                                                        }
                                                                    });
                                                                    return data;
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                            });
                                        docForm.upVM().set('document_data.bill_to', record.get('id'));
                                        docForm.upVM().set('document_data.bill_to_name', record.get('org_name'));
                                        docForm.upVM().set('document_data.care_of', record.get('co_id'));
                                        docForm.down('[cls~=document_items_grid]').select(selectedAccounts);
                                        docForm.show();
                                        Ext.each(selectedAccounts, function (rec) {
                                            rec.set('checked', false);
                                        });
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    hidden: true,
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    slug: 'portcallSupplyExport',
                                    text: 'Export',
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    margin: '0 24',
                    items: [
                        {
                            xtype: 'account.data',
                            padding: '8 16',
                            margin: '0 12 0 0',
                            cls: 'bordered border-radius a-account-data',
                            flex: 3.5,
                        },
                        {
                            xtype: 'account.balance',
                            cls: 'border-radius a-account-balance',
                            margin: '0 0 0 12',
                            flex: 2,
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'fit',
                    testId: 'accountDetailsDownContainer',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            docked: 'top',
                            cls: 'a-titlebar a-bb-100',
                            minHeight: 65,
                            items: [
                                {
                                    xtype: 'title',
                                    bind: {
                                        title: '<span>Disbursements</span>',
                                    },
                                },
                            ],
                        },
                        // {
                        //     xtype: 'disbursements.grid',
                        //     scrollable: true,
                        //     infinite: false,
                        //     minHeight: 400,
                        //     maxHeight: 2000,
                        // },
                    ],
                },
            ],
        },
        {
            xtype: 'disbursement.details',
            hidden: true,
        },
    ],
});
