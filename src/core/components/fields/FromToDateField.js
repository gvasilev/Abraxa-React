Ext.define('Abraxa.core.components.fields.FromToDateField', {
    extend: 'Ext.field.Container',
    xtype: 'FromToDateField',
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
    initConfig: function (instanceConfig) {
        Ext.apply(instanceConfig, {
            defaults: {
                required: Ext.isDefined(instanceConfig.required) ? instanceConfig.required : false,
                ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
            },
            items: [
                {
                    xtype: 'abraxa.datefield',
                    submitValue: false,
                    placeholder: 'dd/mm/yy',
                    dateFormat: 'd M y',
                    // momentFormat: 'DD/MM/YY',
                    // // parseValidator: null,
                    // altFormats: 'j/m/Y|' + 'd/m/Y|' + 'dm|' + 'd/m|' + 'dmy|' + 'j|' + 'd|' + 'z',
                    flex: 1,
                    maxWidth: Ext.isDefined(instanceConfig.dateFieldMaxWidth) ? instanceConfig.dateFieldMaxWidth : null,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                    cls: 'a-prepend',
                    triggers: {
                        datetrigger: null,
                        expand: null,
                    },

                    listeners: {
                        change: function () {
                            const firstDateField = this.up('FromToDateField').query('abraxa\\.datefield')[0];
                            const secondDateField = this.up('FromToDateField').query('abraxa\\.datefield')[1];
                            if (!secondDateField.validate() || !firstDateField.validate()) {
                                secondDateField.addCls('x-invalid');
                                firstDateField.addCls('x-invalid');
                            } else {
                                secondDateField.removeCls('x-invalid');
                                firstDateField.removeCls('x-invalid');
                            }
                        },
                        select: function () {
                            Ext.defer(
                                function () {
                                    this.blur();
                                },
                                500,
                                this
                            );
                        },
                        focus: function () {
                            this.expand();
                            const secondDateField = this.up('FromToDateField').query('abraxa\\.datefield')[1];
                            secondDateField.addCls('x-focused');

                            const picker = this.getPicker();
                            const currentDate = new Date();
                            currentDate.setDate(currentDate.getDate() - 1);
                            picker.setMinDate(currentDate);

                            if (secondDateField.getValue()) {
                                this.getPicker().setMaxDate(secondDateField.getValue());
                            }

                            this.up('FromToDateField').fireEvent('focus', this.up('FromToDateField'));
                        },
                        blur: function () {
                            let value = this.getValue();
                            this.removeCls('x-focused');
                            this.up('FromToDateField').query('abraxa\\.datefield')[1].removeCls('x-focused');
                            this.up('FromToDateField').removeCls('x-focused');
                            if (this.isValid()) {
                                this.up('FromToDateField').blur();
                            }
                        },
                    },
                },
                {
                    xtype: 'abraxa.datefield',
                    placeholder: 'dd/mm/yy',
                    dateFormat: 'd M y',
                    submitValue: false,
                    flex: 1,
                    maxWidth: Ext.isDefined(instanceConfig.dateFieldMaxWidth) ? instanceConfig.dateFieldMaxWidth : null,
                    ui: Ext.isDefined(instanceConfig.ui) ? instanceConfig.ui : null,
                    disabled: Ext.isDefined(instanceConfig.disabled) ? instanceConfig.disabled : null,
                    cls: 'a-append',
                    triggers: {
                        datetrigger: null,
                        expand: null,
                    },

                    listeners: {
                        change: function () {
                            const firstDateField = this.up('FromToDateField').query('abraxa\\.datefield')[0];
                            const secondDateField = this.up('FromToDateField').query('abraxa\\.datefield')[1];
                            if (!secondDateField.validate() || !firstDateField.validate()) {
                                secondDateField.addCls('x-invalid');
                                firstDateField.addCls('x-invalid');
                            } else {
                                secondDateField.removeCls('x-invalid');
                                firstDateField.removeCls('x-invalid');
                            }
                        },
                        select: function () {
                            Ext.defer(
                                function () {
                                    this.blur();
                                },
                                500,
                                this
                            );
                        },
                        focus: function () {
                            const firstDateField = this.up('FromToDateField').query('abraxa\\.datefield')[0];
                            this.expand();
                            firstDateField.addCls('x-focused');

                            if (firstDateField.getValue()) {
                                this.getPicker().setMinDate(firstDateField.getValue());
                            } else {
                                this.getPicker().setMinDate(new Date(Date.now()));
                            }

                            this.up('FromToDateField').fireEvent('focus', this.up('FromToDateField'));
                        },
                        blur: function () {
                            let value = this.getValue();

                            setTimeout(() => {
                                this.up('FromToDateField').query('abraxa\\.datefield')[0].removeCls('x-focused');
                            }, 0);
                            this.up('FromToDateField').removeCls('x-focused');

                            if (this.isValid()) {
                                this.up('FromToDateField').blur();
                            }
                        },
                    },
                },
            ],
        });

        this.callParent(arguments);
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
    applyReadOnly: function (value) {
        const dateField1 = this.getAt(0);
        const dateField2 = this.getAt(1);

        dateField1.setReadOnly(value);
        dateField2.setReadOnly(value);
    },

    setRequired: function (value) {
        const dateField1 = this.getAt(0);
        const dateField2 = this.getAt(1);

        if (value) {
            this.setLabel(this.getLabel() + ' *');
        }

        dateField1.setRequired(value);
        dateField2.setRequired(value);
    },

    getDateTime: function (value) {
        return this.getValue();
    },

    getValue: function () {
        const dateField1 = this.getAt(0);
        const dateField2 = this.getAt(1);

        return [dateField1.getValue(), dateField2.getValue()];
    },

    clearValue: function () {
        const dateField1 = this.getAt(0);
        const dateField2 = this.getAt(1);
        dateField1.clearValue();
        dateField2.clearValue();
    },

    setValue: function (dates) {
        const fields = this.query('abraxa\\.datefield');
        for (let i = 0; i < dates.length; i++) {
            if (dates[i]) fields[i].setValue(dates[i]);
        }
    },

    setError: function (error) {
        if (!this.isValid()) {
            this.addCls('x-invalid');
        } else {
            this.removeCls('x-invalid');
        }
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
});
