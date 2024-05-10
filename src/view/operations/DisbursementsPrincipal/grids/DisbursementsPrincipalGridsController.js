Ext.define('Abraxa.view.operations.DisbursementsPrincipal.grids.DisbursementsPrincipalGridsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementsPrincipalGridsController',

    openUserInfo: function fn(element, htmlEl, c, cell) {
        var user = cell.component.getRecord().get('updated_by_user');
        let tipExist = Ext.getCmp('createdByTool');
        if (tipExist) {
            tipExist.destroy();
        }
        Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
            target: element.target,
            id: 'createdByTool',
            viewModel: {
                data: {
                    user: {
                        company_name: user.company_info.name,
                        email: user.email,
                        phone: user.phone || null,
                        profile_image: user.profile_image,
                        location: user.location,
                    },
                    clickedElement: element.target,
                },
            },
        }).showBy(element, 'bc-tc?');
    },

    redirectToDisbursement: function (element, location) {
        const operationsMainContainer = this.getView().up('OperationsMainContainer');

        if (location.source && location.source.target) {
            switch (location.source.target.className) {
                case 'a-val-link lead-agent-click':
                    return;
                case 'a-val-link-xl vessel-name-click':
                    return;
                case 'a-val-link-md':
                    return;

                default:
                    break;
            }
        }
        if (Ext.getCmp('agentTooltip')) Ext.getCmp('agentTooltip').destroy();
        operationsMainContainer.setMasked({
            xtype: 'loadmask',
            style: {
                zIndex: 9999,
            },
        });
        let disbursementId = null;
        let portcallId = null;

        if (location.record) {
            disbursementId = location.record.get('id');
            portcallId = location.record.get('portcall') ? location.record.get('portcall').id : null;
        }

        if (disbursementId && portcallId) {
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('portcall/' + portcallId + '/disbursements/' + disbursementId);
        } else {
            operationsMainContainer.setMasked(false);
        }
    },

    showVesselDialog: function (el, htmlEl) {
        const id = htmlEl.getAttribute('data-vessel-id');
        if (id) {
            Abraxa.getApplication().getController('AbraxaController').showVesselDialog(id);
        }
    },

    showPortDialog: function (el, htmlEl) {
        const id = htmlEl.getAttribute('data-port-id');
        if (id) {
            Abraxa.getApplication().getController('AbraxaController').showPortDialogById(id);
        }
    },

    openCompanyInfoTooltip: function (element, htmlEl, c) {
        const id = htmlEl.getAttribute('data-organization-id');
        if (id) {
            Abraxa.getApplication().getController('AbraxaController').showAgentTooltip(id, element);
        }
    },
});
