import './VoyageViewModel';
import './VoyageController';
import './VoyageAppointment';
import './AppointPreview';

Ext.define('Abraxa.view.voyage.VoyageMainView', {
    extend: 'Ext.Container',
    xtype: 'VoyageMainView',
    testId: 'voyageMainView',
    cls: 'a-card-layout-main-container a-voyage-main-container',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    viewModel: 'VoyageViewModel',
    controller: 'VoyageController',
    reference: 'voyageRecord',
    publishes: ['record'],
    items: [
        {
            xtype: 'container',
            cls: 'a-card-layout-inner-container',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-port-details-header',
                    docked: 'top',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-header-title-bar',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'tool',
                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                    margin: '0 16 0 0',
                                    ui: 'tool-lg',
                                    handler: function () {
                                        window.history.back();
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-header-title">{object_record.vessel.name} <span class="fw-n c-blue-grey">(Voy-{object_record.id})</span></div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-card-layout-inner-container',
            layout: 'vbox',
            items: [
                // Voyage details
                {
                    xtype: 'container',
                    bind: {
                        hidden: '{object_record.hideable ? true:false}',
                    },
                    cls: 'a-card-container',
                    items: [
                        // Card Header
                        {
                            xtype: 'container',
                            cls: 'a-card-header',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'title',
                                    title: 'Voyage details',
                                    testId: 'voyageMainViewVoyageDetailsTitle',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'normal-light small',
                                    iconCls: 'md-icon md-icon-edit edit_voyage',
                                    text: 'Edit voyage',
                                    testId: 'voyageMainViewEditVoyageButton',
                                },
                            ],
                        },
                        // Card Body
                        {
                            xtype: 'container',
                            cls: 'a-card-body',
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1.25,
                                    margin: '0 32 0 0',
                                    defaults: {
                                        xtype: 'container',
                                        cls: 'a-display-item',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        defaults: {
                                            xtype: 'div',
                                        },
                                    },
                                    items: [
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Voy. ID',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{object_record.voyage_number}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Reference',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{object_record.reference_number ? object_record.reference_number : "---"}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Legal entity',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{object_record.office ? object_record.office.office_name : "---"}',
                                                    },
                                                    // html: '<div class="a-link">Cargill - Commercial (Bulkers)</div>'
                                                },
                                            ],
                                        },
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Operator',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{object_record.assigned_user.full_name ? object_record.assigned_user.full_name : "---"}',
                                                    },
                                                    // html: '<div class="a-link">Krastin Krastev</div>'
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    flex: 2,
                                    defaults: {
                                        xtype: 'container',
                                        cls: 'a-display-item',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        defaults: {
                                            xtype: 'div',
                                        },
                                    },
                                    items: [
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Voyage',
                                                },
                                                {
                                                    xtype: 'list',
                                                    cls: 'a-display-value a-display-value-list',
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                    },
                                                    bind: {
                                                        store: '{portcalls}',
                                                    },
                                                    itemConfig: {
                                                        xtype: 'div',
                                                        cls: 'a-display-value-list-item',
                                                        viewModel: true,
                                                        bind: {
                                                            html: '{record.port.name}',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Voyage type',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{voyageType}',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            items: [
                                                {
                                                    cls: 'a-display-label',
                                                    html: 'Last updated',
                                                },
                                                {
                                                    cls: 'a-display-value',
                                                    bind: {
                                                        html: '{updatedBy}',
                                                    },
                                                    // html: '14 Jun - 12:43 by <div class="a-link">Ivan Ivanov</div>'
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                // Spacer
                {
                    xtype: 'div',
                    height: 8,
                },
                // Port Itinerary
                {
                    xtype: 'container',
                    cls: 'a-card-container',
                    hidden: false,
                    bind: {
                        hidden: '{proceedAppointment ? true:false}',
                    },
                    items: [
                        // Card Header
                        {
                            xtype: 'container',
                            cls: 'a-card-header',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    padding: '12 0 0 0',
                                    items: [
                                        {
                                            xtype: 'title',
                                            title: 'Port itinerary',
                                            testId: 'voyageMainViewPortItineraryTitle',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'fs-13 c-grey',
                                            html: 'Choose one or multiple ports to proceed with your appointment',
                                        },
                                    ],
                                },
                            ],
                        },
                        // Card Body
                        {
                            xtype: 'container',
                            cls: 'a-card-body',
                            padding: '0 0 24 0',
                            items: [
                                {
                                    xtype: 'abraxa.formlist',
                                    cls: 'a-itinerary-list portcalls-list',
                                    reference: 'appointmentList',
                                    testId: 'voyageMainViewAppointmentList',
                                    padding: 0,
                                    selectable: {
                                        deselectable: false,
                                    },
                                    bind: {
                                        store: '{portcalls}',
                                    },
                                    itemConfig: {
                                        viewModel: {
                                            formulas: {
                                                appointmentAccepted: {
                                                    bind: {
                                                        bindTo: '{record}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        if (record) {
                                                            if (
                                                                record &&
                                                                record.invitations() &&
                                                                record.invitations().getCount()
                                                            ) {
                                                                let invitationAppointed = record
                                                                    .invitations()
                                                                    .findRecord(
                                                                        'status',
                                                                        'Accepted',
                                                                        0,
                                                                        false,
                                                                        false,
                                                                        true
                                                                    );
                                                                if (invitationAppointed) {
                                                                    record.set('appointmentTitle', 'Appointed agent');
                                                                    record.set(
                                                                        'appointedAgent',
                                                                        record.getNomination().get('lead_agent_name')
                                                                    );
                                                                    record.set(
                                                                        'appointmentStatusIcon',
                                                                        "<i class='md-icon md-18 c-green-500'>check</i>"
                                                                    );
                                                                    record.set('appointmentAccepted', true);
                                                                    return true;
                                                                } else {
                                                                    let invitationDeclined = record
                                                                        .invitations()
                                                                        .findRecord(
                                                                            'status',
                                                                            'Declined',
                                                                            0,
                                                                            false,
                                                                            false,
                                                                            true
                                                                        );
                                                                    if (invitationDeclined) {
                                                                        record.set(
                                                                            'appointmentTitle',
                                                                            'Rejected appointment'
                                                                        );
                                                                        record.set(
                                                                            'appointedAgent',
                                                                            record
                                                                                .getNomination()
                                                                                .get('lead_agent_name')
                                                                        );
                                                                        record.set(
                                                                            'appointmentStatusIcon',
                                                                            "<i class='md-icon md-18 c-red'>cancel</i>"
                                                                        );
                                                                        record.set('appointmentAccepted', false);
                                                                        return false;
                                                                    } else {
                                                                        record.set(
                                                                            'appointmentTitle',
                                                                            'Pending appointment'
                                                                        );
                                                                        record.set(
                                                                            'appointedAgent',
                                                                            record
                                                                                .getNomination()
                                                                                .get('lead_agent_name')
                                                                        );
                                                                        record.set(
                                                                            'appointmentStatusIcon',
                                                                            "<i class='md-icon md-18 c-yellow'>schedule</i>"
                                                                        );
                                                                        record.set('appointmentAccepted', false);
                                                                        return false;
                                                                    }
                                                                }
                                                            }
                                                            return false;
                                                        }
                                                        return false;
                                                    },
                                                },
                                            },
                                        },
                                        xtype: 'container',
                                        cls: 'a-itinerary-list-item',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'space-between',
                                        },
                                        items: [
                                            {
                                                xtype: 'checkboxfield',
                                                testId: 'voyageMainViewAppointmentListCheckbox',
                                                with: 30,
                                                height: 30,
                                                label: false,
                                                bind: {
                                                    checked: '{record.is_checked ? true : false}',
                                                },
                                                cls: 'a-item-check-button',
                                                ui: 'tool-sm round',
                                                iconCls: 'md-icon md-icon-check-circle',
                                                listeners: {
                                                    check: function (me) {
                                                        let record = me.upVM().get('record');
                                                        if (record) {
                                                            me.up('list')
                                                                .getStore()
                                                                .each(function (record) {
                                                                    record.set('is_checked', false);
                                                                });
                                                            record.set('is_checked', true);
                                                            if (
                                                                Ext.ComponentQuery.query(
                                                                    '[ui~=proceed_appoint]'
                                                                )[0].isHidden()
                                                            ) {
                                                                Ext.ComponentQuery.query(
                                                                    '[ui~=proceed_appoint]'
                                                                )[0].setHidden(false);
                                                            }
                                                        }
                                                    },
                                                    uncheck: function (me) {
                                                        let record = me.upVM().get('record');
                                                        if (record) {
                                                            if (
                                                                !Ext.ComponentQuery.query(
                                                                    '[ui~=proceed_appoint]'
                                                                )[0].isHidden()
                                                            ) {
                                                                Ext.ComponentQuery.query(
                                                                    '[ui~=proceed_appoint]'
                                                                )[0].setHidden(true);
                                                            }
                                                            record.set('is_checked', false);
                                                            me.up('list')
                                                                .getStore()
                                                                .each(function (record) {
                                                                    if (record.get('is_checked')) {
                                                                        Ext.ComponentQuery.query(
                                                                            '[ui~=proceed_appoint]'
                                                                        )[0].setHidden(false);
                                                                    }
                                                                });
                                                        }
                                                    },
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-item-port-container',
                                                flex: 1,
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        bind: {
                                                            html: '<span class="fw-b">{record.port.name}, {record.port.country.country_code}</span> ({record.nomination.port_function})',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        cls: 'c-blue-grey fs-13',
                                                        bind: {
                                                            html: 'ETA: {record.port_eta ? (record.port_eta:date("d M y - H:i")) : "---"}',
                                                        },
                                                    },
                                                ],
                                            },
                                            // {
                                            // 	xtype: 'div',
                                            // 	cls: 'a-item-unknown-container',
                                            // 	flex: 1,
                                            // 	html: ''
                                            // },
                                            {
                                                xtype: 'container',
                                                cls: 'a-item-appointment-container',
                                                flex: 1,
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                },
                                                hideMode: 'opacity',
                                                bind: {
                                                    hidden: '{!record.invitations.count}',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        cls: 'a-item-appointment-icon',
                                                        bind: {
                                                            html: '{record.appointmentStatusIcon}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-item-appointment-info-container',
                                                        items: [
                                                            {
                                                                xtype: 'div',
                                                                cls: 'c-blue-grey fs-12',
                                                                bind: {
                                                                    html: '{record.appointmentTitle} {record.appointmentDate ? "(" + record.appointmentDate + ")" : ""}',
                                                                },
                                                            },
                                                            {
                                                                xtype: 'div',
                                                                cls: 'a-link',
                                                                bind: {
                                                                    html: '{record.appointedAgent}',
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'button',
                                                ui: 'tool-sm normal round raised',
                                                iconCls: 'md-icon md-icon-navigate-next',
                                                testId: 'voyageMainViewDetailsButton',
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    align: 'bc-tc?',
                                                    anchor: true,
                                                    html: 'View details',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    closeAction: 'destroy',
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'VoyageAppointment',
                    hidden: true,
                    bind: {
                        hidden: '{proceedAppointment ? false:true}',
                    },
                },
            ],
        },
        // Card Footer Docked
        {
            xtype: 'container',
            docked: 'bottom',
            cls: 'a-card-footer',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-card-footer-inner-md',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            flex: 1,
                            hidden: true,
                            bind: {
                                hidden: '{!proceedAppointment ? false:true}',
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'default outlined',
                            hidden: true,
                            cls: 'preview_draft',
                            bind: {
                                hidden: '{proceedAppointment ? false:true}',
                            },
                            text: 'Preview',
                            testId: 'voyageMainViewPreviewButton',
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'button',
                                    hidden: true,
                                    enableToggle: true,
                                    ui: 'action loading proceed_appoint',
                                    text: 'Proceed to appointment',
                                    testId: 'voyageMainViewProceedToAppointmentButton',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'default outlined',
                                    margin: '0 8',
                                    hidden: true,
                                    cls: 'cancel_agent',
                                    bind: {
                                        hidden: '{proceedAppointment && !activePortcall.is_locked_for_editing ? false:true}',
                                    },
                                    text: 'Cancel',
                                    testId: 'voyageMainViewCancelAppointmentButton',
                                },

                                {
                                    xtype: 'button',
                                    hidden: true,
                                    bind: {
                                        hidden: '{proceedAppointment && !activePortcall.is_locked_for_editing ? false:true}',
                                    },
                                    enableToggle: true,
                                    ui: 'action loading appoint_agent',
                                    text: 'Appoint agent',
                                    testId: 'voyageMainViewAppointAgentButton',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-item-appointment-container text-left',
                            padding: '0 16',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            hidden: true,
                            bind: {
                                hidden: '{!pendingAgent}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-item-appointment-icon mr-12',
                                    html: '<i class="md-icon md-18 c-yellow">schedule</i>',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-item-appointment-info-container',
                                    items: [
                                        {
                                            cls: 'c-blue-grey fs-12',
                                            html: 'Pending appointment ',
                                            testId: 'voyageMainViewPendingAppointmentTitle',
                                        },
                                        {
                                            cls: 'a-link',
                                            testId: 'voyageMainViewPendingAppointmentAgentName',
                                            bind: {
                                                html: '{pendingAgent.lead_agent_name}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-item-appointment-container text-left',
                            padding: '0 16',
                            hidden: true,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            bind: {
                                hidden: '{!appointedAgent}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-item-appointment-icon mr-12',
                                    html: '<i class="md-icon md-18 c-green">check</i>',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'a-item-appointment-info-container',
                                    items: [
                                        {
                                            cls: 'c-blue-grey fs-12',
                                            html: 'Appointed agent ',
                                            testId: 'voyageMainViewAppointedAgentTitle',
                                        },
                                        {
                                            cls: 'a-link',
                                            testId: 'voyageMainViewAppointedAgentName',
                                            bind: {
                                                html: '{appointedAgent.lead_agent_name}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'button',
            ui: 'tool-lg round',
            iconCls: 'md-icon md-icon-close',
            cls: 'cancel_agent',
            testId: 'voyageMainViewCancelAgentButton',
            top: 16,
            right: 16,
        },
    ],
    loadRecord: function (id, appointmentId) {
        let viewRecord = this.getRecord();
        if (viewRecord && viewRecord.get('id') == id) {
            if (appointmentId) {
                this.upVM().set('appointmentId', appointmentId);
            } else {
                this.upVM().set('appointmentId', null);
            }
            return;
        }
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        let voyage = Ext.create('Abraxa.model.voyage.Voyage', {
            id: id,
        });
        voyage.load({
            scope: this,
            success: function (record, operation) {
                this.setRecord(record);
                if (appointmentId) {
                    this.upVM().set('appointmentId', appointmentId);
                } else {
                    this.upVM().set('appointmentId', null);
                }
                Ext.getCmp('main-viewport').setMasked(false);
            },
            failure: function (record, operation) {
                Ext.Msg.alert('Error', 'Could not load record');
            },
        });
    },
});
