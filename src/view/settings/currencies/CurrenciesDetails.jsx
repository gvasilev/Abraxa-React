import './CurrenciesHistoricalGrid';
import '../../../store/settings/HistoricalRates';

Ext.define('Abraxa.view.settings.currencies.CurrenciesDetails', {
    extend: 'Ext.Container',
    xtype: 'settings.currencies.details',
    hidden: true,
    scrollable: true,
    margin: 0,
    flex: 1,
    itemId: 'currenciesDetalsContainer',
    cls: 'a-settings-main role_settings needs_hide',
    layout: {
        type: 'vbox',
    },
    viewModel: {
        stores: {
            historicalRates: {
                type: 'historical.rates',
                autoLoad: true,
                proxy: {
                    extraParams: {
                        company_id: '{currenciessGrid.selection.company_id}',
                        currency: '{currenciessGrid.selection.currency}',
                    },
                },
                updateProxy: function (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function () {
                                if (this.getProxy().getExtraParams().currency) this.load();
                            },
                            this
                        );
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">{currenciessGrid.selection.currency}</span></div><div class="sm-title">{currenciessGrid.selection.description}</div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    ui: 'round default',
                    handler: function () {
                        let upContainer = Ext.ComponentQuery.query('[itemId=currenciesMainContainer]')[0],
                            downContainer = Ext.ComponentQuery.query('[itemId=currenciesDetalsContainer]')[0];
                        downContainer.setHidden(true);
                        upContainer.setHidden(false);
                    },
                },
            ],
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Historical exchange rates</h1>',
                },
                {
                    xtype: 'div',
                    cls: 'w-50',
                    html: '<p class="text-info">Keep track of your historical rates for each individual currency.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0',
                    html: '<hr>',
                },
            ],
        },
        {
            xtype: 'settings.currencies.historical.grid',
        },
    ],
});
