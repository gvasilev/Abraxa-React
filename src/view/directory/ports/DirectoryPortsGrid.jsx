Ext.define('Abraxa.view.directory.ports.DirectoryPortsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'DirectoryPortsGrid',
    testId: 'directoryPortsGrid',
    flex: 1,
    showNoPermissions: true,
    skipEditPermission: true,
    ui: 'bordered',
    infinite: false,
    cls: 'abraxa-grid a-companies-grid a-offset-grid',
    stateful: true,
    stateId: 'directory-ports-grid-active',
    itemId: 'directory-ports-grid-active',
    pinHeaders: false,
    selectable: {
        deselectable: true,
    },
    plugins: {
        gridfilterbar: {
            hidden: true,
            stateful: true,
        },
        gridviewoptions: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            testId: 'directoryPortsGridPagingToolbar',
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
                                html: '<strong>{totalPortsRecords}</strong> records',
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
    bind: {
        store: '{directoryPorts}',
    },
    reference: 'directoryPortsGrid',
    scrollToTopOnRefresh: false,
    keyMapEnabled: true,
    // keyMap: {
    //     scope: 'this',
    //     ESC: function () {
    //         let activeGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.active]')[0];
    //         activeGrid.deselectAll();
    //     },
    // },
    itemConfig: {
        viewModel: true,
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
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            title: 'Ports',
                            flex: 1,
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic filled-light',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search Port or Locode',
                            maxWidth: 400,
                            height: 42,
                            flex: 1,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var portsStore = this.upVM().get('directoryPorts');
                                    if (newValue == '') portsStore.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var portsStore = this.upVM().get('directoryPorts');
                                    portsStore.removeFilter('search');
                                    if (query.length > 2) {
                                        portsStore.addFilter({
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
                        {
                            xtype: 'div',
                            flex: 1,
                            // Empty container to center the search bar
                        },
                    ],
                },
            ],
        },
    ],
    columns: [
        {
            text: 'Port',
            dataIndex: 'name',
            cls: 'a-column-offset-x24',
            minWidth: 220,
            flex: 3,
            renderer: function (value, record) {
                if (!record || !record.id) return AbraxaConstants.placeholders.emptyValue;
                let name = AbraxaConstants.placeholders.emptyValue;
                if (value) {
                    name = value;
                } else if (record && record.get('name')) {
                    name = record.get('name');
                }

                let flag = '';
                const countryInfo = record.get('countries');
                const countryCode = countryInfo.country_code ? countryInfo.country_code : null;
                if (countryCode && countryCode !== 'NULL' && countryCode.length) {
                    flag = 'https://static.abraxa.com/flags/1x1/' + countryCode.toLowerCase() + '.svg';

                    let onerror = "this.onerror=null;this.src='https://static.abraxa.com/flags/1x1/no-flag.svg';";

                    return (
                        '<div class="a-person cursor-pointer" data-portid="' +
                        record.id +
                        '"><img src="' +
                        flag +
                        '" onerror="' +
                        onerror +
                        '" class="a-flag-x24 a-img-round"><div class="ml-16"><div class="fw-b c-blue fs-16">' +
                        name +
                        ' (' +
                        countryCode +
                        ')' +
                        '</div><div class="sm-title">' +
                        record.get('code') +
                        '</div></div></div>'
                    );
                } else {
                    return (
                        '<div class="a-person cursor-pointer" data-portid="' +
                        record.id +
                        '"><div class="ml-16"><div class="fw-b c-blue fs-16">' +
                        name +
                        '</div><div class="sm-title">' +
                        record.get('code') +
                        '</div></div></div>'
                    );
                }
            },
            sorter: {
                sorterFn: function (rec1, rec2) {
                    let hasData1 = rec1 && rec1.get('name');
                    let hasData2 = rec2 && rec2.get('name');

                    if (!hasData1 && !hasData2) {
                        return 0;
                    }

                    if (!hasData1 && hasData2) {
                        return 1;
                    }

                    if (hasData1 && !hasData2) {
                        return -1;
                    }

                    // Both records have name:
                    return rec1.get('name').localeCompare(rec2.get('name'));
                },
            },
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.cursor-pointer',
                        fn: function () {
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('port-info/' + this.component.getRecord().get('id'));
                        },
                    },
                },
            },
        },
        {
            text: 'Portcalls',
            minWidth: 100,
            flex: 1,
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
            text: 'Country',
            dataIndex: 'country',
            minWidth: 140,
            flex: 1,
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
            text: 'Timezone',
            dataIndex: 'timezone',
            minWidth: 140,
            flex: 1,
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
            text: 'Last updated on',
            minWidth: 180,
            flex: 1,
            formatter: 'date("d M y - H:i ")',
            dataIndex: 'updated_at',
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
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
                            anchor: true,
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (me) {
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('port-info/' + me.upVM().get('record.id'));
                        },
                    },
                ],
            },
        },
    ],
    preventSelectionOnTool: true,
    listeners: {
        select: function (thisVM, selected, eOpts) {
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('port-info/' + selected[0].get('id'));
        },
    },
});
