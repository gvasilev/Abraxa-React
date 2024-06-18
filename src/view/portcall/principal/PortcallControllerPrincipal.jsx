import '../PortcallController';

Ext.define('Abraxa.view.portcall.principal.PortcallControllerPrincipal', {
    extend: 'Abraxa.view.portcall.PortcallController',
    alias: 'controller.PortcallControllerPrincipal',

    routes: {
        'portcall/:id/disbursements/:disbursement_id': {
            action: 'handleDisbursementRoute',
            exit: 'handleDisbursementEmptyRoute',
            lazy: true,
        },
    },

    init: function () {},

    handleDisbursementRoute: function (id, disbursement_id) {
        let mainView = this.getView(),
            disbursementView = mainView.down('DisbursementDetails');

        disbursementView.loadRecord(disbursement_id);
    },

    handleDisbursementEmptyRoute: function (id) {
        //think about this
        let disbursementView = this.getView().down('DisbursementDetails');
        disbursementView.setRecord(null);
    },
});
