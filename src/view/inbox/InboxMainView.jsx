import '../invitations/InvitationsGrid';
import '../invitations/invite/InvitationMainBody';

Ext.define('Abraxa.view.inbox.InboxMainView', {
    extend: 'Ext.Container',
    xtype: 'inbox.main.view',
    flex: 1,
    layout: 'fit',
    bodyCls: 'a-layout-card-wrap',
    viewModel: {
        formulas: {
            segmentedButtons: {
                bind: {
                    bindTo: '{currentUser}',
                    deep: true,
                },
                get: function (user) {
                    if (user) {
                        return {
                            xtype: 'segmentedbutton',
                            ui: 'small',
                            hidden: true,
                            bind: {
                                hidden: '{currentUserType == "agent" ? true : false}',
                            },
                            items: [
                                {
                                    bind: {
                                        text: 'Received ({invitationsCount.received})',
                                    },
                                    // badgeText: '3',
                                    pressed: true,
                                    handler: function (me) {
                                        let invitations = me.upVM().get('invitations'),
                                            currentUser = me.upVM().get('currentUser');
                                        invitations.clearFilter();
                                        me.up('grid').getColumnForField('company').setHidden(false);
                                        // me.up('grid').getColumnForField('org_id').setHidden(true);
                                        me.find('invitationRightContainer').hide();
                                        invitations.addFilter(
                                            new Ext.data.Query({
                                                source: 'tenant_id = "' + currentUser.get('current_company_id') + '"',
                                            })
                                        );
                                    },
                                },
                                {
                                    bind: {
                                        text: 'Sent ({invitationsCount.sent})',
                                    },
                                    minWidth: 76,
                                    handler: function (me) {
                                        let invitations = me.upVM().get('invitations'),
                                            currentUser = me.upVM().get('currentUser');
                                        invitations.clearFilter();
                                        me.up('grid').getColumnForField('company').setHideable(false);
                                        me.up('grid').getColumnForField('company').setHidden(true);
                                        //  me.up('grid').getColumnForField('org_id').setHidden(false);
                                        me.find('invitationRightContainer').hide();
                                        invitations.addFilter(
                                            new Ext.data.Query({
                                                source: 'company_id = "' + currentUser.get('current_company_id') + '"',
                                            })
                                        );
                                    },
                                },
                            ],
                        };
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'invitations.grid',
            flex: 1,
        },
        {
            xtype: 'container',
            cls: 'a-right-container a-portcalls-right-container',
            itemId: 'invitationRightContainer',
            hidden: true,
            layout: 'vbox',
            showAnimation: {
                type: 'slideIn',
                direction: 'left',
                duration: 90,
            },
            viewModel: {
                name: 'invitationDialogViewModel',
                data: {
                    invitationData: null,
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
                                        voyage = invitation.getVoyage(),
                                        vessel = invitation.getVoyage().get('custom_vessel')
                                            ? invitation.getVoyage().get('custom_vessel')
                                            : invitation.getVoyage().get('vessel'),
                                        flag = null;
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
                                        voyage.get('vessel_name') +
                                        '</a><div class="a-status-badge status-' +
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
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '{modalTitle}',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'a.vessel',
                                    fn: function () {
                                        let imo,
                                            record = this.component.upVM().get('invitationData').getVoyage();
                                        if (record.get('vessel')) {
                                            imo = record.get('vessel').id;
                                        }
                                        if (record.get('custom_vessel_id')) {
                                            if (record.get('custom_vessel').company_id) {
                                                imo = record.get('custom_vessel').id;
                                            }
                                        }
                                        if (imo) {
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .showVesselDialog(imo);
                                        }
                                    },
                                },
                            },
                        },
                        {
                            ui: 'round tool-round',
                            xtype: 'button',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                me.find('invitationRightContainer').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
                {
                    xtype: 'invitaion.main.body',
                    flex: 1,
                },
            ],
        },
    ],
});
