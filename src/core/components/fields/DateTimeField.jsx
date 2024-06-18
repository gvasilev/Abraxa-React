import '../AbraxaDateField';
import '../AbraxaTimeField';
Ext.define('Abraxa.core.components.fields.DateTimeField', {
    extend: 'Ext.field.Container',
    xtype: 'abraxa.datetimefield',
    classCls: Ext.baseCSSPrefix + 'datetimefield',
    isField: true,
    config: {
        value: null,
        label: null,
        labelAlign: null,
        listeners: null,
        disabled: null,
        readOnly: null,
        ui: null,
        dateTime: null,
        cls: null,
        error: null,
        dateFieldMaxWidth: null,
        timeFieldMaxWidth: null,
    },
    requiredCls: Ext.baseCSSPrefix + 'required',
    publishes: ['dateTime'],
    focusable: true,
    mixins: ['Ext.field.Dirty'],
    inputElement: {
        setStyle: function () {
            return false;
        },
    },
    defaultListenerScope: true,
    privates: {
        items: [
            {
                xtype: 'abraxa.datefield',
                submitValue: false,
                flex: 1,
                // required: Ext.isDefined(this.required) ? this.required : false,
                // maxWidth: Ext.isDefined(instanceConfig.dateFieldMaxWidth) ? instanceConfig.dateFieldMaxWidth : null,
                // ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                // disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                cls: 'a-prepend',
                triggers: {
                    datetrigger: null,
                    expand: null,
                },
                floatedPicker: {
                    listeners: {
                        select: function (me, value) {
                            this.up('abraxa\\.datetimefield').setDateTime(value);
                            this.up('abraxa\\.datetimefield').getAt(1).focus();
                            this.up('abraxa\\.datetimefield').blur();
                            this.hide();
                        },
                    },
                },
                listeners: {
                    keyup: function () {
                        let value = this.up('abraxa\\.datetimefield').getValue();
                        this.up('abraxa\\.datetimefield').setDateTime(value);
                    },
                    focus: function () {
                        this.up('abraxa\\.datetimefield').addCls('x-focused');
                        this.up('abraxa\\.datetimefield').fireEvent('focus', this.up('abraxa\\.datetimefield'));
                    },
                    blur: function () {
                        let value = this.getValue();
                        if (this.isValid()) {
                            // this.up('abraxa\\.datetimefield').setDateTime(value);
                            this.up('abraxa\\.datetimefield').removeCls('x-focused');
                            this.up('abraxa\\.datetimefield').blur();
                        } else {
                            this.up('abraxa\\.datetimefield').setValue(null);
                            this.clearValue();
                            this.setInputValue(null);
                        }
                    },
                },
            },
            {
                xtype: 'abraxa.timefield',
                submitValue: false,
                width: 94,
                // allowBlank: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                // ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                // maxWidth: Ext.isDefined(instanceConfig.timeFieldMaxWidth) ? instanceConfig.timeFieldMaxWidth : null,
                // disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                cls: 'a-append',
                triggers: {
                    datetrigger: {
                        margin: '0 4 0 0',
                        iconCls: 'md-icon-date-range',
                        side: 'right',
                        handler: function () {
                            this.up('abraxa\\.datetimefield').down('abraxa\\.datefield').expand();
                        },
                    },
                },
                listeners: {
                    keyup: function () {
                        let value = this.up('abraxa\\.datetimefield').getValue();
                        this.up('abraxa\\.datetimefield').setDateTime(value);
                    },
                    blur: function (me) {
                        let value = this.up('abraxa\\.datetimefield').getValue();
                        this.up('abraxa\\.datetimefield').setDateTime(value);
                        this.up('abraxa\\.datetimefield').fireEvent('blur', this.up('abraxa\\.datetimefield'));
                        this.up('abraxa\\.datetimefield').removeCls('x-focused');
                    },
                    focusleave: function (me) {
                        this.up('abraxa\\.datetimefield').fireEvent('focusleave', this.up('abraxa\\.datetimefield'));
                        this.up('abraxa\\.datetimefield').removeCls('x-focused');
                    },
                    focus: function () {
                        this.up('abraxa\\.datetimefield').fireEvent('focus', this.up('abraxa\\.datetimefield'));
                        this.up('abraxa\\.datetimefield').addCls('x-focused');
                    },
                },
            },
        ],
    },

    getRawValue: function () {
        return this.getDateTime();
    },

    setDisabled: function (value) {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        dateField.setDisabled(value);
        timeField.setDisabled(value);
    },

    setReadOnly: function (value) {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        dateField.setReadOnly(value);
        timeField.setReadOnly(value);
    },
    // applyReadOnly: function (value) {
    //     var dateField = this.getAt(0);
    //     var timeField = this.getAt(1);

    //     dateField.setReadOnly(value);
    //     timeField.setReadOnly(value);
    // },
    // setRequired: function (value) {
    //     var dateField = this.getAt(0);
    //     var timeField = this.getAt(1);

    //     dateField.setRequired(value);
    //     timeField.setRequired(value);
    // },

    setDateTime: function () {
        // this.callParent(arguments);
        if (this.getValue()) {
            this.validate();
        }
    },

    applyDateTime: function (value) {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        if (value && Ext.isString(value)) {
            var tempValue = this.parseDateTime(value);
            if (Ext.isDate(tempValue)) {
                value = tempValue;
            }
        }

        dateField.setValue(value);
        timeField.setValue(value);

        return value;
    },

    getDateTime: function (value) {
        return this.getValue();
    },

    getValue: function () {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        var date = dateField.getValue();
        if (date) {
            date = this.setTimePart(date, timeField.getValue());
        }

        return date;
    },

    clearValue: function () {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);
        dateField.clearValue();
        timeField.clearValue();
        this.setDateTime(null);
    },

    setValue: function (value) {
        // this.callParent(arguments);
    },

    applyValue(value) {
        this.setDateTime(value);
    },

    getSubmitValue: function () {
        var me = this;

        return this.serializeDateTime(me.getValue());
    },

    parseDateTime: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        } else {
            if (config && config.dateOnly) {
                return Ext.Date.parse(value, 'Y-m-d');
            } else {
                return Ext.Date.parse(value, 'Y-m-d\\TH:i:sP');
            }
        }
    },

    serializeDateTime: function (value, config) {
        if (Ext.isEmpty(value)) {
            return value;
        } else {
            if (config && config.dateOnly) {
                return Ext.Date.format(value, 'Y-m-d\\T00:00:00P');
            } else {
                return Ext.Date.format(value, 'Y-m-d\\TH:i:sP');
            }
        }
    },

    getDatePart: function (date) {
        if (Ext.isDate(date)) return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    },

    setTimePart: function (d, t) {
        if (Ext.isEmpty(d)) {
            if (Ext.isEmpty(t)) {
                return d;
            } else {
                d = new Date();
            }
        }
        d = this.getDatePart(d);

        if (!Ext.isEmpty(t)) {
            //Do not try to convert to a Date if time is already a date object.
            if (!Ext.isDate(t)) {
                if (t.length == 7) t = '0' + t;

                t = Ext.Date.parse(t, 'h:i a');
            }
            if (Ext.isDate(d)) d.setHours(t.getHours(), t.getMinutes(), 0, 0);
        }

        return d;
    },

    setError: function (error) {
        if (error) {
            this.error = error;
            this.setErrorMessage(error);
        }
    },

    validate: function (skipLazy) {
        var me = this,
            empty,
            errors,
            field,
            record,
            validity,
            value;
        // If we are in configuration and not validating any values, skip out of here
        if (me.isConfiguring && me.validateOnInit === 'none') {
            return true;
        }

        // if field is disabled and cfg not set to validate if disabled, skip out of here
        if (!me.getDisabled() || me.getValidateDisabled()) {
            errors = [];

            // If we are a textual input field, get the input element's value.
            // Check the DOM validity state first in case a type="number"
            // check has failed.
            if (me.isInputField && !me.isSelectField) {
                value = me.getInputValue();
                empty = !value;
                validity = empty && me.inputElement.dom.validity;

                if (validity && validity.badInput) {
                    errors.push(me.badFormatMessage);
                    empty = false;
                }
            } else {
                value = me.getValue();
                empty = value === '' || value == null;
            }

            if (empty && me.getRequired()) {
                errors.push(me.getRequiredMessage());
            } else if (!errors.length) {
                if (!empty) {
                    // Pass non-empty values along to parseValue to handle things like
                    // datefield and numberfield. Technically this concern is more of a
                    // textfield family issue, but it is awkward to leap out of this
                    // sequence in such a way as to make a surgical override practical...
                    // So we simply provide identityFn as the default parseValue impl
                    value = me.parseValue(value, errors);
                }

                if (!errors.length) {
                    field = me._validationField;
                    record = me._validationRecord;

                    if (field && record) {
                        field.validate(value, null, errors, record);
                    }

                    if (!empty) {
                        me.doValidate(value, errors, skipLazy);
                    }
                }
            }
            if (errors.length) {
                me.setError(errors);

                return false;
            }
        }

        me.clearInvalid();

        return true;
    },
    clearInvalid: function () {
        this.error = null;
        this.setErrorMessage(null);
    },
    addTrigger: function () {
        console.log(arguments);
    },

    setUi: function (value) {
        var dateField = this.getAt(0);
        var timeField = this.getAt(1);

        dateField.setUi(value);
        timeField.setUi(value);

        return value;
    },
});
