Ext.define('Abraxa.view.portcall.principal.disbursements.services.DisbursementServicesGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementServicesGridController',

    bindings: {
        onDisbursementChange: '{selectedDisbursement}',
    },

    onDisbursementChange: function (disbursement) {
        this.disbursement = disbursement;
    },

    currencyWithAmountRenderer: function (value, row) {
        if (this.disbursement && row) {
            let total = 0;
            row.store.queryBy(function (rec) {
                if (row.dataIndex) {
                    total += rec.get(row.dataIndex);
                }
            });
            return (
                '<span class="c-grey fw-n mr-8">' +
                this.disbursement.get('disbursement_currency') +
                '</span><span class="c-black">' +
                Ext.util.Format.number(total, '0,000.00') +
                '</span>'
            );
        }
    },
    cellAmountRenderer: function (value) {
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
