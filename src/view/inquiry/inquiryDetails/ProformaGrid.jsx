import './CreateProforma';

Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'proforma.grid',
    testId: 'proformaGrid',
    flex: 1,
    ui: 'bordered grid-lg',
    scrollable: true,
    itemId: 'offersGrid',
    cls: 'a-disbursements-grid a-offset-grid abraxa-grid',
    stateful: ['plugins', 'columns'],
    stateId: 'offersGrid-grid-state',
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
        store: '{offers}',
        hideHeaders: '{offers.count ? false : true}',
    },
    reference: 'offersGrid',
    scrollToTopOnRefresh: false,
    loadingText: false,
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            let record = this.upVM().get('offersGrid.selection'),
                grid = Ext.ComponentQuery.query('proforma\\.grid')[0];

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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9971 -18910)"><g transform="translate(9137 18565)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9830.64 18892.16)"><path d="M206.05,44.84H186.21a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5H186.18a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M205.01,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M190.432,83.667h15.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,83.667Z" fill="#c8d4e6"></path><path d="M190.432,91.187h5.695a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652h-5.695a1.651,1.651,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,190.432,91.187Z" fill="#c8d4e6"></path><path d="M190.432,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.652,1.652,0,0,1-1.652,1.652H190.432A1.651,1.651,0,0,1,188.78,77.8h0A1.652,1.652,0,0,1,190.432,76.147Z" fill="#c8d4e6"></path><path d="M225.295,84.971a15,15,0,1,0,15,15A15,15,0,0,0,225.295,84.971Zm2.115,24.135v2.865H223.4v-2.9c-2.565-.54-4.74-2.19-4.9-5.1h2.94c.15,1.575,1.23,2.805,3.975,2.805,2.94,0,3.6-1.47,3.6-2.385,0-1.245-.66-2.415-4.005-3.21-3.72-.9-6.27-2.43-6.27-5.5,0-2.58,2.085-4.26,4.665-4.815V87.971h4.005V90.9a5.3,5.3,0,0,1,4.275,5.085h-2.94c-.075-1.665-.96-2.805-3.33-2.805-2.25,0-3.6,1.02-3.6,2.46,0,1.26.975,2.085,4.005,2.865s6.27,2.085,6.27,5.865C232.075,107.111,230.02,108.611,227.41,109.106Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No proforma estimates available</div></div>',
            },
            {
                xtype: 'button',
                text: 'New estimate',
                testId: 'newEstimateProformaGridButton',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                // slug: 'cdbAgreementsDirectBillingCreate',
                bind: {
                    hidden: '{nonEditable}',
                },
                handler: function (me) {
                    let record = me.upVM().get('object_record'),
                        currentUser = me.upVM().get('currentUser'),
                        defaultCurrency = me.upVM().get('defaultCurrency');
                    Ext.create('Abraxa.view.inquiry.inquiryDetails.CreateProforma', {
                        viewModel: {
                            parent: me.upVM(),
                            stores: {
                                portStore: {
                                    source: '{selectedInquiry.ports}',
                                },
                                priceBooks: {
                                    type: 'inquiry.pricebooks',
                                    autoLoad: true,
                                    proxy: {
                                        extraParams: {
                                            port_id: '{offer.port_id}',
                                        },
                                    },
                                    updateProxy: function (proxy) {
                                        if (proxy) {
                                            proxy.onAfter(
                                                'extraparamschanged',
                                                function () {
                                                    if (this.getProxy().getExtraParams().port_id) this.load();
                                                },
                                                this
                                            );
                                        }
                                    },
                                },
                            },
                            data: {
                                selectedInquiry: record,
                                offer: Ext.create('Abraxa.model.inquiry.InquiryOffer', {
                                    name: 'Proforma DA',
                                    inquiry_id: record.get('id'),
                                    currency: record.get('currency'),
                                    port_id: record.ports().count() ? record.ports().first().get('id') : null,
                                    billing_party_id: record.get('requesting_party_id'),
                                    billing_party_name: record.get('requesting_party_name'),
                                }),
                            },
                            formulas: {
                                showExchangeRate: {
                                    bind: {
                                        port: '{estimatePortCombo.selection}',
                                        currency: '{currencyCombo.value}',
                                    },
                                    get: function (params) {
                                        let inquiryOffer = this.get('offer'),
                                            me = this;
                                        inquiryOffer.set('exchange_rate', 1);

                                        if (params.port && params.port.get('pc_configuration')) {
                                            let inquiryCurrency = params.currency,
                                                portCurrency = params.port.get('pc_configuration').currency,
                                                defaultCurrency = this.get('currentCompany').get('default_currency'),
                                                forexCurrencies = this.get('currencyRates'),
                                                exchangeRate = this.get('currentCompany')
                                                    .currencies()
                                                    .findRecord('currency', portCurrency)
                                                    .get('exchange_rate');

                                            if (inquiryCurrency !== portCurrency) {
                                                let data = {
                                                    port_currency: portCurrency,
                                                    inquiry_currency: inquiryCurrency,
                                                    exchange_rate: null,
                                                };
                                                if (inquiryCurrency === defaultCurrency) {
                                                    data.exchange_rate = 1 / exchangeRate;
                                                } else {
                                                    let forexRate = Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .getExchange(portCurrency, inquiryCurrency)
                                                        .then(function (response) {
                                                            if (response && response.length) {
                                                                inquiryOffer.set(
                                                                    'exchange_rate',
                                                                    response[0].exchange_rate
                                                                );
                                                            }
                                                        });

                                                    // data.exchange_rate = forexCurrencies
                                                    //     .findRecord('currency', inquiryCurrency)
                                                    //     .get('exchange_rate');
                                                }
                                                inquiryOffer.set('exchange_rate', data.exchange_rate);
                                                return data;
                                            }
                                            return false;
                                        }
                                    },
                                },
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
        height: 64,
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
            cls: 'a-bb-100',
            docked: 'top',
            height: 64,
            padding: '0 16 0 24',
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Estimate',
                    testId: 'createEstimateProformaGridButton',
                    iconCls: 'md-icon-add',
                    ui: 'action small',
                    height: 30,
                    // slug: 'cdbAgreementsDirectBillingCreate',
                    bind: {
                        hidden: '{nonEditable}',
                    },
                    handler: function (me) {
                        let record = me.upVM().get('object_record'),
                            currentUser = me.upVM().get('currentUser'),
                            defaultCurrency = me.upVM().get('defaultCurrency');
                        if (record) {
                            Ext.create('Abraxa.view.inquiry.inquiryDetails.CreateProforma', {
                                viewModel: {
                                    parent: me.upVM(),
                                    stores: {
                                        portStore: {
                                            source: '{selectedInquiry.ports}',
                                        },
                                        priceBooks: {
                                            type: 'inquiry.pricebooks',
                                            autoLoad: true,
                                            proxy: {
                                                extraParams: {
                                                    port_id: '{offer.port_id}',
                                                },
                                            },
                                            updateProxy: function (proxy) {
                                                if (proxy) {
                                                    proxy.onAfter(
                                                        'extraparamschanged',
                                                        function () {
                                                            if (this.getProxy().getExtraParams().port_id) this.load();
                                                        },
                                                        this
                                                    );
                                                }
                                            },
                                        },
                                    },
                                    data: {
                                        selectedInquiry: record,
                                        offer: Ext.create('Abraxa.model.inquiry.InquiryOffer', {
                                            name: 'Proforma DA',
                                            inquiry_id: record.get('id'),
                                            currency: record.get('currency'),
                                            port_id: record.ports().count() ? record.ports().first().get('id') : null,
                                            billing_party_id: record.get('requesting_party_id'),
                                            billing_party_name: record.get('requesting_party_name'),
                                        }),
                                    },
                                    formulas: {
                                        showExchangeRate: {
                                            bind: {
                                                port: '{estimatePortCombo.selection}',
                                                currency: '{currencyCombo.value}',
                                            },
                                            get: function (params) {
                                                let inquiryOffer = this.get('offer'),
                                                    me = this;
                                                inquiryOffer.set('exchange_rate', 1);

                                                if (params.port && params.port.get('pc_configuration')) {
                                                    let inquiryCurrency = params.currency,
                                                        portCurrency = params.port.get('pc_configuration').currency,
                                                        defaultCurrency =
                                                            this.get('currentCompany').get('default_currency'),
                                                        forexCurrencies = this.get('currencyRates'),
                                                        exchangeRate = this.get('currentCompany')
                                                            .currencies()
                                                            .findRecord('currency', portCurrency)
                                                            .get('exchange_rate');

                                                    if (inquiryCurrency !== portCurrency) {
                                                        let data = {
                                                            port_currency: portCurrency,
                                                            inquiry_currency: inquiryCurrency,
                                                            exchange_rate: null,
                                                        };
                                                        if (inquiryCurrency === defaultCurrency) {
                                                            data.exchange_rate = 1 / exchangeRate;
                                                        } else {
                                                            let forexRate = Abraxa.getApplication()
                                                                .getController('AbraxaController')
                                                                .getExchange(portCurrency, inquiryCurrency)
                                                                .then(function (response) {
                                                                    if (response && response.length) {
                                                                        inquiryOffer.set(
                                                                            'exchange_rate',
                                                                            response[0].exchange_rate
                                                                        );
                                                                    }
                                                                });

                                                            // data.exchange_rate = forexCurrencies
                                                            //     .findRecord('currency', inquiryCurrency)
                                                            //     .get('exchange_rate');
                                                        }
                                                        inquiryOffer.set('exchange_rate', data.exchange_rate);
                                                        return data;
                                                    }
                                                    return false;
                                                }
                                            },
                                        },
                                    },
                                },
                            }).show();
                        }
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
                                hidden: '{offers.count ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-send',
                                    text: 'Send via Email',
                                    testId: 'sendViaEmailProformaGridButton',
                                    hidden: true,
                                    showAnimation: 'fade',
                                    bind: {
                                        hidden: '{offersGrid.selection ? false : true}',
                                        disabled: '{nonEditable}',
                                    },
                                    margin: '0 0 0 8',
                                    handler: function (me) {
                                        let inquiryVM = me.upVM(),
                                            companyVerified = me.upVM().get('currentCompany').get('verified'),
                                            grid = this.up('grid'),
                                            selectedEstimates = grid.getSelections(),
                                            attachments = [];

                                        Ext.each(selectedEstimates, function (estimate) {
                                            attachments.push({
                                                name: estimate.get('name'),
                                                extension: 'pdf',
                                                object_id: 6,
                                                object_meta_id: me.upVM().get('object_record').get('id'),
                                                nonEditable: true,
                                                shouldGenerate: true,
                                                modelType: 'inquiryOffer',
                                                modelId: estimate.get('id'),
                                            });
                                        });

                                        mixpanel.track('Report button (main header)');

                                        Ext.create('Abraxa.view.mail.Sendmail', {
                                            viewModel: {
                                                parent: inquiryVM,
                                                data: {
                                                    object_record: me.upVM().get('object_record'),
                                                    object_id: 6,
                                                    object_meta_id: me.upVM().get('object_record').get('id'),
                                                    currentUser: me.upVM().get('currentUser'),
                                                    signature: me.upVM().get('currentUser').get('signature')
                                                        ? me.upVM().get('currentUser.signature.signature')
                                                        : '',
                                                    companyVerified: companyVerified,
                                                },
                                                stores: {
                                                    attachments: Ext.create('Ext.data.Store', {
                                                        proxy: {
                                                            type: 'memory',
                                                        },
                                                        data: attachments,
                                                    }),
                                                    // mailTemplates: {
                                                    //     type: 'mail.templates',
                                                    //     autoLoad: true,
                                                    //     proxy: {
                                                    //         extraParams: {
                                                    //             object_id: 3,
                                                    //             object_meta_id: me.upVM().get('object_record').get('id')
                                                    //         }
                                                    //     },
                                                    //     updateProxy: function (proxy) {
                                                    //         if (proxy) {
                                                    //             proxy.onAfter('extraparamschanged', this.load, this);
                                                    //         }
                                                    //     }
                                                    // },
                                                    documentsForAmail: {
                                                        source: '{object_record.documents}',
                                                    },
                                                },
                                                formulas: {
                                                    emailSettings: {
                                                        bind: {
                                                            bindTo: '{currentUser}',
                                                            deep: true,
                                                        },
                                                        get: function (user) {
                                                            let emails = [];
                                                            if (user) {
                                                                if (user.get('current_office_id')) {
                                                                    let officeEmails = user.getOffice().emails();
                                                                    Ext.Array.each(
                                                                        officeEmails.getData().items,
                                                                        function (email) {
                                                                            let emailModel = email.get('email');
                                                                            emailModel.is_default =
                                                                                email.get('is_default');
                                                                            emails.push(emailModel);
                                                                        }
                                                                    );
                                                                } else {
                                                                    let company = this.get('currentCompany');
                                                                    let officeEmails = company.get('email_settings');
                                                                    Ext.Array.each(officeEmails, function (email) {
                                                                        emails.push(email);
                                                                    });
                                                                }
                                                            }
                                                            return emails;
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
                            xtype: 'container',
                            padding: '0 8 0 0',
                            layout: 'hbox',
                            hidden: true,
                            showAnimation: 'fade',
                            bind: {
                                hidden: '{offersGrid.selection ? false : true}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    text: 'Delete',
                                    testId: 'deleteProformaGridButton',
                                    // slug: 'cdbAgreementsDirectBillingDelete',
                                    bind: {
                                        disabled: '{nonEditable}',
                                    },
                                    handler: function (me) {
                                        let grid = this.up('grid'),
                                            vm = this.upVM(),
                                            offers = vm.get('offers'),
                                            selections = grid.getSelections();

                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Do you want to delete this estimate?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    Ext.each(selections, function (rec, index) {
                                                        offers.remove(rec);
                                                    });
                                                    offers.sync({
                                                        success: function (err, msg) {
                                                            Ext.toast('Record updated', 1000);
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
                                                    testId: 'deleteProformaGridButtonCancel',
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'yes',
                                                    ui: 'decline alt',
                                                    text: 'Delete',
                                                    testId: 'deleteProformaGridButtonDelete',
                                                },
                                            ]
                                        );
                                    },
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
            text: 'Proforma',
            dataIndex: 'name',
            cell: {
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.proforma_link',
                        fn: function fn() {
                            let record = this.component.getRecord(),
                                object_record = this.component.up('grid').upVM().get('object_record');
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('inquiry/' + object_record.get('id') + '/pda/' + record.get('id'));
                        },
                    },
                },
            },
            flex: 1,
            renderer: function (val, record) {
                const calculationId = record.get('pc_calculation_id') ? 1 : 0;
                if (val) {
                    // return '<div class="hbox"><div class="a-badge a-badge-billing"><i class="md-icon-outlined">account_balance_wallet</i></div><div class="ml-12"><div class="text-truncate fw-b">' + val + '</div></div></div>';
                    return (
                        `<div data-calculationId=${calculationId} class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="pda" data-icon="money"></span><div class="ml-12 text-truncate"><a class="fw-b cursor-pointer proforma_link" href="javascript:void(0);">` +
                        val +
                        '</a><div class="sm-title text-truncate">' +
                        record.get('group_id') +
                        '</div></div></div>'
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            text: 'Currency',
            dataIndex: 'currency',
            minWidth: 100,
            cls: 'a-column-bl',
            cell: {
                cls: 'a-cell-bl text-center',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return value;
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
        {
            text: 'Total',
            dataIndex: 'total_costs',
            cls: 'a-column-bordered',
            align: 'right',
            minWidth: 140,
            align: 'right',
            cell: {
                cls: 'a-cell-bordered fw-b',
                encodeHtml: false,
                zeroValue: '<span class="a-cell-placeholder">---</span>',
            },
            formatter: 'number("0,000.00")',
        },
        {
            dataIndex: 'status',
            minWidth: 180,
            text: 'Status',
            cell: {
                cls: 'expand',
                bodyCls: 'a-cell-status',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record.get('status')) {
                    return (
                        '<div class="a-status-badge a-status-md status-' +
                        record.get('status') +
                        '"><span class="text-truncate">' +
                        Ext.String.capitalize(record.get('status')) +
                        '</span></div>'
                    );
                } else {
                    return '';
                }
            },
        },
        {
            text: 'Updated by',
            minWidth: 220,
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
            sorter: {
                sorterFn: function (o1, o2) {
                    var v1 = o1.data.updated_at,
                        v2 = o2.data.updated_at;
                    return v1 > v2 ? -1 : v1 < v2 ? 1 : 0;
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            maxWidth: 110,
            // flex: 1,
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
                bind: {
                    hidden: '{nonEditable}',
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
                            Ext.create('Abraxa.view.inquiry.inquiryDetails.ProformaEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        offer: record,
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
        childdoubletap: function (grid, location, eOpts) {
            Ext.getCmp('main-viewport').setMasked({
                xtype: 'viewport.mask',
            });
            let record = location.record;
            let object_record = grid.upVM().get('object_record');
            if (record) {
                // location.grid.deslectAll();
                // mixpanel.track(
                //     "Double click on grid active portcall"
                // );
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('inquiry/' + object_record.get('id') + '/pda/' + record.get('id'));

                grid.deselectAll();
            }
        },
    },
});
