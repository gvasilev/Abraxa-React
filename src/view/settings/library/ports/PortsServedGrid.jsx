import './SuggestDialogs/SuggestPort/SuggestPortDialog';
import '../../../../model/suggestions/Port';
import '../../system/ports/AddPort';

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
                            const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
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
                        if (values.port && values.port.countries && values.port.countries.country_code) {
                            flag =
                                'https://static.abraxa.com/flags/1x1/' +
                                values.port.countries.country_code.toLowerCase() +
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
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
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
                            const childSettingsMainVM = me.upVM(),
                                currentUser = childSettingsMainVM.get('currentUser'),
                                grid = me.up('grid');

                            grid.deselectAll();

                            const suggestionPort = Ext.create('Abraxa.model.suggestions.Port', {});
                            const portServedRec = childSettingsMainVM.get('record').get('port');
                            // Merge fields with same name
                            suggestionPort.mergeData(portServedRec);

                            const mappedSuggestRecData = {
                                info_harbour_size: portServedRec.harbor_size_code,
                                info_harbour_type: portServedRec.harbor_type_code,
                                info_salinity: portServedRec.water,
                                info_shelter_afforded: portServedRec.shelter_afforded_code,
                                meta_locode: portServedRec.code,
                                meta_name: portServedRec.name,
                                restriction_seca: portServedRec.is_seca,
                            };
                            const countryData = portServedRec.countries;
                            if (countryData) {
                                mappedSuggestRecData.meta_country_id = countryData.country_code || '';
                                mappedSuggestRecData.meta_country_name = countryData.country_name || '';
                            }
                            const loadLinesData = portServedRec.restriction_load_lines_summer;
                            if (loadLinesData) {
                                mappedSuggestRecData.load_lines = loadLinesData.load_lines || '';
                                mappedSuggestRecData.load_lines_start = loadLinesData.load_lines_start || '';
                                mappedSuggestRecData.load_lines_end = loadLinesData.load_lines_end || '';
                            }

                            const coordinatesData = portServedRec.center;
                            if (coordinatesData) {
                                mappedSuggestRecData.coordinates_center_latitude = coordinatesData.latitude || null;
                                mappedSuggestRecData.coordinates_center_longitude = coordinatesData.longitude || null;
                            }

                            const coordinatesEntranceData = portServedRec.coordinates_entrance;
                            if (coordinatesEntranceData) {
                                mappedSuggestRecData.coordinates_entrance_latitude =
                                    coordinatesEntranceData.latitude || null;
                                mappedSuggestRecData.coordinates_entrance_longitude =
                                    coordinatesEntranceData.longitude || null;
                            }

                            const coordinatesPilotData = portServedRec.coordinates_pilot_station;
                            if (coordinatesPilotData) {
                                mappedSuggestRecData.coordinates_pilot_station_latitude =
                                    coordinatesPilotData.latitude || null;
                                mappedSuggestRecData.coordinates_pilot_station_longitude =
                                    coordinatesPilotData.longitude || null;
                            }

                            // Map fields with different names
                            suggestionPort.mergeData(mappedSuggestRecData);

                            childSettingsMainVM.set('addEditPortTitle', AbraxaConstants.titles.editPort);

                            Ext.create(
                                'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortDialog',
                                {
                                    viewModel: {
                                        parent: childSettingsMainVM,
                                        data: {
                                            currentUser: currentUser,
                                            record: suggestionPort,
                                        },
                                    },
                                }
                            ).show();
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
