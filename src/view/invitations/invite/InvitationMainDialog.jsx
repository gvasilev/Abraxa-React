Ext.define('Abraxa.view.invitations.invite.InvitationMainDialog', {
    extend: 'Ext.Dialog',
    xtype: 'invitaion.main.dialog',
    cls: 'a-dialog-create a-dialog-portcall-info',
    manageBorders: false,
    minWidth: 640,
    maxWidth: 640,
    height: '80%',
    showAnimation: 'pop',
    scrollable: 'y',
    layout: 'hbox',
    closable: true,
    draggable: false,
    padding: 0,
    viewModel: {
        name: 'invitationDialogViewModel',
        data: {
            invitationData: null,
            inviteDialog: true,
        },
        formulas: {
            modalTitle: {
                bind: {
                    bindTo: '{invitationData}',
                    deep: true,
                },
                get: function (invitation) {
                    if (invitation) {
                        if (invitation.getVoyage() && invitation.getVoyage().getPortcall().get('status_data')) {
                            let status = invitation.get('status'),
                                flag = null,
                                vessel = invitation.getVoyage().get('vessel');
                            if (vessel && vessel.flags && vessel.flags.country_code) {
                                flag =
                                    'src="' +
                                    AbraxaConstants.urls.staticAbraxa +
                                    'flags/1x1/' +
                                    vessel.flags.country_code.toLocaleLowerCase() +
                                    '.svg"';
                            }

                            return (
                                '<div class="hbox"><img height="24" class="a-img-round mr-12" ' +
                                flag +
                                ' /><a href="javascript:void(0);" class="vessel-name vessel mr-16">' +
                                vessel.name +
                                '</a><div class="a-status-badge status-xl status-' +
                                status.toLocaleLowerCase() +
                                '">' +
                                status +
                                '</div></div>'
                            );
                        }
                    }
                },
            },
        },
    },
    bind: {
        title: {
            html: '{modalTitle}',
        },
    },
    items: [
        {
            xtype: 'invitaion.main.body',
            padding: 0,
            flex: 1,
        },
        // {
        //     xtype: 'guide.container',
        //     flex: 1,
        //     cls: 'a-bl-200',
        //     padding: 16
        // }
    ],
    listeners: {
        click: {
            element: 'element',
            delegate: 'a.vessel',
            fn: function () {
                var record = this.component.upVM().get('invitationData').getVoyage();
                (customVesselId = null), (imo = record.get('vessel').id);
                if (imo) {
                    Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo, customVesselId);
                }
            },
        },
    },
});
