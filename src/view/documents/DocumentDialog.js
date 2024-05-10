Ext.define('Abraxa.view.documents.DocumentDialog', {
    extend: 'Ext.Dialog',
    xtype: 'document-dialog',
    controller: 'document.controller',
    cls: 'a-dialog-create a-dialog-has-icon a-dialog-docs a-drop-container a-drop-container-dark',
    ui: 'dark',
    padding: 0,
    draggable: false,
    maximizable: false,
    maximized: true,
    manageBorders: false,
    scrollable: true,
    showAnimation: null,
    id: 'document_dialog',
    viewModel: {
        formulas: {
            hideDeleteButton: {
                bind: {
                    loaded: '{viewerHasLoaded}',
                    status: '{selectedDocument.status}',
                },
                get: function (data) {
                    if (data.loaded && data.status) {
                        const deleteButton = window.document
                                .querySelectorAll('iframe[id^="webviewer"]')[0]
                                .contentWindow.document.querySelectorAll('.ActionButton[aria-label="Delete"]')[0],
                            status = data.status;

                        if (status == 'draft' && deleteButton) {
                            deleteButton.style.display = 'flex';
                        } else if (status !== 'draft' && deleteButton) {
                            deleteButton.style.display = 'none';
                        }
                    }
                },
            },
        },
    },
    tools: {
        close: {
            handler: function () {
                let selectedDocument = this.upVM().get('selectedDocument');

                if (selectedDocument && selectedDocument.get('is_changed')) {
                    Ext.Msg.confirm(
                        'Unsaved changes',
                        'Your changes have not been saved.<br>Are you sure you want to leave?',
                        function (answer) {
                            if (answer != 'yes') return;
                            if (WebViewer.getInstance()) WebViewer.getInstance().UI.dispose();
                            this.up('dialog').destroy();
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
                                text: 'Yes',
                            },
                        ]
                    );
                } else {
                    if (WebViewer.getInstance()) WebViewer.getInstance().UI.dispose();

                    this.up('dialog').destroy();
                }
            },
        },
    },
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    header: {
        padding: '8 16 8 24',
        maxHeight: 64,
        title: {
            width: 0,
            hidden: true,
        },
        items: [
            {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-badge a-badge-vouchers mr-16',
                        html: '<i class="material-icons-outlined">file_copy</i>',
                    },
                    {
                        xtype: 'div',
                        html: '<i class="md-icon md-icon-outlined c-red md-18">lock</i>',
                        margin: '4 12 0 -2',
                        hidden: true,
                        bind: {
                            hidden: '{selectedDocument.is_locked ? false : true}',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'c-white',
                        bind: {
                            hidden: '{selectedDocuments.count ? false : true}',
                            html: '<h1>{selectedDocument.name}.{selectedDocument.extension}</h1>',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'c-white',
                        bind: {
                            hidden: '{selectedDocuments.count ? true : false}',
                            html: '<h1>Documents</h1>',
                        },
                    },
                    {
                        xtype: 'container',
                        margin: '0 8',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        bind: {
                            hidden: '{selectedDocuments.count && !previewOnly ? false : true}',
                        },
                        items: [
                            {
                                xtype: 'tool',
                                ui: 'dark',
                                iconCls: 'md-icon-edit md-icon-outlined',
                                margin: 0,
                                style: 'opacity: 0.6',
                                hidden: false,
                                slug: 'portcallDocumentRename',
                                bind: {
                                    hidden: '{selectedDocument.is_locked}',
                                    cls: '{nonEditable ? "hidden" : ""}',
                                    permission: '{userPermissions}',
                                },
                                tooltip: {
                                    html: 'Rename',
                                    align: 'bc',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                },
                                handler: function (me) {
                                    let record = this.upVM().get('selectedDocument'),
                                        attachment = this.upVM().get('attachment');

                                    Ext.create('Ext.Dialog', {
                                        closable: true,
                                        alwaysOnTop: 2,
                                        viewModel: {
                                            parent: me.upVM(),
                                        },
                                        title: 'Rename document',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                labelAlign: 'top',
                                                label: 'Name',
                                                ui: '',
                                                placeholder: 'Document name',
                                                clearable: false,
                                                required: true,
                                                cls: 'a-field-icon icon-file',
                                                bind: {
                                                    value: '{selectedDocument.name}',
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
                                                        success: function (rec) {
                                                            WebViewer.getInstance().Core.documentViewer.getDocument().filename =
                                                                rec.get('name');
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
                                xtype: 'button',
                                margin: '0 8',
                                ui: 'dark status status-md',
                                slug: 'portcallDocumentStatus',
                                hidden: true,
                                bind: {
                                    ui: '{selectedDocument.status} status status-md dark',
                                    cls: 'status-{selectedDocument.status}',
                                    text: '{selectedDocument.status}',
                                    hidden: '{nonEditable || selectedDocument.hide_status || selectedDocument.status == "disabled" ? true : false}',
                                    permission: '{userPermissions}',
                                },
                                menu: {
                                    ui: 'dark',
                                    defaults: {
                                        handler: function (me) {
                                            let document = me.upVM().get('selectedDocument');

                                            if (document && document.get('is_changed')) {
                                                Ext.Msg.confirm(
                                                    'Unsaved changes',
                                                    'Your changes have not been saved.<br>Are you sure you want to change the document status?',
                                                    function (answer) {
                                                        if (answer != 'yes') {
                                                            document.set('is_changed', true);
                                                        }
                                                        if (document) {
                                                            document.set('status', me.value);
                                                            document.set('is_changed', false);
                                                        }
                                                        if (document.dirty) {
                                                            document.save({
                                                                success: function (record) {
                                                                    me.up('dialog')
                                                                        .getController()
                                                                        .lockDocument(record);
                                                                    me.up('dialog')
                                                                        .getController()
                                                                        .checkDocumentEligibleForUpdate();
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                            });
                                                        }
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
                                                            text: 'Yes',
                                                        },
                                                    ]
                                                );
                                            } else {
                                                if (document) {
                                                    document.set('status', me.value);
                                                }
                                                if (document.dirty) {
                                                    document.save({
                                                        success: function (record) {
                                                            me.up('dialog').getController().lockDocument(record);
                                                            me.up('dialog')
                                                                .getController()
                                                                .checkDocumentEligibleForUpdate();
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            }
                                        },
                                    },
                                    items: [
                                        {
                                            text: 'Draft',
                                            value: 'draft',
                                        },
                                        {
                                            text: 'Final',
                                            value: 'final',
                                        },
                                        {
                                            text: 'Issued',
                                            value: 'issued',
                                        },
                                        {
                                            text: 'Delivered on board',
                                            value: 'delivered on board',
                                        },
                                    ],
                                },
                            },
                            {
                                xtype: 'div',
                                margin: '0 8',
                                cls: 'text-truncate text-capitalize',
                                hidden: true,
                                bind: {
                                    html: '<div class="a-status-dark a-status-badge a-status-md status-{selectedDocument.status}">{selectedDocument.status}</div>',
                                    hidden: '{selectedDocument.hide_status && !selectedDocument.not_in_portcall ? false : true}',
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
    weighted: true,
    flex: 1,
    lbar: {
        xtype: 'container',
        cls: 'a-left-menu document_popup_left_menu dark a-br-dark',
        stateful: ['width', 'userCls'],
        stateId: 'documentPopupLeftMenu',
        reference: 'documentPopupLeftMenu',
        publishes: ['userCls'],
        userCls: 'is-expanded',
        scrollable: true,
        hideMode: 'offsets',
        bind: {
            hidden: '{hideLeftMenu ? true : false}',
        },
        ui: 'dark',
        layout: {
            type: 'vbox',
            align: 'stretch',
        },
        items: [
            {
                xtype: 'container',
                cls: 'a-menu-heading a-bb-dark',
                docked: 'top',
                padding: 16,
                maxHeight: 64,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'sm-heading',
                        margin: '0 8',
                        bind: {
                            html: '<h5>DOCUMENTS</h5>',
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'dark round tool-round',
                        iconCls: 'md-icon-outlined md-icon-first-page',
                        focusable: false,
                        bind: {
                            tooltip: {
                                html: '<span class="tooltip_expand">{documentPopupLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
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
                            let panel = Ext.ComponentQuery.query('[cls~=document_popup_left_menu]')[0],
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
                xtype: 'list',
                reference: 'documentsList',
                style: 'background-color: transparent',
                cls: 'a-list-dark document_dialog_list',
                selectable: {
                    deselectable: false,
                },
                scrollable: true,
                flex: 1,
                infinite: false,
                ripple: false,
                itemRipple: false,
                variableHeights: true,
                emptyText:
                    '<div class="a-inner"><div class="a-no-content-txt"><span class=" fs-13">No documents available</span></div></div>',
                itemConfig: {
                    viewModel: {},
                    padding: '0 8 0 12',
                    cls: 'cursor-pointer',
                    bind: {
                        tpl: '<div class="hbox"><span class="file-icon-new file-icon-sm-new file-icon-dark" data-type="{record.system_extension ? record.system_extension : record.extension}"></span><span class="a-file-name {documentPopupLeftMenu.userCls ? "" : "hidden"}">{record.name + "." + record.extension}</span></div>',
                        tooltip: {
                            html: '{documentPopupLeftMenu.userCls ? "" : record.name + "." + record.extension}',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                            align: 'l-r?',
                            anchor: true,
                        },
                    },
                },
                bind: {
                    store: '{selectedDocuments}',
                },
                listeners: {
                    painted: function (me) {
                        if (!me.upVM().get('documentForSelect')) {
                            me.select(me.getStore().getAt(0));
                        } else {
                            me.select(me.upVM().get('documentForSelect'));
                        }
                    },
                    select: function (list, record) {
                        list.ensureVisible(record);
                    },
                },
            },
            // {
            // 	xtype: 'container',
            // 	padding: 16,
            // 	docked: 'bottom',
            // 	layout: {
            // 		type: 'hbox',
            // 		align: 'middle',
            // 	},
            // 	items: [
            // 		{
            // 			xtype: 'filebutton',
            // 			flex: 1,
            // 			multiple: true,
            // 			accept: '.pdf',
            // 			text: 'Upload',
            // 			ui: 'action medium upload',
            // 			iconCls: 'md-icon-outlined md-icon-cloud-upload',
            // 			name: 'files',
            // 			subObject: 'documents',
            // 			bind: {
            // 				cls: '{nonEditable ? "hidden" : ""}',
            // 				objectPermission: '{objectPermissions}',
            // 				hidden: '{selectedDocument.shared_document}',
            // 			},
            // 			listeners: {
            // 				change: function (me, newValue) {
            // 					if (newValue) {
            // 						var files = this.getFiles(),
            // 							uploadController = me.up('dialog').getController(),
            // 							len = files.length;

            // 						for (var i = 0; i < len; i++) {
            // 							files.item(i).split = null;
            // 						}
            // 						uploadController.upload(files, this, true);
            // 					}
            // 					document.querySelector("input[type='file']").value = '';
            // 					me.setValue(null);
            // 				},
            // 			},
            // 		},
            // 	],
            // },
        ],
    },
    items: [
        {
            xtype: 'container',
            hidden: true,
            id: 'pedal',
            bottom: 14,
            flex: 1,
            width: '100%',
            height: 64,
            layout: {
                type: 'hbox',
                pack: 'space-around',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'container',
                    shadow: true,
                    width: 432,
                    zIndex: 999,
                    // cls: '',
                    // bottom: 32,
                    // showAnimation: {
                    //     type: 'popIn',
                    //     // direction: 'bottom'
                    // },
                    // hideAnimation: {
                    //     type: 'popOut'
                    // },
                    // centered: true,
                    cls: 'border-radius',
                    height: 52,
                    style: 'background-color: rgba(0, 41, 69, .9)',
                    padding: 12,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            padding: '6 0 4',
                            html: '<i class="md-icon-outlined md-icon-info" style="font-size: 24px; color:#FFF;"></i>',
                        },
                        {
                            xtype: 'div',
                            html: '<div class="a-no-content-txt"><span class="fs-13 c-white" style="line-height: 1.4; opacity: 1;">New data has been entered into the system.<br> Would you like to update the document?</span></div>',
                        },
                        {
                            xtype: 'container',
                            // padding: '6 7 7 7',
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-autorenew',
                                    ui: 'small action',
                                    text: 'Update',
                                    handler: async function (button) {
                                        this.up('dialog').getController().updateDocumentFields();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            zIndex: 10,
            hidden: true,
            bind: {
                hidden: '{selectedDocuments.count ? true : false}',
            },
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            centered: true,
            // html: '',
            items: [
                {
                    xtype: 'div',
                    html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No documents available<span class="fs-13">Drop PDF files or use the button</span></div></div>',
                },
                {
                    xtype: 'filebutton',
                    cls: 'a-no-content-btn',
                    text: 'Upload document',
                    ui: 'action medium',
                    iconCls: 'md-icon-outlined md-icon-cloud-upload',
                    name: 'files',
                    accept: '.pdf',
                    subObject: 'disbursements',
                    bind: {
                        cls: '{nonEditable ? "hidden" : ""}',
                        objectPermission: '{objectPermissions}',
                    },
                    listeners: {
                        change: function (me, newValue) {
                            if (newValue) {
                                var files = this.getFiles(),
                                    uploadController = me.up('dialog').getController(),
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
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            cls: 'pdf-preview a-docs-main',
            bind: {
                hidden: '{selectedDocuments.count ? false : true}',
                cls: 'pdf-preview a-docs-main {selectedDocument.is_locked ? "a-readonly" : ""}',
            },
            masked: {
                xtype: 'loadmask',
            },
            items: [
                {
                    xtype: 'container',
                    id: 'pdf-viewer',
                    listeners: {
                        painted: function () {
                            this.up('dialog').getController().loadViewer();
                            this.upVM().set('showInfoPanel', false);
                        },
                    },
                },
                {
                    xtype: 'container',
                    bottom: 16,
                    right: 16,
                    items: [
                        {
                            xtype: 'container',
                            margin: 0,
                            viewModel: {
                                formulas: {
                                    recordForApproval: {
                                        bind: {
                                            bindTo: '{selectedDocument.approvals}',
                                        },
                                        get: function (store) {
                                            if (store) {
                                                let record = this.get('selectedDocument');
                                                if (record) {
                                                    let file_id = record.get('id'),
                                                        member = this.get('member'),
                                                        currentUser = this.get('currentUser');

                                                    record_exists = store.queryBy(function (rec, id) {
                                                        return (
                                                            rec.get('assigned_company_id') ==
                                                                currentUser.get('current_company_id') &&
                                                            rec.get('approvable_id') == file_id &&
                                                            rec.get('status') == 'pending'
                                                        );
                                                    }).items;
                                                    if (record_exists.length) return record_exists[0];

                                                    return false;
                                                }
                                            }
                                        },
                                    },
                                },
                            },
                            hidden: true,
                            bind: {
                                hidden: '{recordForApproval ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                    },
                                    bind: {
                                        hidden: '{recordForApproval.status == "pending" ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 8',
                                            ui: 'danger-dark',
                                            text: 'Reject',
                                            cls: 'no_show',
                                            handler: function () {
                                                Ext.create('Abraxa.view.portcall.documents.DocumentsRejectDialog', {
                                                    viewModel: {
                                                        parent: this.upVM(),
                                                        data: {
                                                            approvals: this.upVM().get('selectedDocument.approvals'),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'confirm alt',
                                            text: 'Approve',
                                            cls: 'no_show',
                                            handler: function () {
                                                Ext.create('Abraxa.view.portcall.documents.DocumentsApproveDialog', {
                                                    viewModel: {
                                                        parent: this.upVM(),
                                                        data: {
                                                            approvals: this.upVM().get('selectedDocument.approvals'),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            text: 'Save',
                            ui: 'action medium',
                            bind: {
                                hidden: '{selectedDocument.is_locked}',
                                disabled: '{selectedDocument.is_changed ? false : true}',
                            },
                            handler: async function (me) {
                                let document = me.upVM().get('selectedDocument');
                                if (document.get('is_changed')) {
                                    const controller = me.up('dialog').getController();
                                    (documentViewer = me.up('dialog').getController().documentViewer),
                                        (annotManager = me.up('dialog').getController().annotationManager),
                                        (pageRotation = me.up('dialog').getController().pageRotation),
                                        (doc = documentViewer.getDocument()),
                                        (xfdfString = await annotManager.exportAnnotations()),
                                        (data = await doc.getFileData({
                                            // saves the document with annotations in it
                                            xfdfString,
                                        })),
                                        (arr = new Uint8Array(data)),
                                        (blob = new Blob([arr], {
                                            type: 'application/pdf',
                                        }));

                                    // doc.rotatePages([documentViewer.getCurrentPage()], pageRotation.E_90);
                                    // return;

                                    annotManager
                                        .exportAnnotations({
                                            links: false,
                                            widgets: false,
                                        })
                                        .then((xfdfString) => {
                                            // fetch('path/to/annotation/server', {
                                            //     method: 'POST',
                                            //     body: xfdfString // written into an XFDF file in server
                                            // });
                                            // Full samples are available at the end of this section.
                                        });

                                    let file = blob;
                                    let formData = new FormData();
                                    formData.append('file', file);
                                    let request = new XMLHttpRequest();
                                    request.open(
                                        'POST',
                                        Env.ApiEndpoint + 'documents/update_blob/' + document.get('id')
                                    );
                                    request.onreadystatechange = function () {
                                        if (request.readyState == XMLHttpRequest.DONE) {
                                            document.set('pdf', blob);
                                            document.set('is_changed', false);
                                            document.set('updated_at', new Date());
                                            document.save();
                                            if (!controller.documentChanges) {
                                                controller.fieldsForChange.forEach(function (field, index, object) {
                                                    const element = controller.iframeDoc.getElementById(field.element);
                                                    if (element) {
                                                        element.classList.remove('needs_change');
                                                    }
                                                });
                                            }
                                            Ext.toast('All changes have been saved');
                                        }
                                    };
                                    request.send(formData);
                                    return;
                                }
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'document-info-panel',
            ui: 'dark',
        },
    ],
    rbar: {
        bind: {
            hidden: '{needsPanel ? false : true}',
        },
        xtype: 'document-invoice-panel',
    },
    listeners: {
        element: 'element',
        drop: 'onDrop',
        dragleave: 'onDragLeaveListItem',
        dragover: 'onDragOverListItem',
    },
});
