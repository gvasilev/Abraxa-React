import './UserEditMenu.jsx'
Ext.define('Abraxa.view.settings.user_teams.users.UserGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.users.grid',
    flex: 1,
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    itemConfig: {
        viewModel: true,
    },
    bind: {
        store: '{users}',
    },
    reference: 'userGrid',
    columns: [
        {
            text: 'ID',
            dataIndex: 'id',
            hidden: true,
            cell: {
                cls: 'a-cell-id',
            },
        },
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'first_name',
            groupable: true,
            minWidth: 320,
            flex: 4,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            groupHeaderTpl: '{name} ({count})',
            grouper: {
                groupFn: function (record) {
                    if (!record) return '<span class="a-cell-placeholder">---</span>';

                    let status = 'pending',
                        statusIcon = 'schedule';

                    if (record.get('auth0id')) {
                        let company_user = record.get('company_user'),
                            company_user_record = null;
                        Ext.Array.each(company_user, function (value) {
                            if (value.company_id == record.get('current_company_id')) {
                                company_user_record = value;
                            }
                        });
                        if (company_user_record && company_user_record.is_active) {
                            status = 'active';
                            statusIcon = 'done';
                        } else {
                            status = 'suspended';
                            statusIcon = 'block';
                        }
                    }
                    let statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
                    let statusStr =
                        '<span class="a-person a-icon-round">' +
                        '<span class="a-person a-icon-round md-icon-outlined md-16 ml-4 status-' +
                        status +
                        '" data-qtip="' +
                        status +
                        '" data-qalign="bc-tc" data-qanchor="true">' +
                        statusIcon +
                        '</span>' +
                        '</span>' +
                        '<span>' +
                        '&nbsp;' +
                        statusCapitalized +
                        '</span>';
                    return statusStr;
                },
            },
            renderer: function (value, record) {
                if (record) {
                    const company_user = record.get('company_user');
                    let status = 'pending',
                        statusIcon = 'schedule',
                        company_user_record;

                    Ext.Array.each(company_user, function (value) {
                        if (value.company_id == record.get('current_company_id')) {
                            company_user_record = value;
                        }
                    });

                    if (record.get('auth0id')) {
                        if (company_user_record && company_user_record.is_active) {
                            status = 'active';
                            statusIcon = 'done';
                        } else {
                            status = 'suspended';
                            statusIcon = 'block';
                        }
                    } else {
                        if (company_user_record && !company_user_record.is_active) {
                            status = 'suspended';
                            statusIcon = 'block';
                        }
                    }
                    let statusStr =
                        '<span class="md-icon-outlined md-16 ml-4 status-' +
                        status +
                        '" data-qtip="' +
                        status +
                        '" data-qalign="bc-tc" data-qanchor="true">' +
                        statusIcon +
                        '</span>';
                    var assigned_to = record.get('first_name')[0] + '. ' + record.get('last_name');
                    if (record.get('profile_image')) {
                        return (
                            '<div class="a-person a_grid_action a-icon-round"><img height="32" src="' +
                            record.get('profile_image') +
                            '" /><div class="ml-4"><div class="fw-b c-blue hbox">' +
                            assigned_to +
                            statusStr +
                            '</div><div class="sm-title">' +
                            record.get('email') +
                            '</div></div></div>'
                        );
                    }
                    return (
                        '<div class="a-person a_grid_action"><i class="md-icon-outlined">person</i><div class="ml-4"><div class="fw-b c-blue hbox">' +
                        assigned_to +
                        statusStr +
                        '</div><div class="sm-title">' +
                        record.get('email') +
                        '</div></div></div>'
                    );
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Team',
            dataIndex: 'team_id',
            sorter: {
                property: 'team_name',
            },
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    let teams = this.upVM().get('teams');
                    if (teams) {
                        let record = teams.getById(value);
                        if (record) {
                            return (
                                '<span class="hbox c-blue-grey"><i class="md-icon-outlined md-18 mr-8">groups</i>' +
                                record.get('name') +
                                '</span>'
                            );
                        } else {
                            return '<span class="a-cell-placeholder">---</span>';
                        }
                    }
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Office',
            dataIndex: 'current_office_id',
            sorter: {
                property: 'office_name',
            },
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let office = record.getOffice();
                    if (office) {
                        return (
                            '<span class="hbox c-blue-grey"><i class="md-icon-outlined md-18 mr-8">maps_home_work</i>' +
                            office.get('office_name') +
                            '</span>'
                        );
                    } else {
                        return '<span class="a-cell-placeholder">---</span>';
                    }
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Access',
            minWidth: 180,
            dataIndex: 'role_id',
            sorter: {
                property: 'role_name',
            },
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    let roles = this.upVM().get('roles'),
                        record = roles.getById(value);
                    if (record) {
                        return (
                            '<span class="hbox c-blue-grey"><i class="md-icon-outlined md-18 mr-8">manage_accounts</i>' +
                            record.get('name') +
                            '</span>'
                        );
                    } else {
                        return '<span class="a-cell-placeholder">---</span>';
                    }
                } else {
                    return '<span class="a-cell-placeholder">---</span>';
                }
            },
        },
        {
            text: 'Last active',
            minWidth: 180,
            dataIndex: 'previous_login',
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return (
                        '<span class="hbox"><i class="md-icon-outlined md-18 c-light-grey mr-8">calendar_today</i>' +
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(value.time, AbraxaConstants.formatters.date.dayMonYearHyphenTime24) +
                        '</span>'
                    );
                } else {
                    return '<span class="c-light-grey">Never logged in</span>';
                }
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        bind: {
                            hidden: '{record.id == currentUser.id ? true:false}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (owner, tool, e) {
                            let record = tool.record,
                                vm = this.up('grid').upVM();
                            Ext.create('Abraxa.view.settings.users_teams.UserEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        record: record,
                                    },
                                    formulas: {
                                        userStatus: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let status = 'pending';
                                                if (record && record.get('auth0id')) {
                                                    let company_user = record.get('company_user'),
                                                        company_user_record = null;
                                                    Ext.Array.each(company_user, function (value) {
                                                        if (value.company_id == record.get('current_company_id')) {
                                                            company_user_record = value;
                                                        }
                                                    });
                                                    if (company_user_record && company_user_record.is_active) {
                                                        status = 'active';
                                                    } else {
                                                        status = 'suspended';
                                                    }
                                                }
                                                return status;
                                            },
                                        },
                                        selectedActiveUser: {
                                            bind: {
                                                bindTo: '{record}',
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
                                        inviteExpired: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record && this.get('selectedActiveUser')) {
                                                    let invite = record.get('invite');
                                                    if (invite) {
                                                        return false;
                                                    }
                                                }
                                                return true;
                                            },
                                        },
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function () {
                            let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                                downContainer = Ext.ComponentQuery.query('[itemId=userDetalsContainer]')[0];
                            upContainer.setHidden(true);
                            downContainer.setHidden(false);
                        },
                    },
                ],
            },
        },
    ],
    listeners: {
        childtap: function (me, selection) {
            let record = selection.record;
            if (record && selection.cell && !selection.cell.hasCls('no_expand')) {
                let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=userDetalsContainer]')[0];
                upContainer.setHidden(true);
                downContainer.setHidden(false);
            }
        },
    },
});
