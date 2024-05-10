Ext.define('Abraxa.view.portcall.summary.SummaryLeftContainer', {
    extend: 'Ext.Container',
    xtype: 'portcall.summary.left.container',
    testId: 'portcallSummaryLeft',
    cls: 'a-summary-left-container chameleon_portcall_overview_general_data',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-vessel-image-card',
            items: [
                {
                    xtype: 'image',
                    flex: 1,
                    bind: {
                        src: '{vesselImage}',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-vessel-title',
                    bind: {
                        html: '{vesselTitle}',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'a.vessel',
                            fn: function () {
                                let imo,
                                    record = this.component.upVM().get('voyage');
                                if (record.get('vessel')) {
                                    imo = record.get('vessel').id;
                                }
                                if (record.get('custom_vessel_id')) {
                                    if (record.get('custom_vessel').company_id) {
                                        imo = record.get('custom_vessel').id;
                                    }
                                }

                                if (imo) {
                                    Abraxa.getApplication().getController('AbraxaController').showVesselDialog(imo);
                                }
                            },
                        },
                    },
                },
            ],
        },
        {
            cls: 'a-portcall-info',
            padding: '16 0 0 0',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    defaults: {
                        cls: 'a-data-item',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            slug: 'portcallFileID',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'File ID',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.file_id ? object_record.file_id:"---" }</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            slug: 'portcallAssignTo',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Assigned to',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield',
                                    bind: {
                                        html: '<div class="x-before-input-el">{assignTo}</div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a.person_details',
                                            fn: function fn(el) {
                                                var user = this.component.upVM().get('object_record').get('assignee');
                                                if (user) {
                                                    let tipExist = Ext.getCmp('createdByTool');
                                                    if (tipExist) {
                                                        tipExist.destroy();
                                                    }
                                                    Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                                        target: el.target,
                                                        id: 'createdByTool',
                                                        viewModel: {
                                                            data: {
                                                                user: user,
                                                                clickedElement: el.target,
                                                            },
                                                        },
                                                    }).showBy(el, 'bc-tc?');
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'ETA',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{etaRendererDate}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Port name',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{object_record.port_name}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let me = this,
                                                    cmp = me.component,
                                                    porstsServed = cmp.upVM().get('portsServed'),
                                                    portId = cmp.upVM().get('object_record').get('port_id');
                                                if (portId) {
                                                    Abraxa.getApplication()
                                                        .getController('AbraxaController')
                                                        .showPortDialogById(portId);
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Appointing party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);"  data-email ="{object_record.nomination.appointing_party_email ? object_record.nomination.appointing_party_email :null}" title="{object_record.nomination.appointing_party_name ? object_record.nomination.appointing_party_name:"---"}">{object_record.nomination.appointing_party_name ? object_record.nomination.appointing_party_name:"---"}</a></div>',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            delegate: 'a',
                                            fn: function (el) {
                                                let email = el.currentTarget.getAttribute('data-email');
                                                if (email) {
                                                    let organizations = this.component.upVM().get('organizations'),
                                                        orgRecord = organizations.findRecord(
                                                            'org_email',
                                                            email,
                                                            0,
                                                            false,
                                                            false,
                                                            true
                                                        );
                                                    if (orgRecord) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showOrganizationTooltip(orgRecord.get('org_id'), el);
                                                    } else if (email) {
                                                        Abraxa.getApplication()
                                                            .getController('AbraxaController')
                                                            .showTenantByEmail(email, el);
                                                    }
                                                }
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            layout: 'vbox',
                            slug: 'portcallAppointmentNominationInfo',
                            padding: 0,
                            bind: {
                                permission: '{userPermissions}',
                            },
                            defaults: {
                                cls: 'a-data-item',
                                layout: {
                                    type: 'hbox',
                                    align: 'center',
                                },
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    slug: 'portcallNominationVoyageNumber',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Voy. number',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.nomination.voyage_number ? object_record.nomination.voyage_number:"---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Nominating party',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);"  data-email ="{object_record.nomination.nominating_party_email ? object_record.nomination.nominating_party_email :null}" title="{object_record.nomination.nominating_party_name ? object_record.nomination.nominating_party_name:"---"}">{object_record.nomination.nominating_party_name ? object_record.nomination.nominating_party_name:"---"}</a></div>',
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'a',
                                                    fn: function (el) {
                                                        let email = el.currentTarget.getAttribute('data-email');
                                                        if (email) {
                                                            let organizations = this.component
                                                                    .upVM()
                                                                    .get('organizations'),
                                                                orgRecord = organizations.findRecord(
                                                                    'org_email',
                                                                    email,
                                                                    0,
                                                                    false,
                                                                    false,
                                                                    true
                                                                );
                                                            if (orgRecord) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showOrganizationTooltip(
                                                                        orgRecord.get('org_id'),
                                                                        el
                                                                    );
                                                            } else if (email) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showTenantByEmail(email, el);
                                                            }
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    slug: 'portcallNominationReference',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Nomination reference',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.nomination.nomination_reference ? object_record.nomination.nomination_reference:"---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    slug: 'portcallNominationDateReceived',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Date received',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-date',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{dateReceived}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Port function',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portFunction}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Agency type',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.nomination.agency_type_name ? object_record.nomination.agency_type_name:"---"}</div>',
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    bind: {
                                        hidden: '{object_record.nomination.lead_agent_id ? false:true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Lead agent',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{object_record.nomination.lead_agent_email ? object_record.nomination.lead_agent_email :null}" title="{object_record.nomination.lead_agent_name ? object_record.nomination.lead_agent_name:"---"}">{object_record.nomination.lead_agent_name ? object_record.nomination.lead_agent_name:"---"}</a></div>',
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'a',
                                                    fn: function (el) {
                                                        let email = el.currentTarget.getAttribute('data-email');
                                                        if (email) {
                                                            let organizations = this.component
                                                                    .upVM()
                                                                    .get('organizations'),
                                                                orgRecord = organizations.findRecord(
                                                                    'org_email',
                                                                    email,
                                                                    0,
                                                                    false,
                                                                    false,
                                                                    true
                                                                );
                                                            if (orgRecord) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showOrganizationTooltip(
                                                                        orgRecord.get('org_id'),
                                                                        el
                                                                    );
                                                            } else if (email) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showTenantByEmail(email, el);
                                                            }
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    slug: 'portcallNominationAgencyStructure',
                                    bind: {
                                        hidden: '{object_record.nomination.sub_agent_id ? false:true}',
                                        permission: '{userPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Sub agent',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{object_record.nomination.sub_agent_email ? object_record.nomination.sub_agent_email :null}" title="{object_record.nomination.sub_agent_name ? object_record.nomination.sub_agent_name:"---"}">{object_record.nomination.sub_agent_name ? object_record.nomination.sub_agent_name:"---"}</a></div>',
                                            },
                                            listeners: {
                                                click: {
                                                    element: 'element',
                                                    delegate: 'a',
                                                    fn: function (el) {
                                                        let email = el.currentTarget.getAttribute('data-email');
                                                        if (email) {
                                                            let organizations = this.component
                                                                    .upVM()
                                                                    .get('organizations'),
                                                                orgRecord = organizations.findRecord(
                                                                    'org_email',
                                                                    email,
                                                                    0,
                                                                    false,
                                                                    false,
                                                                    true
                                                                );
                                                            if (orgRecord) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showOrganizationTooltip(
                                                                        orgRecord.get('org_id'),
                                                                        el
                                                                    );
                                                            } else if (email) {
                                                                Abraxa.getApplication()
                                                                    .getController('AbraxaController')
                                                                    .showTenantByEmail(email, el);
                                                            }
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    slug: 'portcallNominationAgencyStructure',
                                    bind: {
                                        hidden: '{object_record.nomination.hub_reference ? false:true}',
                                        permission: '{userPermissions}',
                                    },
                                    items: [
                                        {
                                            xtype: 'label',
                                            html: 'Hub reference',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                            bind: {
                                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.nomination.hub_reference ? object_record.nomination.hub_reference:"---"}</div>',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },

                        // {
                        //     xtype: 'container',
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Record owner',
                        //     }, {
                        //         xtype: 'div',
                        //         cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                        //         bind: {
                        //             html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{leadAgent ? leadAgent.email :null}">{leadAgent ? leadAgent.name :"---"}</a></div>'
                        //         },
                        //         listeners: {
                        //             click: {
                        //                 element: "element",
                        //                 delegate: "a",
                        //                 fn: function (el) {
                        //                     let email = el.currentTarget.getAttribute("data-email");
                        //                     if (email) {
                        //                         let organizations = this.component.upVM().get('organizations'),
                        //                             orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
                        //                         if (orgRecord) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showOrganizationTooltip(orgRecord.get('org_id'), el);
                        //                         } else if (email) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                        //                         }
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }]
                        // },
                        // {
                        //     xtype: 'container',
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Principal',
                        //     }, {
                        //         xtype: 'div',
                        //         cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                        //         bind: {
                        //             html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email="{principal.org_email}">{principal.org_name}</a></div>'
                        //         },
                        //         listeners: {
                        //             click: {
                        //                 element: "element",
                        //                 delegate: "a",
                        //                 fn: function (el) {
                        //                     let email = el.currentTarget.getAttribute("data-email");
                        //                     if (email) {
                        //                         let organizations = this.component.upVM().get('organizations'),
                        //                             orgRecord = organizations.findRecord('org_email', email, 0, false, false, true);
                        //                         if (orgRecord) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showOrganizationTooltip(orgRecord.get('org_id'), el);
                        //                         } else if (email) {
                        //                             Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                        //                         }
                        //                     }
                        //                     // if (email) {
                        //                     //     Abraxa.getApplication().getController('AbraxaController').showTenantByEmail(email, el);
                        //                     // }
                        //                 }
                        //             }
                        //         }
                        //     }]
                        // },
                        // {
                        //     xtype: 'container',
                        //     slug: 'portcallVoyNo',
                        //     bind: {
                        //         permission: '{userPermissions}'
                        //     },
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Voy number',
                        //     }, {
                        //         xtype: 'div',
                        //         cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                        //         bind: {
                        //             html: '<div class="x-before-input-el"></div><div class="x-text-el">{voyage.voyage_number ? voyage.voyage_number:"---"}</div>'
                        //         }
                        //     }]
                        // },
                        // {
                        //     xtype: 'container',
                        //     items: [{
                        //         xtype: 'label',
                        //         html: 'Funded',
                        //     }, {
                        //         xtype: 'div',
                        //         bind: {
                        //             cls: 'a-finance-status hbox {object_record.funded == 1 ? "funded" : "not-funded"}',
                        //             html: '<i class="material-icons md-18 ml-4 mr-12 c-green">check</i>{object_record.funded == 1 ? "Funded" : "Not Funded"}',
                        //         }
                        //     }]
                        // }
                    ],
                },
                {
                    xtype: 'portcall.summary.cargo.card',
                },
            ],
        },
    ],
});
