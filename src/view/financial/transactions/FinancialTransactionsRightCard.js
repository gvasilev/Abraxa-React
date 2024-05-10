Ext.define('Abraxa.view.financial.FinancialTransactionsRightCard', {
    extend: 'Ext.Container',
    xtype: 'financial.transactions.right.card',
    testId: 'financialTransactionsRightCard',
    cls: 'a-right-container a-payment-right-container',
    hidden: true,
    bind: {
        hidden: '{financialTransactionsGrid.selection ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        data: {
            nonEditable: true,
        },
        stores: {
            comments: {
                source: '{financialTransactionsGrid.selection.notes}',
                extraParams: {
                    object_meta_id: '{financialTransactionsGrid.selection.owner.id}',
                    object_id: 3,
                },
            },
            objectTasks: {
                source: '{financialTransactionsGrid.selection.tasks}',
            },
            paymentVirtualAccounts: {
                source: '{organizations}',
                filters: '{paymentVirtualFilter}',
            },
        },
        formulas: {
            incomingBanksStore: {
                bind: {
                    bindTo: '{incomingPayment.selection.virtual_accounts}',
                },
                get: function (store) {
                    if (store) {
                        store.setGrouper({
                            groupFn: function (record) {
                                return record.get('type');
                            },
                        });
                        return store;
                    }
                    return new Ext.data.Store({
                        id: 'emptyStore',
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
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
            outgoingBanksStore: {
                bind: {
                    bindTo: '{outgoingPayment.selection.virtual_accounts}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        store.setGrouper({
                            groupFn: function (record) {
                                return record.get('type');
                            },
                        });
                        return store;
                    }
                    return new Ext.data.Store({
                        id: 'emptyStore',
                        proxy: {
                            type: 'memory',
                        },
                    });
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
                    bindTo: '{financialTransactionsGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    return record;
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
                                    '<div class="a-badge a-badge-requested"><i class="md-icon-outlined md-icon-credit-score c-yellow-500"></i></div><div><span class="a-panel-id">Request payment</span><span class="a-panel-title">Company name</span></div>';
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
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (payment) {
                    if (payment) {
                        if (payment.get('account_currency') != payment.get('currency')) {
                            return false;
                        }
                    }
                    return true;
                },
            },
            billingParty: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function (payment) {
                    if (payment) {
                        return {
                            selection: {
                                account_currency: payment.get('account_currency'),
                            },
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            items: [
                {
                    xtype: 'title',
                    testId: 'financialTransactionsRightCardTitle',
                    bind: {
                        title: '{dialogTitle}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    testId: 'financialTransactionsRightCardActions',
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
                            testId: 'financialTransactionsRightCardTaskCreateBtn',
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
                                    subObjects = this.upVM().get('subObjects'),
                                    object_record = this.upVM().get('object_record'),
                                    voyage = new Abraxa.model.voyage.Voyage(Object.assign({}, object_record.voyage)),
                                    subObject = Ext.Array.filter(subObjects, function (rec) {
                                        return rec.id == record.get('id') && rec.model == record.get('model_name');
                                    })[0];

                                object_record.setVoyage(voyage);

                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            noShowPortcall: true,
                                            subObjects: this.upVM().get('subObjects'),
                                            selectedSubObject: subObject.id,
                                            relatedObject: false,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            object_record: object_record,
                                            editMode: false,
                                            taskEdit: false,
                                            tasks: this.upVM().get('objectTasks'),
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
                                                taskable_type: this.upVM().get('payment').get('model_name'),
                                                taskable_id: this.upVM().get('payment').get('id'),
                                                ownerable_type: this.upVM().get('object_record').model_name,
                                                ownerable_id: this.upVM().get('object_record').id,
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
                            controller: 'payments-controller',
                            testId: 'financialTransactionsRightCardAttachmentBtn',
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
                                            controller = me.getController(),
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
                                            }
                                        });
                                    }
                                    document.querySelector("input[type='file']").value = '';
                                    me.setValue(null);
                                },
                            },
                        },
                        // {
                        //     xtype: 'button',
                        //     iconCls: 'md-icon-outlined md-icon-delete',
                        //     ui: 'round tool-round-md',
                        //     slug: 'portcallPaymentDelete',
                        //     bind: {
                        //         permission: '{userPermissions}',
                        //     },
                        //     tooltip: {
                        //         anchorToTarget: true,
                        //         html: 'Delete',
                        //         align: 'bc-tc?',
                        //         showDelay: 0,
                        //         hideDelay: 0,
                        //         dismissDelay: 0,
                        //         allowOver: false,
                        //         closeAction: 'destroy',
                        //     },
                        //     handler: function (item, el, eOpts) {
                        //         let vm = this.upVM(),
                        //             store = vm.get('payment').store,
                        //             container = this.up('[xtype=financial\\.transactions\\.right\\.card]'),
                        //             record = vm.get('payment');
                        //         Ext.Msg.confirm(
                        //             'Delete',
                        //             'Are you sure you would like to delete this entry?',
                        //             function (answer) {
                        //                 if (answer == 'yes') {
                        //                     container.hide();
                        //                     store.remove(record);
                        //                     store.sync({
                        //                         success: function (err, msg) {
                        //                             Ext.toast('Record updated', 1000);
                        //                         },
                        //                         failure: function failure(response, batch) {
                        //                             var msg = response.operations[0].error.response.responseJson.error;
                        //                             Ext.create('Ext.MessageBox', {
                        //                                 ui: 'warning',
                        //                                 title: 'Delete Cancelled',
                        //                                 innerCls: 'a-bgr-white',
                        //                                 message: msg,
                        //                                 width: 500,
                        //                                 dataTitle: 'Warning',
                        //                                 modal: true,
                        //                                 draggable: false,
                        //                                 bbar: {
                        //                                     manageBorders: false,
                        //                                     items: [
                        //                                         '->',
                        //                                         {
                        //                                             xtype: 'button',
                        //                                             ui: 'action',
                        //                                             text: 'Ok',
                        //                                             handler: function () {
                        //                                                 store.rejectChanges();
                        //                                                 this.up('dialog').destroy();
                        //                                             },
                        //                                         },
                        //                                     ],
                        //                                 },
                        //                             }).show();
                        //                         },
                        //                     });
                        //                 }
                        //             },
                        //             this,
                        //             [
                        //                 {
                        //                     xtype: 'button',
                        //                     itemId: 'no',
                        //                     margin: '0 8 0 0',
                        //                     text: 'Cancel',
                        //                 },
                        //                 {
                        //                     xtype: 'button',
                        //                     itemId: 'yes',
                        //                     ui: 'decline alt',
                        //                     text: 'Delete',
                        //                 },
                        //             ]
                        //         );
                        //     },
                        // },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            testId: 'financialTransactionsRightCardExpandHideBtn',
                            handler: function (me) {
                                let record = this.upVM().get('payment'),
                                    grid = Ext.ComponentQuery.query('financial\\.transactions\\.grid')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                Ext.ComponentQuery.query('financial\\.transactions\\.right\\.card')[0].hide();
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
                    testId: 'financialTransactionsRightCardDataContainer',
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
                    testId: 'financialTransactionsRightCardAttachmentsContainer',
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
                                    testId: 'financialTransactionsRightCardAttachmentsTitle',
                                    title: 'Attachments',
                                },
                            ],
                        },
                        {
                            xtype: 'list',
                            cls: 'a-attachments-list',
                            testId: 'financialTransactionsRightCardAttachmentsList',
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
                    testId: 'financialTransactionsRightCardTasksContainer',
                    bind: {
                        hidden: '{objectTasks.count ? false : true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            testId: 'financialTransactionsRightCardTasksTitleContainer',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'financialTransactionsRightCardTasksTitle',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'financialTransactionsRightCardTasksList',
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
                    testId: 'financialTransactionsRightCardPortcallNotesContainer',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            testId: 'financialTransactionsRightCardPortcallNotesTitleContainer',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'financialTransactionsRightCardPortcallNotesTitle',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'financialTransactionsRightCardPortcallNotesList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'comments.input',
                    testId: 'financialTransactionsRightCardPortcallNotesInput',
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
