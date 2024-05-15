Ext.define('Abraxa.view.settings.library.vessels.VesselsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.vessels.grid',
    cls: 'a-offset-grid abraxa-grid',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    grouped: false,
    selectable: {
        mode: 'single',
        pruneRemoved: false,
    },
    bind: {
        store: '{vessels}',
    },
    reference: 'vesselsGrid',
    itemConfig: {
        viewModel: true,
    },
    items: [],
    columns: [
        {
            text: 'Vessel',
            dataIndex: 'name',
            cls: 'a-column-offset-x32 a-column-supply',
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            flex: 4,
            minWidth: 320,
            renderer: function (val, record) {
                let flag = null;
                if (record && record.get('flags') && record.get('flags').country_code) {
                    flag =
                        'src="' +
                        AbraxaConstants.urls.staticAbraxa +
                        'flags/1x1/' +
                        record.get('flags').country_code.toLocaleLowerCase() +
                        '.svg"';
                }
                return (
                    '<div class="hbox"><img height="24" class="a-img-round" ' +
                    flag +
                    ' /><span class="text-truncate fw-b c-blue ml-16">' +
                    val +
                    '</span></div>'
                );
            },
        },
        {
            text: 'IMO',
            dataIndex: 'imo',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return '<span class="c-grey">' + val + '</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Type',
            dataIndex: 'vessel_type',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return val;
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'OFAC',
            dataIndex: 'is_verified',
            minWidth: 180,
            slug: 'settingsLibraryVesselCompliance',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                let str = '',
                    icon = '';
                if (val) {
                    str = '<div class="a-check"><i class="md-icon-outlined c-green">done</i></div>';
                }
                if (str.length > 0) {
                    return '' + icon + str + ' ';
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Updated at',
            dataIndex: 'updated_at',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return (
                        '<div class="hbox"><i class="material-icons-outlined md-18 mr-8">calendar_today</i>' +
                        moment(value).format('DD MMM YYYY') +
                        '</div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
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
});
