Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePortItineryPanel', {
    extend: 'Ext.Container',
    xtype: 'VoyagePortItineryPanel',
    testId: 'voyagePortItineryPanel',
    cls: 'a-port-itinerary-rp',
    controller: 'VoyageDetailsRightCardController',
    layout: 'vbox',
    scrollable: true,
    items: [
        {
            xtype: 'list',
            cls: 'a-port-itinerary-list-rp',
            testId: 'voyagePortItineryList',
            bind: {
                store: '{voyageItineraryPortCall}',
            },

            itemConfig: {
                viewModel: true,
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'start',
                    pack: 'space-between',
                },
                bind: {
                    cls: 'a-list-item-rp a-list-item-rp-{record.portItineraryStatus}',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'a-item-icon-rp',
                        html: '<i class="md-icon"></i>',
                    },
                    {
                        xtype: 'container',
                        cls: 'a-item-port-info-rp',
                        flex: 1,
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-display-item-port',
                                testId: 'voyagePortItineryPortNameDiv',
                                bind: {
                                    html: '<span class="a-display-port">{record.portName}, {record.portCountryCode}</span> ({record.portFunction})',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortSailedDateDiv',
                                bind: {
                                    hidden: '{record.portSailedHide}',
                                    html: '<span class="a-display-label">Sailed:</span><span class="a-display-value">{record.portSailedDate}</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortStayDiv',
                                bind: {
                                    hidden: '{record.portStayHide}',
                                    html: '<span class="a-display-label">Port stay:</span><span class="a-display-value"><b>{record.portStayDays}</b> days <b>{record.portStayHrs}</b> hrs <b>{record.portStayMins}</b> min</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortArrivedDiv',
                                bind: {
                                    hidden: '{record.portArrivedHide}',
                                    html: '<span class="a-display-label">Arrived:</span><span class="a-display-value">{record.portArrivedDate}</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortETADiv',
                                bind: {
                                    hidden: '{record.portEtaHide}',
                                    html: '<span class="a-display-label">ETA:</span><span class="a-display-value">{record.portEtaDate}</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortETDDiv',
                                bind: {
                                    hidden: '{record.portEtdHide}',
                                    html: '<span class="a-display-label">ETD:</span><span class="a-display-value">{record.portEtdDate}</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortCargoDiv',
                                bind: {
                                    hidden: '{record.portCargoHide}',
                                    html: '{record.cargo.cargo}',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'div .a-val-link',
                                        fn: function (me, el, eOpts) {
                                            const cargoes = this.component.upVM().get('record.cargo.cargoes');
                                            if (cargoes.length < 2) return;
                                            Abraxa.getApplication()
                                                .getController('AbraxaController')
                                                .showCargoesTooltip(cargoes, el);
                                        },
                                    },
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-display-item',
                                testId: 'voyagePortItineryPortCargoQtyDiv',
                                bind: {
                                    hidden: '{!record.portEventReason}',
                                    html: '<span class="a-display-label">Latest event:</span><span class="a-display-value a-badge-sof sof-{record.portEventType}">{record.portEventReason}</span>',
                                },
                            },
                        ],
                    },
                    // Appointment Info - Has Appointment & Appointment Accepted
                    {
                        xtype: 'container',
                        cls: 'a-item-appointment-info-rp',
                        flex: 1,
                        testId: 'voyagePortItineryPortAppointmentInfo',
                        layout: {
                            type: 'hbox',
                            align: 'start',
                        },
                        bind: {
                            hidden: '{!record.hasAppointment || !record.appointmentAccepted}',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-item-appointment-icon-rp',
                                margin: '8 0 0 0',
                                testId: 'voyagePortItineryPortAppointmentCheckIcon',
                                bind: {
                                    html: '<i class="md-icon md-18 c-green-500">check</i>',
                                },
                            },
                            {
                                xtype: 'container',
                                cls: 'a-item-appointment-info-content-rp',
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'c-blue-grey fs-12',
                                        testId: 'voyagePortItineryPortAppointmentTitleDiv',
                                        bind: {
                                            html: '{record.appointmentTitle} {record.appointmentDate ? "(" + record.appointmentDate + ")" : ""}',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-link',
                                        testId: 'voyagePortItineryPortAppointmentAgentDiv',
                                        bind: {
                                            html: '{record.appointedAgent}',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        margin: '2 0',
                                        testId: 'voyagePortItineryPortAppointmentDADiv',
                                        bind: {
                                            html: '<div class="a-val-hbox"><span class="a-badge-da-stage a-badge-da-stage-{record.daStageString}"></span><span class="fw-b text-uppercase mx-6">{record.daType}</span><span class="mr-8">{record.daStageName}</span><span>{record.daCurrency} {record.daAmount}</span></div>',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    // Appointment Info - Has Appointment & Appointment is Pending
                    {
                        xtype: 'container',
                        cls: 'a-item-appointment-info-rp',
                        bind: {
                            hidden: '{record.appointmentAccepted || !record.hasAppointment}',
                        },
                        testId: 'voyagePortItineryPortAppointmentAcceptedInfo',
                        flex: 1,
                        layout: {
                            type: 'hbox',
                            align: 'start',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-item-appointment-icon-rp',
                                margin: '8 0 0 0',
                                testId: 'voyagePortItineryPortAppointmentRejectedIcon',
                                bind: {
                                    html: '{record.rejected ?  "<i class=\'md-icon md-18 c-red\'>cancel</i>" : "<i class=\'md-icon md-18 c-yellow\'>schedule</i>"}',
                                },
                            },
                            {
                                xtype: 'container',
                                cls: 'a-item-appointment-info-content-rp',
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'c-blue-grey fs-12',
                                        testId: 'voyagePortItineryPortAppointmentRejectedTitleDiv',
                                        bind: {
                                            html: '{record.appointmentTitle} {record.appointmentDate ? "(" + record.appointmentDate + ")" : ""}',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-link d-block',
                                        testId: 'voyagePortItineryPortAppointmentRejectedAgentDiv',
                                        bind: {
                                            html: '{record.appointedAgent}',
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        margin: '8 0 0 0',
                                        ui: 'normal-light small',
                                        hidden: true,
                                        text: 'Appoint agent',
                                        testId: 'voyagePortItineryPortAppointmentRejectedAppointButton',
                                        handler: function (me) {
                                            let voyage = me.upVM().getParent().get('selectedVoyage');
                                            let record = me.upVM().get('record');
                                            if (voyage) {
                                                Ext.getCmp('main-viewport')
                                                    .getController()
                                                    .redirectTo(
                                                        'voyage/' + voyage.get('id') + '/appoint/' + record.get('id')
                                                    );
                                            }
                                        },
                                        bind: {
                                            hidden: '{!record.rejected}',
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    // Appointment Info - No appointment. Not appointed yet
                    {
                        xtype: 'container',
                        cls: 'a-item-appointment-info-rp',
                        testId: 'voyagePortItineryPortAppointmentNotAppointedInfo',
                        flex: 1,
                        layout: {
                            type: 'hbox',
                            align: 'start',
                        },
                        bind: {
                            hidden: '{record.appointmentAccepted || record.hasAppointment}',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-item-appointment-icon-rp',
                                testId: 'voyagePortItineryPortAppointmentNotAppointedIcon',
                                bind: {
                                    html: '<i class="md-icon md-18">info</i>',
                                },
                                tooltip: {
                                    width: 220,
                                    anchorToTarget: true,
                                    anchor: true,
                                    html: 'You have not yet chosen an agent. You can proceed with the appointment or request a quote.',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                            },
                            {
                                xtype: 'container',
                                cls: 'a-item-appointment-info-content-rp',
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'c-blue-grey fs-12',
                                        testId: 'voyagePortItineryPortAppointmentNotAppointedYetDiv',
                                        bind: {
                                            html: 'No appointment yet',
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        margin: '8 0 0 0',
                                        ui: 'normal-light small',
                                        testId: 'voyagePortItineryPortAppointmentNotAppointedAppointButton',
                                        text: 'Appoint agent',
                                        handler: function (me) {
                                            let voyage = me.upVM().getParent().get('selectedVoyage');
                                            let record = me.upVM().get('record');
                                            if (voyage) {
                                                Ext.getCmp('main-viewport')
                                                    .getController()
                                                    .redirectTo(
                                                        'voyage/' + voyage.get('id') + '/appoint/' + record.get('id')
                                                    );
                                            }
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                    //TODO waiting for decision
                    // {
                    //     xtype: 'container',
                    //     cls: 'a-item-actions-rp',
                    //     bind: {
                    //         hidden: '{record.appointmentAccepted || !record.hasAppointment}',
                    //     },
                    //     hideMode: 'opacity',
                    //     items: [
                    //         {
                    //             xtype: 'button',
                    //             ui: 'normal-light tool-md round',
                    //             iconCls: 'md-icon md-icon-notification-add',
                    //             tooltip: {
                    //                 anchorToTarget: true,
                    //                 anchor: true,
                    //                 html: 'Send reminder',
                    //                 align: 'bc-tc?',
                    //                 showDelay: 0,
                    //                 hideDelay: 0,
                    //                 dismissDelay: 0,
                    //                 allowOver: false,
                    //                 closeAction: 'destroy',
                    //             },
                    //         },
                    //     ],
                    // },
                ],
            },
        },
        // Docked Footer
        {
            xtype: 'container',
            cls: 'a-bgr-white a-bt-100',
            height: 57,
            padding: '0 24',
            docked: 'bottom',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'normal-light small',
                    iconCls: 'md-icon md-icon-edit',
                    testId: 'voyagePortItineryEditVoyageButton',
                    text: 'Edit voyage',
                    handler: 'onEditVoyageClick',
                },
            ],
        },
    ],
});
