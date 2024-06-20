Ext.define('Abraxa.view.portnews.PortNewsAttachmentsContainer', {
    extend: 'Ext.Container',
    xtype: 'PortNewsAttachmentsContainer',
    viewModel: {
        data: {
            readOnly: true,
            hidden: true,
        },
    },
    config: {
        readOnly: true,
    },
    bind: {
        hidden: '{hidden}',
    },
    initialize: function () {
        // this.callParent(arguments);
        this.getViewModel().set('readOnly', this.getReadOnly());
    },
    items: [
        {
            xtype: 'div',
            cls: 'c-light-grey-200 mb-12',
            html: 'Attachments',
            bind: {
                hidden: '{!readOnly}',
            },
        },
        {
            xtype: 'container',
            cls: 'a-card-info-list mb-8',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'hbox',
                    html: '<i class="md-icon">attach_file</i>',
                    bind: {
                        hidden: '{!readOnly}',
                    },
                },
                {
                    xtype: 'list',
                    cls: 'a-attachment-list',
                    flex: 1,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        wrap: true,
                    },
                    viewModel: {
                        formulas: {
                            showHide: {
                                bind: {
                                    bindTo: '{files}',
                                    deep: true,
                                },
                                get: function (files) {
                                    if (files instanceof Ext.data.Store && files.getCount() === 0) {
                                        this.getView().upVM().set('hidden', true);
                                        return files.getCount() === 0;
                                    } else if (Array.isArray(files) && files.length === 0) {
                                        this.getView().upVM().set('hidden', true);
                                        return files.length === 0;
                                    } else {
                                        this.getView().upVM().set('hidden', false);
                                    }
                                },
                            },
                        },
                    },
                    bind: {
                        store: '{files}',
                    },
                    itemConfig: {
                        xtype: 'component',
                        viewModel: {
                            formulas: {
                                html: function (get) {
                                    const store = get('files');
                                    const indexOfLastElement = store.getCount() - 1;
                                    const lastElement = store.getAt(indexOfLastElement);
                                    const record = get('record');
                                    const recordId = get('record.id');

                                    const indexOfCurrentRecord = store.indexOf(record);

                                    if (get('readOnly')) {
                                        if (
                                            (lastElement && lastElement.get('id') !== recordId) ||
                                            store.getCount() - 1 === indexOfCurrentRecord
                                        ) {
                                            return `<a class="file_name preview" id="${recordId}" href="javascript:void(0);">${get(
                                                'record.firstName'
                                            )}.${get('record.ext')}</a><span class="a-sep-bullet"></span>`;
                                        } else {
                                            return `<a class="file_name preview" id="${recordId}" href="javascript:void(0);">${get(
                                                'record.firstName'
                                            )}.${get('record.ext')}</a>`;
                                        }
                                    } else {
                                        return `<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="${get(
                                            'record.ext'
                                        )}"></div><div><a class="file_name" id="${recordId}" href="javascript:void(0);">${get(
                                            'record.firstName'
                                        )}</a><span class="sm-title">${get(
                                            'record.size'
                                        )}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>`;
                                    }
                                },
                            },
                        },
                        bind: {
                            cls: '{!readOnly ? "a-attachment-item" : ""}',
                            tpl: '{html}',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.preview',
                                fn: function (element, htmlEl, c) {
                                    var cmp = this.component;
                                    var vm = cmp.upVM();
                                    if (!vm.get('readOnly')) return;
                                    const recordId = +element.target.getAttribute('id');
                                    selectedFile = vm.get('record');
                                    documents = [];
                                    if (selectedFile.get('ext') === 'pdf') {
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .previewFile(
                                                this.component,
                                                selectedFile.getDocument() ||
                                                    Ext.create(
                                                        'Abraxa.model.document.Document',
                                                        selectedFile.get('document')
                                                    ),
                                                [
                                                    selectedFile.getDocument() ||
                                                        Ext.create(
                                                            'Abraxa.model.document.Document',
                                                            selectedFile.get('document')
                                                        ),
                                                ],
                                                null,
                                                true
                                            );
                                    } else {
                                        const record = selectedFile.getDocument(),
                                            name = record ? record.get('name') : selectedFile.get('name'),
                                            id = record ? record.id : selectedFile.get('document_id'),
                                            publicBucket = true,
                                            urlToSend =
                                                Env.ApiEndpoint +
                                                'file/' +
                                                id +
                                                '/download/' +
                                                name +
                                                '/' +
                                                publicBucket,
                                            form = Ext.DomHelper.append(document.body, {
                                                tag: 'form',
                                                method: 'get',
                                                standardSubmit: true,
                                                action: urlToSend,
                                            });
                                        document.body.appendChild(form);
                                        form.submit();
                                        document.body.removeChild(form);
                                        Ext.toast(`${name}.${selectedFile.get('ext')} was downloaded.`, 2000);
                                    }
                                },
                            },
                        },
                    },

                    listeners: {
                        // dblclick: {
                        //     element: 'element',
                        //     delegate: 'a.preview',
                        //     fn: function (element, htmlEl, c) {
                        //         var cmp = this.component;
                        //         var vm = cmp.upVM();
                        //         if (!vm.get('readOnly')) return;
                        //         const recordId = +element.target.getAttribute('id');
                        //         selectedFile = vm.get('record.attachments').findRecord('id', recordId);
                        //         documents = [];
                        //         if (selectedFile.get('ext') === 'pdf') {
                        //             Abraxa.getApplication()
                        //                 .getController('AbraxaController')
                        //                 .previewFile(
                        //                     this.component,
                        //                     selectedFile.getDocument(),
                        //                     [selectedFile.getDocument()],
                        //                     null,
                        //                     true
                        //                 );
                        //         } else {
                        //             const record = selectedFile.getDocument(),
                        //                 name = record.get('name'),
                        //                 publicBucket = true,
                        //                 urlToSend =
                        //                     Env.ApiEndpoint +
                        //                     'file/' +
                        //                     record.id +
                        //                     '/download/' +
                        //                     name +
                        //                     '/' +
                        //                     publicBucket,
                        //                 form = Ext.DomHelper.append(document.body, {
                        //                     tag: 'form',
                        //                     method: 'get',
                        //                     standardSubmit: true,
                        //                     action: urlToSend,
                        //                 });
                        //             document.body.appendChild(form);
                        //             form.submit();
                        //             document.body.removeChild(form);
                        //             Ext.toast(`${name}.${selectedFile.get('ext')} was downloaded.`, 2000);
                        //         }
                        //     },
                        // },

                        click: {
                            element: 'element',
                            delegate: 'i.remove_attachment',
                            fn: function (cmp, a) {
                                const store = this.component.getStore();
                                const isEdit = this.component.getViewModel().get('isEdit');
                                const record = this.component.getSelection();
                                const vm = this.component.up('dialog').getViewModel();
                                const recordId = record.get('id');
                                if (vm && !isNaN(recordId)) {
                                    vm.get('removedAttachmentsIds').push(recordId);
                                }
                                if (isEdit) {
                                    const addedFiles = this.component.getViewModel().get('addedFiles');
                                    addedFiles.remove(record);
                                }
                                store.remove(record);
                            },
                        },
                    },
                },
            ],
        },
    ],
});
