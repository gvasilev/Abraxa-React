import './BillingEditMenu';
import './CreateBilling';
import '../../../../../model/agreements/AgreementBilling';

Ext.define('Abraxa.view.cdb.company.agreements.billing.BillingGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'agreements.billing.grid',
    testId: 'agreementsBillingGrid',
    flex: 1,
    ui: 'bordered',
    scrollable: true,
    itemId: 'billingGrid',
    cls: 'a-detailed-grid a-billing-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'billingGrid-grid-state',
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
        store: '{billings}',
        hideHeaders: '{billings.count ? false : true}',
    },
    reference: 'billingGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('billingGrid.selection'),
                grid = Ext.ComponentQuery.query('agreements\\.billing\\.grid')[0];

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
                testId: 'agreementsBillingGridNoDirectBillingDiv',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-811 -349)"><g transform="translate(-23 4)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(846 384)"><path d="M43.5,12.63V7.5A4.513,4.513,0,0,0,39,3H7.5A4.5,4.5,0,0,0,3,7.5V39a4.5,4.5,0,0,0,4.5,4.5H39A4.513,4.513,0,0,0,43.5,39V33.87A4.5,4.5,0,0,0,45.75,30V16.5a4.5,4.5,0,0,0-2.25-3.87ZM41.25,16.5V30H25.5V16.5ZM7.5,39V7.5H39V12H25.5A4.513,4.513,0,0,0,21,16.5V30a4.513,4.513,0,0,0,4.5,4.5H39V39Z" transform="translate(3.75 3.75)" fill="#c8d4e6"/><circle cx="3.375" cy="3.375" r="3.375" transform="translate(32.625 23.625)" fill="#c8d4e6"/></g></g></svg><div class="a-no-content-txt">No direct billing available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Direct billing',
                testId: 'agreementsBillingGridDirectBillingBtn',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'cdbAgreementsDirectBillingCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser');
                    Ext.create('Abraxa.view.cdb.company.agreements.billing.CreateBilling', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                selectedCompany: record,
                                billing: Ext.create('Abraxa.model.agreements.AgreementBilling', {
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
                hidden: '{billings.count ? false : true}',
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
                            text: 'Direct billing',
                            testId: 'agreementsBillingGridDirectBillingSmallBtn',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            slug: 'cdbAgreementsDirectBillingCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    currentUser = me.upVM().get('currentUser');
                                Ext.create('Abraxa.view.cdb.company.agreements.billing.CreateBilling', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            billing: Ext.create('Abraxa.model.agreements.AgreementBilling', {
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
                                        hidden: '{billingGrid.selection ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-visibility',
                                            text: 'Enable',
                                            slug: 'cdbAgreementsDirectBillingActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    billings = vm.get('billings'),
                                                    selections = grid.getSelections();
                                                Ext.Msg.confirm(
                                                    'Enable',
                                                    'Are you sure you want to enable this direct billings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                rec.set('active', 1);
                                                            });
                                                            billings.sync({
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
                                            slug: 'cdbAgreementsDirectBillingActivate',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
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
                                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                                        .getVM()
                                                                        .set('newUpdate', new Date());
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
                                            slug: 'cdbAgreementsDirectBillingDelete',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let grid = this.up('grid'),
                                                    vm = this.upVM(),
                                                    billings = vm.get('billings'),
                                                    selections = grid.getSelections();

                                                Ext.Msg.confirm(
                                                    'Delete',
                                                    'Are you sure you want to delete this billings?',
                                                    function (answer) {
                                                        if (answer == 'yes') {
                                                            Ext.each(selections, function (rec, index) {
                                                                billings.remove(rec);
                                                            });
                                                            billings.sync({
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
                                {
                                    xtype: 'container',
                                    padding: '0 8 0 0',
                                    layout: 'hbox',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        hidden: '{billings.count ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            margin: '0 0 0 8',
                                            handler: function () {
                                                this.find('billingGrid').getPlugin('gridviewoptions').showViewOptions();
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
            text: 'Billing',
            dataIndex: 'billing_name',
            cell: {
                encodeHtml: false,
            },
            minWidth: 220,
            flex: 4,
            renderer: function (val, record) {
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-billing"><i class="md-icon-outlined">account_balance_wallet</i></div><div class="ml-12"><div class="text-truncate fw-b">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
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
            minWidth: 180,
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
            text: 'Vendor',
            minWidth: 180,
            dataIndex: 'vendor_name',
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
            renderer: function renderer(val, record) {
                if (val) {
                    let supplierId = null;
                    if (record.get('vendor_id')) {
                        supplierId = record.get('vendor_id');
                    }
                    return (
                        '<a href="javascript:void(0)" class="a_grid_action company_details" data-company_id="' +
                        supplierId +
                        '">' +
                        val +
                        '</a>'
                    );
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
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
                                '<span  class="a_grid_action" data-portid="' +
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
            text: 'Percentage',
            minWidth: 100,
            dataIndex: 'percentage',
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return '<span class="fw-b c-link">' + value + '%</span>';
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Validity',
            dataIndex: 'record',
            minWidth: 220,
            hidden: true,
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
                            Ext.create('Abraxa.view.cdb.company.agreements.billing.BillingEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        billing: record,
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
            if (location.event.target.classList.contains('a_grid_action')) return false;
        },
    },
});
