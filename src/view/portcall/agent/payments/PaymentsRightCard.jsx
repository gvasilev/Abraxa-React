import './IncomingRightContent';
import './OutgoingRightContent';

Ext.define('Abraxa.view.portcall.payments.PaymentsRightCard', {
    extend: 'Ext.Container',
    xtype: 'payments.right.card',
    itemId: 'paymentsRightCard',
    testId: 'paymentsRightCard',
    cls: 'a-right-container a-payment-right-container',
    hidden: true,
    bind: {
        hidden: '{paymentGrid.selection && paymentsMenu.selection.tab != "drafts" ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        data: {
            nonEditable: true,
        },
        stores: {
            comments: {
                source: '{notes}',
                filters: '{noteFilter}',
            },
            objectTasks: {
                source: '{tasks}',
                filters: '{taskFilter}',
            },
            paymentVirtualAccounts: {
                source: '{organizations}',
                filters: '{paymentVirtualFilter}',
            },
            incomingBanksStore: {
                type: 'organizationVirtualAccounts',
                autoLoad: true,
                proxy: {
                    extraParams: {
                        org_id: '{incomingPayment.selection.org_id}',
                    },
                },
                grouper: {
                    groupFn: function (record) {
                        return record.get('type');
                    },
                },
                updateProxy: function (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function () {
                                if (this.getProxy().getExtraParams().org_id) this.load();
                            },
                            this
                        );
                    }
                },
            },
            outgoingBanksStore: {
                type: 'organizationVirtualAccounts',
                autoLoad: true,
                proxy: {
                    extraParams: {
                        org_id: '{outgoingPayment.selection.org_id}',
                    },
                },
                grouper: {
                    groupFn: function (record) {
                        return record.get('type');
                    },
                },
                updateProxy: function (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function () {
                                if (this.getProxy().getExtraParams().org_id) this.load();
                            },
                            this
                        );
                    }
                },
            },
        },
        formulas: {
            paymentVirtualFilter: {
                bind: {
                    bindTo: '{billingParty.selection.org_id}',
                },
                get: function (org_id) {
                    if (org_id) {
                        let store = this.get('paymentVirtualAccounts');

                        if (store) store.clearFilter();

                        return function (rec) {
                            if (rec.get('org_id') == org_id) {
                                return true;
                            }
                        };
                    } else {
                        return function (item) {
                            return false;
                        };
                    }
                },
            },
            rightContent: {
                bind: {
                    bindTo: '{payment.kind}',
                    deep: true,
                },
                get: function (kind) {
                    if (kind == 'incoming') {
                        return {
                            xtype: 'incoming.right.content',
                        };
                    }
                    if (kind == 'outgoing') {
                        return {
                            xtype: 'outgoing.right.content',
                        };
                    }
                    if (kind == 'requested') {
                        return {
                            xtype: 'request.right.content',
                        };
                    }
                },
            },
            payment: {
                bind: {
                    bindTo: '{paymentGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    return record;
                },
            },
            noteFilter: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.isModel) {
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
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.isModel) {
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
            dialogTitle: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.isModel) {
                        let title = '';
                        switch (record.get('kind')) {
                            case 'incoming':
                                title =
                                    '<div class="a-badge a-badge-incoming"><i class="md-icon-outlined md-icon-add c-green-500"></i></div><div><span class="a-panel-id">Payment from</span><span class="a-panel-title">' +
                                    record.get('org_name') +
                                    '</span></div>';
                                break;
                            case 'outgoing':
                                title =
                                    '<div class="a-badge a-badge-outgoing"><i class="md-icon-outlined md-icon-remove c-red"></i></div><div><span class="a-panel-id">Payment to</span><span class="a-panel-title">' +
                                    record.get('org_name') +
                                    '</span></div>';
                                break;
                            case 'requested':
                                title =
                                    '<div class="a-badge a-badge-requested"><i class="md-icon-outlined md-icon-inventory c-yellow-500"></i></div><div><span class="a-panel-id">Request payment</span><span class="a-panel-title">Company name</span></div>';
                                break;
                            default:
                                break;
                        }
                        return title;
                    } else {
                        return '';
                    }
                },
            },
            files: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (record) {
                    if (record && record.isModel) {
                        return record.attachments();
                    }
                },
            },
            showFiles: {
                bind: {
                    bindTo: '{files.count}',
                    deep: true,
                },
                get: function (count) {
                    if (count) {
                        return false;
                    }
                    return true;
                },
            },
            itemTemplate: {
                bind: {
                    bindTo: '{object_record.is_archived}',
                    deep: true,
                },
                get: function (live) {
                    if (live) {
                        return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}</a><span class="sm-title">{document.size}</span></div></div>';
                    }
                    return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}</a><span class="sm-title">{document.size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>';
                },
            },
            showExchangeRate: {
                bind: {
                    payment_currency: '{payment.currency}',
                    account_currency: '{accountMainCombo.selection.account_currency}',
                },
                get: function (data) {
                    if (data.payment_currency && data.account_currency) {
                        if (data.payment_currency != data.account_currency) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                    return true;
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{dialogTitle}',
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
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'paymentsRightCardTaskCreateBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
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

                                let record = this.upVM().get('payment'),
                                    subObjects = this.upVM().get('subObjects');

                                let subObject = Ext.Array.filter(subObjects, function (rec) {
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
                                                taskable_type: this.upVM().get('payment').get('model_name'),
                                                taskable_id: this.upVM().get('payment').get('id'),
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
                            xtype: 'filebutton',
                            ui: 'round tool-round-md',
                            text: '',
                            slug: 'portcallPaymentАttachment',
                            testId: 'paymentsRightCardAttachmentBtn',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            accept: '.pdf',
                            iconCls: 'md-icon-attach-file',
                            tooltip: {
                                showOnTap: true,
                                html: 'Attach file',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            listeners: {
                                change: function (me, newValue) {
                                    if (newValue) {
                                        var files = this.getFiles(),
                                            len = files.length,
                                            ext,
                                            record = me.upVM().get('payment'),
                                            fileStore = record.attachments(),
                                            controller = Ext.ComponentQuery.query(
                                                'container[reference=paymentsMainView]'
                                            )[0].getController(),
                                            totalSize = 0;

                                        for (var i = 0; i < len; i++) {
                                            totalSize += files.item(i).size;
                                            ext = files.item(i).name.split('.').pop();
                                            let record = {
                                                document: {
                                                    extension: ext,
                                                    original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                                                    file: files.item(i),
                                                    size: files.item(i).size,
                                                },
                                            };
                                            fileStore.add(record);
                                        }
                                        fileStore.needsSync = false;
                                        if (totalSize > 10 * 1024 * 1024) {
                                            Ext.Msg.warning(
                                                'Upload Cancelled',
                                                'Your file(s) payload size (' +
                                                    (totalSize / 1024 / 1024).toFixed(2) +
                                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
                                            );
                                            return;
                                        }
                                        controller.upload(fileStore, record).then(function (result) {
                                            if (result) {
                                                Ext.toast('File uploaded', 1000);
                                                record.load();
                                            } else {
                                                Ext.Msg.warning(
                                                    'Unsupported file format',
                                                    'The file format you are trying to upload is not supported'
                                                );
                                                fileStore.rejectChanges();
                                            }
                                        });
                                    }
                                    document.querySelector("input[type='file']").value = '';
                                    me.setValue(null);
                                },
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'portcallPaymentDelete',
                            testId: 'paymentsRightCardPortcallPaymentDeleteBtn',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('payments'),
                                    container = this.up('[xtype=payments\\.right.\\card]'),
                                    record = vm.get('payment');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function failure(response, batch) {
                                                    store.rejectChanges();
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
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'paymentsRightCardCloseBtn',
                            handler: function (me) {
                                let record = this.upVM().get('payment'),
                                    grid = Ext.ComponentQuery.query('payments\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=payments\\.right.\\card]').hide();
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
            padding: '8 0 0 0',
            cls: 'a-portcall-info',
            layout: 'vbox',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    bind: {
                        items: ['{rightContent}'],
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-extra',
                    slug: 'portcallPaymentАttachment',
                    testId: 'paymentsRightCardPortcallPaymentАttachmentContainer',
                    bind: {
                        hidden: '{showFiles}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Attachments',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'paymentsRightCardPortcallPaymentАttachmentList',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            itemConfig: {
                                cls: 'a-attachment-item',
                                minWidth: 0,
                                viewModel: {},
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                },
                                bind: {
                                    tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.document.name}.{record.document.extension}</a><span class="sm-title">{record.document.size}</span></div><span style="cursor: pointer; class="{nonEditable ? "d-none" : ""}"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'div.a-attachment,i.remove_attachment',
                                        fn: function (cmp, a) {
                                            let ids = [],
                                                payment = this.component.upVM().get('payment'),
                                                object_record = this.component.upVM().get('object_record');

                                            var store = this.component.upVM().get('payment.attachments');
                                            var record = this.component.upVM().get('record');
                                            if (cmp.currentTarget.className == 'a-attachment') {
                                                if (record) {
                                                    var data = {
                                                        object_id: 3,
                                                        object_meta_id: object_record.get('parent_id')
                                                            ? object_record.get('parent_id')
                                                            : object_record.get('id'),
                                                        file_id: record.get('document_id'),
                                                    };
                                                    let attachments = [];
                                                    store.each(function (attachment) {
                                                        attachments.push(attachment.getDocument());
                                                    });
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .previewFile(this.component, record.getDocument(), attachments);
                                                }
                                            }
                                            if (cmp.currentTarget.className.indexOf('remove_attachment') !== -1) {
                                                if (record) {
                                                    store.remove(record);
                                                    ids.push(record.get('id'));
                                                    Ext.Ajax.request({
                                                        url: Env.ApiEndpoint + 'attachments/' + record.get('id'),
                                                        jsonData: {
                                                            attachments: ids,
                                                        },
                                                        method: 'DELETE',
                                                        headers: {
                                                            'Content-Type': null,
                                                        },
                                                        success: function (response) {
                                                            Ext.toast('Record updated', 1000);
                                                            payment.load();
                                                        },
                                                        failure: function failure(response) {
                                                            // resolve(false);
                                                        },
                                                    });
                                                }
                                            }
                                        },
                                    },
                                },
                            },
                            bind: {
                                store: '{payment.attachments}',
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
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'paymentsRightCardTasksList',
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
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'paymentsRightCardCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'paymentsRightCardCommentsInput',
                    docked: 'bottom',
                    slug: 'portcallNotes',
                    bind: {
                        hidden: '{object_record.is_archived ? true : false}',
                        permission: '{userPermissions}',
                        viewModel: {
                            data: {
                                comments: '{comments}',
                                record: '{payment}',
                            },
                        },
                    },
                },
            ],
        },
    ],
});
