import './SuggestDialogs/SuggestPort/SuggestPortDialog.jsx';
import '../../../../model/suggestions/Port.jsx';
import '../../system/ports/AddPort.jsx';
Ext.define('Abraxa.view.settings.library.ports.PortsServedGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.portsserved.grid',
    cls: 'a-offset-grid abraxa-grid ports_served_grid',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    bind: {
        store: '{portsServed}',
    },
    reference: 'portsServerGrid',
    itemConfig: {
        viewModel: true,
    },
    selectable: {
        mode: 'single',
    },
    plugins: {
        gridcellediting: {
            selectOnEdit: false,
            triggerEvent: 'click',
        },
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 30,
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
                                html: '<strong>{portsServed.totalCount}</strong> records',
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
                    xtype: 'button',
                    testId: 'settingsLibraryPortServedCreateButton',
                    text: 'Add Port',
                    ui: 'action small',
                    iconCls: 'md-icon-add',
                    slug: 'settingsLibraryPortServedCreate',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function (btn, e) {
                        let portsserved = this.upVM().get('portsServed');
                        let dialog = Ext.create('Abraxa.view.settings.ports.AddPort', {
                            viewModel: {
                                data: {
                                    record: new Abraxa.model.common.PortServed(),
                                },
                                stores: {
                                    portsserved: portsserved,
                                },
                            },
                        });
                        dialog.show();
                    },
                },
                {
                    xtype: 'searchfield',
                    ui: 'hovered-underline',
                    cls: 'a-field-icon icon-search',
                    placeholder: 'Search by Port or Locode',
                    width: 280,
                    margin: '0 0 3 0',
                    centered: true,
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            var storeportsServed = this.up('grid').getStore();
                            if (newValue == '') storeportsServed.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue().toLowerCase();
                            var storeportsServed = this.up('grid').getStore();
                            storeportsServed.removeFilter('search');
                            if (query.length > 2) {
                                storeportsServed.addFilter({
                                    id: 'search',
                                    property: 'search',
                                    operator: '=',
                                    value: query,
                                    exactMatch: true,
                                });
                            }
                        },
                    },
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Port',
            dataIndex: 'port_name',
            xtype: 'templatecolumn',
            cls: 'a-column-offset-x32',
            minWidth: 220,
            flex: 4,
            tpl: new Ext.XTemplate('{[this.create(values)]}', {
                create: function (values) {
                    let data = AbraxaConstants.placeholders.emptyValue;
                    if (values && values.port_id) {
                        let flag = '';
                        if (values.port && values.port.flag_abv_2_letters) {
                            flag =
                                'https://static.abraxa.com/flags/1x1/' +
                                values.port.flag_abv_2_letters.toLowerCase() +
                                '.svg';
                        }
                        data =
                            '<div class="hbox" data-portid="' +
                            values.port_id +
                            '"><img src="' +
                            flag +
                            '" class="a-flag-x24 a-img-round"><span class="fw-b c-blue ml-16">' +
                            values.port_name +
                            '</span></div>';
                    }
                    return data;
                },
            }),
            cell: {
                // cls: "expand a-cell-port",
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
                // listeners: {
                //     click: {
                //         element: "element",
                //         delegate: "a",
                //         fn: function (el) {
                //             let portId = el.currentTarget.getAttribute("data-portid");
                //             if (portId) {
                //                 Abraxa.getApplication().getController('AbraxaController').showPortDialogById(portId);
                //             }
                //         }
                //     }
                // }
            },
        },
        {
            text: 'LOCODE',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (record && record.get('port') && record.get('port').code) {
                    return '<span class="c-grey">' + record.get('port').code + '</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Terminals',
            dataIndex: 'terminals',
            minWidth: 140,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record && record.terminals()) {
                    return (
                        '<span class="a-status-badge status-admin a-status-sm status-round">' +
                        record.terminals().count() +
                        '</span>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Berths',
            dataIndex: 'berths',
            minWidth: 140,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record && record.berths()) {
                    return (
                        '<span class="a-status-badge status-admin a-status-sm status-round">' +
                        record.berths().count() +
                        '</span>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Timezone',
            dataIndex: 'timezone',
            minWidth: 140,
            cell: {
                encodeHtml: false,
            },
            renderer: function (record) {
                if (record) {
                    return record;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Reference ID',
            dataIndex: 'reference',
            minWidth: 220,
            editable: true,
            cell: {
                cls: 'c-grey',
                encodeHtml: false,
                selectable: false,
            },
            editor: {
                field: {},
                listeners: {
                    complete: function (editor) {
                        const gridRecord = editor.ownerCmp.getRecord();
                        if (gridRecord.dirty)
                            gridRecord.save({
                                success: function (record, operation) {
                                    Ext.toast(AbraxaConstants.messages.updateRecord);
                                },
                            });
                    },
                },
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
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    padding: '0 0 0 8',
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
            minWidth: 110,
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
                        xtype: 'button',
                        iconCls: 'md-icon-outlined md-icon-edit',
                        ui: 'tool-md round',
                        slug: 'settingsLibraryPortServed',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'Edit',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            anchor: true,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            let port = this.upVM().get('record'),
                                currentUser = this.upVM().get('currentUser'),
                                grid = this.up('grid');
                            grid.deselectAll();
                            if (Ext.Array.contains(me.upVM().get('userSubmissions'), currentUser.get('email'))) {
                                Ext.Ajax.request({
                                    url:
                                        Env.nomenclatureEndPoint +
                                        'api/registry/v1/ports-legacy/' +
                                        port.get('port_id'),
                                    method: 'GET',
                                    success: function (response) {
                                        let data = Ext.decode(response.responseText);
                                        if (data.info_work_days) {
                                            data.info_work_days_start = data.info_work_days.start;
                                            data.info_work_days_end = data.info_work_days.end;
                                        }
                                        if (data.info_work_hours) {
                                            data.info_work_hours_start = moment(
                                                data.info_work_hours.start,
                                                'HH:mm'
                                            ).toDate();
                                            data.info_work_hours_end = moment(
                                                data.info_work_hours.end,
                                                'HH:mm'
                                            ).toDate();
                                        }
                                        if (data.coordinates_center) {
                                            data.coordinates_center_latitude = data.coordinates_center.latitude;
                                            data.coordinates_center_longitude = data.coordinates_center.longitude;
                                        }
                                        if (data.coordinates_entrance) {
                                            data.coordinates_entrance_latitude = data.coordinates_entrance.latitude;
                                            data.coordinates_entrance_longitude = data.coordinates_entrance.longitude;
                                        }
                                        if (data.coordinates_pilot_station) {
                                            data.coordinates_pilot_station_latitude =
                                                data.coordinates_pilot_station.latitude;
                                            data.coordinates_pilot_station_longitude =
                                                data.coordinates_pilot_station.longitude;
                                        }
                                        Ext.create(
                                            'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortDialog',
                                            {
                                                viewModel: {
                                                    parent: me.upVM(),
                                                    data: {
                                                        record: new Abraxa.model.suggestions.Port(
                                                            Object.assign({}, data)
                                                        ),
                                                        currentUser: currentUser,
                                                    },
                                                },
                                            }
                                        ).show();
                                    },
                                    failure: function failure(response) {},
                                });
                            } else {
                                Ext.create(
                                    'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortDialog',
                                    {
                                        viewModel: {
                                            data: {
                                                record: Ext.create('Abraxa.model.suggestions.Port', {
                                                    id: port.get('port_id'),
                                                    meta_name: port.get('port').name,
                                                    meta_locode: port.get('port').code,
                                                    meta_country_id: Abraxa.utils.Functions.getNestedProperty(
                                                        port,
                                                        'data.port.countries.country_code'
                                                    ),
                                                    meta_country_name: port.get('port').country,
                                                }),
                                            },
                                        },
                                    }
                                ).show();
                            }
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            anchor: true,
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
});
