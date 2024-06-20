Ext.define('Abraxa.view.adocs.FinancialDocumentForm', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.financial.document.form',
    testId: 'adocsFinancialDocumentForm',
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
    title: '<div class="a-badge a-badge-financial"><i class="material-icons">attach_money</i></div>New financial document',
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
                    testId: 'adocsFinancialDocumentFormRecordField',
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
                    testId: 'adocsFinancialDocumentFormFolderField',
                    label: 'Folder',
                    cls: 'a-field-icon icon-folder icon-rounded',
                    placeholder: 'Choose folder',
                    value: 'My Documents',
                    disabled: true,
                    hidden: true,
                    ui: 'viewonly classic hovered-border',
                    bind: {
                        hidden: '{!sharedFoldersFieldHidden}',
                    },
                },

                {
                    xtype: 'combobox',
                    testId: 'adocsFinancialDocumentFormFolderField',
                    label: 'Folder',
                    cls: 'a-field-icon icon-folder icon-rounded',
                    placeholder: 'Choose folder',
                    name: 'folder_id',
                    hidden: true,
                    disabled: false,
                    editable: false,
                    clearable: false,
                    valueField: 'id',
                    queryMode: 'local',
                    value: null,
                    displayField: 'name',
                    bind: {
                        hidden: '{sharedFoldersFieldHidden}',
                        store: {
                            bindTo: '{sharedFoldersStore}',
                        },
                    },
                    listeners: {
                        painted: function (combo) {
                            if (combo.getValue()) return;
                            const store = combo.getStore();
                            if (store.getCount() > 0) {
                                let firstRecord = store.getAt(0);
                                combo.setValue(firstRecord.get(combo.getValueField()));
                            }
                        },
                    },
                },
                {
                    xtype: 'accounts.combo',
                    forceSelection: true,
                    label: 'Billing party',
                    placeholder: 'Choose account',
                    reference: 'billingParty',
                    testId: 'adocsFinancialDocumentFormBillingPartyField',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    floatedPicker: {
                        minWidth: 220,
                    },
                    listeners: {
                        select: function (cmp, selection) {
                            Ext.ComponentQuery.query('[cls~=disbursement_record]')[0].clearValue();
                            Ext.ComponentQuery.query('[cls~=document_co]')[0].setValue(selection.get('co_id'));

                            const viewModel = cmp.upVM();
                            const selectedOrg = selection.get(AbraxaConstants.labels.organization);
                            let address = '';
                            if (selectedOrg && selectedOrg.org_address) {
                                address = selectedOrg.org_address;
                            }

                            let address2 = '';
                            if (selectedOrg && selectedOrg.org_address_2) {
                                address2 = selectedOrg.org_address_2;
                            }

                            let memo = '';
                            if (selectedOrg && selectedOrg.org_memo) {
                                memo = selectedOrg.org_memo;
                            }
                            let city = '';
                            if (selectedOrg && selectedOrg.city_name) {
                                city = selectedOrg.city_name;
                            }

                            let country = '';
                            if (selectedOrg && selectedOrg.country_name) {
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
                    label: 'Related <i class="material-icons-outlined" data-qtip="You need to have at least one Disbursement<br/> to be able to use this selection" data-qalign="bc-tc" data-qanchor="true">info</i>',
                    testId: 'adocsFinancialDocumentFormChooseRecordField',

                    required: false,
                    forceSelection: true,
                    queryMode: 'local',
                    cls: 'a-field-icon icon-label a-has-info icon-rounded disbursement_record',
                    placeholder: 'Choose record',
                    valueField: 'id',
                    itemTpl:
                        '<div class="hbox"><div class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="{type}" data-icon="money"></span></div><div class="ml-12"><div class="fw-b">{name}</div><div class="sm-title">#{group_id}</div></div></div>',
                    displayField: 'name',
                    name: 'disbursement_id',
                    reference: 'selectedDisbursement',
                    clearable: true,
                    disabled: true,
                    bind: {
                        disabled: '{billingParty.selection ? false : true}',
                        required: '{selectedDocumentType.selection.category.system_extension == "fda" ? true : false}',
                        store: '{disbursementGrouping}',
                        value: '{document_data.disbursement_id}',
                        hidden: '{selectedDocumentType.selection.category.system_extension == "rcpt" ? true : false}',
                        clearable: '{selectedDocumentType.selection.category.system_extension == "fda" ? false : true}',
                    },
                    listeners: {
                        expand: function () {
                            let selectedAccountID = this.upVM().get('billingParty.selection.id');
                            this.getStore().clearFilter();
                            this.getStore().addFilter({
                                property: 'account_id',
                                value: selectedAccountID,
                                operator: '=',
                            });
                        },
                        select: function (cmp, selection) {
                            cmp.upVM().set('document_data.documentable_type', cmp.getSelection().get('model_name'));
                            cmp.upVM().set('document_data.documentable_id', cmp.getSelection().get('id'));
                            cmp.upVM().set('document_data.disbursement_id', cmp.getSelection().get('id'));
                            cmp.up('container').down('accounts\\.combo').setValue(cmp.getSelection().get('account_id'));
                            let selectedTemplate = cmp.upVM().get('selectedDocumentType.selection');
                            if (selectedTemplate) {
                                if (selectedTemplate.get('slug') != selection.get('type')) {
                                    cmp.upVM().set('document_data.document_type_id', null);
                                }
                            }
                        },
                        show: function (me) {
                            if (!me.getValue()) {
                                me.setError(null);
                            }
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    testId: 'adocsFinancialDocumentFormDocumentTypeField',
                    editable: false,
                    label: 'Template',
                    labelAlign: 'left',
                    labelWidth: 120,
                    forceSelection: true,
                    valueField: 'id',
                    displayTpl: '{name}',
                    itemTpl: '{name}',
                    displayField: 'name',
                    placeholder: 'Choose template',
                    reference: 'selectedDocumentType',
                    required: true,
                    ui: 'classic hovered-border non-editable',
                    cls: 'a-field-icon icon-file icon-rounded',
                    bind: {
                        store: '{documentTypes}',
                        value: '{document_data.document_type_id}',
                        disabled: '{typeLocked ? true:false}',
                    },
                    floatedPicker: {
                        listeners: {
                            select: function (cmp, selection) {
                                let type = selection.get('category').system_extension;
                                if (type == 'rcpt') {
                                    let expenses = this.upVM().get('recieptExpenses');

                                    Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].setStore(expenses);
                                } else {
                                    let value = Ext.ComponentQuery.query('[cls~=disbursement_record]')[0].getValue();
                                    Ext.ComponentQuery.query('[cls~=disbursement_record]')[0].clearValue();
                                    Ext.ComponentQuery.query('[cls~=disbursement_record]')[0].setValue(value);
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
                                    Ext.ComponentQuery.query('[cls~=disbursement_record]')[0].clearValue();
                                    Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].deselectAll();
                                }
                                Ext.ComponentQuery.query('[cls~=document_items_grid]')[0].selectAll(true);
                            },
                        },
                    },
                    listeners: {
                        painted: function (me) {
                            me.setError(false);
                            if (me.upVM().get('document_data').document_type_id) {
                                me.getPicker().select();
                            }
                        },
                        expand: function () {
                            let relatedRecord = this.upVM().get('selectedDisbursement.selection');
                            if (relatedRecord) {
                                this.getStore().clearFilter();
                                this.getStore().addFilter(function (record) {
                                    return record.get('category').type == 'financial';
                                });
                                this.getStore().addFilter(function (record) {
                                    return record.get('slug') != 'invoice' && record.get('slug') != 'creditNote';
                                });
                                this.getStore().addFilter(function (record) {
                                    return record.get('slug') == relatedRecord.get('type');
                                });
                            } else {
                                this.getStore().clearFilter();
                                this.getStore().addFilter(function (record) {
                                    return record.get('category').type == 1;
                                });
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
                    xtype: 'organization.combo',
                    label: 'C/O',
                    testId: 'adocsFinancialDocumentFormCOField',
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
                        painted: function (me) {
                            const fromOrgId = [me.upVM().get('document_data.care_of')];
                            if (fromOrgId) {
                                me.getStore().load({
                                    params: {
                                        org_ids: JSON.stringify(fromOrgId),
                                    },
                                    callback: function (records, operation, success) {
                                        me.setValue(me.upVM().get('document_data.care_of'));
                                    },
                                    scope: this,
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Proforma number',
                    testId: 'adocsFinancialDocumentFormInvoiceNumberField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'proforma_number',
                    placeholder: 'Enter proforma number',
                    bind: {
                        value: '{document_data.proforma_number}',
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Proforma date',
                    testId: 'adocsFinancialDocumentFormInvoiceDateField',
                    cls: 'a-field-icon icon-date icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'proforma_date',
                    placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    bind: {
                        value: '{document_data.proforma_date}',
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Due date',
                    testId: 'adocsFinancialDocumentFormDueDateField',
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
                    testId: 'adocsFinancialDocumentFormReferenceNumberField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'reference_number',
                    placeholder: 'Enter reference',
                    hidden: true,
                    bind: {
                        value: '{document_data.reference_number}',
                        hidden: '{selectedDocumentType.selection.category.system_extension == "fda" || selectedDocumentType.selection.category.system_extension == "dda" || selectedDocumentType.selection.category.system_extension == "sda" ? false : true}',
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
                    xtype: 'abraxa.currency.field',
                    flex: 5,
                    label: 'Exchange rate',
                    testId: 'adocsFinancialDocumentFormExchangeRateField',
                    placeholder: '0,000.00',
                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                    required: false,
                    bind: {
                        value: '{document_data.exchange_rate}',
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
                    testId: 'adocsFinancialDocumentFormBankAccountField',
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
                    xtype: 'container',
                    testId: 'adocsFinancialDocumentFormFundingContainer',

                    padding: '2 0',
                    cls: 'a-data-right',
                    hidden: true,
                    bind: {
                        hidden: '{selectedDocumentType.selection.slug == "pda" && !selectedDocumentType.selection.company_id ? false : true}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                    },
                    items: [
                        {
                            xtype: 'selectfield',
                            label: 'Pre-funding',
                            testId: 'adocsFinancialDocumentFormPreFundingField',
                            encodeHtml: false,
                            displayField: 'term_name',
                            valueField: 'id',
                            placeholder: 'Choose',
                            flex: 1,
                            matchFieldWidth: true,
                            clearable: true,
                            slug: 'portcallBillingPartiesPreFunding',
                            subObject: 'accounts',
                            cls: 'a-field-icon icon-short icon-rounded',
                            hideMode: 'opacity',
                            store: {
                                type: 'payment.terms',
                                autoLoad: true,
                            },
                            bind: {
                                value: '{document_data.payment_term_id}',
                            },
                            listeners: {
                                select: function (me, selection) {
                                    if (selection) {
                                        me.upVM().set('document_data.payment_term_name', selection.get('term_name'));
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'numberfield',
                            testId: 'adocsFinancialDocumentFormPreFundingNumberField',

                            maxValue: 100,
                            width: 42,
                            clearable: false,
                            placeholder: '0',
                            textAlign: 'right',
                            bind: {
                                value: '{document_data.payment_term_value}',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'c-light-grey',
                            padding: '0 0 0 2',
                            html: '%',
                        },
                    ],
                },
                {
                    xtype: 'textfield',
                    label: 'Payment reference',
                    testId: 'adocsFinancialDocumentFormPaymentReferenceField',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    clearable: false,
                    name: 'payment_reference',
                    placeholder: 'Enter payment reference',
                    bind: {
                        value: '{document_data.payment_reference}',
                    },
                },
                {
                    xtype: 'div',
                    html: '<hr>',
                    padding: '8 0',
                },
                {
                    xtype: 'fieldcontainer',
                    testId: 'adocsFinancialDocumentFormVoucherContainer',
                    layout: 'hbox',
                    margin: '16 0',
                    hidden: true,
                    bind: {
                        hidden: '{selectedDocumentType.selection.category.system_extension == "fda" ? false : true}',
                    },
                    defaults: {
                        labelAlign: 'right',
                        ui: 'large',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            testId: 'adocsFinancialDocumentFormVoucherCheckbox',

                            margin: '0 64 0 0',
                            boxLabel: 'Include vouchers',
                            hidden: false,
                            bind: {
                                checked: '{document_data.include_vouchers}',
                                hidden: '{selectedDocumentType.selection.category.system_extension == "fda" || selectedDocumentType.selection.category.system_extension == "dda" || selectedDocumentType.selection.category.system_extension == "sda" ? false : true}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '16 24 16 60',
            cls: 'a-portcall-extra',
            testId: 'adocsFinancialDocumentFormPortcallExtraContainer',
            hidden: true,
            bind: {
                hidden: '{selectedDocumentType.selection.category.system_extension && (selectedDocumentType.selection.category.system_extension !== "fda") ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    padding: '0 0 0 12',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Statement',
                            bind: {
                                hidden: '{(selectedDisbursement.selection || selectedDocumentType.selection.category.system_extension == "rcpt") ? false : true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'grid',
                    ui: 'bordered',
                    testId: 'adocsFinancialDocumentFormDisbursementsGrid',
                    cls: 'document_items_grid',
                    minHeight: 100,
                    maxHeight: 1200,
                    store: [],
                    hidden: true,
                    bind: {
                        store: '{selectedDisbursementItems}',
                        hidden: '{(selectedDisbursement.selection || selectedDocumentType.selection.category.system_extension == "rcpt") ? false : true}',
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
                                    let disbursement = this.upVM().get('selectedDisbursement.selection');
                                    if (disbursement) {
                                        return Ext.util.Format.number(
                                            record.get(disbursement.get('type') + '_final_price'),
                                            '0,000.00'
                                        );
                                    } else {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    }
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
                testId: 'adocsFinancialDocumentFormCancelBtn',
                margin: '0 8',
                handler: function () {
                    this.up('dialog').close();
                },
            },
            {
                xtype: 'button',
                text: 'Create',
                testId: 'financialDocumentFormCreateButton',
                enableToggle: true,
                ui: 'action loading',
                handler: function (cmp) {
                    let form = this.up('dialog').down('formpanel');

                    if (form.validate()) {
                        form.down('form\\.error').hide();
                        this.up('dialog').getController().generateFinancialDocument(cmp);
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
