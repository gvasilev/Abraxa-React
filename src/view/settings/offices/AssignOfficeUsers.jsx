Ext.define('Abraxa.view.settings.offices.AssignOfficeUsers', {
    extend: 'Ext.Dialog',
    xtype: 'assign.office.users',
    closable: true,
    bind: {
        title: '<div class="a-badge a-badge-add-users"><i class="material-icons-outlined">group_add</i></div>Assign users to office {office.name}',
    },
    scrollable: 'y',
    width: 540,
    height: '80%',
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'searchfield',
            margin: '0 0 8 0',
            padding: '0 24',
            ui: 'no-border classic',
            cls: 'a-field-icon icon-search',
            placeholder: 'Search...',
            listeners: {
                change: function (field, newValue, oldValue, eOpts) {
                    var usersWithoutOffice = this.upVM().get('usersWithoutOffice');
                    if (newValue == '') {
                        usersWithoutOffice.removeFilter('search');
                    }
                },
                action: function (me, newValue, oldValue, eOpts) {
                    var query = this.getValue().toLowerCase();
                    var usersWithoutOffice = this.upVM().get('usersWithoutOffice');
                    usersWithoutOffice.removeFilter('search');
                    if (query.length > 2) {
                        usersWithoutOffice.addFilter(
                            new Ext.data.Query({
                                id: 'search',
                                source: 'full_name like "' + query + '" or email like"' + query + '"',
                            })
                        );
                    }
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-grid-list',
            flex: 1,
            layout: 'vbox',
            scrollable: true,
            items: [
                {
                    xtype: 'list',
                    infinite: false,
                    bind: {
                        store: '{usersWithoutOffice}',
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
                        ],
                    },
                    emptyTextDefaults: {
                        xtype: 'emptytext',
                        cls: 'a-empty-text',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                renderUser: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (user) {
                                        if (user) {
                                            var assigned_to = user.get('first_name')[0] + '. ' + user.get('last_name');
                                            if (user.get('profile_image')) {
                                                return (
                                                    '<div class="a-person a_grid_action a-icon-round"><img height="32" src="' +
                                                    user.get('profile_image') +
                                                    '" /><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                                                    assigned_to +
                                                    '</div><div class="sm-title">' +
                                                    user.get('email') +
                                                    '</div></div></div>'
                                                );
                                            }
                                            return (
                                                '<div class="a-person a_grid_action"><i class="md-icon-outlined">person</i><div class="ml-4"><div class="text-truncate fw-b c-blue">' +
                                                assigned_to +
                                                '</div><div class="sm-title">' +
                                                user.get('email') +
                                                '</div></div></div>'
                                            );
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        height: 54,
                        cls: 'myStyle assing_user_in_team x-list-sortablehandle grabbable a-bb-100',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        padding: '0 24',
                        items: [
                            {
                                xtype: 'checkbox',
                                ui: 'medium',
                                margin: '0 16 0 0',
                                bind: {
                                    checked: '{record.checked}',
                                },
                                // listeners: {
                                //     change: function () {
                                //         let checked = this.getChecked(),
                                //             record = this.upVM().get('record');

                                //         record.set('selected', checked);
                                //     },
                                // },
                            },
                            {
                                xtype: 'div',
                                cls: 'text-truncate',
                                width: 284,
                                bind: {
                                    html: '{renderUser}',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                handler: function () {
                    var usersWithoutOffice = this.up('dialog').upVM().get('usersWithoutOffice');
                    usersWithoutOffice.removeFilter('search');

                    let items = usersWithoutOffice.getData().items;
                    Ext.each(items, function (item) {
                        if (item.get('checked') === true) {
                            item.set('checked', false);
                        }
                    });

                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                testId: 'assignOfficeUsersDialogTestId',
                ui: 'action',
                text: 'Assign',
                handler: function (cmp) {
                    var usersWithoutOffice = this.upVM().get('usersWithoutOffice');
                    usersWithoutOffice.removeFilter('search');

                    let office = this.upVM().get('office'),
                        // items = Ext.ComponentQuery.query('[cls~=assing_user_in_team]'),

                        // NOTE(boyan): Users should be selected from the data model and not from checked boxes,
                        // else only the users in the currently visible checkboxes are selected,
                        // so some of them could be skipped (when a search value was entered, for example).
                        items = usersWithoutOffice.getData().items,
                        selectedUsers = [];

                    Ext.Viewport.mask();

                    Ext.each(items, function (item) {
                        if (item.get('checked') === true) {
                            selectedUsers.push(item.get('id'));
                            item.set('checked', false);
                        }

                        // NOTE(boyan): OLD CODE in case something breaks:
                        // if (item.down('checkbox').getChecked()) {
                        //     selectedUsers.push(item.upVM().get('record').get('id'));
                        //     item.down('checkbox').uncheck();
                        // }
                    });
                    if (!selectedUsers.length) {
                        Ext.Viewport.unmask();

                        this.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select at least one user')
                            .show()
                            .addCls('error');
                    } else {
                        this.up('dialog').down('form\\.error').hide();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'offices/' + office.get('id') + '/assign_users',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            jsonData: {
                                users: selectedUsers,
                            },
                            success: function (response) {
                                cmp.up('dialog').destroy();
                                office.getProxy().setExtraParams({
                                    company_id: office.get('company_id'),
                                });
                                office.load({
                                    success: function () {},
                                });

                                Ext.toast('Users assigned', 1500);

                                let currentUser = Ext.Viewport.getViewModel().get('currentUser');

                                if (!currentUser || !currentUser.offices()) {
                                    Ext.Viewport.unmask();
                                    return;
                                }

                                currentUser.offices().reload({
                                    callback: function () {
                                        // Check if the current user is assigned to the office and has no office yet.
                                        // If so - update it.
                                        let updateCurrentUser = false;

                                        if (!currentUser.get('current_office_id')) {
                                            for (let i = 0; i < selectedUsers.length; i++) {
                                                if (selectedUsers[i] === currentUser.get('id')) {
                                                    updateCurrentUser = true;
                                                    break;
                                                }
                                            }
                                        }

                                        if (!updateCurrentUser) {
                                            Ext.Viewport.unmask();
                                            return;
                                        }

                                        let officeId = office.get('id');

                                        currentUser.set('current_office_id', officeId);
                                        currentUser.save({
                                            success: function () {
                                                Ext.Viewport.unmask();
                                                // TODO: Here teams_rules_change notification from backend is not always sent?
                                            },

                                            failure: function () {
                                                Ext.Viewport.unmask();
                                                Ext.Msg.alert(
                                                    'Assign user failed',
                                                    'There was a problem while assigning a user.'
                                                );
                                            },
                                        });
                                    },
                                });
                            },
                            failure: function (response) {
                                Ext.Viewport.unmask();

                                Ext.Msg.alert('Status', 'Request Failed.');
                            },
                        });
                    }
                },
            },
        ],
    },
    listeners: {
        painted: function (dialog) {
            dialog.on('close', function () {
                var usersWithoutOffice = dialog.upVM().get('usersWithoutOffice');
                usersWithoutOffice.removeFilter('search');

                let items = usersWithoutOffice.getData().items;
                Ext.each(items, function (item) {
                    if (item.get('checked') === true) {
                        item.set('checked', false);
                    }
                });

                dialog.destroy();
            });
        },
    },
});
