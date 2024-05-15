Ext.define('Abraxa.view.settings.library.ports.FilesInfo', {
    extend: 'Ext.Container',
    xtype: 'settings.library.port.files.info',
    cls: 'a-right-container a-documents-right-container',
    hidden: true,
    bind: {
        hidden: '{portFiles.selection  ? false : true}',
    },
    viewModel: {
        formulas: {
            createdAtFormated: {
                bind: {
                    bindTo: '{portFiles.selection.created_at}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(date, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
            updatedAtFormated: {
                bind: {
                    bindTo: '{portFiles.selection.updated_at}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(date, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    } else {
                        return '';
                    }
                },
            },
        },
    },
    layout: 'vbox',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 65,
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="file-icon-new file-icon-sm-new" style="margin-right: 16px;" data-type="{portFiles.selection.document.extension}"></div><div><span class="a-panel-title text-truncate" style="width: 280px">{portFiles.selection.document.name}.{portFiles.selection.document.extension}</span><span class="a-panel-id">#DOC-{portFiles.selection.id}</span></div>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-save-alt',
                            ui: 'round tool-round-md',
                            slug: 'portcallDocumentDownload',
                            hidden: true,
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Download',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                            },
                            handler: function () {
                                var record = this.upVM().get('portFiles.selection'),
                                    urlToSend = Env.ApiEndpoint + 'file/' + record.get('id') + '/download',
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
                            xtype: 'button',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'tool-md round',
                            arrow: false,
                            tooltip: {
                                anchorToTarget: true,
                                html: 'More actions',
                                align: 'bc-tc?',
                                closeAction: 'destroy',
                            },
                            menu: {
                                ui: 'medium has-icons',
                                items: [
                                    {
                                        text: 'Rename',
                                        iconCls: 'md-icon-outlined md-icon-edit',
                                        handler: function (me) {
                                            var record = this.upVM().get('portFiles.selection').getDocument();
                                            Ext.create('Ext.Dialog', {
                                                closable: true,
                                                viewModel: {
                                                    data: {
                                                        record: record,
                                                    },
                                                },
                                                title: 'Rename file',
                                                items: [
                                                    {
                                                        xtype: 'textfield',
                                                        labelAlign: 'top',
                                                        label: 'File',
                                                        clearable: false,
                                                        ui: '',
                                                        cls: 'a-field-icon icon-file',
                                                        placeholder: 'File name',
                                                        bind: {
                                                            value: '{record.name}',
                                                            // inputMask: "*.{record.extension}"
                                                        },
                                                        listeners: {
                                                            painted: function () {
                                                                this.focus();
                                                            },
                                                        },
                                                    },
                                                ],
                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        margin: '0 8 0 0',
                                                        handler: function () {
                                                            record.reject();
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                    {
                                                        text: 'Save',
                                                        ui: 'action',
                                                        handler: function () {
                                                            record.save({
                                                                success: function (batch, opt) {
                                                                    Ext.toast('Document updated', 1500);
                                                                },
                                                                failure: function (batch, operations) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not update file.'
                                                                    );
                                                                },
                                                            });
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                ],
                                            }).show();
                                        },
                                    },
                                    {
                                        text: 'Download',
                                        iconCls: 'md-icon-outlined md-icon-save-alt',
                                        handler: function () {
                                            var record = this.upVM().get('portFiles.selection').getDocument(),
                                                name = this.upVM().get('portFiles.selection').get('name'),
                                                urlToSend = Env.ApiEndpoint + 'file/' + record.id + '/download/' + name,
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
                                        text: 'Delete',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        ui: 'decline',
                                        separator: true,
                                        handler: function (me) {
                                            let record = this.upVM().get('portFiles.selection'),
                                                controller = this.find('portFiles').getController(),
                                                portServed = this.upVM().get('portsServerGrid.selection'),
                                                ids = [],
                                                store = this.upVM().get('portsServerGrid.selection').attachments();
                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you would like to delete this entry?',
                                                function (answer) {
                                                    if (answer != 'yes') return;
                                                    store.remove(record);
                                                    ids.push(record.get('id'));
                                                    controller.deleteFiles(ids);
                                                    portServed.load();
                                                    me.up('[xtype=settings\\.library\\.port\\.files\\.info]').hide();
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                this,
                                                [
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'no',
                                                        margin: '0 8 0 0',
                                                        text: 'Cancel',
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'yes',
                                                        ui: 'decline alt',
                                                        text: 'Delete',
                                                        separator: true,
                                                    },
                                                ]
                                            );
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let grid = Ext.ComponentQuery.query('[cls~=a-files-grid]')[0];

                                grid.deselectAll();
                                me.up('[xtype=settings\\.library\\.port\\.files\\.info]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-file-info',
            padding: '8 0',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-file-data',
                    defaults: {
                        cls: 'a-data-item',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Name',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    cls: 'text-truncate',
                                    bind: {
                                        html: '{portFiles.selection.document.name}.{portFiles.selection.document.extension}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            slug: 'portcallDocumentStatus',
                            bind: {
                                hidden: '{portFiles.selection.status ? false : true}',
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Status',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'text-truncate text-capitalize',
                                    bind: {
                                        html: '<div class="a-status-badge a-status-md status-{portFiles.selection.status}">{portFiles.selection.status}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Size',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'text-truncate',
                                    bind: {
                                        html: '{portFiles.selection.document.size}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Created by',
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{portFiles.selection.document.created_by_user}',
                                            updated_at: '{portFiles.selection.document.created_at}',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Updated by',
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{portFiles.selection.document.updated_by_user}',
                                            updated_at: '{portFiles.selection.document.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
