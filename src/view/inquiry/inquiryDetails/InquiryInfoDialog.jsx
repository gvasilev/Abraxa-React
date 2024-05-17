Ext.define('Abraxa.view.inquiry.inquiryDetails.InquiryInfoDialog', {
    extend: 'Ext.Dialog',
    xtype: 'inquiry.info.dialog',
    cls: 'a-dialog-create a-dialog-portcall-info',
    manageBorders: false,
    scrollable: 'y',
    minWidth: 640,
    maxWidth: 640,
    maxHeight: '90%',
    showAnimation: 'pop',
    scrollable: 'y',
    closable: true,
    draggable: false,
    padding: 0,
    closable: true,
    viewModel: {
        data: {
            inquiry: null,
        },
        stores: {
            watching: {
                source: '{portcall.watching}',
            },
        },
        formulas: {
            activeGrid: {
                bind: {
                    bindTo: '{inquiryGrid.selection}',
                    deep: true,
                },
                get: function (selection) {
                    if (selection) {
                        this.set('inquiry', selection);
                    } else {
                        this.set('inquiry', null);
                    }
                },
            },
            // portcall: {
            //     bind: {
            //         activeGrid: '{portcallGridActive.selection}',
            //         archiveGrid: '{portcallsGridArchived.selection}'
            //     },
            //     get: function (data) {

            //         if (data.activeGrid) {
            //             return data.activeGrid;
            //         }
            //         if (data.archiveGrid) {
            //             return data.archiveGrid;
            //         }
            //     }
            // },
            vessel: {
                bind: {
                    bindTo: '{inquiry.voyage}',
                    deep: true,
                },
                get: function (voyage) {
                    if (voyage) {
                        if (voyage.get('custom_vessel')) {
                            return voyage.get('custom_vessel');
                        } else {
                            return voyage.get('vessel');
                        }
                    }
                },
            },
            vesselImage: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel) {
                        if (vessel.company_id && vessel.vessel_img) {
                            return vessel.vessel_img;
                        } else {
                            return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                        }
                    }
                },
            },
            vesselTitle: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel) {
                        let flag = null,
                            voyage = this.get('inquiry').getVoyage();

                        if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
                            flag =
                                'src="' +
                                AbraxaConstants.urls.staticAbraxa +
                                'flags/1x1/' +
                                vessel.flags.country_code.toLocaleLowerCase() +
                                '.svg"';
                        }
                        return (
                            '<img height=24" ' +
                            flag +
                            '  title="" alt=""/><div><div class="vessel-imo">IMO: ' +
                            vessel.imo +
                            '</div><a href="javascript:void(0);" class="vessel-name vessel">' +
                            voyage.get('vessel_name') +
                            '</a></div>'
                        );
                    }
                },
            },
            vesselType: {
                bind: {
                    bindTo: '{vessel}',
                    deep: true,
                },
                get: function (vessel) {
                    if (vessel && vessel.types) {
                        return vessel.types.name;
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                },
            },
            modalTitle: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function (inquiry) {
                    if (inquiry && inquiry.get('status')) {
                        let status = inquiry.get('status'),
                            voyage = inquiry.getVoyage(),
                            vessel = this.get('vessel'),
                            flag = null;
                        if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
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
                            '</a><div class="a-status-badge status-xl status-' +
                            status +
                            '">' +
                            Ext.String.capitalize(status) +
                            '</div></div>'
                        );
                    }
                },
            },
            watching: {
                bind: {
                    bindTo: '{portcall.watching}',
                    deep: true,
                },
                get: function (store) {
                    if (store) return store;
                },
            },
            object_record: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function (record) {
                    if (record) return record;
                },
            },
            status: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.status_data;
                    }
                },
            },
            attachmentInstructionsVisible: {
                bind: {
                    bindTo: '{instructionsVisible}',
                    deep: true,
                },

                get: function (visible) {
                    if (visible) {
                        return true;
                    }
                    return false;
                },
            },
            voyage: {
                bind: {
                    bindTo: '{object_record}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.getVoyage();
                    }
                },
            },
            etaRendererDate: {
                bind: {
                    bindTo: '{inquiry.port_eta}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
            assignTo: {
                bind: {
                    bindTo: '{inquiry}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        if (record.get('assigned_to')) {
                            let storeUsers = this.get('users');
                            let recordUser = storeUsers.findRecord('id', record.get('assigned_to'));
                            if (recordUser) {
                                var assigned_to = recordUser.get('first_name')[0] + '. ' + recordUser.get('last_name');
                                let str = '<span class="a-int">' + recordUser.get('abbr') + '</span>';
                                if (recordUser.get('profile_image') && recordUser.get('profile_image') != '') {
                                    let img = recordUser.get('profile_image');
                                    str =
                                        '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                        img +
                                        '">';
                                }

                                return (
                                    '<div class="a-person a-icon-round">' +
                                    str +
                                    ' ' +
                                    '<a class="a-person a_grid_action person_details" href="javascript:void(0)">' +
                                    assigned_to +
                                    '</a></div>'
                                );
                            } else {
                                return AbraxaConstants.placeholders.emptyValue;
                            }
                        }
                    }
                },
            },
            member: {
                bind: {
                    bindTo: '{portcall.members}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        let currentUser = this.get('currentUser');

                        let member = store.queryBy(function (rec, id) {
                            return rec.get('tenant_id') == currentUser.get('current_company_id');
                        }).items[0];

                        return member;
                    }
                },
            },
            objectPermissions: {
                bind: {
                    bindTo: '{member}',
                    deep: true,
                },
                get: function (member) {
                    if (member) {
                        let permissions = member.permissions(),
                            object_permissions = {};

                        permissions.each(function (record) {
                            let slug = record.get('sub_object_slug');
                            object_permissions[slug] = {
                                can_edit: record.get('can_edit'),
                            };
                        });
                        return object_permissions;
                    } else {
                        return;
                    }
                },
            },
            editablePermissions: {
                bind: {
                    bindTo: '{objectPermissions}',
                    deep: true,
                },
                get: function (permissions) {
                    let portcall = this.get('portcall');
                    if (portcall && portcall.get('portcall.is_archived')) return false;
                    if (permissions) {
                        let generalPermission = Object.keys(permissions).includes('general');
                        if (generalPermission) {
                            if (!permissions['general'].can_edit) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }
                    return true;
                },
            },
            hideStatusButton: {
                bind: {
                    inquiry: '{inquiry}',
                    editablePermissions: '{editablePermissions}',
                },
                get: function (data) {
                    if (data.inquiry) {
                        if (data.inquiry.get('is_archived')) {
                            return false;
                        }
                        return data.editablePermissions;
                    }
                },
            },
            portFunction: {
                bind: {
                    bindTo: '{portcall.nomination}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.get('port_function');
                    }
                },
            },
            dateReceived: {
                bind: {
                    bindTo: '{portcall.nomination.date_received}',
                    deep: true,
                },
                get: function (date) {
                    if (date) {
                        return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                    }
                    return AbraxaConstants.placeholders.emptyValue;
                },
            },
        },
    },
    bind: {
        title: {
            minHeight: 64,
            html: '{modalTitle}',
        },
        listeners: {
            click: {
                element: 'element',
                delegate: 'a.vessel',
                fn: function () {
                    let imo,
                        record = this.component.upVM().get('portcall').getVoyage();
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
    items: [
        {
            xtype: 'container',
            cls: 'a-portcall-info',
            layout: 'vbox',
            flex: 1,
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
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'title',
                                    cls: 'a-title-md',
                                    title: '<div class="a-badge a-badge-enquiry my-8"><i class="md-icon-outlined">live_help</i></div>Enquiry info',
                                },
                            ],
                        },
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
                                store: '{inquiry.ports}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                padding: '4 0',
                                layout: 'hbox',
                                width: '100%',
                                items: [
                                    {
                                        xtype: 'label',
                                        html: 'Port',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">{inquiry.port_function}</div>',
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
                                        html: '<div class="x-before-input-el"></div><div class="x-text-el">Full agency</div>',
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
                        hidden: '{inquiry.cargoes.count ? false:true}',
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
    bbar: {
        items: [
            {
                xtype: 'notes.notify',
                flex: 1,
            },
        ],
    },
});
