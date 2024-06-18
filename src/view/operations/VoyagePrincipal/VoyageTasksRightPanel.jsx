import './TasksListVoaygePrincipal';

Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyageTasksRightPanel', {
    extend: 'Ext.Container',
    xtype: 'VoyageTasksRightPanel',
    cls: 'a-voyage-tasks-rp',
    layout: 'vbox',
    scrollable: true,
    items: [
        {
            xtype: 'container',
            minHeight: 64,
            cls: 'a-titlebar',
            docked: 'top',
            items: [
                {
                    xtype: 'title',
                    title: '<div class=\'hbox\'><div><span class=\'a-panel-title\'>Pending tasks</span><span class=\'a-panel-subtitle\'></div></div>',
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
                            // ui: 'round tool-round-md',
                            ui: 'normal small',
                            iconCls: 'md-icon-outlined md-icon-add-task',
                            slug: 'taskCreate',
                            testId: 'voyageTasksRightPanelAddTaskBtn',
                            text: 'Add task',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            handler: function() {
                                let button = this;

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;
                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            noSubObjects: true,
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            // fromGrid: true,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: 3,
                                                ownerable_id: this.upVM().get('selectedVoyage').id,
                                                taskable_id: this.upVM()
                                                    .get('selectedVoyage')
                                                    .get('active_portcall_id'),
                                                ownerable_type: 'Modules\\Voyages\\Models\\Voyage',
                                                taskable_type: 'App\\Models\\Portcall\\Portcall',
                                                object_meta_id: this.upVM().get('selectedVoyage').id,
                                            }),
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: (dialog) => {
                                            const newTask = dialog.getViewModel().get('record');
                                            Ext.getStore('activePortCallToDo').add(newTask);
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the task
                                task.show();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            scrollable: true,
            items: [
                {
                    xtype: 'TasksListVoaygePrincipal',
                    userCls: 'no-show',
                    bind: {
                        store: '{activePortCallToDo}',
                    },
                    // selectedTask
                },
                {
                    xtype: 'container',
                    minHeight: 64,
                    cls: 'a-titlebar a-bt-100',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'text-uppercase fs-13 c-blue-grey',
                            html: 'Done',
                        },
                    ],
                },
                {
                    xtype: 'TasksListVoaygePrincipal',
                    userCls: 'no-show',
                    bind: {
                        store: '{donePortCallToDo}',
                    },
                    // selectedTask
                },
            ],
        },
    ],
});
