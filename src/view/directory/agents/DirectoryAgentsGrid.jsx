var doubleClickInProgress = false;
Ext.define('Abraxa.view.directory.agents.DirectoryAgentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'DirectoryAgentsGrid',
    reference: 'DirectoryAgentsGrid',
    testId: 'directoryPortsGrid',
    flex: 1,
    showNoPermissions: true,
    skipEditPermission: true,
    ui: 'bordered',
    infinite: false,
    cls: 'abraxa-grid a-companies-grid',
    slug: 'directoryPortsGrid',
    // stateful: true,
    stateful: ['plugins', 'columns', 'filters'],
    stateId: 'directory-agents-grid-active',
    itemId: 'directory-agents-grid-active',
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
            testId: 'directoryAgentsGridPagingToolbar',
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
                                html: '<strong>{totalAgentsRecords}</strong> records',
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
    store: [],
    bind: {
        store: '{agentsStore}',
        // hideHeaders: '{defaultHiddenItems}',
        // permission: '{userPermissions}',
    },
    scrollToTopOnRefresh: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let activeGrid = Ext.ComponentQuery.query('[xtype=portcalls\\.grid\\.active]')[0];
            activeGrid.deselectAll();
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
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'title',
                            title: 'Port agents',
                            flex: 1,
                        },
                        {
                            xtype: 'searchfield',
                            ui: 'classic filled-light',
                            cls: 'a-field-icon icon-search',
                            placeholder: 'Search agents',
                            flex: 1,
                            maxWidth: 400,
                            height: 42,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var agentsStore = this.upVM().get('agentsStore');
                                    if (newValue == '') agentsStore.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    const query = Abraxa.utils.Functions.getLowerCaseValue(this.getValue());
                                    var agentsStore = this.upVM().get('agentsStore');
                                    agentsStore.removeFilter('search');
                                    if (query.length > 2) {
                                        agentsStore.addFilter({
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
            text: '',
            dataIndex: 'verified',
            sortable: false,
            menuDisabled: true,
            hideable: false,
            resizable: false,
            editable: false,
            ignore: true,
            width: 64,
            cls: 'a-column-compliance',
            cell: {
                width: 64,
                cls: 'a-cell-compliance',
                encodeHtml: false,
            },
            // renderer: function () {
            //     return '<div data-qtip="Verified" data-qalign="bc-tc" data-qanchor="true" class="a-verification a-verified"><i class="a-verification-icon md-icon"></i></div>';
            // },
            renderer: function (val, record) {
                if (val === 1) {
                    return '<div data-qtip="Verified" data-qalign="bc-tc" data-qanchor="true" class="a-verification a-verified"><i class="a-verification-icon md-icon"></i></div>';
                }
                return '<div class="a-verification a-not-verified"><i class="a-verification-icon md-icon-outlined"></i></div>';
            },
        },
        {
            text: 'Company Name',
            dataIndex: 'name',
            minWidth: 280,
            cell: {
                encodeHtml: false,
                cls: 'a-cell-file-id',
            },
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Comp. Name',
                },
            },
            exportRenderer: true,
            renderer: function (value, record) {
                const name = value || (record && record.get('name')) || AbraxaConstants.placeholders.emptyValue;

                return [
                    '<a href="javascript:void(0)" class="fw-b fs-16 company_name">' +
                        name +
                        '</a><div class="sm-title">' +
                        record.get('email') +
                        '</div>',
                ].join('');
            },
        },
        {
            text: 'Presence',
            minWidth: 380,
            cell: {
                cls: 'a-cell-function',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (
                    record &&
                    record.getData() &&
                    record.getData().ports_served &&
                    record.getData().ports_served.length > 0
                ) {
                    let portsArr = record.getData().ports_served.filter((item) => item.port);

                    let sortedPorts = portsArr.sort((a, b) => {
                        return a.port_name.localeCompare(b.port_name);
                    });

                    let portName = sortedPorts[0].port_name;
                    return `<div class="a-function function-${portName}"><span> ${portName} (+${
                        sortedPorts.length - 1
                    })</span></div>`;
                } else {
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            sortable: false,
            menuDisabled: true,
            editable: false,
            // sorter: {
            //     sorterFn: function (rec1, rec2) {

            //         let hasData1 = (rec1 && rec1.getData() && rec1.getData().ports_served && rec1.getData().ports_served.length > 0);
            //         let hasData2 = (rec2 && rec2.getData() && rec2.getData().ports_served && rec2.getData().ports_served.length > 0);

            //         if (!hasData1 && !hasData2) {
            //             return 0;
            //         }

            //         if (!hasData1 && hasData2) {
            //             return 1;
            //         }

            //         if (hasData1 && !hasData2) {
            //             return -1;
            //         }

            //         // Both records have data:

            //         let portsArr1 = rec1.getData().ports_served.filter(item => item.port).sort((a, b) => {
            //             return a.port_name.localeCompare(b.port_name);
            //         });

            //         let portName1 = portsArr1[0].port_name || '';

            //         let portsArr2 = rec2.getData().ports_served.filter(item => item.port).sort((a, b) => {
            //             return a.port_name.localeCompare(b.port_name);
            //         });;

            //         let portName2 = portsArr2[0].port_name || '';

            //         if (portName1.localeCompare(portName2) === 0) {
            //             return portsArr1.length - portsArr2.length;
            //         }

            //         return portName1.localeCompare(portName2);

            //     },
            // },
        },
        {
            text: 'Country',
            dataIndex: 'country',
            minWidth: 280,
            flex: 1,
            filterType: {
                type: 'string',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Comp. Name',
                },
            },
            cell: {
                encodeHtml: false,
            },
            exportRenderer: true,
            renderer: function (value, record) {
                if (record && record.getData() && record.getData().countries) {
                    let country_name =
                        record.getData().countries.country_name || AbraxaConstants.placeholders.emptyValue;

                    var onerror = "this.onerror=null;this.src='https://static.abraxa.com/flags/1x1/no-flag.svg';";

                    var flag = record.getData().countries.country_code
                        ? '<img height="24" class="a-img-round" src="' +
                          AbraxaConstants.urls.staticAbraxa +
                          'flags/1x1/' +
                          record.getData().countries.country_code.toLowerCase() +
                          '.svg" onerror="' +
                          onerror +
                          '">'
                        : '<span class="a-no-flag"></span>';

                    return '<div class="a-country">' + flag + '' + country_name + '</div>';
                } else {
                    return AbraxaConstants.placeholders.emptySpan;
                }
            },
            sorter: {
                sorterFn: function (rec1, rec2) {
                    let hasData1 = rec1 && rec1.get('country');
                    let hasData2 = rec2 && rec2.get('country');

                    if (!hasData1 && !hasData2) {
                        return 0;
                    }

                    if (!hasData1 && hasData2) {
                        return 1;
                    }

                    if (hasData1 && !hasData2) {
                        return -1;
                    }

                    // Both records have data:
                    return rec1.get('country').localeCompare(rec2.get('country'));
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
                                .redirectTo('profiles/' + me.upVM().get('record.id'));
                        },
                    },
                ],
            },
        },
    ],
    preventSelectionOnTool: true,
    listeners: {
        select: function (thisVM, selected, eOpts) {
            // Ext.getCmp('main-viewport').getController().redirectTo('profiles/' + this.component.getRecord().get('id'));
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('profiles/' + selected[0].get('id'));
        },
    },
});
