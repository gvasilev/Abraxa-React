Ext.define('Abraxa.view.adocs.DocumentFinanceEditPanel', {
    extend: 'Ext.Container',
    xtype: 'document.finance.edit.panel',
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    flex: 1,
    height: '100%',
    scrollable: true,
    padding: '8 24',
    viewModel: {
        stores: {
            banks: {
                type: 'settingsCompanyBankDetails',
                autoLoad: true,
                filters: '{bankFilter}',
            },
        },
        formulas: {
            bankFilter: {
                bind: {
                    bindTo: '{currentUser}',
                    deep: true,
                },
                get: function (user) {
                    let companyBanks = this.get('companyBanks');
                    if (companyBanks) companyBanks.clearFilter();
                    if (user) {
                        if (user.get('current_office_id')) {
                            if (user.getOffice()) {
                                let banksIds = [];
                                if (user.getCompany().offices()) {
                                    user.getCompany()
                                        .offices()
                                        .each(function (office) {
                                            if (office.get('id') == user.get('current_office_id')) {
                                                office
                                                    .banks()
                                                    .getProxy()
                                                    .setExtraParams({
                                                        company_id: user.get('current_company_id'),
                                                        office_id: office.get('id'),
                                                    });
                                                office.banks().load({
                                                    callback: function (recs) {
                                                        Ext.each(recs, function (value, index) {
                                                            banksIds.push(value.get('bank_id'));
                                                        });
                                                    },
                                                });
                                            }
                                        });
                                }
                                return function (rec) {
                                    if (Ext.Array.contains(banksIds, rec.get('id'))) {
                                        return true;
                                    }
                                };
                            }
                        }
                    }
                    return function (rec) {
                        return true;
                    };
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title:
                                    '<div class="a-badge a-badge-financial"><i class="material-icons">attach_money</i></div>' +
                                    '<div><span class="a-panel-title">Financial information</span><span class="a-panel-id">{object_record.voyage.vessel_name} ({object_record.file_id})</span></div>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-adocs-form cargo_edit_form',
            flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border dark',
                bind: {
                    disabled: '{isLocked ? true : false}',
                },
                listeners: {
                    change: function (cmp) {
                        let systemfield = cmp.systemField,
                            document_data = this.upVM().get('documentData');

                        let fields = document.getElementsByClassName(systemfield);

                        Ext.each(fields, function (field) {
                            if (field) {
                                let field_value = cmp.getInputValue();
                                if (field.innerHTML != field_value) {
                                    field.innerHTML = field_value;
                                }
                                // if (care_of) {
                                //     document.getElementsByClassName("care_of")[0].hidden = false;
                                //     document.getElementsByClassName("bill_to_address")[0].hidden = true;
                                //     document.getElementsByClassName("care_of_address")[0].hidden = false;
                                //     document.getElementsByClassName("care_of_name")[0].hidden = false;
                                // } else {
                                //     document.getElementsByClassName("care_of")[0].hidden = true;
                                //     document.getElementsByClassName("bill_to_address")[0].hidden = false;
                                //     document.getElementsByClassName("care_of_address")[0].hidden = true;
                                //     document.getElementsByClassName("care_of_name")[0].hidden = true;
                                // }
                            }
                        });
                    },
                    focusleave: function (cmp) {
                        let systemfield = cmp.systemField,
                            field_value = cmp.getInputValue(),
                            selectedDocument = this.upVM().get('selectedDocument.selection'),
                            pages = selectedDocument.pages(),
                            document_data = selectedDocument.getDocumentData();

                        pages.getProxy().setExtraParams({
                            document_id: selectedDocument.get('id'),
                        });

                        pages.each(function (page) {
                            let page_html = page.get('html'),
                                div = document.createElement('div');

                            div.innerHTML = page_html;
                            div.classList.add('temp_page');

                            var matchedFields = Ext.fly(div).query('.' + systemfield);

                            if (systemfield == 'bank_information') {
                                var selection = cmp.getSelection();
                                if (selection) {
                                    var name =
                                            (selection.get('bank_name')
                                                ? selection.get('bank_name')
                                                : AbraxaConstants.placeholders.emptyValue) + '<br>',
                                        address =
                                            (selection.get('address')
                                                ? selection.get('address')
                                                : AbraxaConstants.placeholders.emptyValue) + '<br>',
                                        iban =
                                            'IBAN: ' +
                                            (selection.get('iban')
                                                ? selection.get('iban')
                                                : AbraxaConstants.placeholders.emptyValue) +
                                            '<br>',
                                        swift =
                                            'SWIFT: ' +
                                            (selection.get('swift_number')
                                                ? selection.get('swift_number')
                                                : AbraxaConstants.placeholders.emptyValue);

                                    field_value = name + address + iban + swift;
                                }
                            }

                            Ext.each(matchedFields, function (field) {
                                if (systemfield == 'document_date' || systemfield == 'due_date') {
                                    field.innerHTML = moment(cmp.getValue()).isValid()
                                        ? moment(cmp.getValue()).format(
                                              AbraxaConstants.formatters.date.dayMonthYearSlash
                                          )
                                        : AbraxaConstants.placeholders.emptyValue;
                                } else {
                                    field.innerHTML = field_value;
                                }
                                field.classList.remove('updated');
                                // if (care_of) {
                                //     Ext.fly(div).query(".care_of")[0].hidden = false;
                                //     Ext.fly(div).query(".bill_to_address")[0].hidden = true;
                                //     Ext.fly(div).query(".care_of_address")[0].hidden = false;
                                //     Ext.fly(div).query(".care_of_name")[0].hidden = false;
                                // } else {
                                //     Ext.fly(div).query(".care_of")[0].hidden = true;
                                //     Ext.fly(div).query(".bill_to_address")[0].hidden = false;
                                //     Ext.fly(div).query(".care_of_address")[0].hidden = true;
                                //     Ext.fly(div).query(".care_of_name")[0].hidden = true;
                                // }
                            });

                            page.set('html', div.innerHTML);
                            div.remove();
                        });

                        // document_data.set(systemfield, field_value);
                        pages.sync();
                        if (document_data.dirty) {
                            document_data.save();
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Invoice number',
                    placeholder: 'Invoice number',
                    systemField: 'invoice_number',
                    bind: {
                        value: '{documentData.invoice_number}',
                        label: 'Invoice number',
                        placeholder: 'Invoice number',
                    },
                    cls: 'a-field-icon icon-short icon-rounded',
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Invoice date',
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    placeholder: 'dd/mm/yy',
                    systemField: 'document_date',
                    bind: {
                        value: '{documentData.document_date}',
                    },
                    cls: 'a-field-icon icon-date icon-rounded',
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Due date',
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    placeholder: 'dd/mm/yy',
                    systemField: 'due_date',
                    bind: {
                        value: '{documentData.due_date}',
                    },
                    cls: 'a-field-icon icon-date icon-rounded',
                },
                {
                    xtype: 'textfield',
                    label: 'Reference number',
                    placeholder: 'Reference number',
                    systemField: 'reference_number',
                    bind: {
                        value: '{documentData.reference_number}',
                    },
                    cls: 'a-field-icon icon-short icon-rounded',
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'organization.combo',
                    label: 'Bill to',
                    placeholder: 'Choose company',
                    systemField: 'bill_to_name',
                    bind: {
                        value: '{documentData.bill_to}',
                        inputValue: '{documentData.bill_to_name}',
                        store: '{organizations}',
                        disabled: true,
                    },
                    cls: 'a-field-icon icon-business icon-rounded',
                    floatedPicker: {
                        cls: 'a-boundlist-dark a-organization-combo',
                    },
                    listeners: {
                        select: function (cmp, newValue) {
                            let systemfield = cmp.systemField,
                                document_data = this.upVM().get('documentData');

                            if (newValue) {
                                var address = newValue.get('org_address') ? newValue.get('org_address') + '\n' : '',
                                    city = newValue.get('city_name') ? newValue.get('city_name') + '\n' : '',
                                    country = newValue.get('country_name') ? newValue.get('country_name') : '';

                                var formattedAddress = address + city + country;
                                document_data.set('bill_to_address', formattedAddress);
                                document_data.set('bill_to_name', newValue.get('org_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    cls: 'bill_to_address_textarea a-field-icon icon-short icon-rounded',
                    systemField: 'bill_to_address',
                    labelAlign: 'left',
                    labelCls: 'align-top',
                    label: 'Bill to address',
                    placeholder: 'Enter address',
                    bind: {
                        hidden: '{documentData.care_of ? true : false}',
                        value: '{documentData.bill_to_address}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    label: 'C/O',
                    placeholder: 'Choose company',
                    systemField: 'care_of_name',
                    hidden: true,
                    bind: {
                        value: '{documentData.care_of}',
                        inputValue: '{documentData.care_of_name}',
                        store: '{organizations}',
                        hidden: '{documentData.care_of ? false : true}',
                        disabled: true,
                    },
                    cls: 'a-field-icon icon-business icon-rounded',
                    floatedPicker: {
                        cls: 'a-boundlist-dark a-organization-combo',
                    },
                    // listeners: {
                    //     select: function (cmp, newValue) {
                    //         let systemfield = cmp.systemField ? cmp.systemField : cmp.getParent().systemField,
                    //             document_data = this.upVM().get('documentData');

                    //         if (newValue) {
                    //             var address = newValue.get("org_address") ? (newValue.get("org_address") + '\n') : "",
                    //                 city = newValue.get("city_name") ? newValue.get("city_name") + '\n' : "",
                    //                 country = newValue.get("country_name") ? newValue.get("country_name") : "";

                    //             var formattedAddress = address + city + country;
                    //             document_data.set('care_of_address', formattedAddress);
                    //             document_data.set('care_of_name', newValue.get('bill_to_name'));
                    //         }
                    //     }
                    // }
                },
                {
                    xtype: 'textareafield',
                    cls: 'care_of_address_textarea a-field-icon icon-short icon-rounded',
                    systemField: 'care_of_address',
                    labelAlign: 'left',
                    labelCls: 'align-top',
                    label: 'C/O address',
                    placeholder: 'Enter address',
                    hidden: true,
                    bind: {
                        hidden: '{documentData.care_of ? false : true}',
                        value: '{documentData.care_of_address}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'textfield',
                    cls: 'a-field-icon icon-short icon-rounded',
                    systemField: 'payment_terms',
                    label: 'Payment terms',
                    placeholder: 'Enter terms',
                    bind: {
                        value: '{documentData.payment_terms}',
                    },
                },
                {
                    xtype: 'textfield',
                    cls: 'a-field-icon icon-short icon-rounded',
                    systemField: 'payment_reference',
                    label: 'Payment reference',
                    placeholder: 'Enter reference',
                    bind: {
                        value: '{documentData.payment_reference}',
                    },
                },
                {
                    xtype: 'textfield',
                    cls: 'a-field-icon icon-business icon-rounded',
                    label: 'Beneficiary',
                    systemField: 'beneficiary',
                    placeholder: 'Enter company',
                    bind: {
                        value: '{documentData.beneficiary}',
                    },
                },
                // {
                //     xtype: 'textfield',
                //     label: 'Place',
                //     placeholder: 'Enter place',
                //     systemField: 'document_place',
                //     bind: {
                //         value: '{documentData.document_place}'
                //     },
                //     cls: 'a-field-icon icon-place icon-rounded',
                // },
                {
                    xtype: 'selectfield',
                    cls: 'a-field-icon icon-account icon-rounded',
                    label: 'Banking details',
                    placeholder: 'Choose bank',
                    valueField: 'id',
                    displayField: 'bank_name',
                    systemField: 'bank_information',
                    bind: {
                        store: '{banks}',
                        value: '{documentData.bank_id}',
                        inputValue: '{documentData.bank_name}',
                    },
                    floatedPicker: {
                        cls: 'a-boundlist-dark',
                        listeners: {
                            select: function (cmp, selection) {
                                let systemfield = cmp.ownerCmp.systemField,
                                    document_data = this.upVM().get('documentData');

                                if (selection) {
                                    var name =
                                            (selection.get('bank_name')
                                                ? selection.get('bank_name')
                                                : AbraxaConstants.placeholders.emptyValue) + '<br>',
                                        address =
                                            (selection.get('address')
                                                ? selection.get('address')
                                                : AbraxaConstants.placeholders.emptyValue) + '<br>',
                                        iban =
                                            'IBAN: ' +
                                            (selection.get('iban')
                                                ? selection.get('iban')
                                                : AbraxaConstants.placeholders.emptyValue) +
                                            '<br>',
                                        swift =
                                            'SWIFT: ' +
                                            (selection.get('swift_number')
                                                ? selection.get('swift_number')
                                                : AbraxaConstants.placeholders.emptyValue);

                                    var formattedValue = name + address + iban + swift;

                                    let fields = document.getElementsByClassName(systemfield);

                                    Ext.each(fields, function (field) {
                                        if (field) {
                                            if (field.innerHTML != formattedValue) {
                                                field.innerHTML = formattedValue;
                                            }
                                        }
                                    });
                                }
                            },
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'bottom',
            padding: 16,
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'action',
                    text: 'Save',
                    bind: {
                        hidden: '{nonEditable ? true : false}',
                        disabled: '{isLocked ? true : false}',
                    },
                    handler: function () {
                        let store = this.upVM().get('object_record').folders(),
                            document = this.upVM().get('selectedDocument.selection');

                        if (document.dirty) {
                            document.save();
                        }
                        if (document.getDocumentAdocsDocumentFolderFile().dirty) {
                            document.getDocumentAdocsDocumentFolderFile().save();
                        }
                        store.getProxy().setExtraParams({
                            object_id: 3,
                            object_meta_id: this.upVM().get('object_record').get('id'),
                        });
                        store.load({
                            callback: function () {
                                Ext.toast('All changes have been saved', 1500);
                                // Ext.ComponentQuery.query('adocs\\.document\\.editor')[0].destroy();
                            },
                        });
                    },
                },
            ],
        },
    ],
});
