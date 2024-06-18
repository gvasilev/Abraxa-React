import '../documents/DocumentController';
import '../portcall/agent/disbursements/DisbursementsUploadController';

Ext.define('Abraxa.view.adocs.CreateFinancialPopup', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.create.financial.popup',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 540,
    minHeight: 380,
    maxHeight: 680,
    controller: 'document.controller',
    layout: {
        type: 'vbox',
        align: 'center',
    },
    items: [
        {
            xtype: 'div',
            html: '<h2 class="a-create-title">Generate document</h2>',
        },
        {
            xtype: 'container',
            cls: 'a-create-buttons-wrap',
            items: [
                {
                    xtype: 'button',
                    iconCls: 'md-icon-outlined md-icon-file-copy',
                    cls: 'a-create-button a-button-invoice',
                    text: 'Invoice',
                    handler: function(me) {
                        let expense = me.upVM().get('expense');
                        let docForm = Ext.create('Abraxa.view.adocs.InvoiceDocumentForm', {
                            viewModel: {
                                data: {
                                    object_record: this.upVM().get('object_record'),
                                    organizations: this.upVM().get('organizations'),
                                    documentTypes: this.upVM().get('documentTypes'),
                                    document_data: {},
                                    expense: expense,
                                    fromSupply: true,
                                    subObjects: this.upVM().get('subObjects'),
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
                                        get: function(billingParty) {
                                            if (billingParty) {
                                                let expenses = this.get('expenses'),
                                                    expense = this.get('expense'),
                                                    data = [];
                                                if (expense) {
                                                    expenses.each(function(item) {
                                                        if (item.get('id') === expense.get('id')) {
                                                            data.push(item);
                                                        }
                                                    });
                                                } else {
                                                    expenses.each(function(item) {
                                                        if (item.get('account_id') === billingParty.get('id')) {
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
                            .queryBy(function(rec, id) {
                                return rec.get('slug') == 'creditNote' || rec.get('slug') == 'invoice';
                            }).items;
                        if (selectedType.length) {
                            Ext.Array.sort(selectedType, function(a, b) {
                                return a.get('id') > b.get('id') ? 1 : -1;
                            });
                            docForm.upVM().set('document_data.document_type_id', selectedType[0].id);
                        }
                        docForm.upVM().set('document_data.bill_to', expense.get('account_id'));
                        docForm.upVM().set('document_data.bill_to_name', expense.get('account_name'));
                        docForm.show();
                        me.up('dialog').hide();
                    },
                },
                {
                    xtype: 'button',
                    iconCls: 'md-icon-attach-money',
                    cls: 'a-create-button a-button-financial',
                    text: 'Credit note',
                    handler: function(me) {
                        let expense = me.upVM().get('expense');
                        let docForm = Ext.create('Abraxa.view.adocs.InvoiceDocumentForm', {
                            viewModel: {
                                data: {
                                    object_record: this.upVM().get('object_record'),
                                    organizations: this.upVM().get('organizations'),
                                    documentTypes: this.upVM().get('documentTypes'),
                                    document_data: {},
                                    expense: expense,
                                    fromSupply: true,
                                    subObjects: this.upVM().get('subObjects'),
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
                                        get: function(billingParty) {
                                            if (billingParty) {
                                                let expenses = this.get('expenses'),
                                                    expense = this.get('expense'),
                                                    data = [];
                                                if (expense) {
                                                    expenses.each(function(item) {
                                                        if (item.get('id') === expense.get('id')) {
                                                            data.push(item);
                                                        }
                                                    });
                                                } else {
                                                    expenses.each(function(item) {
                                                        if (item.get('account_id') === billingParty.get('id')) {
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
                            .queryBy(function(rec, id) {
                                return rec.get('slug') == 'creditNote' || rec.get('slug') == 'invoice';
                            }).items;
                        if (selectedType.length) {
                            Ext.Array.sort(selectedType, function(a, b) {
                                return a.get('id') > b.get('id') ? 1 : -1;
                            });
                            docForm.upVM().set('document_data.document_type_id', selectedType[1].id);
                        }
                        docForm.upVM().set('document_data.bill_to', expense.get('account_id'));
                        docForm.upVM().set('document_data.bill_to_name', expense.get('account_name'));
                        docForm.show();
                        me.up('dialog').hide();
                    },
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'mb-16 c-light-grey',
            html: 'or',
        },
        {
            xtype: 'filebutton',
            text: 'Upload file',
            ui: 'normal-light medium',
            iconCls: 'md-icon-outlined md-icon-cloud-upload',
            controller: 'disbursements.uploadcontroller',
            name: 'files',
            cls: 'mb-16',
            listeners: {
                change: function(me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            record = this.upVM().get('expense'),
                            uploadController = me.getController(),
                            len = files.length;

                        for (var i = 0; i < len; i++) {
                            files.item(i).split = null;
                        }
                        uploadController.upload(files, me.el, record);
                        document.querySelector('input[type=\'file\']').value = '';
                        me.setValue(null);
                    }
                },
            },
        },
    ],
});
