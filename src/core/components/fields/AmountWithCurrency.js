Ext.define('Abraxa.core.components.fields.AmountWithCurrency', {
    extend: 'Ext.field.Container',
    xtype: 'abraxa.amountcurrency',
    classCls: Ext.baseCSSPrefix + 'amountcurrency',
    isField: true,
    config: {
        value: null,
        label: null,
        labelAlign: null,
        listeners: null,
        disabled: null,
        ui: null,
        amount: null,
        currency: null,
        cls: null,
        error: null,
    },
    publishes: ['currency', 'amount'],
    focusable: true,

    inputElement: {
        setStyle: function () {
            return false;
        },
    },
    initConfig: function (instanceConfig) {
        Ext.apply(instanceConfig, {
            items: [
                {
                    xtype: 'selectfield',
                    required: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                    submitValue: false,
                    width: 94,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                    cls: 'a-prepend',
                    valudeField: 'name',
                    displayField: 'name',
                    options: [
                        {
                            name: 'EUR',
                        },
                        {
                            name: 'USD',
                        },
                        {
                            name: 'GBP',
                        },
                    ],
                    listeners: {
                        focus: function () {
                            this.up('abraxa\\.amountcurrency').addCls('x-focused');
                            this.up('abraxa\\.amountcurrency').focus();
                        },
                        blur: function () {
                            this.up('abraxa\\.amountcurrency').removeCls('x-focused');
                            this.up('abraxa\\.amountcurrency').down('abraxa\\.numberfield').focus();
                        },
                    },
                },
                {
                    xtype: 'abraxa.numberfield',
                    allowBlank: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                    submitValue: false,
                    flex: 1,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    cls: 'a-append',
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                },
            ],
        });

        this.callParent(arguments);
    },

    getRawValue: function () {
        return this.getDateTime();
    },

    setDisabled: function (value) {
        var currencyField = this.getAt(0);
        var amountField = this.getAt(1);

        currencyField.setDisabled(value);
        amountField.setDisabled(value);
    },

    setCurrency: function (value) {
        var currencyField = this.getAt(0);

        currencyField.setValue(value);

        return value;
    },

    setAmount: function (value) {
        var amountField = this.getAt(1);

        amountField.setValue(value);

        return value;
    },

    applyCurrency: function (value) {
        var currencyField = this.getAt(0);

        currencyField.setValue(value);

        return value;
    },

    applyAmount: function (value) {
        var amountField = this.getAt(1);

        amountField.setValue(value);

        return value;
    },

    getCurrency: function (value) {
        return this.getValue();
    },

    getAmount: function (value) {
        return this.getValue();
    },

    // getValue: function () {
    //     var dateField = this.getAt(0);
    //     var timeField = this.getAt(1);

    //     var date = dateField.getValue();
    //     if (date) {
    //         date = this.setTimePart(date, timeField.getValue());
    //     }

    //     return (date);
    // },

    clearValue: function () {
        var currencyField = this.getAt(0);
        var amountField = this.getAt(1);
        currencyField.clearValue();
        amountField.clearValue();
        this.setCurrency(null);
        this.setAmount(null);
    },

    setValue: function (value) {
        this.callParent(arguments);
    },

    setError: function (error) {
        this.error = error;
        this.setErrorMessage(error);
    },
});
