import './DraftNumberField';

Ext.define('Abraxa.core.components.fields.DraftField', {
    extend: 'Ext.Container',

    xtype: 'draftfield',
    isField: true,
    alias: 'widget.draftfield',
    defaultListenerScope: true,
    layout: 'hbox',
    defaults: {
        ui: 'hovered-border classic',
    },
    publishes: ['value', 'valueUnit'],
    config: {
        value: null,
        valueUnit: 'm',
        draftValue: null,
        label: null,
        disabled: null,
        readOnly: null,
        labelAlign: null,
        required: null,
        hidden: false,

        // todo make predefined metric options

        options: ['cm', 'dm', 'm'],
    },
    twoWayBindable: {
        valueUnit: true,
        value: true,
        disabled: true,
        required: true,
        readOnly: true,
    },
    privates: {
        items: [
            {
                xtype: 'draftnumberfield',
                inputType: 'number',
                cls: 'a-prepend',
                placeholder: '00.00',
                stepValue: null,
                spinner: false,
                precision: null,
                decimals: 2,
                decimalSeparator: '.',
                minValue: 0,
                clearable: false,
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
            },
            {
                maxWidth: 120,
                minWidth: 85,
                xtype: 'combobox',
                labelAlign: 'top',
                editable: false,
                autoFocus: true,
                cls: 'a-append a-append-units a-cursor-pointer {invalidCls}',
                placeholder: AbraxaConstants.placeholders.emptyValue,
                forceSelection: false,
                typeAhead: true,
                autoComplete: true,
                flex: 3,
                listeners: {
                    change: function (me, newValue, oldValue) {
                        // this.oldValue = oldValue;
                        this.up('draftfield').setValueUnit(newValue);
                        this.up('draftfield').fireEvent('change', me, newValue, oldValue);
                    },
                    blur: function (me) {
                        this.up('draftfield').fireEvent('blur', me);
                    },
                },
                textAlign: 'center',
            },
        ],
    },

    applyOptions: function (options) {
        const combobox = this.getAt(1);
        options.forEach(function (item, index) {
            if (typeof item === 'string') {
                options[index] = {
                    value: item,
                    text: item,
                };
            }
        });
        combobox.setOptions(options);
    },

    applyHidden: function (hidden) {
        return hidden;
    },

    updateOptions: function (newOptions) {
        this.getAt(0).setOptions(newOptions);
    },

    applyValue: function (value) {
        if (!value) {
            return null;
        }
        return value;
    },

    updateValue: function (newValue, oldValue) {
        this.down('draftnumberfield').setValue(newValue);
    },

    applyValueUnit: function (valueUnit) {
        let combobox = this.getAt(1);
        combobox.setValue(valueUnit);
        return valueUnit;
    },

    updateValueUnit: function (newValueUnit) {
        let combobox = this.getAt(1);
        combobox.setValue(newValueUnit);
    },

    updateDisabled: function (newValue, oldValue) {
        this.getAt(0).setDisabled(newValue);
        this.getAt(1).setDisabled(newValue);
    },

    updateReadOnly: function (newValue, oldValue) {
        this.getAt(0).setReadOnly(newValue);
        this.getAt(1).setReadOnly(newValue);
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
