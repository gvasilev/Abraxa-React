Ext.define('Abraxa.view.portcall.MembersPreviewMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'members.preview.menu',
    width: 440,
    ui: 'dropdown',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            margin: '8 16',
            bind: {
                html: '{memberPreviewTitle} members',
            },
        },
        {
            xtype: 'abraxa.formlist',
            flex: 1,
            padding: '16 0 0',
            minHeight: 90,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            emptyText: 'No members in this section',
            bind: {
                store: '{sectionMembers}',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        accessText: {
                            bind: {
                                bindTo: '{record.permissions}',
                                deep: true,
                            },
                            get: function (permissions) {
                                if (permissions.count()) {
                                    if (permissions.count() != 12) return 'Selected access';

                                    return 'Full access';
                                }
                                return 'Limited access';
                            },
                        },
                        member_status: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record.get('has_accepted')) return 'active';

                                if (record.get('has_left') && record.get('has_accepted')) return 'left';

                                if (record.get('has_left') && !record.get('has_accepted')) return 'declined';

                                return 'pending';
                            },
                        },
                        qtip: {
                            bind: {
                                bindTo: '{member_status}',
                                deep: true,
                            },
                            get: function (access) {
                                let owner = this.get('record').get('is_owner');

                                if (!owner) {
                                    return (
                                        'data-qtip="' +
                                        Ext.String.capitalize(access) +
                                        '" data-qalign="bc-tc" data-qanchor="true"'
                                    );
                                }
                                return '';
                            },
                        },
                    },
                },
                xtype: 'container',
                cls: 'a-invited-company',
                margin: '0 0 24 0',
                padding: '0 24',
                flex: 1,
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        flex: 1,
                        bind: {
                            html: '<div class="party-item {record.has_left ? "left" : ""}"><div class="sm-function function-A {member_status}"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">{record.org_name} {(record.tenant_id == currentUser.current_company_id && record.invitation_id) || (object_record.company_id == currentUser.current_company_id && !record.invitation_id) ? "(you)" : ""} <i {qtip} class="a-invited-status md-icon {member_status}"></i></a><div class="sm-type">{record.org_email}</div></div>',
                        },
                    },
                ],
            },
        },
        {
            xtype: 'container',
            padding: '0 16 8',
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'button',
                    ui: 'tool-text-sm',
                    iconCls: 'md-icon-outlined md-icon-settings',
                    slug: 'portcallShare',
                    skipEditPermission: true,
                    text: 'Manage',
                    bind: {
                        hidden: '{nonEditable}',
                        permission: '{userPermissions}',
                    },

                    handler: function () {
                        let record = this.upVM().get('object_record'),
                            companyVerified = this.upVM().get('currentCompany').get('verified'),
                            portCallVM = Ext.ComponentQuery.query(
                                Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                    'portcall\\.main'
                            )[0].upVM();
                        Ext.create('Abraxa.view.invitations.InviteDialog', {
                            viewModel: {
                                parent: portCallVM,
                                data: {
                                    object_id: 3,
                                    object_meta_id: record.get('id'),
                                    object_record: record,
                                    newMembersCount: 0,
                                    invite_mode: false,
                                    companyVerified: companyVerified,
                                },
                                stores: {
                                    organizations: this.upVM().get('organizations'),
                                },
                                formulas: {
                                    buttonItem: {
                                        bind: {
                                            bindTo: '{nonEditable}',
                                            deep: true,
                                        },
                                        get: function (nonEditable) {
                                            if (nonEditable) {
                                                let container = {
                                                    xtype: 'container',
                                                    bind: {
                                                        hidden: '{record.is_owner ? true : false}',
                                                    },
                                                    layout: {
                                                        type: 'hbox',
                                                        align: 'middle',
                                                    },
                                                    items: [
                                                        {
                                                            xtype: 'div',
                                                            cls: 'a-status-badge status-default text-capitalize fw-b',
                                                            hidden: true,
                                                            bind: {
                                                                html: '<i class="material-icons-outlined md-14 mr-6">{record.role == "viewer" ? "remove_red_eye" : "edit"}</i>{record.role}',
                                                                hidden: '{!record.is_owner ? false : true}',
                                                            },
                                                        },
                                                    ],
                                                };
                                                return container;
                                            } else {
                                                let button = {
                                                    xtype: 'button',
                                                    // height: 24,
                                                    ui: 'status-md default',
                                                    bind: {
                                                        cls: 'status-{record.role}',
                                                        text: '{record.role:capitalize}',
                                                        hidden: '{record.is_owner ? true:false}',
                                                        menu: {
                                                            ui: 'info has-icons',
                                                            width: 320,
                                                            defaults: {
                                                                handler: function () {
                                                                    let member = this.upVM().get('record');
                                                                    member.set('role', this.role);
                                                                },
                                                            },
                                                            items: [
                                                                {
                                                                    role: 'can view',
                                                                    separator: true,
                                                                    slug: 'portcallShare',
                                                                    group: 'role',
                                                                    value: 'can view',
                                                                    bind: {
                                                                        permission: '{userPermissions}',
                                                                        checked:
                                                                            '{record.role == "can view" ? true : false}',
                                                                    },
                                                                    html: '<i class="md-icon-outlined">remove_red_eye</i><div class="sm-header">Can View</div><div class="sm-desc">This member can only view specific information in this port call.</div>',
                                                                },
                                                                {
                                                                    role: 'can edit',
                                                                    slug: 'portcallShare',
                                                                    // disabled: true,
                                                                    group: 'role',
                                                                    value: 'can edit',
                                                                    bind: {
                                                                        permission: '{userPermissions}',
                                                                        checked:
                                                                            '{record.role == "can edit" ? true : false}',
                                                                    },
                                                                    html: '<i class="md-icon-outlined">edit</i><div class="sm-header">Can Edit</div><div class="sm-desc">This member can view and edit specific information in this port call.</div>',
                                                                },
                                                                {
                                                                    html: '<i class="md-icon-outlined">delete</i><div class="sm-header c-red">Remove member</div><div class="sm-desc">This member will be removed and no longer receive updates related to this port call.</div>',
                                                                    separator: true,
                                                                    handler: function (me) {
                                                                        let member = me.upVM().get('record');
                                                                        Ext.Msg.confirm(
                                                                            'Delete',
                                                                            'Are you sure you want to remove the selected member?',
                                                                            function (btn) {
                                                                                if (btn === 'yes') {
                                                                                    me.upVM()
                                                                                        .get('members')
                                                                                        .remove(member);
                                                                                    me.upVM()
                                                                                        .get('members')
                                                                                        .sync({
                                                                                            success: function () {
                                                                                                Ext.getStore(
                                                                                                    'newMemberStore'
                                                                                                ).sync();
                                                                                                Ext.toast(
                                                                                                    'Record deleted',
                                                                                                    2500
                                                                                                );
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
                                                                                    ui: 'decline alt',
                                                                                    text: 'Delete',
                                                                                },
                                                                            ]
                                                                        );
                                                                    },
                                                                },
                                                            ],
                                                        },
                                                    },
                                                    arrow: true,
                                                };
                                                return button;
                                            }
                                        },
                                    },
                                },
                            },
                        }).show();
                        // if (companyVerified) {

                        // } else {
                        //     Ext.Msg.warning('<div class="hbox"><i class="material-icons c-grey my-8 mr-16">verified_user</i>Company verification</div>', '<b>Your company is not verified</b>.<br>Please submit the verification form to us before you can<br> start inviting your counterparties and explore the system.');
                        // }
                        mixpanel.track('Invite button clicked');
                    },
                },
            ],
        },
    ],
});
