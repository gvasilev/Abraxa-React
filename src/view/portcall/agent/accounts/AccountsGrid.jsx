import './AccountCreate';
import './AccountEditMenu';

Ext.define('Abraxa.view.portcall.accounts.AccountsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'accounts.grid',
    // flex: 1,
    ui: 'bordered',
    cls: 'a-accounts-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'accountsGrid-grid-state',
    reference: 'accountsGrid',
    itemId: 'accountsGrid',
    testId: 'portCallAccountsGrid',
    scriollable: true,
    plugins: {
        gridviewoptions: true,
    },
    keyMapEnabled: true,
    loadingText: false,
    // keyMap: {
    //     scope: 'this',
    //     ESC: function() {
    //         let record = this.upVM().get('accountsGrid.selection'),
    //             grid = Ext.ComponentQuery.query('accounts\\.grid')[0];

    //         if (record) {
    //             record.reject();
    //         }
    //         grid.deselectAll();
    //     },
    // },
    bind: {
        store: '{accounts}',
        cls: '{nonEditable ? "a-accounts-grid a-offset-grid abraxa-grid" : ""} a-accounts-grid a-offset-grid abraxa-grid',
        // selectable: '{selectableCrewing}',
        hideHeaders: '{accounts.count ? false : true}',
    },
    itemConfig: {
        height: 56,
        viewModel: true,
    },
    emptyText: {
        xtype: 'container',
        zIndex: 9999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(10001 18940)"><path d="M28.667,13.667V3H2V51H55.333V13.667Zm-5.333,32h-16V40.333h16Zm0-10.667h-16V29.667h16Zm0-10.667h-16V19h16Zm0-10.667h-16V8.333h16ZM50,45.667H28.667V19H50ZM44.667,24.333H34v5.333H44.667Zm0,10.667H34v5.333H44.667Z" transform="translate(3.333 5)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"/></g></g></svg><div class="a-no-content-txt">No billing parties available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Billing party',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'portcallBillingPartiesAddBillingParty',
                testId: 'portCallAccontsGriddAddBillingPartyButton',
                subObject: 'disbursements',
                bind: {
                    objectPermission: '{objectPermissions}',
                    cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let currentUser = me.upVM().get('currentUser'),
                        dialog = Ext.create('Abraxa.view.portcall.accounts.AccountCreate', {
                            viewModel: {
                                parent: me.upVM(),
                                data: {
                                    record: Ext.create('Abraxa.model.account.Account', {
                                        portcall_id: me.upVM().get('object_record').get('id'),
                                        account_currency: currentUser.getCompany().get('default_currency'),
                                        base_currency: currentUser.getCompany().get('default_currency'),
                                    }),
                                    editMode: false,
                                },
                            },
                        });
                    mixpanel.track('Billing party button');
                    dialog.show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            bind: {
                hidden: '{accounts.count ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100',
                    minHeight: 65,
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '<span>Billing parties</span>',
                            },
                        },
                    ],
                },
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
                            text: 'Billing party',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            slug: 'portcallBillingPartiesAddBillingParty',
                            testId: 'portCallAccontsGriddAddBillingPartySmallButton',
                            subObject: 'disbursements',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            handler: function (me) {
                                let currentUser = me.upVM().get('currentUser'),
                                    dialog = Ext.create('Abraxa.view.portcall.accounts.AccountCreate', {
                                        viewModel: {
                                            parent: me.upVM(),
                                            data: {
                                                record: Ext.create('Abraxa.model.account.Account', {
                                                    portcall_id: me.upVM().get('object_record').get('id'),
                                                    account_currency: currentUser.getCompany().get('default_currency'),
                                                    base_currency: currentUser.getCompany().get('default_currency'),
                                                }),
                                                editMode: false,
                                            },
                                        },
                                    });
                                dialog.show();
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
                                    slug: 'portcall',
                                    testId: 'portCallAccountsGridDisbursementsContainer',
                                    subObject: 'disbursements',
                                    showAnimation: 'fade',
                                    bind: {
                                        permission: '{userPermissions}',
                                        hidden: '{accounts.count ? false : true}',
                                        objectPermission: '{objectPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'tool-text-sm',
                                            iconCls: 'md-icon-outlined md-icon-settings',
                                            text: 'Customize',
                                            testId: 'portCallAccountsGridCustomizeButton',
                                            margin: '0 0 0 8',
                                            handler: function () {
                                                this.find('accountsGrid')
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
            dataIndex: 'org_id',
            text: 'Billing party',
            minWidth: 280,
            flex: 4,
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-account"><i class="md-icon-outlined">corporate_fare</i></div><div class="ml-12 text-truncate"><a href="javascript:void(0)" class="fw-b text-truncate">' +
                        record.get('org_name') +
                        '</a><div class="sm-title">#CR-' +
                        record.get('id') +
                        '</div></div>'
                    );
                }
            },
        },
        {
            dataIndex: 'co_id',
            text: 'Care of (C/o)',
            minWidth: 220,
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record && record.get('co_name')) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-account"><i class="md-icon-outlined">corporate_fare</i></div><div class="ml-12"><div class="fw-b">' +
                        record.get('co_name') +
                        '</div></div>'
                    );
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
        {
            dataIndex: 'account_currency',
            text: 'Currency',
            minWidth: 100,
            groupable: false,
            sortable: false,
            align: 'center',
            cell: {
                cls: 'a-cell-bl',
                align: 'center',
            },
        },
        {
            text: 'Client balance',
            minWidth: 150,
            align: 'right',
            dataIndex: 'balance',
            cell: {
                cls: 'a-cell-amount a-cell-br',
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
            minWidth: 160,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                xtype: 'widgetcell',
                widget: {
                    padding: '0 12',
                    viewModel: {
                        formulas: {
                            progress: {
                                bind: {
                                    bindTo: '{disbursements}',
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
            text: 'Funding',
            minWidth: 160,
            dataIndex: 'funded',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    return (
                        '<div class="a-status-badge rounded no-border a-has-icon status-' +
                        value +
                        '"><i class="material-icons-outlined"></i><span class="text-capitalize">' +
                        value +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Customer reference',
            minWidth: 140,
            dataIndex: 'customer_reference',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                return value || AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Extra reference',
            minWidth: 140,
            dataIndex: 'extra_reference',
            hidden: true,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                return value || AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Last updated',
            minWidth: 180,
            cell: {
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
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
                        slug: 'portcall',
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
                            Ext.create('Abraxa.view.portcall.account.AccountEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        account: record,
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
                        // handler: function () {
                        //     let record = this.upVM().get('record'),
                        //         container = this.find("crewingRightCard");
                        //     if (record) {
                        //         container.show();
                        //     }
                        // }
                    },
                ],
            },
        },
    ],
});
