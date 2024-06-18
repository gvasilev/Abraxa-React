import './VesselController';

Ext.define('Abraxa.view.settings.library.vessels.Certificates', {
    extend: 'Ext.Container',
    xtype: 'settings.library.vessels.certificates',
    itemId: 'vesselFilesContainer',
    testId: 'vesselFilesContainer',
    controller: 'vessels.vesselcontroller',
    scrollable: true,
    flex: 1,
    weighted: true,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            id: 'vessel-files-dropped-container',
            testId: 'vesselFilesDroppedContainer',
            zIndex: '200',
            layout: {
                type: 'vbox',
            },
            cls: 'a-drop-container',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    items: [
                        {
                            xtype: 'list',
                            testId: 'vesselFilesList',
                            reference: 'vesselFilesList',
                            cls: 'a-files-grid a-grid-6',
                            height: '100%',
                            minHeight: '100',
                            ui: 'docs',
                            inline: true,
                            ripple: false,
                            style: 'cursor: pointer',
                            selectable: {
                                deselectable: true,
                            },
                            viewModel: {
                                stores: {
                                    currentAttachments: {
                                        source: '{vesselsGrid.selection.attachments}',
                                    },
                                },
                            },
                            bind: {
                                store: '{currentAttachments}',
                            },
                            emptyText: {
                                xtype: 'container',
                                zIndex: 999,
                                layout: {
                                    type: 'vbox',
                                    pack: 'middle',
                                },
                                centered: true,
                                items: [
                                    {
                                        xtype: 'div',
                                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No files available.<span class="fs-13">Drop files or use the button.</span></div></div>',
                                    },
                                    {
                                        xtype: 'filebutton',
                                        cls: 'a-no-content-btn',
                                        text: 'Upload file',
                                        testId: 'vesselFilesUploadUpperButton',
                                        ui: 'normal-light medium',
                                        iconCls: 'md-icon-outlined md-icon-cloud-upload',
                                        name: 'vesselFilesUploadUpperButton',
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
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'start',
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        cls: 'a-document-name',
                                        margin: '0 16',
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
                                                    html: '<a class="no_show file-name-documentation-grid" href="javascript:void(0)" title="{record.name}">{record.name}</a>',
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

                                                            vm.get('vesselsGrid.selection')
                                                                .attachments()
                                                                .each(function (attachment) {
                                                                    documents.push(attachment.getDocument());
                                                                });
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
                                    {
                                        xtype: 'public.updated.by',
                                        right: 50,
                                        bind: {
                                            data: {
                                                user: '{record.updated_by_user}',
                                                updated_at: '{record.updated_at}',
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        testId: 'vesselFilesMoreActionsButton',
                                        right: 10,
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
                                                    testId: 'vesselFilesRenameButton',
                                                    iconCls: 'md-icon-outlined md-icon-edit',
                                                    handler: function (me) {
                                                        let record = this.up('menu').upVM().get('record');
                                                        Ext.create('Ext.Dialog', {
                                                            closable: true,
                                                            viewModel: {
                                                                data: {
                                                                    record: record,
                                                                },
                                                            },
                                                            title: 'Rename file',
                                                            testId: 'vesselFilesRenameDialog',
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    labelAlign: 'top',
                                                                    label: 'File',
                                                                    testId: 'vesselFilesRenameFileNameField',
                                                                    clearable: false,
                                                                    ui: '',
                                                                    cls: 'a-field-icon icon-file',
                                                                    placeholder: 'File name',
                                                                    bind: {
                                                                        value: '{record.name}',
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
                                                                    testId: 'vesselFilesRenameCancelButton',
                                                                    margin: '0 8 0 0',
                                                                    handler: function () {
                                                                        record.reject();
                                                                        this.up('dialog').destroy();
                                                                    },
                                                                },
                                                                {
                                                                    text: 'Save',
                                                                    testId: 'vesselFilesRenameSaveButton',
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
                                                    testId: 'vesselFilesDownloadButton',
                                                    iconCls: 'md-icon-outlined md-icon-save-alt',
                                                    handler: function () {
                                                        var record = this.upVM().get('record').getDocument(),
                                                            name = this.upVM().get('record').get('name'),
                                                            urlToSend =
                                                                Env.ApiEndpoint +
                                                                'file/' +
                                                                record.id +
                                                                '/download/' +
                                                                name,
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
                                                    testId: 'vesselFilesDeleteButton',
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    ui: 'decline',
                                                    separator: true,
                                                    handler: function (me) {
                                                        let record = me.upVM().get('record'),
                                                            controller =
                                                                this.find('vesselFilesContainer').getController(),
                                                            ids = [],
                                                            store = me.up('list').getStore();
                                                        Ext.Msg.confirm(
                                                            'Delete',
                                                            'Are you sure you would like to delete this entry?',
                                                            function (answer) {
                                                                if (answer != 'yes') return;
                                                                store.remove(record);
                                                                ids.push(record.get('id'));
                                                                controller.deleteFiles(ids);
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
                                                                    testId: 'vesselFilesDeleteCancelButton',
                                                                },
                                                                {
                                                                    xtype: 'button',
                                                                    itemId: 'yes',
                                                                    ui: 'decline alt',
                                                                    text: 'Delete',
                                                                    testId: 'vesselFilesDeleteConfirmButton',
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
            ],
            listeners: {
                element: 'element',
                drop: 'onDrop',
                dragleave: 'onDragLeaveListItem',
                dragover: 'onDragOverListItem',
            },
        },
        {
            xtype: 'container',
            margin: '16',
            // bind: {
            //     hidden: '{vesselsGrid.selection.company_id ? false:true}',
            // },
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'filebutton',
                    multiple: true,
                    text: 'Upload',
                    testId: 'vesselFilesUploadLowerButton',
                    ui: 'normal-light medium',
                    iconCls: 'md-icon-outlined md-icon-cloud-upload',
                    name: 'vesselFilesUploadLowerButton',
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
        {
            xtype: 'settings.library.port.files.info',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            zIndex: 998,
            weight: 0,
            docked: 'right',
        },
    ],
});
