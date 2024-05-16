
import './TasksViewModel';
import './TasksGrid';
import './TaskHeader';
Ext.define('Abraxa.view.tasks.TasksMainContainer', {
    extend: 'Ext.Container',
    xtype: 'tasks.main',
    testId: 'tasksMainContainer',
    cls: 'a-tasks',
    bodyCls: 'a-layout-card-wrap',
    itemId: 'tasks-grid',
    flex: 1,
    viewModel: 'tasks-viewmodel',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'main.header',
            docked: 'top',
        },
        {
            xtype: 'tasks.grid',
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'task',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
    listeners: {
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'agent') {
                Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
