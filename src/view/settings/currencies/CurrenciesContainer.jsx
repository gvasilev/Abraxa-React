import './CurrenciesGrid';

Ext.define('Abraxa.view.settings.currencies.CurrenciesContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.currencies.currencies.container',
    testId: 'settingsCurrenciesCont',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Manage currencies</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">If you do business in multiple currencies, you can add currencies to your account and set an exchange rate compared to your base company currency to more accurately track the amount of your deals.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-bordered-list w-50',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-list-titles',
                                            html: '<div class="flex-1">Base currency</div><div class="text-right">Format</div>',
                                        },
                                        {
                                            xtype: 'container',
                                            layout: 'hbox',
                                            minHeight: 56,
                                            cls: 'a-list-item a-bb-0',
                                            items: [
                                                {
                                                    xtype: 'div',
                                                    flex: 1,
                                                    cls: 'a-list-values',
                                                    bind: {
                                                        html: '<div class="flex-1 hbox"><img src="https://static.abraxa.com/flags/1x1/{currentCompany.default_currency:substr(0, 2):lowercase()}.svg" alt="" class="a-flag-x32 a-flag-outlined a-img-round" /><span class="fs-16 ml-16"><b class="c-teal d-inline-flex align-items-center">{currentCompany.default_currency}<i class="md-icon c-teal ml-8 fs-18">check</i></b></span></div><div class="text-right"><b>{currentCompany.default_currency}</b> 123,456.78</div>',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'button',
                                    text: 'Currency',
                                    testId: 'settingsCurrenciesAddCurrencySmallBtn',
                                    ui: 'action small',
                                    iconCls: 'md-icon-add',
                                    slug: 'settingsCurrencyCreate',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (btn, e) {
                                        mixpanel.track('Currency - button');
                                        Ext.create('Abraxa.view.settings.currencies.AddCurrency', {
                                            viewModel: {
                                                parent: btn.upVM(),
                                                data: {
                                                    editMode: false,
                                                    currency: Ext.create(
                                                        'Abraxa.model.settings.company.CompanyCurrency',
                                                        {
                                                            company_id: btn.upVM().get('currentCompany').get('id'),
                                                            base_currency: btn
                                                                .upVM()
                                                                .get('currentCompany')
                                                                .get('default_currency'),
                                                        }
                                                    ),
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'settings.currencies.grid',
                            showNoPermissions: true,
                            skipEditPermission: true,
                            slug: 'settingsCurrency',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
