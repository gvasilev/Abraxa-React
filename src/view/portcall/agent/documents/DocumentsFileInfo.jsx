import './DocumentsEditButton';
import '../../../approval/SendForApprovalDialog';

Ext.define('Abraxa.view.portcall.documents.DocumentsFileInfo', {
    extend: 'Ext.Container',
    xtype: 'documents.file.info',
    itemId: 'documentsFileInfo',
    testId: 'documentsFileInfo',
    cls: 'a-right-container a-documents-right-container',
    hidden: true,
    bind: {
        hidden: '{documentList.selection && !documentList.selection.is_checked ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
            internalApprovals: {
                source: '{documentList.selection.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{documentList.selection.id}',
                    model: '{documentList.selection.model_name}',
                },
                filters: '{internalApprovalFilter}',
            },
            externalApprovals: {
                source: '{documentList.selection.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{documentList.selection.id}',
                    model: '{documentList.selection.model_name}',
                },
                filters: '{externalApprovalFilter}',
            },
            approvals: {
                source: '{documentList.selection.approvals}',
            },
        },
        formulas: {
            internalApprovalFilter: {
                bind: {
                    bindTo: '{documentList.selection}',
                    deep: true,
                },
                get: function (record) {
                    let member = this.get('member'),
                        currentUser = this.get('currentUser'),
                        store = this.get('approvals');

                    if (store) store.clearFilter();

                    if (member) {
                        return function (record) {
                            return false;
                        };
                    } else {
                        return function (record) {
                            if (
                                record.get('company_id') == currentUser.get('current_company_id') &&
                                record.get('assigned_company_id') == currentUser.get('current_company_id')
                            ) {
                                return true;
                            }
                        };
                    }
                },
            },
            externalApprovalFilter: {
                bind: {
                    bindTo: '{documentList.selection}',
                    deep: true,
                },
                get: function (record) {
                    let member = this.get('member'),
                        currentUser = this.get('currentUser'),
                        store = this.get('approvals');

                    if (store) store.clearFilter();

                    if (member) {
                        return function (record) {
                            if (record.get('assigned_company_id') == currentUser.get('current_company_id')) {
                                return true;
                            }
                        };
                    } else {
                        return function (record) {
                            if (
                                record.get('company_id') == currentUser.get('current_company_id') &&
                                record.get('assigned_company_id') != currentUser.get('current_company_id')
                            ) {
                                return true;
                            }
                        };
                    }
                },
            },
            noteFilter: {
                bind: {
                    bindTo: '{documentList.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('comments');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('noteable_type') == record.get('model_name') &&
                                rec.get('noteable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            taskFilter: {
                bind: {
                    bindTo: '{documentList.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('objectTasks');
                        if (store) store.clearFilter();

                        return function (rec) {
                            if (
                                rec.get('taskable_type') == record.get('model_name') &&
                                rec.get('taskable_id') == record.get('id')
                            ) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return true;
                        };
                    }
                },
            },
            created_by: {
                bind: {
                    bindTo: '{documentList.selection.document}',
                    deep: true,
                },
                get: function (task) {
                    if (task) {
                        let storeUsers = this.get('users');
                        let recordUser = storeUsers.findRecord(
                            'id',
                            this.get('documentList.selection').get('created_by_user')
                        );

                        if (recordUser) {
                            return recordUser;
                        }
                    }
                },
            },
            createdAtFormated: {
                bind: {
                    bindTo: '{documentList.selection.created_at}',
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
                    bindTo: '{documentList.selection.updated_at}',
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
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 65,
            items: [
                {
                    xtype: 'title',
                    testId: 'documentsFileInfoTitle',
                    bind: {
                        title: '<div class="file-icon-new file-icon-sm-new" style="margin-right: 16px;" data-type="{documentList.selection.system_extension ? documentList.selection.system_extension : documentList.selection.extension}"></div><div><span class="a-panel-title text-truncate" style="width: 280px">{documentList.selection.name}.{documentList.selection.extension}</span><span class="a-panel-id">#DOC-{documentList.selection.id}</span></div>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    testId: 'documentsFileInfoActionsContainer',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'documentsFileInfoAddTaskButton',
                            bind: {
                                disabled: '{object_record.is_archived ? true : false}',
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add task',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let record = this.upVM().get('documentList.selection'),
                                    subObjects = this.upVM().get('subObjects'),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject.id,
                                            relatedObject: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM()
                                                    .get('documentList.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('documentList.selection').get('id'),
                                                priority: 'normal',
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            hidden: true,
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-check-circle',
                            ui: 'round tool-round-md',
                            slug: 'portcallDocumentApproval',
                            testId: 'documentsFileInfoApprovalButton',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Send for approval',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                            },
                            handler: function () {
                                this.upVM().set('selectedFiles', [this]);
                                Ext.create('Abraxa.view.portcall.documents.SendForApprovalDialog', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            folder: this.upVM().get('selectedSection.selection'),
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-save-alt',
                            ui: 'round tool-round-md',
                            slug: 'portcallDocumentDownload',
                            testId: 'documentsFileInfoDownloadButton',
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
                                var record = this.upVM().get('documentList.selection'),
                                    name = this.upVM().get('documentList.selection').get('name'),
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
                            xtype: 'documents.edit.button',
                            subObject: 'documents',
                            testId: 'documentsFileInfoEditButton',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                                viewModel: {
                                    data: {
                                        record: '{documentList.selection}',
                                    },
                                },
                            },
                        },
                        {
                            // xtype: 'documents.edit.button.shared',
                            // bind: {
                            //     viewModel: {
                            //         data: {
                            //             record: '{documentList.selection}'
                            //         }
                            //     },
                            // }
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'documentsFileInfoExpandHideButton',
                            handler: function (me) {
                                let grid = Ext.ComponentQuery.query('documents\\.list')[0];

                                grid.deselectAll();
                                me.up('[xtype=documents\\.file\\.info]').hide();
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
                        // {
                        //         xtype: 'container',
                        //         items: [{
                        //             xtype: 'label',
                        //             html: 'Bill to',
                        //         }, {
                        //             xtype: 'div',
                        //             flex: 1,
                        //             cls: 'text-truncate hbox',
                        //             bind: {
                        //                 html: '<i class="md-icon-outlined c-light-grey md-18 mr-12">corporate_fare</i><a href="">Cargill International S.A.</a>'
                        //             }
                        //         }]
                        //     },
                        //     {
                        //         xtype: 'container',
                        //         items: [{
                        //             xtype: 'label',
                        //             html: 'Care of (C/o)',
                        //         }, {
                        //             xtype: 'div',
                        //             flex: 1,
                        //             cls: 'text-truncate hbox',
                        //             bind: {
                        //                 html: '<i class="md-icon-outlined c-light-grey md-18 mr-12">business_center</i><a href="">Abraxa Shipping Ltd.</a>'
                        //             }
                        //         }]
                        //     },
                        //     {
                        //         xtype: 'container',
                        //         items: [{
                        //             xtype: 'label',
                        //             html: 'Invoice number',
                        //         }, {
                        //             xtype: 'div',
                        //             flex: 1,
                        //             cls: 'text-truncate hbox',
                        //             bind: {
                        //                 html: '<i class="md-icon-outlined c-light-grey md-18 mr-12">short_text</i><span>CR-7349185629</span>'
                        //             }
                        //         }]
                        //     },
                        //     {
                        //         xtype: 'div',
                        //         cls: '',
                        //         html: '<hr class="my-16">'
                        //     },
                        //     {
                        //         xtype: 'container',
                        //         items: [{
                        //             xtype: 'label',
                        //             html: 'Related cargo',
                        //         }, {
                        //             xtype: 'div',
                        //             flex: 1,
                        //             cls: 'text-truncate hbox a-cargo-row',
                        //             bind: {
                        //                 html: '<div class="a-cargo fw-b"><span class="text-truncate">Cargo 1 - 222 mts - Acrylonitrile</span><span class="a-function a-function-sm function-Loading" title="Loading">L</span></div>'
                        //             }
                        //         }]
                        //     },
                        //     {
                        //         xtype: 'div',
                        //         cls: '',
                        //         html: '<hr class="my-16">'
                        //     },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Name',
                                    testId: 'documentsFileInfoNameLabel',
                                },
                                {
                                    xtype: 'div',
                                    flex: 1,
                                    cls: 'text-truncate',
                                    testId: 'documentsFileInfoNameDiv',
                                    bind: {
                                        html: '{documentList.selection.name}.{documentList.selection.extension}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            slug: 'portcallDocumentStatus',
                            testId: 'documentsFileInfoStatusContainer',
                            bind: {
                                hidden: '{documentList.selection.status ? false : true}',
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Status',
                                    testId: 'documentsFileInfoStatusLabel',
                                },
                                {
                                    xtype: 'div',
                                    testId: 'documentsFileInfoStatusDiv',
                                    cls: 'text-truncate text-capitalize',
                                    bind: {
                                        html: '<div class="a-status-badge a-status-md status-{documentList.selection.status}">{documentList.selection.status}</div>',
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
                                    testId: 'documentsFileInfoSizeLabel',
                                },
                                {
                                    xtype: 'div',
                                    testId: 'documentsFileInfoSizeDiv',
                                    cls: 'text-truncate',
                                    bind: {
                                        html: '{documentList.selection.size}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Folder',
                                    testId: 'documentsFileInfoFolderLabel',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'text-truncate hbox',
                                    testId: 'documentsFileInfoFolderDiv',
                                    bind: {
                                        html: '<i class="md-icon-outlined {selectedSection.selection.is_default ? "md-icon-folder" : "md-icon-folder-shared"} md-24"></i><span class="fw-b ml-8">{selectedSection.selection.name}</span>',
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
                                    testId: 'documentsFileInfoCreatedByLabel',
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    testId: 'documentsFileInfoCreatedByDiv',
                                    bind: {
                                        data: {
                                            user: '{documentList.selection.created_by_user}',
                                            updated_at: '{documentList.selection.created_at}',
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
                                    testId: 'documentsFileInfoUpdatedByLabel',
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    testId: 'documentsFileInfoUpdatedByDiv',
                                    bind: {
                                        data: {
                                            user: '{documentList.selection.updated_by_user}',
                                            updated_at: '{documentList.selection.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-approvals-dialog a-approvals',
                    bind: {
                        hidden: '{internalApprovals.count || externalApprovals.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'documentsFileInfoApprovalsTitle',
                                    title: '<div><span class="a-panel-title">Approvals</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            padding: '0 0 0 24',
                            html: '<h5 class="my-0">Internal approvals</h5>',
                            testId: 'documentsFileInfoInternalApprovalsTitle',
                            bind: {
                                hidden: '{internalApprovals.count ? false:true}',
                            },
                        },
                        {
                            xtype: 'div',
                            padding: '0 0 0 24',
                            html: '<h5 class="my-0">External approvals</h5>',
                            testId: 'documentsFileInfoExternalApprovalsTitle',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                            },
                        },
                        {
                            xtype: 'abraxa.formlist',
                            cls: 'a-documents-approvals-list',
                            padding: '0 8',
                            testId: 'documentsFileInfoApprovalsList',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                                store: '{externalApprovals}',
                            },
                            variableHeights: true,
                            groupHeader: {
                                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                                    memberName: function (record) {
                                        return (
                                            '<div class="party-item"><div class="sm-function"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">' +
                                            record.company.name +
                                            '</a><div class="sm-type">' +
                                            record.company.email +
                                            '</div></div>'
                                        );
                                    },
                                }),
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        isLast: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let store = this.get('externalApprovals'),
                                                    groups = store.getGroups().items,
                                                    index,
                                                    res = false;

                                                Ext.Array.each(groups, function (group) {
                                                    if (group.indexOf(record) + 1 == group.count()) res = true;
                                                });
                                                return res;
                                            },
                                        },
                                        member: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let store = this.get('members'),
                                                    member = store.getById(record.get('member_id'));
                                                return member;
                                            },
                                        },
                                        icon: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    let status = record.get('status'),
                                                        icon = 'help_outline',
                                                        color = '#b0bec5';

                                                    switch (status) {
                                                        case 'approved':
                                                            icon = 'check_circle';
                                                            color = '#22b14c';
                                                            break;
                                                        case 'rejected':
                                                            icon = 'cancel';
                                                            color = '#e91e63';
                                                            break;
                                                    }

                                                    return {
                                                        icon: icon,
                                                        color: color,
                                                    };
                                                }
                                            },
                                        },
                                        updatedAtApprovals: {
                                            bind: {
                                                bindTo: '{record.updated_at}',
                                                deep: true,
                                            },
                                            get: function (date) {
                                                if (date) {
                                                    return Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .parseMomentDate(
                                                            date,
                                                            AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                                        );
                                                } else {
                                                    return '';
                                                }
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        bind: {
                                            cls: 'a-approval-item {isLast && record.status == "pending" ? "x-last" : ""}',
                                        },
                                        margin: '0',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                labelAlign: 'top',
                                                flex: 1,
                                                encodeHtml: false,
                                                testId: 'documentsFileInfoSentForApprovalField',
                                                bind: {
                                                    value: '<div class="approval-text approval-pending">Sent for approval</div>',
                                                    cls: 'a-approval-note a-approval-reason pending',
                                                    html: '<div class="a-approval-em"><em>{record.comment}</em></div>',
                                                },
                                            },
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-avatar',
                                                testId: 'documentsFileInfoSentForApprovalAvatar',
                                                bind: {
                                                    data: {
                                                        user: '{record.created_by_user}',
                                                        updated_at: '{record.created_at}',
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'container',
                                        bind: {
                                            cls: 'a-approval-item {record.status != "pending" && isLast ? "x-last" : ""}',
                                        },
                                        margin: '0',
                                        items: [
                                            {
                                                xtype: 'container',
                                                hidden: true,
                                                flex: 1,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                bind: {
                                                    hidden: '{record.status != "pending" ? false : true}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'displayfield',
                                                        labelAlign: 'top',
                                                        flex: 1,
                                                        encodeHtml: false,
                                                        testId: 'documentsFileInfoApprovalStatusField',
                                                        bind: {
                                                            value: '<div class="approval-text approval-{record.status}">{record.status:capitalize}</div>',
                                                            cls: 'a-approval-note a-approval-reason {record.status}',
                                                            html: '<div class="a-approval-em"><em>{record.status_reason}</em></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'public.updated.by',
                                                        cls: 'a-approval-avatar',
                                                        testId: 'documentsFileInfoApprovalUpdatedByAvatar',
                                                        bind: {
                                                            data: {
                                                                user: '{record.updated_by_user}',
                                                                updated_at: '{record.updated_at}',
                                                            },
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                hidden: true,
                                                flex: 1,
                                                bind: {
                                                    hidden: '{record.status == "pending" ? false : true}',
                                                },
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'end',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'danger-light small',
                                                        hidden: true,
                                                        bind: {
                                                            hidden: '{record.company_id != currentUser.current_company_id ? true : false}',
                                                        },
                                                        text: 'Cancel request',
                                                        testId: 'documentsFileInfoCancelApprovalButton',
                                                        margin: '14 14 0 0',
                                                        arrow: false,
                                                        handler: function (me) {
                                                            Ext.create('Abraxa.view.approval.CancelApprovalDialog', {
                                                                viewModel: {
                                                                    data: {
                                                                        recordForApproval: me.upVM().get('record'),
                                                                        approvals: me
                                                                            .upVM()
                                                                            .get('documentList.selection.approvals'),
                                                                    },
                                                                },
                                                            }).show();
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    hidden: true,
                    slug: 'task',
                    bind: {
                        hidden: '{objectTasks.count ? false : true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'documentsFileInfoTasksTitle',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            minHeight: 120,
                            testId: 'documentsFileInfoTasksList',
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    slug: 'portcallNotes',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'documentsFileInfoNotesTitle',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'documentsFileInfoCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'documentsFileInfoCommentsInput',
                    docked: 'bottom',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{documentList.selection}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});
