Ext.define('Abraxa.view.adocs.InvoiceDocumentForm', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.invoice.document.form',
    testId: 'adocsInvoiceDocumentForm',
    cls: 'a-dialog-create a-dialog-has-icon',
    controller: 'document.controller',
    width: 580,
    padding: 0,
    minHeight: 400,
    height: '90%',
    scrollable: 'y',
    closable: true,
    draggable: false,
    centered: true,
    title: '<div class="a-badge a-badge-invoice"><i class="material-icons">file_copy</i></div>New invoice',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'formpanel',
            maxWidth: 470,
            margin: '0 0 0 72',
            defaults: {
                ui: 'classic hovered-border',
                labelAlign: 'left',
                labelWidth: 120,
            },
            items: [
                {
                    xtype: 'form.error',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'container',
                    testId: 'adocsInvoiceDocumentFormRecordField',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'start',
                    },
                    margin: '8 0',
                    items: [
                        {
                            xtype: 'label',
                            cls: 'c-blue-grey fs-13 mr-16',
                            width: 140,
                            html: 'Record',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-note-subheader',
                            bind: {
                                html: '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">{object_record.voyage.vessel_name} <span class="sm-title">{object_record.file_id})</span></div></div>',
                                hidden: '{object_record ? false : true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    testId: 'adocsInvoiceDocumentFormFolderField',
                    label: 'Folder',
                    cls: 'a-field-icon icon-folder icon-rounded',
                    placeholder: 'Choose folder',
                    value: 'My Documents',
                    disabled: true,
                    ui: 'viewonly classic hovered-border',
                },
                {
                    xtype: 'accounts.combo',
                    forceSelection: true,
                    label: 'Billing party',
                    placeholder: 'Choose account',
                    reference: 'billingParty',
                    testId: 'adocsInvoiceDocumentFormBillingPartyField',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    floatedPicker: {
                        minWidth: 220,
                    },
                    listeners: {
                        select: function (cmp, selection) {
                            const viewModel = cmp.upVM();
                            const selectedOrg = selection.get(AbraxaConstants.labels.organization);
                            let address = '';
                            if (selectedOrg.org_address) {
                                address = selectedOrg.org_address;
                            }

                            let address2 = '';
                            if (selectedOrg.org_address_2) {
                                address2 = selectedOrg.org_address_2;
                            }

                            let memo = '';
                            if (selectedOrg.org_memo) {
                                memo = selectedOrg.org_memo;
                            }
                            let city = '';
                            if (selectedOrg.city_name) {
                                city = selectedOrg.city_name;
                            }

                            let country = '';
                            if (selectedOrg.country_name) {
                                country = selectedOrg.country_name;
                            }

                            viewModel.set('document_data.bill_to_address', address);
                            if (address2) viewModel.set('document_data.bill_to_address_2', address2);
                            if (memo) viewModel.set('document_data.bill_to_memo', memo);

                            viewModel.set('document_data.bill_to_city', city);
                            viewModel.set('document_data.bill_to_country', country);
                            viewModel.set('document_data.bill_to_name', cmp.getSelection().get('org_name'));
                        },
                    },
                    required: true,
                    disabled: false,
                    bind: {
                        value: '{document_data.bill_to}',
                        hidden: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? true : false}',
                        required: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? false : true}',
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'adocsInvoiceDocumentFormDocumentTypeField',
                    editable: false,
                    label: 'Document type',
                    labelAlign: 'left',
                    labelWidth: 120,
                    forceSelection: true,
                    valueField: 'id',
                    displayTpl: '{name}',
                    itemTpl: '{name}',
                    displayField: 'name',
                    placeholder: 'Choose document type',
                    reference: 'selectedDocumentType',
                    required: true,
                    ui: 'classic hovered-border non-editable',
                    cls: 'a-field-icon icon-file icon-rounded',
                    bind: {
                        store: '{documentTypes}',
                        value: '{document_data.document_type_id}',
                    },
                    floatedPicker: {
                        listeners: {
                            select: function (cmp, selection) {
                                let type = selection.get('category').system_extension;
                                if (type == 'rcpt') {
                                    let expenses = this.upVM().get('recieptExpenses');

                                    Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].setStore(expenses);
                                }
                                this.upVM().set('document_data.document_type', selection.get('category').type);
                                if (type == 'fda') {
                                    this.upVM().set(
                                        'document_data.name',
                                        selection.get('slug').toUpperCase() + ' - ' + selection.get('name')
                                    );
                                } else {
                                    this.upVM().set(
                                        'document_data.name',
                                        selection.get('category').name + ' - ' + selection.get('name')
                                    );
                                }
                                this.upVM().set('document_data.system_extension', type);
                                if (!this.upVM().get('selectedDisbursement.selection') && type == 'fda') {
                                }
                                Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].selectAll(true);
                            },
                        },
                    },
                    listeners: {
                        painted: function (me) {
                            if (me.upVM().get('document_data').document_type_id) {
                                me.getPicker().select();
                                Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].selectAll(true);
                            }
                        },
                        expand: function () {
                            this.getStore().clearFilter();
                            this.getStore().addFilter(function (record) {
                                return record.get('slug') == 'invoice' || record.get('slug') == 'creditNote';
                            });
                        },
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                    padding: '8 0',
                },
                {
                    xtype: 'organization.combo',
                    label: 'C/O',
                    testId: 'adocsInvoiceDocumentFormCOField',
                    cls: 'a-field-icon icon-business icon-rounded document_co',
                    placeholder: 'Choose company',
                    hidden: true,
                    bind: {
                        hidden: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? true : false}',
                        value: '{document_data.care_of}',
                    },
                    listeners: {
                        select: function (cmp, selection) {
                            const viewModel = cmp.upVM();

                            let address = '';
                            if (selection.get('org_address')) {
                                address = selection.get('org_address');
                            }
                            let address2 = '';
                            if (selection.get('org_address_2')) {
                                address2 = selection.get('org_address_2');
                            }
                            let memo = '';
                            if (selection.get('org_memo')) {
                                memo = selection.get('org_memo');
                            }

                            let city = '';
                            if (selection.get('city_name')) {
                                city = selection.get('city_name');
                            }

                            let country = '';
                            if (selection.get('country_name')) {
                                country = selection.get('country_name');
                            }

                            viewModel.set('document_data.care_of_address', address);

                            if (address2) viewModel.set('document_data.care_of_address_2', address2);
                            if (memo) viewModel.set('document_data.care_of_memo', memo);

                            viewModel.set('document_data.care_of_city', city);
                            viewModel.set('document_data.care_of_country', country);
                            viewModel.set('document_data.care_of_name', cmp.getSelection().get('org_name'));
                        },
                        clearicontap: function (cmp, selection) {
                            const viewModel = cmp.upVM();
                            viewModel.set('document_data.care_of', null);
                            viewModel.set('document_data.care_of_address', null);
                            viewModel.set('document_data.care_of_address_2', null);
                            viewModel.set('document_data.care_of_memo', null);
                            viewModel.set('document_data.care_of_city', null);
                            viewModel.set('document_data.care_of_country', null);
                            viewModel.set('document_data.care_of_name', null);
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Invoice number',
                    testId: 'adocsInvoiceDocumentFormInvoiceNumberField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'invoice_number',
                    placeholder: 'Enter invoice number',
                    bind: {
                        value: '{document_data.invoice_number}',
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Invoice date',
                    testId: 'adocsInvoiceDocumentFormInvoiceDateField',
                    cls: 'a-field-icon icon-date icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'invoice_date',
                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    bind: {
                        value: '{document_data.invoice_date}',
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Due date',
                    testId: 'adocsInvoiceDocumentFormDueDateField',
                    cls: 'a-field-icon icon-date icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'due_date',
                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    bind: {
                        value: '{document_data.due_date}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Reference number',
                    testId: 'adocsInvoiceDocumentFormReferenceNumberField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'reference_number',
                    placeholder: 'Enter reference number',
                    bind: {
                        value: '{document_data.reference_number}',
                    },
                    listeners: {
                        painted: function (cmp) {
                            let fileId = cmp.upVM().get('object_record.file_id');
                            if (fileId) {
                                cmp.setValue(fileId);
                            }
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Voy. number',
                    testId: 'adocsInvoiceDocumentFormVoyageNumberField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'voyage_number',
                    placeholder: 'Enter voyage number',
                    bind: {
                        value: '{document_data.voyage_number}',
                    },
                    listeners: {
                        painted: function (cmp) {
                            let fileId = cmp.upVM().get('object_record.nomination.voyage_number');
                            if (fileId) {
                                cmp.setValue(fileId);
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                    padding: '8 0',
                },
                {
                    xtype: 'bank.account.combo',
                    label: 'Bank account',
                    testId: 'adocsInvoiceDocumentFormBankAccountField',
                    placeholder: '',
                    itemCls: 'a-account-listitem',
                    cls: 'a-field-icon icon-account icon-rounded',
                    required: false,
                    bind: {
                        value: '{document_data.bank_id}',
                        disabled: '{!bankAccounts.length}',
                        placeholder: '{bankAccounts.length ? "Choose" : "No bank accounts available"}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Payment terms',
                    testId: 'adocsInvoiceDocumentFormPaymentItemsField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'payment_terms',
                    placeholder: 'Enter payment terms',
                    bind: {
                        hidden: '{selectedDocumentType.selection.slug == "pda" && !selectedDocumentType.selection.company_id ? true : false}',
                        value: '{document_data.payment_terms}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Payment reference',
                    testId: 'adocsInvoiceDocumentFormPaymentReferenceField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'payment_reference',
                    placeholder: 'Enter payment reference',
                    bind: {
                        value: '{document_data.payment_reference}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            padding: '16 24 16 60',
            cls: 'a-portcall-extra',
            testId: 'adocsInvoiceDocumentFormPortcallExtraContainer',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    padding: '0 0 0 12',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Services',
                        },
                    ],
                },
                {
                    xtype: 'grid',
                    ui: 'bordered',
                    testId: 'adocsInvoiceDocumentFormDisbursementsGrid',
                    cls: 'document_items_grid',
                    minHeight: 100,
                    maxHeight: 1200,
                    store: [],
                    hidden: true,
                    bind: {
                        store: '{expenseItems}',
                        hidden: '{expenseItems.length ? false : true}',
                    },
                    selectable: {
                        mode: 'multi',
                        checkbox: true,
                        headerCheckbox: false,
                        checkboxDefaults: {
                            listeners: {
                                painted: function () {
                                    this.up('grid').getHeaderContainer().columns[0].setHeaderCheckbox(true);
                                },
                            },
                        },
                    },
                    columns: [
                        {
                            text: 'Item',
                            flex: 1,
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            dataIndex: 'default_expense_item_name',
                        },
                        {
                            text: 'Amount',
                            minWidth: 130,
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            bind: {
                                hidden: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? true : false}',
                            },
                            renderer: function (value, record) {
                                if (record) {
                                    var amount;

                                    // TODO: Why is this renderer called several times per item?

                                    if (record.get('sda_id')) {
                                        amount = record.get('sda_final_price');
                                    } else if (record.get('fda_id')) {
                                        amount = record.get('fda_final_price');
                                    } else if (record.get('dda_id')) {
                                        amount = record.get('dda_final_price');
                                    } else if (record.get('pda_id')) {
                                        amount = record.get('pda_final_price');
                                    }

                                    if (amount) {
                                        amount = Ext.util.Format.number(amount, '0,000.00');
                                    } else {
                                        amount = AbraxaConstants.placeholders.emptyValue;
                                    }

                                    return amount;
                                }
                            },
                        },
                        {
                            text: 'Quantity',
                            dataIndex: 'record',
                            sortable: false,
                            menuDisabled: true,
                            resizable: false,
                            hideable: false,
                            draggable: false,
                            bind: {
                                hidden: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? false : true}',
                            },
                            tpl: new Ext.XTemplate('{[this.renderer(values)]}', {
                                renderer: function (values) {
                                    let type = values.type,
                                        quantity = AbraxaConstants.placeholders.emptyValue,
                                        quantity_unit = '';
                                    switch (type) {
                                        case 'services':
                                            if (values.is_amount) {
                                                //reverse current to front
                                                if (values.amount) {
                                                    quantity_unit = numeral(values.amount).format('0,0.[000]');
                                                    if (values.amount_currency) {
                                                        quantity = values.amount_currency;
                                                    }
                                                }
                                            } else {
                                                if (values.quantity) {
                                                    quantity = numeral(values.quantity).format('0,0.[000]');
                                                    if (values.quantity_unit) {
                                                        quantity_unit = values.quantity_unit;
                                                    }
                                                }
                                            }
                                            break;
                                        default:
                                            if (values) {
                                                quantity = numeral(values.quantity).format('0,0.[000]');
                                                if (values.quantity_unit) {
                                                    quantity_unit = values.quantity_unit;
                                                }
                                            }
                                            break;
                                    }
                                    return quantity + ' ' + quantity_unit;
                                },
                            }),
                        },
                        {
                            hidden: true,
                            dataIndex: 'attachments_id',
                            sortable: false,
                            width: 40,
                            menuDisabled: true,
                            cell: {
                                viewModel: true,
                                encodeHtml: false,
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'span',
                                        fn: function (me, element, eOpts) {
                                            let component = this.component,
                                                itemRecord = component.getRecord(),
                                                controller = Abraxa.getApplication().getController('AbraxaController'),
                                                files = component
                                                    .lookupViewModel()
                                                    .get('selectedDisbursement.selection')
                                                    .files(),
                                                fileRecord = files.getById(itemRecord.get('attachments_id'));

                                            if (fileRecord && controller) {
                                                controller.previewFile(fileRecord.getDocument());
                                            }
                                        },
                                    },
                                },
                            },
                            renderer: function (value, record, dataIndex, cell) {
                                if (value) {
                                    return '<span class="cursor-pointer"><i class="md-icon-outlined c-blue">attach_file</i></span>';
                                }
                            },
                        },
                    ],
                    listeners: {
                        storechange: function (me) {
                            if (
                                me.upVM().get('selectedDocumentType.selection') &&
                                (me.upVM().get('selectedDocumentType.selection.category.system_extension') == 'cn' ||
                                    me.upVM().get('selectedDocumentType.selection.category.system_extension') == 'inv')
                            ) {
                                if (me.getStore()) {
                                    me.selectAll();
                                }
                            }
                        },
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                testId: 'adocsInvoiceDocumentFormCancelBtn',
                margin: '0 8',
                handler: function () {
                    this.up('dialog').close();
                },
            },
            {
                xtype: 'button',
                text: 'Create',
                testId: 'invoiceDocumentFormCreateButton',
                enableToggle: true,
                ui: 'action loading',
                handler: function (cmp) {
                    let form = this.up('dialog').down('formpanel');

                    if (form.validate()) {
                        form.down('form\\.error').hide();
                        this.up('dialog').getController().generateFinancialPdfDocument(cmp);
                    } else {
                        cmp.toggle();
                        form.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                    }
                },
            },
        ],
    },
    listeners: {
        painted: function (me) {
            if (me.upVM().get('disbursement')) {
                me.upVM().set('document_data.disbursement_id', me.upVM().get('disbursement').get('id'));
            }
        },
    },
});
