Ext.define('Abraxa.view.portcall.principal.disbursements.services.DisbursementServicesGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementServicesGridController',

    bindings: {
        onDisbursementChange: '{selectedDisbursement}',
    },

    onDisbursementChange: function (disbursement) {
        this.disbursement = disbursement;
    },

    currencyWithAmountRenderer: function (value) {
        if (this.disbursement) {
            return (
                '<span class="c-grey fw-n mr-8">' +
                this.disbursement.get('disbursement_currency') +
                '</span><span class="c-black">' +
                Ext.util.Format.number(value, '0,000.00') +
                '</span>'
            );
        }
    },
});
