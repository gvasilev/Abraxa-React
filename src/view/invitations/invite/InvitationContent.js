Ext.define('Abraxa.view.invitations.invite.InvitationContent', {
    extend: 'Ext.Container',
    xtype: 'invitaion.content',
    flex: 1,
    scrollable: true,
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-portcall-image',
            layout: 'hbox',
            items: [
                {
                    xtype: 'image',
                    bind: {
                        src: '{vesselImage}',
                    },
                },
                {
                    xtype: 'container',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {
                                xtype: 'div',
                                cls: 'a-xtype-div',
                                flex: 1,
                            },
                            items: [
                                {
                                    bind: {
                                        html: '<div class="sm-title">Type</div><div class="fw-b">{vesselType}</div>',
                                    },
                                },
                                {
                                    bind: {
                                        html: '<div class="sm-title">Dwt</div><div class="fw-b">{vessel.dwt}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            defaults: {
                                xtype: 'div',
                                flex: 1,
                            },
                            items: [
                                {
                                    bind: {
                                        html: '<div class="sm-title">GT</div><div class="fw-b">{vessel.gt}</div>',
                                    },
                                },
                                {
                                    bind: {
                                        html: '<div class="sm-title">LOA</div><div class="fw-b">{vessel.loa}</div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'div',
            cls: 'a-portcall-archived',
            hidden: true,
            bind: {
                hidden: '{portcall.is_archived ? false : true}',
                html: '<i class="md-icon-outlined">info</i><span>{portcall.archived_reason}</span>',
            },
        },
        {
            xtype: 'container',
            cls: 'a-portcall-data',
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            cls: 'a-title-md',
                            title: '<div class="a-badge a-badge-general my-8"><i class="md-icon-outlined">edit_note</i></div>General info',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-data-item',
                    slug: 'portcallFileID',
                    bind: {
                        hidden: '{currentUserType == "principal" ? true:false}',
                        permission: '{userPermissions}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
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
                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.file_id ? portcall.file_id:"---" }</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-data-item',
                    bind: {
                        hidden: '{hidePersonIncharge}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: 'Assigned to',
                        },
                        {
                            xtype: 'public.updated.by',
                            bind: {
                                data: {
                                    user: '{portcall.assignee}',
                                    // pic: '{portcall.person_in_charge}',
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-data-item',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
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
                    cls: 'a-data-item',
                    slug: 'portcallVoyNo',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    bind: {
                        hidden: '{currentUserType == "principal" ? false:true}',
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: 'Voy number',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                            bind: {
                                html: '<div class="x-before-input-el"></div><div class="x-text-el">{voyage.voyage_number ? voyage.voyage_number:"---"}</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-data-item',
                    slug: 'portcallAssignTo',
                    bind: {
                        hidden: '{dialog ? false:true}',
                        permission: '{userPermissions}',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'center',
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
                                        var user = this.component.upVM().get('portcall').get('assignee');
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
                    cls: 'a-data-item',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                    },
                    items: [
                        {
                            xtype: 'label',
                            html: 'Port name',
                        },
                        {
                            xtype: 'div',
                            cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                            bind: {
                                html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{portcall.port_name}</a></div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'a',
                                    fn: function (el) {
                                        let me = this,
                                            cmp = me.component,
                                            portId = null;
                                        if (cmp.upVM().get('portcall').port_id) {
                                            portId = cmp.upVM().get('portcall').port_id;
                                        } else {
                                            portId = cmp.upVM().get('portcall').get('port_id');
                                        }
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
                    xtype: 'div',
                    cls: 'my-8',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            cls: 'a-title-md',
                            title: '<div class="a-badge a-badge-nomination my-8"><i class="md-icon-outlined">business_center</i></div>Nomination info',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    slug: 'portcallAppointmentNominationInfo',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Appointing party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    html: '',
                                    bind: {
                                        html: '{portcallHtml || invitationHtml}',
                                    },
                                    // Here a viewModel is necessary to ALWAYS return the html binding value different from undefined,
                                    // because Ext.js bindings have the bug that if initially the value was undefined,
                                    // later on change of the values to strings (or wahtever), they would not be reflected in the view.
                                    // This component is used in several different views with different viewModels.
                                    // Adding viewModel here makes sure to get the portcall OR invitation values, depending on the parent viewModel,
                                    // and if not available initially - the values to be set to **empty string**.

                                    // TODO: Maybe it's not a good idea to use the same component in different contexts, with different parent ViewModels.
                                    // In future refactoring, it would be better to create a separate component for each context.
                                    viewModel: {
                                        data: {
                                            // make sure values are never undefined
                                            portcallHtml: '',
                                            invitationHtml: '',
                                        },
                                        formulas: {
                                            portcallHtml: {
                                                bind: {
                                                    bindTo: '{portcall}',
                                                    deep: true,
                                                },
                                                get: function (portcall) {
                                                    if (!portcall || !portcall.getNomination()) return '';
                                                    const nomination = portcall.getNomination();
                                                    const name = nomination.get('appointing_party_name');
                                                    const email = nomination.get('appointing_party_email');
                                                    const viewModel = this;
                                                    return viewModel.getHtmlString(name, email);
                                                },
                                            },

                                            invitationHtml: {
                                                bind: {
                                                    bindTo: '{invitation}',
                                                    deep: true,
                                                },
                                                get: function (invitation) {
                                                    if (!invitation || !invitation.company) return '';
                                                    const name = invitation.company.name;
                                                    const email = invitation.company.email;
                                                    const viewModel = this;
                                                    return viewModel.getHtmlString(name, email);
                                                },
                                            },
                                        },
                                        getHtmlString: function (name, email) {
                                            if (!name) return '';
                                            let htmlString = '<div class="x-before-input-el"></div>';
                                            htmlString += '<div class="x-text-el">';
                                            if (email) {
                                                htmlString +=
                                                    '<a href="javascript:void(0);" data-email ="' + email + '">';
                                            }

                                            htmlString += name;
                                            if (email) {
                                                htmlString += '</a>';
                                            }
                                            htmlString += '</div>';
                                            return htmlString;
                                        },
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
                            cls: 'a-data-item',
                            slug: 'portcallNominationVoyageNumber',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.voyage_number ? portcall.nomination.voyage_number:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Nominating party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.nominating_party_email ? portcall.nomination.nominating_party_email :null}">{portcall.nomination.nominating_party_name ? portcall.nomination.nominating_party_name:"---"}</a></div>',
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
                            cls: 'a-data-item',
                            slug: 'portcallNominationReference',
                            bind: {
                                hidden: '{currentUserType == "principal" ? true:false}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.nomination_reference ? portcall.nomination.nomination_reference:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'portcallNominationDateReceived',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
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
                            cls: 'a-data-item',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Agency type',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.agency_type_name ? portcall.nomination.agency_type_name:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            bind: {
                                hidden: '{portcall.nomination.lead_agent_id ? false:true}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);" data-email ="{portcall.nomination.lead_agent_email ? portcall.nomination.lead_agent_email :null}">{portcall.nomination.lead_agent_name ? portcall.nomination.lead_agent_name:"---"}</a></div>',
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
                            cls: 'a-data-item',
                            slug: 'portcallAppointmentNominationInfo',
                            bind: {
                                hidden: '{portcall.nomination.sub_agent_id ? false:true}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{portcall.nomination.sub_agent_name ? portcall.nomination.sub_agent_name:"---"}</a></div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-data-item',
                            slug: 'portcallAppointmentNominationInfo',
                            bind: {
                                hidden: '{portcall.nomination.hub_reference ? false:true}',
                                permission: '{userPermissions}',
                            },
                            layout: {
                                type: 'hbox',
                                align: 'center',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{portcall.nomination.hub_reference ? portcall.nomination.hub_reference:"---"}</div>',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'abraxa.formlist',
            cls: 'a-portcall-data a-cargo-data a-bt-100',
            padding: '8 0 0 0',
            margin: '8 0 0 0',
            bind: {
                store: '{portcall.nomination.cargoes}',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        recordIndex: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    let store = record.store;
                                    return store.indexOf(record);
                                }
                            },
                        },
                        functionIcon: {
                            bind: {
                                bindTo: '{record.function}',
                                deep: true,
                            },
                            get: function (func) {
                                let str = '';
                                if (func) {
                                    switch (func) {
                                        case 'Loading':
                                            str = 'L';
                                            break;
                                        case 'Discharging':
                                            str = 'D';
                                            break;
                                        case 'Transshipment':
                                            str = 'TS';
                                            break;
                                        case 'Lightering':
                                            str = 'LT';
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                return str;
                            },
                        },
                    },
                },
                xtype: 'container',
                cls: 'a-cargo-container',
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-cargo-titlebar',
                        items: [
                            {
                                xtype: 'div',
                                cls: 'hbox',
                                bind: {
                                    html: '<div class="a-badge a-badge-cargo mr-16"><i></i></div><div><div class="a-cargo-title"><span class="a-qty">{record.quantity:number("0,000.###")} {record.unit}</span><span class="a-commodity">{record.commodity}</span><span class="a-function a-function-sm function-{record.function ? record.function : ""}" title="{record.function ? record.function : ""}">{functionIcon}</span></div><div class="a-cargo-subtitle">#Cargo-{recordIndex + 1}</div></div>',
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            xtype: 'container',
            cls: 'a-portcall-extra',
            //
            bind: {
                hidden: '{attachmentInstructionsVisible}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-instructions',
                    flex: 1,
                    bind: {
                        // hidden: '{instructionsVisible}',
                        hidden: '{instructions.count ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">description</i></div>Instructions',
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.formlist',
                            padding: '0 24 0 72',
                            // minHeight: 280,
                            slug: 'portcallVoyInstructions',
                            showNoPermissions: true,
                            bind: {
                                permission: '{userPermissions}',
                                store: '{instructions}',
                            },
                            itemTpl: null,
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-portcall-instructions-item',
                                bind: {
                                    hidden: '{instructionsVisible}',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'fw-b fs-16',
                                        bind: {
                                            html: '{record.title}',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-portcall-instructions-description',
                                        bind: {
                                            html: '<p>{record.description_short}</p>',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-portcall-attachments',
                    slug: 'portcallAttachments',
                    hidden: true,
                    bind: {
                        items: '{attachmentItems}',
                        // hidden: '{attachmentsVisible}',
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-data a-declined-container',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            hidden: true,
            bind: {
                hidden: '{invitation.status == "Declined" ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Declined reason',
                        },
                    ],
                },
                {
                    padding: '0 24',
                    bind: {
                        html: '{invitation.declined_reason}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-portcall-data a-archive-comment',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            hidden: true,
            bind: {
                hidden: '{portcall.is_archived ? false : true}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    items: [
                        {
                            xtype: 'title',
                            title: 'Archive comment',
                        },
                    ],
                },
                {
                    padding: '0 24',
                    bind: {
                        html: '{portcall.archived_comment}',
                    },
                },
            ],
        },
    ],
});
