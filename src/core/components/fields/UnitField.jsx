Ext.define('Abraxa.core.components.fields.UnitField', {
    extend: 'Ext.Container',

    xtype: 'unit.field',
    isField: true,
    alias: 'widget.unit.field',

    // cls: 'col-3',
    layout: 'hbox',
    defaults: {
        ui: 'classic',
    },

    twoWayBindable: {
        valueUnit: true,
        value: true,
        disabled: true,
        required: true,
        readOnly: true,
    },

    publishes: ['value', 'valueUnit'],

    config: {
        value: null,
        valueUnit: null,
        label: null,
        unitLabel: null,
        unitLabelTextAlign: null,
        disabled: null,
        labelAlign: null,
        required: null,
        hidden: false,
        decimals: null,
        floatedPicker: null,
        focusable: true,
        readOnly: null,
        maxValue: null,
        cls: null,
        unitFilter: null,
        matchFieldWidth: true,
        unitFieldMinWidth: null,
        unitFieldMaxWidth: null,
        // todo make predefined metric options

        options: null,
    },
    viewModel: {
        data: {
            spinner: {
                isValid: true,
            },
            formulas: {
                invalidCls: function (get) {
                    if (!get('spinner.isValid')) {
                        return 'x-invalid';
                    } else return '';
                },
            },
        },
    },
    privates: {
        items: [
            {
                //reference	: 'spinner',

                twoWayBindable: ['isValid'],
                xtype: 'abraxa.numberfield',
                cls: 'a-prepend',
                // labelAlign: this.labelAlign,
                // label: this.label,
                // maxValue: this.maxValue,
                // required: this.required,
                // clearable: false,
                // value: this.value,
                listeners: {
                    painted: function () {
                        this.setError(null);
                    },
                    change: function (me, newValue, oldValue) {
                        this.oldValue = oldValue;
                        this.up('unit\\.field').setValue(newValue);
                        this.up('unit\\.field').fireEvent('change', me, newValue, oldValue);
                    },
                    blur: function (me) {
                        this.up('unit\\.field').fireEvent('blur', me);
                    },
                },
                // flex: 9,
                flex: '1 1 auto',
                // renderer	: Ext.util.Format.numberRenderer('00.000'),
            },
            {
                xtype: 'combobox',
                queryMode: 'local',
                // label: this.unitLabel,
                // value: this.valueUnit,
                // bind: this.bind,
                // labelAlign: 'top',
                // required: this.required,
                valueField: 'name',
                displayField: 'name',
                cls: 'a-append a-append-units a-cursor-pointer {invalidCls}',
                placeholder: AbraxaConstants.placeholders.emptyValue,
                forceSelection: true,
                typeAhead: false,
                autoComplete: true,
                flex: '1 1 auto',
                // store: this.options,
                // matchFieldWidth: this.matchFieldWidth,
                // minWidth: this.unitFieldMinWidth,
                // maxWidth: this.unitFieldMaxWidth || 440,
                listeners: {
                    change: function (me, newValue, oldValue) {
                        this.oldValue = oldValue;
                        this.up('unit\\.field').setValueUnit(newValue);
                        this.up('unit\\.field').fireEvent('change', me, newValue, oldValue);
                    },
                    blur: function (me) {
                        this.up('unit\\.field').fireEvent('blur', me);
                    },
                },
            },
        ],
    },

    applyOptions: function (options) {
        return options;
    },

    applyHidden: function (hidden) {
        return hidden;
    },

    applyUnitFilter: function (options) {
        return options;
    },

    updateUnitFilter: function (filter) {
        filter = JSON.parse(filter);
        this.down('selectfield').getStore().clearFilter();
        if (filter) {
            this.down('selectfield')
                .getStore()
                .filter(function (rec) {
                    return filter.includes(rec.get('id'));
                });
        }
    },

    updateOptions: function (newOptions, oldOptions) {
        this.down('selectfield').setStore(newOptions);
    },

    // constructor: function (config) {
    //     // this.callParent(arguments);
    //     this.initConfig(config);
    //     return this;
    // },

    applyValue: function (value) {
        if (!value) {
            return null;
        }
        return value;
    },

    updateValue: function (newValue, oldValue) {
        this.down('abraxa\\.numberfield').setValue(newValue);
    },

    applyValueUnit: function (valueUnit) {
        if (valueUnit) return valueUnit;
    },

    updateValueUnit: function (newValueUnit, oldValueUnit) {
        this.down('selectfield').setValue(newValueUnit);
    },

    updateDecimals: function (newDecimals, oldDecimals) {
        this.down('abraxa\\.numberfield').setDecimals(newDecimals);
    },

    updateDisabled: function (newValue, oldValue) {
        this.down('abraxa\\.numberfield').setDisabled(newValue);
        this.down('selectfield').setDisabled(newValue);
    },

    updateReadOnly: function (newValue, oldValue) {
        this.down('abraxa\\.numberfield').setReadOnly(newValue);
        this.down('selectfield').setReadOnly(newValue);
    },

    applyLabel: function (label) {
        if (label !== null && !this.config.unitLabel) {
            this.down('selectfield').setLabel('&nbsp');
            return label;
        }
        if (label !== null && this.config.unitLabel) {
            this.down('selectfield').setLabel(this.config.unitLabel);
            this.down('selectfield').setLabelTextAlign(this.config.unitLabelTextAlign);
            return label;
        }
        if (label == null && this.config.unitLabel) {
            label = '&nbsp;';
            return label;
        }
    },
    applyUi: function (ui) {
        this.down('selectfield').setUi(ui);
        this.down('abraxa\\.numberfield').setUi(ui);
        return ui;
    },

    updateLabel: function (newLabel, oldLabel) {
        this.down('abraxa\\.numberfield').setLabel(newLabel);
    },

    applyLabelAlign: function (labelAlign) {
        return labelAlign;
    },

    updateLabelAlign: function (newLabelAlign, oldLabelAlign) {
        this.down('abraxa\\.numberfield').setLabelAlign(newLabelAlign);
    },
    updateRequired: function (newVal, oldVal) {
        this.down('abraxa\\.numberfield').setRequired(newVal);
        this.down('selectfield').setRequired(newVal);
        this.down('selectfield').toggleCls(Ext.baseCSSPrefix + 'required', false);
    },
    applyFloatedPicker: function (floatedPicker) {
        this.down('selectfield').setFloatedPicker(floatedPicker);
        return floatedPicker;
    },
    setError: function (error) {
        this.down('selectfield').setError(error);
        this.down('abraxa\\.numberfield').setError(error);
    },

    applyMaxValue: function (maxValue) {
        this.down('abraxa\\.numberfield').setMaxValue(maxValue);
    },
    updateMaxValue: function (maxValue) {
        this.down('abraxa\\.numberfield').setMaxValue(maxValue);
    },

    applyMatchFieldWidth: function (value) {
        this.down('selectfield').setMatchFieldWidth(value);
    },

    applyUnitFieldMinWidth: function (value) {
        this.down('selectfield').setMinWidth(value);
    },

    applyUnitFieldMaxWidth: function (value) {
        this.down('selectfield').setMaxWidth(value);
    },

    focus: function () {
        this.down('abraxa\\.numberfield').focus();
    },
});
