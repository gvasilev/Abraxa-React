import './SOFEventForm';
import '../../../../core/plugins/SOFRowEditing';

Ext.define('Abraxa.view.portcall.sof.SOFEvents', {
    extend: 'Ext.Container',
    xtype: 'sof.events',
    // controller: 'SofController',
    // cls: 'a-bnc-main a-bnc-sof',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            padding: '0 16 0 24',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    html: '<h5>Statement of facts</h5>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    customComponentHolderId: 'sofButtonToolbar',
                    bind: {
                        hidden: '{nonEditable}',
                        customComponents: '{currentCompany.custom_components}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            padding: '0 8 0 0',
                            cls: 'a-br-100',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    margin: '0 0 0 8',
                                    iconCls: 'md-icon-outlined md-icon-assignment-return',
                                    slug: 'portcallSofEventAssign',
                                    text: 'Assign to berth',
                                    bind: {
                                        // disabled: '{sofGrid.selection ? false : true}',
                                        hidden: '{nonEditable || !sofGrid.selection ? true : false}',
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        cls: 'filter-menu',
                                        listeners: {
                                            painted: function (me) {
                                                me.removeAll(true);

                                                let store = me.upVM().get('berths'),
                                                    data = store.getData().getRange(),
                                                    record = this.upVM().get('record'),
                                                    items = [];

                                                Ext.each(data, function (value) {
                                                    let item = {
                                                        padding: '0 16',
                                                        text: value.get('name'),
                                                        record: value,
                                                        handler: function (cmp) {
                                                            let store = this.upVM().get('events'),
                                                                grid =
                                                                    Ext.ComponentQuery.query(
                                                                        'grid[cls~=a-sof-events]'
                                                                    )[0],
                                                                selection = grid.getSelections();

                                                            Ext.Msg.confirm(
                                                                'Confirmation',
                                                                [
                                                                    'Are you sure you want to assign the selected events to <b>' +
                                                                        cmp.getText() +
                                                                        '</b>?',
                                                                ].join(''),
                                                                function (answer) {
                                                                    if (answer == 'yes') {
                                                                        Ext.each(selection, function (record) {
                                                                            record.set(
                                                                                'da_berth_id',
                                                                                cmp.getRecord().get('id')
                                                                            );
                                                                            record.set(
                                                                                'da_berth_name',
                                                                                cmp.getRecord().get('da_berth_name')
                                                                            );
                                                                        });
                                                                        store.sync({
                                                                            success: function (response, options) {
                                                                                Ext.toast('Record updated', 1000);
                                                                                grid.deselectAll();
                                                                                Ext.ComponentQuery.query(
                                                                                    '[cls~=sof_selection_checkbox]'
                                                                                )[0].setChecked(false);
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
                                                                        ui: 'action loading',
                                                                        text: 'Assign',
                                                                    },
                                                                ]
                                                            );
                                                        },
                                                    };
                                                    items.push(item);
                                                });
                                                me.setItems(items);
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    margin: '0 0 0 8',
                                    text: 'Delete',
                                    slug: 'portcallSofEventDelete',
                                    bind: {
                                        // disabled: '{sofGrid.selection ? false : true}',
                                        hidden: '{nonEditable || !sofGrid.selection ? true : false}',
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (cmp) {
                                        let vm = this.upVM(),
                                            object_record = vm.get('object_record'),
                                            store = this.upVM().get('events'),
                                            grid = Ext.ComponentQuery.query('grid[cls~=a-sof-events]')[0],
                                            selection = grid.getSelections();

                                        Ext.Msg.confirm(
                                            'Delete',
                                            ['Are you sure you want to delete the selected events?'].join(''),
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    Ext.each(selection, function (record) {
                                                        store.remove(record);
                                                    });
                                                    store.sync({
                                                        success: function (response, options) {
                                                            object_record.set('updated_at', new Date());
                                                            object_record.set('user', vm.get('currentUser').getData());
                                                            Ext.toast('Record updated', 1000);
                                                            grid.deselectAll();
                                                            Ext.ComponentQuery.query(
                                                                '[cls~=sof_selection_checkbox]'
                                                            )[0].setChecked(false);
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
                                                    separator: true,
                                                },
                                            ]
                                        );
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-add',
                            margin: '0 0 0 8',
                            slug: 'portcallDocumentUpload',
                            text: 'Document',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function () {
                                mixpanel.track('SOF document (sof screen) – button');
                                Ext.create('Abraxa.view.adocs.SofDocumentForm', {
                                    viewModel: {
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            documentTypes: this.upVM().get('documentTypes'),
                                            defaultCargoUnits: this.upVM().get('defaultCargoUnits'),
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-difference',
                            ui: 'tool-text-sm',
                            text: 'Export',
                            margin: '0 0 0 8',
                            handler: function (me) {
                                let grid = me.find('sof-events-grid');
                                grid.saveDocumentAs({
                                    type: 'xlsx', // exporter alias
                                    title: 'SOF Events',
                                    showSummary: true,
                                    fileName: 'SOF_events.xlsx',
                                });
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'More actions',
                            iconAlign: 'right',
                            iconCls: 'md-icon-expand-more',
                            ui: 'small',
                            cls: 'x-has-menu',
                            margin: '0 0 0 8',
                            arrow: false,

                            menu: {
                                ui: 'has-icons',
                                items: [
                                    {
                                        text: 'Save as template',
                                        slug: 'templateSave',
                                        bind: {
                                            hidden: '{nonEditable ? true : false}',
                                            html: '{(currentUserPlan == "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                                            permission: '{userPermissions}',
                                        },
                                        iconCls: 'md-icon-playlist-add md-icon-outlined',
                                        handler: function (me) {
                                            let vm = me.upVM(),
                                                currentUserPlan = vm.get('currentUserPlan');
                                            if (currentUserPlan == 'starter') {
                                                Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                            } else {
                                                mixpanel.track('SOF - Save as template');
                                                Ext.create('Abraxa.view.portcall.sof.CreateSOFTemplate', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            template: Ext.create('Abraxa.model.template.Template', {
                                                                type: 'sof',
                                                            }),
                                                            items: vm.get('events').getRange(),
                                                        },
                                                    },
                                                }).show();
                                            }
                                        },
                                    },
                                    {
                                        text: 'Apply template',
                                        slug: 'templateApply',
                                        bind: {
                                            hidden: '{nonEditable ? true : false}',
                                            html: '{(currentUserPlan == "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                                            permission: '{userPermissions}',
                                        },
                                        iconCls: 'md-icon-playlist-add-check md-icon-outlined',
                                        handler: function (me) {
                                            let vm = me.upVM(),
                                                currentUserPlan = vm.get('currentUserPlan');
                                            if (currentUserPlan == 'starter') {
                                                Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                            } else {
                                                mixpanel.track('SOF - Apply template');
                                                Ext.create('Abraxa.view.portcall.sof.ApplySOFTemplate', {
                                                    viewModel: {
                                                        parent: vm,
                                                        data: {
                                                            gridItems: vm.get('events'),
                                                            object_record: vm.get('object_record'),
                                                        },
                                                        stores: {
                                                            taskTemplates: {
                                                                type: 'templates',
                                                                autoLoad: true,
                                                                filters: [
                                                                    {
                                                                        property: 'type',
                                                                        operator: '=',
                                                                        value: 'sof',
                                                                        exactMatch: true,
                                                                    },
                                                                ],
                                                            },
                                                            templateItems: {
                                                                type: 'template.items',
                                                                autoLoad: true,
                                                                proxy: {
                                                                    extraParams: {
                                                                        type: 'sof',
                                                                        template_id: '{selectedTemplate.selection.id}',
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
                                                    },
                                                }).show();
                                            }
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
            docked: 'top',
            weight: 1,
        },
        {
            xtype: 'grid',
            cls: 'a-sof-events abraxa-grid',
            ui: 'bordered',
            flex: 1,
            reference: 'sofGrid',
            itemId: 'sof-events-grid',
            columnResize: false,
            weighted: true,
            itemConfig: {
                viewModel: {},
            },
            store: [],
            hideHeaders: true,
            bind: {
                store: '{events}',
                plugins: '{sofEventsPlugins}',
                selectable: '{selectableEvents}',
            },
            emptyText: {
                xtype: 'container',
                cls: 'a-empty-text-top',
                zIndex: 999,
                layout: {
                    type: 'vbox',
                },
                centered: true,
                html: '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No events available</span></div></div>',
            },
            items: [
                {
                    xtype: 'sof.event.form',
                    docked: 'top',
                    weight: 0,
                    shadow: false,
                    subObject: 'sof',
                    slug: 'portcallOpsSof',
                    skipEditPermission: true,
                    bind: {
                        cls: '{nonEditable ? "hidden" : ""}',
                        objectPermission: '{objectPermissions}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'portcall.sof.remarks',
                },
                {
                    xtype: 'div',
                    html: '<hr class="mt-16 mb-8">',
                },
                {
                    xtype: 'portcall.sof.signatures',
                },
            ],
            // hideHeaders: true,

            columns: [
                {
                    dataIndex: 'default_sof_event_id',
                    text: 'Event',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    width: 300,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        xtype: 'sof.general.events',
                        padding: '0 4',
                        ui: 'classic hovered-border',
                        placeholder: 'Event name',
                        bind: {
                            store: '{defaultGeneralEvents}',
                        },
                        listeners: {
                            select: function (cmp, selection) {
                                if (cmp.parent) {
                                    let record = this.parent.parent.getRecord();

                                    record.set('event_name', selection.get('name'));
                                    record.set('default_sof_event_category_id', selection.get('type').category.id);
                                }
                            },
                            keydown: function (cmp, e) {
                                let key = e.event.key,
                                    shiftKey = e.shiftKey;

                                if (key == 'Tab' && shiftKey) {
                                    let grid = cmp.up('grid'),
                                        record = grid.getSelection(),
                                        editor = grid.getPlugin(),
                                        store = grid.getStore(),
                                        index = store.indexOf(record);

                                    if (index != 0) {
                                        editor.startEdit(index - 1, 1);
                                        grid.select(index - 1);
                                    }
                                }
                            },
                        },
                    },
                    exportRenderer: function exportRenderer(val, record, dataIndex, cell, column) {
                        return record.get('event_name');
                    },
                    renderer: function (value, record) {
                        if (record) {
                            let cls = '';
                            let eventName = record.get('event_name');
                            switch (record.get('default_sof_event_category_id')) {
                                case 1:
                                    cls = 'sof-event';
                                    break;
                                case 4:
                                    cls = 'sof-working';
                                    break;
                                case 5:
                                    cls = 'sof-stoppage';
                                    break;
                                case 3:
                                    cls = 'sof-shifting';
                                    break;
                                case 2:
                                    cls = 'sof-waiting';
                                    break;
                                default:
                                    cls = 'sof-miscellaneous';
                            }
                            return (
                                '<div class="hbox"><div class="a-badge-sof ' +
                                cls +
                                '"></div><span>' +
                                eventName +
                                '</span>'
                            );
                        } else {
                            return '<span class="a-cell-placeholder">Event name</span>';
                        }
                    },
                },
                {
                    dataIndex: 'event_date',
                    text: 'Date',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    width: 124,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        xtype: 'abraxa.datefield',
                        padding: '0 4',
                        ui: 'classic hovered-border',
                        name: 'event_date',
                        placeholder: 'Date',
                    },
                    exportRenderer: function (val, record, dataIndex, cell, column) {
                        return moment(record.get('event_date')).isValid()
                            ? moment(record.get('event_date')).format('D MMM YY ddd')
                            : '';
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return moment(value).format('D MMM YY ddd');
                        } else {
                            return '<span class="a-cell-placeholder">Date</span>';
                        }
                    },
                },
                {
                    dataIndex: 'event_from',
                    text: 'From',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    width: 66,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        xtype: 'abraxa.timefield',
                        padding: '0 4',
                        ui: 'classic hovered-border',
                        placeholder: 'Time',
                        bind: {
                            placeholder: '{sofGrid.selection.default_sof_event_category_id == 1 ? "Time" : "From"}',
                            required: '{sofGrid.selection.default_sof_event_category_id != 1 ? true : false}',
                        },
                    },
                    exportRenderer: function (val, record, dataIndex, cell, column) {
                        return moment(record.get('event_from')).isValid()
                            ? moment(record.get('event_from')).format('HH:mm')
                            : '';
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return moment(value).format('HH:mm');
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                },
                {
                    dataIndex: 'event_to',
                    text: 'To',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    width: 66,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        xtype: 'abraxa.timefield',
                        padding: '0 4',
                        ui: 'classic hovered-border',
                        placeholder: 'To',
                        bind: {
                            placeholder: '{sofGrid.selection.default_sof_event_category_id == 1 ? "" : "To"}',
                            disabled: '{sofGrid.selection.default_sof_event_category_id == 1 ? true : false}',
                        },
                    },
                    exportRenderer: function (val, record, dataIndex, cell, column) {
                        return moment(record.get('event_to')).isValid()
                            ? moment(record.get('event_to')).format('HH:mm')
                            : '';
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return moment(value).format('HH:mm');
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                },
                {
                    dataIndex: 'event_comment',
                    text: 'Comment',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    flex: 1,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        padding: '0 4',
                        placeholder: 'Comment',
                        ui: 'classic hovered-border',
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return value;
                        } else {
                            return '<span class="a-cell-placeholder">Comment</span>';
                        }
                    },
                },
                {
                    dataIndex: 'da_berth_id',
                    text: 'Berth',
                    sortable: false,
                    editable: true,
                    menuDisabled: true,
                    slug: 'portcallSofEventAssign',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    width: 170,
                    cell: {
                        encodeHtml: false,
                    },
                    editor: {
                        xtype: 'selectfield',
                        padding: '0 4',
                        ui: 'classic hovered-border',
                        valueField: 'id',
                        displayField: 'name',
                        queryMode: 'local',
                        clearable: true,
                        store: [],
                        slug: 'portcallSofEventAssign',
                        bind: {
                            store: '{berths}',
                            placeholder: '{nonEditable ? "" : "Assign to berth"}',
                            permission: '{userPermissions}',
                        },
                        listeners: {
                            blur: function (cmp, event) {
                                if (event.forwardTab) {
                                    let grid = this.up('grid'),
                                        record = grid.getSelection(),
                                        editor = grid.getPlugin(),
                                        store = grid.getStore(),
                                        index = store.indexOf(record);

                                    if (store.getCount() != index + 1) {
                                        editor.startEdit(index + 1, 1);
                                        grid.select(index + 1);
                                    }
                                }
                            },
                            select: function (me, selection) {
                                let grid = this.up('grid');
                                if (grid) {
                                    let record = this.parent.parent.getRecord();
                                    if (record) {
                                        record.set('da_berth_name', selection.get('name'));
                                    }
                                }
                            },
                            clearicontap: function () {
                                let grid = this.up('grid');
                                if (grid) {
                                    let record = this.parent.parent.getRecord();
                                    record.set('name', null);
                                }
                            },
                        },
                    },
                    exportRenderer: function (val, record, dataIndex, cell, column) {
                        return record.get('berth') ? record.get('berth').name : '';
                    },
                    renderer: function (value, record) {
                        if (value) {
                            let berthStore = this.upVM().get('berths'),
                                berthRecord = berthStore.getById(value);
                            if (berthRecord) {
                                return (
                                    '<span class="c-link hbox"><i class="md-icon-outlined fs-16 c-link mr-8">place</i><span class="text-truncate">' +
                                    berthRecord.get('name') +
                                    '</span></span>'
                                );
                            }
                        } else {
                            let nonEditable = this.upVM().get('nonEditable');
                            if (!nonEditable) return '<span class="a-cell-placeholder">Assign to berth</span>';
                        }
                    },
                },
                {
                    width: 42,
                    slug: 'portcallOpsSof',
                    bind: {
                        hidden: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                    cell: {
                        cls: 'a-cell-more a-cell-actions a-actions-hover',
                        encodeHtml: false,
                        tools: [
                            {
                                xtype: 'button',
                                ui: 'round tool-xs',
                                iconCls: 'md-icon-remove-circle-outline',
                                disabled: false,
                                slug: 'portcallOpsSof',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                                tooltip: {
                                    align: 'bc-tc?',
                                    html: 'Delete',
                                },
                                handler: function (value, metadata) {
                                    let record = this.toolOwner.getRecord();
                                    // let store = me.upVM().get('cargoes');
                                    Ext.Msg.confirm(
                                        'Delete',
                                        'Are you sure you want to delete this event?',
                                        function (answer) {
                                            if (answer == 'yes') {
                                                record.erase({
                                                    success: function () {
                                                        Ext.toast('Record updated');
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
                                                separator: true,
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                },
            ],
            listeners: {
                beforeedit: function (grid, location, eOpts) {
                    if (location.columnIndex == 0 || location.columnIndex == 7) {
                        return false;
                    }
                },
                edit: function (grid, location, eOpts) {
                    let vm = this.upVM(),
                        record = vm.get('object_record');
                    grid.deselectAll();
                    grid.getStore().sync({
                        success: function () {
                            record.set('updated_at', new Date());
                            record.set('user', vm.get('currentUser').getData());
                            Ext.toast('Record updated');
                        },
                    });
                },
                canceledit: function (grid, location, eOpts) {
                    grid.deselectAll();
                },
            },
        },
    ],
});
