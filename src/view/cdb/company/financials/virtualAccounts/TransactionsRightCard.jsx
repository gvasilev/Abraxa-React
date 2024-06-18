import '../../../../../core/components/Abraxa.PriceField';
import '../../../../../core/components/Abraxa.CurrencyField';
import '../../../../common/combo/BankAccount';

Ext.define('Abraxa.view.cdb.company.virtualAccounts.TransactionsRightCard', {
    extend: 'Ext.Container',
    xtype: 'transactions.right.card',
    itemId: 'transactionsRightCard',
    cls: 'a-right-container a-payment-right-container',
    hidden: true,
    bind: {
        hidden: '{virtualAccountTransaction.selection ? false : true}',
    },
    layout: 'vbox',
    flex: 1,
    viewModel: {
        data: {
            nonEditable: true,
        },
        formulas: {
            payment: {
                bind: {
                    bindTo: '{virtualAccountTransaction.selection}',
                    deep: true,
                },
                get: function(record) {
                    return record;
                },
            },
            dialogTitle: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function(record) {
                    if (record && record.isModel) {
                        let virtualAccount = this.get('virtualAccountsGrid.selection');
                        if (record.get('is_refund')) {
                            return (
                                '<div class="a-badge a-badge-requested"><i class="md-icon-outlined md-icon-add c-yellow-500"></i></div><div><span class="a-panel-id">Payment from</span><span class="a-panel-title">' +
                                record.get('org_name') +
                                '</span></div>'
                            );
                        } else {
                            if (record.get('to_id') == virtualAccount.get('id')) {
                                return (
                                    '<div class="a-badge a-badge-incoming"><i class="md-icon-outlined md-icon-add c-green-500"></i></div><div><span class="a-panel-id">Payment from</span><span class="a-panel-title">' +
                                    record.get('org_name') +
                                    '</span></div>'
                                );
                            } else if (record.get('from_id') == virtualAccount.get('id')) {
                                return (
                                    '<div class="a-badge a-badge-outgoing"><i class="md-icon-outlined md-icon-remove c-red"></i></div><div><span class="a-panel-id">Payment to</span><span class="a-panel-title">' +
                                    record.get('org_name') +
                                    '</span></div>'
                                );
                            }
                        }
                    } else {
                        return '';
                    }
                },
            },
            showExchangeRate: {
                bind: {
                    payment_currency: '{payment.currency}',
                    currency: '{virtualAccountsGrid.selection.currency}',
                },
                get: function(data) {
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
            kind: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function(payment) {
                    if (payment && payment.isModel) {
                        let virtualAccount = this.get('virtualAccountsGrid.selection');
                        if (payment.get('is_refund')) {
                            return 'refund';
                        } else {
                            if (payment.get('to_id') == virtualAccount.get('id')) {
                                return 'incoming';
                            } else if (payment.get('from_id') == virtualAccount.get('id')) {
                                return 'outgoing';
                            }
                        }
                    } else {
                        return '';
                    }
                },
            },
            createdFromPortcall: {
                bind: {
                    bindTo: '{payment}',
                    deep: true,
                },
                get: function(payment) {
                    if (payment && payment.isModel) {
                        let owner = payment.get('owner');
                        if (owner && owner.model_name.toLowerCase().indexOf('portcall') > -1) {
                            return true;
                        }
                    }
                    return false;
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
                            slug: 'portcallPaymentDelete',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
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
                            handler: function(item, el, eOpts) {
                                let vm = this.upVM(),
                                    store = vm.get('virtualAccountPayments'),
                                    container = this.up('[xtype=transactions\\.right\\.card]'),
                                    record = vm.get('payment');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function(answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function(err, msg) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function(batch) {
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
                                    ],
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function(me) {
                                let record = this.upVM().get('payment'),
                                    grid = Ext.ComponentQuery.query('[cls~=transactions_grid]')[0];

                                if (record) {
                                    record.reject();
                                }
                                grid.deselectAll();
                                me.up('[xtype=transactions\\.right\\.card]').hide();
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
            padding: '8 0 0 0',
            cls: 'a-portcall-info',
            layout: 'vbox',
            flex: 1,
            scrollable: 'y',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            items: [
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                    },
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            labelAlign: 'top',
                                            width: 148,
                                            margin: '0 16 0 0',
                                            slug: 'portcallPaymentAmount',
                                            ui: 'field-xl no-border classic',
                                            bind: {
                                                value: '{virtualAccountsGrid.selection.currency}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.pricefield',
                                            placeholder: '0,000.00',
                                            flex: 1,
                                            ui: 'field-xl no-border classic',
                                            label: '',
                                            slug: 'portcallPaymentAmount',
                                            bind: {
                                                value: '{payment.amount * payment.from_exchange_rate}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                                hidden: '{kind == "outgoing" ? false:true}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.pricefield',
                                            placeholder: '0,000.00',
                                            flex: 1,
                                            ui: 'field-xl no-border classic',
                                            label: '',
                                            slug: 'portcallPaymentAmount',
                                            bind: {
                                                value: '{payment.amount * payment.to_exchange_rate}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                                hidden: '{kind == "incoming" || kind == "refund" ? false:true}',
                                            },
                                            listeners: {
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    hidden: true,
                                    bind: {
                                        hidden: '{createdFromPortcall ? true : false}',
                                    },
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            label: 'Payment from',
                                            required: false,
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            floatedPicker: {
                                                minWidth: 336,
                                            },
                                            bind: {
                                                value: '{payment.to_org_id}',
                                                inputValue: '{payment.to_org_name}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                                select: function(me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('payment');
                                                        record.set('org_name', selection.get('org_name'));
                                                        record.set('from_type', selection.get('model_name'));
                                                    }
                                                },
                                                clearicontap: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    record.set('org_name', null);
                                                    record.set('from_type', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            label: 'Payment date',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            ui: 'classic hovered-border',
                                            clearable: false,
                                            required: false,
                                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            bind: {
                                                value: '{payment.payment_date}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                            },
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.pricefield',
                                                    placeholder: '0,000.00',
                                                    flex: 1,
                                                    label: 'Amount',
                                                    cls: 'a-field-icon icon-money icon-rounded',
                                                    bind: {
                                                        value: '{payment.amount}',
                                                        disabled: '{nonEditable ? true : false}',
                                                    },
                                                },
                                                {
                                                    xtype: 'common-combo-currency',
                                                    label: '',
                                                    width: 80,
                                                    bind: {
                                                        value: '{payment.currency}',
                                                        disabled: '{nonEditable ? true : false}',
                                                    },
                                                    floatedPicker: {
                                                        listeners: {
                                                            select: function(me, selection) {
                                                                let payment = me.upVM().get('payment'),
                                                                    defaultCurrency = me.upVM().get('defaultCurrency');
                                                                if (selection) {
                                                                    if (defaultCurrency != selection.get('currency')) {
                                                                        Abraxa.getApplication()
                                                                            .getController('AbraxaController')
                                                                            .getExchange(
                                                                                selection.get('currency'),
                                                                                defaultCurrency,
                                                                            )
                                                                            .then(function(response) {
                                                                                if (response && response.length) {
                                                                                    payment.set(
                                                                                        'exchange_rate',
                                                                                        response[0].exchange_rate,
                                                                                    );
                                                                                }
                                                                            });
                                                                    } else if (
                                                                        defaultCurrency == selection.get('currency')
                                                                    ) {
                                                                        payment.set('exchange_rate', 1);
                                                                    }
                                                                }
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            defaults: {
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            hidden: true,
                                            bind: {
                                                hidden: '{showExchangeRate}',
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.currency.field',
                                                    flex: 5,
                                                    label: 'Exchange rate',
                                                    placeholder: '0,000.00',
                                                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                                                    required: false,
                                                    bind: {
                                                        value: '{payment.to_exchange_rate}',
                                                        disabled: '{nonEditable ? true : false}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    cls: 'c-light-grey',
                                                    margin: '0 0 0 32',
                                                    bind: {
                                                        html: '{virtualAccountsGrid.selection.currency} {(payment.amount * payment.to_exchange_rate):number("0,000.00")}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    hidden: true,
                                    bind: {
                                        hidden: '{createdFromPortcall ? false:true}',
                                    },
                                    defaults: {
                                        clearable: false,
                                        labelAlign: 'left',
                                        ui: 'classic hovered-border',
                                        listeners: {
                                            blur: function(me) {
                                                let record = me.upVM().get('payment');
                                                if (record.dirty) {
                                                    record.save({
                                                        success: function() {
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                    },
                                    items: [
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            label: 'Payment to',
                                            hidden: true,
                                            required: false,
                                            reference: 'outgoingPayment',
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            floatedPicker: {
                                                minWidth: 336,
                                            },
                                            bind: {
                                                value: '{payment.org_id}',
                                                inputValue: '{payment.org_name}',
                                                permission: '{userPermissions}',
                                                hidden: '{kind == "outgoing" ? false:true}',
                                                required: '{kind == "outgoing" ? true:false}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                                select: function(me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('payment');
                                                        record.set('org_name', selection.get('org_name'));
                                                    }
                                                },
                                                clearicontap: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    record.set('org_name', null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            label: 'Payment from',
                                            margin: 0,
                                            hidden: true,
                                            required: false,
                                            reference: 'incomingPayment',
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            floatedPicker: {
                                                minWidth: 336,
                                            },
                                            bind: {
                                                value: '{payment.to_org_id}',
                                                inputValue: '{payment.org_name}',
                                                permission: '{userPermissions}',
                                                hidden: '{kind == "incoming" ? false:true}',
                                                required: '{kind == "incoming" ? true:false}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'organization.combo',
                                            placeholder: 'Choose Company',
                                            label: 'Payment from',
                                            margin: 0,
                                            hidden: true,
                                            required: true,
                                            cls: 'a-field-icon icon-business-center icon-rounded',
                                            floatedPicker: {
                                                minWidth: 336,
                                            },
                                            bind: {
                                                value: '{payment.org_id}',
                                                inputValue: '{payment.org_name}',
                                                permission: '{userPermissions}',
                                                hidden: '{payment.is_refund ? false:true}',
                                                required: '{payment.is_refund ? true:false}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                select: function(me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('payment');
                                                        record.set('org_name', selection.get('org_name'));
                                                    }
                                                },
                                                clearicontap: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    record.set('org_name', null);
                                                },
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'combobox',
                                            itemTpl:
                                                '<div class="hbox"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance</i></div><div class="a-bank"><div class="a-bank-name">{bank_name}</div><div class="a-bank-iban sm-type">{number_type}: {iban}</div></div><div class="a-bank-currency">{currency}</div></div>',
                                            forceSelection: true,
                                            queryMode: 'local',
                                            valueField: 'id',
                                            displayField: 'bank_name',
                                            label: 'My account',
                                            placeholder: 'Choose',
                                            itemCls: 'a-account-listitem',
                                            cls: 'a-field-icon icon-account icon-rounded',
                                            hidden: true,
                                            slug: 'portcallPaymentBankAccount',
                                            store: [],
                                            bind: {
                                                value: '{payment.to_id}',
                                                hidden: '{kind == "outgoing" ? false:true}',
                                                store: '{outgoingPayment.selection ? outgoingPayment.selection.banks:"[]"}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'bank.account.combo',
                                            label: 'My account',
                                            placeholder: 'Choose',
                                            itemCls: 'a-account-listitem',
                                            cls: 'a-field-icon icon-account icon-rounded',
                                            hidden: true,
                                            slug: 'portcallPaymentBankAccount',
                                            store: [],
                                            bind: {
                                                value: '{payment.to_id}',
                                                hidden: '{kind == "incoming" ? false:true}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'textfield',
                                            hidden: false,
                                            label: 'Portcall',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            bind: {
                                                value: '{payment.owner.voyage.vessel_name} {payment.owner.file_id}',
                                                hidden: '{kind == "refund" ? false:true}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            label: 'Payment date',
                                            cls: 'a-field-icon icon-date icon-rounded',
                                            ui: 'classic hovered-border',
                                            clearable: false,
                                            required: false,
                                            placeholder: AbraxaConstants.formatters.date.dayMonthYearSlashShort,
                                            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
                                            bind: {
                                                value: '{payment.payment_date}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                painted: function(me) {
                                                    me.setError(null);
                                                },
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'combobox',
                                            valueField: 'id',
                                            displayField: 'name',
                                            forceSelection: true,
                                            label: 'Related object',
                                            placeholder: 'Choose',
                                            cls: 'a-field-icon icon-layers icon-rounded',
                                            slug: 'portcallPaymentRelatedObject',
                                            floatedPicker: {
                                                minWidth: 220,
                                            },
                                            bind: {
                                                store: '{relatedObjects}',
                                                value: '{payment.paymentable_id}',
                                                disabled: '{nonEditable ? true : false}',
                                                permission: '{userPermissions}',
                                            },
                                            listeners: {
                                                beforequery: function() {
                                                    let store = this.getStore(),
                                                        account = this.upVM().get('accountMainCombo.selection');

                                                    if (store && account) {
                                                        store.removeFilter(8787);
                                                        store.addFilter({
                                                            id: 8787,
                                                            property: 'account_id',
                                                            operator: '=',
                                                            value: account.get('id'),
                                                            exactMatch: true,
                                                        });
                                                    }
                                                },
                                                select: function(me, selection) {
                                                    if (selection) {
                                                        let record = me.upVM().get('payment');
                                                        record.set('paymentable_type', selection.get('model_name'));
                                                    }
                                                },
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'selectfield',
                                            label: 'Type',
                                            placeholder: 'Choose type',
                                            labelAlign: 'left',
                                            required: true,
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-short icon-rounded',
                                            options: [
                                                {
                                                    value: 'advance',
                                                    text: 'Advance',
                                                },
                                                {
                                                    value: 'final',
                                                    text: 'Final',
                                                },
                                                {
                                                    value: 'additional',
                                                    text: 'Additional',
                                                },
                                            ],
                                            bind: {
                                                value: '{payment.type}',
                                                hidden: '{kind == "refund" ? true:false}',
                                                disabled: '{nonEditable ? true : false}',
                                            },
                                            listeners: {
                                                blur: function(me) {
                                                    let record = me.upVM().get('payment');
                                                    if (record.dirty) {
                                                        record.save({
                                                            success: function() {
                                                                Ext.toast('Record updated', 1000);
                                                            },
                                                        });
                                                    }
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                            },
                                            defaults: {
                                                clearable: false,
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.pricefield',
                                                    placeholder: '0,000.00',
                                                    flex: 1,
                                                    label: 'Amount',
                                                    cls: 'a-field-icon icon-money icon-rounded',
                                                    slug: 'portcallPaymentAmount',
                                                    bind: {
                                                        value: '{payment.amount}',
                                                        disabled: '{nonEditable ? true : false}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    listeners: {
                                                        blur: function(me) {
                                                            let record = me.upVM().get('payment');
                                                            if (record.dirty) {
                                                                record.save({
                                                                    success: function() {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'common-combo-currency',
                                                    label: '',
                                                    width: 80,
                                                    margin: '0 0 0 16',
                                                    slug: 'portcallPaymentAmount',
                                                    bind: {
                                                        value: '{payment.currency}',
                                                        disabled: '{nonEditable ? true : false}',
                                                        permission: '{userPermissions}',
                                                    },
                                                    floatedPicker: {
                                                        listeners: {
                                                            select: function(me, selection) {
                                                                let billingParty = me
                                                                        .upVM()
                                                                        .get('billingParty.selection'),
                                                                    payment = me.upVM().get('payment');
                                                                if (selection) {
                                                                    if (
                                                                        billingParty &&
                                                                        billingParty.get('account_currency')
                                                                    ) {
                                                                        if (
                                                                            billingParty.get('account_currency') !=
                                                                            selection.get('currency')
                                                                        ) {
                                                                            Abraxa.getApplication()
                                                                                .getController('AbraxaController')
                                                                                .getExchange(
                                                                                    selection.get('currency'),
                                                                                    billingParty.get('account_currency'),
                                                                                )
                                                                                .then(function(response) {
                                                                                    if (response && response.length) {
                                                                                        payment.set(
                                                                                            'exchange_rate',
                                                                                            response[0].exchange_rate,
                                                                                        );
                                                                                    }
                                                                                });
                                                                        } else if (
                                                                            billingParty.get('account_currency') ==
                                                                            selection.get('currency')
                                                                        ) {
                                                                            payment.set('exchange_rate', 1);
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                        },
                                                    },
                                                    listeners: {
                                                        blur: function(me) {
                                                            let record = me.upVM().get('payment');
                                                            if (record.dirty) {
                                                                record.save({
                                                                    success: function() {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'container',
                                            defaults: {
                                                labelAlign: 'left',
                                                ui: 'classic hovered-border',
                                            },
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                            },
                                            hidden: true,
                                            slug: 'portcallPaymentExchangeRate',
                                            bind: {
                                                hidden: '{showExchangeRate}',
                                                permission: '{userPermissions}',
                                            },
                                            items: [
                                                {
                                                    xtype: 'abraxa.currency.field',
                                                    label: 'Exchange rate',
                                                    placeholder: '0,000.00',
                                                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                                                    required: false,
                                                    flex: 1,
                                                    bind: {
                                                        value: '{payment.from_exchange_rate}',
                                                        required: '{payment.from_exchange_rate ? true:false}',
                                                        disabled: '{nonEditable ? true : false}',
                                                        hidden: '{kind == "outgoing" ? false:true}',
                                                    },
                                                    listeners: {
                                                        blur: function(me) {
                                                            let record = me.upVM().get('payment');
                                                            if (record.dirty) {
                                                                record.save({
                                                                    success: function() {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'abraxa.currency.field',
                                                    label: 'Exchange rate',
                                                    placeholder: '0,000.00',
                                                    cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                                                    required: false,
                                                    flex: 1,
                                                    bind: {
                                                        value: '{payment.to_exchange_rate}',
                                                        required: '{payment.to_exchange_rate ? true:false}',
                                                        disabled: '{nonEditable ? true : false}',
                                                        hidden: '{kind == "incoming" || kind == "refund" ? false:true}',
                                                    },
                                                    listeners: {
                                                        blur: function(me) {
                                                            let record = me.upVM().get('payment');
                                                            if (record.dirty) {
                                                                record.save({
                                                                    success: function() {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    margin: '0 0 0 16',
                                                    cls: 'c-light-grey',
                                                    bind: {
                                                        hidden: '{kind == "incoming" || kind == "refund" ? false:true}',
                                                        html: '{virtualAccountsGrid.selection.currency} {(payment.amount * payment.to_exchange_rate):number("0,000.00")}',
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    margin: '0 0 0 16',
                                                    cls: 'c-light-grey',
                                                    bind: {
                                                        hidden: '{kind == "outgoing" ? false:true}',
                                                        html: '{virtualAccountsGrid.selection.currency} {(payment.amount * payment.from_exchange_rate):number("0,000.00")}',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'div',
                                    cls: 'divider divider-offset offset-x24',
                                    html: '',
                                },
                                {
                                    labelAlign: 'top',
                                    cls: 'a-field-icon icon-short',
                                    ui: 'no-border no-underline',
                                    placeholder: 'Enter description (optional)',
                                    xtype: 'textareafield',
                                    slug: 'portcallPaymentDescription',
                                    bind: {
                                        value: '{payment.description}',
                                        disabled: '{nonEditable ? true : false}',
                                        permission: '{userPermissions}',
                                    },
                                    listeners: {
                                        blur: function(me) {
                                            let record = me.upVM().get('payment');
                                            if (record.dirty) {
                                                record.save({
                                                    success: function() {
                                                        Ext.toast('Record updated', 1000);
                                                    },
                                                });
                                            }
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
