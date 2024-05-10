Ext.define('Abraxa.view.operations.PortCallsPricipal.grids.PortCallsPricipalGridAll', {
    extend: 'Ext.grid.Grid',
    xtype: 'PortCallsPricipalGridAll',
    itemId: 'PortCallsPricipalGridAll',
    layout: 'fit',
    cls: 'abraxa-grid',
    ui: 'bordered',
    scrollable: true,
    flex: 1,
    viewModel: 'portCallsPricipalGridsViewModel',
    controller: 'PortCallsPricipalGridsController',
    emptyText: 'There are no port calls to display.',
    stateful: ['plugins', 'columns'],
    stateId: 'portcalls-grid-principal-all',
    bind: {
        store: '{portcallsPrincipal}',
        hideHeaders: '{!portcallsPrincipal.count}',
    },

    itemConfig: {
        height: 64,
        viewModel: {},
    },
    plugins: {
        gridviewoptions: true,
        gridexporter: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
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
                                html: '<strong>{totalRecords}</strong> records',
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

    columns: [
        {
            text: '',
            dataIndex: 'is_watching',
            cls: 'a-cell-id',
            width: 32,
            hidden: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            sortable: false,
            editable: false,
            ignore: true,
            cell: {
                encodeHtml: false,
                cls: 'expand',
                forceWidth: true,
                viewModel: {
                    data: {
                        is_watching: false, // This can be a default value
                    },
                    formulas: {
                        // Define a formula for the computed HTML based on the `is_watching` value
                        watchHtml: function (get) {
                            get('is_watching');
                            const is_watching = this.getView().getRecord().get('is_watching');
                            this.setData({ is_watching: is_watching });
                            const iconName = is_watching ? 'notifications' : 'notifications_none';
                            const iconColor = is_watching ? 'c-yellow' : 'md-inactive';
                            return (
                                '<div class="a-fav cursor-pointer a_grid_action">' +
                                '<i class="a_grid_action material-icons ' +
                                iconColor +
                                '">' +
                                iconName +
                                '</i>' +
                                '</div>'
                            );
                        },
                    },
                },

                tools: [
                    {
                        xtype: 'div',
                        tooltip: {
                            html: 'Subscribe to start receiving<br> follow up notifications',
                            anchor: true,
                            align: 'b50-t50',
                        },
                        bind: {
                            // Bind the cell's HTML to the computed formula
                            html: '{watchHtml}',
                        },
                    },
                ],
                listeners: {
                    click: {
                        element: 'element',
                        delegate: '.a-fav',
                        fn: function fn() {
                            const vm = this.component.getViewModel();
                            let record = this.component.getRecord(),
                                favourite = vm.get('is_watching');
                            if (favourite) {
                                vm.set('is_watching', 0);
                                record.set('is_watching', 0);
                            } else {
                                vm.set('is_watching', 1);
                                record.set('is_watching', 1);
                            }
                            record.save({
                                success: function () {
                                    Ext.toast('Record updated');
                                },
                            });
                        },
                    },
                },
            },
            exportRenderer: 'exportWatchingRenderer',
        },
        {
            text: 'Port call ID',
            minWidth: 120,
            dataIndex: 'file_id',
            sortable: false,
            cell: {
                cls: 'expand a-cell-file-id',
            },
        },
        {
            text: 'Voyage ID',
            dataIndex: 'voyage_number',
            minWidth: 130,
            width: 130,
            hidden: true,
            sortable: false,
            cls: 'a-header-offset-x24',
            cell: {
                tpl: '<tpl if="voyage_number"><div class="a-val">{voyage_number}</div> <tpl else><div>---</div></tpl>',
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
        },
        {
            text: 'Vessel',
            dataIndex: 'vessel',
            minWidth: 220,
            width: 220,
            sortable: false,
            flex: 1,
            cell: {
                tpl: '<tpl if="vessel && vessel.name"><div data-portcall-id="{id}" class="a-val-link-xl">{vessel.name}</div> <tpl else><div>---</div></tpl>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link-xl',
                        fn: function () {
                            let portcall = this.component.getRecord();
                            let gridController = this.component.up('grid').getController();
                            gridController.redirectToPortcall(portcall);
                        },
                    },
                },
            },
            exportRenderer: 'exportVesselNameRenderer',
        },
        {
            text: 'Function',
            dataIndex: 'port_function',
            defaultWidth: 190,
            minWidth: 190,
            sortable: false,
            cell: {
                tpl: '<div class="a-val a-function"><span>{port_function}</span></div>',
                encodeHtml: false,
            },
        },
        {
            text: 'Port',
            dataIndex: 'port_name',
            defaultWidth: 140,
            minWidth: 140,
            sortable: false,
            flex: 1,
            cell: {
                tpl: '<div data-port-id="{port_id}" class="a-val-link-md">{port_name}</div>',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link-md',
                        fn: 'openPortInfoDialog',
                    },
                },
            },
        },
        {
            text: 'ETA',
            dataIndex: 'port_eta',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            sortable: false,
            hidden: true,
            cls: 'a-column-bl a-column-bgr',
            cell: {
                cls: 'a-cell-bl a-cell-bgr',
                encodeHtml: false,
            },
            renderer: 'dataRenderer',
            exportRenderer: 'exportDataRenderer',
        },
        {
            text: 'ETB',
            dataIndex: 'port_etb',
            minWidth: 150,
            hidden: true,
            sortable: false,
            cell: {
                encodeHtml: false,
            },
        },
        {
            text: 'ATA',
            dataIndex: 'port_ata',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            hidden: true,
            sortable: false,
            cls: 'a-column-bl a-column-bgr',
            cell: {
                cls: 'a-cell-bl a-cell-bgr',
                encodeHtml: false,
            },
            renderer: 'dataRenderer',
            exportRenderer: 'exportDataRenderer',
        },
        {
            text: 'ATD',
            dataIndex: 'port_atd',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            hidden: true,
            sortable: false,
            cls: 'a-column-bl',
            cell: {
                tpl: new Ext.XTemplate('{[this.renderPortCallDate(values.port_atd)]}', {
                    renderPortCallDate: function (portcallDate) {
                        let atd = '---';
                        if (portcallDate) {
                            atd = Abraxa.utils.Functions.createPlaceHolders(
                                Abraxa.utils.Functions.formatStringToDate(
                                    portcallDate,
                                    AbraxaConstants.formatters.date.dayMonHyphenTime24
                                ),
                                'strong'
                            );
                            return atd;
                        }
                        return AbraxaConstants.placeholders.emptySpan;
                    },
                }),
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
        },
        {
            text: 'ETA / ATA',
            dataIndex: 'port_ETA_ATA',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            sortable: false,
            cls: 'a-column-bl a-column-bgr',
            cell: {
                cls: 'a-cell-bl a-cell-bgr',
                tpl: ['<div class="a-val-sub">', '<tpl> {port_ETA_ATA}</tpl>', '</div>'],
                encodeHtml: false,
            },
        },
        {
            text: 'ETD / ATD',
            dataIndex: 'port_ETD_ATD',
            defaultWidth: 140,
            minWidth: 140,
            maxWidth: 140,
            sortable: false,
            cls: 'a-column-bl a-column-br',
            cell: {
                tpl: ['<div class="a-val-sub">', '<tpl>{port_ETD_ATD}</tpl>', '</div>'],
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
        },
        {
            text: 'Cargo',
            dataIndex: 'cargo_quantity',
            defaultWidth: 180,
            minWidth: 180,
            sortable: false,
            cell: {
                tpl: '{cargo_quantity.quantity}',
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .quantity',
                        fn: function (element, htmlEl, c) {
                            if (element.target.getAttribute('class') === 'a-val-link more') {
                                const cargoes = this.component.getRecord().get('cargo_quantity').cargoes;
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .showCargoesTooltip(cargoes, element);
                            } else if (element.target.getAttribute('class') === 'a-commodity a-link') {
                                const recordId = +htmlEl.id;
                                if (recordId) {
                                    Abraxa.Global.showCommodityDialog(recordId);
                                }
                            }
                        },
                    },
                },
            },
            exportRenderer: 'exportCargoRenderer',
        },
        {
            text: 'Lead agent',
            dataIndex: 'lead_agent',
            defaultWidth: 200,
            minWidth: 200,
            sortable: false,
            flex: 1,
            cell: {
                tpl: new Ext.XTemplate('{[this.renderOrganizationName(values.lead_agent)]}', {
                    renderOrganizationName: function (organization) {
                        if (organization && organization.org_name) {
                            return Abraxa.utils.Functions.renderOrganizationLink(
                                organization.org_id,
                                organization.org_name
                            );
                        }
                        return AbraxaConstants.placeholders.emptySpan;
                    },
                }),
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            exportRenderer: 'exportOrganizationNameRenderer',
        },
        {
            text: 'Sub agent',
            dataIndex: 'sub_agent',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            sortable: false,
            cell: {
                tpl: new Ext.XTemplate('{[this.renderOrganizationName(values.sub_agent)]}', {
                    renderOrganizationName: function (organization) {
                        if (organization && organization.org_name) {
                            return Abraxa.utils.Functions.renderOrganizationLink(
                                organization.org_id,
                                organization.org_name
                            );
                        }
                        return AbraxaConstants.placeholders.emptySpan;
                    },
                }),
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            exportRenderer: 'exportOrganizationNameRenderer',
        },
        {
            text: 'Appointing party',
            dataIndex: 'appointing_party',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            sortable: false,
            cell: {
                tpl: new Ext.XTemplate('{[this.renderOrganizationName(values.appointing_party)]}', {
                    renderOrganizationName: function (organization) {
                        if (organization && organization.org_name) {
                            return Abraxa.utils.Functions.renderOrganizationLink(
                                organization.org_id,
                                organization.org_name
                            );
                        }
                        return AbraxaConstants.placeholders.emptySpan;
                    },
                }),
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            exportRenderer: 'exportOrganizationNameRenderer',
        },
        {
            text: 'Nominating party',
            dataIndex: 'nominating_party',
            defaultWidth: 160,
            minWidth: 160,
            flex: 1,
            hidden: true,
            sortable: false,
            cell: {
                tpl: new Ext.XTemplate('{[this.renderOrganizationName(values.nominating_party)]}', {
                    renderOrganizationName: function (organization) {
                        if (organization && organization.org_name) {
                            return Abraxa.utils.Functions.renderOrganizationLink(
                                organization.org_id,
                                organization.org_name
                            );
                        } else {
                            return AbraxaConstants.placeholders.emptySpan;
                        }
                    },
                }),
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div.a-val-link',
                        fn: 'openCompanyInfoTooltip',
                    },
                },
            },
            exportRenderer: 'exportOrganizationNameRenderer',
        },
        {
            text: 'Status',
            dataIndex: 'status_name',
            defaultWidth: 160,
            minWidth: 160,
            sortable: false,
            cell: {
                tpl: '<div class="a-status-badge a-status-md status-{status_data.string}">{status_name}</div>',
                encodeHtml: false,
            },
        },
        {
            text: 'Operated by',
            dataIndex: 'assigned_to_name',
            defaultWidth: 180,
            minWidth: 180,
            sortable: false,
            flex: 1,
            cell: {
                tpl: [
                    '<div  data-user-id="{voyage.assigned_to}" class="a-val a-person a-icon-round">',
                    '<tpl if="voyage.assigned_to && voyage.assigned_user.profile_image"><img src="{voyage.assigned_user.profile_image}" height="30" alt=""><tpl else><img src="' +
                        AbraxaConstants.urls.staticAbraxa +
                        'images/profile/no-image.svg" height="30" alt=""></tpl>',
                    '<tpl if="voyage.assigned_to"><div class="a-val-link">{voyage.assigned_user.first_name:substr(0, 1)}. {voyage.assigned_user.last_name}</div><tpl else><div class="a-val">---</div></tpl>',
                    '</div>',
                ],

                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'div .a-val',
                        fn: function (element, htmlEl, c) {
                            this.component.up('grid').getController().openUserInfo(element, htmlEl, c, this);
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 90,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
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
                            let portcall = me.ownerCmp.getRecord();
                            let gridController = me.ownerCmp.up('grid').getController();
                            gridController.redirectToPortcall(portcall);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childDoubleTap: 'gridsChildDoubleTap',
    },
});
