import './SofDocumentForm';
import './CargoDocumentForm';
import './FinancialDocumentForm';
import './InvoiceDocumentForm';

Ext.define('Abraxa.view.adocs.CreateDocumentPopup', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.create.document.popup',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 620,
    controller: 'document.controller',
    minHeight: 380,
    maxHeight: 680,
    layout: {
        type: 'vbox',
        align: 'center',
    },
    centered: true,
    items: [
        {
            xtype: 'div',
            cls: 'mb-16',
            html: '<h2 class="a-create-title">Choose document type</h2>',
        },
        {
            xtype: 'container',
            cls: 'a-create-buttons-wrap',
            items: [
                {
                    xtype: 'button',
                    iconCls: 'md-icon-timer md-icon-outlined',
                    cls: 'a-create-button a-button-sof',
                    text: 'Operational',
                    testId: 'createDocumentPopupOperationalButton',
                    handler: function () {
                        Ext.create('Abraxa.view.adocs.SofDocumentForm', {
                            viewModel: {
                                data: {
                                    object_record: this.upVM().get('object_record'),
                                    documentTypes: this.upVM().get('documentTypes'),
                                    defaultCargoUnits: this.upVM().get('defaultCargoUnits'),
                                },
                            },
                        }).show();
                        this.up('dialog').destroy();
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'icon-cargo',
                    cls: 'a-create-button a-button-cargo',
                    testId: 'createDocumentPopupCargoButton',
                    text: 'Cargo',
                    bind: {
                        text: '{(currentUserPlan == "starter") ? "Cargo <span class=\\"a-icon-premium\\"><i class=\\"far fa-gem\\"></i></span>":"Cargo"}',
                    },
                    handler: function () {
                        let vm = this.upVM(),
                            currentUserPlan = vm.get('currentUserPlan');
                        if (currentUserPlan == 'starter') {
                            Ext.create('Abraxa.view.main.UpgradeDialog').show();
                        } else {
                            Ext.create('Abraxa.view.adocs.CargoDocumentForm', {
                                viewModel: {
                                    data: {
                                        object_record: vm.get('object_record'),
                                        organizations: vm.get('organizations'),
                                        userPermissions: vm.get('userPermissions'),
                                        documentTypes: vm.get('documentTypes'),
                                        cargoStore: vm.get('cargoes'),
                                    },
                                    stores: {
                                        cargoStore: {
                                            source: vm.get('object_record.nomination.cargoes'),
                                        },
                                    },
                                    formulas: {
                                        showCombined: {
                                            bind: {
                                                bindTo: '{selectedDocumentTypes.selection}',
                                                deep: true,
                                            },
                                            get: function (selection) {
                                                let hide = true;
                                                if (selection) {
                                                    Ext.each(selection, function (record) {
                                                        if (record.get('can_combine')) {
                                                            hide = false;
                                                        }
                                                    });
                                                }
                                                return hide;
                                            },
                                        },
                                        selectedCargoes: {
                                            bind: {
                                                bindTo: '{documentsSelectedCargoes.selection}',
                                                deep: true,
                                            },
                                            get: function (selection) {
                                                if (selection) {
                                                    return selection.length;
                                                }
                                                return 0;
                                            },
                                        },
                                    },
                                },
                            }).show();
                            this.up('dialog').destroy();
                        }
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'md-icon-attach-money',
                    cls: 'a-create-button a-button-financial',
                    text: 'Disbursement',
                    testId: 'createDocumentPopupFinancialButton',
                    handler: function () {
                        Ext.create('Abraxa.view.adocs.FinancialDocumentForm', {
                            viewModel: {
                                data: {
                                    isVoucher: false,
                                    object_record: this.upVM().get('object_record'),
                                    disbursementGrouping: this.upVM().get('disbursementGrouping'),
                                    organizations: this.upVM().get('organizations'),
                                    organizationTypesFilter: this.upVM().get('organizationTypesFilter'),
                                    documentTypes: this.upVM().get('documentTypes'),
                                    document_data: {},
                                    subObjects: this.upVM().get('subObjects'),
                                    currentUser: this.upVM().get('currentUser'),
                                    expenses: this.upVM().get('expenses'),
                                    recieptExpenses: this.upVM().get('recieptExpenses'),
                                    defaultExpenseItems: this.upVM().get('defaultExpenseItems'),
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
                                                    if (item.get(record.get('type') + '_id') == record.get('id')) {
                                                        data.push(item);
                                                    }
                                                });
                                                return data;
                                            }
                                        },
                                    },
                                },
                            },
                        }).show();
                        this.up('dialog').destroy();
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'md-icon-outlined md-icon-file-copy',
                    cls: 'a-create-button a-button-invoice',
                    text: 'Invoice',
                    testId: 'createDocumentPopupFinancialButton',
                    handler: function () {
                        let docForm = Ext.create('Abraxa.view.adocs.InvoiceDocumentForm', {
                            viewModel: {
                                data: {
                                    object_record: this.upVM().get('object_record'),
                                    organizations: this.upVM().get('organizations'),
                                    documentTypes: this.upVM().get('documentTypes'),
                                    document_data: {},
                                    subObjects: this.upVM().get('subObjects'),
                                    fromSuply: false,
                                    currentUser: this.upVM().get('currentUser'),
                                    expenses: this.upVM().get('expenses'),
                                    recieptExpenses: this.upVM().get('recieptExpenses'),
                                    accounts: this.upVM().get('accounts'),
                                    vouchers: this.upVM().get('vouchers'),
                                    bankAccounts: this.upVM().get('bankAccounts'),
                                },
                                formulas: {
                                    expenseItems: {
                                        bind: {
                                            bindTo: '{billingParty.selection}',
                                            deep: true,
                                        },
                                        get: function (billingParty) {
                                            if (billingParty) {
                                                let expenses = this.get('expenses'),
                                                    expense = this.get('expense'),
                                                    data = [];
                                                if (expense) {
                                                    expenses.each(function (item) {
                                                        if (item.get('id') === expense.get('id')) {
                                                            data.push(item);
                                                        }
                                                    });
                                                } else {
                                                    expenses.each(function (item) {
                                                        if (
                                                            item.get('default_expense_item_id') &&
                                                            item.get('account_id') === billingParty.get('id')
                                                        ) {
                                                            data.push(item);
                                                        }
                                                    });
                                                }
                                                return data;
                                            }
                                        },
                                    },
                                },
                            },
                        });

                        let selectedType = this.upVM()
                            .get('documentTypes')
                            .queryBy(function (rec, id) {
                                return rec.get('slug') == 'creditNote' || rec.get('slug') == 'invoice';
                            }).items;
                        if (selectedType.length) {
                            Ext.Array.sort(selectedType, function (a, b) {
                                return a.get('id') > b.get('id') ? 1 : -1;
                            });
                            docForm.upVM().set('document_data.document_type_id', selectedType[0].id);
                        }
                        docForm.show();
                        this.up('dialog').destroy();
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'mb-16',
            html: 'or',
            slug: 'portcallDocumentUpload',
            bind: {
                permission: '{userPermissions}',
            },
        },
        {
            xtype: 'filebutton',
            text: 'Upload',
            ui: 'normal-light medium',
            iconCls: 'md-icon-outlined md-icon-cloud-upload',
            name: 'files',
            cls: 'mb-16',
            slug: 'portcallDocumentUpload',
            bind: {
                permission: '{userPermissions}',
            },
            listeners: {
                change: function (me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            uploadController = me.up('dialog').getController(),
                            len = files.length;

                        for (var i = 0; i < len; i++) {
                            files.item(i).split = null;
                        }
                        uploadController.upload(files, this);
                    }
                    document.querySelector("input[type='file']").value = '';
                    me.setValue(null);
                },
            },
        },
    ],
});
