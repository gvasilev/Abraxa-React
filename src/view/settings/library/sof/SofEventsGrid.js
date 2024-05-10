Ext.define('Abraxa.view.settings.library.sof.SofEventsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.sof.grid',
    cls: 'a-offset-grid abraxa-grid',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    bind: {
        store: '{groupedEvents}',
    },
    itemConfig: {
        height: 48,
        viewModel: true,
    },
    collapsible: true,
    pinHeaders: false,
    grouped: true,
    groupHeader: {
        tpl: '<div class="a-group-header a-badge-sof sof-{[values.children[0].data.type.category.name.toLowerCase()]}">{[values.children[0].data.type.category.name]} ({count})</div>',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            padding: '0 24 0 32',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                },
                // {
                //     xtype: 'button',
                //     text: 'Event',
                //     ui: 'action small',
                //     iconCls: 'md-icon-add',
                //     handler: function (me) {
                //         let currentUserPlan = me.upVM().get('currentUserPlan');
                //         if (currentUserPlan == 'starter') {
                //             Ext.create('Abraxa.view.main.UpgradeDialog').show();

                //         } else {
                //             Ext.create('Abraxa.view.settings.library.sof.SofEventForm', {
                //                 viewModel: {
                //                     parent: me.upVM(),
                //                     data: {
                //                         title: 'Create SOF event',
                //                         editMode: false,
                //                         record: Ext.create('Abraxa.model.sof.DefaultEvents', {})
                //                     }
                //                 }
                //             }).show();
                //         }
                //     }
                // },
                {
                    xtype: 'searchfield',
                    ui: 'hovered-underline',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search...',
                    width: 280,
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            var storeEvents = this.upVM().get('sofEvents');
                            if (newValue == '') storeEvents.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue().toLowerCase();
                            var storeEvents = this.upVM().get('sofEvents');
                            storeEvents.removeFilter('search');
                            if (query.length > 2) {
                                storeEvents.addFilter(
                                    new Ext.data.Query({
                                        id: 'search',
                                        source: 'search_index like "' + query + '"',
                                    })
                                );
                            }
                        },
                    },
                },
                {
                    xtype: 'button',
                    ui: 'tool-text-sm',
                    enableToggle: true,
                    iconCls: 'md-icon-filter-alt md-icon-outlined',
                    text: 'Filter',
                    hidden: true,
                    hideMode: 'opacity',
                    handler: function () {
                        Ext.select('.a-filters').toggleCls('is-hidden');
                    },
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Event',
            cls: 'a-column-offset-x32',
            dataIndex: 'system_name',
            groupable: false,
            cell: {
                cls: 'a-cell-offset-x48',
                encodeHtml: false,
            },
            flex: 2,
        },
        {
            text: 'Alias name',
            dataIndex: 'event_alias',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return value;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Category',
            dataIndex: 'default_sof_event_category_id',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record) {
                    let cls = '';
                    switch (value) {
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
                        record.get('type').category.name +
                        '</span>'
                    );
                }
            },
        },
        {
            text: 'Type',
            dataIndex: 'default_sof_event_type_id',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                return record.get('type').name;
            },
        },
        {
            text: 'Reference ID',
            dataIndex: 'reference',
            minWidth: 220,
            cell: {
                cls: 'c-grey',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return value;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date a-cell-py8',
                height: 48,
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user_alias}',
                            updated_at: '{record.updated_at_alias}',
                        },
                    },
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
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                hideMode: 'opacity',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        cls: 'test-id-grid-SofEventsGrid-edit-button',
                        iconCls: 'md-icon-outlined md-icon-edit',
                        ui: 'tool-md round',
                        slug: 'settingsLibraryService',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'Set event alias',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            anchor: true,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            let record = this.upVM().get('record');

                            Ext.create('Abraxa.view.settings.library.sof.SofEventAliasForm', {
                                viewModel: {
                                    parent: me.upVM(),
                                    data: {
                                        title: 'Edit event',
                                        editMode: true,
                                        record: record,
                                    },
                                },
                            }).show();
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (me, selection) {},
    },
});
