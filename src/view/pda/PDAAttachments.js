Ext.define('Abraxa.view.pda.PDAAttachments', {
    extend: 'Ext.Container',
    xtype: 'pda.attachments',
    hidden: true,
    flex: 1,
    id: 'pda-attachments-container',
    zIndex: '200',
    layout: {
        type: 'vbox',
    },
    cls: 'a-drop-container',
    items: [
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'list',
                    cls: 'a-files-grid a-grid-6',
                    height: '100%',
                    ui: 'docs',
                    inline: true,
                    ripple: false,
                    style: 'cursor: pointer',
                    selectable: {
                        deselectable: true,
                    },
                    bind: {
                        store: '{pda.attachments}',
                    },
                    emptyText: {
                        xtype: 'container',
                        zIndex: 999,
                        layout: {
                            type: 'vbox',
                            pack: 'middle',
                        },
                        centered: true,
                        // html: '',
                        items: [
                            {
                                xtype: 'container',
                                items: [],
                            },
                            {
                                xtype: 'div',
                                // html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124"><title>cloud_upload</title><g style="opacity:0.6000000238418579"><circle cx="62" cy="62" r="62" style="fill:#e9ecef;opacity:0.4000000059604645;isolation:isolate"/></g><path d="M82.71,54.52C80.79,44,72.26,36.15,62,36.15c-8.14,0-15.21,5-18.74,12.28-8.48,1-15.07,8.73-15.07,18.13,0,10.06,7.58,18.25,16.91,18.25H81.72c7.78,0,14.09-6.82,14.09-15.21C95.81,61.57,90,55.06,82.71,54.52Zm-15.08,9V75.68H56.37V63.52H47.91L62,48.31,76.09,63.52Z" style="fill:#c8d4e6"/></svg><div class="a-no-content-txt">Drag & Drop here</br><small>- or -</small></div></div>'
                                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No documents available.<span class="fs-13">Drop files or use the button.</span></div></div>',
                                bind: {
                                    hidden: '{pda.status !== "draft"}',
                                },
                            },
                            {
                                xtype: 'div',
                                // html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124"><title>cloud_upload</title><g style="opacity:0.6000000238418579"><circle cx="62" cy="62" r="62" style="fill:#e9ecef;opacity:0.4000000059604645;isolation:isolate"/></g><path d="M82.71,54.52C80.79,44,72.26,36.15,62,36.15c-8.14,0-15.21,5-18.74,12.28-8.48,1-15.07,8.73-15.07,18.13,0,10.06,7.58,18.25,16.91,18.25H81.72c7.78,0,14.09-6.82,14.09-15.21C95.81,61.57,90,55.06,82.71,54.52Zm-15.08,9V75.68H56.37V63.52H47.91L62,48.31,76.09,63.52Z" style="fill:#c8d4e6"/></svg><div class="a-no-content-txt">Drag & Drop here</br><small>- or -</small></div></div>'
                                html: '<div class="a-no-content-txt">No documents available.</div></div>',
                                bind: {
                                    hidden: '{pda.status == "draft"}',
                                },
                            },
                            {
                                xtype: 'filebutton',
                                cls: 'a-no-content-btn',
                                text: 'Upload document',
                                ui: 'normal-light medium',
                                iconCls: 'md-icon-outlined md-icon-cloud-upload',
                                name: 'files',
                                slug: 'cdb',
                                bind: {
                                    permission: '{userPermissions}',
                                    hidden: '{pda.status !== "draft"}',
                                    disabled: '{nonEditable}',
                                },
                                listeners: {
                                    change: 'uploadFiles',
                                },
                            },
                        ],
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                currentRecord: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        return record;
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        cls: 'a-document-row',
                        minHeight: 64,
                        keyMapEnabled: true,
                        keyMap: {
                            scope: 'this',
                            ESC: function () {
                                let record = this.upVM().get('crewingGrid.selection'),
                                    grid = Ext.ComponentQuery.query('[cls~=a-files-grid]')[0];

                                grid.deselectAll();
                            },
                        },
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'start',
                        },
                        items: [
                            {
                                xtype: 'container',
                                cls: 'a-document-name',
                                margin: 0,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'start',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        bind: {
                                            html: '<span class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></span>',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        bind: {
                                            html: '<a class="no_show file-name-documentation-grid" href="javascript:void(0)" title="{record.document.name}">{record.document.name}.{record.document.extension}</a>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.file-name-documentation-grid',
                                                fn: function fn(element, htmlEl, c) {
                                                    var cmp = this.component;
                                                    var vm = cmp.upVM();
                                                    var selectedFile = vm.get('record'),
                                                        documents = [];

                                                    vm.get('pda')
                                                        .attachments()
                                                        .each(function (attachment) {
                                                            documents.push(attachment.getDocument());
                                                        });

                                                    var data = {
                                                        object_id: 2,
                                                        object_meta_id: selectedFile
                                                            .getDocument()
                                                            .get('object_meta_id'),
                                                        file_id: selectedFile.getDocument().get('id'),
                                                    };
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .previewFile(
                                                            this.component,
                                                            selectedFile.getDocument(),
                                                            documents
                                                        );
                                                },
                                            },
                                        },
                                    },
                                ],
                            },
                            // {
                            //     xtype: 'public.updated.by',
                            //     width: 220,
                            //     right: 50,
                            //     cls: 'no_show',
                            //     bind: {
                            //         data: {
                            //             user: '{record.document.updated_by_user}',
                            //             updated_at:
                            //                 '{record.document.updated_at}',
                            //         },
                            //     },
                            // },
                            {
                                xtype: 'button',
                                right: 16,
                                iconCls: 'md-icon-more-horiz',
                                ui: 'round tool-round-md',
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
                                            slug: 'cdbFiles',
                                            bind: {
                                                permission: '{userPermissions}',
                                                disabled: '{pda.status !== "draft"}',
                                            },
                                            handler: function (me) {
                                                let record = this.up('menu').upVM().get('record').getDocument();
                                                Ext.create('Ext.Dialog', {
                                                    closable: true,
                                                    alwaysOnTop: 2,
                                                    viewModel: {
                                                        data: {
                                                            record: record,
                                                        },
                                                    },
                                                    title: 'Rename document',
                                                    items: [
                                                        {
                                                            xtype: 'textfield',
                                                            labelAlign: 'top',
                                                            label: 'Name',
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
                                                                // record.getProxy().setExtraParams({
                                                                //     object_id: record.get('object_id'),
                                                                //     object_meta_id: record.get('object_meta_id'),
                                                                // });
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

                                                // Ext.Msg.prompt('Rename folder', 'Folder', function (btn, value) {
                                                //     if (btn == 'ok') {
                                                //         store.sync({
                                                //             success: function () {
                                                //                 Ext.ComponentQuery.query('portcall\\.document\\.sections')[0].select(record);
                                                //                 Ext.toast('Record updated');
                                                //             }
                                                //         });
                                                //     } else {
                                                //         this.destroy();
                                                //     }
                                                // }, null, false, null, {
                                                //     viewModel: me.upVM(),
                                                //     ui: 'hovered-underline',
                                                //     cls: 'a-field-icon icon-folder',
                                                //     placeholder: 'Enter folder name',
                                                //     value: name
                                                // });
                                            },
                                        },
                                        {
                                            text: 'Download',
                                            iconCls: 'md-icon-outlined md-icon-save-alt',
                                            handler: function () {
                                                var record = this.upVM().get('record').getDocument(),
                                                    name = record.get('name'),
                                                    urlToSend =
                                                        Env.ApiEndpoint + 'file/' + record.id + '/download/' + name,
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
                                            slug: 'cdbFilesDelete',
                                            controller: 'pda-controller',
                                            bind: {
                                                permission: '{userPermissions}',
                                                disabled: '{pda.status !== "draft"}',
                                            },
                                            handler: function (me) {
                                                let record = me.upVM().get('record'),
                                                    object_record = this.upVM().get('object_record'),
                                                    controller = me.getController(),
                                                    ids = [],
                                                    store = me.up('list').getStore();
                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you would like to delete this entry?',
                                                    function (answer) {
                                                        if (answer != 'yes') return;
                                                        store.remove(record);
                                                        ids.push(record.get('id'));
                                                        controller.deleteFiles(ids, record, object_record);
                                                        // organization.load();
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
                        ],
                    },
                    listeners: {
                        childtap: function (item, location, eOpts) {
                            let record = location.record;
                            if (record && location.source.target.tagName == 'BUTTON') {
                                return false;
                            }
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            margin: '16',
            bind: {
                hidden: '{(pda.attachments.count ? false:true) || pda.status !== "draft"}',
            },
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'filebutton',
                    multiple: true,
                    text: 'Upload',
                    ui: 'normal-light medium',
                    iconCls: 'md-icon-outlined md-icon-cloud-upload',
                    name: 'files',
                    // right: 16,
                    bind: {
                        disabled: '{nonEditable}',
                    },
                    listeners: {
                        change: 'uploadFiles',
                    },
                },
                {
                    xtype: 'div',
                    margin: '0 0 0 8',
                    html: '<div class="sm-title">or drop files here</div>',
                },
            ],
        },
    ],
    listeners: {
        element: 'element',
        drop: 'onDrop',
        dragleave: 'onDragLeaveListItem',
        dragover: 'onDragOverListItem',
    },
});
