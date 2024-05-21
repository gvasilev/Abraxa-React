import './AppointmentViewModel.jsx';
import './AppointmentGeneral.jsx';
import './AppointmentRightCard.jsx';
import './InstructionRightCard.jsx';
Ext.define('Abraxa.view.portcall.appointment.AppointmentMain', {
    extend: 'Ext.Container',
    xtype: 'appointment.main',
    viewModel: 'appointment-viewmodel',
    scrollable: true,
    weighted: true,
    layout: 'fit',
    bodyCls: 'a-ops-general-info a-layout-card-wrap',
    flex: 1,
    items: [
        {
            layout: 'hbox',
            plugins: {
                lazyitems: {
                    items: [
                        {
                            xtype: 'container',
                            docked: 'left',
                            cls: 'a-left-menu appointment_left_menu',
                            stateful: ['width', 'userCls'],
                            stateId: 'appointmentLeftMenu',
                            userCls: 'is-expanded',
                            reference: 'appointmentLeftMenu',
                            publishes: ['userCls'],
                            scrollable: true,
                            weight: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-menu-heading',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'sm-heading',
                                            html: '<h5>Appointment info</h5>',
                                        },
                                        {
                                            xtype: 'button',
                                            ui: 'round',
                                            iconCls: 'md-icon-outlined md-icon-first-page',
                                            focusable: false,
                                            bind: {
                                                tooltip: {
                                                    html: '<span class="tooltip_expand">{appointmentLeftMenu.userCls ? "Collapse <em>]</em>" : "Expand <em>]</em>"}</span>',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                    anchor: true,
                                                    align: 'bc-tc?',
                                                },
                                            },
                                            handler: function () {
                                                let panel = Ext.ComponentQuery.query('[cls~=appointment_left_menu]')[0],
                                                    cls = panel.getUserCls() == 'is-expanded';

                                                if (cls) {
                                                    panel.setUserCls(null);
                                                } else {
                                                    panel.setUserCls('is-expanded');
                                                }
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'list',
                                    margin: '0 0 0 0',
                                    deselectable: false,
                                    reference: 'appointmentMenu',
                                    variableHeights: true,
                                    store: {
                                        data: [
                                            {
                                                html: '<i class="md-icon-outlined">business_center</i><span>Appointment details</span>',
                                                tab: 'appointment',
                                                cls: 'chameleon_portcall_ops_general_tab',
                                                title: 'Appointment details',
                                                slug: 'appointment',
                                                subObject: 'appointment',
                                            },
                                        ],
                                    },
                                    itemConfig: {
                                        xtype: 'container',
                                        cls: 'a-item',
                                        viewModel: true,
                                        bind: {
                                            // permission: '{userPermissions}',
                                            slug: '{record.slug}',
                                            subObject: '{record.subObject}',
                                        },
                                        items: [
                                            {
                                                bind: {
                                                    tooltip: {
                                                        html: '{appointmentLeftMenu.userCls ? "" : "Appointment details"}',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                        // anchorToTarget: false,
                                                        align: 'bc-tc?',
                                                        anchor: true,
                                                    },
                                                    html: '<div class="hbox">{record.html}</div>',
                                                    cls: 'a-tab {record.cls}',
                                                },
                                            },
                                        ],
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.select(0);
                                        },
                                    },
                                },
                            ],
                        },
                        //Others
                        {
                            xtype: 'appointment.general',
                            hidden: false,
                            bind: {
                                hidden: '{hideMainAppointment}',
                            },
                        },
                        {
                            xtype: 'appointment.right.card',
                            hidden: true,
                            showAnimation: 'slide',
                            bind: {
                                hidden: '{cargoesGrid.selection && !cargoesGrid.selection.is_checked ? false : true}',
                            },
                        },
                        {
                            xtype: 'instruction.right.card',
                            hidden: true,
                            showAnimation: 'slide',
                            bind: {
                                hidden: '{selectedInstruction ? false : true}',
                            },
                        },
                    ],
                },
            },
        },
    ],
});
