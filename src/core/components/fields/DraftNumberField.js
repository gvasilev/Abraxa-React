/**
 * The Number field creates an HTML5 number input and is usually created inside a form. Because it creates an HTML
 * number input field, most browsers will show a specialized virtual keyboard for entering numbers. The Number field
 * only accepts numerical input and also provides additional spinner UI that increases or decreases the current value
 * by a configured {@link #stepValue step value}. Here's how we might use one in a form:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'How old are you?',
 *                 items: [
 *                     {
 *                         xtype: 'numberfield',
 *                         label: 'Age',
 *                         minValue: 18,
 *                         maxValue: 150,
 *                         name: 'age'
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * Or on its own, outside of a form:
 *
 *     Ext.create('Ext.field.Number', {
 *         label: 'Age',
 *         value: '26'
 *     });
 *
 * ## minValue, maxValue and stepValue
 *
 * The {@link #minValue} and {@link #maxValue} configurations are self-explanatory and simply constrain the value
 * entered to the range specified by the configured min and max values. The other option exposed by this component
 * is {@link #stepValue}, which enables you to set how much the value changes every time the up and down spinners
 * are tapped on. For example, to create a salary field that ticks up and down by $1,000 each tap we can do this:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 title: 'Are you rich yet?',
 *                 items: [
 *                     {
 *                         xtype: 'numberfield',
 *                         label: 'Salary',
 *                         value: 30000,
 *                         minValue: 25000,
 *                         maxValue: 50000,
 *                         stepValue: 1000
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * This creates a field that starts with a value of $30,000, steps up and down in $1,000 increments and will not go
 * beneath $25,000 or above $50,000.
 *
 * Because number field inherits from {@link Ext.field.Text textfield} it gains all of the functionality that text
 * fields provide, including getting and setting the value at runtime, validations and various events that are fired as
 * the user interacts with the component. Check out the {@link Ext.field.Text} docs to see the additional functionality
 * available.
 */
Ext.define('Abraxa.field.DraftNumber', {
    extend: 'Ext.field.Text',
    xtype: 'draftnumberfield',
    alternateClassName: 'Ext.form.DraftNumber',

    config: {
        /**
         * @cfg {Number} [minValue=undefined] The minimum value that this Number field can accept (defaults to `undefined`, e.g. no minimum).
         * @accessor
         */
        minValue: null,

        /**
         * @cfg {Number} [maxValue=undefined] The maximum value that this Number field can accept (defaults to `undefined`, e.g. no maximum).
         * @accessor
         */
        maxValue: null,

        /**
         * @cfg {Number} [stepValue=undefined] The amount by which the field is incremented or decremented each time the spinner is tapped.
         * Defaults to `undefined`, which means that the field goes up or down by 1 each time the spinner is tapped.
         * @accessor
         */
        stepValue: null,

        /**
         * @cfg {Number} [decimals=2]
         * The maximum precision to display after the decimal separator.
         * @locale
         */
        decimals: 2,
    },

    classCls: Ext.baseCSSPrefix + 'numberfield',
    inputType: 'number',

    /**
     * Updates the `min` attribute with the {@link #minValue} configuration.
     * @private
     */
    updateMinValue: function (newMinValue) {
        this.setInputAttribute('min', newMinValue);
    },

    /**
     * Updates the `max` attribute with the {@link #maxValue} configuration.
     * @private
     */
    updateMaxValue: function (newMaxValue) {
        this.setInputAttribute('max', newMaxValue);
    },

    /**
     * Updates the `step` attribute with the {@link #stepValue} configuration
     * @private
     */
    updateStepValue: function (newStepValue) {
        this.setInputAttribute('step', newStepValue);
    },

    applyValue: function (value, oldValue) {
        var me = this,
            minValue = me.getMinValue(),
            maxValue = me.getMaxValue(),
            precision = me.getDecimals();

        if (this.isConfiguring) {
            this.originalValue = value;
        }

        if (Ext.isNumber(minValue) && Ext.isNumber(value)) {
            value = Math.max(value, minValue);
        }

        if (Ext.isNumber(maxValue) && Ext.isNumber(value)) {
            value = Math.min(value, maxValue);
        }

        value = parseFloat(value);

        if (isNaN(value)) {
            return '';
        }

        if (precision != null) {
            value = Ext.Number.roundToPrecision(value, precision);
        }

        if (value === oldValue) {
            // If the old value is the same as the current value
            // because maxValue or minValue changed the value
            // that was passed in, we need to make sure
            // updateInputValue is executed so the <input>
            // is properly updated and in sync with the value.
            this.updateInputValue(numeral(value).format('00.00'));
        }
        if (isNaN(value)) {
            return '';
        } else {
            if (value < 10) {
                return numeral(value).format('0.00');
            } else {
                return numeral(value).format('00.00');
            }
        }
        //return (isNaN(value)) ? '' : numeral(value).format('00.00');
    },

    getValue: function () {
        var value = parseFloat(this.callParent(), 10);
        if (isNaN(value)) {
            return '';
        } else {
            if (value < 10) {
                return numeral(value).format('0.00');
            } else {
                return numeral(value).format('00.00');
            }
        }
        //var value = parseFloat(this.callParent(), 10);
        //return (isNaN(value)) ? null : numeral(value).format('00.00');
    },
});
