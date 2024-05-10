Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePrincipalGridController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.VoyagePrincipalGridController',

    openVoyageDetails: function (grid, location) {
        Ext.ComponentQuery.query('CargoesTooltip').forEach((cmp) => cmp.destroy());
        switch (location.source.target.className) {
            case 'a-val-link appointed-agent-click':
                return;
            case 'a-val-link-xl vessel-name-click':
                return;
            case 'a-val-link':
                return;
            case 'a-val-link single':
                return;

            default:
                break;
        }

        const vm = grid.up('VoyagePrincipalMain').getViewModel();
        const store = this.getView().getStore();
        const recordIndex = store.findBy(function (record) {
            return record.get('id') === location.record.get('id');
        });

        const record = store.getAt(recordIndex);
        location.view.query('#voyageDetailsMoreInfoButton').forEach((button) => {
            button.setIconCls('md-icon-navigate-next');
            button.getTooltip().html = 'View details';
        });
        if (vm.get('currentVoyage') && record.get('id') === vm.get('currentVoyage').get('id')) {
            vm.set('currentVoyage', null);
        } else {
            vm.set('currentVoyage', record);
            const button = location.row.query('#voyageDetailsMoreInfoButton')[0];
            button.setIconCls('md-icon-navigate-before');
            button.getTooltip().html = 'Hide details';
        }
    },

    openAppointedAgentTooltip: function (me, el, eOpts) {
        const email = el.getAttribute('data-company-email');
        Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
    },

    openVesselInfoDialog: function (me, element, eOpts) {
        const recordId = +element.getAttribute('id');
        if (recordId) {
            Abraxa.getApplication().getController('AbraxaController').showVesselDialog(recordId);
        }
    },

    openPortInfoDialog: function (element, htmlEl, eOpts) {
        const recordId = +htmlEl.id;
        if (recordId) {
            Abraxa.getApplication().getController('AbraxaController').showPortDialogById(recordId);
        }
    },
});
