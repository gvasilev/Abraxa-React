Ext.define('Abraxa.view.cdb.company.financials.banks.BanksRightCard', {
    extend: 'Ext.Container',
    xtype: 'financials.banks.right.card',
    itemId: 'banksRightCard',
    cls: 'a-right-container',
    hidden: true,
    bind: {
        hidden: '{banksGrid.selection ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        formulas: {
            dialogTitle: {
                bind: {
                    bindTo: '{banksGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return (
                            '<div class="a-badge a-badge-bank"><i class="md-icon-outlined">account_balance</i></div><div><span class="a-panel-title">' +
                            record.get('name') +
                            '</span></div>'
                        );
                    } else {
                        return '';
                    }
                },
            },
            bank: {
                bind: {
                    bindTo: '{banksGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    } else {
                        Ext.ComponentQuery.query('[itemId=banksRightCard]')[0].hide();
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: '{dialogTitle}',
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'cdbFinancialBankAccountsDelete',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('banks'),
                                    container = this.find('banksRightCard'),
                                    record = vm.get('banksGrid.selection');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.ComponentQuery.query('[xtype=company]')[0]
                                                        .getVM()
                                                        .set('newUpdate', new Date());
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
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
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                let record = this.upVM().get('banksGrid.selection'),
                                    grid = Ext.ComponentQuery.query('financials\\.banks')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=financials\\.banks\\.right\\.card]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            scrollable: true,
            cls: 'a-general-form',
            scrollable: 'y',
            padding: '8 24',
            flex: 1,
            defaults: {
                labelAlign: 'left',
                ui: 'classic hovered-border',
                clearable: false,
                slug: 'cdbFinancialBankAccounts',
                bind: {
                    permission: '{userPermissions}',
                },
                listeners: {
                    blur: function () {
                        let record = this.upVM().get('banksGrid.selection');
                        if (record.dirty) {
                            record.getProxy().setExtraParams({
                                org_id: record.get('org_id'),
                            });
                            record.save({
                                success: function () {
                                    Ext.ComponentQuery.query('[xtype=company]')[0].getVM().set('newUpdate', new Date());
                                    Ext.toast('Record updated');
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border classic',
                    label: false,
                    placeholder: 'Enter bank name',
                    bind: {
                        value: '{bank.name}',
                    },
                    required: true,
                    listeners: {
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Verified',
                    slug: 'cdbFinancialBankAccountsVerified',
                    placeholder: 'Choose',
                    cls: 'a-field-icon icon-verified icon-rounded',
                    options: [
                        {
                            value: 1,
                            text: 'Yes',
                        },
                        {
                            value: 0,
                            text: 'No',
                        },
                    ],
                    bind: {
                        value: '{bank.is_verified}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Branch number',
                    placeholder: 'Branch number',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{bank.bank_branch_number}',
                    },
                },
                {
                    xtype: 'common-combo-currency',
                    label: 'Currency',
                    editable: false,
                    placeholder: 'Choose currency',
                    cls: 'a-field-icon icon-money icon-rounded',
                    slug: 'cdbFinancialBankAccounts',
                    matchFieldWidth: true,
                    bind: {
                        value: '{bank.currency}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                {
                    xtype: 'radiogroup',
                    label: 'IBAN/ABA',
                    labelWidth: 161,
                    ui: null,
                    margin: '6 0',
                    reference: 'number_type',
                    publishes: 'value',
                    style: 'align-items: center;',
                    bind: {
                        value: '{bank.number_type}',
                    },
                    items: [
                        {
                            label: 'IBAN',
                            ui: 'medium',
                            name: 'number_type',
                            value: 'IBAN',
                        },
                        {
                            label: 'ABA',
                            ui: 'medium',
                            name: 'number_type',
                            value: 'ABA',
                        },
                    ],
                    defaults: {
                        listeners: {
                            change: function () {
                                let record = this.upVM().get('banksGrid.selection');
                                if (record.dirty) {
                                    record.getProxy().setExtraParams({
                                        org_id: record.get('org_id'),
                                    });
                                    record.save({
                                        success: function () {
                                            Ext.ComponentQuery.query('[xtype=company]')[0]
                                                .getVM()
                                                .set('newUpdate', new Date());
                                            Ext.toast('Record updated');
                                        },
                                    });
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'IBAN',
                    placeholder: 'Enter bank number',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{bank.iban}',
                        label: '{bank.number_type}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'SWIFT',
                    placeholder: 'SWIFT code',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{bank.swift_number}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                {
                    xtype: 'textfield',
                    label: 'Account No',
                    placeholder: 'Account No',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{bank.account_number}',
                    },
                },
                {
                    xtype: 'textfield',
                    cls: 'a-field-icon icon-business icon-rounded',
                    label: 'Beneficiary',
                    systemField: 'beneficiary',
                    placeholder: 'Enter company',
                    bind: {
                        value: '{bank.beneficiary}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Address',
                    placeholder: 'Bank address',
                    cls: 'a-field-icon icon-location icon-rounded',
                    bind: {
                        value: '{bank.address}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Correspondent bank',
                    placeholder: 'Correspondent bank',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{bank.corresponding_bank}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                {
                    xtype: 'textfield',
                    label: 'Bank ID IFS',
                    placeholder: 'Enter Bank ID IFS',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{bank.ifs_id}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Reference number',
                    placeholder: 'Enter reference number',
                    cls: 'a-field-icon icon-rounded icon-short',
                    bind: {
                        value: '{bank.reference_number}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset offset-x24',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    cls: 'a-file-data',
                    defaults: {
                        cls: 'a-data-item',
                        height: 42,
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Created by',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{bank.created_by_user}',
                                            updated_at: '{bank.created_at}',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Updated by',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{bank.updated_by_user}',
                                            updated_at: '{bank.updated_at}',
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{bank.verified ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Verified by',
                                    cls: 'c-blue-grey fs-13',
                                    width: 162,
                                },
                                {
                                    xtype: 'public.updated.by',
                                    cls: 'chatter-avatar',
                                    bind: {
                                        data: {
                                            user: '{bank.verified}',
                                            updated_at: '{bank.verified_at}',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
