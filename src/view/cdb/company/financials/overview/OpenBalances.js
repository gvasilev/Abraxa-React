Ext.define('Abraxa.view.cdb.company.financials.overview.OpenBalances', {
    extend: 'Ext.Container',
    xtype: 'financials.open.balances',
    height: '100%',
    layout: 'fit',
    items: [
        {
            xtype: 'grid',
            itemId: 'open-balances-grid',
            stateful: ['plugins', 'columns'],
            plugins: {
                gridviewoptions: true,
            },
            flex: 1,
            slug: 'grid',
            ui: 'bordered',
            cls: 'a-accounts-grid a-offset-grid abraxa-grid a-bt-100',
            collapsible: false,
            pinHeaders: false,
            selectable: false,
            columnMenu: {
                xtype: 'menu',
                weighted: true,
                align: 'tl-bl?',
                hideOnParentHide: false,
                // persist when owning Column is hidden
                items: {
                    // sortAsc: {
                    // 	xtype: 'gridsortascmenuitem',
                    // 	group: 'sortDir',
                    // 	weight: -100,
                    // },
                    // // Wants to be the first
                    // sortDesc: {
                    // 	xtype: 'gridsortdescmenuitem',
                    // 	group: 'sortDir',
                    // 	weight: -90,
                    // },
                    // Wants to be the second
                    //---------------------------------
                    // Columns menu is inserted here
                    //---------------------------------
                    groupByThis: null,
                    showInGroups: null,
                },
                listeners: {
                    painted: function (menu) {},
                },
            },
            store: [],
            bind: {
                store: '{object_record.open_balances}',
            },
            scrollToTopOnRefresh: false,
            // scrollable: true,
            emptyText: {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                },
                centered: true,
                items: [
                    {
                        xtype: 'div',
                        html: '<div class="a-inner"><div class="a-no-content-txt fs-13">No open balances available</div></div>',
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
            columns: [
                {
                    dataIndex: 'org_id',
                    text: 'Port call',
                    minWidth: 220,
                    flex: 1,
                    ignore: true,
                    menuDisabled: true,
                    cls: 'a-column-offset-x24',
                    cell: {
                        cls: 'a-cell-offset-x24',
                        encodeHtml: false,
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.a-vessel-name',
                                fn: function fn() {
                                    let record = this.component.getRecord();
                                    window.location.hash = '#portcall/' + record.get('portcall').id;

                                    // if (record.get('vessel')) {
                                    //     imo = record.get('vessel').id
                                    // }
                                    // if (record.get('custom_vessel_id')) {
                                    //     if (record.get('custom_vessel').company_id != this.component.up('grid').upVM().get('currentUser').get('current_company_id')) {
                                    //         imo = record.get('custom_vessel').id;
                                    //     }
                                    // }
                                    // if (imo) {
                                    //     Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                                    // }
                                },
                            },
                        },
                    },
                    renderer: function (value, record) {
                        if (record) {
                            return (
                                '<div class="hbox"><div class="text-truncate"><a href="javascript:void(0)" class="fw-b a-vessel-name">' +
                                record.get('portcall').voyage.vessel_name +
                                '</a><div class="sm-title">' +
                                record.get('portcall').file_id +
                                '</div></div>'
                            );
                        }
                    },
                },
                {
                    dataIndex: 'customer_reference',
                    text: 'Reference',
                    minWidth: 100,
                    ignore: true,
                    menuDisabled: true,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value) {
                        if (value) {
                            return '<span>' + value + '</span>';
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    },
                },
                {
                    text: 'Port',
                    dataIndex: 'port',
                    minWidth: 160,
                    ignore: true,
                    menuDisabled: true,
                    cell: {
                        cls: 'expand',
                        encodeHtml: false,
                        actionType: 'prospects',
                        listeners: {
                            click: {
                                element: 'element',
                                fn: function (el) {
                                    if (el.target.classList[1] == 'open_action_center') {
                                        Ext.ComponentQuery.query('appointments-grid')[0]
                                            .getController()
                                            .loadActionCenter(el);
                                    } else if (el.target.classList[1] == 'a-port-eta') {
                                        let portId = el.target.getAttribute('data-portid');
                                        if (portId) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .showPortDialogById(portId);
                                        }
                                    }
                                },
                            },
                        },
                    },
                    renderer: function (value, record) {
                        return Abraxa.utils.Functions.portRendererType(record, 'portcall');
                    },
                },
                {
                    dataIndex: 'account_currency',
                    minWidth: 100,
                    text: 'Currency',
                    groupable: false,
                    sortable: false,
                    align: 'center',
                    ignore: true,
                    menuDisabled: true,
                    cls: 'a-column-bl',
                    cell: {
                        cls: 'a-cell-bl',
                        align: 'center',
                    },
                },
                {
                    text: 'Client balance',
                    align: 'right',
                    dataIndex: 'balance',
                    minWidth: 150,
                    ignore: true,
                    menuDisabled: true,
                    cls: 'a-column-bl a-column-br',
                    cell: {
                        cls: 'a-cell-bl a-cell-br',
                        align: 'right',
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (record) {
                            let currentUserType = this.upVM().get('currentUserType'),
                                colorCls;
                            if (currentUserType == 'agent') {
                                if (Ext.isNumber(value)) {
                                    if (Ext.Number.sign(value) === -1) {
                                        colorCls = 'a-positive-value';
                                    }
                                    if (Ext.Number.sign(value) === 1) {
                                        colorCls = 'a-negative-value';
                                    }
                                }
                            } else {
                                if (Ext.isNumber(value)) {
                                    if (Ext.Number.sign(value) === -1) {
                                        colorCls = 'a-negative-value';
                                    }
                                    if (Ext.Number.sign(value) === 1) {
                                        colorCls = 'a-positive-value';
                                    }
                                }
                            }
                            return (
                                '<div class="a-cell-amount ' +
                                colorCls +
                                '">' +
                                Ext.util.Format.number(value, '0,000.00') +
                                '<span class="c-light-grey fs-12 ml-4 fw-n">' +
                                '</span></div>'
                            );
                        }
                    },
                },
                {
                    text: 'Progress',
                    minWidth: 140,
                    dataIndex: 'progress',
                    sortable: false,
                    menuDisabled: true,
                    resizable: false,
                    hideable: false,
                    editable: false,
                    cell: {
                        xtype: 'widgetcell',
                        widget: {
                            padding: '0 12',
                            viewModel: {
                                formulas: {
                                    progress: {
                                        bind: {
                                            bindTo: '{record.disbursements}',
                                            deep: true,
                                        },
                                        get: function (store) {
                                            if (store) {
                                                let account = this.getView().up('widgetcell').getRecord();
                                                if (account) {
                                                    let accountDisbursements = store.queryBy(function (disbursement) {
                                                            return disbursement.get('account_id') == account.get('id');
                                                        }),
                                                        total = accountDisbursements.count(),
                                                        draft = accountDisbursements.filterBy(function (rec) {
                                                            return (
                                                                rec.get('status') == 'completed' ||
                                                                rec.get('status') == 'settled'
                                                            );
                                                        }).length;

                                                    if (total > draft) return parseFloat(draft / total).toFixed(3);

                                                    if (total > 0 && total == draft) return 1;

                                                    return 0;
                                                }
                                            }
                                        },
                                    },
                                },
                            },
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'progressbarwidget',
                                    width: 100,
                                    height: 10,
                                    bind: {
                                        cls: 'a-disbursements-progress {progress == 1 ? "completed" : ""}',
                                        value: '{progress}',
                                        tooltip: {
                                            anchorToTarget: true,
                                            html: '{progress:percent()}',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                            anchor: true,
                                        },
                                    },
                                    textTpl: '{percent}%',
                                },
                            ],
                        },
                    },
                },
                {
                    text: 'Date',
                    minWidth: 110,
                    dataIndex: 'created_at',
                    ignore: true,
                    menuDisabled: true,
                    cell: {
                        cls: 'expand a-cell-date',
                    },
                    exportRenderer: true,
                    renderer: function renderer(value) {
                        if (value) {
                            return Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(value, 'D MMM YYYY');
                            // return moment(value).format("D MMM YY");
                        }
                    },
                },
            ],
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    height: 64,
                    cls: 'a-titlebar a-bb-100',
                    docked: 'top',
                    // hidden: true,
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '<span class="a-panel-title">Open balances breakdown</span>',
                            },
                        },
                    ],
                },
            ],
            listeners: {
                painted: function () {
                    this.refreshInnerWidth();
                    this.syncRows();
                    this.syncRowsToHeight(true);
                },
            },
        },
    ],
});
