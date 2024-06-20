Ext.define('Abraxa.view.settings.currencies.AddCurrency', {
    xtype: 'settings.currencies.add.currency',
    testId: 'settingsAddCurrency',
    extend: 'Ext.Dialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    bind: {
        title: '<div class="a-badge a-badge-currency"><i class="md-icon-outlined">currency_exchange</i></div>{editMode ? "Update exchange rate":"Add currency"}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 480,
    minHeight: 280,
    padding: '0 24 0 72',
    controller: 'company.controller',
    items: [
        {
            xtype: 'form.error',
            testId: 'settingsAddCurrencyFormErr',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            testId: 'settingsAddCurrencyForm',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'pb-16 mb-8 a-bb-100',
                    hidden: true,
                    bind: {
                        hidden: '{editMode ? false : true}',
                        html: '<div class="hbox a_grid_action"><div class="mini-icon hbox" data-flag="{currency}"><img src="https://static.abraxa.com/flags/1x1/{currency.currency:substr(0, 2):lowercase()}.svg" class="a-flag-x32 a-flag-outlined a-img-round" /></div><div class="ml-16"><div class="text-truncate fw-b c-blue">{currency.currency}</div><div class="sm-title text-truncate">{currency.description}</div></div>',
                    },
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'common-combo-currency',
                            label: 'Currency',
                            testId: 'settingsAddCurrencyChooseCurrencyField',
                            placeholder: 'Choose currency',
                            forceSelection: true,
                            required: true,
                            labelAlign: 'left',
                            cls: 'a-field-icon icon-rounded icon-money',
                            ui: 'classic hovered-border',
                            bind: {
                                value: '{currency.currency}',
                                hidden: '{editMode ? true:false}',
                                store: '{currencyRateStore}',
                            },
                            listeners: {
                                beforequery: function () {
                                    let store = this.getStore(),
                                        mainCurrency = this.upVM().get('currentCompany').get('default_currency');

                                    store.filter({
                                        filterFn: function (rec) {
                                            if (rec.get('currency') != mainCurrency) return rec;
                                        },
                                    });
                                },
                                select: function (me, selection) {
                                    let editMode = me.upVM().get('editMode');

                                    if (selection && !editMode) {
                                        me.upVM().get('currency').set('exchange_rate', selection.get('exchange_rate'));
                                        me.upVM().get('currency').set('description', selection.get('description'));
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'abraxa.currency.field',
                            label: 'Exchange rate',
                            testId: 'settingsAddCurrencyExchangeRateField',
                            placeholder: '0.0000',
                            clearable: false,
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-rounded icon-exchange',
                            required: true,
                            flex: 1,
                            bind: {
                                value: '{currency.exchange_rate}',
                            },
                            validators: function (val) {
                                if (val == 0) {
                                    return 'Exchange rate cannot be zero';
                                }
                                return true;
                            },
                            listeners: {
                                painted: function (me) {
                                    me.setError(null);
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '8 0 0 0',
                    padding: '16 0 0 0',
                    cls: 'a-bt-100',
                    bind: {
                        hidden: '{currency.currency ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'c-light-grey',
                            bind: {
                                html: '1.000 {currentCompany.default_currency} = {currency.exchange_rate} {currency.currency}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                testId: 'settingsAddCurrencyCancelBtn',
                margin: '0 8 0 0',
                handler: function () {
                    // this.upVM().get('currencies').rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                testId: 'settingsAddCurrencySaveBtn',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                },
                handler: function (btn, e, eOpts) {
                    let vm = btn.upVM(),
                        dialog = btn.up('dialog'),
                        store = vm.get('currencies'),
                        record = vm.get('currency'),
                        editMode = vm.get('editMode'),
                        form = dialog.down('formpanel');
                    if (form.validate()) {
                        store.add(record);
                        store.sync({
                            success: function (batch, opt) {
                                Ext.toast('Record created', 1000);
                                store.reload();
                                mixpanel.track('Add currency - button');
                                dialog.destroy();
                            },
                        });
                    } else {
                        btn.toggle();
                        dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                    }
                },
            },
        ],
    },
    listeners: {
        destroy: function (dialog) {
            dialog.upVM().get('currencyRateStore').clearFilter();
        },
    },
});
