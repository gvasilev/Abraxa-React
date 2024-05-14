import '../../store/roles/Roles.jsx';
Ext.define('Abraxa.view.settings.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.settings-main-viewmodel',
    data: {
        // Needed to toggl off grid store grouping temporaly to avoid bug when TemplatesDetails is shown
        // but the grid in the background regroups and loses the chosen record.
        groupedInitial: false,
    },
    stores: {
        roles: {
            type: 'roles',
            autoLoad: true,
        },
        companyBankDetails: {
            type: 'settingsCompanyBankDetails',
            autoLoad: true,
            proxy: {
                extraParams: {
                    company_id: '{currentUser.current_company_id}',
                },
            },
        },
        publicBankDetails: {
            source: '{companyBankDetails}',
            filters: [
                {
                    property: 'is_public',
                    value: 1 || true,
                    operator: '=',
                },
            ],
        },
        customFileNumberStore: {
            autoLoad: true,
            type: 'settings.custom.file.number',
        },
        portBerthsStore: {
            type: 'commonPortServedBerths',
            autoLoad: false,
            proxy: {
                extraParams: {
                    portId: null,
                },
            },
            grouper: {
                property: 'terminal_name',
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter('extraparamschanged', this.load, this);
                }
            },
        },
        settingsMenuStore: {
            type: 'settings.menu',
            autoLoad: true,
        },
        userInvitations: {
            autoLoad: true,
            type: 'user.invitations',
        },
        sofEvents: {
            type: 'sof-general-events',
            autoLoad: true,
        },
        groupedEvents: {
            source: '{sofEvents}',
            grouper: {
                property: 'default_sof_event_category_id',
                direction: 'ASC',
            },
        },
        defaultSofEventCategories: {
            type: 'sof-default-event-categories',
            autoLoad: true,
        },
        defaultSofEventTypes: {
            type: 'sof-default-event-types',
            autoLoad: true,
        },
        templates: {
            type: 'templates',
            autoLoad: true,
            filters: '{templateFilter}',
        },
        templateItems: {
            type: 'template.items',
            autoLoad: true,
            proxy: {
                extraParams: {
                    type: '{templatesGrid.selection.type}',
                    template_id: '{templatesGrid.selection.id}',
                },
            },
            listeners: {
                beforesync: function (store) {
                    let vm = Ext.ComponentQuery.query('settings\\.main')[0].getVM();
                    let type = vm.get('templatesGrid.selection').get('type');
                    this.getProxy()
                        .getWriter()
                        .setRootProperty(type + '_template_items');
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            const templatesStore = this;
                            const extraParams = templatesStore.getProxy().getExtraParams();

                            if (extraParams.type && extraParams.template_id) {
                                templatesStore.load();
                            }
                        },
                        this
                    );
                }
            },
        },
        defaultExpenseItems: {
            type: 'default-expense-items',
            id: 'defaultExpenseItemsStore',
            autoLoad: true,
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
        },
        expenseItems: {
            source: '{defaultExpenseItems}',
        },
        portcallAgentStatus: {
            type: 'portcall.statuses',
            autoLoad: true,
            filters: [
                {
                    property: 'is_archive',
                    operator: '=',
                    value: 0,
                    exactMatch: true,
                },
            ],
        },
        ruleTypes: {
            type: 'rules',
        },
        agencyTypes: {
            type: 'agency.types',
        },
        usersWithoutTeam: {
            source: '{users}',
            filters: '{usersTeamsFilter}',
        },
        berthFunctions: {
            type: 'berth.function',
        },
        emailSettings: {
            source: '{currentCompany.email_settings}',
            extraParams: {
                company_id: '{currentCompany.id}',
            },
        },
        currencies: {
            source: '{companyCurrencies}',
            extraParams: {
                company_id: '{currentCompany.id}',
            },
            filters: [
                function (item) {
                    return !item.phantom && !item.get('is_default');
                },
            ],
        },
        currencyRateStore: {
            source: '{currencyRates}',
        },
        taxes: {
            type: 'taxes',
        },
        integrations: {
            autoLoad: true,
            type: 'integrations',
        },
        workflows: {
            autoLoad: true,
            type: 'workflows',
        },
        costCenterStore: {
            type: 'CostCenter',
            autoLoad: true,
            id: 'costCenterStore',
        },
        companyAppointmentFlowSettings: {
            type: 'appointmentFlowSettings',
            autoLoad: true,
            proxy: {
                extraParams: {
                    company_id: '{currentCompany.id}',
                },
            },
        },
    },
    formulas: {
        customFileNumber: {
            bind: {
                bindTo: '{customFileNumberStore}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let record = store.queryBy(function (record) {
                        return !record.get('office_id');
                    }).items[0];
                    return record;
                }
            },
        },
        selectedCompanyLogo: {
            bind: {
                bindTo: '{currentCompany}',
                deep: true,
            },
            get: function (company) {
                if (company) {
                    let image = company.get('logo'),
                        url;
                    if (image != '') {
                        url = image;
                    } else {
                        url = AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image-company.svg';
                    }
                    return url;
                }
            },
        },
        selectedCompanySquareLogo: {
            bind: {
                bindTo: '{currentCompany}',
                deep: true,
            },
            get: function (company) {
                if (company) {
                    let image = company.get('square_logo'),
                        url;
                    if (image != '') {
                        url = image;
                    } else {
                        url = AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image-company.svg';
                    }
                    return url;
                }
            },
        },

        rolesObjects: {
            bind: {
                bindTo: '{rolesGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.roles_objects();
                }
            },
        },
        selectedUserRoleName: {
            bind: {
                bindTo: '{userGrid.selection.role_id}',
                deep: true,
            },
            get: function (role_id) {
                if (role_id) {
                    let roles = this.get('roles'),
                        record = roles.getById(role_id);
                    if (record) {
                        return record.get('name');
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
                if (user) {
                    let role_name = '';
                    if (user.get('role')) {
                        Ext.Array.each(user.get('role').user_roles, function (value, index) {
                            if (value.id == user.get('role_id')) {
                                role_name = value.name;
                            }
                        });
                    }
                    return role_name;
                }
            },
        },
        // userTeam: {
        //     bind: {
        //         bindTo: '{teams}',
        //         deep: true
        //     },
        //     get: function (store) {
        //         if (store) {
        //             let currentUser = this.get('currentUser');
        //             if (currentUser && currentUser.get('team_id')) {
        //                 let team = store.getById(currentUser.get('team_id'));
        //                 if (team) {
        //                     return '<div class="a-status-badge status-admin status-round ml-8"><i class="md-icon-outlined fs-16 mr-8">groups</i>' + team.get('name') + '</div>';
        //                 }
        //             }
        //         }

        //         return '';
        //     }
        // },
        isActiveUser: {
            bind: {
                bindTo: '{userGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let company_user = record.get('company_user'),
                        company_user_record = null;
                    Ext.Array.each(company_user, function (value) {
                        if (value.company_id == record.get('current_company_id')) {
                            company_user_record = value;
                        }
                    });
                    if (company_user_record) {
                        return company_user_record.is_active;
                    }
                }
            },
        },

        templateFilter: {
            bind: {
                bindTo: '{templatesTabs.activeTab.type}',
                deep: true,
            },
            get: function (type) {
                if (type) {
                    let store = this.get('templates');
                    if (store) store.clearFilter();
                    return function (rec) {
                        if (rec.get('type') == type) {
                            return true;
                        }
                    };
                } else {
                    return function (item) {
                        return true;
                    };
                }
            },
        },
        templateTitle: {
            bind: {
                bindTo: '{templatesTabs.activeTab.type}',
                deep: true,
            },
            get: function (type) {
                if (type) {
                    let str = '';
                    switch (type) {
                        case 'task':
                            str = 'Tasks template';
                            break;
                        case 'sof':
                            str = 'SOF template';
                            break;
                        case 'disbursement':
                            str = 'Disbursements template';
                            break;
                        default:
                            break;
                    }
                    return str;
                }
            },
        },
        rules: {
            bind: {
                bindTo: '{teamsGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.rules();
                    store.getProxy().setExtraParams({
                        team_id: record.get('id'),
                    });
                    if (store.needsSync) {
                        store.commitChanges();
                    }
                    return store;
                }
                return new Ext.data.Store({
                    proxy: {
                        type: 'memory',
                    },
                });
            },
        },
        teamUsers: {
            bind: {
                bindTo: '{teamsGrid.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.users();
                    store.getProxy().setExtraParams({
                        team_id: record.get('id'),
                    });
                    return store;
                }
                return new Ext.data.Store({
                    proxy: {
                        type: 'memory',
                    },
                });
            },
        },
        usersTeamsFilter: {
            bind: {
                bindTo: '{teams}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let usersWithoutTeam = this.get('usersWithoutTeam'),
                        usersInTeam = [];
                    if (usersWithoutTeam) usersWithoutTeam.clearFilter();
                    store.each(function (rec, index) {
                        if (rec.users() && rec.users().count()) {
                            if (usersInTeam.length) {
                                usersInTeam = [].concat(usersInTeam, rec.users().collect('id'));
                            } else {
                                usersInTeam = rec.users().collect('id');
                            }
                        }
                    });
                    return function (rec) {
                        if (!Ext.Array.contains(usersInTeam, rec.get('id'))) {
                            return true;
                        }
                    };
                } else {
                    return function (item) {
                        return true;
                    };
                }
            },
        },
        teams: {
            bind: {
                bindTo: '{currentCompany}',
                deep: true,
            },
            get: function (record) {
                if (record.teams()) {
                    record.teams().getProxy().setBatchActions(true);
                    record.teams().getProxy().getWriter().setAllowSingle(false);
                    record
                        .teams()
                        .getProxy()
                        .setExtraParams({
                            company_id: record.get('id'),
                        });
                    record.teams().setAutoLoad(true);
                    return record.teams();
                }
            },
        },
        defaultCurrencyDescription: {
            bind: {
                bindTo: '{companyCurrencies}',
                deep: true,
            },
            get: function (store) {
                if (store && store.count()) {
                    store.queryBy(function (record) {
                        return record.get('is_default');
                    }).items;
                }
            },
        },
        appointmentFlowSettingModel: {
            bind: {
                bindTo: '{companyAppointmentFlowSettings}',
                deep: true,
            },
            get: function (store) {
                if (store && store.getCount()) {
                    return store.first();
                }
                return false;
            },
        },
    },
});
