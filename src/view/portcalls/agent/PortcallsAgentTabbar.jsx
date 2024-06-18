Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentTabbar', {
    extend: 'Ext.Container',
    xtype: 'portcalls.agent.tabbar',
    testId: 'portcallsAgentTabbar',
    items: {
        xtype: 'container',
        height: 64,
        cls: 'a-titlebar a-bb-100',
        items: [
            {
                xtype: 'button',
                text: 'Port call',
                testId: 'portcallsAgentTabbarPortCallCreateButton',
                iconCls: 'md-icon-add',
                cls: 'chameleon_add_portcall',
                ui: 'action small',
                hideMode: 'opacity',
                hidden: false,
                slug: 'portcallCreate',
                bind: {
                    permission: '{userPermissions}',
                    handler:
                        '{currentUser.company.type == "agent" ? "createPortcallAgent" : "createPrincipalPortcall"}',
                },
            },
            {
                xtype: 'searchfield',
                testId: 'portcallsAgentTabbarSearchField',
                ui: 'hovered-underline',
                cls: 'a-field-icon icon-search',
                placeholder: 'Search...',
                width: 280,
                centered: true,
                listeners: {
                    change: function (field, newValue, oldValue, eOpts) {
                        var storePortcalls = this.upVM().get('portcalls');
                        if (newValue === '') storePortcalls.removeFilter('search');
                    },
                    action: function (me, newValue, oldValue, eOpts) {
                        var query = this.getValue() ? this.getValue().toLowerCase() : '';
                        var storePortcalls = this.upVM().get('portcalls');
                        storePortcalls.removeFilter('search');
                        if (query.length > 2) {
                            storePortcalls.addFilter({
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
                xtype: 'container',
                cls: 'a-tools',
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-br-100',
                        padding: '0 8 0 0',

                        items: [
                            {
                                xtype: 'button',
                                ui: 'tool-text-sm',
                                enableToggle: true,
                                testId: 'portcallsAgentTabbarArchiveButton',
                                id: 'portcallsAgentTabbarArchiveButton',
                                iconCls: 'md-icon-inventory-2 md-icon-outlined',
                                text: 'Archive',
                                afterRender: function () {
                                    const stateProvider = Ext.state.Provider.get();
                                    const state = stateProvider.state['portcalls-grid-active-filterbar'];
                                    if (state && state.find((s) => s.id === 'archived')) {
                                        this.setPressed(true);
                                    }
                                },

                                handler: function (me) {
                                    let store = this.find('portcalls-grid-active').getStore(),
                                        toggled = this.getPressed();

                                    if (toggled) {
                                        store.addFilter({
                                            id: 'archived',
                                            property: 'only_archived',
                                            operator: '=',
                                            value: true,
                                        });
                                        me.upVM().set('archiveMode', true);
                                    } else {
                                        store.removeFilter('archived');
                                        me.upVM().set('archiveMode', false);
                                    }
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'GridFiltersButton',
                        gridItemId: 'portcalls-grid-active',
                    },

                    {
                        xtype: 'button',
                        iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                        ui: 'tool-text-sm',
                        testId: 'portcallsAgentTabbarExportMenu',
                        arrow: false,
                        text: 'Export',
                        margin: '0 0 0 8',
                        slug: 'portcallGridExport',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        menu: {
                            items: [
                                {
                                    text: 'Export to PDF',
                                    testId: 'portcallsAgentTabbarExportToPDFButton',
                                    slug: 'portcallExportPDF',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                    handler: function () {
                                        let grid = this.find('portcalls-grid-active'),
                                            visibleColumns = grid.getHeaderContainer().getVisibleColumns(),
                                            store = grid.getStore(),
                                            columns = [],
                                            filters = [],
                                            ids = [];
                                        grid.getStore()
                                            .getFilters()
                                            .items.forEach(function (item) {
                                                if (item) {
                                                    filters.push({
                                                        operator: item.getOperator(),
                                                        value: item.getValue(),
                                                        property: item.getProperty(),
                                                    });
                                                }
                                            });
                                        Ext.Array.each(visibleColumns, function (value) {
                                            if (value.getDataIndex()) {
                                                columns.push(value.getDataIndex());
                                            }
                                        });
                                        Ext.Array.each(store.getRange(), function (value) {
                                            ids.push(value.get('id'));
                                        });
                                        mixpanel.track('Export grid button');
                                        Abraxa.export.portcalls(columns, filters);
                                    },
                                },
                                {
                                    text: 'Export to Excel',
                                    testId: 'portcallsAgentTabbarExportToExcelButton',
                                    separator: true,
                                    iconCls: 'md-icon-outlined md-icon-difference',
                                    handler: function (me) {
                                        const grid = me.find('portcalls-grid-active');

                                        Abraxa.export.exportFileFromGrid(grid, Env.ApiEndpoint + 'portcall/exportCSV');
                                    },
                                },
                            ],
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'tool-text-sm',
                        iconCls: 'md-icon-outlined md-icon-settings',
                        testId: 'portcallsAgentTabbarCustomizeButton',
                        text: 'Customize',
                        margin: '0 0 0 8',
                        handler: function () {
                            mixpanel.track('Customize button active tab');
                            this.find('portcalls-grid-active').getPlugin('gridviewoptions').showViewOptions();
                        },
                    },
                ],
            },
        ],
    },
});
