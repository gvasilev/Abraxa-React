Ext.define('Abraxa.view.adocs.DocumentEditor', {
    extend: 'Ext.Dialog',
    xtype: 'adocs.document.editor',
    cls: 'a-dialog-create a-dialog-has-icon a-dialog-docs',
    ui: 'dark',
    padding: 0,
    draggable: false,
    maximizable: false,
    maximized: true,
    manageBorders: false,
    scrollable: true,
    tools: {
        close: {
            handler: function () {
                let store = this.upVM().get('object_record').folders(),
                    is_live = this.upVM().get('object_record').get('is_live');

                if (!is_live) {
                    store.getProxy().setExtraParams({
                        object_id: 3,
                        object_meta_id: this.upVM().get('object_record').get('id'),
                    });
                    store.load();
                }

                this.up('dialog').destroy();
            },
        },
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    title: '<div class="a-badge a-badge-adocs"><i class="abraxa-icon-adocs"></i></div>A Docs',
    weighted: true,
    tbar: {
        weight: 2,
        cls: 'a-docs-main-topbar',
        width: '100%',
        ui: 'dark',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'space-between',
        },
        bind: {
            maxWidth: '{documentData.landscape ? "29.7cm" : "21cm"}',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<i class="md-icon md-icon-outlined c-red md-24">lock</i>',
                margin: '4 4 0 0',
                hidden: true,
                bind: {
                    hidden: '{isLocked || nonEditable ? false : true}',
                },
            },
            {
                xtype: 'textfield',
                ui: 'field-xl no-border classic dark',
                width: 400,
                label: false,
                clearable: false,
                placeholder: 'Document name',
                required: true,
                bind: {
                    disabled: '{nonEditable || isLocked ? true : false}',
                    value: '{selectedDocument.selection.documentAdocsDocumentFolderFile.name}',
                    ui: '{nonEditable || isLocked ? "viewonly field-xl dark" : "field-xl no-border classic dark"}',
                },
                listeners: {
                    painted: function (me) {
                        me.focus();
                    },
                },
            },
            '->',
            {
                xtype: 'selectfield',
                placeholder: 'Choose template',
                ui: 'classic dark',
                value: 1,
                height: 32,
                displayField: 'name',
                valueField: 'id',
                options: [
                    {
                        id: 1,
                        name: 'Default',
                    },
                ],
                floatedPicker: {
                    cls: 'a-boundlist-dark',
                },
                hidden: true,
                bind: {
                    cls: '{nonEditable ? "hidden" : ""}',
                    hidden: '{document_type == "cargo" && !isLocked ? false : true}',
                },
            },
            {
                xtype: 'sof-sections',
                margin: '0 0 0 16',
                hidden: true,
                bind: {
                    cls: '{nonEditable ? "hidden" : ""}',
                    hidden: '{!isLocked && document_type == "sof" ? false : true}',
                },
            },
            {
                xtype: 'tool',
                margin: '0 8 0 16',
                ui: 'dark',
                iconCls: 'md-icon-save-alt md-icon-outlined',
                tooltip: {
                    anchorToTarget: true,
                    html: 'Download',
                    align: 'bc-tc?',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                },
                handler: function () {
                    var record = this.upVM().get('selectedDocument.selection'),
                        name = this.upVM()
                            .get('selectedDocument.selection')
                            .getDocumentAdocsDocumentFolderFile()
                            .get('name'),
                        urlToSend = Env.ApiEndpoint + 'file/' + record.get('id') + '/download/' + name,
                        form = Ext.DomHelper.append(document.body, {
                            tag: 'form',
                            method: 'get',
                            standardSubmit: true,
                            action: urlToSend,
                        });
                    document.body.appendChild(form);
                    form.submit();
                    document.body.removeChild(form);
                },
            },
            {
                xtype: 'tool',
                ui: 'dark',
                iconCls: 'md-icon-print md-icon-outlined',
                tooltip: {
                    anchorToTarget: true,
                    html: 'Print',
                    align: 'bc-tc?',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                },
                handler: function () {
                    var pages = this.upVM().get('selectedDocument.selection').pages();
                    var left = (screen.width - 960) / 2;
                    var top = (screen.height - 640) / 4;
                    var content = '';
                    pages.each(function (page) {
                        content += page.get('html');
                    });
                    // var mywindow = window.open('', 'PRINT', 'height=480,width=640');
                    var mywindow = window.open(
                        '',
                        'PRINT',
                        'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, height=640,width=960, top=' +
                            top +
                            ', left=' +
                            left
                    );
                    mywindow.document.write(content);
                    mywindow.document.close(); // necessary for IE >= 10
                    mywindow.focus(); // necessary for IE >= 10*/
                    mywindow.print();
                    mywindow.close();
                },
            },
        ],
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            cls: 'a-docs-menu',
            docked: 'left',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            scrollable: true,
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading',
                    padding: '0 0 0 24',
                    html: '<h5>Documents</h5>',
                },
                {
                    xtype: 'list',
                    reference: 'selectedDocument',
                    style: 'background-color: transparent',
                    cls: 'a-list-dark',
                    selectable: {
                        deselectable: false,
                    },
                    pinHeaders: false,
                    scrollable: true,
                    flex: 1,
                    infinite: true,
                    ripple: false,
                    itemRipple: false,
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                firstSelectq: {
                                    bind: {
                                        bindTo: '{selectedRecord}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        let list = this.getView().up('list'),
                                            store = list.getStore();

                                        if (record) {
                                            let selected = store.getById(record.get('id'));
                                            if (record) {
                                                list.select(selected);
                                            }
                                        } else {
                                            list.select(store.getAt(0));
                                        }
                                    },
                                },
                            },
                        },
                        padding: '0 8',
                        cls: 'cursor-pointer',
                        bind: {
                            tpl: '<div class="hbox"><span class="file-icon-new file-icon-sm-new file-icon-dark" data-type="{record.extension}"></span><span class="a-file-name">{record.documentAdocsDocumentFolderFile.name}</span></div>',
                        },
                    },
                    bind: {
                        store: '{documents}',
                    },
                    groupHeader: {
                        cls: 'hbox',
                        tpl: Ext.create('Ext.XTemplate', '{[this.cargoData(values)]}', {
                            cargoData: function (values) {
                                if (values) {
                                    return (
                                        '<div class="cargo_documents_group_header"><div class="a-badge a-badge-cargoes"><i></i></div><span class="text-truncate">' +
                                        numeral(values.group.data.items[0].getDocumentData().get('bl_quantity')).format(
                                            '0,0.[000]'
                                        ) +
                                        ' ' +
                                        values.group.data.items[0].getDocumentData().get('bl_unit') +
                                        ' - ' +
                                        values.group.data.items[0].getDocumentData().get('cargo_commodity') +
                                        '</span></div>'
                                    );
                                }
                            },
                        }),
                    },
                    // listeners: {
                    //     painted: function (me) {
                    //         if (!me.upVM().get('selectedRecord')) {
                    //             me.select(me.getStore().getAt(0));
                    //         } else {
                    //             me.select(me.upVM().get('selectedRecord'))
                    //         }
                    //     },
                    // }
                },
            ],
            hidden: true,
            hideMode: 'clip',
            bind: {
                hidden: '{nonEditable ? true : false}',
            },
        },
        {
            xtype: 'abraxa.formlist',
            flex: 1,
            variableHeights: true,
            cls: 'a-docs-main documents_page_list',
            style: 'background-color: transparent',
            itemConfig: {
                xtype: 'container',
                viewModel: {
                    formulas: {
                        checkFields: {
                            bind: {
                                bindTo: '{record.html}',
                                deep: true,
                            },
                            get: function (html) {
                                let isLive = this.get('nonEditable') || this.get('isLocked'),
                                    vm = this;
                                if (html && !isLive) {
                                    let record = this.get('record');
                                    let documentData = this.get('selectedDocument.selection').getDocumentData(),
                                        div = document.createElement('div');

                                    div.innerHTML = html;
                                    div.classList.add('temp_page');
                                    Object.keys(documentData).forEach(function (key) {
                                        let field = Ext.fly(div).query('#' + key),
                                            document_value = documentData[key];

                                        if (field.length) {
                                            if (key == 'cp_date') {
                                                document_value = moment(document_value).format('D/M/Y');
                                            } else if (key == 'quantity') {
                                                document_value = documentData['quantity'] + ' ' + documentData['unit'];
                                            }
                                            if (
                                                document_value &&
                                                field[0].value != document_value &&
                                                field[0].value != ''
                                            ) {
                                                field[0].classList.add('has_changed');
                                            }
                                        }
                                    });
                                    if (
                                        documentData.get('combined_cargoes') &&
                                        Ext.fly(div).query('#cargo_' + documentData.get('cargo_id'))
                                    ) {
                                        let cargo_div = Ext.fly(div).query('#cargo_' + documentData.get('cargo_id'));
                                        if (cargo_div.length) {
                                            let form_fields = Ext.fly(cargo_div[0]).query('.form-control');
                                            cargo_div[0].classList.remove('selected_cargo');
                                            Ext.each(form_fields, function (form_field) {
                                                form_field.classList.remove('no-edit');
                                                form_field.disabled = false;
                                            });
                                            Ext.ComponentQuery.query('[cls~=documents_page_list]')[0].ensureVisible(
                                                record,
                                                {
                                                    animation: false,
                                                }
                                            );
                                        }
                                    } else {
                                        let cargo_div = Ext.fly(div).query('#cargo_' + documentData.get('cargo_id'));
                                        if (cargo_div.length) {
                                            let form_fields = Ext.fly(cargo_div[0]).query('.form-control');
                                            cargo_div[0].classList.remove('selected_cargo');
                                            Ext.each(form_fields, function (form_field) {
                                                form_field.classList.remove('no-edit');
                                                form_field.disabled = false;
                                            });
                                        }
                                    }
                                    record.data.html = div.innerHTML;
                                    div.remove();
                                }
                            },
                        },
                        disableFields: {
                            bind: {
                                bindTo: '{record.html}',
                                deep: true,
                            },
                            get: function (html) {
                                let is_live = this.get('nonEditable') || this.get('isLocked'),
                                    me = this;

                                if (is_live) {
                                    let div = document.createElement('div');

                                    div.innerHTML = html;

                                    Array.from(Ext.fly(div).query('.form-control')).forEach((el) => {
                                        el.disabled = true;
                                        el.classList.add('no-edit');
                                        if (me.get('object_record').get('is_live')) el.classList.remove('has_changed');
                                    });
                                    Array.from(Ext.fly(div).query('.selected_cargo')).forEach((el) =>
                                        el.classList.remove('selected_cargo')
                                    );

                                    let record = this.get('record');
                                    record.set('html', div.innerHTML);
                                    div.remove();
                                } else {
                                    let div = document.createElement('div');
                                    div.innerHTML = html;

                                    // Array.from(Ext.fly(div).query('.form-control')).forEach((el) => {
                                    //     el.disabled = false;
                                    //     el.classList.remove('no-edit');
                                    //     if (me.get('object_record').get('is_live'))
                                    //         el.classList.remove('has_changed');
                                    // });

                                    let record = this.get('record');
                                    record.set('html', div.innerHTML);
                                    div.remove();
                                }
                            },
                        },
                        recordIndex: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    let store = this.get('pages');

                                    return store.indexOf(record) + 1;
                                }
                            },
                        },
                    },
                },
                items: [
                    {
                        xtype: 'div',
                        padding: '8 16',
                        style: 'background: white; border-radius: 4px; margin: 0px auto 8px auto;',
                        shadow: true,
                        cls: 'document_page_holder',
                        height: 'auto',
                        bind: {
                            html: '<div class="document_page {object_record.is_live ? "isLive" : ""}">{record.html}</div>',
                            maxWidth: '{documentData.landscape ? "29.7cm" : "21cm"}',
                            minHeight: '{documentData.landscape ? "21cm" : "29.7cm"}',
                        },
                    },
                    {
                        xtype: 'div',
                        style: 'margin: 0px auto 32px auto; color: #fff;',
                        bind: {
                            html: 'Page {recordIndex} of {pages.count}',
                            maxWidth: '{documentData.landscape ? "29.7cm" : "21cm"}',
                        },
                    },
                ],
                listeners: {
                    keyup: {
                        element: 'element',
                        fn: function (component, el) {
                            // let inputFields = Ext.query('#blank .form-control');
                            let cmp = this.component,
                                documentData = cmp.upVM().get('documentData'),
                                element_match = el.id ? el.id : el.dataset.systemfield;

                            if (
                                documentData.get(element_match) &&
                                element_match &&
                                documentData.get(element_match) != el.value
                            ) {
                                el.classList.add('has_changed');
                            } else {
                                el.classList.remove('has_changed');
                            }

                            component.target.defaultValue = el.value;
                        },
                    },
                    focusleave: {
                        element: 'element',
                        fn: function (component, el, eOpt) {
                            let cmp = this.component,
                                record = cmp.upVM().get('record');
                            // document_data = this.upVM().get('document_data');

                            record.set('html', Ext.fly(el).up('.document_page').dom.innerHTML);
                            record.save();
                        },
                    },
                    focusout: {
                        element: 'element',
                        // delegate: '.form-control',
                        fn: function (component, el, eOpt) {},
                    },
                    // painted: function () {
                    //     let form = Ext.fly('.document_page');

                    //     form.addEventListener('focusout', (event) => {

                    //     });
                    // }
                },
            },
            bind: {
                store: '{pages}',
            },
        },
    ],
    rbar: {
        xtype: 'container',
        cls: 'a-docs-panel',
        hidden: true,
        width: 480,
        bind: {
            hidden: '{nonEditable ? true : false}',
        },
        weight: 1,
        flex: 1,
        items: [
            {
                xtype: 'document.cargo.edit.panel',
                hidden: true,
                bind: {
                    hidden: '{document_type == "cargo" ? false : true}',
                },
            },
            {
                xtype: 'document.sof.edit.panel',
                hidden: true,
                bind: {
                    hidden: '{document_type == "sof" ? false : true}',
                },
            },
            {
                xtype: 'document.finance.edit.panel',
                hidden: true,
                bind: {
                    hidden: '{document_type == "finance" ? false : true}',
                },
            },
        ],
    },
});
