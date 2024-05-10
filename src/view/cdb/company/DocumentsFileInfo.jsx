Ext.define('Abraxa.view.cdb.company.DocumentsFileInfo', {
    extend: 'Ext.Container',
    xtype: 'company.file.info',
    itemId: 'documentsFileInfo',
    testId: 'documentsFileInfo',
    cls: 'a-right-container a-documents-right-container',
    hidden: true,
    bind: {
        hidden: '{companyDocuments.selection  ? false : true}',
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
        },
        formulas: {
            noteFilter: {
                bind: {
                    bindTo: '{companyDocuments.selection}',
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
                    bindTo: '{companyDocuments.selection}',
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
                    bindTo: '{companyDocuments.selection.document}',
                    deep: true,
                },
                get: function (task) {
                    if (task) {
                        let storeUsers = this.get('users');
                        let recordUser = storeUsers.findRecord(
                            'id',
                            this.get('companyDocuments.selection.document').get('created_by_user')
                        );

                        if (recordUser) {
                            return recordUser;
                        }
                    }
                },
            },
            createdAtFormated: {
                bind: {
                    bindTo: '{companyDocuments.selection.created_at}',
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
                    bindTo: '{companyDocuments.selection.updated_at}',
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
            testId: 'documentsFileInfoTitleBar',
            height: 65,
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<div class="file-icon-new file-icon-sm-new" style="margin-right: 16px;" data-type="{companyDocuments.selection.document.extension}"></div><div><span class="a-panel-title text-truncate" style="width: 280px">{companyDocuments.selection.document.name}.{companyDocuments.selection.document.extension}</span><span class="a-panel-id">#DOC-{companyDocuments.selection.id}</span></div>',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    testId: 'documentsFileInfoActions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            testId: 'documentsFileInfoTaskCreateBtn',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-task-alt',
                            slug: 'taskCreate',
                            bind: {
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

                                let record = this.upVM().get('companyDocuments.selection'),
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
                                                object_id: 2,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM()
                                                    .get('companyDocuments.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('companyDocuments.selection').get('id'),
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
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-save-alt',
                            ui: 'round tool-round-md',
                            slug: 'portcallDocumentDownload',
                            testId: 'documentsFileInfoDocumentDownloadBtn',
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
                                var record = this.upVM().get('companyDocuments.selection').getDocument(),
                                    name = record.get('name'),
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
                            xtype: 'button',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'tool-md round',
                            arrow: false,
                            testId: 'documentsFileInfoMoreActionsBtn',
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
                                        },
                                        handler: function (me) {
                                            var record = this.upVM().get('companyDocuments.selection').getDocument();
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
                                                        testId: 'documentsFileInfoFileNameInput',
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
                                                        testId: 'documentsFileInfoFileNameCancelBtn',
                                                        margin: '0 8 0 0',
                                                        handler: function () {
                                                            record.reject();
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                    {
                                                        text: 'Save',
                                                        ui: 'action',
                                                        testId: 'documentsFileInfoFileNameSaveBtn',
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
                                        },
                                    },
                                    {
                                        text: 'Download',
                                        iconCls: 'md-icon-outlined md-icon-save-alt',
                                        testId: 'documentsFileInfoDocumentDownloadBtn',
                                        handler: function () {
                                            var record = this.upVM().get('companyDocuments.selection').getDocument(),
                                                name = record.get('name'),
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
                                        testId: 'documentsFileInfoDocumentDeleteBtn',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        ui: 'decline',
                                        separator: true,
                                        slug: 'cdbFilesDelete',
                                        bind: {
                                            permission: '{userPermissions}',
                                        },
                                        handler: function (me) {
                                            let record = this.upVM().get('companyDocuments.selection'),
                                                controller = this.find('cdbDocuments').getController(),
                                                organization = this.upVM().get('object_record'),
                                                ids = [],
                                                store = Ext.ComponentQuery.query('[cls~=a-files-grid]')[0].getStore();
                                            Ext.Msg.confirm(
                                                'Delete',
                                                'Are you sure you would like to delete this entry?',
                                                function (answer) {
                                                    if (answer != 'yes') return;
                                                    store.remove(record);
                                                    ids.push(record.get('id'));
                                                    controller.deleteFiles(ids);
                                                    // organization.load();
                                                    me.up('[xtype=company\\.file\\.info]').hide();
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
                            testId: 'documentsFileInfoCloseBtn',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let grid = Ext.ComponentQuery.query('[cls~=a-files-grid]')[0];

                                grid.deselectAll();
                                me.up('[xtype=company\\.file\\.info]').hide();
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
            testId: 'documentsFileInfoDetails',
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
                                    testId: 'documentsFileInfoFileNameLabel',
                                    html: 'Name',
                                },
                                {
                                    xtype: 'div',
                                    testId: 'documentsFileInfoFileSelection',
                                    flex: 1,
                                    cls: 'text-truncate',
                                    bind: {
                                        html: '{companyDocuments.selection.document.name}.{companyDocuments.selection.document.extension}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            slug: 'portcallDocumentStatus',
                            testId: 'documentsFileInfoDocumentStatus',
                            bind: {
                                hidden: '{companyDocuments.selection.status ? false : true}',
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
                                        html: '<div class="a-status-badge a-status-md status-{companyDocuments.selection.status}">{companyDocuments.selection.status}</div>',
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
                                        html: '{companyDocuments.selection.document.size}',
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
                                            user: '{companyDocuments.selection.document.created_by_user}',
                                            updated_at: '{companyDocuments.selection.document.created_at}',
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
                                            user: '{companyDocuments.selection.document.updated_by_user}',
                                            updated_at: '{companyDocuments.selection.document.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    testId: 'documentsFileInfoTasksContainer',
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
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'documentsFileInfoTasksList',
                            minHeight: 120,
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    testId: 'documentsFileInfoCommentsContainer',
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
                    docked: 'bottom',
                    testId: 'documentsFileInfoCommentsInput',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{companyDocuments.selection}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});
