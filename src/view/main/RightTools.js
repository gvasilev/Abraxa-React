Ext.define('Abraxa.view.main.RightTools', {
    extend: 'Ext.Container',
    xtype: 'right.tools',
    testId: 'rightTools',
    items: [
        {
            xtype: 'button',
            ui: 'large raised',
            cls: 'position_fixed a-btn-internal-tools',
            hidden: true,
            slug: 'portcall',
            skipEditPermission: true,
            testId: 'rightToolsInternalNotesBtn',
            bind: {
                badgeText: '{notes.count}',
                hidden: '{hideTaskNotesTools}',
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-mode-comment md-icon-outlined',
            tooltip: {
                anchorToTarget: true,
                html: 'Internal notes',
                align: 'r50-l50',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function () {
                Ext.ComponentQuery.query('internal\\.tools\\.panel')[0].show();
            },
        },
        {
            xtype: 'button',
            ui: 'large raised',
            margin: '56 0 0 0',
            cls: 'position_fixed a-btn-internal-tools',
            hidden: true,
            slug: 'task',
            testId: 'rightToolsTasksBtn',
            skipEditPermission: true,
            bind: {
                badgeText: '{tasksCount}',
                hidden: '{hideTaskNotesTools}',
                permission: '{userPermissions}',
            },
            tooltip: {
                anchorToTarget: true,
                html: 'Tasks',
                align: 'r50-l50',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            iconCls: 'md-icon-outlined md-icon-task-alt',
            handler: function () {
                Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].show();
                // taskContainer.setViewModel({
                //     data: {
                //         object_record: this.upVM().get('object_record')
                //     }
                // });
                // taskContainer.show();
            },
        },
    ],
});
