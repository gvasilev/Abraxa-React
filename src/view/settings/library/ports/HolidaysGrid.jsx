import './CreateEditHoliday.jsx';
import './HolidaysEditMenu.jsx';
Ext.define('Abraxa.view.settings.library.ports.HolidaysGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.holidays.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'abraxa-grid a-offset-grid',
    reference: 'holidaysGrid',
    keyMapEnabled: true,
    loadingText: false,
    infinite: false,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('holidaysGrid.selection'),
                grid = Ext.ComponentQuery.query('settings\\.library\\.holidays\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
    bind: {
        store: '{portServedHolidays}',
    },
    scrollable: 'y',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="Group_20500" data-name="Group 20500" transform="translate(-1244 -493)"> <g id="Group_20499" data-name="Group 20499" transform="translate(410 148)" opacity="0.6"> <circle id="Ellipse_776" data-name="Ellipse 776" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <path id="Path_8557" data-name="Path 8557" d="M42.5,5.5H40.25V1h-4.5V5.5H13.25V1H8.75V5.5H6.5A4.513,4.513,0,0,0,2,10V46a4.513,4.513,0,0,0,4.5,4.5h36A4.513,4.513,0,0,0,47,46V10A4.513,4.513,0,0,0,42.5,5.5Zm0,40.5H6.5V21.25h36Zm0-29.25H6.5V10h36Z" transform="translate(1281.5 529.25)" fill="#c8d4e6"/> </g> </svg><div class="a-no-content-txt">No holidays available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Holiday',
                iconCls: 'md-icon-add',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                handler: function (btn, e) {
                    Ext.create('Abraxa.view.settings.library.ports.CreateEditHoliday', {
                        viewModel: {
                            parent: btn.upVM(),
                            data: {
                                editMode: false,
                                store: btn.upVM().get('portsServerGrid.selection').holidays(),
                                holiday: Ext.create('Abraxa.model.common.Holiday', {
                                    country_id: btn.upVM().get('portsServerGrid.selection').get('port').country_id,
                                }),
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        viewModel: true,
    },
    selectable: {
        headerCheckbox: false,
        mode: 'multi',
        checkbox: true,
        checkboxDefaults: {
            xtype: 'selectioncolumn',
            text: null,
            dataIndex: '',
            width: 30,
            subObject: 'crewing',
            bind: {
                cls: '{nonEditable ? "hidden" : ""}',
                objectPermission: '{objectPermissions}',
            },
            listeners: {
                checkchange: function (me, rowIndex, checked, record, e, eOpts) {
                    if (checked) {
                        record.set('is_checked', true);
                    } else {
                        record.set('is_checked', false);
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            margin: '16 24 0 32',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Holiday',
                    testId: 'settingsLibraryHolidayCreate',
                    iconCls: 'md-icon-add',
                    ui: 'action small',
                    slug: 'settingsLibraryHolidayCreate',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function (btn, e) {
                        Ext.create('Abraxa.view.settings.library.ports.CreateEditHoliday', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    editMode: false,
                                    store: btn.upVM().get('portsServerGrid.selection').holidays(),
                                    holiday: Ext.create('Abraxa.model.common.Holiday', {
                                        country_id: btn.upVM().get('portsServerGrid.selection').get('port').country_id,
                                    }),
                                },
                            },
                        }).show();
                    },
                },
                {
                    xtype: 'div',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            padding: '0 8 0 0',
                            layout: 'hbox',
                            hidden: true,
                            showAnimation: 'fade',
                            bind: {
                                hidden: '{holidaysGrid.selection ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-content-copy',
                                    text: 'Duplicate',
                                    arrow: false,
                                    slug: 'settingsLibraryHoliday',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (me) {
                                        let grid = this.up('grid'),
                                            selections = grid.getSelections();
                                        if (selections.length === 0) {
                                            Ext.Msg.alert('Suggestion', 'Please select at least one member.');
                                        } else {
                                            let me = this,
                                                port = me.upVM().get('portsServerGrid.selection');
                                            Ext.create('Abraxa.view.settings.library.ports.DuplicateHoliday', {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        port: port,
                                                        holiday: selections,
                                                        multiple: true,
                                                    },
                                                    stores: {
                                                        filteredPortServed: {
                                                            source: '{portsServed}',
                                                            filters: '{portFilter}',
                                                        },
                                                    },
                                                    formulas: {
                                                        portFilter: {
                                                            bind: {
                                                                bindTo: '{port}',
                                                                deep: true,
                                                            },
                                                            get: function (port) {
                                                                if (port) {
                                                                    let filteredPortServed =
                                                                        this.get('filteredPortServed');
                                                                    if (filteredPortServed)
                                                                        filteredPortServed.clearFilter();
                                                                    return function (rec) {
                                                                        if (rec.get('port_id') != port.get('port_id')) {
                                                                            return true;
                                                                        }
                                                                    };
                                                                } else {
                                                                    return function (item) {
                                                                        return true;
                                                                    };
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
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Date',
            dataIndex: 'date',
            flex: 1.5,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-default a-badge-rounded"><i class="md-icon-outlined md-16">calendar_today</i></div><span class="text-truncate fw-b ml-16">' +
                        Ext.Date.format(val, 'j F') +
                        '</span></div>'
                    );
                }
            },
        },
        {
            text: 'Description',
            flex: 2,
            dataIndex: 'description',
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return Ext.String.capitalize(val);
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Type',
            dataIndex: 'type',
            flex: 1,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return '<span class="a-status-badge status-round text-capitalize status-c-blue">' + val + '</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Updated by',
            flex: 1,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    padding: '0 12',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            toolDefaults: {
                xtype: 'tool',
            },
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
                        arrow: false,
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = this.upVM().get('record'),
                                vm = this.up('grid').upVM();
                            this.up('grid').deselectAll();
                            Ext.create('Abraxa.view.settings.library.ports.HolidaysEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        holiday: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});
