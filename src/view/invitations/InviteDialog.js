import './AccessMenu';

Ext.define('Abraxa.view.invitations.InviteDialog', {
    extend: 'Ext.Dialog',
    xtype: 'invite.dialog',
    testId: 'inviteDialog',
    cls: 'a-invite-dialog',
    width: 580,
    minHeight: 540,
    scrollable: 'y',
    header: {
        layout: {
            type: 'hbox',
            pack: 'start',
        },
        title: {
            text: '<i></i>Members',
        },
    },
    toolDefaults: {
        xtype: 'tool',
        zone: 'start',
    },
    tools: {
        // back: {
        //     xtype: 'tool',
        //     ui: 'tool round',
        //     hidden: true,
        //     left: 8,
        //     bind: {
        //         hidden: '{invite_mode ? false : true}'
        //     },
        //     cls: 'backTool',
        //     iconCls: 'md-icon-keyboard-backspace',
        //     handler: function (me) {
        //         me.upVM().get('members').rejectChanges();
        //         this.upVM().set('invite_mode', false);
        //         me.down('[cls=invite_container]').down('abraxa\\.formlist').getVM().getStore('newMembers').removeAll();
        //     }
        // },
        info: {
            xtype: 'tool',
            ui: 'tool round',
            cls: 'backTool',
            iconCls: 'md-icon-info md-icon-outlined',
            hidden: true,
            tooltip: {
                html: 'This is the place where you can invite and safely share port call data with your clients and vendors.<br>Use different permission sets to ensure every party has access to the right set of information within the port call.<br>All members will receive individual emails & in-system notification when you publish your respective data.',
                showDelay: 0,
                hideDelay: 0,
                align: 'bc-tc?',
            },
            handler: function (me) {},
        },
    },
    closable: true,
    controller: 'invitation-controller',
    padding: 0,
    draggable: false,
    layout: 'vbox',
    bbar: {
        layout: {
            type: 'hbox',
            pack: 'space-between',
        },
        bind: {
            hidden: '{nonEditable ? true : false}',
        },
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                testId: 'inviteDialogCancelBtn',
                hidden: true,
                bind: {
                    hidden: '{invite_mode ? false : true}',
                },
                handler: function (me) {
                    let newMembers = me
                        .up('dialog')
                        .down('[cls=invite_container]')
                        .down('abraxa\\.formlist')
                        .getVM()
                        .getStore('newMembers');

                    newMembers.removeAll();
                    this.upVM().set('invite_mode', false);
                },
            },
            {
                xtype: 'button',
                text: 'Save',
                testId: 'inviteDialogSaveBtn',
                hidden: true,
                enableToggle: true,
                slug: 'portcallShare',
                ui: 'action loading',
                margin: '0 0 0 8',
                bind: {
                    hidden: '{invite_mode ? true : false}',
                    permission: '{userPermissions}',
                    disabled: '{members.needsSync ? false : true}',
                },
                handler: function (me) {
                    let store = this.upVM().get('members'),
                        object_record = this.upVM().get('object_record'),
                        folders = object_record.folders(),
                        disbursements = object_record.disbursements(),
                        accounts = object_record.accounts();
                    folders.getProxy().setUrl(Env.ApiEndpoint + 'folders/' + object_record.get('id'));

                    mixpanel.track('Save button (invite)');
                    store.sync({
                        success: function () {
                            me.toggle();
                            accounts.reload();
                            let storesForReload = [accounts, disbursements, folders];
                            let reloadAllStores = storesForReload.map(function (store) {
                                return Abraxa.utils.Functions.reloadStore(store);
                            });
                            Promise.all(reloadAllStores)
                                .then(function (results) {})
                                .catch(function (error) {});
                            folders.getProxy().setUrl(Env.ApiEndpoint + 'folders');
                            Ext.toast('Record updated');
                        },
                    });
                },
            },
            {
                xtype: 'button',
                text: 'Invite',
                testId: 'inviteDialogInviteBtn',
                cls: 'invite_button',
                hidden: true,
                enableToggle: true,
                slug: 'portcallShare',
                ui: 'action loading',
                margin: '0 0 0 8',
                bind: {
                    disabled: '{newMembersCount > 0 ? false : true}',
                    hidden: '{invite_mode ? false : true}',
                    permission: '{userPermissions}',
                },
                handler: function (me) {
                    let members = me.upVM().get('members'),
                        newMembers = me
                            .up('dialog')
                            .down('[cls=invite_container]')
                            .down('abraxa\\.formlist')
                            .getVM()
                            .getStore('newMembers'),
                        object_record = me.upVM().get('object_record'),
                        folders = object_record.folders(),
                        accounts = object_record.accounts(),
                        disbursements = object_record.disbursements(),
                        companyVerified = me.upVM().get('companyVerified'),
                        optionalMessage = me.up('dialog').down('textareafield').getValue();

                    folders.getProxy().setUrl(Env.ApiEndpoint + 'folders/' + object_record.get('id'));

                    if (companyVerified) {
                        if (newMembers.getCount() > 0) {
                            Ext.Array.each(newMembers.getData().items, function (value) {
                                if (optionalMessage) {
                                    value.set('optional_message', optionalMessage);
                                }
                                members.add(value);
                            });
                            members.sync({
                                success: function (err, msg) {
                                    mixpanel.track('Invited a member');
                                    let storesForReload = [accounts, disbursements, folders];
                                    let reloadAllStores = storesForReload.map(function (store) {
                                        return Abraxa.utils.Functions.reloadStore(store);
                                    });
                                    Promise.all(reloadAllStores)
                                        .then(function (results) {})
                                        .catch(function (error) {});
                                    me.toggle();
                                    newMembers.removeAll();
                                    let title = 'Invitation e-mail has been sent',
                                        content =
                                            'Once accepted you will be notified accordingly.<br>You may also follow the invitation status in the Share / Members popup.';
                                    Abraxa.popup.showSuccessDialog(title, content, members);
                                    me.upVM().set('invite_mode', false);
                                    let accountsRecords = accounts.getData();
                                    accountsRecords.each(function (rec) {
                                        let objectAccount = object_record.accounts().getById(rec.get('id'));
                                        if (objectAccount) {
                                            rec.members().loadData(Ext.Array.clone(objectAccount.members().getRange()));
                                        }
                                    });
                                    folders.getProxy().setUrl(Env.ApiEndpoint + 'folders');
                                    Ext.toast('Invitation sent!', 1000);
                                },
                                failure: function (batch) {
                                    me.toggle();
                                    Ext.Msg.alert(
                                        'Sending failed',
                                        'It seems your email settings have not been configured correctly.<br>Please make sure all details are available in your Settings profile'
                                    );
                                },
                            });
                        }
                    } else {
                        me.toggle();
                        Ext.Msg.warning(
                            '<div class="hbox"><i class="material-icons c-grey my-8 mr-16">verified_user</i>Company verification</div>',
                            '<b>Your company is not verified</b>.<br>Please submit the verification form to us before you can<br> start inviting your counterparties and explore the system.'
                        );
                    }
                },
            },
        ],
    },
    items: [
        {
            xtype: 'organization.combo',
            margin: '8 16 0',
            ui: 'field-xl no-border default',
            reference: 'company',
            clearable: false,
            labelAlign: 'top',
            label: false,
            matchFieldWidth: true,
            cls: 'a-field-icon icon-search',
            name: 'email',
            placeholder: 'Choose a company to invite',
            slug: 'portcallShare',
            bind: {
                permission: '{userPermissions}',
                hidden: '{nonEditable ? true : false}',
            },
            listeners: {
                // painted: function (me) {
                //     me.focus();
                // },
                select: function (me, selection) {
                    if (selection && !selection.isEntered) {
                        let object_record = me.upVM().get('object_record'),
                            members = object_record.members(),
                            currentCompany = me.upVM().get('currentCompany'),
                            newMembers = me
                                .up('dialog')
                                .down('[cls=invite_container]')
                                .down('abraxa\\.formlist')
                                .getVM()
                                .getStore('newMembers'),
                            memberExists = members.queryBy(function (record) {
                                return (
                                    record.get('invitation') &&
                                    record.get('has_left') === 0 &&
                                    record.get('invitation').org_id === selection.get('org_id')
                                );
                            });
                        if (memberExists.items.length > 0) {
                            Ext.Msg.alert(
                                'Members information',
                                '<div class="fs-16 fw-b"><span class="c-blue">' +
                                    selection.get('org_name') +
                                    '</span> has been already invited.</div><p class="c-grey-500">Please select another member to invite.</p>'
                            );
                            me.getValueCollection().remove(selection);
                        } else {
                            if (currentCompany.email === selection.get('org_email')) {
                                Ext.Msg.alert(
                                    'Members information',
                                    '<div class="fs-16 fw-b">А member with that email address has already been invited.</div><p class="c-grey-500">Please select another member to invite.</p>'
                                );
                                me.getValueCollection().remove(selection);
                            } else {
                                let existingRecord = newMembers.findRecord(
                                    'org_id',
                                    selection.get('org_id'),
                                    0,
                                    false,
                                    false,
                                    true
                                );
                                if (!existingRecord) {
                                    this.upVM().set('invite_mode', true);
                                    Ext.ComponentQuery.query('[cls~=invite_container]')[0].show();
                                    newMembers.add({
                                        org_id: selection.get('org_id'),
                                        org_name: selection.get('org_name'),
                                        invitation_email: selection.get('org_email'),
                                        org_email: selection.get('org_email'),
                                        org_phone: selection.get('org_phone'),
                                        voyage_id: object_record.getVoyage().get('id'),
                                        object_id: 3,
                                        object_meta_id: object_record.get('id'),
                                        tenant_id: selection.get('is_tenant') ? selection.get('is_tenant').id : null,
                                        role: 'can view',
                                        permissions: [],
                                    });
                                }
                            }
                            me.getValueCollection().remove(selection);
                            me.clearValue();
                            me.collapse();
                        }
                    }
                },
            },
        },
        {
            xtype: 'abraxa.formlist',
            flex: 1,
            padding: '24 0',
            showAnimation: {
                type: 'slide',
                direction: 'right',
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
                        html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21.6,29.5C15.048,29.5,2,32.776,2,39.3v4.9H41.2V39.3C41.2,32.776,28.152,29.5,21.6,29.5ZM8.552,38.6c2.352-1.624,8.036-3.5,13.048-3.5s10.7,1.876,13.048,3.5ZM21.6,24.6a9.8,9.8,0,1,0-9.8-9.8A9.811,9.811,0,0,0,21.6,24.6Zm0-14a4.2,4.2,0,1,1-4.2,4.2A4.194,4.194,0,0,1,21.6,10.6ZM41.312,29.668C44.56,32.02,46.8,35.156,46.8,39.3v4.9H58V39.3C58,33.644,48.2,30.424,41.312,29.668ZM38.4,24.6A9.8,9.8,0,1,0,38.4,5a9.647,9.647,0,0,0-4.2.98,15.291,15.291,0,0,1,0,17.64A9.647,9.647,0,0,0,38.4,24.6Z" transform="translate(690 425.4)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No members invited yet! <span class="fs-13">Invite your partners to jointly collaborate</span></div></div>',
                    },
                    {
                        xtype: 'button',
                        testId: 'inviteDialogAddMembersBtn',
                        text: 'Add members',
                        cls: 'a-no-content-btn',
                        slug: 'portcallShare',
                        bind: {
                            hidden: '{currentCompany.verified ? false:true}',
                            permission: '{userPermissions}',
                        },
                        ui: 'normal-light medium',
                        iconCls: 'md-icon-outlined md-icon-group-add',
                        handler: function () {
                            this.upVM().set('invite_mode', true);
                        },
                    },
                ],
            },
            bind: {
                store: {
                    bindTo: '{members}',
                    deep: true,
                },
                hidden: '{invite_mode ? true : false}',
            },
            itemConfig: {
                viewModel: {
                    data: {
                        activateDocumentFormula: new Date(),
                        activateAccountFormula: new Date(),
                    },
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
                        currentMember: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                return record;
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
                        memberInAccount: {
                            bind: {
                                accounts: '{accountMemberStore}',
                                member: '{currentMember}',
                                activateAccountFormula: '{activateAccountFormula}',
                            },
                            get: function (data) {
                                let members = 0;
                                if (data.member && data.accounts && data.accounts.getCount()) {
                                    let store = data.accounts,
                                        currentMember = data.member;

                                    let member = store.query('member_id', currentMember.get('id'));
                                    members = member.items.length;
                                }
                                return members;
                            },
                        },
                        accountMemberStore: {
                            bind: {
                                accounts: '{object_record.accounts}',
                                member: '{currentMember}',
                            },
                            get: function (data) {
                                let items = [];
                                if (data.member && data.accounts && data.accounts.getCount()) {
                                    let store = data.accounts,
                                        currentMember = data.member;
                                    store.each(function (value) {
                                        let item = {
                                            id: value.get('id'),
                                            currency: value.get('currency'),
                                            balance: value.get('balance'),
                                            bill_to_name: value.get('org_name'),
                                            disbursements: value.disbursements(),
                                        };
                                        let member = value.members().query('member_id', currentMember.get('id'));
                                        if (member.items.length) {
                                            item.checked = true;
                                            item.member_id = currentMember.get('id');
                                        } else {
                                            item.checked = false;
                                            item.member_id = null;
                                        }
                                        items.push(item);
                                    });
                                }
                                return new Ext.data.Store({
                                    data: items,
                                    id: 'accountMemberStoreData',
                                    proxy: {
                                        type: 'memory',
                                    },
                                    sorters: [
                                        {
                                            property: 'id',
                                            direction: 'ASC',
                                        },
                                    ],
                                });
                            },
                        },
                        folderStore: {
                            bind: {
                                folders: '{object_record.folders}',
                                member: '{currentMember}',
                            },
                            get: function (data) {
                                if (data.member && data.folders && data.folders.getCount()) {
                                    let store = data.folders,
                                        currentMember = data.member,
                                        items = [];
                                    store.each(function (value) {
                                        let item = {
                                            is_shared: value.get('is_shared'),
                                            folder_id: value.get('id'),
                                            name: value.get('name'),
                                            file_count: value.documents().count(),
                                            is_disabled: value.get('is_shared') ? false : true,
                                        };
                                        let member = value.members().query('member_id', currentMember.get('id'));
                                        if (member.items.length) {
                                            item.checked = true;
                                            item.member_id = currentMember.get('id');
                                        } else {
                                            item.checked = false;
                                            item.member_id = null;
                                        }
                                        if (item.is_shared) items.push(item);
                                    });
                                    return new Ext.data.Store({
                                        data: items,
                                        id: 'folderStoreData',
                                        proxy: {
                                            type: 'memory',
                                        },
                                    });
                                }
                            },
                        },
                        memberInFolders: {
                            bind: {
                                folders: '{folderStore}',
                                member: '{currentMember}',
                                activateDocumentFormula: '{activateDocumentFormula}',
                            },
                            get: function (data) {
                                let members = 0;
                                if (data.member && data.folders && data.folders.getCount()) {
                                    let store = data.folders,
                                        currentMember = data.member;

                                    let member = store.query('member_id', currentMember.get('id'));
                                    members = member.items.length;
                                }
                                return members;
                            },
                        },
                    },
                },
                xtype: 'container',
                margin: '0 0 24 0',
                padding: '0 24',
                bind: {
                    cls: '{record.is_owner ? "is-owner" : "a-invited-company"}',
                },
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
                    {
                        xtype: 'container',
                        minWidth: 124,
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'end',
                        },
                        hidden: true,
                        bind: {
                            hidden: '{record.is_owner || nonEditable || record.has_left ? true : false}',
                        },
                        items: [
                            {
                                xtype: 'button',
                                ui: 'status-md default',
                                cls: 'chameleon_portcall_invite_role_dropdown',
                                testId: 'inviteDialogInviteDropdownBtn',
                                bind: {
                                    text: '{accessText}',
                                },
                                arrow: true,
                                margin: '0 8 0 0',
                                menu: {
                                    xtype: 'invitations.access.menu',
                                },
                            },
                            {
                                xtype: 'button',
                                // height: 24,
                                width: 100,
                                ui: 'status-md default',
                                testId: 'inviteDialogInviteViewEditRolesBtn',
                                bind: {
                                    text: '{record.role}',
                                    hidden: '{record.is_owner ? true:false}',
                                    menu: {
                                        ui: 'info has-icons',
                                        width: 320,
                                        defaults: {
                                            handler: function () {
                                                let member = this.upVM().get('record');
                                                member.set('role', this.role);
                                                if (this.role == 'can view') {
                                                    mixpanel.track('Can View – button');
                                                }
                                                if (this.role == 'can edit') {
                                                    mixpanel.track('Can Edit – button');
                                                }
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
                                                    checked: '{record.role == "can view" ? true : false}',
                                                },
                                                html: '<div class="sm-header">Can View</div><div class="sm-desc">This member can only view specific information in this port call.</div>',
                                            },
                                            {
                                                role: 'can edit',
                                                slug: 'portcallShare',
                                                // disabled: true,
                                                group: 'role',
                                                value: 'can edit',
                                                bind: {
                                                    permission: '{userPermissions}',
                                                    checked: '{record.role == "can edit" ? true : false}',
                                                },
                                                html: '<div class="sm-header">Can Edit</div><div class="sm-desc">This member can view and edit specific information in this port call.</div>',
                                            },
                                            {
                                                html: '<i class="md-icon-outlined">delete</i><div class="sm-header c-red">Remove member</div><div class="sm-desc">This member will be removed and no longer receive updates related to this port call.</div>',
                                                separator: true,
                                                handler: function (me) {
                                                    let member = me.upVM().get('record'),
                                                        object_record = this.upVM().get('object_record'),
                                                        members = this.upVM().get('members'),
                                                        disbursements = object_record.disbursements();
                                                    if (member.get('tenant_id') == object_record.get('originated_by')) {
                                                        Ext.Msg.alert(
                                                            'Remove member',
                                                            'You cannot remove the member who created this port call.'
                                                        );
                                                        return;
                                                    }
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you want to remove this member?',
                                                        function (btn) {
                                                            if (btn === 'yes') {
                                                                members.remove(member);
                                                                members.sync({
                                                                    success: function () {
                                                                        Ext.getStore('newMemberStore').sync();
                                                                        disbursements.reload();
                                                                        Ext.toast('Record deleted', 2500);
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
                            },
                        ],
                    },
                    {
                        xtype: 'container',
                        hidden: true,
                        bind: {
                            hidden: '{nonEditable || !record.has_left ? true : false}',
                        },
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'button',
                                ui: 'default small',
                                iconCls: 'md-icon-outlined md-icon-delete',
                                text: 'Remove',
                                testId: 'inviteDialogInviteRemoveSmallBtn',
                                handler: function (me) {
                                    let member = me.upVM().get('record');
                                    Ext.Msg.confirm(
                                        'Delete',
                                        'Are you sure you want to remove the selected member?',
                                        function (btn) {
                                            if (btn === 'yes') {
                                                me.upVM().get('members').remove(member);
                                                me.upVM()
                                                    .get('members')
                                                    .sync({
                                                        success: function () {
                                                            Ext.getStore('newMemberStore').sync();
                                                            Ext.toast('Record deleted', 2500);
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
                                                text: 'Remove',
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'container',
                        bind: {
                            hidden: '{record.is_owner ? false : true}',
                        },
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-status-badge a-status-md no-border status-default',
                                bind: {
                                    html: '<i class="material-icons-outlined md-18 mr-8">how_to_reg</i>Record owner',
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            xtype: 'container',
            layout: 'vbox',
            cls: 'invite_container',
            hidden: true,
            bind: {
                hidden: '{invite_mode ? false : true}',
            },
            showAnimation: 'fadeIn',
            flex: 1,
            scrollable: false,
            padding: '0 24',
            items: [
                {
                    xtype: 'abraxa.formlist',
                    testId: 'inviteDialogAbxFormlist',
                    flex: 1,
                    viewModel: {
                        stores: {
                            newMembers: new Ext.data.Store({
                                data: [],
                                id: 'newMemberStore',
                                model: 'Abraxa.model.portcall.Member',
                                proxy: {
                                    type: 'memory',
                                },
                            }),
                        },
                        formulas: {
                            newMembersCount: {
                                bind: {
                                    bindTo: '{newMembers.count}',
                                    deep: true,
                                },
                                get: function (count) {
                                    this.getParent().set('newMembersCount', count);
                                },
                            },
                        },
                    },
                    bind: {
                        store: '{newMembers}',
                    },
                    itemConfig: {
                        viewModel: {
                            data: {
                                activateDocumentFormula: new Date(),
                                activateAccountFormula: new Date(),
                                disbursementsPermission: [],
                            },
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
                                currentMember: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        return record;
                                    },
                                },
                                memberInAccount: {
                                    bind: {
                                        accounts: '{accountMemberStore}',
                                        member: '{currentMember}',
                                        activateAccountFormula: '{activateAccountFormula}',
                                    },
                                    get: function (data) {
                                        let members = 0;
                                        if (data.member && data.accounts && data.accounts.getCount()) {
                                            let store = data.accounts,
                                                currentMember = data.member;

                                            let member = store.query('member_id', currentMember.get('id'));
                                            members = member.items.length;
                                        }
                                        return members;
                                    },
                                },
                                accountMemberStore: {
                                    bind: {
                                        accounts: '{object_record.accounts}',
                                        member: '{currentMember}',
                                    },
                                    get: function (data) {
                                        let items = [];
                                        if (data.member && data.accounts && data.accounts.getCount()) {
                                            let store = data.accounts,
                                                currentMember = data.member;
                                            store.each(function (value) {
                                                let item = {
                                                    id: value.get('id'),
                                                    currency: value.get('currency'),
                                                    balance: value.get('balance'),
                                                    bill_to_name: value.get('org_name'),
                                                    disbursements: value.disbursements(),
                                                };
                                                let member = value
                                                    .members()
                                                    .query('member_id', currentMember.get('id'));

                                                if (member.items.length) {
                                                    item.checked = true;
                                                    item.member_id = currentMember.get('id');
                                                } else {
                                                    item.checked = false;
                                                    item.member_id = null;
                                                }
                                                items.push(item);
                                            });
                                        }
                                        return new Ext.data.Store({
                                            data: items,
                                            id: 'accountMemberStoreData',
                                            proxy: {
                                                type: 'memory',
                                            },
                                            sorters: [
                                                {
                                                    property: 'id',
                                                    direction: 'ASC',
                                                },
                                            ],
                                        });
                                    },
                                },
                                folderStore: {
                                    bind: {
                                        folders: '{object_record.folders}',
                                        member: '{currentMember}',
                                    },
                                    get: function (data) {
                                        if (data.member && data.folders && data.folders.getCount()) {
                                            let store = data.folders,
                                                currentMember = data.member,
                                                items = [];
                                            store.each(function (value) {
                                                let item = {
                                                    is_shared: value.get('is_shared'),
                                                    folder_id: value.get('id'),
                                                    name: value.get('name'),
                                                    file_count: value.documents().count(),
                                                    is_disabled: value.get('is_shared') ? false : true,
                                                };
                                                let member = value
                                                    .members()
                                                    .query('member_id', currentMember.get('id'));
                                                if (member.items.length) {
                                                    item.checked = true;
                                                    item.member_id = currentMember.get('id');
                                                } else {
                                                    item.checked = false;
                                                    item.member_id = null;
                                                }
                                                if (item.is_shared) items.push(item);
                                            });
                                            return new Ext.data.Store({
                                                data: items,
                                                id: 'folderStoreData',
                                                proxy: {
                                                    type: 'memory',
                                                },
                                            });
                                        }
                                    },
                                },
                                memberInFolders: {
                                    bind: {
                                        folders: '{folderStore}',
                                        member: '{currentMember}',
                                        activateDocumentFormula: '{activateDocumentFormula}',
                                    },
                                    get: function (data) {
                                        let members = 0;
                                        if (data.member && data.folders && data.folders.getCount()) {
                                            let store = data.folders,
                                                currentMember = data.member;

                                            let member = store.query('member_id', currentMember.get('id'));
                                            members = member.items.length;
                                        }
                                        return members;
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        cls: 'a-invite-company-item',
                        items: [
                            {
                                xtype: 'div',
                                bind: {
                                    html:
                                        '<div class="party-item">' +
                                        '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
                                        '<a href="javascript:void(0);" class="sm-company fw-b" data-company-id="{record.org_id}">{record.org_name}</a><div class="sm-type">{record.org_email}</div>' +
                                        '</div>',
                                },
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                right: 0,
                                top: 1,
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'status-md default',
                                        cls: 'chameleon_portcall_invite_role_dropdown',
                                        testId: 'inviteDialogInviteInvitationAccessMenuBtn',
                                        bind: {
                                            text: '{accessText}',
                                        },
                                        arrow: true,
                                        margin: '0 8 0 0',
                                        menu: {
                                            xtype: 'invitations.access.menu',
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'status-md default',
                                        testId: 'inviteDialogInviteInvitationAccessRoleDropdownBtn',
                                        cls: 'chameleon_portcall_invite_role_dropdown',
                                        bind: {
                                            text: '{record.role}',
                                        },
                                        arrow: true,
                                        width: 100,
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
                                                        checked: '{record.role == "can view" ? true : false}',
                                                    },
                                                    html: '<div class="sm-header">Can View</div><div class="sm-desc">This member can only view specific information in this port call.</div>',
                                                },
                                                {
                                                    role: 'can edit',
                                                    slug: 'portcallShare',
                                                    // disabled: true,
                                                    group: 'role',
                                                    value: 'can edit',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                        checked: '{record.role == "can edit" ? true : false}',
                                                    },
                                                    html: '<div class="sm-header">Can Edit</div><div class="sm-desc">This member can view and edit specific information in this port call.</div>',
                                                },
                                                {
                                                    html: '<i class="md-icon-outlined">delete</i><div class="sm-header c-red">Remove member</div><div class="sm-desc">This member will be removed and no longer receive updates related to this port call.</div>',
                                                    separator: true,
                                                    slug: 'portcallShare',
                                                    bind: {
                                                        permission: '{userPermissions}',
                                                    },
                                                    handler: function (me) {
                                                        let member = me.upVM().get('record');
                                                        me.upVM().getParent().getStore('newMembers').remove(member);
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
                {
                    xtype: 'textareafield',
                    margin: '24 0 0 0',
                    ui: 'classic no-border',
                    cls: 'a-field-icon icon-short',
                    label: false,
                    labelAlign: 'top',
                    testId: 'inviteDialogInviteAddMessageField',
                    placeholder: 'Add a message (optional)',
                    slug: 'portcallShare',
                    bind: {
                        permission: '{userPermissions}',
                    },
                },
            ],
        },
    ],
    listeners: {
        destroy: function (me) {
            Ext.getStore('newMemberStore').removeAll();
            let members = me.upVM().get('members');
            if (members) {
                members.reload();
            }
        },
    },
});
