Ext.define('Abraxa.view.portcall.PortCallHeader', {
    extend: 'Ext.Container',
    xtype: 'portcall.header',
    layout: 'vbox',
    flex: 1,
    slug: 'portcall',
    testId: 'portCallTopBar',
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-main-titlebar',
            items: [
                {
                    xtype: 'div',
                    itemId: 'mainTitle',
                    cls: 'a-main-title has-dropdown',
                    bind: {
                        html: '<h1>{portCallRecord.voyage.vessel_name}</h1>',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                let menu = Ext.create('Abraxa.view.main.RecentlyOpenedMenu', {
                                    viewModel: {
                                        parent: Ext.getCmp('main-viewport').getViewModel(),
                                    },
                                });
                                menu.showBy(this);
                            },
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-main-id',
                    testId: 'portcallOverviewTooltip',
                    bind: {
                        html: '{portCallRecord.file_id}',
                    },
                    tooltip: {
                        html: 'Port call overview',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                let portcall = this.component.lookupViewModel().get('portCallRecord'),
                                    dialog = Ext.create('Abraxa.view.portcall.PortcallInfoDialog', {
                                        viewModel: {
                                            parent: this.component.lookupViewModel(),
                                        },
                                    });
                                if (portcall) {
                                    dialog.getVM().set('portcall', portcall);
                                    dialog.getVM().set('dialog', true);
                                    dialog.show();
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'tool',
                    cls: 'a-main-subscribe',
                    testId: 'portCallTopBarSubscribeTool',
                    bind: {
                        iconCls:
                            '{portCallRecord.is_watching ? "md-icon-notifications c-yellow" : "md-icon-outlined md-icon-notifications"}',
                    },
                    // ui: 'tool-sm',
                    tooltip: {
                        html: 'Subscribe to start receiving<br> follow up notifications',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    handler: function (me) {
                        let record = me.lookupViewModel().get('portCallRecord'),
                            recentlyOpened = me.lookupViewModel().get('recentlyOpened'),
                            favourite = record.get('is_watching');
                        if (favourite) {
                            record.set('is_watching', 0);
                        } else {
                            record.set('is_watching', 1);
                        }
                        record.save({
                            success: function () {
                                Ext.toast('Record updated');
                                recentlyOpened.reload();
                            },
                        });
                    },
                    // listeners: {
                    //     h: {
                    //         element: "element",
                    //         delegate: ".a-fav",
                    //         fn: function fn() {
                    //             let record = this.component.getRecord(),
                    //                 recentlyOpened = this.component.up('grid').lookupViewModel().get('recentlyOpened'),
                    //                 favourite = record.get("is_watching");
                    //             if (favourite) {
                    //                 record.set("is_watching", 0);
                    //             } else {
                    //                 record.set("is_watching", 1);
                    //             }
                    //             record.save({
                    //                 success: function () {
                    //                     recentlyOpened.reload();
                    //                 }
                    //             });
                    //         }
                    //     }
                    // }
                },
                {
                    xtype: 'tool',
                    cls: 'a-main-more',
                    // ui: 'tool-sm',
                    iconCls: 'md-icon-more-horiz',
                    testId: 'portCallTopBarMoreActionsTool',

                    tooltip: {
                        html: 'More actions',
                        anchor: true,
                        anchorToTarget: true,
                        align: 't50-b50',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        closeAction: 'destroy',
                    },
                    handler: function handler(owner, tool, e) {
                        let vm = owner.lookupViewModel(),
                            record = vm.get('portCallRecord');
                        if (record) {
                            if (record.get('company_id') != vm.get('currentUser').get('current_company_id')) {
                                Ext.create('Abraxa.view.portcalls.principal.PortcallsPrincipalEditMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            portcall: record,
                                            call_from_grid: false,
                                            is_archived: false,
                                        },
                                    },
                                }).showBy(this);
                            } else if (record.get('is_archived')) {
                                Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentArchivedMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            portcall: record,
                                            call_from_grid: false,
                                            is_archived: true,
                                        },
                                    },
                                }).showBy(this);
                            } else {
                                Ext.create('Abraxa.view.portcalls.agent.PortcallsAgentEditMenu', {
                                    viewModel: {
                                        parent: vm,
                                        data: {
                                            portcall: record,
                                            call_from_grid: false,
                                            is_archived: false,
                                        },
                                    },
                                }).showBy(this);
                            }
                        }
                    },
                },
                {
                    xtype: 'container',
                    subObject: 'general',
                    testId: 'portCallTopBarBtnsContainer',
                    bind: {
                        objectPermission: '{objectPermissions}',
                        cls: '{nonEditable ? "hidden" : ""}',
                    },
                    items: [
                        {
                            xtype: 'button',
                            testId: 'portCallTopBarStatusBtn',
                            ui: 'status status-md default',
                            slug: 'portcallStatus',
                            bind: {
                                text: '{portCallRecord.status_data.name}',
                                cls: 'a-main-status status-{portCallRecord.status_data.string}',
                                permission: '{userPermissions}',
                            },
                            menu: {
                                listeners: {
                                    initialize: function (me) {
                                        let store = me.lookupViewModel().get('portcallAgentStatus'),
                                            items = [];
                                        store.each(function (value) {
                                            let item = {
                                                text: value.get('name'),
                                                statusId: value.get('id'),
                                            };
                                            items.push(item);
                                        });
                                        me.setItems(items);
                                    },
                                },
                                defaults: {
                                    handler: function () {
                                        var record = this.lookupViewModel().get('portCallRecord'),
                                            status_id = this.statusId;

                                        record.set('status_id', status_id);

                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                                mixpanel.track('Portcall status change');
                                            },
                                        });
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    hidden: true,
                    bind: {
                        html: '<div class="a-status-badge a-status-md status-{portCallRecord.status_data.string}">{portCallRecord.status_data.name}</div>',
                        hidden: '{editablePermissions || portCallRecord.is_archived ? true : false}',
                    },
                },
                {
                    xtype: 'div',
                    hidden: true,
                    bind: {
                        html: '<div class="a-status-badge a-status-md status-{portCallRecord.status_data.string}">{portCallRecord.status_data.name}</div>',
                        hidden: '{portCallRecord.is_archived ? false:true}',
                    },
                },
                {
                    xtype: 'public.updated.by',
                    cls: 'a-main-updated',
                    hidden: true,
                    bind: {
                        hidden: '{portCallRecord.updated_by ? false : true}',
                        data: {
                            user: '{portCallRecord.updated_by_user}',
                            updated_at: '{portCallRecord.updated_at}',
                        },
                    },
                },
                {
                    xtype: 'div',
                    cls: 'a-status-closed',
                    html: '<div class="a-status-badge status-rejected">CLOSED</div>',
                    hidden: true,
                    bind: {
                        hidden: '{portCallRecord.is_archived ? false : true}',
                    },
                },
            ],
        },
        {
            xtype: 'tabbar',
            cls: 'a-main-tabs portcall_tabs',
            animateIndicator: false,
            activeTab: 0,
            defaults: {
                ui: 'tab-main',
                ripple: false,
            },
            reference: 'mainTabbar',
            publishes: {
                activeTab: true,
                activeTabIndex: true,
            },
            bind: {
                activeTabIndex: '{activePortcallTab}',
            },
            items: [
                {
                    text: 'Overview',
                    type: 'summary.main',
                    hideMode: 'offsets',
                    cls: 'chameleon_portcall_overview_tab',
                    hash: '',
                    testId: 'portCallHeaderOverviewButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.overview}',
                    },
                },
                {
                    text: 'Appointment',
                    type: 'appointment.main',
                    cls: 'chameleon_portcall_appointment_tab',
                    hash: 'appointment',
                    testId: 'portCallHeaderAppointmentButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.appointment}',
                    },
                },
                {
                    text: 'Ops',
                    type: 'sof.main',
                    cls: 'chameleon_portcall_ops_tab',
                    hash: 'ops',
                    testId: 'portCallHeaderOpsButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.ops}',
                    },
                    stateful: ['text'],
                    stateId: 'sofTab',
                    listeners: {
                        initialize: function (me) {
                            this.editor = new Ext.Editor({
                                // update the innerHTML of the bound element
                                // when editing completes
                                updateEl: true,
                                alignment: 'l-l',
                                autoSize: true,
                                field: {
                                    xtype: 'textfield',
                                },
                            });
                            this.editor.on('complete', function (item, value) {
                                if (value) me.setText(value);
                            });
                        },
                        dblclick: {
                            element: 'element', //bind to the underlying body property on the panel
                            fn: function (target, el) {
                                let component = Ext.fly(el).component;

                                if (component && component.editor) component.editor.startEdit(component.bodyElement);
                            },
                        },
                    },
                },
                {
                    text: 'Documents',
                    type: 'documents.main',
                    cls: 'chameleon_portcall_documents_tab',
                    hash: 'documents',
                    testId: 'portCallHeaderDocumentsButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.documents}',
                    },
                },
                {
                    text: 'Services',
                    type: 'husbandry.main',
                    cls: 'chameleon_portcall_husbandry_tab',
                    hash: 'husbandry',
                    testId: 'portCallHeaderHusbandryButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.husbandry}',
                    },
                },
                {
                    text: 'Disbursements',
                    type: 'disbursements.main',
                    cls: 'chameleon_portcall_disbursements_tab',
                    hash: 'disbursements',
                    testId: 'portCallHeaderDisbursementsButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.accounts}',
                    },
                },
                {
                    text: 'Payments',
                    type: 'payments.main',
                    cls: 'chameleon_portcall_payments_tab',
                    hash: 'payments',
                    testId: 'portCallHeaderPaymentsButton',
                    bind: {
                        permission: '{userPermissions}',
                        hidden: '{is_owner ? false : true}',
                    },
                },
                {
                    text: 'KPIs',
                    type: 'portcall.sof.kpis',
                    cls: 'chameleon_portcall_kpis_tab',
                    hash: 'kpis',
                    testId: 'portCallHeaderKPIsButton',
                    hidden: true,
                    bind: {
                        hidden: '{hideSections.kpis}',
                    },
                },
            ],
            listeners: {
                click: {
                    element: 'element',
                    delegate: '.x-tab',
                    fn: function (tab) {
                        let activeTab = Ext.get(tab.currentTarget).component.parent.getActiveTab();
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo(
                                '#portcall/' + activeTab.lookupViewModel().get('routeParams') + '/' + activeTab.hash
                            );
                    },
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-main-right',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'verified.div',
                },
                {
                    xtype: 'container',
                    cls: 'a-main-shared',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            width: 140,
                            html: '<div class="a-status-badge status-rejected">Live feed disabled</div>',
                            hidden: true,
                            bind: {
                                hidden: '{portCallRecord.parent_id ? false : true}',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'a-main-reported',
                            hidden: true,
                            bind: {
                                html: '<span>Last reported:</span> {lastReportedDateFormated}',
                                hidden: '{!lastReported || nonEditable}',
                            },
                        },
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-share',
                            ui: 'small outlined gradient',
                            margin: '0 16',
                            hidden: true,
                            cls: 'chameleon_portcall_members_link a-main-share',
                            slug: 'portcallShare',
                            skipEditPermission: true,
                            bind: {
                                hidden: '{nonEditable && !portCallRecord.parent_id ? false : true}',
                                text: 'Members <em>{portCallRecord.members.count}</em>',
                                permission: '{userPermissions}',
                            },
                            handler: function () {
                                let record = this.lookupViewModel().get('portCallRecord'),
                                    companyVerified = this.lookupViewModel().get('currentCompany').get('verified'),
                                    portCallVM = Ext.ComponentQuery.query(
                                        window.CurrentUser.get('company').type + 'portcall\\.main'
                                    )[0].lookupViewModel();

                                Ext.create('Abraxa.view.invitations.InviteDialog', {
                                    viewModel: {
                                        parent: portCallVM,
                                        data: {
                                            object_id: 3,
                                            object_meta_id: record.get('id'),
                                            portCallRecord: record,
                                            newMembersCount: 0,
                                            invite_mode: false,
                                            companyVerified: companyVerified,
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
                                                                    cls: 'a-status-badge status-default text-capitalize fw-b chameleon_portcall_status_disabled',
                                                                    bind: {
                                                                        html: '<i class="material-icons-outlined md-14 mr-6">{record.role == "viewer" ? "remove_red_eye" : "edit"}</i>{record.role}',
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
                                                            slug: 'portcallShare',
                                                            bind: {
                                                                cls: 'status-{record.role} chameleon_portcall_status_button',
                                                                text: '{record.role:capitalize}',
                                                                hidden: '{record.is_owner ? true:false}',
                                                                permission: '{userPermissions}',
                                                                menu: {
                                                                    ui: 'info has-icons',
                                                                    width: 320,
                                                                    defaults: {
                                                                        handler: function () {
                                                                            let member =
                                                                                this.lookupViewModel().get('record');
                                                                            member.set('role', this.role);
                                                                            if (member.dirty)
                                                                                member.save({
                                                                                    success: function () {
                                                                                        Ext.toast('Record updated');
                                                                                    },
                                                                                });
                                                                        },
                                                                    },
                                                                    items: [
                                                                        {
                                                                            html: '<i class="md-icon-outlined">delete</i><div class="sm-header c-red">Remove member</div><div class="sm-desc">This member will be removed and no longer receive updates related to this port call.</div>',
                                                                            handler: function (me) {
                                                                                let member = me
                                                                                        .lookupViewModel()
                                                                                        .get('record'),
                                                                                    portCallRecord = me
                                                                                        .lookupViewModel()
                                                                                        .get('portCallRecord'),
                                                                                    folders = portCallRecord.folders();
                                                                                Ext.Msg.confirm(
                                                                                    'Delete',
                                                                                    'Are you sure you want to remove the selected member?',
                                                                                    function (btn) {
                                                                                        if (btn === 'yes') {
                                                                                            folders.each(
                                                                                                function (folder) {
                                                                                                    let folderMembers =
                                                                                                            folder.members(),
                                                                                                        folderMember =
                                                                                                            folderMembers.findRecord(
                                                                                                                'member_id',
                                                                                                                member.get(
                                                                                                                    'id'
                                                                                                                ),
                                                                                                                0,
                                                                                                                false,
                                                                                                                false,
                                                                                                                true
                                                                                                            );

                                                                                                    if (folderMember) {
                                                                                                        folderMembers
                                                                                                            .getProxy()
                                                                                                            .setExtraParams(
                                                                                                                {
                                                                                                                    folder_id:
                                                                                                                        folder.get(
                                                                                                                            'id'
                                                                                                                        ),
                                                                                                                }
                                                                                                            );
                                                                                                        folderMembers.remove(
                                                                                                            folderMember
                                                                                                        );
                                                                                                        folderMembers.sync();
                                                                                                    }
                                                                                                }
                                                                                            );
                                                                                            me.lookupViewModel()
                                                                                                .get('members')
                                                                                                .remove(member);
                                                                                            me.lookupViewModel()
                                                                                                .get('members')
                                                                                                .sync({
                                                                                                    success:
                                                                                                        function () {
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
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'portCallTopBarReportBtn',
                            iconCls: 'md-icon-outlined md-icon-send',
                            ui: 'success small outlined',
                            slug: 'portcallReport',
                            margin: '0 16 0 0',
                            tooltip: {
                                html: 'Report via email',
                                anchor: true,
                                showDelay: 0,
                                hideDelay: 0,
                                align: 'bc-tc?',
                            },
                            text: 'Report',
                            hidden: true,
                            cls: 'chameleon_portcall_report_button',
                            bind: {
                                hidden: '{nonEditable}',
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let portCallVM = Ext.ComponentQuery.query(
                                        window.CurrentUser.get('company').type + 'portcall\\.main'
                                    )[0].lookupViewModel(),
                                    companyVerified = this.lookupViewModel().get('currentCompany').get('verified');
                                mixpanel.track('Report button (main header)');
                                var mailPopup = Ext.create('Abraxa.view.mail.Sendmail', {
                                    viewModel: {
                                        parent: portCallVM,
                                        data: {
                                            portCallRecord: me.lookupViewModel().get('portCallRecord'),
                                            object_id: 3,
                                            object_meta_id: me.lookupViewModel().get('portCallRecord').get('id'),
                                            currentUser: me.lookupViewModel().get('currentUser'),
                                            signature: me.lookupViewModel().get('currentUser').get('signature')
                                                ? me.lookupViewModel().get('currentUser.signature.signature')
                                                : '',
                                            members: me.lookupViewModel().get('portCallRecord.members'),
                                            companyVerified: companyVerified,
                                        },
                                        stores: {
                                            attachments: Ext.create('Ext.data.Store', {
                                                proxy: {
                                                    type: 'memory',
                                                },
                                            }),
                                            mailTemplates: {
                                                type: 'mail.templates',
                                                autoLoad: true,
                                                proxy: {
                                                    extraParams: {
                                                        object_id: 3,
                                                        object_meta_id: me
                                                            .lookupViewModel()
                                                            .get('portCallRecord')
                                                            .get('id'),
                                                    },
                                                },
                                                updateProxy: function (proxy) {
                                                    if (proxy) {
                                                        proxy.onAfter('extraparamschanged', this.load, this);
                                                    }
                                                },
                                            },
                                            mailSnippets: {
                                                type: 'mail.snippets',
                                                autoLoad: true,
                                                groupField: 'type',
                                                proxy: {
                                                    extraParams: {
                                                        object_meta_id: me
                                                            .lookupViewModel()
                                                            .get('portCallRecord')
                                                            .get('id'),
                                                    },
                                                },
                                                updateProxy: function (proxy) {
                                                    if (proxy) {
                                                        proxy.onAfter('extraparamschanged', this.load, this);
                                                    }
                                                },
                                            },
                                            documentsForAmail: {
                                                source: '{portCallRecord.documents}',
                                            },
                                        },
                                        formulas: {
                                            emailSettings: {
                                                bind: {
                                                    bindTo: '{currentUser}',
                                                    deep: true,
                                                },
                                                get: function (user) {
                                                    let emails = [];
                                                    if (user) {
                                                        if (user.get('current_office_id')) {
                                                            let officeEmails = user.getOffice().emails();
                                                            Ext.Array.each(
                                                                officeEmails.getData().items,
                                                                function (email) {
                                                                    let emailModel = email.get('email');
                                                                    emailModel.is_default = email.get('is_default');
                                                                    emails.push(emailModel);
                                                                }
                                                            );
                                                        } else {
                                                            let company = this.get('currentCompany');
                                                            let officeEmails = company.get('email_settings');
                                                            Ext.Array.each(officeEmails, function (email) {
                                                                emails.push(email);
                                                            });
                                                        }
                                                    }
                                                    return emails;
                                                },
                                            },
                                        },
                                    },
                                }).show();
                            },
                        },
                        {
                            xtype: 'button',
                            testId: 'portCallTopBarShareBtn',
                            iconCls: 'md-icon-outlined md-icon-share',
                            ui: 'small outlined gradient',
                            margin: '0 16 0 0',
                            hidden: true,
                            cls: 'chameleon_portcall_invite_button a-main-share',
                            tooltip: {
                                html: 'Instantly share data with your clients',
                                anchor: true,
                                showDelay: 0,
                                hideDelay: 0,
                                align: 'bc-tc?',
                            },
                            slug: 'portcallShare',
                            skipEditPermission: true,
                            bind: {
                                hidden: '{nonEditable}',
                                permission: '{userPermissions}',
                                text: 'Share {portCallRecord.members.count > 1 ? "<em>" + (portCallRecord.members.count -1) + "</em>" : "&nbsp;"}',
                            },
                            handler: function () {
                                let record = this.lookupViewModel().get('portCallRecord'),
                                    companyVerified = this.lookupViewModel().get('currentCompany').get('verified'),
                                    portCallVM = Ext.ComponentQuery.query(
                                        window.CurrentUser.get('company').type + 'portcall\\.main'
                                    )[0].lookupViewModel();
                                mixpanel.track('Share button (main header)');
                                Ext.create('Abraxa.view.invitations.InviteDialog', {
                                    viewModel: {
                                        parent: portCallVM,
                                        data: {
                                            object_id: 3,
                                            object_meta_id: record.get('id'),
                                            portCallRecord: record,
                                            newMembersCount: 0,
                                            invite_mode: false,
                                            companyVerified: companyVerified,
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
                                                                            let member =
                                                                                this.lookupViewModel().get('record');
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
                                                                                let member = me
                                                                                    .lookupViewModel()
                                                                                    .get('record');
                                                                                Ext.Msg.confirm(
                                                                                    'Delete',
                                                                                    'Are you sure you want to remove the selected member?',
                                                                                    function (btn) {
                                                                                        if (btn === 'yes') {
                                                                                            me.lookupViewModel()
                                                                                                .get('members')
                                                                                                .remove(member);
                                                                                            me.lookupViewModel()
                                                                                                .get('members')
                                                                                                .sync({
                                                                                                    success:
                                                                                                        function () {
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
                                //     Ext.Msg.warning('Company verification', 'Your company is not verified');
                                // }
                                mixpanel.track('Invite button clicked');
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
