Ext.define('Abraxa.view.mail.SendmailFiles', {
    extend: 'Ext.Dialog',
    xtype: 'sendmail.file.browser',
    title: 'Documents',
    id: 'sendmail-files',
    cls: 'a-dialog-files',
    controller: 'sendmail-controller',
    width: 540,
    minHeight: 600,
    maxHeight: 800,
    padding: 0,
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    closable: true,
    draggable: false,
    maximizable: false,
    alwaysOnTop: true,
    items: [
        {
            xtype: 'searchfield',
            padding: '8 24',
            ui: 'no-border',
            cls: 'a-field-icon icon-search',
            placeholder: 'Search document',
            clearable: false,
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    let documentStore = this.up('dialog').down('[cls~=documents_list]').getStore();
                    if (newValue == '') {
                        documentStore.removeFilter(1000);
                    } else {
                        documentStore.removeFilter(1000);
                        documentStore.addFilter({
                            id: 1000,
                            filterFn: function (item) {
                                if (
                                    item.get('name') &&
                                    item.get('name').toLowerCase().includes(newValue.toLowerCase())
                                ) {
                                    return item;
                                } else {
                                    return false;
                                }
                            },
                        });
                    }
                },
            },
        },
        {
            xtype: 'list',
            flex: 1,
            cls: 'documents_list',
            ui: 'bordered',
            hideMode: 'display',
            bind: {
                store: '{documentsForAmail}',
            },
            itemConfig: {
                viewModel: true,
                xtype: 'container',
                cls: 'a-document-name document_item a-bb-100',
                padding: '12 24',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'checkbox',
                        ui: 'medium',
                    },
                    {
                        xtype: 'div',
                        margin: '0 16',
                        bind: {
                            html: '<span class="file-icon-new file-icon-sm-new" data-type="{record.extension}"></span>',
                        },
                    },
                    {
                        xtype: 'div',
                        flex: 1,
                        cls: 'no_show text-truncate',
                        bind: {
                            html: '<span class="no_show file-name-documentation-grid fw-b" title="{record.name}"><a class="file_name" href="javascript:void(0);">{record.name}.{record.extension}</a></span>',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a',
                                fn: function (me, element, eOpts) {
                                    let component = this.component,
                                        itemRecord = component.upVM().get('record'),
                                        controller = component.up('dialog').getController();
                                    controller.previewFile(itemRecord, component.up('list').getStore());
                                },
                            },
                        },
                    },
                ],
            },
        },
    ],
    bbar: {
        items: [
            {
                xtype: 'filebutton',
                multiple: true,
                text: 'Upload file',
                cls: 'cursor-pointer',
                ui: 'solid-normal',
                iconCls: 'md-icon-outlined md-icon-cloud-upload',
                name: 'files',
                listeners: {
                    painted: function (cmp) {
                        cmp.el.set({
                            'data-doc_type': 'uploaded',
                            'data-id': null,
                        });
                    },
                    change: function (me, newValue) {
                        if (newValue) {
                            var uploadController = me.up('dialog').getController();
                            uploadController.uploadFiles(me);
                        }
                        document.querySelector("input[type='file']").value = '';
                        me.setValue(null);
                    },
                },
            },
            '->',
            {
                xtype: 'button',
                text: 'Attach files',
                ui: 'btn-sm action',
                iconCls: 'md-icon-attach-file',
                handler: function (me) {
                    let items = Ext.ComponentQuery.query('[cls~=document_item]'),
                        attachments = me.upVM().get('attachments'),
                        templateItems = [];

                    Ext.each(items, function (item, index) {
                        if (item.down('checkbox').getChecked()) {
                            templateItems.push(item.upVM().get('record'));
                        }
                    });
                    attachments.add(templateItems);
                    this.up('dialog').close();
                },
            },
        ],
    },
    listeners: {
        initialize: function () {
            this.getHideAnimation().on({
                animationend: function () {
                    this.destroy();
                },
                scope: this,
            });
        },
    },
});
