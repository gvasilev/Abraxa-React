import './VirtualAccountBalance';
import './VirtualAccountTransactions';
import './TransactionsRightCard';
import './CreateFunds';

Ext.define('Abraxa.view.cdb.company.virtualAccounts.VirtualAccountRightCard', {
    extend: 'Ext.Container',
    xtype: 'virtual.account.right.card',
    testId: 'virtAccRightCard',
    flex: 1,
    weighted: true,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-cdb-overview',
            flex: 1,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    flex: 1,
                    cls: 'a-bb-100',
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            minHeight: 64,
                            items: [
                                {
                                    xtype: 'tool',
                                    testId: 'virtAccRightCardDeselectTool',
                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                    margin: '0 16 0 0',
                                    ui: 'tool-md',
                                    handler: function () {
                                        let grid = Ext.ComponentQuery.query('virtual\\.accounts\\.grid')[0];
                                        if (grid) {
                                            grid.deselectAll();
                                        }
                                    },
                                },
                                {
                                    xtype: 'title',
                                    testId: 'virtAccRightCardTitle',
                                    bind: {
                                        title: '{dialogTitle}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-actions',
                            padding: '0 16 0 0',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-more-vert',
                                    testId: 'virtAccRightCardMoreActionsBtn',
                                    ui: 'tool round tool-md',
                                    bind: {
                                        cls: '{nonEditable ? "hidden a-no-content-btn" : "a-no-content-btn"}',
                                        permission: '{userPermissions}',
                                    },
                                    margin: '0 0 0 8',
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
                                    menu: {
                                        cls: 'a-main-edit-menu',
                                        width: 160,
                                        ui: 'has-icons medium',
                                        testId: 'virtAccRightCardEditMenu',
                                        items: [
                                            {
                                                text: 'Delete',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'decline',
                                                testId: 'virtAccRightCardDeleteBtn',
                                                separator: true,
                                                slug: 'cdbFinancialVirtualAccountsDelete',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                },
                                                handler: function (button, el, data) {
                                                    Ext.Msg.confirm(
                                                        'Confirmation',
                                                        'Are you sure you want to delete this record?',
                                                        function (answer) {
                                                            if (answer == 'yes') {
                                                                let store = button.upVM().get('virtualAccounts'),
                                                                    container = this.up(
                                                                        '[xtype=virtual\\.account\\.right\\.card]'
                                                                    ),
                                                                    record = this.upVM().get(
                                                                        'virtualAccountsGrid.selection'
                                                                    );
                                                                store.remove(record);
                                                                store.sync({
                                                                    success: function () {
                                                                        container.hide();
                                                                        Ext.toast('Record deleted', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                        this,
                                                        [
                                                            {
                                                                xtype: 'button',
                                                                itemId: 'no',
                                                                testId: 'virtAccRightCardDeleteNoBtn',
                                                                margin: '0 8 0 0',
                                                                text: 'Cancel',
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                itemId: 'yes',
                                                                testId: 'virtAccRightCardDeleteYesBtn',
                                                                enableToggle: true,
                                                                ui: 'decline alt loading',
                                                                text: 'Delete',
                                                            },
                                                        ]
                                                    );
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add funds',
                            testId: 'virtAccRightCardAddFundsSmallBtn',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            height: 30,
                            slug: 'cdbFinancialVirtualAccountsFund',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    virtualAccount = me.upVM().get('virtualAccountsGrid.selection'),
                                    currentCompany = me.upVM().get('currentCompany');

                                Ext.create('Abraxa.view.cdb.company.virtualAccounts.CreateFunds', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            selectedCompany: record,
                                            virtualAccount: virtualAccount,
                                            editMode: false,
                                            defaultCurrency: currentCompany.get('default_currency'),
                                            payment: Ext.create('Abraxa.model.payment.Payment', {
                                                org_id: record.get('org_id'),
                                                from_id: record.get('org_id'),
                                                to_id: virtualAccount.get('id'),
                                                to_type: virtualAccount.get('model_name'),
                                                owner_id: record.get('org_id'),
                                                owner_type: record.get('model_name'),
                                                currency: virtualAccount.get('currency'),
                                                kind: 'outgoing',
                                                to_exchange_rate: 1,
                                            }),
                                        },
                                        formulas: {
                                            showExchangeRate: {
                                                bind: {
                                                    payment_currency: '{payment.currency}',
                                                    currency: '{virtualAccount.currency}',
                                                },
                                                get: function (data) {
                                                    if (data.payment_currency && data.currency) {
                                                        if (data.payment_currency != data.currency) {
                                                            return false;
                                                        } else {
                                                            return true;
                                                        }
                                                    }
                                                    return true;
                                                },
                                            },
                                        },
                                    },
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'virtual.accounts.balance',
                    margin: 16,
                },
                {
                    xtype: 'virtual.accounts.transactions',
                },
            ],
        },
        {
            xtype: 'transactions.right.card',
        },
    ],
});
