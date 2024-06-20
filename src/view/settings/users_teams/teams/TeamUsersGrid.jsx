import './AssignTeamUsers';

Ext.define('Abraxa.view.settings.user_teams.teams.UserGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.team.users.grid',
    flex: 1,
    cls: 'a-users-grid abraxa-grid',
    margin: 0,
    ui: 'bordered',
    shadow: false,
    itemConfig: {
        viewModel: true,
    },
    hidden: true,
    bind: {
        store: '{teamUsers}',
        hidden: '{teams_tabbar.activeTabIndex == 1 ? false: true}',
        hideHeaders: '{teamUsers.count ? false : true}',
    },
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-832 -520)"><g transform="translate(-2 175)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M20.667,23.667a9.333,9.333,0,1,0-9.333-9.333A9.344,9.344,0,0,0,20.667,23.667Zm0-13.333a4,4,0,1,1-4,4A3.995,3.995,0,0,1,20.667,10.333ZM20.8,37H9.387a27.664,27.664,0,0,1,11.28-2.667c.293,0,.613.027.907.027a12.213,12.213,0,0,1,4.373-4.827A31.269,31.269,0,0,0,20.667,29C14.427,29,2,32.12,2,38.333v4H20.667v-4A7.291,7.291,0,0,1,20.8,37Zm19.867-6.667c-4.907,0-14.667,2.693-14.667,8v4H55.333v-4C55.333,33.027,45.573,30.333,40.667,30.333Zm3.227-4.853a6.667,6.667,0,1,0-6.453,0,6.527,6.527,0,0,0,6.453,0Z" transform="translate(865.333 558.333)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></svg><div class="a-no-content-txt">No users available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Assign users',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (me) {
                    let team = me.upVM().get('teamsGrid.selection');
                    Ext.create('Abraxa.view.settings.user_teams.teams.AssignTeamUsers', {
                        viewModel: {
                            parent: me.upVM(),
                            data: {
                                team: team,
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    columns: [
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'first_name',
            groupable: false,
            flex: 1,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (record) {
                    var assigned_to = record.get('first_name')[0] + '. ' + record.get('last_name');
                    if (record.get('profile_image')) {
                        return (
                            '<div class="a-person a_grid_action a-icon-round"><img height="32" src="' +
                            record.get('profile_image') +
                            '" /><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                            assigned_to +
                            '</div><div class="sm-title">' +
                            record.get('email') +
                            '</div></div></div>'
                        );
                    }
                    return (
                        '<div class="a-person a_grid_action"><i class="md-icon-outlined">person</i><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                        assigned_to +
                        '</div><div class="sm-title">' +
                        record.get('email') +
                        '</div></div></div>'
                    );
                }
            },
        },
        {
            text: 'Access',
            flex: 1,
            dataIndex: 'role_id',
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    let roles = this.upVM().get('roles'),
                        record = roles.getById(value);
                    if (record) {
                        return (
                            '<span class="a-status-badge status-admin status-round"><i class="md-icon-outlined fs-16 mr-8">manage_accounts</i>' +
                            record.get('name') +
                            '</span>'
                        );
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                } else {
                    return '<span class="a-status-badge status-admin status-round">---</span>';
                }
            },
        },
        {
            dataIndex: '',
            minWidth: 96,
            flex: 1,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            sortable: true,
            cls: 'a-column-actions',
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        hideMode: 'opacity',
                        arrow: false,
                        iconCls: 'md-icon-remove-circle-outline',
                        ui: 'tool-xs round',
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Unassign',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                        handler: function (owner, tool, event) {
                            let record = owner.upVM().get('record'),
                                teams = this.upVM().get('teams');
                            team = this.upVM().get('teamsGrid.selection');
                            Ext.Msg.confirm(
                                'Unassign',
                                'Do you want to unassign this user?',
                                function (answer) {
                                    if (answer != 'yes') return;
                                    Ext.Ajax.request({
                                        url: Env.ApiEndpoint + 'team/' + team.get('id') + '/unassign_users',
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        jsonData: {
                                            users: [record.get('id')],
                                        },
                                        success: function (response) {
                                            team.getProxy().setExtraParams({
                                                company_id: team.get('id'),
                                            });
                                            teams.reload();
                                            Ext.toast('Users unassigned', 1500);
                                        },
                                    });
                                },
                                this,
                                [
                                    {
                                        xtype: 'button',
                                        itemId: 'no',
                                        margin: '0 8 0 0',
                                        text: 'Cancel',
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'yes',
                                        ui: 'decline alt',
                                        text: 'Unassign',
                                    },
                                ]
                            );
                        },
                    },
                ],
            },
        },
    ],
});
