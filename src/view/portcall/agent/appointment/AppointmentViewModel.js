Ext.define('Abraxa.view.portcall.appointment.AppointmentViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.appointment-viewmodel',
    data: {
        hubStructure: false,
        hideMainAppointment: false,
        selectedInstruction: null,
    },
    formulas: {
        nomination: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (
                    record &&
                    record.get('id') &&
                    Ext.isNumber(parseInt(record.get('id'))) &&
                    record.$className == 'Abraxa.model.portcall.Portcall' &&
                    record.getNomination()
                ) {
                    let nomination = record.getNomination();
                    nomination.getProxy().setExtraParams({
                        portcall_id: record.get('id'),
                    });
                    return nomination;
                }
            },
        },
        appointmentMenuMembers: {
            bind: {
                bindTo: {
                    selection: '{appointmentMenu.selection}',
                    members: '{membersPerSection}',
                },
                deep: true,
            },
            get: function (data) {
                if (data['selection'] && data['members']) {
                    let members = data['members'][data.selection.get('slug')];
                    this.set('sectionMembers', members);
                    this.set('memberPreviewTitle', data.selection.get('title'));

                    return members;
                }
            },
        },
        assignedToImage: {
            bind: {
                bindTo: '{usersCombo.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    if (selection.get('profile_image')) {
                        let userImage = selection.get('profile_image');
                        return (
                            '<div class="a-person a-icon-round">' +
                            '<img class="a-profile-image a-user" src="' +
                            userImage +
                            '" width="24" alt="" />' +
                            '</div>'
                        );
                    } else {
                        return (
                            '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                            selection.get('first_name')[0] +
                            selection.get('last_name')[0] +
                            '</span></div>'
                        );
                    }
                }
                return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
            },
        },
        cargoSelectionSetAppointment: {
            bind: {
                bindTo: '{cargoesGrid.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection && !selection.get('is_checked')) {
                    this.set('hideMainAppointment', true);
                } else {
                    this.set('hideMainAppointment', false);
                }
            },
        },
        instructionSelectionSetAppointment: {
            bind: {
                bindTo: '{selectedInstruction}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    let nomination = this.get('nomination');
                    selection.getProxy().setExtraParams({
                        org_id: nomination.get('appointing_party_id'),
                    });
                    this.set('hideMainAppointment', true);
                } else {
                    this.set('hideMainAppointment', false);
                }
            },
        },
        isHubstructureShow: {
            bind: {
                bindTo: '{currentUserType}',
                deep: true,
            },
            get: function (type) {
                if (type == 'principal') {
                    this.set('hubStructure', true);
                } else {
                    this.set('hubStructure', false);
                }
            },
        },
    },
});
