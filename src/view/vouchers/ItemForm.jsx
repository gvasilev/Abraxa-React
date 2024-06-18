import '../portcall/agent/expenses/ExpensesCombo';
import '../portcall/agent/payments/PaymentsList';

Ext.define('Abraxa.view.vouchers.Itemform', {
    extend: 'Ext.Container',
    xtype: 'voucher-item-form',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    scrollable: true,
    padding: '8 24',
    items: [
        {
            xtype: 'container',
            cls: 'a-adocs-form cargo_edit_form',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border dark',
                listeners: {
                    focusleave: function (me) {
                        let item = me.upVM().get('service'),
                            object_record = me.upVM().get('object_record');
                        if (item && item.dirty) {
                            item.getProxy().setExtraParams({
                                portcall_id: object_record.get('id'),
                            });
                            item.save({
                                success: function () {
                                    Ext.toast('Record updated', 1000);
                                },
                                failure: function () {
                                    item.reject();
                                },
                            });
                        }
                    },
                },
            },
            items: [
                {
                    xtype: 'portcall.expenses.combo',
                    label: 'Service item',
                    placeholder: 'Choose service',
                    cls: 'a-field-icon icon-short icon-rounded',
                    required: false,
                    valueField: 'id',
                    displayField: 'default_expense_item_name',
                    reference: 'expenseCombo',
                    publishes: ['value'],
                    ui: 'classic hovered-border dark',
                    bind: {
                        store: '{expenses}',
                        disabled: '{vouchersList.selection.expense_id ? true : false}',
                        readOnly: '{nonEditable ? true : false}',
                        value: '{vouchersList.selection.expense_id}',
                        inputValue: '{expense.default_expense_item_name}',
                    },
                    matchFieldWidth: false,
                    floatedPicker: {
                        minWidth: 246,
                        cls: 'a-boundlist-dark',
                        listeners: {
                            select: function (me, selection) {
                                let record = me.upVM().get('vouchersList.selection'),
                                    service = me.upVM().get('service'),
                                    object_record = me.upVM().get('object_record');

                                if (selection && !service) {
                                    Ext.Msg.confirm(
                                        'Assign invoice',
                                        'Are you sure you want to assign this invoice to the selected service? <br>This action cannot be undone.',
                                        function (answer) {
                                            if (answer != 'yes') return;

                                            record.set('expense_id', selection.get('id'));
                                            record.set('exchange_rate', null);
                                            // expence.set('currency', null);
                                            record.getProxy().setExtraParams({
                                                portcall_id: object_record.get('id'),
                                            });
                                            record.save({
                                                success: function () {
                                                    selection
                                                        .getProxy()
                                                        .setUrl(
                                                            Env.ApiEndpoint +
                                                                'portcall/' +
                                                                object_record.get('id') +
                                                                '/expense/' +
                                                                selection.get('id')
                                                        );

                                                    // selection.getProxy().setExtraParams({
                                                    //     portcall_id: object_record.get('id'),
                                                    // });
                                                    selection.load({
                                                        callback: function () {
                                                            selection
                                                                .getProxy()
                                                                .setUrl(
                                                                    Env.ApiEndpoint + 'portcall/${portcall_id}/expense'
                                                                );
                                                        },
                                                    });
                                                    if (selection.get('currency') != record.get('currency')) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .getExchange(
                                                                record.get('currency'),
                                                                selection.get('currency')
                                                            )
                                                            .then(function (response) {
                                                                if (response && response.length) {
                                                                    record.set(
                                                                        'exchange_rate',
                                                                        response[0].exchange_rate
                                                                    );
                                                                }
                                                            });
                                                    }
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function () {
                                                    record.reject();
                                                },
                                            });
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
                                                ui: 'normal',
                                                text: 'Assign',
                                            },
                                        ]
                                    );
                                }
                            },
                        },
                    },
                    listeners: {},
                },
                {
                    xtype: 'unit.field',
                    padding: '4 0',
                    label: 'Quantity',
                    cls: 'a-field-icon icon-short icon-rounded',
                    labelAlign: 'left',
                    slug: 'portcallServices',
                    subObject: 'supply',
                    bind: {
                        disabled: '{!service || service.lockItem ? true : false}',
                        value: '{service.quantity}',
                        valueUnit: '{service.quantity_unit}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly dark" : "hovered-border dark classic"}',
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                        // hidden: '{service.quantity ? false : true}',
                        options: '{defaultServiceUnits}',
                        unitFilter: '{selectedServiceType.selection.type.default_units_id}',
                    },
                    options: ['mts', 'cbm', 'kg', 'units', 'pallets', 'pieces', 'drums', 'box', 'envelope'],
                },
                {
                    xtype: 'organization.combo',
                    placeholder: 'Choose Company',
                    label: 'Vendor',
                    slug: 'portcallServices',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    ui: 'classic dark hovered-border',
                    floatedPicker: {
                        minWidth: 249,
                        viewModel: {
                            data: {
                                showSuggested: true,
                            },
                        },
                        cls: 'a-boundlist-dark a-organization-combo',
                        listeners: {
                            select: function (me, selection) {
                                if (selection) {
                                    let record = me.upVM().get('service');
                                    if (record) {
                                        record.set('vendor_name', selection.get('org_name'));
                                    }
                                }
                            },
                        },
                    },
                    bind: {
                        disabled: '{!service || service.lockItem ? true : false}',
                        value: '{service.vendor_id}',
                        inputValue: '{service.vendor_name}',
                        permission: '{userPermissions}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Account',
                    editable: true,
                    placeholder: 'Choose account',
                    slug: 'portcallInvoices',
                    cls: 'a-field-icon icon-business-center icon-rounded',
                    options: ['Owners costs', 'Charterers costs', 'Shippers costs', 'Agents costs'],
                    bind: {
                        disabled: '{!service || service.lockItem ? true : false}',
                        value: '{service.account_of}',
                        inputValue: '{service.account_of}',
                        ui: '{nonEditable ? "viewonly dark" : "hovered-border dark classic"}',
                        readOnly: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                    floatedPicker: {
                        cls: 'a-boundlist-dark',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    defaults: {
                        clearable: false,
                        labelAlign: 'left',
                        ui: 'classic hovered-border dark',
                    },
                    items: [
                        {
                            xtype: 'common-combo-currency',
                            label: 'Invoice amount',
                            cls: 'a-field-icon icon-money icon-rounded',
                            width: 290,
                            slug: 'portcallInvoices',
                            bind: {
                                disabled: '{service && service.lockItem ? true : false}',
                                ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                                value: '{vouchersList.selection.currency}',
                                inputValue: '{vouchersList.selection.currency}',
                                readOnly: '{nonEditable ? true : false}',
                                permission: '{userPermissions}',
                            },
                            floatedPicker: {
                                cls: 'a-boundlist-dark',
                                listeners: {
                                    select: function (me, selection) {
                                        let account = me.upVM().get('account'),
                                            voucher = me.upVM().get('vouchersList.selection');
                                        if (selection && selection.get('currency') && account) {
                                            if (selection.get('currency') != account.get('account_currency')) {
                                                Abraxa.getApplication()
                                                    .getController('AbraxaController')
                                                    .getExchange(
                                                        selection.get('currency'),
                                                        account.get('account_currency')
                                                    )
                                                    .then(function (response) {
                                                        if (response && response.length) {
                                                            voucher.set('exchange_rate', response[0].exchange_rate);
                                                        }
                                                    });
                                            } else if (account.get('account_currency') == selection.get('currency')) {
                                                voucher.set('exchange_rate', 1);
                                            }
                                        }
                                    },
                                },
                            },
                            forceSelection: true,
                            listeners: {
                                focusleave: function (me) {
                                    let item = me.upVM().get('vouchersList.selection'),
                                        object_record = me.upVM().get('object_record');

                                    if (item && item.dirty) {
                                        let expense = me.upVM().get('expenses').getById(item.get('expense_id'));

                                        if (expense) {
                                            var disbursement = me
                                                .upVM()
                                                .get('disbursements')
                                                .queryBy(function (rec) {
                                                    if (rec.get('group_id') == expense.get('disbursement_id')) {
                                                        if (expense.get('fda_id'))
                                                            return rec.get('id') == expense.get('fda_id');

                                                        if (expense.get('dda_id'))
                                                            return rec.get('id') == expense.get('dda_id');

                                                        if (expense.get('pda_id'))
                                                            return rec.get('id') == expense.get('pda_id');
                                                    }
                                                }).items[0];

                                            if (disbursement) {
                                                let invoices = me
                                                    .upVM()
                                                    .get('vouchers')
                                                    .queryBy(function (rec, id) {
                                                        return rec.get('expense_id') == item.get('expense_id');
                                                    });
                                                if (invoices.getCount()) {
                                                    let multiCurrency = me
                                                        .upVM()
                                                        .get('vouchers')
                                                        .queryBy(function (voucher) {
                                                            if (voucher.get('expense_id') == item.get('expense_id')) {
                                                                return (
                                                                    voucher.get('currency') !=
                                                                    disbursement.get('disbursement_currency')
                                                                );
                                                            }
                                                        }).items.length;

                                                    if (multiCurrency) {
                                                        disbursement.set('multi_currency', 1);
                                                    } else {
                                                        disbursement.set('multi_currency', 0);
                                                    }

                                                    if (disbursement.dirty) disbursement.save();
                                                }
                                            }
                                        }
                                        item.getProxy().setExtraParams({
                                            portcall_id: object_record.get('id'),
                                        });
                                        item.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function () {
                                                item.reject();
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'abraxa.pricefield',
                            placeholder: '0,000.00',
                            flex: 1,
                            label: '',
                            margin: '0 0 0 16',
                            slug: 'portcallInvoices',
                            cls: 'a-field-icon icon-money icon-rounded',
                            bind: {
                                disabled: '{service && service.lockItem ? true : false}',
                                value: '{vouchersList.selection.price}',
                                permission: '{userPermissions}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                            },
                            listeners: {
                                focusleave: function (me) {
                                    let item = me.upVM().get('vouchersList.selection'),
                                        object_record = me.upVM().get('object_record');

                                    if (item && item.dirty) {
                                        let expense = me.upVM().get('expenses').getById(item.get('expense_id')),
                                            sum = 0;

                                        if (expense) {
                                            var disbursement = me
                                                .upVM()
                                                .get('disbursements')
                                                .queryBy(function (rec) {
                                                    if (rec.get('group_id') == expense.get('disbursement_id')) {
                                                        if (expense.get('fda_id'))
                                                            return rec.get('id') == expense.get('fda_id');

                                                        if (expense.get('dda_id'))
                                                            return rec.get('id') == expense.get('dda_id');

                                                        if (expense.get('pda_id'))
                                                            return rec.get('id') == expense.get('pda_id');
                                                    }
                                                }).items[0];

                                            if (disbursement) {
                                                let invoices = me
                                                    .upVM()
                                                    .get('vouchers')
                                                    .queryBy(function (rec, id) {
                                                        return rec.get('expense_id') == item.get('expense_id');
                                                    });
                                                if (invoices.getCount()) {
                                                    invoices.each(function (voucher) {
                                                        sum += parseFloat(voucher.get('calculated_price'));
                                                    });
                                                }
                                                expense.set(disbursement.get('type') + '_price', sum);
                                            }
                                        }
                                        item.getProxy().setExtraParams({
                                            portcall_id: object_record.get('id'),
                                        });
                                        item.save({
                                            success: function () {
                                                if (expense && expense.dirty) {
                                                    expense.save();
                                                }

                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function () {
                                                item.reject();
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
                    margin: '4 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    hidden: true,
                    slug: 'portcallInvoices',
                    bind: {
                        hidden: '{showExchangeRate}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'abraxa.currency.field',
                            label: 'Exchange rate',
                            placeholder: '0.0000',
                            clearable: false,
                            labelAlign: 'left',
                            cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                            ui: 'classic hovered-border dark',
                            width: 290,
                            required: true,
                            slug: 'portcallInvoices',
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{service && service.lockItem ? true : false}',
                                value: '{vouchersList.selection.exchange_rate}',
                                readOnly: '{nonEditable ? true : false}',
                                ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                            },
                            listeners: {
                                focusleave: function (me) {
                                    let item = me.upVM().get('vouchersList.selection'),
                                        object_record = me.upVM().get('object_record');

                                    if (item && item.dirty) {
                                        let expense = me.upVM().get('expenses').getById(item.get('expense_id')),
                                            sum = 0;
                                        if (expense) {
                                            let disbursement = me
                                                .upVM()
                                                .get('disbursements')
                                                .queryBy(function (rec) {
                                                    if (rec.get('group_id') == expense.get('disbursement_id')) {
                                                        if (expense.get('fda_id'))
                                                            return rec.get('id') == expense.get('fda_id');

                                                        if (expense.get('dda_id'))
                                                            return rec.get('id') == expense.get('dda_id');

                                                        if (expense.get('pda_id'))
                                                            return rec.get('id') == expense.get('pda_id');
                                                    }
                                                }).items[0];
                                            if (disbursement) {
                                                let invoices = me
                                                    .upVM()
                                                    .get('vouchers')
                                                    .queryBy(function (rec, id) {
                                                        return rec.get('expense_id') == item.get('expense_id');
                                                    });
                                                if (invoices.getCount()) {
                                                    invoices.each(function (voucher) {
                                                        sum += parseFloat(voucher.get('calculated_price'));
                                                    });
                                                }
                                                expense.set(disbursement.get('type') + '_price', sum);
                                            }
                                        }
                                        item.getProxy().setExtraParams({
                                            portcall_id: object_record.get('id'),
                                        });
                                        item.save({
                                            success: function () {
                                                if (expense && expense.dirty) {
                                                    expense.save();
                                                }

                                                Ext.toast('Record updated', 1000);
                                            },
                                            failure: function () {
                                                item.reject();
                                            },
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 16',
                            cls: 'a-append a-append-units',
                            bind: {
                                disabled: '{service && service.lockItem ? true : false}',
                                html: '<b class="c-light-grey mr-8">{account.account_currency}</b><b class="fw-b c-grey">{vouchersList.selection.calculated_price:number("0,000.00")}</b>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.datefield',
                    label: 'Date',
                    cls: 'a-field-icon icon-time icon-rounded',
                    slug: 'portcallInvoices',
                    ui: 'classic hovered-border dark',
                    bind: {
                        disabled: '{service && service.lockItem ? true : false}',
                        value: '{vouchersList.selection.invoice_date}',
                        permission: '{userPermissions}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                    },
                    listeners: {
                        focusleave: function (me) {
                            let item = me.upVM().get('vouchersList.selection'),
                                object_record = me.upVM().get('object_record');
                            if (item && item.dirty) {
                                item.getProxy().setExtraParams({
                                    portcall_id: object_record.get('id'),
                                });
                                item.save({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                    failure: function () {
                                        item.reject();
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Ref N.',
                    labelAlign: 'left',
                    ui: 'classic dark hovered-border',
                    cls: 'a-field-icon icon-short icon-rounded',
                    clearable: false,
                    placeholder: 'Ref N.',
                    slug: 'portcallInvoices',
                    bind: {
                        disabled: '{service && service.lockItem ? true : false}',
                        value: '{vouchersList.selection.reference_number}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly dark" : "classic hovered-border dark"}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        focusleave: function (me) {
                            let item = me.upVM().get('vouchersList.selection'),
                                object_record = me.upVM().get('object_record');
                            if (item && item.dirty) {
                                item.getProxy().setExtraParams({
                                    portcall_id: object_record.get('id'),
                                });
                                item.save({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                    failure: function () {
                                        item.reject();
                                    },
                                });
                            }
                        },
                    },
                },

                {
                    xtype: 'textareafield',
                    cls: 'a-field-icon icon-short icon-rounded',
                    labelAlign: 'top',
                    labelCls: 'align-top',
                    label: 'Comment',
                    scrollable: false,
                    minHeight: 60,
                    margin: '8 0 0 0',
                    flex: 1,
                    placeholder: 'Comment',
                    subObject: 'disbursements',
                    slug: 'portcallInvoices',
                    bind: {
                        disabled: '{service && service.lockItem ? true : false}',
                        value: '{vouchersList.selection.note}',
                        readOnly: '{nonEditable ? true : false}',
                        ui: '{nonEditable ? "viewonly dark" : "hovered-border dark classic"}',
                        objectPermission: '{objectPermissions}',
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        focusleave: function (me) {
                            let item = me.upVM().get('vouchersList.selection'),
                                object_record = me.upVM().get('object_record');
                            if (item && item.dirty) {
                                item.getProxy().setExtraParams({
                                    portcall_id: object_record.get('id'),
                                });
                                item.save({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                    failure: function () {
                                        item.reject();
                                    },
                                });
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-divider',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    margin: '8 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'label',
                            width: 182,
                            ui: 'dark',
                            cls: 'fs-13',
                            html: 'Uploaded by',
                        },
                        {
                            xtype: 'public.updated.by',
                            bind: {
                                data: {
                                    user: '{vouchersList.selection.document.created_by_user}',
                                    updated_at: '{vouchersList.selection.document.created_at}',
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '8 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'label',
                            width: 182,
                            ui: 'dark',
                            cls: 'fs-13',
                            html: 'Updated by',
                        },
                        {
                            xtype: 'public.updated.by',
                            bind: {
                                data: {
                                    user: '{vouchersList.selection.updated_by_user}',
                                    updated_at: '{vouchersList.selection.updated_at}',
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'a-divider',
            html: '<hr>',
        },
        {
            xtype: 'container',
            cls: 'a-private-payments-dark',
            style: 'background-color: transparent',
            ui: 'dark',
            padding: 0,
            hidden: false,
            // slug: 'task',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            bind: {
                hidden: '{!is_owner}',
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    padding: 0,
                    items: [
                        {
                            xtype: 'title',
                            title: '<div><span class="a-panel-title">Payments</span><span class="a-panel-subtitle"><i class="md-icon-outlined md-icon-lock"></i>Visible only to my organization</span></div>',
                        },
                    ],
                },
                {
                    xtype: 'payments.list',
                    style: 'background-color: transparent',
                    cls: 'a-list-dark',
                    minHeight: 120,
                    itemConfig: {
                        padding: '8 0',
                    },
                    bind: {
                        store: '{objectPayments}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            docked: 'bottom',
            padding: 16,
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'success outlined',
                    text: 'Make payment',
                    iconCls: 'md-icon-outlined md-icon-attach-money',
                    margin: '0 8 0 0',
                    slug: 'portcallPayments',
                    bind: {
                        permission: '{userPermissions}',
                        hidden: '{nonEditable || !service ? true : false}',
                        disabled: '{isLocked ? true : false}',
                        cls: '{!is_owner ? "hidden" : ""}',
                    },
                    handler: function (me) {
                        let object_record = me.upVM().get('object_record'),
                            invoice = me.upVM().get('vouchersList.selection'),
                            account = me.upVM().get('account'),
                            service = me.upVM().get('service'),
                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                owner_id: object_record.get('id'),
                                owner_type: object_record.get('model_name'),
                                to_org_id: service.get('vendor_id'),
                                to_org_name: service.get('vendor_name'),
                                account_id: account ? account.get('id') : null,
                                org_id: account ? account.get('org_id') : null,
                                org_name: account ? account.get('org_name') : null,
                                currency: account
                                    ? account.get('account_currency')
                                    : me.upVM().get('currentCompany').get('default_currency'),
                                account_currency: account ? account.get('account_currency') : null,
                                from_exchange_rate: 1,
                                to_exchange_rate: 1,
                                paymentable_id: invoice.get('id'),
                                paymentable_type: invoice.get('model_name'),
                                amount: invoice.get('price'),
                                calculated_amount: invoice.get('calculated_price'),
                                exchange_rate: invoice.get('exchange_rate'),
                                currency: invoice.get('currency'),
                                account_currency: account.get('account_currency'),
                            });
                        payment.set('kind', 'outgoing');
                        Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                    },
                },
                {
                    xtype: 'button',
                    ui: 'action',
                    text: 'Save',
                    bind: {
                        hidden: '{nonEditable ? true : false}',
                        disabled: '{isLocked ? true : false}',
                    },
                    handler: async function (me) {
                        let document = me.upVM().get('selectedVoucher').getDocument();
                        const dialog = me.up('dialog');
                        const controller = dialog.getController();
                        const documentViewer = controller ? controller.documentViewer : null;
                        const annotManager = controller ? controller.annotManager : null;
                        const pageRotation = controller ? controller.pageRotation : null;
                        if (!annotManager || !documentViewer) {
                            Ext.Msg.warning('Error', 'Reload page and try again');
                            return;
                        }
                        const doc = documentViewer.getDocument();
                        const xfdfString = await annotManager.exportAnnotations();
                        const data = await doc?.getFileData({
                                // saves the document with annotations in it
                                xfdfString,
                            }),
                            arr = new Uint8Array(data),
                            blob = new Blob([arr], {
                                type: 'application/pdf',
                            });

                        // annotManager.importAnnotations(
                        //     '<?xml version="1.0" encoding="UTF-8" ?> <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"> <fields> <field name="ACombo"><value>Red</value></field> </fields> <annots> <square subject="Rectangle" page="0" rect="306.01,744.85,408.98,775.94" flags="print" name="447c49b7-5e50-4b13-adc8-c291102466e6" title="Guest" date="D:20171226120150-08\'00\'" color="#000000" width="5" creationdate="D:20171226120147-08\'00\'"> <popup flags="print,nozoom,norotate" page="0" rect="0,767,112.5,842" open="no"/> </square> </annots> </xfdf>'
                        // );

                        // return;

                        annotManager
                            .exportAnnotations({
                                links: false,
                                widgets: false,
                            })
                            .then((xfdfString) => {
                                // fetch('path/to/annotation/server', {
                                //     method: 'POST',
                                //     body: xfdfString // written into an XFDF file in server
                                // });
                                // Full samples are available at the end of this section.
                            });

                        let file = blob;
                        let formData = new FormData();
                        formData.append('file', file);
                        let request = new XMLHttpRequest();
                        request.open('POST', Env.ApiEndpoint + 'documents/update_blob/' + document.get('id'));
                        request.onreadystatechange = function () {
                            if (request.readyState == XMLHttpRequest.DONE) {
                                document.set('pdf', blob);
                            }
                        };
                        request.send(formData);
                        Ext.toast('All changes have been saved', 1000);
                    },
                },
            ],
        },
    ],
});
