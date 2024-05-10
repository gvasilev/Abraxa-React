Ext.define('Abraxa.view.tasks.TasksGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'tasks.grid',
    testId: 'tasksGrid',
    flex: 1,
    ui: 'bordered',
    cls: 'a-detailed-grid abraxa-grid a-tasks-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'tasks-grid',
    itemId: 'task-grid',
    reference: 'taskGrid',
    collapsible: {
        collapseToolText: 'Collapse group',
        tool: {
            ui: 'tool-md',
            margin: '0 0 0 -2',
            zone: 'start',
        },
    },
    // NOTE(boyan): Set this as a grid with VM, in order to participate
    // in the VM Hierarchy, to prevent the Scheduler from
    // executing VM formulas of columns, forcing rows and cells to refresh
    // before the grid is rendered/initialised. This avoids console errors
    // and prevents the UI crash of the whole grid view.
    viewModel: {
        data: {
            selectedTask: null,
        },
    },
    pinHeaders: false,
    plugins: {
        gridviewoptions: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            testId: 'tasksGridPagingToolbar',
            loadPages: true,
            toolbar: {
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    initialize: function () {
                        this.add({
                            xtype: 'div',
                            margin: '0 16',
                            cls: 'sm-title',
                            bind: {
                                html: '<strong>{totalTasksRecords}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                        });
                    },
                },
            },
        },
    },
    selectable: {
        deselectable: true,
        toggleOnClick: false,
    },
    store: [],
    bind: {
        store: '{tasks}',
    },
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                testId: 'tasksGridNoTasksDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-23973 -22219)"><g transform="translate(23139 21874)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1 -199.289)"><path d="M351.031,79.42h-2.478V56a3.723,3.723,0,0,0-3.717-3.717H333.618l-.3-.81a6.175,6.175,0,0,0-11.664,0l-.3.81H310.136A3.724,3.724,0,0,0,306.419,56v51.222a3.723,3.723,0,0,0,3.717,3.717h25.519a14.307,14.307,0,0,0,.892,2.478H310.138a6.2,6.2,0,0,1-6.2-6.2V56h0a6.2,6.2,0,0,1,6.2-6.2h9.532a8.638,8.638,0,0,1,15.628,0h9.532a6.2,6.2,0,0,1,6.2,6.2V79.42M321.441,68.8h0a1.652,1.652,0,0,0,1.652,1.652h19.758A1.652,1.652,0,0,0,344.5,68.8h0a1.652,1.652,0,0,0-1.652-1.652H323.093a1.652,1.652,0,0,0-1.652,1.652Zm0,16.52h0a1.652,1.652,0,0,0,1.652,1.652l7.758.06A1.652,1.652,0,0,0,332.5,85.38h0a1.652,1.652,0,0,0-1.652-1.652l-7.758-.06a1.652,1.652,0,0,0-1.652,1.651Zm0,8.26h0a1.652,1.652,0,0,0,1.652,1.652h1.758A1.652,1.652,0,0,0,326.5,93.58h0a1.652,1.652,0,0,0-1.652-1.652h-1.758a1.652,1.652,0,0,0-1.652,1.651Zm0-16.52h0a1.652,1.652,0,0,0,1.652,1.652h13.758A1.652,1.652,0,0,0,338.5,77.06h0a1.652,1.652,0,0,0-1.652-1.652H323.093a1.652,1.652,0,0,0-1.652,1.651ZM327.49,49.8a3.72,3.72,0,1,0,3.71,3.72,3.72,3.72,0,0,0-3.71-3.72Zm1.85,3.72a1.855,1.855,0,1,1,0-.01Z" transform="translate(23706.063 22401.158)" fill="#c8d4e6"/><path d="M16.077,10.476,12.8,7.2l1.305-1.305,1.963,1.963L19.994,3.93l1.324,1.305Z" transform="translate(24003.016 22462.281)" fill="#c8d4e6"/><path d="M16.077,10.476,12.8,7.2l1.305-1.305,1.963,1.963L19.994,3.93l1.324,1.305Z" transform="translate(24003.016 22470.281)" fill="#c8d4e6"/><path d="M16.077,10.476,12.8,7.2l1.305-1.305,1.963,1.963L19.994,3.93l1.324,1.305Z" transform="translate(24003.016 22479.281)" fill="#c8d4e6"/><path d="M16.077,10.476,12.8,7.2l1.305-1.305,1.963,1.963L19.994,3.93l1.324,1.305Z" transform="translate(24003.016 22487.281)" fill="#c8d4e6"/><g transform="translate(24041 22481)"><path d="M16.825,10.525l1.15,1.15L6.65,23H5.5V21.85L16.825,10.525M21.325,3a1.251,1.251,0,0,0-.875.363L18.162,5.65l4.688,4.687L25.137,8.05a1.245,1.245,0,0,0,0-1.762L22.212,3.363A1.227,1.227,0,0,0,21.325,3Zm-4.5,3.988L3,20.813V25.5H7.688L21.512,11.675,16.825,6.987Z" transform="translate(0.75 0.75)" fill="#c8d4e6"/></g></g></g></svg><div class="a-no-content-txt">No tasks available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Task',
                testId: 'tasksGridTaskCreateBtn',
                slug: 'taskCreate',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                bind: {
                    hidden: '{taskMainTabbar.activeTabIndex == 1 ? true : false}',
                    permission: '{userPermissions}',
                },
                handler: function () {
                    let button = this;

                    // Check if a note is already opened
                    if (button.taskOpened) {
                        return;
                    }

                    button.taskOpened = true;

                    let vm = this.upVM();

                    let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                        viewModel: {
                            data: {
                                users: this.upVM().get('users'),
                                currentUser: this.upVM().get('currentUser'),
                                taskEdit: false,
                                record: Ext.create('Abraxa.model.task.Task', {
                                    status: 'to-do',
                                    priority: 'normal',
                                }),
                                tasks: vm.get('tasks'),
                                objects: vm.get('objects'),
                                fromGrid: true,
                                noSubObjects: true,
                            },
                            formulas: {
                                subObjects: {
                                    bind: {
                                        bindTo: '{portcallCombo.selection}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record) {
                                            var cargoes = record.cargoes(),
                                                berths = record.berths(),
                                                crewings = record.crewings(),
                                                folders = record.folders(),
                                                supplies = record.expenses(),
                                                data = [];

                                            folders.each(function (folder) {
                                                let documents = folder.documents();

                                                documents.each(function (document) {
                                                    let doc = document.getData();
                                                    doc.name = document.getDocument().get('original_name');
                                                    doc.type = 'file';
                                                    doc.icon = 'md-icon-description';
                                                    doc.model = doc.model_name;
                                                    doc.subobject_id = doc.id;
                                                    data.push(doc);
                                                });
                                            });

                                            cargoes.each(function (record, index) {
                                                let cargo = record.getData();

                                                cargo.name = cargo.commodity;
                                                cargo.type = 'cargo';
                                                cargo.icon = 'abraxa-icon-cargo';
                                                cargo.model = 'App\\Models\\Cargo\\Cargo';
                                                cargo.subobject_id = cargo.id;
                                                data.push(cargo);
                                            });

                                            berths.each(function (record, index) {
                                                var berth = record.getData();
                                                berth.name = berth.name;
                                                berth.type = 'berth';
                                                berth.icon = 'md-icon-outlined md-icon-place';
                                                berth.model = 'App\\Models\\Berth\\Berth';
                                                berth.subobject_id = berth.id;
                                                data.push(berth);
                                            });

                                            crewings.each(function (record, index) {
                                                var crew = record.getData();
                                                crew.name = crew.name;
                                                crew.icon = 'md-icon-person';
                                                crew.type = 'user';
                                                crew.model = crew.model_name;
                                                crew.subobject_id = crew.id;
                                                data.push(crew);
                                            });

                                            supplies.each(function (record, index) {
                                                let supply = record.getData();
                                                switch (supply.type) {
                                                    case 'service':
                                                        supply.icon = 'abraxa-icon-atm';
                                                        supply.type = 'ctm';
                                                        break;
                                                    case 'supplies':
                                                        supply.icon = 'abraxa-icon-layers';
                                                        supply.type = 'supply';
                                                        break;
                                                    case 'disposal':
                                                        supply.icon = 'abraxa-icon-recycle';
                                                        supply.type = 'disposal';
                                                        break;
                                                    case 'bunkers':
                                                        supply.icon = 'abraxa-icon-oil';
                                                        supply.type = 'bunker';
                                                        break;
                                                    default:
                                                    // code block
                                                }

                                                supply.name = supply.category_name;
                                                supply.model = supply.model_name;
                                                supply.subobject_id = supply.id;
                                                data.push(supply);
                                            });
                                            return data;
                                        }
                                    },
                                },
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
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        viewModel: {
            formulas: {
                buttonStatus: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let status = record.get('status'),
                            ui = '',
                            icon = '',
                            tooltip = '';

                        if (status == 'to-do') {
                            icon = 'md-icon-play-arrow';
                            ui = 'default-light';
                            tooltip = 'To-Do';
                        } else if (status == 'in progress') {
                            icon = 'md-icon-timer md-icon-outlined';
                            ui = 'progress';
                            tooltip = 'In Progress';
                        } else {
                            icon = 'md-icon-check';
                            ui = 'completed';
                            tooltip = 'Completed';
                        }

                        return {
                            icon: icon,
                            ui: ui,
                            tooltip: tooltip,
                        };
                    },
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Task',
                            testId: 'tasksGridTaskCreateSmallBtn',
                            iconCls: 'md-icon-add',
                            cls: 'chameleon_add_task',
                            ui: 'action small',
                            slug: 'taskCreate',
                            hideMode: 'opacity',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function () {
                                let button = this;

                                mixpanel.track('Button clicked', {
                                    Type: 'Button',
                                    Target: 'Create task button',
                                    Tag: 'Secondary event',
                                });

                                // Check if a note is already opened
                                if (button.taskOpened) {
                                    return;
                                }

                                button.taskOpened = true;

                                let vm = this.upVM();
                                let task = Ext.create('Abraxa.view.tasks.AddTaskPopup', {
                                    viewModel: {
                                        data: {
                                            users: this.upVM().get('users'),
                                            currentUser: this.upVM().get('currentUser'),
                                            taskEdit: false,
                                            record: Ext.create('Abraxa.model.task.Task', {
                                                status: 'to-do',
                                                priority: 'normal',
                                            }),
                                            tasks: vm.get('tasks'),
                                            objects: vm.get('objects'),
                                            fromGrid: true,
                                            noSubObjects: true,
                                        },
                                        formulas: {
                                            subObjects: {
                                                bind: {
                                                    bindTo: '{portcallCombo.selection}',
                                                    deep: true,
                                                },
                                                get: function (record) {
                                                    if (record) {
                                                        var cargoes = record.cargoes(),
                                                            berths = record.berths(),
                                                            crewings = record.crewings(),
                                                            folders = record.folders(),
                                                            supplies = record.expenses(),
                                                            data = [];

                                                        folders.each(function (folder) {
                                                            let documents = folder.documents();

                                                            documents.each(function (document) {
                                                                let doc = document.getData();
                                                                doc.name = document.getDocument().get('original_name');
                                                                doc.type = 'file';
                                                                doc.icon = 'md-icon-description';
                                                                doc.model = doc.model_name;
                                                                doc.subobject_id = doc.id;
                                                                data.push(doc);
                                                            });
                                                        });

                                                        cargoes.each(function (record, index) {
                                                            let cargo = record.getData();

                                                            cargo.name = cargo.commodity;
                                                            cargo.type = 'cargo';
                                                            cargo.icon = 'abraxa-icon-cargo';
                                                            cargo.model = 'App\\Models\\Cargo\\Cargo';
                                                            cargo.subobject_id = cargo.id;
                                                            data.push(cargo);
                                                        });

                                                        berths.each(function (record, index) {
                                                            var berth = record.getData();
                                                            berth.name = berth.name;
                                                            berth.type = 'berth';
                                                            berth.icon = 'md-icon-outlined md-icon-place';
                                                            berth.model = 'App\\Models\\Berth\\Berth';
                                                            berth.subobject_id = berth.id;
                                                            data.push(berth);
                                                        });

                                                        crewings.each(function (record, index) {
                                                            var crew = record.getData();
                                                            crew.name = crew.name;
                                                            crew.icon = 'md-icon-person';
                                                            crew.type = 'user';
                                                            crew.model = crew.model_name;
                                                            crew.subobject_id = crew.id;
                                                            data.push(crew);
                                                        });

                                                        supplies.each(function (record, index) {
                                                            let supply = record.getData();
                                                            switch (supply.type) {
                                                                case 'service':
                                                                    supply.icon = 'abraxa-icon-atm';
                                                                    supply.type = 'ctm';
                                                                    break;
                                                                case 'supplies':
                                                                    supply.icon = 'abraxa-icon-layers';
                                                                    supply.type = 'supply';
                                                                    break;
                                                                case 'disposal':
                                                                    supply.icon = 'abraxa-icon-recycle';
                                                                    supply.type = 'disposal';
                                                                    break;
                                                                case 'bunkers':
                                                                    supply.icon = 'abraxa-icon-oil';
                                                                    supply.type = 'bunker';
                                                                    break;
                                                                default:
                                                                // code block
                                                            }

                                                            supply.name = supply.category_name;
                                                            supply.model = supply.model_name;
                                                            supply.subobject_id = supply.id;
                                                            data.push(supply);
                                                        });
                                                        return data;
                                                    }
                                                },
                                            },
                                        },
                                    },
                                    // Add listeners to reset the flag when the task is closed
                                    listeners: {
                                        destroy: () => {
                                            button.taskOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                mixpanel.track('Dialog opened', {
                                    Type: 'Dialog',
                                    Target: 'Task dialog',
                                    Tag: 'Primary event',
                                });

                                // Show the task
                                task.show();
                            },
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search...',
                            width: 280,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var storeTasks = this.upVM().get('tasks');
                                    if (newValue == '') storeTasks.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    var storeTasks = this.upVM().get('tasks');
                                    storeTasks.removeFilter('search');
                                    if (query.length > 2) {
                                        storeTasks.addFilter(
                                            new Ext.data.Query({
                                                id: 'search',
                                                source: 'search_index like "' + query + '"',
                                            })
                                        );

                                        mixpanel.track('Search used', {
                                            Type: 'Grid search',
                                            Target: 'Task grid',
                                            Tag: 'Secondary event',
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-tools',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    enableToggle: true,
                                    iconCls: 'md-icon-filter-alt md-icon-outlined',
                                    text: 'Filter',
                                    testId: 'tasksGridFilterBtn',
                                    handler: function () {
                                        Ext.select('.a-filters').toggleCls('is-hidden');

                                        mixpanel.track('Button clicked', {
                                            Type: 'Button',
                                            Target: 'Filter grid button',
                                            Tag: 'Secondary event',
                                        });
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-settings',
                                    text: 'Customize',
                                    testId: 'tasksGridCustomizeBtn',
                                    margin: '0 0 0 8',
                                    handler: function () {
                                        mixpanel.track('Button clicked', {
                                            Type: 'Button',
                                            Target: 'Customize grid button',
                                            Tag: 'Secondary event',
                                        });

                                        this.find('task-grid').getPlugin('gridviewoptions').showViewOptions();
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
                            text: 'Office',
                            ui: 'filter round',
                            xtype: 'splitbutton',
                            viewModel: {
                                formulas: {
                                    officesFilter: function (get) {
                                        const officesStore = get('companyOffices');
                                        const officesArray = [];
                                        officesStore.each((el) => officesArray.push(el.data));
                                        return officesArray.map((el) => ({
                                            text: el.office_name,
                                            value: el.id,
                                            group: 'current_office_id',
                                        }));
                                    },
                                },
                            },
                            bind: {
                                // hidden: '{taskMainTabbar.activeTabIndex == 0 ? false:true}',
                            },
                            arrowHandler: function () {
                                let button = this,
                                    arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                                    tasks = this.upVM().get('tasks');
                                if (!arrowCls) {
                                    let selected = Ext.ComponentQuery.query(
                                        'menuitem[cls~=taskFilterItem][checked="true"]'
                                    );
                                    Ext.each(selected, function (value, index) {
                                        value.setChecked(false);
                                    });
                                    button.setText('Office');
                                    button.splitArrowElement.removeCls('md-icon-close');
                                    button.splitArrowElement.addCls('x-arrow-el');
                                    button.removeCls('active');
                                    tasks.removeFilter('current_office_id');
                                    return;
                                }
                            },
                            menu: {
                                cls: 'filter-menu',
                                testId: 'tasksGridFilterMenu',
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

                                        //TODO need to be fixed other filters to be remote and search too then it should be uncomment

                                        // store.clearFilter();
                                        // store.setRemoteFilter(true);  // Disable remote filtering
                                        // store.addFilter(
                                        //     {
                                        //       property: 'current_office_id',
                                        //       operator: '=',
                                        //       value: me.getValue()
                                        //     }
                                        //   );

                                        store.addFilter({
                                            id: 'current_office_id',
                                            filterFn: function (record) {
                                                if (record.get('current_office_id') == me.getValue()) {
                                                    return true;
                                                }
                                            },
                                        });

                                        mixpanel.track('Filter used', {
                                            Type: 'Filter',
                                            Target: 'Office filter',
                                            Tag: 'Secondary event',
                                        });
                                    },
                                },
                                bind: {
                                    items: '{officesFilter}',
                                },
                                // items: [
                                //     {
                                //         text: 'To-do',
                                //         group: 'status',
                                //         value: 'to-do',
                                //     },
                                //     {
                                //         text: 'In progress',
                                //         group: 'status',
                                //         value: 'in progress',
                                //     },
                                // ],
                            },
                        },
                        {
                            text: 'Status',
                            ui: 'filter round',
                            testId: 'tasksGridStatusSplitBtn',
                            xtype: 'splitbutton',
                            bind: {
                                hidden: '{taskMainTabbar.activeTabIndex == 0 ? false:true}',
                            },
                            handler: function () {
                                mixpanel.track('Filter clicked', {
                                    Type: 'Filter',
                                    Target: 'Status filter',
                                    Tag: 'Secondary event',
                                });

                                this.showMenu();
                            },
                            arrowHandler: function () {
                                let button = this,
                                    arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                                    tasks = this.upVM().get('tasks');
                                if (!arrowCls) {
                                    let selected = Ext.ComponentQuery.query(
                                        'menuitem[cls~=taskFilterItem][checked="true"]'
                                    );
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
                                testId: 'tasksGridFilterMenu',
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

                                        mixpanel.track('Filter used', {
                                            Type: 'Filter',
                                            Target: 'Status filter',
                                            Tag: 'Secondary event',
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
                                ],
                            },
                        },
                        {
                            text: 'Priority',
                            testId: 'tasksGridPrioritySplitBtn',
                            ui: 'filter round',
                            xtype: 'splitbutton',
                            handler: function () {
                                mixpanel.track('Filter clicked', {
                                    Type: 'Filter',
                                    Target: 'Priority filter',
                                    Tag: 'Secondary event',
                                });

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

                                        mixpanel.track('Filter used', {
                                            Type: 'Filter',
                                            Target: 'Priority filter',
                                            Tag: 'Secondary event',
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
                            testId: 'tasksGridAssignedToMeBtn',
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
                                mixpanel.track('Filter clicked', {
                                    Type: 'Filter',
                                    Target: 'Assigned to me filter',
                                    Tag: 'Secondary event',
                                });

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

                                mixpanel.track('Filter used', {
                                    Type: 'Filter',
                                    Target: 'Assigned to me filter',
                                    Tag: 'Secondary event',
                                });
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'tasks.right.container',
            bind: {
                hidden: '{selectedTask ? false : true}',
            },
        },
    ],
    columns: [
        {
            dataIndex: 'id',
            minWidth: 100,
            text: 'ID',
            cls: 'a-column-id',
            hidden: true,
            resizable: false,
            hidable: false,
            editable: false,
            menuDisableD: true,
            sortable: false,
            cell: {
                cls: 'a-cell-id',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return 'TSK-' + value + '';
                }
            },
        },
        {
            text: 'Task',
            cls: 'a-column-task',
            dataIndex: 'task',
            minWidth: 280,
            resizable: false,
            hidable: false,
            editable: false,
            menuDisabled: true,
            sortable: false,
            cell: {
                encodeHtml: false,
                cls: 'a-widgetcell-task',
                xtype: 'widgetcell',
                selectable: true,
                testId: 'tasksGridWidgetCell',
                // width: 56,
                widget: {
                    xtype: 'container',
                    layout: { type: 'hbox' },
                    items: [
                        {
                            xtype: 'button',
                            margin: '8 20 0 0',
                            height: '100%',
                            testId: 'tasksGridTaskStatusBtn',
                            cls: 'a-task-status-button',
                            slug: 'task',
                            bind: {
                                iconCls: '{buttonStatus.icon} md-icon-outlined',
                                ui: '{buttonStatus.ui} round outlined',
                                permission: '{userPermissions}',
                                tooltip: {
                                    anchorToTarget: true,
                                    html: '{buttonStatus.tooltip}',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                            },
                            handler: function () {
                                let record = this.upVM().get('record'),
                                    status = record.get('status'),
                                    store = this.upVM().get('tasks');

                                if (status == 'to-do') {
                                    record.set('status', 'in progress');
                                } else if (status == 'in progress') {
                                    record.set('status', 'completed');
                                } else {
                                    record.set('status', 'to-do');
                                }

                                mixpanel.track('Button clicked', {
                                    Type: 'Button',
                                    Target: 'Task status button',
                                    Tag: 'Secondary event',
                                });

                                store.sync({
                                    success: function () {
                                        mixpanel.track('Record edited', {
                                            Type: 'Task',
                                            Target: 'Grid',
                                            Tag: 'Primary event',
                                        });
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                            },
                        },
                        {
                            xtype: 'component',
                            bind: {
                                html: '{value}',
                            },
                            viewModel: {
                                formulas: {
                                    value: function (get) {
                                        const record = get('record');
                                        const name = get('record.name');
                                        if (name) {
                                            return (
                                                '<div class="a-task">' +
                                                name +
                                                '</div><div class="a-task-id">TSK-' +
                                                record.get('id') +
                                                (record.get('object_record')
                                                    ? ' / ' + record.get('object_record').voyage.vessel_name
                                                    : '') +
                                                '</div>'
                                            );
                                        }
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        },
        {
            dataIndex: 'current_office_id',
            text: 'Office',
            // sortable: false,
            renderer: function renderer(value, record) {
                const currentOfficeId = value;
                const officesStore = this.upVM().get('companyOffices');
                const officesArray = [];
                officesStore.each((el) => officesArray.push(el.data));
                const currentOffice = officesArray.find((el) => el.id === currentOfficeId);
                let currentOfficeName = currentOffice ? currentOffice.office_name : null;
                return currentOfficeName ? currentOfficeName : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            dataIndex: 'priority',
            text: 'Priority',
            minWidth: 120,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function renderer(value) {
                if (value) {
                    if (value == 'high')
                        return (
                            '<span class="a-status-badge rounded status-high no-border">' +
                            Ext.String.capitalize(value) +
                            '</span>'
                        );
                    else {
                        // return Ext.String.capitalize(value);
                        return (
                            '<span class="a-status-badge rounded status-normal no-border">' +
                            Ext.String.capitalize(value) +
                            '</span>'
                        );
                    }
                }
            },
        },
        {
            text: 'Related to',
            dataIndex: 'ownerable_id',
            minWidth: 220,
            cell: {
                cls: 'a-cell-onj',
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function renderer(value, record) {
                if (record) {
                    let value = record.get('ownerable');
                    if (value) {
                        if (value.model_name == 'App\\Models\\Portcall\\Portcall') {
                            return (
                                '<div class="hbox a_grid_action"><span class="a-badge a-badge-x32 a-badge-portcall mr-12"><i class="md-icon-outlined"></i></span><div class="text-truncate"><span class="fw-b text-truncate">' +
                                value.voyage.vessel_name +
                                '</span><span class="sm-title d-block">' +
                                value.file_id +
                                '</span></div></div>'
                            );
                        } else if (value.model_name == 'App\\Models\\Organization\\Organization') {
                            return (
                                '<div class="hbox a_grid_action"><span class="a-badge a-badge-x32 a-badge-warning mr-12"><i class="abraxa-icon-cdb"></i></span><div class="text-truncate"><span class="fw-b text-truncate">' +
                                value.org_name +
                                '</span><span class="sm-title d-block">#CDB-' +
                                value.org_id +
                                '</span></div></div>'
                            );
                        }
                    }
                }
            },
            grouper: {
                property: 'object_meta_id',
                direction: 'DESC',
            },
            groupHeaderTpl: Ext.create('Ext.XTemplate', '{[this.userInitials(values)]}', {
                userInitials: function (values) {
                    if (values) {
                        if (values.group.data.items[0].data.object_record)
                            return (
                                '<span class="hbox a_grid_action" style="margin-left: 8px"><span class="a-obj-logo a-logo-sm a-logo-appointment mr-8"><i class="md-icon-outlined">business_center</i></span><span>' +
                                values.group.data.items[0].data.object_record.voyage.vessel_name +
                                '<span class="sm-title">(#ABX-' +
                                values.group.data.items[0].data.object_meta_id +
                                ')</span></span></span>'
                            );

                        return 'Unassigned';
                    }
                },
            }),
            sorter: {
                sorterFn: function (a, b) {
                    firstId = 0;
                    secondId = 0;
                    if (a.get('object_record')) firstId = a.get('object_record').id;

                    if (b.get('object_record')) secondId = b.get('object_record').id;

                    // return firstId < secondId ? 1 : (firstId > secondId ? -1 : 0);

                    return firstId < secondId ? 1 : -1;
                },
            },
        },
        {
            text: 'Status',
            dataIndex: 'status',
            minWidth: 120,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        value +
                        '">' +
                        Ext.String.capitalize(value) +
                        '</div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Due date',
            dataIndex: 'due_date',
            minWidth: 180,
            cell: {
                bind: {
                    cls: 'a-cell-date',
                },
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function renderer(value, record) {
                if (value) {
                    let cls = record.get('overdue') ? 'c-red' : '';
                    return (
                        '<span class="a-date-cell hbox ' +
                        cls +
                        '"><i class="md-icon-outlined md-16">calendar_today</i>' +
                        moment(value).format('D MMM YY - H:mm') +
                        '</span>'
                    );
                } else {
                    return '<span class="a-date-cell hbox"><i class="md-icon-outlined md-16">calendar_today</i>-- / --</span>';
                }
            },
        },
        {
            text: 'Created at',
            dataIndex: 'created_at',
            minWidth: 180,
            hidden: true,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function renderer(value) {
                if (value) {
                    return (
                        '<span class="a-date-cell hbox">' +
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24) +
                        '</span>'
                    );
                }
            },
        },
        {
            text: 'Assigned to',
            dataIndex: 'assigned_to',
            minWidth: 180,
            cell: {
                cls: 'expand a-cell-person',
                encodeHtml: false,
                bind: {
                    tpl: '{activeUser}',
                },
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.person_details',
                        fn: function fn(el) {
                            const users = this.component.lookupViewModel().get('users');
                            const user = users.getById(this.component.getRecord().get('assigned_to')).getData();
                            let tipExist = Ext.getCmp('createdByTool');
                            if (tipExist) {
                                tipExist.destroy();
                            }
                            Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                target: el.target,
                                id: 'createdByTool',
                                viewModel: {
                                    data: {
                                        user: user,
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                        },
                    },
                },
                viewModel: {
                    data: {
                        isChange: false,
                    },
                    formulas: {
                        changeRecord: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    this.set('isChange', !this.get('isChange'));
                                }
                            },
                        },
                        changeUser: {
                            bind: {
                                bindTo: '{activeUser}',
                                deep: true,
                            },
                            get: function (users) {
                                if (users) {
                                    this.set('isChange', !this.get('isChange'));
                                }
                            },
                        },
                        activeUser: {
                            bind: {
                                bindTo: '{isChange}',
                                deep: true,
                            },
                            get: function (users) {
                                let record = this.get('record');
                                if (record) {
                                    const user = this.get('users').getById(record.get('assigned_to'));
                                    if (!user) return AbraxaConstants.placeholders.emptyValue;
                                    const assigned_to = user.get('first_name') + '. ' + user.get('last_name'),
                                        user_img = user.get('profile_image')
                                            ? '<img height="30" class="a_grid_action" src="' +
                                              user.get('profile_image') +
                                              '"/>'
                                            : '<i class="md-icon-outlined a_grid_action">person</i>';
                                    return (
                                        '<a class="a-person a-icon-round a_grid_action person_details" href="javascript:void(0)">' +
                                        user_img +
                                        assigned_to +
                                        '</a>'
                                    );
                                } else {
                                    return AbraxaConstants.placeholders.emptyValue;
                                }
                            },
                        },
                    },
                },
            },
            grouper: {
                groupFn: function (record) {
                    let type = record.get('assigned_type');
                    if (type) {
                        var first_name = record.get('assigned_to_first_name');
                        var last_name = record.get('assigned_to_last_name');
                        if (first_name && last_name) {
                            return first_name[0] + '. ' + last_name;
                        }
                    }
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            // docked: "right",
            toolDefaults: {
                xtype: 'tool',
            },
            tools: [
                {
                    type: 'gear',
                    hidden: true,
                    ui: 'tool-md',
                    right: 4,
                    handler: function () {
                        this.up('grid').getPlugin('gridviewoptions').showViewOptions();
                    },
                    tooltip: {
                        anchorToTarget: true,
                        html: 'Customize',
                        align: 'bc-tc?',
                    },
                },
            ],
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        testId: 'tasksGridMoreActionsTool',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (owner, tool, e) {
                            let vm = this.upVM();
                            Ext.create('Abraxa.view.task.TaskEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        task: tool.record,
                                        grid: owner,
                                        is_archived: false,
                                    },
                                },
                            }).showBy(this);

                            mixpanel.track('Button clicked', {
                                Type: 'Button',
                                Target: 'More actions button',
                                Tag: 'Secondary event',
                            });
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        testId: 'tasksGridViewDetailsBtn',
                        cls: 'chameleon_view_details_portcall',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            mixpanel.track('Button clicked', {
                                Type: 'Button',
                                Target: 'View details button',
                                Tag: 'Secondary event',
                            });

                            mixpanel.track('Right panel opened', {
                                Type: 'Right panel',
                                Target: 'Task right panel',
                                Tag: 'Primary event',
                            });
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (grid, location) {
            // console.log(location.event.target.classList);
            if (location.event.target.classList.contains('a_grid_action')) return false;

            this.upVM().set('selectedTask', location.record);

            mixpanel.track('Grid row clicked', {
                Type: 'Grid row',
                Target: 'Task grid',
                Tag: 'Secondary event',
            });

            mixpanel.track('Right panel opened', {
                Type: 'Right panel',
                Target: 'Task right panel',
                Tag: 'Primary event',
            });
        },
    },
});
