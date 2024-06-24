Ext.define('Abraxa.view.voyage.VoyageViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.VoyageViewModel',
    data: {
        appointmentId: null,
        proceedAppointment: false,
        selectedAppointments: Ext.create('Ext.data.Store'),
        files: Ext.create('Ext.data.Store'),
        voyageType: AbraxaConstants.placeholders.emptyValue,
    },
    stores: {
        voyageTypes: {
            id: 'voyageTypes',
            type: 'voyageTypes',
        },
        portcalls: {
            source: '{object_record.portcalls}',
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        },
    },
    formulas: {
        object_record: {
            bind: {
                bindTo: '{voyageRecord.record}',
            },
            get: function (record) {
                return record;
            },
        },
        updatedBy: {
            bind: {
                bindTo: '{object_record.updated_at}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(date, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                } else {
                    return '';
                }
            },
        },
        appointmentSelections: {
            bind: {
                bindTo: '{appointmentList.selection}',
            },
            get: function (appointment) {
                if (appointment) {
                    this.get('selectedAppointments').add(appointment);
                }
                return appointment;
            },
        },
        tabItems: {
            bind: {
                bindTo: '{appointmentList.selection}',
            },
            get: function (selection) {
                let items = [];
                if (selection) {
                    let item = {
                        ui: 'xl',
                        title:
                            '<div class="a-tab-title">' +
                            selection.get('port').name +
                            ', ' +
                            selection.get('port').country.country_code +
                            '</div><div class="a-tab-subtitle">' +
                            Ext.Date.format(selection.get('port_eta'), 'd M y - H:i') +
                            ' / ' +
                            selection.get('port_itinerary') +
                            '</div>',
                        record: selection,
                    };
                    items.push(item);
                }
                return items;
            },
        },
        activePortcall: {
            bind: {
                bindTo: '{activePortcallTab.activeItem}',
            },
            get: function (activeItem) {
                if (activeItem) {
                    return activeItem.getRecord();
                }
            },
        },
        nomination: {
            bind: {
                bindTo: '{appointmentList.selection.nomination}',
            },
            get: function (nomination) {
                return nomination;
            },
        },
        selectedAgencyPort: {
            bind: {
                bindTo: '{agentCombo.selection}',
            },
            get: function (agent) {
                const portsServed = agent?.getData()?.ports_served;
                if (!portsServed?.length) return AbraxaConstants.placeholders.emptyValue;

                let portsArr = agent.getData().ports_served.filter((item) => item.port);

                let sortedPorts = portsArr.sort((a, b) => {
                    return a.port_name.localeCompare(b.port_name);
                });

                let portName = sortedPorts[0].port_name;
                return portName;
            },
        },
        renderVoyageType: {
            bind: {
                bindTo: '{voyageTypes.count}',
                deep: true,
            },
            get: function (count) {
                return count;
            },
        },
        voyageTypeSetter: {
            bind: {
                type: '{object_record.type_id}',
                voyageTypeCount: '{renderVoyageType}',
            },
            get: function (data) {
                if (data && data.type && data.voyageTypeCount) {
                    let store = this.get('voyageTypes');
                    let record = store.getById(data.type);
                    if (record) {
                        this.set('voyageType', record.get('name'));
                    } else {
                        this.set('voyageType', AbraxaConstants.placeholders.emptyValue);
                    }
                }
            },
        },
        pendingAgent: {
            bind: {
                bindTo: '{activePortcall}',
                deep: true,
            },
            get: function (portcall) {
                if (portcall && this.get('proceedAppointment')) {
                    if (portcall && portcall.invitations() && portcall.invitations().getCount()) {
                        let invitationAppointed = portcall
                            .invitations()
                            .findRecord('status', 'Pending', 0, false, false, true);
                        if (invitationAppointed) {
                            return portcall.getNomination();
                        }
                    }
                    return false;
                }
                return false;
            },
        },
        appointedAgent: {
            bind: {
                bindTo: '{activePortcall}',
                deep: true,
            },
            get: function (portcall) {
                if (portcall && this.get('proceedAppointment')) {
                    if (portcall && portcall.invitations() && portcall.invitations().getCount()) {
                        let invitationAppointed = portcall
                            .invitations()
                            .findRecord('status', 'Accepted', 0, false, false, true);
                        if (invitationAppointed) {
                            return portcall.getNomination();
                        }
                    }
                    return false;
                }
                return false;
            },
        },
    },
});
