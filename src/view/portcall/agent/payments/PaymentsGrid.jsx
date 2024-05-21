Ext.define('Abraxa.view.portcall.payments.PaymentsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'payments.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'abraxa-grid a-offset-grid a-payments-grid',
    reference: 'paymentGrid',
    itemId: 'paymentsGrid',
    testId: 'paymentsGrid',
    keyMapEnabled: true,
    loadingText: false,
    infinite: false,
    scrollable: 'y',
    keyMap: {
        scope: 'this',
        ESC: function () {
            Ext.ComponentQuery.query('payments\\.grid')[0].deselectAll();
        },
    },
    selectable: true,
    bind: {
        store: '{filtedPayments}',
        cls: '{nonEditable ? "abraxa-grid a-offset-grid a-payments-grid-noneditable" : ""} abraxa-grid a-offset-grid a-payments-grid',
        hideHeaders: '{filtedPayments.count ? false : true}',
    },
    plugins: {
        gridsummaryrow: {
            row: {
                xtype: 'gridsummaryrow',
                docked: null,
                weight: 1,
                cls: 'a-grid-summaryrow',
                bind: {
                    hidden: '{!filtedPayments.count ? true : paymentsMenu.selection.tab == "drafts" ? true:false }',
                },
                itemId: 'payments-grid-summary',
            },
        },
    },
    emptyText: {
        xtype: 'container',
        testId: 'paymentsGridEmptyTextContainer',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                testId: 'paymentsGridEmptyTextDiv',
                bind: {
                    html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No {paymentsMenu.selection.title} available</div></div>',
                },
            },
            {
                xtype: 'container',
                cls: 'text-center',
                items: [
                    {
                        xtype: 'button',
                        cls: 'a-no-content-btn',
                        text: 'Payment',
                        slug: 'portcallPayments',
                        testId: 'paymentsGridPaymentMenuButton',
                        disabled: false,
                        bind: {
                            cls: '{nonEditable ? "hidden a-no-content-btn":""}',
                            hidden: '{paymentsMenu.selection.tab == "transactions" ? false:true}',
                            disabled: '{accountMainCombo.selection ? false:true}',
                            permission: '{userPermissions}',
                        },
                        ui: 'normal-light medium',
                        iconCls: 'md-icon-add',
                        menu: {
                            items: [
                                {
                                    iconCls: 'md-icon-credit-score md-icon-outlined c-yellow-500',
                                    text: 'Request payment',
                                    testId: 'paymentsGridMenuRequestPaymentButton',
                                    handler: function (me) {
                                        let object_record = me.upVM().get('object_record'),
                                            account = me.upVM().get('account'),
                                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                                owner_id: object_record.get('id'),
                                                owner_type: object_record.get('model_name'),
                                                account_id: account ? account.get('id') : null,
                                                org_id: account ? account.get('org_id') : null,
                                                org_name: account ? account.get('org_name') : null,
                                                currency: account
                                                    ? account.get('account_currency')
                                                    : me.upVM().get('currentCompany').get('default_currency'),
                                                account_currency: account ? account.get('account_currency') : null,
                                                from_exchange_rate: 1,
                                                to_exchange_rate: 1,
                                            });
                                        payment.set('kind', 'requested');
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .addPayment(me, payment);
                                    },
                                },
                                {
                                    iconCls: 'md-icon-add c-green-500',
                                    text: 'Incoming payment',
                                    testId: 'paymentsGridIncomingPaymentButton',
                                    handler: function (me) {
                                        let object_record = me.upVM().get('object_record'),
                                            account = me.upVM().get('account'),
                                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                                owner_id: object_record.get('id'),
                                                owner_type: object_record.get('model_name'),
                                                account_id: account ? account.get('id') : null,
                                                org_id: account ? account.get('org_id') : null,
                                                org_name: account ? account.get('org_name') : null,
                                                currency: account
                                                    ? account.get('account_currency')
                                                    : me.upVM().get('currentCompany').get('default_currency'),
                                                account_currency: account ? account.get('account_currency') : null,
                                                from_exchange_rate: 1,
                                                to_exchange_rate: 1,
                                            });
                                        payment.set('kind', 'incoming');
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .addPayment(me, payment);
                                    },
                                },
                                {
                                    iconCls: 'md-icon-remove c-red',
                                    text: 'Outgoing payment',
                                    testId: 'paymentsGridOutgoingPaymentButton',
                                    handler: function (me) {
                                        let object_record = me.upVM().get('object_record'),
                                            account = me.upVM().get('account'),
                                            payment = Ext.create('Abraxa.model.payment.Payment', {
                                                owner_id: object_record.get('id'),
                                                owner_type: object_record.get('model_name'),
                                                account_id: account ? account.get('id') : null,
                                                org_id: account ? account.get('org_id') : null,
                                                org_name: account ? account.get('org_name') : null,
                                                currency: account
                                                    ? account.get('account_currency')
                                                    : me.upVM().get('currentCompany').get('default_currency'),
                                                account_currency: account ? account.get('account_currency') : null,
                                                from_exchange_rate: 1,
                                                to_exchange_rate: 1,
                                            });
                                        payment.set('kind', 'outgoing');
                                        Abraxa.getApplication()
                                            .getController('AbraxaController')
                                            .addPayment(me, payment);
                                    },
                                },
                            ],
                        },
                        listeners: {
                            tap: function () {
                                mixpanel.track('Payments (central) - button');
                            },
                        },
                    },
                    {
                        xtype: 'button',
                        text: 'Request payment',
                        testId: 'paymentsGridEmptyContainerRequestPaymentButton',
                        cls: 'a-no-content-btn',
                        iconCls: 'md-icon-add',
                        ui: 'normal-light medium',
                        hidden: true,
                        slug: 'portcallPayments',
                        bind: {
                            permission: '{userPermissions}',
                            cls: '{nonEditable ? "hidden a-no-content-btn":""}',
                            hidden: '{paymentsMenu.selection.tab == "requested_payments" ? false:true}',
                        },
                        handler: function (me) {
                            mixpanel.track('Request payment - button');
                            let object_record = me.upVM().get('object_record'),
                                account = me.upVM().get('account'),
                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                    owner_id: object_record.get('id'),
                                    owner_type: object_record.get('model_name'),
                                    account_id: account ? account.get('id') : null,
                                    org_id: account ? account.get('org_id') : null,
                                    org_name: account ? account.get('org_name') : null,
                                    currency: account
                                        ? account.get('account_currency')
                                        : me.upVM().get('currentCompany').get('default_currency'),
                                    account_currency: account ? account.get('account_currency') : null,
                                });
                            payment.set('kind', 'requested');
                            Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                        },
                    },
                ],
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    weighted: true,
    items: [
        {
            xtype: 'container',
            docked: 'top',
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
                            xtype: 'splitbutton',
                            text: 'Payment',
                            testId: 'paymentsGridPaymentSplitButton',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            hidden: false,
                            disabled: false,
                            slug: 'portcallPayments',
                            bind: {
                                cls: '{nonEditable ? "hidden a-no-content-btn":""}',
                                hidden: '{paymentsMenu.selection.tab == "transactions" ? false:true}',
                                disabled: '{accountMainCombo.selection ? false:true}',
                                permission: '{userPermissions}',
                            },
                            height: 30,
                            menu: {
                                cls: 'a-menu-badges',
                                items: [
                                    {
                                        text: 'Incoming payment',
                                        testId: 'paymentsGridSplitIncomingPaymentButton',
                                        iconCls: 'md-icon-add c-green-500',
                                        handler: function (me) {
                                            let object_record = me.upVM().get('object_record'),
                                                account = me.upVM().get('account'),
                                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                                    owner_id: object_record.get('id'),
                                                    owner_type: object_record.get('model_name'),
                                                    account_id: account ? account.get('id') : null,
                                                    org_id: account ? account.get('org_id') : null,
                                                    org_name: account ? account.get('org_name') : null,
                                                    currency: account
                                                        ? account.get('account_currency')
                                                        : me.upVM().get('currentCompany').get('default_currency'),
                                                    account_currency: account ? account.get('account_currency') : null,
                                                });
                                            payment.set('kind', 'incoming');
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .addPayment(me, payment);
                                        },
                                    },
                                    {
                                        text: 'Outgoing payment',
                                        testId: 'paymentsGridSplitOutgoingPaymentButton',
                                        iconCls: 'md-icon-remove c-red',
                                        handler: function (me) {
                                            let object_record = me.upVM().get('object_record'),
                                                account = me.upVM().get('account'),
                                                payment = Ext.create('Abraxa.model.payment.Payment', {
                                                    owner_id: object_record.get('id'),
                                                    owner_type: object_record.get('model_name'),
                                                    account_id: account ? account.get('id') : null,
                                                    org_id: account ? account.get('org_id') : null,
                                                    org_name: account ? account.get('org_name') : null,
                                                    currency: account
                                                        ? account.get('account_currency')
                                                        : me.upVM().get('currentCompany').get('default_currency'),
                                                    account_currency: account ? account.get('account_currency') : null,
                                                });
                                            payment.set('kind', 'outgoing');
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .addPayment(me, payment);
                                        },
                                    },
                                ],
                            },
                            handler: function (me) {
                                mixpanel.track('Payment - button');
                                me.showMenu();
                            },
                        },
                        {
                            xtype: 'button',
                            text: 'Request payment',
                            testId: 'paymentsGridRequestPaymentButton',
                            iconCls: 'md-icon-add',
                            ui: 'action small',
                            hidden: true,
                            slug: 'portcallPayments',
                            bind: {
                                permission: '{userPermissions}',
                                cls: '{nonEditable ? "hidden a-no-content-btn":""}',
                                hidden: '{paymentsMenu.selection.tab == "requested_payments" ? false:true}',
                            },
                            handler: function (me) {
                                mixpanel.track('Request payment - button');
                                let object_record = me.upVM().get('object_record'),
                                    account = me.upVM().get('account'),
                                    payment = Ext.create('Abraxa.model.payment.Payment', {
                                        owner_id: object_record.get('id'),
                                        owner_type: object_record.get('model_name'),
                                        account_id: account ? account.get('id') : null,
                                        org_id: account ? account.get('org_id') : null,
                                        org_name: account ? account.get('org_name') : null,
                                        currency: account
                                            ? account.get('account_currency')
                                            : me.upVM().get('currentCompany').get('default_currency'),
                                        account_currency: account ? account.get('account_currency') : null,
                                    });
                                payment.set('kind', 'requested');
                                Abraxa.getApplication().getController('AbraxaController').addPayment(me, payment);
                            },
                        },
                        {
                            flex: 1,
                        },
                        {
                            xtype: 'container',
                            // padding: '0 24',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-tools',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '0 0 0 8',
                                            ui: 'progress-light color-default small',
                                            iconCls: 'md-icon-outlined md-icon-info',
                                            cls: 'a-has-counter x-has-menu',
                                            testId: 'paymentsGridAgreementsMenuButton',
                                            hidden: true,
                                            bind: {
                                                text: 'Agreements <em>{accountAgreements.count}</em>',
                                                hidden: '{accountAgreements.count ? false:true}',
                                            },
                                            menu: {
                                                minWidth: '320',
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        testId: 'paymentsGridAgreementsMenuDiv',
                                                        cls: 'h5',
                                                        margin: '8 16',
                                                        bind: {
                                                            html: 'Agreements',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'agreements.list',
                                                        testId: 'paymentsGridAgreementsMenuList',
                                                        bind: {
                                                            store: '{accountAgreements}',
                                                        },
                                                    },
                                                ],
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
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: 'From/To',
            bind: {
                hidden: '{paymentsMenu.selection.tab == "transactions" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "transactions" ? true:false }',
            },
            dataIndex: 'updated_at',
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 1,
            minWidth: 220,
            renderer: function (val, record) {
                let type = record.get('kind'),
                    badge = type,
                    category = '',
                    icon = '';
                if (type == 'incoming') {
                    icon = '<i class="md-icon-outlined">add</i>';
                    val = record.get('from_org_name');
                    category = 'Payment from';
                } else if (type == 'outgoing') {
                    icon = '<i class="md-icon-outlined">remove</i>';
                    val = record.get('to_org_name');
                    category = 'Payment to';
                }
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-' +
                        badge +
                        '">' +
                        icon +
                        '</div><div class="ml-12 text-truncate"><div class="sm-title">' +
                        category +
                        '</div><div class="fw-b text-truncate">' +
                        val +
                        '</div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
            summaryRenderer: function (val) {
                return '';
            },
        },
        {
            text: 'From',
            hidden: true,
            bind: {
                hidden: '{paymentsMenu.selection.tab == "transactions" ? true:false }',
                hideable: '{paymentsMenu.selection.tab == "transactions" ? false:true }',
            },
            dataIndex: 'from_org_name',
            cls: 'a-column-offset-x24',
            cell: {
                cls: 'a-cell-offset-x24',
                encodeHtml: false,
            },
            flex: 1,
            minWidth: 220,
            renderer: function (val, record) {
                let type = record.get('kind'),
                    badge = type,
                    category = '',
                    tab = this.upVM().get('paymentsMenu.selection').get('tab'),
                    icon = '';

                switch (tab) {
                    case 'requested_payments':
                        if (type === 'requested') {
                            icon = '<i class="md-icon-outlined">inventory</i>';
                            category = 'Request from';
                        }
                        break;
                    case 'drafts':
                        if (type === 'incoming') {
                            category = 'Payment from';
                            icon = '<i class="md-icon-outlined">add</i>';
                        } else if (type === 'outgoing') {
                            val = record.get('to_org_name');
                            icon = '<i class="md-icon-outlined">remove</i>';
                            category = 'Payment to';
                        } else if (type === 'requested') {
                            icon = '<i class="md-icon-outlined">inventory</i>';
                            category = 'Request from';
                        }
                        break;

                    default:
                        break;
                }
                if (val) {
                    return (
                        '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-' +
                        badge +
                        '">' +
                        icon +
                        '</div><div class="ml-12 text-truncate"><div class="sm-title">' +
                        category +
                        '</div><div class="fw-b text-truncate">' +
                        val +
                        '</div></div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
            summaryRenderer: function (val) {
                return '';
            },
        },
        {
            text: 'Related object',
            minWidth: 220,
            dataIndex: 'paymentable_id',
            slug: 'portcallPaymentRelatedObject',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                encodeHtml: false,
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            renderer: function renderer(val, record) {
                if (val) {
                    let store = this.upVM().get('relatedObjects');
                    subObject = Ext.Array.filter(store, function (rec) {
                        return (
                            rec.get('id') == record.get('paymentable_id') &&
                            rec.get('model_name') == record.get('paymentable_type')
                        );
                    })[0];
                    if (subObject) {
                        return (
                            '<div class="hbox"><span class="file-icon-new file-icon-xs-new" data-type="pdf"></span>' +
                            '<span class="fw-b ml-12 text-truncate">' +
                            Ext.String.capitalize(subObject.get('name')) +
                            '</span></div>'
                        );
                    }
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
            summaryRenderer: function (val) {
                return '';
            },
        },
        {
            text: 'Date',
            minWidth: 160,
            dataIndex: 'payment_date',
            cell: {
                cls: 'a-cell-date a-br-100',
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                if (val) {
                    return (
                        '<span class="hbox"><i class="material-icons-outlined fs-18 c-light-grey mr-8">calendar_today</i>' +
                        moment(val).format(AbraxaConstants.formatters.date.dayMonthYearSlash) +
                        '</span>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
            bind: {
                summaryRenderer:
                    '{paymentsMenu.selection.tab == "transactions" ? "renderTransactions" : "renderRequestedPayments"}',
            },
        },
        {
            dataIndex: 'account_currency',
            text: 'Currency',
            minWidth: 100,
            sortable: false,
            menuDisabled: true,
            align: 'center',
            cell: {
                align: 'center',
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
            text: 'Incoming',
            minWidth: 120,
            bind: {
                hidden: '{paymentsMenu.selection.tab == "transactions" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "transactions" ? true:false }',
                permission: '{userPermissions}',
            },
            dataIndex: 'incoming_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            slug: 'portcallPaymentAmount',
            formatter: 'number("0,000.00")',
            summary: function (records) {
                let sum = 0;
                if (records) {
                    Ext.Array.each(records, function (rec) {
                        if (rec.get('kind') == 'incoming') {
                            sum += rec.get('calculated_amount');
                        }
                    });
                }
                return sum;
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount c-teal',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
        },
        {
            text: 'Req.Payment',
            minWidth: 120,
            bind: {
                hidden: '{paymentsMenu.selection.tab == "requested_payments" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "requested_payments" ? true:false }',
            },
            dataIndex: 'calculated_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            formatter: 'number("0,000.00")',
            summary: 'sum',
            cell: {
                encodeHtml: false,
                formatter: 'number("0,000.00")',
                align: 'right',
                cls: 'a-cell-amount a-final-da-cell a-br-100',
                zeroValue: '<span class="a-cell-placeholder">0,000.00</span>',
            },
        },
        {
            text: 'Amount',
            hidden: true,
            slug: 'portcallPaymentAmount',
            bind: {
                hidden: '{paymentsMenu.selection.tab == "drafts" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "drafts" ? true:false }',
                permission: '{userPermissions}',
            },
            dataIndex: 'calculated_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            minWidth: 120,
            formatter: 'number("0,000.00")',
            summary: 'sum',
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount a-final-da-cell a-br-100',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            renderer: function (value, record) {
                if (value) {
                    return value;
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Outgoing',
            dataIndex: 'outgoing_amount',
            sortable: false,
            menuDisabled: true,
            align: 'right',
            minWidth: 120,
            formatter: 'number("0,000.00")',
            summary: 'sum',
            bind: {
                hidden: '{paymentsMenu.selection.tab == "transactions" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "transactions" ? true:false }',
            },
            cell: {
                encodeHtml: false,
                align: 'right',
                cls: 'a-cell-amount c-red a-br-100',
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
        },
        {
            text: 'Type',
            minWidth: 160,
            dataIndex: 'type',
            cell: {
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                return (
                    '<div class="a-status-badge a-status-md status-' +
                    val +
                    '">' +
                    Ext.String.capitalize(val) +
                    '</div>'
                );
            },
        },
        {
            text: 'Last updated',
            flex: 1,
            sortable: false,
            menu: false,
            menuDisabled: true,
            minWidth: 220,
            hidden: false,
            hideable: false,
            bind: {
                hidden: '{paymentsMenu.selection.tab == "drafts" ? false:true }',
                hideable: '{paymentsMenu.selection.tab == "drafts" ? true:false }',
            },
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
            minWidth: 110,
            maxWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                xtype: 'widgetcell',
                cls: 'a-cell-more',
                hideMode: 'opacity',
                focusable: false,
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                widget: {
                    xtype: 'container',
                    padding: '0 12',
                    focusable: false,
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'end',
                    },
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 8 0 0',
                            iconCls: 'md-icon-more-horiz',
                            ui: 'tool-md round',
                            slug: 'portcall',
                            testId: 'paymentsGridMoreButton',
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
                                let record = this.upVM().get('record'),
                                    vm = this.up('grid').upVM();
                                Ext.create('Abraxa.view.portcall.payments.PaymentsEditMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            payment: record,
                                        },
                                    },
                                }).showBy(this);
                            },
                        },
                        {
                            xtype: 'button',
                            height: 30,
                            iconCls: 'md-icon-navigate-next',
                            ui: 'tool-sm round normal raised',
                            hidden: false,
                            testId: 'paymentsGridViewDetailsButton',
                            bind: {
                                hidden: '{paymentsMenu.selection.tab != "drafts" ? false : true}',
                            },
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
                                let record = this.upVM().get('record');
                                this.up('grid').select(record);
                            },
                        },
                    ],
                },
            },
        },
    ],
});
