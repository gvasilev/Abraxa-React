Ext.define('Abraxa.view.portcall.documents.DocumentsSection', {
    extend: 'Ext.dataview.List',
    xtype: 'portcall.document.sections',
    id: 'documentSections',
    selectable: {
        deselectable: false,
    },
    margin: '-8 0 0 0',
    store: [],
    bind: {
        store: '{folders}',
    },
    reference: 'selectedSection',
    emptyText: {
        xtype: 'container',
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No folders available.</span></div></div>',
            },
            {
                xtype: 'button',
                cls: 'a-btn-add-section',
                text: 'Folder',
                ui: 'normal',
                slug: 'portcallDocumentCreateFolder',
                subObject: 'documents',
                bind: {
                    cls: '{nonEditable ? "hidden a-btn-add-section" : "a-btn-add-section"}',
                    permission: '{userPermissions}',
                    // objectPermission: '{objectPermissions}'
                },
                iconCls: 'md-icon-add',
                handler: function (cmp) {
                    let store = this.upVM().get('folders');

                    Ext.Msg.prompt(
                        'Create folder',
                        'Folder',
                        function (btn, value) {
                            if (btn == 'ok') {
                                let record = store.add({
                                    name: value,
                                });
                                store.sync({
                                    success: function () {
                                        cmp.up('portcall\\.document\\.sections').select(record);
                                        mixpanel.track('Documents folder button');
                                        Ext.toast('Record updated');
                                    },
                                });
                            }
                        },
                        null,
                        false,
                        null,
                        {
                            ui: '',
                            cls: 'a-field-icon icon-folder',
                            placeholder: 'Enter folder name',
                        },
                        [
                            {
                                text: 'Cancel',
                                margin: '0 8 0 0',
                                itemId: 'cancel', //Importrant for callbaack function to work if(btn == 'itemId')
                            },
                            {
                                text: 'Create',
                                ui: 'action',
                                itemId: 'ok', //Importrant for callbaack function to work if(btn == 'itemId')
                            },
                        ]
                    );
                },
            },
        ],
    },
    itemConfig: {
        viewModel: {
            formulas: {
                fileCount: {
                    bind: {
                        bindTo: {
                            documents: '{documents}',
                            refreshCount: '{refreshFolderCount}',
                        },
                    },
                    get: function (data) {
                        let count = 0,
                            folder = this.get('record');

                        data.documents.each(function (doc) {
                            if (
                                doc.getFolderFile() &&
                                doc.getFolderFile().get('document_folder_id') == folder.get('id')
                            )
                                count++;
                        });
                        return count;
                    },
                },
                selectFirst: function (get) {
                    var store = get('record.documents');

                    if (store && !this.get('selectedSection.selection')) {
                        Ext.ComponentQuery.query('portcall\\.document\\.sections')[0].select(0);
                    }
                },
                membersTpl: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            if (!record.get('is_shared')) {
                                return '<span class="sm-title lock">Internal only</span>';
                            } else {
                                return '<span class="sm-title default">' + record.members().count() + ' members</span>';
                            }
                        }
                    },
                },
            },
        },
        xtype: 'container',
        cls: 'a-folder-item chameleon_documents_folder',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'space-between',
        },
        items: [
            {
                xtype: 'div',
                cls: 'a-folder-name',
                flex: 1,
                bind: {
                    html: '<i class="icon-folder-{!record.is_shared ? "Default" : "Shared"}"></i><div class="a-title"><div class="hbox"><span class="text-truncate">{record.name}</span>({fileCount})</div> {membersTpl} </div>',
                },
            },
            {
                xtype: 'button',
                arrow: false,
                iconCls: 'md-icon-more-vert',
                ui: 'tool-md round',
                // subObject: 'documents',
                bind: {
                    cls: '{!record.is_shared  || nonEditable ? "hidden a-dropmenu" : "a-dropmenu"}',
                    // objectPermission: '{objectPermissions}'
                },
                menu: {
                    ui: 'medium has-icons',
                    items: [
                        {
                            text: 'Rename',
                            slug: 'portcallDocumentRename',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            iconCls: 'md-icon-outlined md-icon-edit',
                            handler: function (me) {
                                let store = this.upVM().get('folders'),
                                    record = this.upVM().get('record'),
                                    name = record.get('name');

                                Ext.create('Ext.Dialog', {
                                    closable: true,
                                    viewModel: {
                                        parent: me.upVM(),
                                    },
                                    title: 'Rename folder',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            labelAlign: 'top',
                                            label: 'Name',
                                            ui: '',
                                            placeholder: 'Folder name',
                                            clearable: false,
                                            cls: 'a-field-icon icon-folder',
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
                                            margin: '0 8 0 0',
                                            handler: function () {
                                                store.rejectChanges();
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            text: 'Save',
                                            ui: 'action',
                                            handler: function () {
                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated');
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
                            text: 'Delete',
                            ui: 'decline',
                            slug: 'portcallDocumentDelete',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            iconCls: 'md-icon-outlined md-icon-delete',
                            handler: function (cmp) {
                                let store = this.upVM().get('folders'),
                                    record = this.upVM().get('record');

                                Ext.Msg.show({
                                    viewModel: {
                                        parent: cmp.upVM(),
                                    },
                                    title: 'Delete',
                                    bind: {
                                        message:
                                            "{record.members.count ? \"<div style='margin-top: -16px;' class='a-info-box a-warning-box'><i class='material-icons-outlined'>report_problem</i><div class='a-info-text'><b>Warning</b><br>This folder has active members!</div></div><br>Are you sure you want to delete this folder?<br>All files will be permanently deleted.\" : \"Are you sure you want to delete this folder?<br>All files will be permanently deleted.\"}",
                                    },
                                    buttons: [
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
                                        },
                                    ],
                                    fn: function (btn) {
                                        if (btn == 'yes') {
                                            store.remove(record);
                                            store.sync({
                                                success: function () {
                                                    Ext.ComponentQuery.query(
                                                        'portcall\\.document\\.sections'
                                                    )[0].select(0);
                                                    Ext.toast('Record updated');
                                                },
                                            });
                                        }
                                    },
                                });
                            },
                        },
                    ],
                },
            },

            // {
            //     xtype: 'tool',
            //     iconCls: 'md-icon-more-vert',
            //     ui: 'tool-md round',
            //     bind: {
            //         hidden: '{!record.is_shared || nonEditable ? true : false}'
            //     },
            //     handler: function () {
            //         this.up('portcall\\.document\\.sections').select(this.upVM().get('record'));
            //         Ext.create('Abraxa.view.portcall.documents.DocumentsFolderMenu', {
            //             viewModel: {
            //                 parent: this.upVM()
            //             }
            //         }).showBy(this, 'tr-br?');
            //     }
            // },

            // {

            //     xtype: 'tool',
            //     iconCls: "md-icon-more-vert",
            //     ui: "tool-md round",
            //     bind: {
            //         hidden: '{record.is_default}'
            //     },
            //     handler: function (cmp) {
            //         let store = this.upVM().get('folders'),
            //             record = this.upVM().get('record');

            //         Ext.Msg.confirm('Delete', 'Are you sure you want to delete this section?', function (btn, value) {
            //             if (btn == 'yes') {
            //                 store.remove(record);
            //                 store.sync({
            //                     success: function () {
            //                         cmp.up('portcall\\.document\\.sections').select(0);
            //                         Ext.toast('Record updated');
            //                     }
            //                 });
            //             }
            //         });
            //     }
            // }
        ],
        bind: {
            tooltip: {
                html: '{documentsLeftMenu.userCls ? "" : record.name}',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
                // anchorToTarget: false,
                align: 'bc-tc?',
                anchor: true,
            },
        },
    },
    items: [
        {
            xtype: 'button',
            cls: 'a-btn-add-section',
            text: 'Folder',
            iconCls: 'md-icon-add',
            slug: 'portcallDocumentCreateFolder',
            ui: 'normal',
            subObject: 'documents',
            bind: {
                cls: '{nonEditable ? "hidden a-btn-add-section" : "a-btn-add-section"}',
                permission: '{userPermissions}',
                tooltip: {
                    html: '{documentsLeftMenu.userCls ? "" : "Add folder"}',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    allowOver: false,
                    closeAction: 'destroy',
                    // anchorToTarget: false,
                    align: 'bc-tc?',
                    anchor: true,
                    // target: 'container'
                    // alignDelegate: '.a-tab'
                },
                // objectPermission: '{objectPermissions}'
            },
            handler: function (cmp) {
                let store = this.upVM().get('folders');

                Ext.Msg.prompt(
                    'Create folder',
                    'Folder',
                    function (btn, value) {
                        if (btn == 'ok') {
                            let record = store.add({
                                name: value,
                                is_shared: 1,
                                documentable_id: cmp.upVM().get('object_record').get('id'),
                                documentable_type: cmp.upVM().get('object_record').get('model_name'),
                            });
                            store.sync({
                                success: function () {
                                    cmp.up('portcall\\.document\\.sections').select(record);
                                    Ext.toast('Record updated');
                                },
                            });
                        }
                    },
                    null,
                    false,
                    null,
                    {
                        ui: '',
                        clearable: false,
                        cls: 'a-field-icon icon-folder',
                        placeholder: 'Enter folder name',
                    },
                    [
                        {
                            text: 'Cancel',
                            margin: '0 8 0 0',
                            itemId: 'cancel', //Importrant for callbaack function to work if(btn == 'itemId')
                        },
                        {
                            text: 'Create',
                            ui: 'action',
                            itemId: 'ok', //Importrant for callbaack function to work if(btn == 'itemId')
                        },
                    ]
                );
            },
        },
    ],
    listeners: {
        select: function () {
            var checked = Ext.ComponentQuery.query('[cls="file-checkbox"][checked="true"]');
            Ext.Array.each(checked, function (file) {
                file.setChecked(false);
            });
        },
        childtap: function (item, location, eOpts) {
            let record = location.record;
            if (record && location.source.target.tagName == 'BUTTON') {
                return false;
            }
        },
    },
});
