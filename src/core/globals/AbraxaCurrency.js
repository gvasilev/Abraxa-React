/**
 * Global class for currency
 */
Ext.define('Abraxa.Currency', {
    singleton: true,

    convertToCurrencySymbol: function (letters) {
        switch (letters) {
            case 'EUR':
                return '&#8364;';
                break;
            case 'USD':
                return '&#36;';
                break;
            case 'GBP':
                return '&#163;';
                break;
        }
    },

    /**
     * Currency format function
     * -----------------------------------------------------------------------------------------------------------------
     * @param currencyLetter (EUR, USD, GBP)
     * @param value
     */
    format: function (currencyLetter, value) {
        let currencySymbol = this.convertToCurrencySymbol(currencyLetter);
        let formattedNumber = Ext.util.Format.number(value, '0,000.00');

        if (typeof currencySymbol == 'undefined') currencySymbol = '';

        return currencySymbol + ' ' + formattedNumber;
    },
});
