import './DocumentsViewModel.jsx';
import './DocumentsController.jsx';
import './DocumentsList.jsx';
import './DocumentsFileInfo.jsx';
import './DocumentsSections.jsx';
import './DocumentsFolderMenu';
Ext.define('Abraxa.view.portcall.documents.DocumentsMainView', {
    extend: 'Ext.Container',
    xtype: 'documents.main',
    bodyCls: 'a-documents-list a-ops-general-info a-layout-card-wrap',
    layout: 'fit',
    flex: 1,
    viewModel: 'documents-viewmodel',
    controller: 'documents.controller',
    items: [
        {
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'fit',
                    weighted: true,
                    showNoPermissions: true,
                    slug: 'portcallDocuments',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            docked: 'top',
                            cls: 'a-bb-100',
                            weight: 2,
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-titlebar',
                                    height: 64,
                                    items: [
                                        {
                                            xtype: 'div',
                                            margin: '0 16 0 0',
                                            hidden: true,
                                            bind: {
                                                html: "<div class='a-badge a-badge-documents'><i class='md-icon-outlined'>{folderIcon}</i></div>",
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-documents-title',
                                            items: [
                                                {
                                                    xtype: 'title',
                                                    cls: 'has-dropdown',
                                                    bind: {
                                                        title: '{selectedSection.selection.name}<i class="{selectedSection.selection.is_default ? "" : "md-icon md-icon-arrow-drop-down"}"></i>',
                                                        hidden: '{nonEditable}',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            fn: function fn() {
                                                                let me = this,
                                                                    is_default = me.component
                                                                        .upVM()
                                                                        .get('selectedSection.selection.is_default');

                                                                if (!is_default) {
                                                                    Ext.create(
                                                                        'Abraxa.view.portcall.documents.DocumentsFolderMenu',
                                                                        {
                                                                            viewModel: {
                                                                                parent: me.component.upVM(),
                                                                                data: {
                                                                                    record: me.component
                                                                                        .upVM()
                                                                                        .get(
                                                                                            'selectedSection.selection'
                                                                                        ),
                                                                                    folder: me.component
                                                                                        .upVM()
                                                                                        .get(
                                                                                            'selectedSection.selection'
                                                                                        ),
                                                                                },
                                                                            },
                                                                        }
                                                                    ).showBy(this, 'tl-bl?');
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'title',
                                                    bind: {
                                                        title: '{selectedSection.selection.name}',
                                                        hidden: '{!nonEditable}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'a-subtitle folder_members_link',
                                                    bind: {
                                                        hidden: '{selectedSection.selection.is_default ? true : false}',
                                                        html: '<i class="md-icon-outlined md-icon-group"></i><a href="javascript:void(0)" class="chameleon_portcall_docs_folder_members">{memberCount} members</a>',
                                                    },
                                                    listeners: {
                                                        click: {
                                                            element: 'element',
                                                            fn: function () {
                                                                let vm = this.component.upVM(),
                                                                    menu = Ext.create(
                                                                        'Abraxa.view.portcall.MembersPreviewMenu',
                                                                        {
                                                                            viewModel: {
                                                                                parent: vm,
                                                                            },
                                                                        }
                                                                    );
                                                                menu.showBy(this);
                                                            },
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'a-subtitle a-private',
                                                    html: '<i class="md-icon-outlined md-icon-lock"></i><span>Internal only</span>',
                                                    hidden: true,
                                                    bind: {
                                                        hidden: '{selectedSection.selection.is_default ? false : true}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            cls: 'a-tools',
                                            items: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            docked: 'left',
                            cls: 'a-left-menu documents_left_menu',
                            stateful: ['width', 'userCls'],
                            stateId: 'documentsLeftMenu',
                            reference: 'documentsLeftMenu',
                            publishes: ['userCls'],
                            // userCls: 'is-expanded',
                            userCls: '',
                            scrollable: true,
                            weight: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-menu-heading',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'sm-heading',
                                            html: '<h5>Folders</h5>',
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'round',
                                            iconCls: 'md-icon-outlined md-icon-first-page',
                                            focusable: false,
                                            bind: {
                                                tooltip: {
                                                    html: '<span class="tooltip_expand">{documentsLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                    anchor: true,
                                                    align: 'bc-tc?',
                                                },
                                            },
                                            handler: function () {
                                                let panel = Ext.ComponentQuery.query('[cls~=documents_left_menu]')[0],
                                                    cls = panel.getUserCls() == 'is-expanded';

                                                if (cls != '') {
                                                    panel.setUserCls('');
                                                } else {
                                                    panel.setUserCls('is-expanded');
                                                }
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'portcall.document.sections',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            zIndex: '200',
                            id: 'dropped-container',
                            layout: {
                                type: 'vbox',
                                align: 'stretch',
                            },
                            cls: 'a-drop-container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'documents.list',
                                    bind: {
                                        store: '{filteredDocuments}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '16',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    bind: {
                                        hidden: '{selectedSection.selection.documents.count > 0 ? false:true}',
                                    },
                                    // defaults: {
                                    //     bind: {
                                    //         hidden: '{nonEditable && selectedSection.selection.is_shared ? true : false}'
                                    //     }
                                    // },
                                    items: [
                                        {
                                            xtype: 'filebutton',
                                            text: 'Upload',
                                            ui: 'normal-light medium',
                                            slug: 'portcallDocumentUpload',
                                            subObject: 'documents',
                                            controller: 'document.controller',
                                            bind: {
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                objectPermission: '{objectPermissions}',
                                                permission: '{userPermissions}',
                                            },
                                            iconCls: 'md-icon-outlined md-icon-cloud-upload',
                                            name: 'files',
                                            listeners: {
                                                change: function (me, newValue) {
                                                    if (newValue) {
                                                        var files = this.getFiles(),
                                                            uploadController = me.getController(),
                                                            len = files.length;

                                                        for (var i = 0; i < len; i++) {
                                                            files.item(i).split = null;
                                                        }
                                                        uploadController.upload(files, this);
                                                    }
                                                    document.querySelector("input[type='file']").value = '';
                                                    me.setValue(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            margin: '0 0 0 8',
                                            html: '<div class="sm-title">or drop files here</div>',
                                            slug: 'portcallDocumentUpload',
                                            subObject: 'documents',
                                            bind: {
                                                objectPermission: '{objectPermissions}',
                                                cls: '{nonEditable ? "hidden" : ""}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                    ],
                                },
                            ],
                            bind: {
                                listeners: '{documentsEditable}',
                            },
                            // listeners: {
                            //     element: 'element',
                            //     drop: "onDrop",
                            //     dragleave: "onDragLeaveListItem",
                            //     dragover: "onDragOverListItem",
                            // }
                        },
                        {
                            xtype: 'documents.file.info',
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
                },
            ],
        },
    ],
    listeners: {
        painted: function () {
            this.getController().registerDragZone();
            this.getController().registerDropZone();
        },
    },
});
