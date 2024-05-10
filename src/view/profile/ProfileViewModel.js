Ext.define('Abraxa.view.profile.ProfileViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.profile-viewmodel',
    stores: {
        userSignatures: {
            source: '{currentUser.signatures}',
            extraParams: {
                user_id: '{currentUser.id}',
            },
        },
    },
    formulas: {
        isActiveUser: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                if (user) {
                    let company_user = user.get('company_user'),
                        company_user_record = null;
                    Ext.Array.each(company_user, function (value) {
                        if (value.company_id == user.get('current_company_id')) {
                            company_user_record = value;
                        }
                    });
                    if (company_user_record) {
                        return company_user_record.is_active;
                    }
                }
            },
        },

        userRole: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                let role;
                if (user) {
                    if (user.get('role')) {
                        Ext.Array.each(user.get('role').user_roles, function (value, index) {
                            if (value.id == user.get('role_id')) {
                                let access_string = 'Limited access';
                                if (value.name == 'Admin') {
                                    access_string = 'Unlimited access';
                                }
                                role =
                                    '<h5>Role</h5><div class="a-person"><i class="md-icon-outlined">manage_accounts</i><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                                    value.name +
                                    '</div><div class="sm-title">' +
                                    access_string +
                                    '</div></div></div>';
                            }
                        });
                    }
                }
                return role;
            },
        },
        userTeam: {
            bind: {
                bindTo: '{currentUser.team}',
                deep: true,
            },
            get: function (team) {
                let teamString;
                if (team) {
                    teamString =
                        '<h5>Team</h5><div class="hbox"><div class="a-badge a-badge-teams"><i class="md-icon-outlined">groups</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue">' +
                        team.name +
                        '</div><div class="sm-title">' +
                        team.description +
                        '</div></div></div>';
                }
                return teamString;
            },
        },
        userOffice: {
            bind: {
                bindTo: '{currentUser.office}',
                deep: true,
            },
            get: function (office) {
                let userOfiice;
                if (office) {
                    let description = '';
                    if (office.description) {
                        description = office.description;
                    }
                    userOfiice =
                        '<h5>Offices</h5><div class="hbox"><div class="a-badge a-badge-office"><i class="md-icon-outlined">maps_home_work</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue">' +
                        office.get('office_name') +
                        '</div><div class="sm-title">' +
                        description +
                        '</div></div></div>';
                }
                return userOfiice;
            },
        },
    },
});
