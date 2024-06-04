import './CargoInformation.jsx';
import './DocumentaryInstructions.jsx';
import '../../../adocs/CargoDocumentForm';
Ext.define('Abraxa.view.portcall.appointment.AppointmentRightCard', {
    extend: 'Ext.Container',
    xtype: 'appointment.right.card',
    testId: 'appointmentRightCard',
    layout: 'vbox',
    scrollable: 'y',
    flex: 1,
    viewModel: {
        data: {
            cargoesAdvanced: false,
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
            relatedDocuments: {
                source: '{documents}',
                filters: '{cargoDocumentFilter}',
            },
            additionalQuantity: {
                source: '{cargoesGrid.selection.cargo_additional_quantity}',
                extraParams: {
                    cargo_id: '{cargoesGrid.selection.id}',
                },
            },
            additionalQuantityFiltered: {
                source: '{cargoesGrid.selection.cargo_additional_quantity}',
                filters: '{additionalQuantityFilter}',
            },
            berthStore: {
                source: '{object_record.berths}',
            },
        },
        formulas: {
            cargoDocumentFilter: {
                bind: {
                    bindTo: '{cargoesGrid.selection}',
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('relatedDocuments');
                        if (store) store.clearFilter();

                        return function (document) {
                            if (
                                document.get('documentable_id') == record.get('id') &&
                                document.get('documentable_type') == record.get('model_name')
                            ) {
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
            cargoBerthId: {
                bind: {
                    bindTo: '{cargoesGrid.selection}',
                    deep: true,
                },
                get: function (selection) {
                    if (selection) {
                        return selection.get('berth_id');
                    }
                },
            },
            noteFilter: {
                bind: {
                    bindTo: '{cargoesGrid.selection}',
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
                    bindTo: '{cargoesGrid.selection}',
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
            dialogTitle: {
                bind: {
                    bindTo: '{cargoesGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        var store = this.get('cargoes'),
                            index = store.indexOf(record) + 1;

                        return (
                            '<div class="a-cargo-title"><span class="a-commodity fs-16" style="max-width: inherit;">' +
                            record.get('commodity') +
                            '</span></div><div class="a-cargo-subtitle">#CARGO-' +
                            index +
                            '</div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            itemTemplate: {
                bind: {
                    bindTo: '{nonEditable}',
                    deep: true,
                },
                get: function (live) {
                    if (live) {
                        return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{system_extension ? system_extension : extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}.{extension}</a><span class="sm-title">{size}</span></div></div>';
                    }
                    return '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{system_extension ? system_extension : extension}"></div><div><a class="file_name" href="javascript:void(0);">{name}.{extension}</a><span class="sm-title">{size}</span></div></div>';
                },
            },
            firstAdditonalQuantity: {
                bind: {
                    bindTo: '{additionalQuantity}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        if (store.getCount()) {
                            return store.getAt(0);
                        } else {
                            let cargo = this.get('cargoesGrid.selection');
                            store.add({
                                unit: cargo.get('unit'),
                                quantity: cargo.get('quantity'),
                                cargo_id: cargo.get('id'),
                                portcall_id: cargo.get('portcall_id'),
                            });
                            store.sync();
                        }
                    }
                },
            },
            additionalQuantityFilter: {
                bind: {
                    bindTo: '{firstAdditonalQuantity}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let store = this.get('additionalQuantityFiltered');
                        if (store) store.clearFilter();
                        return function (rec) {
                            if (rec.get('id') != record.get('id')) {
                                return true;
                            }
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    testId: 'appointmentRightCardTitleBar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('appointment\\.cargo')[0];
                                if (grid) {
                                    grid.deselectAll();
                                }
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{dialogTitle}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    testId: 'appointmentRightCardActionsContainer',
                    padding: '0 16 0 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-add',
                            text: 'Document',
                            testId: 'appointmentRightCardDocumentBtn',
                            slug: 'portcallDocuments',
                            bind: {
                                cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let vm = me.upVM();
                                let record = vm.get('cargoesGrid.selection'),
                                    currentUserPlan = vm.get('currentUserPlan');
                                if (currentUserPlan == 'starter') {
                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                } else {
                                    let dialog = Ext.create('Abraxa.view.adocs.CargoDocumentForm', {
                                        viewModel: {
                                            data: {
                                                object_record: vm.get('object_record'),
                                                organizations: vm.get('organizations'),
                                                documentTypes: vm.get('documentTypes'),
                                                userPermissions: vm.get('userPermissions'),
                                            },
                                            formulas: {
                                                showCombined: {
                                                    bind: {
                                                        bindTo: '{selectedDocumentTypes.selection}',
                                                        deep: true,
                                                    },
                                                    get: function (selection) {
                                                        let hide = true;
                                                        if (selection) {
                                                            Ext.each(selection, function (record) {
                                                                if (record.get('can_combine')) {
                                                                    hide = false;
                                                                }
                                                            });
                                                        }
                                                        return hide;
                                                    },
                                                },
                                                selectedCargoes: {
                                                    bind: {
                                                        bindTo: '{documentsSelectedCargoes.selection}',
                                                        deep: true,
                                                    },
                                                    get: function (selection) {
                                                        if (selection) {
                                                            return selection.length;
                                                        }
                                                        return 0;
                                                    },
                                                },
                                            },
                                        },
                                    }).show();
                                    mixpanel.track('Document button - appointment tab');
                                    let cargoField = dialog.lookupReference('documentsSelectedCargoes');
                                    cargoField.setValue(record.get('id'));
                                }
                            },
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 8',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            text: 'Add task',
                            testId: 'appointmentRightCardAddTaskBtn',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let record = this.upVM().get('cargoesGrid.selection'),
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
                                                    .get('cargoesGrid.selection')
                                                    .get('model_name'),
                                                taskable_id: this.upVM().get('cargoesGrid.selection').get('id'),
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
                            iconCls: 'md-icon-more-vert',
                            ui: 'tool round tool-md',
                            bind: {
                                cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                permission: '{userPermissions}',
                            },
                            margin: '0 0 0 8',
                            arrow: false,
                            testId: 'appointmentRightCardMoreActionsBtn',
                            tooltip: {
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                html: 'More actions',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            menu: {
                                cls: 'a-main-edit-menu',
                                width: 160,
                                ui: 'has-icons medium',
                                items: [
                                    {
                                        text: 'Delete',
                                        iconCls: 'md-icon-outlined md-icon-delete',
                                        ui: 'decline',
                                        separator: true,
                                        handler: function (button, el, data) {
                                            Ext.Msg.confirm(
                                                'Confirmation',
                                                'Are you sure you want to delete this record?',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        let store = button.upVM().get('cargoes'),
                                                            record = this.upVM().get('cargoesGrid.selection');
                                                        store.remove(record);
                                                        store.sync({
                                                            success: function () {
                                                                Ext.toast('Record deleted', 1000);
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
                                                        enableToggle: true,
                                                        ui: 'decline alt loading',
                                                        text: 'Delete',
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
            ],
        },
        {
            //Cargo information
            xtype: 'appointment.cargo.information',
            testId: 'appointmentRightCardCargoInformation',
        },
        {
            xtype: 'div',
            margin: '0 24',
            html: '<hr>',
        },
        {
            //Documentary instructions
            xtype: 'appointment.documentary.instructions',
            testId: 'appointmentRightCardDocumentaryInstructions',
        },
        {
            xtype: 'div',
            margin: '0 24',
            html: '<hr>',
        },
        {
            //Related documents
            xtype: 'container',
            padding: '8 24',
            testId: 'appointmentRightCardRelatedDocumentsContainer',
            bind: {
                hidden: '{relatedDocuments.count ? false:true}',
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            html: "<div class='hbox'><div class='a-badge a-badge-default'><i class='md-icon-outlined'>picture_as_pdf</i></div><div class='a-panel-title fs-14'>Related documents</div></div>",
                            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                            testId: 'appointmentRightCardRelatedDocumentsTitle',
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let component = this.component;
                                        component.toggleCls('is-collapsed');
                                        component
                                            .up('container')
                                            .up('container')
                                            .down('[cls~=a-collapsible-container]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-collapsible-container',
                    items: [
                        {
                            xtype: 'container',
                            padding: '8 24 8 40',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            defaults: {
                                labelAlign: 'left',
                                ui: 'classic',
                                flex: 1,
                            },
                            items: [
                                {
                                    xtype: 'list',
                                    cls: 'a-attachments-list',
                                    testId: 'appointmentRightCardRelatedDocumentsList',
                                    deselectable: false,
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    itemConfig: {
                                        viewModel: {},
                                        cls: 'a-attachment-item',
                                        minWidth: 0,
                                        margin: 6,
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                        },
                                        bind: {
                                            tpl: '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{record.system_extension ? record.system_extension : record.extension}"></div><div><a class="file_name" href="javascript:void(0);">{record.name}.{record.extension}</a><span class="sm-title">{record.size}</span></div></div>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a.file_name',
                                                fn: function (element, a) {
                                                    var cmp = this.component,
                                                        vm = cmp.upVM(),
                                                        selectedFile = vm.get('record'),
                                                        documentForSelectId = selectedFile.get('id'),
                                                        documents = vm.get('relatedDocuments'),
                                                        userPermissions = vm.get('userPermissions');

                                                    let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                                        viewModel: {
                                                            data: {
                                                                documentForSelect:
                                                                    documents.getById(documentForSelectId),
                                                                selectedDocuments: documents,
                                                                needsPanel: false,
                                                                members: vm.get('members'),
                                                                isReadOnly: false,
                                                                nonEditable: vm.get('userPermissions').portcallDocuments
                                                                    .edit
                                                                    ? false
                                                                    : true,
                                                                userPermissions: userPermissions,
                                                            },
                                                            formulas: {
                                                                selectedDocument: {
                                                                    bind: {
                                                                        bindTo: '{documentsList.selection}',
                                                                    },
                                                                    get: function (record) {
                                                                        return record;
                                                                    },
                                                                },
                                                                loadDodument: {
                                                                    bind: {
                                                                        bindTo: '{selectedDocument.id}',
                                                                        // deep: true
                                                                    },
                                                                    get: function (id) {
                                                                        let record = this.get('selectedDocument');
                                                                        if (record) {
                                                                            Ext.ComponentQuery.query(
                                                                                '[cls~=pdf-preview]'
                                                                            )[0].setMasked(true);
                                                                            var me = this;
                                                                            let file = record,
                                                                                pdf = record.get('pdf') ? true : false;

                                                                            me.getView()
                                                                                .getController()
                                                                                .loadDocument(
                                                                                    Env.ApiEndpoint +
                                                                                        'get_pdf/' +
                                                                                        record.get('id')
                                                                                );

                                                                            // if (!pdf) {
                                                                            //     record.loadPDF2().then(function (blob) {
                                                                            //         let test = {
                                                                            //             blob: blob,
                                                                            //             name: record.get('name') + '.' + file.get('extension')
                                                                            //         }
                                                                            //         me.getView().getController().loadDocument(test);
                                                                            //     });
                                                                            // } else {
                                                                            //
                                                                            //     let blob = record.get('pdf');
                                                                            //     let test = {
                                                                            //         blob: blob,
                                                                            //         name: record.get('name') + '.' + file.get('extension')
                                                                            //     }
                                                                            //     me.getView().getController().loadDocument(test);
                                                                            // }
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    });
                                                    dialog.show();
                                                },
                                            },
                                        },
                                    },
                                    bind: {
                                        store: '{relatedDocuments}',
                                        itemTpl: '{itemTemplate}',
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
            cls: 'a-portcall-info',
            testId: 'appointmentRightCardPortcallInfoContainer',
            items: [
                {
                    // Tasks
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-tasks',
                    testId: 'appointmentRightCardPrivateTasksContainer',
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
                            testId: 'appointmentRightCardPrivateTasksTitleBar',
                            items: [
                                {
                                    xtype: 'title',
                                    title: '<div><span class="a-panel-title">Tasks</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'tasks.list',
                            testId: 'appointmentRightCardPrivateTasksList',
                            minHeight: 120,
                            bind: {
                                store: '{objectTasks}',
                            },
                        },
                    ],
                },
                {
                    // Notes
                    xtype: 'container',
                    cls: 'a-portcall-extra a-private-comments',
                    slug: 'portcallNotes',
                    testId: 'appointmentRightCardPortcallNotesContainer',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            testId: 'appointmentRightCardPortcallNotesTitleBar',
                            items: [
                                {
                                    xtype: 'title',
                                    testId: 'appointmentRightCardPortcallNotesTitle',
                                    title: '<div><span class="a-panel-title">Notes</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                                },
                            ],
                        },
                        {
                            xtype: 'CommentsList',
                            testId: 'appointmentRightCardPortcallNotesCommentsList',
                            minHeight: 120,
                            bind: {
                                store: '{comments}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'comments.input',
            testId: 'appointmentRightCardCommentsInput',
            docked: 'bottom',
            slug: 'portcallNotes',
            bind: {
                permission: '{userPermissions}',
                hidden: '{object_record.is_archived ? true : false}',
                viewModel: {
                    data: {
                        comments: '{comments}',
                        record: '{cargoesGrid.selection}',
                    },
                },
            },
        },
    ],
});
