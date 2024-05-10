Ext.define('Abraxa.view.portcall.PortcallInfoDialog', {
    extend: 'Ext.Dialog',
    xtype: 'portcall.info.dialog',
    cls: 'a-dialog-create a-dialog-portcall-info',
    manageBorders: false,
    minWidth: 640,
    maxWidth: 640,
    height: '80%',
    showAnimation: 'pop',
    scrollable: 'y',
    layout: 'hbox',
    // closable: true,
    tools: [
        {
            type: 'close',
            testId: 'portcallInfoCloseTool',
            handler: function (panel) {
                this.up('dialog').destroy();
            },
        },
    ],
    draggable: false,
    padding: 0,
    viewModel: {
        data: {
            portcall: null,
            dialog: true,
            hidePersonIncharge: true,
        },
        stores: {
            watching: {
                source: '{portcall.watching}',
            },
        },
        formulas: {
            vessel: {
                bind: {
                    bindTo: '{portcall.voyage}',
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
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) {
                        if (portcall.get('status_data')) {
                            let status = portcall.get('status_data'),
                                voyage = portcall.getVoyage(),
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
                                status.string +
                                '">' +
                                status.name +
                                '</div></div>'
                            );
                        }
                    }
                },
            },
            status: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record.status_data;
                    }
                },
            },
            instructions: {
                bind: {
                    bindTo: '{portcall}',
                    deep: true,
                },
                get: function (portcall) {
                    if (portcall) {
                        if (portcall.instructions()) {
                            return portcall.instructions();
                        }
                    }
                },
            },
            instructionsVisible: {
                bind: {
                    bindTo: '{instructions}',
                    deep: true,
                },
                get: function (instructions) {
                    if (instructions) {
                        return false;
                    }
                    return true;
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
                    bindTo: '{portcall}',
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
                    bindTo: '{portcall.port_eta}',
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
                    bindTo: '{portcall}',
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
            portFunction: {
                bind: {
                    bindTo: '{portcall.nomination.port_function}',
                    deep: true,
                },
                get: function (portFunction) {
                    if (portFunction) {
                        return portFunction;
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
                    xtype: 'invitaion.content',
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
