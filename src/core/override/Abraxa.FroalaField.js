Ext.define('Abraxa.FroalaField', {
    override: 'Ext.froala.EditorField',
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
                console.log(errors);
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
});
