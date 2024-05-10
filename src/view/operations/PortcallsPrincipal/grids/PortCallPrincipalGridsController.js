Ext.define('Abraxa.view.operations.PortCallsPricipal.grids.PortCallsPricipalGridsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.PortCallsPricipalGridsController',

    openVesselInfoDialog: function (me, element, eOpts) {
        const vesselId = htmlEl.getAttribute('data-vessel-id');
        if (vesselId) {
            Abraxa.getApplication().getController('AbraxaController').showVesselDialog(vesselId);
        }
    },

    openPortInfoDialog: function (element, htmlEl, c) {
        const portId = htmlEl.getAttribute('data-port-id');
        if (portId) {
            Abraxa.getApplication().getController('AbraxaController').showPortDialogById(portId);
        }
    },

    openCompanyInfoTooltip: function (element, htmlEl, c) {
        const companyId = htmlEl.getAttribute('data-organization-id');
        Abraxa.getApplication().getController('AbraxaController').showAgentTooltip(companyId, element);
    },

    openCompanyInfo: function (element, htmlEl, c) {
        const companyId = parseInt(htmlEl.getAttribute('profile_id'));
        Abraxa.getApplication().getController('AbraxaController').showAgentTooltip(companyId, element);
    },

    openUserInfo: function fn(element, htmlEl, c, cell) {
        var user = cell.component.getRecord().getVoyage().get('assigned_to');
        let tipExist = Ext.getCmp('createdByTool');
        if (tipExist) {
            tipExist.destroy();
        }

        if (!user) return;
        Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
            id: 'createdByTool',
            viewModel: {
                data: {
                    user_id: user,
                    clickedElement: element.target,
                },
            },
        }).showBy(element, 'bc-tc?');
    },

    redirectToPortcall: function (portcall) {
        if (this.checkIfPortcallHasInvitation(portcall)) {
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('voyage/' + portcall.getVoyage().get('id') + '/appoint/' + portcall.get('id'));
        } else {
            const operationsMainContainer = this.getView().up('OperationsMainContainer');
            operationsMainContainer.setMasked({
                xtype: 'loadmask',
                style: {
                    zIndex: 9999,
                },
            });

            if (portcall.get('id')) {
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('portcall/' + portcall.get('id'));
            } else {
                operationsMainContainer.setMasked(false);
            }
        }
    },
    //return true if portcall is waiting invitation else false
    checkIfPortcallHasInvitation(portcall) {
        if (portcall && portcall.getVoyage().get('hideable')) {
            let invitations = portcall.invitations();
            let invitation = invitations.first();
            if (invitation && invitation.get('status') !== 'Accepted') {
                return true;
            }
        }
        return false;
    },
    dataRenderer: function (value) {
        if (value) {
            return Abraxa.utils.Functions.createPlaceHolders(
                Abraxa.utils.Functions.formatStringToDate(value, AbraxaConstants.formatters.date.dayMonHyphenTime24),
                'strong'
            );
        }
        return AbraxaConstants.placeholders.emptySpan;
    },
    exportDataRenderer: function (value) {
        if (value) {
            return Abraxa.utils.Functions.formatStringToDate(value, AbraxaConstants.formatters.date.dayMonHyphenTime24);
        }
        return AbraxaConstants.placeholders.emptyValue;
    },
    exportVesselNameRenderer: function (value, record) {
        if (record.get(AbraxaConstants.labels.vessel) && record.get(AbraxaConstants.labels.vessel).name) {
            return record.get(AbraxaConstants.labels.vessel).name;
        }
        return AbraxaConstants.placeholders.emptyValue;
    },
    exportOrganizationNameRenderer: function (val, record, dataIndex) {
        if (record.get(dataIndex) && record.get(dataIndex).org_name) {
            return record.get(dataIndex).org_name;
        }
        return AbraxaConstants.placeholders.emptyValue;
    },
    exportCargoRenderer: function (val, record) {
        if (
            record.get(AbraxaConstants.labels.cargoQuantity) &&
            record.get(AbraxaConstants.labels.cargoQuantity).cargoes &&
            record.get(AbraxaConstants.labels.cargoQuantity).cargoes.length > 0
        ) {
            const exportValue = record
                .get(AbraxaConstants.labels.cargoQuantity)
                .cargoes.map((el) => el.commodity + ' ' + el.quantity + el.unit)
                .join(';\n');
            return exportValue;
        }
        return AbraxaConstants.placeholders.emptyValue;
    },

    exportWatchingRenderer: function (val, record) {
        return record.get('is_watching') ? 'Yes' : 'No';
    },
    gridsChildDoubleTap: function (grid, location) {
        let portcall = location.record;
        if (portcall) {
            this.redirectToPortcall(portcall);
        }
    },
});
