Ext.define('Abraxa.view.settings.user_teams.roles.RolesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.roles.grid',
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    flex: 1,
    bind: {
        store: '{roles}',
    },
    reference: 'rolesGrid',
    itemConfig: {
        viewModel: true,
    },
    columns: [
        {
            text: 'ID',
            dataIndex: 'id',
            hidden: true,
            minWidth: 100,
            cell: {
                cls: 'a-cell-id',
            },
        },
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'name',
            groupable: false,
            minWidth: 220,
            flex: 4,
            cell: {
                cls: 'a-cell-person a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    let access_string = 'Limited access';
                    if (value == 'Admin') {
                        access_string = 'Unlimited access';
                    }
                    return (
                        '<div class="a-person a-person-x30 a_grid_action"><i class="md-icon-outlined">manage_accounts</i><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                        value +
                        '</div><div class="sm-title">' +
                        access_string +
                        '</div></div></div>'
                    );
                }
            },
        },
        {
            text: 'Users',
            dataIndex: 'user_roles_count',
            minWidth: 220,
            cell: {
                encodeHtml: false,
            },
            renderer: function (value) {
                if (value) {
                    return '<span class="a-status-badge status-admin a-status-sm status-round">' + value + '</span>';
                } else {
                    return AbraxaConstants.placeholders.emptyCellSpan;
                }
            },
        },
        {
            text: 'Created on',
            dataIndex: 'created_at',
            minWidth: 180,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value && record.get('company_id') != 0) {
                    return (
                        '<span class="hbox"><i class="md-icon-outlined md-18 c-light-grey mr-8">calendar_today</i>' +
                        Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24) +
                        '</span>'
                    );
                } else {
                    return AbraxaConstants.placeholders.emptyCellSpan;
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
                                        let dialog = Ext.create('Abraxa.view.settings.company.AddEditRole', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    title: 'Edit role',
                                                    editMode: true,
                                                    record: me.upVM().get('record'),
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
                                    slug: 'settingsUserRoleDelete',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (button, el, data) {
                                        Ext.Msg.confirm(
                                            'Confirmation',
                                            'Are you sure you want to delete this record?<br>All users will be transferred to user role.',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    let store = button.upVM().get('roles'),
                                                        usersGrid = Ext.ComponentQuery.query(
                                                            '[xtype=settings\\.users\\.grid]'
                                                        )[0],
                                                        record = this.upVM().get('record'),
                                                        roleId = record.get('id');
                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            usersGrid.getStore().each(function (record) {
                                                                if (record.get('role_id') == roleId) {
                                                                    record.set('role_id', 2);
                                                                }
                                                            });
                                                            usersGrid.refresh();
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
                                downContainer = Ext.ComponentQuery.query('[itemId=rolesDetalsContainer]')[0];
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
            if (record && selection.source.target.tagName != 'BUTTON') {
                let upContainer = Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=rolesDetalsContainer]')[0];
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
