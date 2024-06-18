import './SuppliesController';
import './SupplyEditMenu';

Ext.define('Abraxa.view.portcall.husbandry.supplies.SuppliesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'husbandry.supplies.grid',
    controller: 'supplies-controller',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'supplyMainGrid',
    testId: 'supplyMainGrid',
    cls: 'a-detailed-grid a-supplies-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'supplyMainGrid-grid-state',
    collapsible: {
        tool: {
            zone: 'start',
            ui: 'tool-sm',
            margin: '0 0 0 11',
        },
    },
    grouped: true,
    pinHeaders: false,
    groupHeader: {
        tpl: Ext.create(
            'Ext.XTemplate',
            '<div class="ml-2 hbox"><div>{[this.transform(values)]}</div><div class="ml-8 c-grey">({count})</div></div>',
            {
                transform: function (values) {
                    if (values) {
                        if (values.name) {
                            return '<div class="c-blue">' + values.name + '</div>';
                        }
                        return 'Not billed';
                    }
                },
            }
        ),
        padding: '18 12',
    },
    plugins: {
        gridviewoptions: true,
    },
    slug: 'portcallServices',
    showNoPermissions: true,
    skipEditPermission: true,
    bind: {
        permission: '{userPermissions}',
        store: '{supplies}',
        cls: '{nonEditable ? "a-supplies-grid-noneditable a-offset-grid" : ""} a-detailed-grid a-offset-grid a-supplies-grid abraxa-grid',
        selectable: '{selectableSupply}',
        hideHeaders: '{expenses.count ? false : true}',
    },
    reference: 'suppliesGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('suppliesGrid.selection'),
                grid = Ext.ComponentQuery.query('husbandry\\.supplies\\.grid')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-796 -640)"><g transform="translate(-38 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(826 670)"><path d="M26.973,46.107,7.32,30.827,3,34.187,27,52.853,51,34.187,46.653,30.8ZM27,39.333l19.627-15.28L51,20.667,27,2,3,20.667l4.347,3.387ZM27,8.747l15.307,11.92L27,32.587,11.693,20.667,27,8.747Z" transform="translate(5 3.333)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No services available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Service',
                testId: 'supplyMainGridServiceBtn',
                slug: 'portcall',
                subObject: 'portcallSupplyCreate',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                bind: {
                    objectPermission: '{objectPermissions}',
                    cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                    permission: '{userPermissions}',
                },
                handler: 'create',
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        height: 56,
        viewModel: {
            formulas: {
                disbursementRecord: {
                    bind: {
                        bindTo: '{record.disbursement_id}',
                        deep: true,
                    },
                    get: function (id) {
                        if (id) {
                            let disbursementRecord = this.get('disbursements').getById(id);

                            return disbursementRecord;
                        }
                    },
                },
                checkIfLocked: {
                    bind: {
                        bindTo: '{disbursementRecord.is_locked}',
                        deep: true,
                    },
                    get: function (value) {
                        this.get('record').set('is_locked', value);
                    },
                },
                recordNotes: {
                    bind: {
                        bindTo: '{notes}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let service = this.get('record');
                            let notes = store.queryBy(function (rec, id) {
                                return (
                                    rec.get('noteable_type') == service.get('model_name') &&
                                    rec.get('noteable_id') == service.get('id')
                                );
                            }).items;
                            if (service) {
                                service.set('notes_count', notes.length);
                            }
                        }
                    },
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{expenses.count ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Service',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            testId: 'supplyMainGridServiceSmallBtn',
                            slug: 'portcallSupplyCreate',
                            subObject: 'services',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            height: 30,
                            // menu: {
                            //     cls: "a-menu-badges",
                            //     items: [{
                            //             text: 'Supplies',
                            //             cls: 'a-menu-supplies',
                            //             iconCls: "abraxa-icon-layers",
                            //             handler: 'createSupply'
                            //         },
                            //         {
                            //             text: 'Disposal',
                            //             cls: 'a-menu-disposal',
                            //             iconCls: "abraxa-icon-recycle",
                            //             handler: 'createDisposal'
                            //         },
                            //         {
                            //             text: 'Bunkers',
                            //             cls: 'a-menu-bunkers',
                            //             iconCls: "abraxa-icon-oil",
                            //             handler: 'createBunkers'
                            //         },
                            //         {
                            //             text: 'Services',
                            //             cls: 'a-menu-services',
                            //             iconCls: "md-icon-outlined md-icon-assistant",
                            //             handler: 'createService'
                            //         },
                            //     ]
                            // },
                            handler: 'create',
                        },
                        {
                            xtype: 'div',
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    subObject: 'supply',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        hidden: '{expenses.count ? false : true}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                            slug: 'portcallSupplyExport',
                                            text: 'Export',
                                            hidden: true,
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = me.up('grid'),
                                                    visibleColumns = grid.getHeaderContainer().getVisibleColumns(),
                                                    store = grid.getStore(),
                                                    columns = [],
                                                    ids = [];
                                                Ext.Array.each(visibleColumns, function (value) {
                                                    if (value.getDataIndex()) {
                                                        columns.push(value.getDataIndex());
                                                    }
                                                });
                                                Ext.Array.each(store.getRange(), function (value) {
                                                    ids.push(value.get('id'));
                                                });
                                                Abraxa.export.supplies(ids, columns);
                                                mixpanel.track('Supply - export');
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            testId: 'supplyMainGridServiceCustomizeBtn',
                                            bind: {
                                                hidden: '{supplies.count ? false : true}',
                                            },
                                            margin: '0 0 0 8',
                                            handler: function () {
                                                this.find('supplyMainGrid')
                                                    .getPlugin('gridviewoptions')
                                                    .showViewOptions();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    columns: [
        // {
        //     text: '',
        //     cls: 'a-column-empty',
        //     sortable: false,
        //     menuDisabled: true,
        //     resizable: false,
        //     hideable: false,
        //     editable: false,
        //     cell: {
        //         cls: 'a-cell-empty'
        //     }
        // },
        {
            text: 'Service item',
            dataIndex: 'default_expense_item_name',
            cls: 'a-column-supply a-column-offset-x24',
            cell: {
                cls: 'a-cell-supply a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 1,
            minWidth: 260,
            renderer: function (val, record) {
                if (val && record.get('default_expense_item')) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-' +
                        record.get('default_expense_item').category.name +
                        '"><i></i></div><div class="ml-12 text-truncate"><div class="fw-b text-truncate">' +
                        val +
                        '</div><div class="sm-title">' +
                        Ext.String.capitalize(record.get('default_expense_item').category.name) +
                        '</div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Quantity',
            dataIndex: 'quantity',
            minWidth: 100,
            align: 'right',
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                const defaultExpenseItem = record ? record.get('default_expense_item') : null;
                let type = null;
                if (defaultExpenseItem && defaultExpenseItem.type) {
                    type = defaultExpenseItem.type.id;
                }
                let quantity = '<div class="a-cell-placeholder">---</div>',
                    quantity_unit = '';

                if (!type) return AbraxaConstants.placeholders.emptyValue;

                switch (type) {
                    case 'services':
                        if (record.get('is_amount')) {
                            //reverse current to front
                            if (record.get('amount')) {
                                quantity_unit = numeral(record.get('amount')).format('0,0.[000]');
                                if (record.get('amount_currency')) {
                                    quantity = record.get('amount_currency');
                                }
                            }
                        } else {
                            if (record.get('quantity')) {
                                quantity = numeral(record.get('quantity')).format('0,0.[000]');
                                if (record.get('quantity_unit')) {
                                    quantity_unit = record.get('quantity_unit');
                                }
                            }
                        }
                        break;
                    default:
                        if (value) {
                            quantity = numeral(value).format('0,0.[000]');
                            if (record.get('quantity_unit')) {
                                quantity_unit = record.get('quantity_unit');
                            }
                        }
                        break;
                }
                return quantity;
            },
        },
        {
            text: 'Vendor',
            dataIndex: 'vendor_id',
            minWidth: 160,
            cell: {
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_details',
                        fn: function (el) {
                            var company_id = el.target.getAttribute('data-company_id');
                            let vm = this.component.up('grid').upVM(),
                                organizations = vm.get('organizations'),
                                email = el.currentTarget.getAttribute('data-email'),
                                orgRecord = organizations.getById(company_id);
                            if (orgRecord) {
                                Abraxa.getApplication()
                                    .getController('AbraxaController')
                                    .showOrganizationTooltip(company_id, el);
                            } else if (email) {
                                Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                            }
                        },
                    },
                },
            },
            renderer: function (value, record) {
                if (record && record.get('vendor_name')) {
                    return (
                        '<div class="text-truncate"><a class="a_grid_action company_details" href="javascript:void(0)" data-company_id="' +
                        record.get('vendor_id') +
                        '">' +
                        record.get('vendor_name') +
                        '</a></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Account',
            dataIndex: 'account_of',
            minWidth: 120,
            hidden: true,
            cell: {
                cls: '',
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    return val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Currency',
            minWidth: 100,
            align: 'center',
            dataIndex: 'vouchers',
            cell: {
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (record && record.vouchers().count()) {
                    if (record.vouchers().sum('calculated_price') > 0) {
                        return record.vouchers().first().get('account_currency');
                    }
                    return '<div class="a-cell-placeholder">---</div>';
                } else {
                    return '<div class="a-cell-placeholder">---</div>';
                }
            },
        },
        {
            text: 'Estimated',
            dataIndex: 'pda_price',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 120,
            cell: {
                cls: 'a-cell-amount a-final-da-cell',
                encodeHtml: false,
                align: 'right',
                zeroValue: '<span class="a-cell-placeholder">0.00</span>',
                formatter: 'number("0,000.00")',
            },
        },
        {
            text: 'Invoiced',
            dataIndex: 'vouchers',
            minWidth: 120,
            align: 'right',
            cell: {
                cls: 'a-cell-amount a-cell-br',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (record && record.vouchers().count()) {
                    if (record.vouchers().sum('calculated_price') > 0) {
                        return (
                            '<div class="a-cell-amount">' +
                            Ext.util.Format.number(record.vouchers().sum('calculated_price'), '0,000.00') +
                            '</div>'
                        );
                    }
                    return '<div class="a-cell-placeholder">0.00</div>';
                } else {
                    return '<div class="a-cell-placeholder">0.00</div>';
                }
            },
        },
        {
            text: 'Disb. ID',
            dataIndex: 'disbursement_id',
            minWidth: 120,
            cell: {
                cls: 'a-cell-file-id',
                encodeHtml: false,
            },
            renderer: function (val, record) {
                if (val) {
                    return '#' + val;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Status',
            dataIndex: 'status',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                return (
                    '<div class="a-status-badge a-status-md status-' +
                    val +
                    '"><span class="text-truncate">' +
                    Ext.String.capitalize(val) +
                    '</span></div>'
                );
            },
        },
        {
            text: 'Updated',
            minWidth: 180,
            cell: {
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
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
            text: 'Notes',
            minWidth: 80,
            align: 'center',
            tpl: new Ext.XTemplate(
                '<tpl if="notes_count"><div class="hbox justify-content-center"><svg class="mr-4" viewBox="0 0 24 24" width="16" height="16"><path d="M4.2,24.1c-0.2,0-0.3,0-0.5-0.1c-0.3-0.2-0.5-0.5-0.5-0.9v-5.2C1.1,16.1,0,13.7,0,11c0-5,4-9,9-9h6c5,0,9,4,9,9 c0,5-4,9-9,9h-4.1l-6.3,3.9C4.5,24,4.3,24.1,4.2,24.1z M9,4c-3.9,0-7,3.1-7,7c0,2.2,1,4.2,2.8,5.6C5,16.8,5.2,17,5.2,17.4v3.9 l5-3.1c0.2-0.1,0.3-0.2,0.5-0.2H15c3.9,0,7-3.1,7-7c0-3.9-3.1-7-7-7H9z" fill="#546e7a"></path></svg>{notes_count}</div><tpl else ><div class="a-cell-placeholder">---</div></tpl>'
            ),
            cell: {
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
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        iconCls: 'md-icon-outlined md-icon-lock',
                        ui: 'tool-md round',
                        hidden: true,
                        bind: {
                            hidden: '{!nonEditable && !record.is_locked}',
                        },
                        disabled: true,
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'Item is locked',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                    },
                    {
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        bind: {
                            hidden: '{nonEditable || record.is_locked}',
                        },
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
                            let record = tool.record,
                                vm = this.up('grid').upVM();
                            Ext.create('Abraxa.view.portcall.husbandry.supplies.SupplyEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        supply: record,
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
                        handler: function () {
                            let record = this.upVM().get('record'),
                                container = this.find('suppliesRightCard');
                            container.show();
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (grid, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('no_show')) return false;
        },
    },
});
