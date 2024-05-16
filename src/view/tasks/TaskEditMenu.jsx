Ext.define('Abraxa.view.task.TaskEditMenu', {
    extend: 'Ext.menu.Menu',
    items: [
        {
            text: 'Edit',
            slug: 'task',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-edit md-icon-outlined',
            handler: function () {
                let record = this.upVM().get('task'),
                    grid = this.upVM().get('grid');

                grid.select(record);

                mixpanel.track('Menu option clicked', {
                    Type: 'Grid menu',
                    Target: 'Edit task option',
                    Tag: 'Secondary event',
                });

                mixpanel.track('Right panel opened', {
                    Type: 'Right panel',
                    Target: 'Task right panel',
                    Tag: 'Primary event',
                });
            },
        },
        {
            text: 'Delete',
            slug: 'taskDelete',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-delete md-icon-outlined',
            ui: 'decline',
            separator: true,
            handler: function () {
                let store = this.upVM().get('tasks'),
                    task = this.upVM().get('task');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this task?',
                    function (btn) {
                        if (btn === 'yes') {
                            store.remove(task);
                            store.sync({
                                success: function () {
                                    mixpanel.track('Menu option clicked', {
                                        Type: 'Grid menu',
                                        Target: 'Delete task option',
                                        Tag: 'Secondary event',
                                    });

                                    mixpanel.track('Record deleted', {
                                        Type: 'Task',
                                        Target: 'Grid menu',
                                        Tag: 'Primary event',
                                    });

                                    Ext.toast('Record deleted', 2500);
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
    ],
});
