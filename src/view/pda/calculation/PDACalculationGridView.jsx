import './PDACalculationItemsGrid';
import '../../portcall/agent/accounts/AgreementsList';

Ext.define('Abraxa.view.pda.calculation.PDACalculationGridView', {
    extend: 'Ext.Container',
    xtype: 'pda.calculation.items',
    itemId: 'pdaCalculationGridView',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    bind: {
        cls: 'a-bgr-white no-shadow',
    },
    viewModel: {
        data: {
            selectedCurrency: null,
            exchangeRate: null,
            pdaOriginExchangeRate: null,
        },
        formulas: {
            currency: function (get) {
                return get('pda.currency');
            },
            setExchangeRate: function (get) {
                if (!get('pdaOriginExchangeRate')) {
                    this.set('pdaOriginExchangeRate', get('pda.exchange_rate'));
                    this.set({ exchangeRate: get('pda.exchange_rate') });
                } else {
                    this.set({ exchangeRate: get('pdaOriginExchangeRate') });
                }
            },
            menuButtonFormatROE: function (get) {
                return Abraxa.utils.Functions.formatROE(get('pdaOriginExchangeRate'));
            },
        },
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
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
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function (me) {
                                Ext.getCmp('main-viewport')
                                    .getController()
                                    .redirectTo('inquiry/' + me.upVM().get('object_record').get('id'));
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-container-title',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    margin: '0 12 0 0',
                                    bind: {
                                        html: '<span class="file-icon-badge file-icon-x32" data-type="pda" data-icon="money"></span>',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '<div><div class="fw-b">{pda.name}</div><div class="sm-title">{pda.group_id}</div></div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            subObject: 'disbursements',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                objectPermission: '{objectPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 16',
                                    ui: 'status-md default',
                                    bind: {
                                        cls: 'status-{pda.status}',
                                        text: '{pda.status:capitalize}',
                                        permission: '{userPermissions}',
                                    },
                                    menu: {
                                        defaults: {
                                            handler: function (me) {
                                                let selection = me.upVM().get('pda'),
                                                    object_record = me.upVM().get('object_record'),
                                                    calculation = me.upVM().get('calculation');

                                                if (selection) {
                                                    selection.set('status', me.value);
                                                }
                                                if (selection.dirty) {
                                                    selection.save({
                                                        success: function () {
                                                            Abraxa.utils.Functions.updateInquiry(object_record);
                                                            Ext.toast('Record updated', 1000);
                                                        },
                                                    });
                                                }
                                            },
                                        },
                                        items: [
                                            {
                                                text: 'Draft',
                                                value: 'draft',
                                                bind: {
                                                    disabled: '{selectedDisbursement.status == "draft" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Under Review',
                                                value: 'under review',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "under review" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Submitted',
                                                value: 'submitted',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "submitted" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Pending approval',
                                                value: 'pending approval',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "pending approval" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Changes requested',
                                                value: 'changes requested',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "changes requested" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Approved',
                                                value: 'approved',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "approved" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Completed',
                                                value: 'completed',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "completed" ? true : false}',
                                                },
                                            },
                                            {
                                                text: 'Canceled',
                                                value: 'canceled',
                                                bind: {
                                                    disabled:
                                                        '{selectedDisbursement.status == "canceled" ? true : false}',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            hidden: true,
                            margin: '0 16',
                            bind: {
                                html: '<div class="a-status-badge status-xl status-{pda.status}">{pda.status:capitalize}</div>',
                                hidden: '{!nonEditable}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 16',
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
                                    testId: 'pdaCalculationGridViewChageCurrencyButton',
                                    ui: 'bgr-light-grey completed-light color-default small',
                                    iconCls: 'md-icon-outlined md-icon-currency-exchange md-icon-color-green',
                                    bind: {
                                        text: '<span class="mr-16">{currencyData.port_currency}/{currencyData.offer_currency}</span> {menuButtonFormatROE}',
                                        disabled: '{pda.status !="draft" || nonEditable}',
                                    },
                                    menu: {
                                        width: '320',
                                        cls: 'a-menu-currency',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                bind: {
                                                    html: 'Change currency',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '0 16 16',
                                                items: [
                                                    {
                                                        xtype: 'common-combo-currency',
                                                        testId: 'pdaCalculationGridViewCurrencyCombo',
                                                        labelAlign: 'left',
                                                        label: 'Currency',
                                                        ui: 'classic hovered-border',
                                                        required: true,
                                                        cls: 'a-field-icon icon-money icon-rounded',
                                                        bind: {
                                                            value: '{currency}',
                                                        },
                                                        floatedPicker: {
                                                            listeners: {
                                                                select: function (me, record) {
                                                                    let pda = me.upVM().get('pda'),
                                                                        currency = record.get('currency'),
                                                                        portCurrency = me
                                                                            .upVM()
                                                                            .get('currencyData.port_currency');
                                                                    me.upVM().set({
                                                                        selectedCurrency: currency,
                                                                    });
                                                                    const applyButton = this.up('container')
                                                                        .up()
                                                                        .down('#applyButton');
                                                                    applyButton.setDisabled(true);
                                                                    if (currency === portCurrency) {
                                                                        applyButton.setDisabled(false);
                                                                        me.upVM().set({
                                                                            exchangeRate: 1,
                                                                        });
                                                                    } else {
                                                                        Abraxa.getApplication()
                                                                            .getController('AbraxaController')
                                                                            .getExchange(portCurrency, currency)
                                                                            .then(function (response) {
                                                                                if (response && response.length) {
                                                                                    applyButton.setDisabled(false);
                                                                                    me.upVM().set({
                                                                                        exchangeRate:
                                                                                            response[0].exchange_rate,
                                                                                    });
                                                                                }
                                                                            });
                                                                    }
                                                                },
                                                            },
                                                        },
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        margin: '2 0 0 0',
                                                        padding: '0 0 2 0',
                                                        defaults: {
                                                            labelAlign: 'left',
                                                            ui: 'classic hovered-border',
                                                        },
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'abraxa.currency.field',
                                                                flex: 1,
                                                                label: 'Exchange rate',
                                                                placeholder: '0,000.00',
                                                                cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                                                                required: false,
                                                                bind: {
                                                                    value: '{exchangeRate}',
                                                                    required: '{currencyData ? true:false}',
                                                                },
                                                                listeners: {
                                                                    change: function (me, newValue, oldValue) {
                                                                        const applyButton = this.up('container')
                                                                            .up()
                                                                            .up()
                                                                            .down('#applyButton');
                                                                        if (
                                                                            newValue &&
                                                                            oldValue &&
                                                                            oldValue.toFixed(100) !==
                                                                                newValue.toFixed(100)
                                                                        ) {
                                                                            applyButton.setDisabled(false);
                                                                        }
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'div',
                                                                cls: 'c-light-grey',
                                                                margin: '0 8',
                                                                bind: {
                                                                    html: '{currencyData.port_currency}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'container',
                                                padding: '8 16',
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'end',
                                                },
                                                subObject: 'disbursements',
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        itemId: 'applyButton',
                                                        testId: 'pdaCalculationGridViewApplyButton',
                                                        ui: 'small action',
                                                        text: 'Apply',
                                                        bind: {
                                                            disabled: '{!(selectedCurrency || pda.dirty)}',
                                                        },
                                                        handler: function (me) {
                                                            const menuButton = me.up('menu').up('button');
                                                            const pdaCalculationItemsVm = me
                                                                .up('pda\\.calculation\\.items')
                                                                .getViewModel();
                                                            const vm = this.upVM();
                                                            const pda = vm.get('pda');
                                                            const object_record = vm.get('object_record');
                                                            const services = this.upVM().get('calculationServices');
                                                            const selectedCurrency =
                                                                pdaCalculationItemsVm.get('selectedCurrency');
                                                            const exchangeRate =
                                                                pdaCalculationItemsVm.get('exchangeRate');
                                                            const tempOrigExchangeRate =
                                                                vm.get('pdaOriginExchangeRate');
                                                            me.up('menu').hide();
                                                            menuButton.setDisabled(true);
                                                            if (selectedCurrency) {
                                                                pda.set({
                                                                    currency: selectedCurrency,
                                                                    exchange_rate: exchangeRate,
                                                                });
                                                            }

                                                            vm.set(
                                                                'pdaOriginExchangeRate',
                                                                Abraxa.utils.Functions.formatROE(exchangeRate)
                                                            );
                                                            pda.save({
                                                                success: function (record, operation) {
                                                                    services.each(function (service) {
                                                                        service.dirty = true;
                                                                        service.set('exchange_rate', exchangeRate);
                                                                    });
                                                                    services.sync();

                                                                    Ext.toast('Record updated');
                                                                    Abraxa.utils.Functions.updateInquiry(object_record);
                                                                    pda.load();
                                                                },
                                                                failure: function (record, operation) {
                                                                    vm.set(
                                                                        'pdaOriginExchangeRate',
                                                                        Abraxa.utils.Functions.formatROE(
                                                                            tempOrigExchangeRate
                                                                        )
                                                                    );
                                                                },
                                                                callback: function () {
                                                                    menuButton.setDisabled(false);
                                                                },
                                                            });
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                        listeners: {
                                            hide: function (me) {
                                                let pda = this.upVM().get('pda');
                                                pda.reject();
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'progress-light color-default small',
                                    iconCls: 'md-icon-outlined md-icon-info',
                                    cls: 'a-has-counter x-has-menu',
                                    hidden: true,
                                    bind: {
                                        hidden: '{pdaAgreements.count ? false : true}',
                                        text: 'Agreements <em>{pdaAgreements.count}</em>',
                                    },
                                    menu: {
                                        minWidth: '340',
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'h5',
                                                margin: '8 16',
                                                bind: {
                                                    html: 'Agreements',
                                                },
                                            },
                                            {
                                                xtype: 'agreements.list',
                                                bind: {
                                                    store: '{pdaAgreements}',
                                                },
                                            },
                                        ],
                                    },
                                    listeners: {
                                        tap: function () {
                                            mixpanel.track('Agreements (disb screen) - button');
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 16 0 24',
            minHeight: 64,
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            ui: 'action small',
                            iconCls: 'md-icon-add',
                            text: 'Item',
                            bind: {
                                disabled: '{(pda.status !="draft" || nonEditable) || isSyncingPdaGrid}',
                            },
                            handler: function (me) {
                                me.upVM().set('isSyncingPdaGrid', true);
                                let store = me.upVM().get('calculationServices'),
                                    pda = me.upVM().get('pda'),
                                    object_record = me.upVM().get('object_record'),
                                    record = Ext.create('Abraxa.model.calculation.CalculationService', {
                                        inquiry_offer_id: pda.get('id'),
                                        custom_amount: 0,
                                        exchange_rate: pda.get('exchange_rate'),
                                    });

                                store.add({ custom_amount: 0, exchange_rate: pda.get('exchange_rate') });
                                me.upVM().set('isSyncingPdaGrid', true);
                                store.sync({
                                    success: function (rec) {
                                        Ext.toast('Record updated');
                                        Abraxa.utils.Functions.updateInquiry(object_record);
                                        me.upVM().set('isSyncingPdaGrid', false);
                                    },
                                });
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'pda.dots.menu',
                            subObject: 'disbursements',
                        },
                    ],
                },
            ],
        },

        {
            xtype: 'pda.calculation.items.grid',
        },
        {
            xtype: 'container',
            cls: 'a-total-billed-docked',
            padding: '8 24',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    bind: {
                        html: '<div class="h5">Total billed</div><div class="a-billed-price"><span class="a-billed-currency">{selectedDisbursement.disbursement_currency}</span><span class="a-billed-amount">{totalFinal:number("0,000.00")}</span><i class="md-icon-outlined">info</i></div>',
                        tooltip: {
                            html:
                                '<div class="a-info-row"><label class="a-info-label">Discount:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b c-yellow">-{totalDiscount:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">VAT:</label><div class="a-info-data"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-b">{totalVAT:number("0,000.00")}</b></div></div>' +
                                '<div class="a-info-row"><label class="a-info-label">Final price:</label><div class="a-info-data a-bt-100 pt-8"><b class="c-light-grey">{selectedDisbursement.disbursement_currency}</b><b class="fw-700 fs-16 c-blue">{totalFinal:number("0,000.00")}</b></div></div>',
                            align: 'bc-tc?',
                            cls: 'a-tooltip-balance',
                            ui: 'info-card',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                            anchorToTarget: true,
                        },
                    },
                },
                {
                    xtype: 'div',
                    bind: {
                        html: '<div class="h5">Total disbursement costs</div><div class="a-billed-price"><span class="a-billed-currency">{pda.currency}</span><span class="a-billed-amount">{totalDisbursementCosts:number("0,000.00")}</span><i class="md-icon-outlined">info</i></div>',
                    },
                },
                {
                    flex: 1,
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            testId: 'previewButtonPdaCalculationGridView',
                            ui: 'action large',
                            text: 'Preview',
                            cls: 'no_show',
                            bind: {
                                disabled: '{isSyncingPdaGrid}',
                            },
                            handler: function (me) {
                                me.upVM().set('isSyncingPdaGrid', true);
                                const pdaCalculations = me.up('pda\\.calculation\\.items');

                                let pda = me.upVM().get('pda');
                                let vm = me.upVM();
                                let model = Ext.create('Abraxa.model.portcall.Attachment', {
                                        name: pda.get('name'),
                                        status: pda.get('status'),
                                        updated_at: pda.get('updated_at'),
                                        updated_by_user: pda.get('updated_by_user'),
                                        created_at: pda.get('created_at'),
                                        created_by_user: pda.get('updated_by_user'), // No created_by_user field in PDA
                                        size: pda.get('size') || '', // No size field in PDA
                                        pdf: true,
                                        id: 1001,
                                        extension: 'pdf',
                                        folder_file: null,
                                        is_locked: true,
                                        nonEditable: true,
                                        document: {
                                            extension: 'pdf',
                                            folder_file: null,
                                            name: pda.get('name'),
                                        },
                                    }),
                                    dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                        viewModel: {
                                            data: {
                                                documentForSelect: model,
                                                selectedDocuments: Ext.create('Ext.data.Store', {
                                                    data: [model],
                                                }),
                                                needsPanel: false,
                                                object_record: vm.get('object_record'),
                                                isReadOnly: true,
                                                previewOnly: true,
                                            },
                                            formulas: {
                                                selectedDocument: {
                                                    bind: {
                                                        bindTo: '{documentsList.selection}',
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                                loadDocument: {
                                                    bind: {
                                                        bindTo: '{selectedDocument.id}',
                                                    },
                                                    get: function (id) {
                                                        let record = this.get('selectedDocument');
                                                        if (record) {
                                                            var me = this;
                                                            let file = record,
                                                                pdf = record.get('pdf') ? true : false;

                                                            me.getView()
                                                                .getController()
                                                                .loadDocument(
                                                                    Env.ApiEndpoint +
                                                                        'pdf/generate/' +
                                                                        pda.get('id') +
                                                                        '/inquiryOffer'
                                                                );
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    });
                                dialog.on('destroy', (dialog) => {
                                    Ext.ComponentQuery.query('#pdaCalculationGridView')[0].upVM().set({
                                        isSyncingPdaGrid: false,
                                    });
                                });

                                dialog.show();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
