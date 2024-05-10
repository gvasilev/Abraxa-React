import '../tasks/TasksList.jsx';
import '../tasks/TaskRightContainer.jsx';

Ext.define('Abraxa.view.internal.TasksPanel', {
    extend: 'Ext.Sheet',
    xtype: 'internal.tasks.panel',
    testId: 'internalTasksPanel',
    cls: 'a-notification-center a-bgr-white',
    bodyCls: 'a-bgr-white',
    width: 540,
    // side: 'right',throw error comment for now
    displayed: false,
    hideOnMaskTap: true,
    height: 'calc(100% - 73px)',
    scrollable: 'y',
    header: false,
    collapsible: false,
    weighted: true,
    modal: false,
    margin: '73 0 0 0',
    hideMode: 'offsets',
    showAnimation: {
        type: 'slideIn',
        direction: 'left',
    },
    hideAnimation: {
        type: 'slideOut',
        direction: 'right',
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    closeAction: 'hide',
    items: [
        {
            xtype: 'container',
            minHeight: 64,
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    title: "<div class='hbox'><div class='a-badge a-badge-notes'><i class='md-icon-outlined md-icon-task-alt'></i></div><div><span class='a-panel-title'>Tasks</span><span class='a-panel-subtitle'><i class='md-icon-outlined md-icon-lock'></i>Visible only to my organization</span></div></div>",
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
                            testId: 'internalTasksPanelAddTaskBtn',
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
                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            object_type: this.upVM().get('object_type'),
                                            subObjects: this.upVM().get('subObjects'),
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            editMode: false,
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                object_id: this.upVM().get('object_type') == 'portcall' ? 3 : 2,
                                                object_meta_id: this.upVM().get('object_record').get('id'),
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
                            ui: 'round tool-round-md toggle',
                            enableToggle: true,
                            iconCls: 'md-icon-filter-alt md-icon-outlined',
                            testId: 'internalTasksPanelFiltersBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Filters',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                Ext.select('.a-filters').toggleCls('is-hidden');
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-more-horiz',
                            testId: 'internalTasksPanelMoreBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'More',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            arrow: false,
                            handler: function () {
                                let vm = this.upVM();
                                Ext.create('Ext.menu.Menu', {
                                    viewModel: {
                                        parent: vm,
                                    },
                                    items: [
                                        {
                                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                            text: 'Export',
                                            handler: function (me) {
                                                let record = me.upVM().get('object_record'),
                                                    sections = ['tasks'];
                                                Abraxa.export.portcall(record.get('id'), sections);
                                            },
                                            hidden: true,
                                        },
                                        {
                                            text: 'Save as template',
                                            iconCls: 'md-icon-playlist-add-check md-icon-outlined',
                                            slug: 'templateSave',
                                            bind: {
                                                html: '{(currentUserPlan == "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                                                permission: '{userPermissions}',
                                            },
                                            handler: function () {
                                                // Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                                let vm = Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].upVM(),
                                                    currentUserPlan = vm.get('currentUserPlan');
                                                if (currentUserPlan == 'starter') {
                                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                                } else {
                                                    mixpanel.track('Tasks - Save as template');
                                                    Ext.create('Abraxa.view.task.CreateTaskTemplate', {
                                                        viewModel: {
                                                            parent: vm,
                                                            data: {
                                                                template: Ext.create('Abraxa.model.template.Template', {
                                                                    type: 'task',
                                                                }),
                                                            },
                                                            stores: {
                                                                tasks: {
                                                                    data: vm.get('tasks').getData().clone(),
                                                                },
                                                            },
                                                        },
                                                    }).show();
                                                }
                                            },
                                        },
                                        {
                                            text: 'Apply template',
                                            iconCls: 'md-icon-playlist-add md-icon-outlined',
                                            slug: 'templateApply',
                                            bind: {
                                                html: '{(currentUserPlan == "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                                                disabled: '{object_record.is_archived ? true : false}',
                                                permission: '{userPermissions}',
                                            },
                                            handler: function () {
                                                let vm = Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].upVM(),
                                                    currentUserPlan = vm.get('currentUserPlan');
                                                if (currentUserPlan == 'starter') {
                                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                                } else {
                                                    mixpanel.track('Tasks - Apply template');
                                                    Ext.create('Abraxa.view.task.ApplyTaskTemplate', {
                                                        viewModel: {
                                                            data: {
                                                                tasks: vm.get('tasks'),
                                                                object_record: vm.get('object_record'),
                                                                object_id: vm.get('object_id'),
                                                            },
                                                            stores: {
                                                                taskTemplates: {
                                                                    type: 'templates',
                                                                    autoLoad: true,
                                                                    filters: [
                                                                        {
                                                                            property: 'type',
                                                                            operator: '=',
                                                                            value: 'task',
                                                                            exactMatch: true,
                                                                        },
                                                                    ],
                                                                },
                                                                templateItems: {
                                                                    type: 'template.items',
                                                                    autoLoad: true,
                                                                    proxy: {
                                                                        extraParams: {
                                                                            type: 'task',
                                                                            template_id:
                                                                                '{selectedTemplate.selection.id}',
                                                                        },
                                                                    },
                                                                    updateProxy: function (proxy) {
                                                                        if (proxy) {
                                                                            proxy.onAfter(
                                                                                'extraparamschanged',
                                                                                function () {
                                                                                    if (
                                                                                        this.getProxy().getExtraParams()
                                                                                            .template_id
                                                                                    ) {
                                                                                        this.load();
                                                                                    }
                                                                                },
                                                                                this
                                                                            );
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                            formulas: {
                                                                firstValue: {
                                                                    bind: {
                                                                        bindTo: '{taskTemplates}',
                                                                        deep: true,
                                                                    },
                                                                    get: function (store) {
                                                                        if (store && store.getCount() > 0) {
                                                                            let firstRecord = store.getAt(0);
                                                                            if (firstRecord) {
                                                                                return firstRecord.get('id');
                                                                            }
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }).show();
                                                }
                                            },
                                        },
                                    ],
                                }).showBy(this, 'tr-br?');
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            margin: 0,
                            testId: 'internalTasksPanelCloseBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Close',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                Ext.ComponentQuery.query('internal\\.tasks\\.panel')[0].hide();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 16',
            margin: 0,
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'end',
            },
            cls: 'a-filters is-hidden',
            items: [
                {
                    text: 'Status',
                    ui: 'filter round',
                    xtype: 'splitbutton',
                    testId: 'internalTasksPanelStatusBtn',
                    handler: function () {
                        this.showMenu();
                    },
                    arrowHandler: function () {
                        let button = this,
                            arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                            tasks = this.upVM().get('tasks');
                        if (!arrowCls) {
                            let selected = Ext.ComponentQuery.query('menuitem[cls~=taskFilterItem][checked="true"]');
                            Ext.each(selected, function (value, index) {
                                value.setChecked(false);
                            });
                            button.setText('Status');
                            button.splitArrowElement.removeCls('md-icon-close');
                            button.splitArrowElement.addCls('x-arrow-el');
                            button.removeCls('active');
                            tasks.removeFilter('status');
                            return;
                        }
                    },
                    menu: {
                        cls: 'filter-menu',
                        defaults: {
                            cls: 'taskFilterItem',
                            handler: function (me) {
                                let button = this.up('button'),
                                    store = this.upVM().get('tasks');

                                button.setText(this.getText());
                                button.getMenu().arrowCls = 'delete';
                                button.splitArrowElement.removeCls('x-arrow-el');
                                button.splitArrowElement.addCls('md-icon-close');
                                button.addCls('active');

                                store.addFilter({
                                    id: 'status',
                                    filterFn: function (record) {
                                        if (record.get('status') == me.getValue()) {
                                            return true;
                                        }
                                    },
                                });

                                // store.addFilter(new Ext.data.Query({
                                //     id: 'status',
                                //     source: 'status = "' + me.getValue() + '"'
                                // }));
                            },
                        },
                        items: [
                            {
                                text: 'To-do',
                                group: 'status',
                                value: 'to-do',
                            },
                            {
                                text: 'In progress',
                                group: 'status',
                                value: 'in progress',
                            },
                            {
                                text: 'Completed',
                                group: 'status',
                                value: 'completed',
                            },
                        ],
                    },
                },
                {
                    text: 'Priority',
                    ui: 'filter round',
                    xtype: 'splitbutton',
                    testId: 'internalTasksPanelPriorityBtn',
                    handler: function () {
                        this.showMenu();
                    },
                    arrowHandler: function () {
                        let button = this,
                            arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                            tasks = this.upVM().get('tasks');
                        if (!arrowCls) {
                            let selected = Ext.ComponentQuery.query(
                                'menuitem[cls~=taskFilterItemPriority][checked="true"]'
                            );
                            Ext.each(selected, function (value, index) {
                                value.setChecked(false);
                            });
                            button.setText('Priority');
                            button.splitArrowElement.removeCls('md-icon-close');
                            button.splitArrowElement.addCls('x-arrow-el');
                            button.removeCls('active');
                            tasks.removeFilter('priority');
                            return;
                        }
                    },
                    menu: {
                        cls: 'filter-menu',
                        defaults: {
                            cls: 'taskFilterItemPriority',
                            handler: function (me) {
                                let button = this.up('button'),
                                    store = this.upVM().get('tasks');

                                button.setText(this.getText());
                                button.getMenu().arrowCls = 'delete';
                                button.splitArrowElement.removeCls('x-arrow-el');
                                button.splitArrowElement.addCls('md-icon-close');
                                button.addCls('active');

                                store.addFilter({
                                    id: 'priority',
                                    filterFn: function (record) {
                                        if (record.get('priority') == me.getValue()) {
                                            return true;
                                        }
                                    },
                                });
                            },
                        },
                        items: [
                            {
                                text: 'Normal',
                                group: 'priority',
                                value: 'normal',
                            },
                            {
                                text: 'High',
                                group: 'priority',
                                value: 'high',
                            },
                        ],
                    },
                },
                {
                    xtype: 'button',
                    ui: 'tool-sm round toggle',
                    enableToggle: true,
                    testId: 'internalTasksPanelAssignedToMeBtn',
                    iconCls: 'md-icon-person md-icon-outlined',
                    margin: '0 0 0 6',
                    tooltip: {
                        anchorToTarget: true,
                        align: 'bc-tc?',
                        html: 'Assigned to me',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    handler: function (me) {
                        let store = this.upVM().get('tasks');
                        if (!this.getPressed()) {
                            store.removeFilter('assigned_to');
                        } else {
                            store.addFilter({
                                id: 'assigned_to',
                                filterFn: function (record) {
                                    if (record.get('assigned_to') == me.upVM().get('currentUser').get('id')) {
                                        return true;
                                    }
                                },
                            });
                        }
                    },
                },
            ],
        },
        {
            xtype: 'tasks.list',
            flex: 1,
            scrollable: true,
            height: '100%',
            bind: {
                store: '{tasks}',
            },
        },
    ],
});
