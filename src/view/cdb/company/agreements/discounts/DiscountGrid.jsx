import './CreateDiscount';
import './DiscountEditMenu';
import '../../../../../model/agreements/AgreementDiscount';
Ext.define('Abraxa.view.cdb.company.agreements.discounts.DiscountGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'agreements.discounts.grid',
    testId: 'agreeDiscountsGrid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'discountGrid',
    cls: 'a-detailed-grid a-discounts-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'discountGrid-grid-state',
    plugins: {
        gridviewoptions: true,
    },
    selectable: {
        headerCheckbox: false,
        mode: 'multi',
        checkbox: true,
        checkboxDefaults: {
            xtype: 'selectioncolumn',
            text: null,
            dataIndex: '',
            cell: {
                hideMode: 'opacity',
            },
            width: 30,
            listeners: {
                checkchange: function (me, rowIndex, checked, record, e, eOpts) {
                    if (checked) {
                        record.set('is_checked', true);
                    } else {
                        record.set('is_checked', false);
                    }
                },
            },
        },
    },
    bind: {
        store: '{discounts}',
        hideHeaders: '{discounts.count ? false : true}',
    },
    reference: 'discountGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('discountGrid.selection'),
                grid = Ext.ComponentQuery.query('agreements\\.discounts\\.grid')[0];

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
                testId: 'agreeDiscountsGridNoDiscountsDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-811 -349)"><g transform="translate(-23 4)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(355 92)"><g transform="translate(499.999 301.001)"><path d="M70.443,78.228a7.786,7.786,0,1,0-7.786-7.784A7.794,7.794,0,0,0,70.443,78.228Zm0-10.427A2.641,2.641,0,1,1,67.8,70.444,2.645,2.645,0,0,1,70.443,67.8Z" transform="translate(-62.657 -62.657)" fill="#c8d4e6"/><path d="M98.471,67.41a2.571,2.571,0,0,0-3.637,0L67.411,94.832a2.572,2.572,0,0,0,3.638,3.638L98.472,71.047A2.573,2.573,0,0,0,98.471,67.41Z" transform="translate(-64.943 -64.942)" fill="#c8d4e6"/><path d="M118.086,110.3a7.786,7.786,0,1,0,7.787,7.784A7.793,7.793,0,0,0,118.086,110.3Zm0,10.427a2.641,2.641,0,1,1,2.643-2.643A2.644,2.644,0,0,1,118.086,120.728Z" transform="translate(-89.877 -89.876)" fill="#c8d4e6"/></g></g></g></svg><div class="a-no-content-txt">No discounts available</div></div>',
            },
            {
                xtype: 'button',
                testId: 'agreeDiscountsGridAddDiscountsBtn',
                text: 'Discount',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbAgreementsDiscountCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.agreements.discounts.CreateDiscount', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                selectedCompany: record,
                                discount: Ext.create('Abraxa.model.agreements.AgreementDiscount', {
                                    organization_org_id: record.get('org_id'),
                                    currency: currentUser.getCompany().get('default_currency'),
                                    active: 1,
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
            bind: {
                hidden: '{discounts.count ? false : true}',
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
                            text: 'Discount',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            testId: 'agreeDiscountsGridAddDiscountsSmallBtn',
                            height: 30,
                            slug: 'cdbAgreementsDiscountCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.agreements.discounts.CreateDiscount', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            discount: Ext.create('Abraxa.model.agreements.AgreementDiscount', {
                                                organization_org_id: record.get('org_id'),
                                                currency: currentUser.getCompany().get('default_currency'),
                                                active: 1,
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
                                        hidden: '{discountGrid.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility',
                                            text: 'Enable',
                                            testId: 'agreeDiscountsGridEnableBtn',
                                            slug: 'cdbAgreementsDiscountActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    discounts = vm.get('discounts'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this discounts?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            discounts.sync({
                                                                success: function (err, msg) {
                                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                        .getVM()
                                                                        .set('newUpdate', new Date());
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
                                                            testId: 'agreeDiscountsGridEnableNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'agreeDiscountsGridEnableYesBtn',
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
                                            testId: 'agreeDiscountsGridDisableBtn',
                                            slug: 'cdbAgreementsDiscountActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    discounts = vm.get('discounts'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Disable',
                                                    'Are you sure you want to disable this discounts?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 0);
                                                            });
                                                            discounts.sync({
                                                                success: function (err, msg) {
                                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                        .getVM()
                                                                        .set('newUpdate', new Date());
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
                                                            testId: 'agreeDiscountsGridDisableNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'agreeDiscountsGridDisableYesBtn',
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
                                            testId: 'agreeDiscountsGridDeleteBtn',
                                            slug: 'cdbAgreementsDiscountDelete',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    discounts = vm.get('discounts'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this pre-fundings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                discounts.remove(rec);
                                                            });
                                                            discounts.sync({
                                                                success: function (err, msg) {
                                                                    Ext.toast('Record updated', 1000);
                                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                        .getVM()
                                                                        .set('newUpdate', new Date());
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
                                                            testId: 'agreeDiscountsGridDeleteNoBtn',
                                                            margin: '0 8 0 0',
                                                            text: 'Cancel',
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            itemId: 'yes',
                                                            testId: 'agreeDiscountsGridDeleteYesBtn',
                                                            ui: 'decline alt',
                                                            text: 'Delete',
                                                        },
                                                    ]
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
                                        hidden: '{discounts.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            testId: 'agreeDiscountsGridCustomizeBtn',
                                            margin: '0 0 0 8',
                                            handler: function () {
                                                this.find('discountGrid')
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
            text: 'Discount',
            dataIndex: 'discount_name',
            cell: {
                encodeHtml: false,
            },
            minWidth: 220,
            flex: 4,
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-discount"><i class="md-icon-outlined">percent</i></div><div class="ml-12"><div class="text-truncate fw-b">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Function',
            dataIndex: 'port_function',
            minWidth: 160,
            cell: {
                cls: 'expand a-cell-function',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (val) {
                    return '<div class="a-function function-' + val + '"><span>' + val + '</span></div>';
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Service',
            dataIndex: 'default_expense_item_name',
            minWidth: 160,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return '<span>' + value + '</span>';
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Amount',
            dataIndex: 'record',
            minWidth: 100,
            cell: {
                cls: 'a-cell-bl a-cell-br',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                let type = record.get('type'),
                    res = '';
                switch (type) {
                    case 'percent':
                        if (record.get('percentage')) {
                            res = '<span class="c-link">' + record.get('percentage') + '%</span>';
                        } else {
                            res = AbraxaConstants.placeholders.emptyValue;
                        }
                        break;
                    case 'amount':
                        if (record.get('amount')) {
                            res =
                                '<span class="">' +
                                record.get('currency') +
                                ' ' +
                                numeral(record.get('amount')).format('0,0.[000]') +
                                '</span>';
                        } else {
                            res = AbraxaConstants.placeholders.emptyValue;
                        }
                        break;
                    case 'agreement':
                        res = AbraxaConstants.placeholders.emptyValue;
                        break;
                    default:
                        res = AbraxaConstants.placeholders.emptyValue;
                        break;
                }
                return res;
            },
        },
        {
            text: 'Ports',
            dataIndex: 'port_ids',
            minWidth: 180,
            cell: {
                cls: 'expand a-cell-port',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                if (val) {
                    if (val.length > 1) {
                        return '<span class="a_grid_action">Multiple ports' + ' (' + val.length + ')</span>';
                    } else {
                        let porstsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                            portsServedRecord = porstsServed.findRecord('port_id', val[0]);
                        if (portsServedRecord) {
                            return (
                                '<span class="a_grid_action" data-portid="' +
                                portsServedRecord.get('port_id') +
                                '">' +
                                portsServedRecord.get('port_name') +
                                '</span>'
                            );
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    }
                } else {
                    return '<span class="a_grid_action">All ports</span>';
                }
            },
        },
        {
            text: 'Validity',
            dataIndex: 'record',
            minWidth: 220,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function renderer(val, record) {
                let validity_from = record.get('validity_from'),
                    validity_to = record.get('validity_to');
                if (validity_from && validity_to) {
                    return (
                        '<span class="hbox"><i class="material-icons-outlined fs-18 c-light-grey mr-8">calendar_today</i>' +
                        moment(validity_from).format('DD/MM/YY') +
                        ' - ' +
                        moment(validity_to).format('DD/MM/YY') +
                        '</span>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
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
            // maxWidth: 110,
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
                        slug: 'portcall',
                        testId: 'agreeDiscountsGridMoreActionsTool',
                        bind: {
                            hidden: '{nonEditable}',
                            permission: '{userPermissions}',
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
                            this.up('grid').deselectAll();
                            Ext.create('Abraxa.view.cdb.company.agreements.discounts.DiscountEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        discount: record,
                                    },
                                },
                            }).showBy(this);
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
        },
    },
});
