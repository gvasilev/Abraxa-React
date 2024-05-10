Ext.define('Abraxa.view.settings.library.cargoes.CargoesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.cargoes.grid',
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
        store: '{commodities}',
    },
    reference: 'cargoesGrid',
    itemConfig: {
        height: 56,
        viewModel: true,
    },
    items: [],
    columns: [
        {
            text: 'Cargo',
            dataIndex: 'name',
            cls: 'a-column-offset-x32',
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            flex: 4,
            minWidth: 320,
            renderer: function (val) {
                return (
                    '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-cargo"><i></i></div><span class="text-truncate fw-b c-blue ml-16"> ' +
                    val +
                    '</span></div>'
                );
            },
        },
        {
            text: 'Type',
            dataIndex: 'type',
            minWidth: 220,
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
            text: 'Updated by',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
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
                            Ext.create('Abraxa.view.settings.library.cargoes.CargoesEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        cargo: record,
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
});
