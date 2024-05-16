import './CreateBank';
import './BanksEditMenu';
Ext.define('Abraxa.view.cdb.company.financials.banks.BanksGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'financials.banks',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'banksGrid',
    cls: 'a-detailed-grid a-banks-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'banks-grid-state',
    bind: {
        store: '{banks}',
        hideHeaders: '{banks.count ? false : true}',
    },
    reference: 'banksGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('banksGrid.selection'),
                grid = Ext.ComponentQuery.query('financials\\.banks')[0];

            if (record) {
                record.reject();
            }
            grid.deselectAll();
        },
    },
    groupHeader: {
        cls: 'a-header-offset-x24',
        tpl: new Ext.XTemplate(
            '<div class="a-header-{[this.parceString(values.name)]}">{[this.parceString(values.name)]} ({count})</div>',
            {
                parceString: function (value) {
                    if (value == '1') {
                        return 'Active';
                    } else {
                        return 'Disabled';
                    }
                },
            }
        ),
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-1012 -640)"><g transform="translate(178 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1042 670)"><path d="M14,25H8.667V43.667H14Zm16,0H24.667V43.667H30ZM52.667,49H2v5.333H52.667ZM46,25H40.667V43.667H46ZM27.333,7.027l13.893,7.307H13.44L27.333,7.027m0-6.027L2,14.333v5.333H52.667V14.333Z" transform="translate(4.667 4.333)" fill="#c8d4e6" stroke="#fafafb" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">No bank accounts available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Bank account',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                slug: 'cdbFinancialBankAccountsCreate',
                testId: 'cdbFinancialBankAccountsCreateButton',
                bind: {
                    permission: '{userPermissions}',
                },
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.financials.banks.CreateBank', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                selectedCompany: record,
                                bank: Ext.create('Abraxa.model.cdb.VirtualAccount', {
                                    org_id: record.get('org_id'),
                                    type: 'bank',
                                    number_type: 'IBAN',
                                }),
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    itemConfig: {
        height: 56,
        bind: {
            cls: 'a-detailed-item {styleRow}',
        },
        viewModel: {
            formulas: {
                styleRow: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            if (record.get('active')) {
                                return 'item-active';
                            } else {
                                return 'item-inactive';
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
            items: [
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    bind: {
                        hidden: '{banks.count ? false : true}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Bank account',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            slug: 'cdbFinancialBankAccountsCreate',
                            testId: 'cdbFinancialBankAccountsCreateButtonSmall',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            height: 30,
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.financials.banks.CreateBank', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            bank: Ext.create('Abraxa.model.cdb.VirtualAccount', {
                                                org_id: record.get('org_id'),
                                                type: 'bank',
                                                number_type: 'IBAN',
                                            }),
                                        },
                                    },
                                }).show();
                            },
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
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""} a-br-100',
                                        hidden: '{banksGrid.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility',
                                            text: 'Enable',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    banks = vm.get('banks'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this bank?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            banks.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function (batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not enable record!'
                                                                    );
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'action loading',
                                                            text: 'Enable',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility-off',
                                            text: 'Disable',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    billings = vm.get('billings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Disable',
                                                    'Are you sure you want to disable this direct billings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 0);
                                                            });
                                                            billings.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function (batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not disable record!'
                                                                    );
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Disable',
                                                        },
                                                    ]
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    billings = vm.get('billings'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this pre-fundings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                billings.remove(rec);
                                                            });
                                                            billings.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function (batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not delete record!'
                                                                    );
                                                                },
                                                            });
                                                        }
                                                    },
                                                    this,
                                                    [
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'no',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
                                                );
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
        {
            text: 'Bank name',
            minWidth: 220,
            dataIndex: 'name',
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 4,
            renderer: function (val, record) {
                if (val) {
                    let iban = record.get('iban'),
                        number_type = record.get('number_type'),
                        verified = record.get('is_verified')
                            ? '<i class="md-icon c-teal ml-2 md-16">verified_user</i>'
                            : '';

                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-bank"><i class="md-icon-outlined">account_balance</i></div><div class="ml-12"><div class="text-truncate fw-b hbox">' +
                        val +
                        verified +
                        '</div><div class="sm-title">' +
                        number_type +
                        ': ' +
                        iban +
                        '</div></div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'SWIFT',
            dataIndex: 'swift_number',
            minWidth: 220,
            cell: {
                cls: 'expand a-cell-port',
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
            text: 'Currency',
            dataIndex: 'currency',
            minWidth: 100,
            align: 'center',
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Updated by',
            // dataIndex: 'updated_at',
            minWidth: 220,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    cls: 'no_show',
                    padding: '0 12',
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
                            Ext.create('Abraxa.view.cdb.company.financials.banks.BanksEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        bank: record,
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
    listeners: {
        childtap: function (grid, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});
