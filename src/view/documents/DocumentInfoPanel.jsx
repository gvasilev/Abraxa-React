Ext.define('Abraxa.view.documents.DocumentInfoPanel', {
    extend: 'Ext.Container',
    xtype: 'document-info-panel',
    itemId: 'documentInfoPanel',
    cls: 'a-docs-panel a-documents-right-container a-bl-dark',
    maxWidth: 540,
    hidden: true,
    bind: {
        hidden: '{showInfoPanel ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        stores: {
            internalApprovals: {
                source: '{selectedDocument.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{selectedDocument.id}',
                    model: '{selectedDocument.model_name}',
                },
                filters: '{internalApprovalFilter}',
            },
            externalApprovals: {
                source: '{selectedDocument.approvals}',
                groupField: 'assigned_company_id',
                sorters: [
                    {
                        property: 'created_at',
                        direction: 'ASC',
                    },
                ],
                extraParams: {
                    model_id: '{selectedDocument.id}',
                    model: '{selectedDocument.model_name}',
                },
                filters: '{externalApprovalFilter}',
            },
            approvals: {
                source: '{selectedDocument.approvals}',
            },
        },
        formulas: {
            documentFolder: {
                bind: {
                    bindTo: '{selectedDocument}',
                    deep: true,
                },
                get: function (doc) {
                    if (doc && doc.document) {
                        let folderFile = doc.getFolderFile();
                        if (folderFile) {
                            return folderFile.get('folder');
                        }
                        return false;
                    }
                    return false;
                },
            },
            internalApprovalFilter: {
                bind: {
                    bindTo: '{selectedDocument}',
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
                    bindTo: '{selectedDocument}',
                    deep: true,
                },
                get: function (record) {
                    let member = this.get('member'),
                        currentUser = this.get('currentUser'),
                        store = this.get('approvals');

                    if (store) store.clearFilter();

                    if (member) {
                        return function (record) {
                            if (
                                record.get('company_id') == currentUser.get('current_company_id') ||
                                record.get('assigned_company_id') != currentUser.get('current_company_id')
                            ) {
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
                    bindTo: '{selectedDocument}',
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
                    bindTo: '{selectedDocument}',
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
                    bindTo: '{selectedDocument}',
                    deep: true,
                },
                get: function (task) {
                    if (task) {
                        let recordUser = Ext.getStore('userStore').findRecord(
                            'id',
                            this.get('selectedDocument').get('created_by_user')
                        );

                        if (recordUser) {
                            return recordUser;
                        }
                    }
                },
            },
            createdAtFormated: {
                bind: {
                    bindTo: '{selectedDocument.created_at}',
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
                    bindTo: '{selectedDocument.updated_at}',
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
            cls: 'a-titlebar',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="file-icon-new file-icon-sm-new file-icon-dark" style="margin-right: 16px;" data-type="{selectedDocument.system_extension ? selectedDocument.system_extension : selectedDocument.extension}"></div><div><span class="a-panel-title text-truncate" style="width: 280px">{selectedDocument.name}</span><span class="a-panel-id">#DOC-{selectedDocument.id}</span></div>',
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
                            ui: 'dark round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                me.up('dialog').upVM().set('showInfoPanel', false);
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
                    padding: '0 0 16 0',
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
                                        html: '{selectedDocument.name}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            slug: 'portcallDocumentStatus',
                            bind: {
                                hidden: '{selectedDocument.hide_status ? true : false}',
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
                                        html: '<div class="a-status-dark a-status-badge a-status-md status-{selectedDocument.status}">{selectedDocument.status}</div>',
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
                                        html: '{selectedDocument.size}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            bind: {
                                hidden: '{!documentFolder ? true : false}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Folder',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'text-truncate hbox',
                                    bind: {
                                        html: '<i class="md-icon-outlined {documentFolder.is_default ? "md-icon-folder" : "md-icon-folder-shared"} md-24"></i><span class="fw-b ml-8">{documentFolder.name}</span>',
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
                                    bind: {
                                        data: {
                                            user: '{selectedDocument.created_by_user}',
                                            updated_at: '{selectedDocument.created_at}',
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
                                    bind: {
                                        data: {
                                            user: '{selectedDocument.updated_by_user}',
                                            updated_at: '{selectedDocument.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-approvals-dialog a-approvals a-bt-dark',
                    bind: {
                        hidden: '{internalApprovals.count || externalApprovals.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            padding: '0 24',
                            html: '<h3 class="my-16">Approvals</h3>',
                        },
                        {
                            xtype: 'div',
                            padding: '0 0 0 24',
                            html: '<h5 class="my-0">Internal approvals</h5>',
                            bind: {
                                hidden: '{internalApprovals.count ? false:true}',
                            },
                        },
                        {
                            xtype: 'abraxa.formlist',
                            cls: 'a-documents-approvals-list a-list-dark',
                            padding: '0 8',
                            bind: {
                                store: '{internalApprovals}',
                                hidden: '{internalApprovals.count ? false:true}',
                            },
                            variableHeights: true,
                            groupHeader: {
                                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                                    memberName: function (record) {
                                        let store = Ext.ComponentQuery.query(
                                                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company')
                                                    .type + 'portcall\\.main'
                                            )[0]
                                                .upVM()
                                                .get('members'),
                                            member = store.getById(record.member_id);
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
                                                let store = this.get('internalApprovals'),
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
                                                bind: {
                                                    value: '<div class="approval-text approval-pending">Sent for approval</div>',
                                                    cls: 'a-approval-note a-approval-reason pending',
                                                    html: '<div class="a-approval-em"><em>{record.comment}</em></div>',
                                                },
                                            },
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-avatar',
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
                                                        bind: {
                                                            value: '<div class="approval-text approval-{record.status}">{record.status:capitalize}</div>',
                                                            cls: 'a-approval-note a-approval-reason {record.status}',
                                                            html: '<div class="a-approval-em"><em>{record.status == "approved" ? record.approved_reason : record.rejected_reason}</em></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'public.updated.by',
                                                        cls: 'a-approval-avatar',
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
                                                        text: 'Cancel request',
                                                        margin: '14 14 0 0',
                                                        bind: {
                                                            hidden: '{!disableDelete}',
                                                        },
                                                        arrow: false,
                                                        handler: function (me) {
                                                            Ext.create('Abraxa.view.approval.CancelApprovalDialog', {
                                                                viewModel: {
                                                                    data: {
                                                                        recordForApproval: me.upVM().get('record'),
                                                                        approvals: me
                                                                            .upVM()
                                                                            .get('selectedDisbursement.approvals'),
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
                        {
                            xtype: 'div',
                            padding: '0 0 0 24',
                            html: '<h5 class="my-0">External approvals</h5>',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                            },
                        },
                        {
                            xtype: 'abraxa.formlist',
                            cls: 'a-documents-approvals-list a-list-dark',
                            ui: 'dark',
                            padding: '0 8',
                            bind: {
                                hidden: '{externalApprovals.count ? false:true}',
                                store: '{externalApprovals}',
                            },
                            variableHeights: true,
                            groupHeader: {
                                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                                    memberName: function (record) {
                                        let store = Ext.ComponentQuery.query(
                                                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company')
                                                    .type + 'portcall\\.main'
                                            )[0]
                                                .upVM()
                                                .get('members'),
                                            member = store.getById(record.member_id);
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
                                ui: 'dark',
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        ui: 'dark',
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
                                                bind: {
                                                    value: '<div class="approval-text approval-pending">Sent for approval</div>',
                                                    cls: 'a-approval-note a-approval-reason pending',
                                                    html: '<div class="a-approval-em"><em>{record.comment}</em></div>',
                                                },
                                            },
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-avatar',
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
                                        ui: 'dark',
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
                                                        bind: {
                                                            value: '<div class="approval-text approval-{record.status}">{record.status:capitalize}</div>',
                                                            cls: 'a-approval-note a-approval-reason {record.status}',
                                                            html: '<div class="a-approval-em"><em>{record.status == "approved" ? record.approved_reason : record.rejected_reason}</em></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'public.updated.by',
                                                        cls: 'a-approval-avatar',
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
                                                ui: 'dark',
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
                                                        margin: '14 14 0 0',
                                                        arrow: false,
                                                        handler: function (me) {
                                                            Ext.create('Abraxa.view.approval.CancelApprovalDialog', {
                                                                viewModel: {
                                                                    data: {
                                                                        recordForApproval: me.upVM().get('record'),
                                                                        approvals: me
                                                                            .upVM()
                                                                            .get('selectedDisbursement.approvals'),
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
            ],
        },
    ],
});
