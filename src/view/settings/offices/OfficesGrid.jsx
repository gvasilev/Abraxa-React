Ext.define('Abraxa.view.settings.offices.OfficesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.offices.grid',
    flex: 1,
    cls: 'a-users-grid abraxa-grid',
    margin: '0 -32',
    ui: 'bordered',
    shadow: false,
    itemConfig: {
        viewModel: true,
    },
    bind: {
        store: '{companyOffices}',
        hideHeaders: '{companyOffices.count ? false : true}',
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
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-833 -450)"><g transform="translate(-1 105)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><g transform="translate(865.666 488)"><rect width="6" height="5" transform="translate(42.333 11)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><rect width="6" height="6" transform="translate(42.333 21)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><rect width="6" height="5" transform="translate(42.333 32)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><path d="M1,19.333V46H17V32.667h5.333V46h16V19.333L19.667,6ZM33,40.667H27.667V27.333h-16V40.667H6.333V22l13.333-9.333L33,22Z" transform="translate(-1 2)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/><path d="M10,3V8.253l5.333,3.813V8.333h24V45.667H28.667V51h16V3Z" transform="translate(14 -3)" fill="#c8d4e6" stroke="#fafafb" stroke-width="2"/></g></g></svg><div class="a-no-content-txt">No offices available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Office',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                slug: 'settingsOffice',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (btn, e) {
                    Ext.create('Abraxa.view.settings.offices.CreateOffice', {
                        viewModel: {
                            parent: btn.upVM(),
                            data: {
                                editMode: false,
                                office: Ext.create('Abraxa.model.office.Office', {
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
    reference: 'officesGrid',
    columns: [
        {
            text: 'Name',
            cls: 'a-column-offset-x32',
            dataIndex: 'office_name',
            groupable: false,
            minWidth: 220,
            flex: 4,
            cell: {
                cls: 'a-cell-offset-x32',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                if (value) {
                    let description = '';
                    if (record.get('description')) {
                        description = record.get('description');
                    }
                    return (
                        '<div class="hbox a_grid_action"><div class="a-badge a-badge-office a-badge-x32"><i class="md-icon-outlined">maps_home_work</i></div><div class="ml-12 text-truncate"><div class="text-truncate fw-b c-blue">' +
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
            dataIndex: 'users_count',
            minWidth: 320,
            flex: 4,
            cell: {
                cls: 'a-cell-users-heads',
                encodeHtml: false,
                tpl: '<div class="cursor-pointer"><div class="a-person a-icon-round no_show"  data-qtip="{users_count}" data-qoverflow="true" data-qalign="b-t?" data-qanchor="true"><span class="a-int no_show">{users_count}</span></div></div>',
                // xtype: 'widgetcell',
                // selectable: true,
                // widget: {
                //     xtype: 'teams.users.heads',
                //     cls: 'no_show',
                //     bind: {
                //         store: '{record.users}',
                //     },
                //     itemTpl: new Ext.XTemplate(
                //         '',
                //         {
                //             parceString: function (user) {
                //                 if (user) {
                //                     if (user.profile_image && user.profile_image != '') {
                //                         let img = user.profile_image;
                //                         return (
                //                             '<img data-id="last_updated_by_appointments" class="no_show a-profile-image" height="30" src="' +
                //                             img +
                //                             '">'
                //                         );
                //                     } else {
                //                         let abbr = user.first_name[0] + user.last_name[0];
                //                         return '<span class="a-int no_show">' + abbr + '</span>';
                //                     }
                //                 }
                //             },
                //             displayTooltip: function (user) {
                //                 if (user) {
                //                     return user.first_name + ' ' + user.last_name;
                //                 }
                //             },
                //         }
                //     ),
                // },
            },
            // renderer: function (value, record) {
            //     let str = '';
            //     if (record) {
            //         let users = record.users();
            //         if (users && users.count()) {
            //             users.each(function (rec) {
            //                 if (rec.get('profile_image')) {
            //                     str += '<div class="a-person a-person-x30 a_grid_action a-icon-round"><img height="30" src="' + rec.get('profile_image') + '" /></div>';
            //                 } else {
            //                     str += '<div class="a-person a-person-x30 a_grid_action"><i class="md-icon-outlined">person</i><div>';
            //                 }
            //             });
            //         }
            //     }
            //     return str;
            // }
        },
        {
            text: 'Last updated',
            minWidth: 180,
            cell: {
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
                                        let dialog = Ext.create('Abraxa.view.settings.offices.CreateOffice', {
                                            viewModel: {
                                                parent: me.upVM(),
                                                data: {
                                                    editMode: true,
                                                    office: me.upVM().get('record'),
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
                                    handler: function (button, el, data) {
                                        let store = button.upVM().get('companyOffices'),
                                            record = button.upVM().get('record');

                                        if (record.get('users_count') > 0) {
                                            Ext.create('Ext.MessageBox', {
                                                ui: 'warning',
                                                title: 'Cannot delete office',
                                                // innerCls: 'a-bgr-white',
                                                message: `Office "${record.get('office_name')}" has ${record.get(
                                                    'users_count'
                                                )} assigned ${
                                                    record.get('users_count') === 1 ? 'user' : 'users'
                                                }, so it cannot be deleted.`,
                                                width: 300,
                                                modal: true,
                                                draggable: false,
                                                bbar: {
                                                    manageBorders: false,
                                                    items: [
                                                        '->',
                                                        {
                                                            xtype: 'button',
                                                            ui: 'action',
                                                            text: 'Ok',
                                                            handler: function (btn) {
                                                                Ext.getCmp('main-viewport')
                                                                    .upVM()
                                                                    .get('currentCompany')
                                                                    .load();
                                                                btn.up('dialog').destroy();
                                                            },
                                                        },
                                                    ],
                                                },
                                            }).show();

                                            Ext.Viewport.unmask();
                                            return;
                                        }

                                        Ext.Msg.confirm(
                                            'Confirmation',
                                            'Are you sure you want to delete this office?',
                                            function (answer) {
                                                if (answer == 'yes') {
                                                    Ext.Viewport.mask();

                                                    let delOfficeId = record.get('id');

                                                    store.remove(record);
                                                    store.sync({
                                                        success: function () {
                                                            Ext.toast('Office deleted', 1500);

                                                            let currentUser =
                                                                Ext.Viewport.getViewModel().get('currentUser');

                                                            if (!currentUser || !currentUser.offices()) {
                                                                Ext.Viewport.unmask();
                                                                return;
                                                            }

                                                            currentUser.offices().reload({
                                                                callback: function () {
                                                                    // If current user was assigned to deleted office, update it.
                                                                    if (
                                                                        currentUser.get('current_office_id') ===
                                                                        delOfficeId
                                                                    ) {
                                                                        let firstOfficeId =
                                                                            currentUser.get('offices') &&
                                                                            currentUser.get('offices')[0]
                                                                                ? currentUser.get('offices')[0].office
                                                                                      .id
                                                                                : null;

                                                                        currentUser.set(
                                                                            'current_office_id',
                                                                            firstOfficeId
                                                                        );
                                                                        currentUser.save({
                                                                            success: function () {
                                                                                Ext.Viewport.unmask();

                                                                                // TODO: Here better send teams_rules_change notification from backend?
                                                                                // if (Ext.getCmp('permission_dialog')) {
                                                                                //     Ext.getCmp('permission_dialog').destroy();
                                                                                // }

                                                                                // Ext.create('Ext.MessageBox', {
                                                                                //     ui: 'warning',
                                                                                //     id: 'permission_dialog',
                                                                                //     title: 'Permissions update',
                                                                                //     testId: 'permissionsUpdateTeamsRulesMsgbox',
                                                                                //     innerCls: 'a-bgr-white',
                                                                                //     message: 'Your permissions have been changed. <br>Please reload the page.',
                                                                                //     width: 300,
                                                                                //     dataTitle: 'Warning',
                                                                                //     modal: true,
                                                                                //     draggable: false,
                                                                                //     bbar: {
                                                                                //         manageBorders: false,
                                                                                //         items: [
                                                                                //             '->',
                                                                                //             {
                                                                                //                 xtype: 'button',
                                                                                //                 iconCls: 'md-icon-refresh',
                                                                                //                 ui: 'action',
                                                                                //                 text: 'Reload',
                                                                                //                 testId: 'permissionsUpdateTeamsRulesMsgboxReloadBtn',
                                                                                //                 handler: function () {
                                                                                //                     window.location.reload();
                                                                                //                 },
                                                                                //             },
                                                                                //         ],
                                                                                //     },
                                                                                // }).show();
                                                                            },
                                                                        });
                                                                    } else {
                                                                        Ext.Viewport.unmask();
                                                                    }
                                                                },
                                                            });
                                                        },
                                                        failure: function () {
                                                            Ext.Viewport.unmask();
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
                            let upContainer = Ext.ComponentQuery.query('[itemId=officesMainContainer]')[0],
                                downContainer = Ext.ComponentQuery.query('[itemId=officeDetalsContainer]')[0];
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
                let upContainer = Ext.ComponentQuery.query('[itemId=officesMainContainer]')[0],
                    downContainer = Ext.ComponentQuery.query('[itemId=officeDetalsContainer]')[0];
                upContainer.setHidden(true);
                downContainer.setHidden(false);
            }
        },
    },
});
