Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaInquiry', {
    extend: 'Ext.Container',
    xtype: 'proforma.inquiry',
    cls: 'a-summary-left-container a-br-100',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    // Ugly fix
    maxHeight: '100%',
    bind: {
        hidden: '{inquiryMenu.selection.tab == "inquiry" ? false : true}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-vessel-image-card a-no-shadow',
            items: [
                {
                    xtype: 'image',
                    flex: 1,
                    margin: '24 24 0 24',
                    cls: 'br-8',
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

                                if (record.get('vessel') && record.get('vessel').imo == 5656) {
                                    Ext.create('AbraxaLiveShortVideo').show();
                                    return;
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
            cls: 'a-portcall-info a-bt-100',
            flex: 1,
            scrollable: true,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-portcall-data',
                    padding: '8 0 0 0',
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
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Enquiry ID',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.inquiry_id}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            // slug: 'portcallAssignTo',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
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
                                    html: 'Requesting party',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-business-center',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);"  data-email ="{object_record.requesting_party_email ? object_record.requesting_party_email :null}" title="{object_record.requesting_party_name ? object_record.requesting_party_name:"---"}">{object_record.requesting_party_name ? object_record.requesting_party_name:"---"}</a></div>',
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
                            // slug: 'portcallNominationVoyageNumber',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Voy. number',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.voyage_number ? object_record.voyage_number:"---"}</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            // slug: 'portcallNominationVoyageNumber',
                            // bind: {
                            // 	permission: '{userPermissions}',
                            // },
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Preferred currency',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-displayfield a-field-icon icon-rounded icon-short',
                                    bind: {
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.currency ? object_record.currency:"---"}</div>',
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
                            xtype: 'list',
                            deselectable: false,
                            inline: true,
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            store: [],
                            bind: {
                                store: '{object_record.ports}',
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
                                    },
                                },
                                xtype: 'container',
                                padding: '4 0',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'label',
                                        bind: {
                                            html: '{recordIndex == 0 ? "Port" :"Alternative ports"}',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-displayfield a-field-icon icon-rounded icon-port',
                                        bind: {
                                            html: '<div class="x-before-input-el"></div><div class="x-text-el"><a href="javascript:void(0);">{record.name}</a></div>',
                                        },
                                        listeners: {
                                            click: {
                                                element: 'element',
                                                delegate: 'a',
                                                fn: function (el) {
                                                    let me = this,
                                                        cmp = me.component,
                                                        porstsServed = cmp.upVM().get('portsServed'),
                                                        portId = cmp.upVM().get('record').get('id');
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.port_function}</div>',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{object_record.agency_type_name}</div>',
                                    },
                                },
                            ],
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
                    bind: {
                        hidden: '{object_record.cargoes.count ? false:true}',
                    },
                    items: [
                        {
                            xtype: 'title',
                            cls: 'a-title-md',
                            title: '<div class="a-badge a-badge-cargo my-8"><i></i></div>Cargoes',
                        },
                    ],
                },
                {
                    xtype: 'proforma.cargo',
                },
            ],
        },
    ],
});
