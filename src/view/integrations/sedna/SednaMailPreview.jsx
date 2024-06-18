Ext.define('Abraxa.view.integrations.sedna.SednaMailPreview', {
    extend: 'Ext.Container',
    xtype: 'sedna.mail.preview',
    cls: 'a-mail-preview',
    // scrollable: true,
    padding: '0 0 16',
    viewModel: {
        formulas: {
            mailTo: {
                bind: {
                    bindTo: '{selectedMessage}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        var mailAddresses = [];
                        var mail_to = record.get('to');
                        Ext.Array.each(mail_to, function (item) {
                            mailAddresses.push({
                                email: item.replace(/[<>]/g, ''),
                            });
                        });
                        return mailAddresses;
                    }
                },
            },
            mailToCc: {
                bind: {
                    bindTo: '{selectedMessage}',
                    deep: true,
                },
                get: function (record) {
                    var mailAddresses = [];
                    if (record) {
                        var mail_cc = record.get('cc');
                        Ext.Array.each(mail_cc, function (item) {
                            mailAddresses.push({
                                email: item,
                            });
                        });
                    }
                    return mailAddresses;
                },
            },
            mailToBcc: {
                bind: {
                    bindTo: '{selectedMessage}',
                    deep: true,
                },
                get: function (record) {
                    var mailAddresses = [];
                    if (record) {
                        var mail_bcc = record.get('bcc');
                        Ext.Array.each(mail_bcc, function (item) {
                            mailAddresses.push({
                                email: item,
                            });
                        });
                    }
                    return mailAddresses;
                },
            },
            attachmentCount: {
                bind: {
                    bindTo: '{selectedMessage.attachments}',
                    deep: true,
                },
                get: function (attachments) {
                    if (attachments) return attachments.length;
                    else return 0;
                },
            },
            createdAtFormat: {
                bind: {
                    bindTo: '{selectedMessage.date}',
                    deep: true,
                },
                get: function (createdAtFormat) {
                    if (createdAtFormat) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(createdAtFormat, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
            mailAttachments: {
                bind: {
                    bindTo: '{selectedMessage}',
                },
                get: function (message) {
                    let attachments = [],
                        convertSize = function (size) {
                            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                            if (size == 0) return '0 Byte';
                            var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                            return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
                        };
                    if (message && message.get('attachments').length > 0) {
                        message.get('attachments').forEach(function (attachment) {
                            attachments.push({
                                name: attachment.attributes.name,
                                extension: attachment.attributes.name.split('.').pop(),
                                public_download: attachment.meta.publicDownload,
                                download: attachment.meta.download,
                                size: convertSize(attachment.attributes.size),
                                sedna_id: attachment.id,
                            });
                        });
                    }
                    return attachments;
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            height: 64,
            docked: 'top',
            cls: 'a-bb-100',
            padding: '0 24 0 22',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'button',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'tool round',
                    handler: function (me) {
                        var mailList = Ext.ComponentQuery.query('[cls~=sedna_mails]')[0];
                        mailList.deselectAll();
                    },
                },
                {
                    xtype: 'title',
                    flex: 1,
                    margin: '0 0 0 16',
                    style: 'font-size: 16px; font-weight: 500;',
                    bind: {
                        title: {
                            bindTo: '{selectedMessage.subject}',
                            deep: true,
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-mail-toolbar',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-mail-toolbar-row',
                    padding: 0,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    bind: {
                        html: '<div class="hbox"><div class="a-mail-label">From:</div>{selectedMessage.from}<span class="ml-4 c-grey">on {createdAtFormat}</span></div>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-mail-toolbar-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 64,
                            html: 'To:',
                        },
                        {
                            xtype: 'list',
                            cls: 'a-mail-chip-list',
                            flex: 1,
                            selectable: false,
                            // layout: {
                            //     type: 'hbox',
                            //     pack: 'start',
                            //     align: 'stretch',
                            //     wrap: true
                            // },
                            padding: '8 0 0 0',
                            inline: true,
                            viewModel: true,
                            emptyText: '',
                            itemInnerCls: 'mail-address',
                            itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                            itemConfig: {
                                xtype: 'simplelistitem',
                                minWidth: 0,
                                margin: '0 4',
                            },
                            bind: {
                                store: '{mailTo}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'cc-container a-mail-toolbar-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    bind: {
                        hidden: '{mailToCc.length > 0 ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 64,
                            html: 'Cc:',
                        },
                        {
                            xtype: 'list',
                            cls: 'a-mail-chip-list',
                            flex: 1,
                            selectable: false,
                            // layout: {
                            //     type: 'hbox',
                            //     pack: 'start',
                            //     align: 'stretch',
                            //     wrap: true
                            // },
                            padding: '8 0 0 0',
                            inline: true,
                            viewModel: true,
                            emptyText: '',
                            // ui: 'simple-list',
                            itemInnerCls: 'mail-address',
                            itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                            itemConfig: {
                                xtype: 'simplelistitem',
                                minWidth: 0,
                                margin: '0 4',
                            },
                            bind: {
                                store: '{mailToCc}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'bcc-container a-mail-toolbar-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    bind: {
                        hidden: '{mailToBcc.length > 0 ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-mail-label',
                            width: 64,
                            html: 'Bcc:',
                        },
                        {
                            xtype: 'list',
                            cls: 'a-mail-chip-list',
                            flex: 1,
                            selectable: false,
                            inline: true,
                            // layout: {
                            //     type: 'hbox',
                            //     pack: 'start',
                            //     align: 'stretch',
                            //     wrap: true
                            // },
                            padding: '8 0 0 0',
                            viewModel: true,
                            emptyText: '',
                            itemInnerCls: 'mail-address',
                            itemTpl: '<div class="x-chip"><div class="x-text-el">{email}</div></div>',
                            itemConfig: {
                                xtype: 'simplelistitem',
                                minWidth: 0,
                                margin: '0 4',
                            },
                            bind: {
                                store: '{mailToBcc}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-mail-preview-content',
            padding: '4 8',
            flex: 1,
            bind: {
                cls: 'a-mail-preview-content {selectedMessage.template_id ? "":"a-mail-plain-text"}',
                html: '<div class="email_body">{selectedMessage.body}</div>',
            },
        },
        {
            xtype: 'container',
            cls: 'a-attachments-panel',
            hidden: true,
            bind: {
                hidden: '{mailAttachments.length ? false : true}',
            },
            items: [
                {
                    xtype: 'label',
                    html: '<h5 class="m-0">ATTACHMENTS</h5>',
                },
                {
                    xtype: 'list',
                    cls: 'a-attachments-list',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    itemConfig: {
                        cls: 'a-attachment-item-new attachment-with-buttons',
                        width: '33%',
                        xtype: 'container',
                        padding: 8,
                        minWidth: 0,
                        viewModel: {},
                        layout: {
                            type: 'hbox',
                            pack: 'space-between',
                        },
                        items: [
                            {
                                bind: {
                                    html: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.name}</a><span class="sm-title">{record.size}</span></div></div>',
                                },
                            },
                            {
                                xtype: 'button',
                                ui: 'mini',
                                text: 'Save',
                                iconCls: 'md-icon-file-download md-icon-outlined',
                                cls: 'attachment_button',
                                bottom: 4,
                                right: 4,
                                tooltip: {
                                    html: 'Save to Documents',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    align: 'tc-bc?',
                                },
                                handler: function (cmp) {
                                    let record = cmp.upVM().get('record'),
                                        portcall_id = cmp.upVM().get('object_meta_id'),
                                        object_record = cmp.upVM().get('object_record'),
                                        documents = cmp.upVM().get('documents');

                                    Ext.Ajax.request({
                                        url: Env.ApiEndpoint + 'sedna/save_attachment',
                                        method: 'POST',
                                        params: {
                                            url: record.get('download'),
                                            name: record.get('name').split('.')[0],
                                            extension: record.get('extension'),
                                            ownerable_id: portcall_id,
                                            ownerable_type: object_record.get('model_name'),
                                            document_type: 'uploaded',
                                        },
                                    }).then(function (response) {
                                        let data = Ext.decode(response.responseText);
                                        if (data.success) {
                                            object_record.load();
                                            Ext.toast('Attachment saved to Documents');
                                        }
                                    });
                                },
                            },
                        ],
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.file_name',
                                fn: function (cmp, a) {
                                    let record = this.component.upVM().get('record');
                                    let model = Ext.create('Abraxa.model.portcall.Attachment', {
                                            name: record.get('name').split('.')[0],
                                            pdf: true,
                                            id: 1001,
                                            extension: record.get('extension'),
                                            folder_file: null,
                                            nonEditable: true,
                                            public_download: record.get('public_download'),
                                            download: record.get('download'),
                                            sedna_id: record.get('sedna_id'),
                                            document: {
                                                extension: record.get('extension'),
                                                folder_file: null,
                                                name: record.get('name').split('.')[0],
                                            },
                                        }),
                                        dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                            viewModel: {
                                                data: {
                                                    documentForSelect: model,
                                                    selectedDocuments: Ext.create('Ext.data.Store', {
                                                        data: [model],
                                                    }),
                                                    needsPanel: false,
                                                    object_record: this.component.upVM().get('object_record'),
                                                    isReadOnly: true,
                                                    previewOnly: true,
                                                },
                                                formulas: {
                                                    selectedDocument: {
                                                        bind: {
                                                            bindTo: '{documentsList.selection}',
                                                        },
                                                        get: function (record) {
                                                            return record;
                                                        },
                                                    },
                                                    loadDocument: {
                                                        bind: {
                                                            bindTo: '{selectedDocument.id}',
                                                            // deep: true
                                                        },
                                                        get: function (id) {
                                                            let record = this.get('selectedDocument');
                                                            if (record) {
                                                                var me = this;

                                                                me.getView()
                                                                    .getController()
                                                                    .loadDocument(
                                                                        Env.ApiEndpoint +
                                                                            'sedna/attachment/' +
                                                                            record.get('sedna_id') +
                                                                            '/download'
                                                                    );
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        });
                                    dialog.show();
                                },
                            },
                        },
                    },
                    bind: {
                        store: {
                            bindTo: '{mailAttachments}',
                        },
                    },
                },
            ],
        },
    ],
});
