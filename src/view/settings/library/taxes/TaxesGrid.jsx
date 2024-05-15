Ext.define('Abraxa.view.settings.library.taxes.TaxesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.library.taxes.grid',
    cls: 'a-offset-grid abraxa-grid',
    ui: 'bordered',
    shadow: false,
    itemId: 'taxGrid',
    flex: 1,
    grouped: false,
    selectable: {
        mode: 'single',
        pruneRemoved: false,
    },
    bind: {
        store: '{taxes}',
        hideHeaders: '{taxes.count ? false : true}',
    },
    reference: 'taxGrid',
    itemConfig: {
        viewModel: true,
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{taxes.count ? false : true}',
            },
            padding: '0 24 0 32',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Add tax',
                    testId: 'addTaxBtnTestIdTaxesGrid',
                    ui: 'action small',
                    iconCls: 'md-icon-add',
                    slug: 'settingsLibraryTaxCreate',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function (btn, e) {
                        let dialog = Ext.create('Abraxa.view.settings.library.taxes.AddTax', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    tax: Ext.create('Abraxa.model.tax.Tax'),
                                    editMode: false,
                                },
                            },
                        });
                        dialog.show();
                    },
                },
            ],
        },
    ],
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="Group_20498" data-name="Group 20498" transform="translate(-673 -606)"> <g id="Group_20495" data-name="Group 20495" transform="translate(-161 261)" opacity="0.6"> <circle id="Ellipse_775" data-name="Ellipse 775" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <g id="Group_20497" data-name="Group 20497" transform="translate(708 638)"> <path id="Path_9931" data-name="Path 9931" d="M53.05,6.55,48.5,2,43.95,6.55,39.4,2,34.85,6.55,30.3,2,25.75,6.55,21.2,2,16.65,6.55,12.1,2V44.467H3v9.1a9.088,9.088,0,0,0,9.1,9.1H48.5a9.088,9.088,0,0,0,9.1-9.1V2ZM39.4,56.6H12.1a3.042,3.042,0,0,1-3.033-3.033V50.534H39.4Zm12.133-3.033a3.033,3.033,0,0,1-6.067,0v-9.1h-27.3V11.1H51.534Z" transform="translate(-3 -2)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4305" data-name="Rectangle 4305" width="16" height="8" transform="translate(19 14.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4306" data-name="Rectangle 4306" width="8" height="8" transform="translate(40 14.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4307" data-name="Rectangle 4307" width="16" height="5" transform="translate(19 25.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/> <rect id="Rectangle_4308" data-name="Rectangle 4308" width="8" height="5" transform="translate(40 25.667)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">No taxes available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Tax',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'settingsLibraryTaxCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (btn, e) {
                    let dialog = Ext.create('Abraxa.view.settings.library.taxes.AddTax', {
                        viewModel: {
                            parent: btn.upVM(),
                            data: {
                                tax: Ext.create('Abraxa.model.tax.Tax'),
                                editMode: false,
                            },
                        },
                    });
                    dialog.show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    columns: [
        {
            text: 'Name',
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
                    '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-default"><i class="md-icon-outlined">receipt_long</i></div><span class="text-truncate fw-b c-blue ml-16"> ' +
                    val +
                    '</span></div>'
                );
            },
        },
        {
            text: 'Code',
            dataIndex: 'code',
            minWidth: 140,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return '<span class="c-grey">' + Ext.String.capitalize(val) + '</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Amount',
            dataIndex: 'amount',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    return '<span class="fw-b">' + val + '%</span>';
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Ports applicable',
            dataIndex: 'port_ids',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    let portsServed = this.upVM().get('portsServed');
                    let str = [];
                    if (val.length > 0) {
                        Ext.each(val, function (value, index) {
                            let port = portsServed.findRecord('port_id', value, 0, false, false, true);
                            if (port) {
                                str.push(port.get('port_name'));
                            }
                        });
                    }
                    if (str.length > 0) {
                        return '<span class="a_grid_action a-port"">' + str.join(',') + '</span>';
                    }
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Services',
            dataIndex: 'services_ids',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (val) {
                if (val) {
                    let services = this.upVM().get('defaultExpenseItems');
                    let str = [];
                    if (val.length > 0) {
                        Ext.each(val, function (value, index) {
                            let service = services.getById(value);
                            if (service) {
                                str.push(service.get('name'));
                            }
                        });
                    }
                    if (str.length > 0) {
                        return str.join(',');
                    }
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
                            Ext.create('Abraxa.view.settings.library.taxes.TaxesEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        tax: record,
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
