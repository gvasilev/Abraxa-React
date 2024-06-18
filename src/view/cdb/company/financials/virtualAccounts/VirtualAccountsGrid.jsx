import './CreateVirtualAccount';
import './VirtualAccountsEditMenu';

Ext.define('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'virtual.accounts.grid',

    flex: 1,
    ui: 'bordered',
    itemId: 'virtualAccountsGrid',
    testId: 'virtualAccountsGrid',
    cls: 'a-detailed-grid a-banks-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'virtualAccounts-grid-state',
    plugins: {
        gridviewoptions: true,
    },
    bind: {
        store: '{virtualAccounts}',
        hideHeaders: '{virtualAccounts.count ? false : true}',
    },
    selectable: {
        mode: 'single',
    },
    reference: 'virtualAccountsGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    pinHeaders: false,
    keyMap: {
        scope: 'this',
        ESC: function() {
            let record = this.upVM().get('virtualAccountsGrid.selection'),
                grid = Ext.ComponentQuery.query('virtual\\.accounts\\.grid')[0];

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
                parceString: function(value) {
                    if (value == '0') {
                        return 'Active';
                    } else {
                        return 'Disabled';
                    }
                },
            },
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
                testId: 'virtualAccountsGridNoFloatlineDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-1012 -640)"><g transform="translate(178 295)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(1042 670)"><path d="M50,4H7.333A5.292,5.292,0,0,0,2.027,9.333L2,41.333a5.315,5.315,0,0,0,5.333,5.333H20.667V41.333H7.333v-16h48v-16A5.315,5.315,0,0,0,50,4Zm0,10.667H7.333V9.333H50ZM36.48,44.453l-7.547-7.547-3.76,3.76L36.48,52,55.333,33.147l-3.76-3.76Z" transform="translate(3.333 6.667)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">Float line unavailable</div></div>',
            },
            {
                xtype: 'button',
                text: 'Float line',
                testId: 'virtualAccountsGridAddFloatLineBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbFinancialVirtualAccountsCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function(me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.virtualAccounts.CreateVirtualAccount', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                selectedCompany: record,
                                editMode: false,
                                virtualAccount: Ext.create('Abraxa.model.cdb.VirtualAccount', {
                                    org_id: record.get('org_id'),
                                    disabled: 0,
                                    balance: 0,
                                    type: 'virtual_account',
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
                    get: function(record) {
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
            flex: 1,
            cls: 'a-titlebar a-bb-100',
            weight: 2,
            height: 65,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '<span>{financials_menu.selection.title}</span>',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    bind: {
                        hidden: '{virtualAccounts.count ? false : true}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Float line',
                            iconCls: 'md-icon-add',
                            testId: 'virtualAccountsGridAddFloatLineSmallBtn',
                            ui: 'action small',
                            height: 30,
                            slug: 'cdbFinancialVirtualAccountsCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function(me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.virtualAccounts.CreateVirtualAccount', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            editMode: false,
                                            virtualAccount: Ext.create('Abraxa.model.cdb.VirtualAccount', {
                                                org_id: record.get('org_id'),
                                                disabled: 0,
                                                balance: 0,
                                                type: 'virtual_account',
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
                                        hidden: '{virtualAccounts.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility',
                                            text: 'Enable',
                                            testId: 'virtualAccountsGridEnableBtn',
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    virtualAccounts = vm.get('virtualAccounts'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this Virtual Account?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            virtualAccounts.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not enable record!',
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
                                                            testId: 'virtualAccountsGridEnableNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'virtualAccountsGridEnableYesBtn',
                                                            ui: 'action loading',
                                                            text: 'Enable',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility-off',
                                            text: 'Disable',
                                            testId: 'virtualAccountsGridDisableBtn',
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    virtualAccounts = vm.get('virtualAccounts'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Disable',
                                                    'Are you sure you want to disable this Virtual Account?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                rec.set('active', 0);
                                                            });
                                                            billings.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not disable record!',
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
                                                            testId: 'virtualAccountsGridDisableNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'virtualAccountsGridDisableYesBtn',
                                                            ui: 'decline alt',
                                                            text: 'Disable',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-delete',
                                            text: 'Delete',
                                            testId: 'virtualAccountsGridDeleteBtn',
                                            handler: function(me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    virtualAccounts = vm.get('virtualAccounts'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this Virtual Account?',
                                                    function(answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function(rec, index) {
                                                                virtualAccounts.remove(rec);
                                                            });
                                                            virtualAccounts.sync({
                                                                success: function(err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    grid.deselectAll();
                                                                },
                                                                failure: function(batch) {
                                                                    Ext.Msg.alert(
                                                                        'Something went wrong',
                                                                        'Could not delete record!',
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
                                                            testId: 'virtualAccountsGridDeleteNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'virtualAccountsGridDeleteYesBtn',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ],
                                                );
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        hidden: '{virtualAccounts.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            testId: 'virtualAccountsGridCustomizeBtn',
                                            margin: '0 0 0 8',
                                            handler: function() {
                                                this.find('virtualAccountsGrid')
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
        {
            text: 'Name',
            dataIndex: 'name',
            cls: 'a-column-offset-x24',
            minWidth: 220,
            flex: 4,
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            renderer: function(val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-default"><i class="md-icon-outlined">credit_score</i></div><div class="ml-12 text-truncate"><div class="text-truncate fw-b">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            text: 'Account ID',
            dataIndex: 'account_number',
            minWidth: 220,
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
            },
            renderer: function(value) {
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
                cls: 'a-cell-bl',
                encodeHtml: false,
            },
            renderer: function(value) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Balance',
            dataIndex: 'balance',
            minWidth: 140,
            align: 'right',
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            renderer: function(value) {
                if (value) {
                    return '<span class="fw-b">' + value + '</span>';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
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
                        testId: 'virtualAccountsGridMoreActionsTool',
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
                                grid = this.up('grid'),
                                vm = grid.upVM();
                            Ext.create('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountsEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        record: record,
                                        grid: grid,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        testId: 'virtualAccountsGridViewDetailsBtn',
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
        childtap: function(grid, location) {
            if (location.record && location.columnIndex != 0) {
                location.record.set('is_checked', false);
            }
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});
