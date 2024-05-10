Ext.define('Abraxa.core.components.fields.QuantityUnitField', {
    extend: 'Ext.field.Container',
    xtype: 'abraxa.quantityunit',
    classCls: Ext.baseCSSPrefix + 'quantityunit',
    isField: true,
    config: {
        value: null,
        label: null,
        labelAlign: null,
        listeners: null,
        disabled: null,
        ui: null,
        quantity: null,
        unit: null,
        cls: null,
        error: null,
        quantityFieldMaxWidth: null,
        unitFieldMaxWidth: null,
        options: null,
        readOnlyUnit: null,
        // options: ["mts", "cbm", "cbft", "units", "Kilograms"],
    },
    publishes: ['quantity', 'unit'],
    focusable: true,

    twoWayBindable: {
        quantity: true,
        unit: true,
    },

    inputElement: {
        setStyle: function () {
            return false;
        },
    },
    initConfig: function (instanceConfig) {
        Ext.apply(instanceConfig, {
            items: [
                {
                    xtype: 'abraxa.numberfield',
                    required: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                    submitValue: false,
                    flex: 1,
                    maxWidth: Ext.isDefined(instanceConfig.quantityFieldMaxWidth)
                        ? instanceConfig.quantityFieldMaxWidth
                        : null,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                    cls: 'a-prepend',
                    value: instanceConfig.quantity,
                    unit: instanceConfig.unit,
                    quantity: instanceConfig.quantity,
                    listeners: {
                        change: function (me, newValue, oldValue) {
                            this.up('abraxa\\.quantityunit').setQuantity(newValue);
                            this.up('abraxa\\.quantityunit').fireEvent('change', me, newValue, oldValue);
                        },
                        focus: function () {
                            this.up('abraxa\\.quantityunit').addCls('x-focused');
                            this.up('abraxa\\.quantityunit').focus();
                        },
                        blur: function () {
                            this.up('abraxa\\.quantityunit').removeCls('x-focused');
                            // this.up('abraxa\\.quantityunit').down('combobox').focus();
                        },
                    },
                },
                {
                    xtype: 'combobox',
                    allowBlank: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                    submitValue: false,
                    valueField: 'name',
                    displayField: 'name',
                    queryMode: 'local',
                    placeholder: AbraxaConstants.placeholders.emptyValue,
                    width: 80,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    maxWidth: Ext.isDefined(instanceConfig.unitFieldMaxWidth) ? instanceConfig.unitFieldMaxWidth : null,
                    cls: 'a-append',
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                    store: instanceConfig.options,
                    value: Ext.isDefined(instanceConfig.unit) ? instanceConfig.unit : null,
                    floatedPicker: {
                        cls: Ext.isDefined(instanceConfig.floatedPicker) ? instanceConfig.floatedPicker.cls : null,
                    },
                    listeners: {
                        change: function (me, newValue, oldValue) {
                            this.up('abraxa\\.quantityunit').setUnit(newValue);
                            this.up('abraxa\\.quantityunit').fireEvent('change', me, newValue, oldValue);
                        },
                        blur: function (me) {
                            this.up('abraxa\\.quantityunit').fireEvent('blur', this.up('abraxa\\.quantityunit'));
                            this.up('abraxa\\.quantityunit').removeCls('x-focused');
                        },
                        focusleave: function (me) {
                            this.up('abraxa\\.quantityunit').fireEvent('focusleave', this.up('abraxa\\.quantityunit'));
                            this.up('abraxa\\.quantityunit').removeCls('x-focused');
                        },
                        focus: function () {
                            this.up('abraxa\\.quantityunit').addCls('x-focused');
                        },
                    },
                },
            ],
        });

        this.callParent(arguments);
    },

    applyUi: function (ui) {
        this.getAt(0).setUi(ui);
        this.getAt(1).setUi(ui);
        return ui;
    },

    applyOptions: function (options) {
        return options;
    },

    updateOptions: function (newOptions, oldOptions) {
        this.getAt(1).setStore(newOptions);
    },

    setDisabled: function (value) {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        dateField.setDisabled(value);
        timeField.setDisabled(value);
    },
    applyQuantity: function (value) {
        var quantityField = this.getAt(0);

        quantityField.setValue(value);

        return value;
    },

    applyUnit: function (value) {
        var unitField = this.getAt(1);

        unitField.setValue(value);

        return value;
    },

    getQuantity() {
        return this.getAt(0).getValue();
    },

    getUnit() {
        return this.getAt(1).getValue();
    },

    clearValue: function () {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);
        dateField.clearValue();
        timeField.clearValue();
        this.setValue(null);
    },

    setValue: function (value) {
        this.callParent(arguments);
    },

    setError: function (error) {
        this.error = error;
        this.setErrorMessage(error);
    },
});
