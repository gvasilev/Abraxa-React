import './CreateTeam';
import './UsersHeads';

Ext.define('Abraxa.view.settings.user_teams.teams.TeamsGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.teams.grid',
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    reference: 'teamsGrid',
    bind: {
        store: '{teams}',
        hideHeaders: '{teams.count ? false : true}',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-833 -450)"><g transform="translate(-1 105)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(863 480)"><g transform="translate(0 16)"><path d="M10.667,24.667a5.333,5.333,0,1,0-5.333-5.333A5.349,5.349,0,0,0,10.667,24.667ZM13.68,27.6a18.62,18.62,0,0,0-3.013-.267A18.535,18.535,0,0,0,3.253,28.88,5.362,5.362,0,0,0,0,33.813V38H12V33.707A12,12,0,0,1,13.68,27.6Zm39.653-2.933A5.333,5.333,0,1,0,48,19.333,5.349,5.349,0,0,0,53.333,24.667ZM64,33.813a5.362,5.362,0,0,0-3.253-4.933A18.129,18.129,0,0,0,50.32,27.6,12,12,0,0,1,52,33.707V38H64ZM43.307,26.4A27.848,27.848,0,0,0,32,24a28.3,28.3,0,0,0-11.307,2.4A7.968,7.968,0,0,0,16,33.707V38H48V33.707A7.968,7.968,0,0,0,43.307,26.4ZM21.52,32.667c.24-.613.347-1.04,2.427-1.84a22.462,22.462,0,0,1,16.107,0c2.053.8,2.16,1.227,2.427,1.84ZM32,11.333A2.667,2.667,0,1,1,29.333,14,2.675,2.675,0,0,1,32,11.333M32,6a8,8,0,1,0,8,8,7.989,7.989,0,0,0-8-8Z" transform="translate(0 -6)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></g></g></svg><div class="a-no-content-txt">No teams available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Team',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                handler: function (btn, e) {
                    Ext.create('Abraxa.view.settings.users_teams.teams.CreateTeam', {
                        viewModel: {
                            parent: btn.upVM(),
                            data: {
                                editMode: false,
                                team: Ext.create('Abraxa.model.team.Team', {
                                    company_id: btn.upVM().get('currentCompany').get('id'),
                                }),
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
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'name',
            groupable: false,
            flex: 4,
            minWidth: 220,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let description = '';
                    if (record.get('description')) {
                        description = '<div class="sm-title">' + record.get('description') + '</div>';
                    }
                    return (
                        '<div class="hbox a_grid_action"><div class="a-badge a-badge-x32 a-badge-teams"><i class="md-icon-outlined">groups</i></div><div class="ml-12"><div class="text-truncate fw-b c-blue">' +
                        value +
                        '</div><div class="sm-title text-truncate">' +
                        description +
                        '</div></div>'
                    );
                }
            },
        },
        {
            text: 'Users',
            dataIndex: 'auto_update',
            minWidth: 220,
            cell: {
                cls: 'a-cell-users-heads',
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'teams.users.heads',
                    cls: 'no_show',
                    bind: {
                        store: '{record.users}',
                    },
                },
            },
        },
        {
            text: 'Rules',
            dataIndex: 'auto_update',
            minWidth: 100,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value, record) {
                let str = '<span class="a-cell-placeholder">---</span>';
                if (record) {
                    let rules = record.rules();
                    if (rules && rules.count()) {
                        str =
                            '<span class="a-status-badge status-admin a-status-sm status-round">' +
                            rules.count() +
                            '</span>';
                    }
                }
                return str;
            },
        },
        {
            text: 'Last updated',
            minWidth: 180,
            cell: {
                cls: 'no_expand',
                encodeHtml: false,
                xtype: 'widgetcell',
                selectable: true,
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.updated_by_user}',
                            updated_at: '{record.updated_at}',
                        },
                    },
                },
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
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        arrow: false,
                        bind: {
                            hidden: '{record.company_id ? false:true}',
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
                        menu: {
                            cls: 'a-main-edit-menu',
                            width: 160,
                            ui: 'has-icons medium',
                            items: [
                                {
                                    text: 'Edit',
                                    iconCls: 'md-icon-outlined md-icon-edit',
                                    handler: function (me) {
                                        let dialog = Ext.create('Abraxa.view.settings.users_teams.teams.CreateTeam', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    editMode: true,
                                                    team: me.upVM().get('record'),
                                                },
                                            },
                                        });
                                        dialog.show();
                                    },
                                },
                                {
                                    text: 'Delete',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    ui: 'decline',
                                    separator: true,
                                    slug: 'settingsUserTeamDelete',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (button, el, data) {
                                        Ext.Msg.confirm(
                                            'Confirmation',
                                            'Are you sure you want to delete this record?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    let store = button.upVM().get('teams'),
                                                        users = button.upVM().get('users'),
                                                        record = this.upVM().get('record');
                                                    store.remove(record);
                                                    let teamUsers = record.users();
                                                    if (teamUsers && teamUsers.count()) {
                                                        teamUsers.each(function (rec) {
                                                            let userRec = users.getById(rec.get('id'));
                                                            if (userRec) {
                                                                userRec.set('team_id', null);
                                                            }
                                                        });
                                                    }
                                                    store.sync({
                                                        success: function () {
                                                            Ext.toast('Record deleted', 1000);
                                                        },
                                                    });
                                                }
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
                                                    enableToggle: true,
                                                    ui: 'decline alt loading',
                                                    text: 'Delete',
                                                },
                                            ]
                                        );
                                    },
                                },
                            ],
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
                                downContainer = Ext.ComponentQuery.query('[itemId=teamDetalsContainer]')[0];
                            upContainer.setHidden(true);
                            downContainer
                                .setShowAnimation({
                                    type: 'slide',
                                    direction: 'left',
                                })
                                .setHidden(false);
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
                    downContainer = Ext.ComponentQuery.query('[itemId=teamDetalsContainer]')[0];
                upContainer.setHidden(true);
                downContainer
                    .setShowAnimation({
                        type: 'slide',
                        direction: 'left',
                    })
                    .setHidden(false);
            }
        },
    },
});
