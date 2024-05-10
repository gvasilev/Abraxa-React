Ext.define('Abraxa.view.tasks.TasksViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.tasks-viewmodel',
    data: {
        object_record: null,
        subObjects: [],
        fromGrid: true,
    },
    stores: {
        tasks: {
            type: 'tasks',
            autoLoad: true,
        },
    },
    formulas: {
        selectedTask: {
            bind: {
                bindTo: '{taskGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record;
                }
            },
            set: function (value) {
                return value;
            },
        },
        object_record: {
            bind: {
                bindTo: '{selectedTask}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    if (record.get('object_id') === 3) return record.get('portcall');
                    if (record.get('object_id') === 3) return record.get('portcall');

                    if (record.get('object_id') === 2) return record.get('organization');
                }
                return null;
            },
        },
        taksFilter: {
            bind: {
                bindTo: '{taskMainTabbar.activeTabIndex}',
                deep: true,
            },
            get: function (activeTabIndex) {
                let store = this.get('tasks');
                if (!store) return;

                if (activeTabIndex === 1) {
                    store.addFilter({
                        id: 'completed',
                        filterFn: function (record) {
                            if (record.get('status') === 'completed') {
                                return true;
                            }
                        },
                    });
                }

                if (activeTabIndex === 0) {
                    store.removeFilter('completed');
                }
            },
        },
        totalTasksRecords: {
            bind: {
                bindTo: '{tasks}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },
    },
});
