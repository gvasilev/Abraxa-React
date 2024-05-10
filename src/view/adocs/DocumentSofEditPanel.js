Ext.define('Abraxa.view.adocs.DocumentSofEditPanel', {
    extend: 'Ext.Container',
    xtype: 'document.sof.edit.panel',
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    flex: 1,
    height: '100%',
    scrollable: true,
    padding: '8 24',
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
                            style: 'color: #fff;',
                            bind: {
                                title:
                                    '<div class="a-badge a-badge-sof"><i class="material-icons-outlined">timer</i></div>' +
                                    '<div><span class="a-panel-title">SOF information - General SOF</span><span class="a-panel-id">{object_record.voyage.vessel_name} ({object_record.file_id})</span></div>',
                            },
                            title: 'SOF information',
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

                            Ext.each(matchedFields, function (field) {
                                if (systemfield == 'document_date') {
                                    field.innerHTML = moment(cmp.getValue()).isValid()
                                        ? moment(cmp.getValue()).format('D/M/Y')
                                        : AbraxaConstants.placeholders.emptyValue;
                                } else {
                                    field.innerHTML = field_value;
                                }
                                field.classList.remove('updated');
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
                    label: 'Place',
                    placeholder: 'Enter place',
                    systemField: 'document_place',
                    bind: {
                        value: '{documentData.document_place}',
                    },
                    cls: 'a-field-icon icon-location icon-rounded',
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
