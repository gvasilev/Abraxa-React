Ext.define('Abraxa.core.components.fields.DraftField', {
    extend: 'Ext.Container',

    xtype: 'draftfield',
    isField: true,
    alias: 'widget.draftfield',

    //	require		 : ['Ext.field.InputMask'],
    layout: 'hbox',
    defaults: {
        ui: 'hovered-border classic',
    },

    twoWayBindable: {
        valueUnit: true,
        value: true,
        disabled: true,
        required: true,
    },

    publishes: ['value', 'valueUnit'],

    config: {
        value: null,
        valueUnit: 'm',
        label: null,
        disabled: null,
        readOnly: null,
        labelAlign: null,
        required: null,
        hidden: false,

        // todo make predefined metric options

        options: ['cm', 'dm', 'm'],
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
                xtype: 'draftnumberfield',
                inputType: 'number',
                cls: 'a-prepend',
                labelAlign: this.labelAlign,
                label: this.label,
                required: this.required,
                placeholder: '00.00',
                stepValue: null,
                spinner: false,
                precision: null,
                decimals: 2,
                decimalSeparator: '.',
                //			accelerateOnTapHold : true,
                //			decimals 	: 2,
                //			mouseWheelEnabled:true,
                minValue: 0,
                //			maxValue 	: 30,
                //			stepValue 	: 5,
                //			triggers	: {
                //				spindown : {
                //					hidden : true
                //			false;					weight : -1,
                //			side : 'left',
                //			cls : 'x-after-input-el',
                //			iconCls : 'x-fa fa-angle-down'
                //				},
                //				},
                //				spinup	: {
                //					hidden : true
                //				}
                //			weight : -1,
                ////			side : 'left',
                //					cls : 'x-after-input-el',
                //					iconCls : 'x-fa fa-angle-up'

                //			},
                clearable: false,
                value: this.value,
                listeners: {
                    change: function (me, newValue, oldValue) {
                        this.oldValue = oldValue;
                        this.up('draftfield').setValue(newValue);
                        this.up('draftfield').fireEvent('change', me, newValue, oldValue);
                    },
                    blur: function (me) {
                        this.up('draftfield').fireEvent('blur', me);
                    },
                },
                flex: 9,
                //	renderer	: Ext.util.Format.numberRenderer('00.00'),
            },
            {
                maxWidth: 120,
                minWidth: 120,
                xtype: 'combobox',
                //			twoWayBindable  : ['isValid'],
                //	bind		: { isValid : '!{isValid}' },
                //label		: '&nbsp',
                value: this.valueUnit,
                bind: this.bind,
                labelAlign: 'top',
                required: this.required,
                editable: false,
                autoFocus: true,
                cls: 'a-append a-append-units a-cursor-pointer {invalidCls}',
                placeholder: AbraxaConstants.placeholders.emptyValue,
                forceSelection: false,
                typeAhead: true,
                autoComplete: true,
                flex: 3,
                options: this.options,
                listeners: {
                    change: function (me, newValue, oldValue) {
                        this.oldValue = oldValue;
                        this.up('draftfield').setValueUnit(newValue);
                        this.up('draftfield').fireEvent('change', me, newValue, oldValue);
                    },
                    blur: function (me) {
                        this.up('draftfield').fireEvent('blur', me);
                    },
                },
                minWidth: 85,
                textAlign: 'center',
            },
        ],
    },

    applyOptions: function (options) {
        options.forEach(function (item, index) {
            if (typeof item === 'string') {
                options[index] = {
                    value: item,
                    text: item,
                };
            }
        });
        return options;
    },

    applyHidden: function (hidden) {
        return hidden;
    },

    updateOptions: function (newOptions, oldOptions) {
        this.down('selectfield').setOptions(newOptions);
    },

    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },

    applyValue: function (value) {
        //		this.down('draftnumberfield').setInputValue(numeral(value).format('0.00'));
        //		if (value < 0) return 0;
        //		if (value > 30) return 30;
        return numeral(value).format('00.[00]');
    },

    updateValue: function (newValue, oldValue) {
        this.down('draftnumberfield').setValue(newValue);
    },

    applyValueUnit: function (valueUnit) {
        return valueUnit;
    },

    updateValueUnit: function (newValueUnit, oldValueUnit) {
        this.down('selectfield').setValue(newValueUnit);
    },

    updateDisabled: function (newValue, oldValue) {
        this.down('draftnumberfield').setDisabled(newValue);
        this.down('selectfield').setDisabled(newValue);
    },

    updateReadOnly: function (newValue, oldValue) {
        this.down('draftnumberfield').setReadOnly(newValue);
        this.down('selectfield').setReadOnly(newValue);
    },

    applyLabel: function (label) {
        if (label !== null) {
            this.down('selectfield').setLabel('&nbsp');
        } else {
            this.down('selectfield').setLabel(null);
        }
        return label;
    },

    updateLabel: function (newLabel, oldLabel) {
        this.down('draftnumberfield').setLabel(newLabel);
    },

    applyLabelAlign: function (labelAlign) {
        return labelAlign;
    },

    updateLabelAlign: function (newLabelAlign, oldLabelAlign) {
        this.down('draftnumberfield').setLabelAlign(newLabelAlign);
    },
    updateRequired: function (newVal, oldVal) {
        this.down('draftnumberfield').setRequired(newVal);
        this.down('selectfield').setRequired(newVal);
    },
});
