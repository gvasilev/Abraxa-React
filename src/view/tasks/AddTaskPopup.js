Ext.define('Abraxa.view.tasks.AddTaskPopup', {
    extend: 'Ext.Dialog',
    xtype: 'add.task',
    testId: 'addTaskDialog',
    bind: {
        title: '{taskEdit ? "Edit Task" : "New Task"}',
    },
    cls: 'constrain_horizontal',
    right: 80,
    bottom: 0,
    // alwaysOnTop: true,
    showAnimation: {
        type: 'slide',
        direction: 'up',
    },
    modal: false,
    width: 480,
    collapsible: {
        tool: false,
    },
    draggable: false,
    // listeners: {
    //     painted: function (me) {
    //         var drag = new Ext.drag.Source({
    //             element: me.element,
    //             constrain: {
    //                 // Constrain dragging vertically only. Also to the parent container.
    //                 element: Ext.getCmp('main-viewport').element,
    //                 horizontal: true
    //             }
    //         });
    //     }
    // },
    // constrainDrag: false,
    focusable: false,
    closable: false,
    minHeight: 410,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    padding: '0 24 16 24',
    cls: 'a-dialog-add-task',
    reference: 'add_edit_task',
    publishes: ['collapsed'],
    requires: ['Ext.panel.Collapser'],
    viewModel: {
        data: {
            editMode: true,
        },
        formulas: {
            objectRender: {
                bind: {
                    bindTo: '{object_record}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let object_type = record.get('model_name'),
                            html = '';

                        var str = object_type;
                        var n = str.lastIndexOf('\\');
                        var result = str.substring(n + 1);

                        switch (result) {
                            case 'Portcall':
                                html =
                                    '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">' +
                                    record.getVoyage().get('vessel_name') +
                                    ' <span class="sm-title">(' +
                                    record.get('file_id') +
                                    ')</span></div></div>';
                                break;

                            case 'Organization':
                                html =
                                    '<div class="x-chip a-chip-company"><i class="abraxa-icon-cdb"></i><div class="x-text-el">' +
                                    record.get('org_name') +
                                    ' <span class="sm-title">(CDB-' +
                                    record.get('org_id') +
                                    ')</span></div></div>';
                                break;
                        }
                        return html;
                    }
                },
            },
        },
    },
    tools: {
        expand: {
            iconCls: 'md-icon-remove',
            testId: 'addTaskDialogExpandTool',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Minimize',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            bind: {
                hidden: '{add_edit_task.collapsed}',
            },
            handler: function () {
                this.up('dialog').collapse();
            },
        },
        collapse: {
            iconCls: 'md-icon-keyboard-capslock',
            testId: 'addTaskDialogCollapseTool',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Expand',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            bind: {
                hidden: '{!add_edit_task.collapsed}',
            },
            handler: function () {
                this.up('dialog').expand();
            },
        },
        close: {
            testId: 'addTaskDialogCloseTool',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function (me) {
                let dialog = this.up('dialog');
                Ext.Msg.confirm(
                    'Confirmation',
                    'Would you like to discard all changes?',
                    function (answer) {
                        if (answer == 'yes') {
                            dialog.destroy();
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
                            ui: 'action loading',
                            text: 'Discard',
                        },
                    ]
                );

                // Ext.Msg.confirm(
                //     'Confirmation',
                //     'Are you sure you want to close?',
                //     function (answer) {
                //         if (answer == 'yes') {
                //             dialog.destroy();
                //         }
                //     }
                // );
            },
        },
    },
    items: [
        {
            xtype: 'tasks.form',
        },
        {
            xtype: 'toolbar',
            padding: 16,
            docked: 'bottom',
            items: [
                '->',
                {
                    xtype: 'button',
                    text: 'Cancel',
                    testId: 'addTaskDialogCancelTbBtn',
                    margin: '0 8',
                    handler: function (me) {
                        let dialog = this.up('dialog');

                        Ext.Msg.confirm(
                            'Confirmation',
                            'Would you like to discard all changes?',
                            function (answer) {
                                if (answer == 'yes') {
                                    dialog.destroy();
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
                                    ui: 'action loading',
                                    text: 'Discard',
                                },
                            ]
                        );
                    },
                },
                {
                    xtype: 'button',
                    testId: 'addTaskDialogSaveTbBtn',
                    bind: {
                        text: '{taskEdit ? "Save" : "Create"}',
                    },
                    enableToggle: true,
                    ui: 'action loading',
                    handler: function (me) {
                        let mainTasks = Ext.getStore('tasks'),
                            vm = this.upVM(),
                            tasks = this.upVM().get('tasks'),
                            record = this.upVM().get('record'),
                            form = this.up('dialog').down('formpanel'),
                            object_record = this.upVM().get('object_record');

                        // NOTE(boyan): object_record is null when creating a new task
                        // from the Task manager
                        let ownerableId = object_record ? object_record.get('id') : null;

                        if (
                            object_record &&
                            object_record.get('model_name') == 'App\\Models\\Organization\\Organization'
                        ) {
                            ownerableId = object_record.get('org_id');
                        }

                        if (form.validate()) {
                            if (object_record) {
                                record.set('ownerable_type', object_record.get('model_name'));
                                record.set('ownerable_id', ownerableId);
                            }
                            record.save({
                                success: function (rec) {
                                    let comments = new Abraxa.model.comments.Comment(
                                            Object.assign({}, rec.get('comments'))
                                        ),
                                        likes = new Abraxa.model.likes.Like(Object.assign({}, rec.get('likes'))),
                                        attachments = new Abraxa.model.portcall.Attachment(
                                            Object.assign({}, rec.get('attachments'))
                                        );

                                    rec.attachments().setData(attachments);
                                    rec.likes().setData(likes);
                                    rec.comments().setData(comments);
                                    if (tasks && !tasks.isDestroyed) {
                                        tasks.add(rec);
                                    }
                                    if (mainTasks) {
                                        // mainTasks.add(rec);
                                        mainTasks.reload();
                                    }

                                    let mixpanelEventName = vm.get('taskEdit') ? 'Record edited' : 'Record created';

                                    mixpanel.track(mixpanelEventName, {
                                        Type: 'Task',
                                        Target: 'Dialog',
                                        Tag: 'Primary event',
                                    });

                                    Ext.toast('Record updated', 1000);

                                    mixpanel.track('Dialog closed', {
                                        Type: 'Dialog',
                                        Target: 'Task dialog',
                                        Tag: 'Primary event',
                                    });

                                    me.up('dialog').destroy();
                                    Ext.fireEvent('addDeleteTaskEvent');
                                },
                                failure: function () {
                                    me.toggle();
                                },
                            });
                        } else {
                            me.toggle();
                        }
                    },
                },
            ],
        },
    ],
});
