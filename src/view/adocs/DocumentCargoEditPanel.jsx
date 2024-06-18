Ext.define('Abraxa.view.adocs.DocumentCargoEditPanel', {
    extend: 'Ext.Container',
    xtype: 'document.cargo.edit.panel',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    height: '100%',
    scrollable: true,
    padding: '8 24',
    viewModel: {
        formulas: {
            selectedCargo: {
                bind: {
                    bindTo: '{selectedDocument.selection.data}',
                    deep: true,
                },
                get: function (data) {
                    if (data) {
                        let record = this.get('object_record'),
                            store = record.cargoes();
                        if (store) {
                            cargo_data = store.getById(data.get('cargo_id'));
                            if (cargo_data) {
                                cargo_data.getProxy().setExtraParams({
                                    object_id: 3,
                                    object_meta_id: record.get('id'),
                                });
                            }
                            return cargo_data;
                        }
                    }
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
                                    '<div class="a-badge a-badge-cargoes"><i></i></div>' +
                                    '<div><span class="a-panel-title">Cargo information - {selectedCargo.commodity}</span><span class="a-panel-id">{object_record.voyage.vessel_name} ({object_record.file_id})</span></div>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-adocs-form cargo_edit_form',
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border dark',
                bind: {
                    disabled: '{isLocked ? true : false}',
                },
                listeners: {
                    change: function (cmp) {
                        let systemfield = cmp.systemField ? cmp.systemField : cmp.getParent().ownerCmp.systemField,
                            document_data = this.upVM().get('documentData');

                        if (document_data && document_data.get('combined_cargoes')) {
                            let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id')),
                                document_date = document.getElementsByClassName('document_date');

                            if (cargo_div) {
                                let field = cargo_div.query('.' + systemfield);
                                if (field.length) {
                                    let field_value;
                                    if (systemfield == 'quantity') {
                                        field_value =
                                            numeral(cmp.getParent().ownerCmp.getQuantity()).format('0,0.[000]') +
                                            ' ' +
                                            cmp.getParent().ownerCmp.getUnit();
                                    } else {
                                        field_value = cmp.getInputValue();
                                    }
                                    if (field[0].value != field_value) {
                                        field[0].value = field_value;
                                        field[0].defaultValue = field_value;
                                        field[0].classList.add('updated');
                                    }
                                }
                            }

                            if (systemfield == 'document_date') {
                                if (document_date.length) {
                                    let field_value = cmp.getInputValue();
                                    if (document_date[0].value != field_value) {
                                        document_date[0].value = field_value;
                                        document_date[0].defaultValue = field_value;
                                        document_date[0].classList.add('updated');
                                    }
                                }
                            }
                        } else {
                            let field = document.getElementById(systemfield)
                                ? document.getElementById(systemfield)
                                : document.getElementsByClassName(systemfield)[0];
                            if (field) {
                                let field_value;
                                if (systemfield == 'quantity') {
                                    field_value =
                                        numeral(cmp.getParent().ownerCmp.getQuantity()).format('0,0.[000]') +
                                        ' ' +
                                        cmp.getParent().ownerCmp.getUnit();
                                } else {
                                    field_value = cmp.getInputValue();
                                }
                                if (field.value != field_value) {
                                    field.value = field_value;
                                    field.defaultValue = field_value;
                                    field.classList.add('updated');
                                }
                            }
                        }
                    },
                    focusleave: function (cmp) {
                        let systemfield = cmp.systemField,
                            documents = this.upVM().get('allDocuments'),
                            cargo_id = this.upVM().get('selectedDocument.selection.data.cargo_id'),
                            document_data = this.upVM().get('documentData'),
                            field_value;

                        if (systemfield == 'quantity') {
                            field_value = numeral(cmp.getQuantity()).format('0,0.[000]') + ' ' + cmp.getUnit();
                        } else {
                            field_value = cmp.getInputValue();
                        }

                        documents.each(function (file) {
                            let folderfile = file.getDocumentAdocsDocumentFolderFile();

                            if (
                                folderfile &&
                                folderfile.get('status') &&
                                folderfile.get('status').toLowerCase() !== 'draft'
                            )
                                return;

                            if (systemfield == 'document_date') {
                                if (
                                    file.getDocumentData().get('cargo_id') == cargo_id ||
                                    file.getDocumentData().get('combined_cargoes')
                                ) {
                                    let docData = file.getDocumentData();
                                    docData.set(systemfield, cmp.getValue());
                                    docData.save();
                                    file.save();
                                }
                            }

                            if (file.getDocumentData().get('cargo_id') == cargo_id) {
                                let pages = file.pages();
                                pages.getProxy().setExtraParams({
                                    document_id: file.get('id'),
                                });

                                pages.each(function (page) {
                                    let page_html = page.get('html'),
                                        div = document.createElement('div');

                                    div.innerHTML = page_html;
                                    div.classList.add('temp_page');

                                    var matchedField = Ext.fly(div).query('#' + systemfield).length
                                        ? Ext.fly(div).query('#' + systemfield)
                                        : Ext.fly(div).query('#cargo_' + cargo_id)[0]
                                          ? Ext.fly(Ext.fly(div).query('#cargo_' + cargo_id)[0]).query(
                                                '.' + systemfield
                                            )
                                          : [];

                                    if (!matchedField.length && systemfield == 'document_date') {
                                        var matchedField = Ext.fly(div).query('.' + systemfield);
                                    }

                                    if (matchedField.length) {
                                        var field = matchedField[0];
                                        matchedField[0].classList.remove('has_changed');
                                        if (systemfield == 'cp_date' || systemfield == 'document_date') {
                                            field.value = moment(cmp.getValue()).isValid()
                                                ? moment(cmp.getValue()).format('DD/MM/YY')
                                                : '';
                                            field.defaultValue = moment(cmp.getValue()).isValid()
                                                ? moment(cmp.getValue()).format('DD/MM/YY')
                                                : '';
                                        } else {
                                            field.value = field_value;
                                            field.defaultValue = field_value;
                                        }

                                        let updated = Ext.fly(div).query('.updated');

                                        Ext.each(updated, function (field) {
                                            field.classList.remove('updated');
                                        });

                                        page.set('html', div.innerHTML);
                                        div.remove();
                                        page.save();
                                    }
                                });
                            }
                            if (file.getDocumentData().get('combined_cargoes')) {
                                let cargoes = JSON.parse(file.getDocumentData().get('combined_cargoes'));

                                if (cargoes.includes(cargo_id)) {
                                    let pages = file.pages();

                                    pages.getProxy().setExtraParams({
                                        document_id: file.get('id'),
                                    });

                                    pages.each(function (page) {
                                        let page_html = page.get('html'),
                                            div = document.createElement('div');

                                        div.innerHTML = page_html;
                                        div.classList.add('temp_page');

                                        if (cargo_id == 0) {
                                            var field = Ext.fly(div).query('.' + systemfield);
                                        } else {
                                            var matchedField = Ext.fly(div).query('#cargo_' + cargo_id);
                                            if (matchedField.length) {
                                                var field = Ext.fly(matchedField[0]).query('.' + systemfield);
                                            }
                                        }

                                        if (field && field.length) {
                                            let addedField;

                                            switch (systemfield) {
                                                case 'shipper_name':
                                                    addedField = 'shipper_address';
                                                    break;
                                                case 'consignee_name':
                                                    addedField = 'consignee_address';
                                                    break;
                                                case 'notify_name':
                                                    addedField = 'notify_address';
                                                    break;
                                            }

                                            field[0].value = field_value;
                                            field[0].defaultValue = field_value;

                                            if (addedField) {
                                                let address = Ext.fly(matchedField[0]).query('.' + addedField);

                                                address[0].value = document_data.get(addedField);
                                                address[0].defaultValue = document_data.get(addedField);
                                            }

                                            page.set('html', div.innerHTML);
                                            page.save();
                                        }

                                        let document_date = Ext.fly(div).query('.document_date');

                                        if (systemfield == 'document_date') {
                                            if (document_date.length) {
                                                document_date[0].value = moment(cmp.getValue()).format('D/M/Y');
                                                document_date[0].defaultValue = moment(cmp.getValue()).format('D/M/Y');
                                                document_date[0].classList.add('updated');
                                            }
                                        }
                                        page.set('html', div.innerHTML);
                                        page.save();

                                        div.remove();
                                    });
                                }
                            }
                        });
                        this.upVM().get('cargoes').sync();
                        let doc = this.upVM().get('selectedDocument.selection');
                        if (doc) {
                            let document_data = doc.getDocumentData();
                            if (systemfield == 'document_date' || systemfield == 'cp_date') {
                                field_value = cmp.getValue();
                            }
                            document_data.set(systemfield, field_value);
                            if (document_data.dirty) {
                                document_data.save();
                            }
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'div',
                    margin: '12 0 16 0',
                    cls: 'a-info-box a-info-dark',
                    html: '<i class="material-icons-outlined">info</i><div class="a-info-text">Use the right panel to apply changes to all documents in a set. Edit a single document directly in the blank.</div>',
                },
                {
                    xtype: 'abraxa.quantityunit',
                    label: 'Quantity',
                    systemField: 'quantity',
                    bind: {
                        quantity: '{selectedCargo.quantity}',
                        unit: '{selectedCargo.unit}',
                        options: '{defaultCargoUnits}',
                    },
                    cls: 'a-field-icon icon-short icon-rounded',
                    // options: ["mts", "cbm", "cbft", "units", "Kilograms"],
                    floatedPicker: {
                        cls: 'a-boundlist-dark',
                    },
                },
                {
                    xtype: 'port.combo',
                    label: 'Port of loading',
                    placeholder: 'Enter port',
                    systemField: 'port_of_loading',
                    bind: {
                        inputValue:
                            '{selectedCargo.function == "Loading" ? object_record.port_name : selectedCargo.origin_destination}',
                        disabled: '{selectedCargo.function == "Loading" || isLocked ? true : false}',
                    },
                    cls: 'a-field-icon icon-place icon-rounded',
                    listeners: {
                        select: function (cmp, newValue) {
                            let record = this.upVM().get('selectedCargo');
                            record.set('origin_destination', this.getSelection().get('port_name'));

                            let systemfield = cmp.systemField ? cmp.systemField : cmp.getParent().systemField;
                            document_data = this.upVM().get('documentData');

                            if (document_data && document_data.get('combined_cargoes')) {
                                let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id'));

                                if (cargo_div) {
                                    let field = cargo_div.query('.' + systemfield);
                                    if (field.length && field[0].value != newValue.get('port_name')) {
                                        field[0].classList.add('updated');
                                        field[0].value = newValue.get('port_name');
                                        field[0].defaultValue = newValue.get('port_name');
                                    }
                                }
                            } else {
                                let field = document.getElementById(systemfield);

                                if (field && field.value != newValue.get('port_name')) {
                                    field.classList.add('updated');
                                    field.value = newValue.get('port_name');
                                    field.defaultValue = newValue.get('port_name');
                                }
                            }
                        },
                    },
                },
                {
                    xtype: 'port.combo',
                    label: 'Port of discharge',
                    placeholder: 'Enter port',
                    systemField: 'port_of_discharge',
                    bind: {
                        inputValue:
                            '{selectedCargo.function == "Discharging" ? object_record.port_name : selectedCargo.origin_destination}',
                        disabled: '{selectedCargo.function == "Discharging" || isLocked ? true : false}',
                    },
                    cls: 'a-field-icon icon-place icon-rounded',
                    listeners: {
                        select: function (cmp, newValue) {
                            let record = this.upVM().get('selectedCargo');
                            record.set('origin_destination', this.getSelection().get('port_name'));

                            let systemfield = cmp.systemField ? cmp.systemField : cmp.getParent().systemField;
                            document_data = this.upVM().get('documentData');

                            if (document_data && document_data.get('combined_cargoes')) {
                                let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id'));

                                if (cargo_div) {
                                    let field = cargo_div.query('.' + systemfield);
                                    if (field.length && field[0].value != newValue.get('port_name')) {
                                        field[0].classList.add('updated');
                                        field[0].value = newValue.get('port_name');
                                        field[0].defaultValue = newValue.get('port_name');
                                    }
                                }
                            } else {
                                let field = document.getElementById(systemfield);

                                if (field && field.value != newValue.get('port_name')) {
                                    field.classList.add('updated');
                                    field.value = newValue.get('port_name');
                                    field.defaultValue = newValue.get('port_name');
                                }
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'organization.combo',
                    label: 'Shipper',
                    placeholder: 'Enter shipper',
                    systemField: 'shipper_name',
                    slug: 'documentaryShipper',
                    bind: {
                        value: '{selectedCargo.shipper_id}',
                        inputValue: '{selectedCargo.shipper}',
                        permission: '{userPermissions}',
                    },
                    cls: 'a-field-icon icon-business icon-rounded',
                    floatedPicker: {
                        cls: 'a-boundlist-dark a-organization-combo',
                        listeners: {
                            select: function (cmp, newValue) {
                                let record = this.upVM().get('selectedCargo');
                                record.set('shipper', this.getSelection().get('org_name'));
                                let systemfield = cmp.ownerCmp.systemField,
                                    document_data = this.upVM().get('documentData');

                                if (newValue) {
                                    var address = newValue.get('org_address') ? newValue.get('org_address') + '\n' : '',
                                        city = newValue.get('city_name') ? newValue.get('city_name') + '\n' : '',
                                        country = newValue.get('country_name') ? newValue.get('country_name') : '';

                                    var formattedAddress = address + city + country;
                                    cmp.up('container')
                                        .down('[cls~=shipper_address_textarea]')
                                        .setValue(formattedAddress);
                                    document_data.set('shipper_address', formattedAddress);

                                    let addedField = document.getElementById('shipper_address');

                                    if (addedField && addedField.value != formattedAddress) {
                                        addedField.classList.add('updated');
                                        addedField.value = formattedAddress;
                                        addedField.defaultValue = formattedAddress;
                                    }
                                }

                                if (document_data && document_data.get('combined_cargoes')) {
                                    let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id'));

                                    if (cargo_div) {
                                        let field = cargo_div.query('.' + systemfield);
                                        if (field.length && field[0].value != newValue.get('org_name')) {
                                            field[0].classList.add('updated');
                                            field[0].value = newValue.get('org_name');
                                            field[0].defaultValue = newValue.get('org_name');

                                            // let page = cargo_div.up('.document_page_holder').component.upVM().get('record'),
                                            //     content = cargo_div.up('.document_page');

                                            // page.set('html', content.getHtml());
                                        }
                                    }
                                } else {
                                    let field = document.getElementById(systemfield)
                                        ? document.getElementById(systemfield)
                                        : document.getElementsByClassName(systemfield)[0];

                                    if (field && field.value != newValue.get('org_name')) {
                                        field.classList.add('updated');
                                        field.value = newValue.get('org_name');
                                        field.defaultValue = newValue.get('org_name');

                                        // let page = Ext.fly(field).up('.document_page_holder').component.upVM().get('record'),
                                        //     content = Ext.fly(field).up('.document_page');

                                        // page.set('html', content.getHtml());
                                    }
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    cls: 'shipper_address_textarea a-field-icon icon-short icon-rounded',
                    systemField: 'shipper_address',
                    labelAlign: 'left',
                    labelCls: 'align-top',
                    label: 'Shipper address',
                    placeholder: 'Enter address',
                    slug: 'documentaryShipper',
                    bind: {
                        value: '{selectedCargo.shipper_address}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    label: 'Consignee',
                    placeholder: 'Choose company',
                    systemField: 'consignee_name',
                    slug: 'documentaryConsignee',
                    bind: {
                        value: '{selectedCargo.consignee_id}',
                        inputValue: '{selectedCargo.consignee_name}',
                        permission: '{userPermissions}',
                    },
                    cls: 'a-field-icon icon-business icon-rounded',
                    floatedPicker: {
                        cls: 'a-boundlist-dark a-organization-combo',
                        listeners: {
                            select: function (cmp, newValue) {
                                let record = this.upVM().get('selectedCargo');
                                record.set('consignee_name', this.getSelection().get('org_name'));
                                let systemfield = cmp.ownerCmp.systemField,
                                    document_data = this.upVM().get('documentData');

                                if (newValue) {
                                    var address = newValue.get('org_address') ? newValue.get('org_address') + '\n' : '',
                                        city = newValue.get('city_name') ? newValue.get('city_name') + '\n' : '',
                                        country = newValue.get('country_name') ? newValue.get('country_name') : '';

                                    var formattedAddress = address + city + country;
                                    cmp.up('container')
                                        .down('[cls~=consignee_address_textarea]')
                                        .setValue(formattedAddress);
                                    document_data.set('consignee_address', formattedAddress);

                                    let addedField = document.getElementById('consignee_address');

                                    if (addedField && addedField.value != formattedAddress) {
                                        addedField.classList.add('updated');
                                        addedField.value = formattedAddress;
                                        addedField.defaultValue = formattedAddress;
                                    }
                                }

                                if (document_data && document_data.get('combined_cargoes')) {
                                    let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id'));

                                    if (cargo_div) {
                                        let field = cargo_div.query('.' + systemfield);
                                        if (field.length && field[0].value != newValue.get('org_name')) {
                                            field[0].classList.add('updated');
                                            field[0].value = newValue.get('org_name');
                                            field[0].defaultValue = newValue.get('org_name');

                                            // let page = cargo_div.up('.document_page_holder').component.upVM().get('record'),
                                            //     content = cargo_div.up('.document_page');

                                            // page.set('html', content.getHtml());
                                        }
                                    }
                                } else {
                                    let field = document.getElementById(systemfield)
                                        ? document.getElementById(systemfield)
                                        : document.getElementsByClassName(systemfield)[0];

                                    if (field && field.value != newValue.get('org_name')) {
                                        field.classList.add('updated');
                                        field.value = newValue.get('org_name');
                                        field.defaultValue = newValue.get('org_name');

                                        let page = Ext.fly(field)
                                                .up('.document_page_holder')
                                                .component.upVM()
                                                .get('record'),
                                            content = Ext.fly(field).up('.document_page');

                                        page.set('html', content.getHtml());
                                    }
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    cls: 'consignee_address_textarea a-field-icon icon-short icon-rounded',
                    systemField: 'consignee_address',
                    labelAlign: 'left',
                    labelCls: 'align-top',
                    label: 'Consignee address',
                    placeholder: 'Enter address',
                    slug: 'documentaryConsignee',
                    bind: {
                        value: '{selectedCargo.consignee_address}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'organization.combo',
                    label: 'Notify',
                    placeholder: 'Choose company',
                    systemField: 'notify_name',
                    bind: {
                        value: '{selectedCargo.notify_id}',
                        inputValue: '{selectedCargo.notify_name}',
                    },
                    cls: 'a-field-icon icon-business icon-rounded',
                    floatedPicker: {
                        cls: 'a-boundlist-dark a-organization-combo',
                    },
                    listeners: {
                        select: function (cmp, newValue) {
                            let record = this.upVM().get('selectedCargo');
                            record.set('notify_name', this.getSelection().get('org_name'));
                            let systemfield = cmp.systemField ? cmp.systemField : cmp.getParent().systemField,
                                document_data = this.upVM().get('documentData');

                            if (newValue) {
                                var address = newValue.get('org_address') ? newValue.get('org_address') + '\n' : '',
                                    city = newValue.get('city_name') ? newValue.get('city_name') + '\n' : '',
                                    country = newValue.get('country_name') ? newValue.get('country_name') : '';

                                var formattedAddress = address + city + country;
                                cmp.up('container').down('[cls~=notify_address_textarea]').setValue(formattedAddress);
                                document_data.set('notify_address', formattedAddress);

                                let addedField = document.getElementById('notify_address');

                                if (addedField && addedField.value != formattedAddress) {
                                    addedField.classList.add('updated');
                                    addedField.value = formattedAddress;
                                    addedField.defaultValue = formattedAddress;
                                }
                            }

                            if (document_data && document_data.get('combined_cargoes')) {
                                let cargo_div = Ext.fly('cargo_' + document_data.get('cargo_id'));

                                if (cargo_div) {
                                    let field = cargo_div.query('.' + systemfield);
                                    if (field.length && field[0].value != newValue.get('org_name')) {
                                        field[0].classList.add('updated');
                                        field[0].value = newValue.get('org_name');
                                        field[0].defaultValue = newValue.get('org_name');

                                        // let page = cargo_div.up('.document_page_holder').component.upVM().get('record'),
                                        //     content = cargo_div.up('.document_page');

                                        // page.set('html', content.getHtml());
                                    }
                                }
                            } else {
                                let field = document.getElementById(systemfield)
                                    ? document.getElementById(systemfield)
                                    : document.getElementsByClassName(systemfield)[0];

                                if (field && field.value != newValue.get('org_name')) {
                                    field.classList.add('updated');
                                    field.value = newValue.get('org_name');
                                    field.defaultValue = newValue.get('org_name');

                                    // let page = Ext.fly(field).up('.document_page_holder').component.upVM().get('record'),
                                    //     content = Ext.fly(field).up('.document_page');

                                    // page.set('html', content.getHtml());
                                }
                            }
                        },
                    },
                },
                {
                    xtype: 'textareafield',
                    cls: 'notify_address_textarea a-field-icon icon-short icon-rounded',
                    systemField: 'notify_address',
                    labelAlign: 'left',
                    labelCls: 'align-top',
                    label: 'Notify address',
                    slug: 'documentaryNotify',
                    placeholder: 'Enter address',
                    bind: {
                        value: '{selectedCargo.notify_address}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'CP Date',
                    placeholder: 'dd/mm/yy',
                    systemField: 'cp_date',
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    slug: 'documentaryCpDate',
                    bind: {
                        value: '{selectedCargo.cp_date}',
                        permission: '{userPermissions}',
                    },
                    cls: 'a-field-icon icon-date icon-rounded',
                },
                {
                    xtype: 'textfield',
                    label: 'Place',
                    placeholder: 'Enter place',
                    systemField: 'document_place',
                    bind: {
                        value: '{documentData.document_place}',
                    },
                    cls: 'a-field-icon icon-place icon-rounded',
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Date',
                    dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                    placeholder: 'dd/mm/yy',
                    systemField: 'document_date',
                    bind: {
                        value: '{documentData.document_date}',
                    },
                    cls: 'a-field-icon icon-date icon-rounded',
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'textareafield',
                    cls: 'a-field-icon icon-short icon-rounded',
                    labelAlign: 'top',
                    labelCls: 'align-top',
                    label: 'Description of goods',
                    systemField: 'description_of_goods',
                    scrollable: false,
                    minHeight: 60,
                    margin: '8 0 0 0',
                    flex: 1,
                    slug: 'documentaryDescription',
                    placeholder: 'Description',
                    bind: {
                        value: '{selectedCargo.description_of_goods}',
                        permission: '{userPermissions}',
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

                        Ext.toast('All changes have been saved', 1500);
                    },
                },
            ],
        },
    ],
});
