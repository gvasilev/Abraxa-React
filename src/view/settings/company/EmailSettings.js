Ext.define('Abraxa.view.settings.company.EmailSettings', {
    extend: 'Ext.Container',
    xtype: 'settings.company.systems.email.settings',
    scrollable: true,
    cls: 'a-settings-main',
    hidden: true,
    controller: 'company.controller',
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 3 ? false: true}',
    },
    layout: 'vbox',
    flex: 1,
    items: [
        {
            cls: 'a-container-premium errorHandler',
            maxWidth: 540,
            bind: {
                hidden: '{currentUserPlan == "starter" && currentUserType !="principal" ? false:true}',
            },
            items: [
                {
                    xtype: 'div',
                    padding: '16 48',
                    cls: 'text-center',
                    html: '<div class="h1">Premium feature</div><p class="a-txt">The ultimate all-in-one package for companies that need to handle port calls with confidence.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0 24 -12',
                    cls: 'text-center',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="416" height="248" viewBox="0 0 416 248"><g transform="translate(-533 -328)"><rect width="242" height="158" rx="8" transform="translate(533 328)" fill="#fbe3c9" opacity="0.4"/><rect width="400" height="232" rx="8" transform="translate(549 344)" fill="#fff"/><rect width="64" height="8" rx="4" transform="translate(741 384)" fill="#f3c46b"/><rect width="64" height="8" rx="4" transform="translate(741 528)" fill="#ecf0f1"/><rect width="64" height="8" rx="4" transform="translate(637 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(637 528)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 432)" fill="#b0bec5" opacity="0.24"/><rect width="168" height="8" rx="4" transform="translate(637 480)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 384)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 528)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 432)" fill="#b0bec5" opacity="0.24"/><rect width="64" height="8" rx="4" transform="translate(845 480)" fill="#b0bec5" opacity="0.24"/><g transform="translate(333 85)"><rect width="40" height="40" rx="8" transform="translate(240 283)" fill="#ffb74d"/><g transform="translate(248 291)"><path d="M0,0H24V24H0Z" fill="none"/><path d="M20,6H17.82A2.993,2.993,0,0,0,12.5,3.35l-.5.67-.5-.68A2.994,2.994,0,0,0,6.18,6H4A1.985,1.985,0,0,0,2.01,8L2,19a1.993,1.993,0,0,0,2,2H20a1.993,1.993,0,0,0,2-2V8A1.993,1.993,0,0,0,20,6ZM15,4a1,1,0,1,1-1,1A1,1,0,0,1,15,4ZM9,4A1,1,0,1,1,8,5,1,1,0,0,1,9,4ZM20,19H4V17H20Zm0-5H4V8H9.08L7,10.83,8.62,12,11,8.76,12,7.4l1,1.36L15.38,12,17,10.83,14.92,8H20Z" fill="#fff"/></g></g></g></svg>',
                },
                {
                    xtype: 'button',
                    margin: '16 0',
                    ui: 'premium large',
                    text: 'Upgrade to Premium',
                    handler: function () {
                        window.open('https://www.abraxa.com/pricing/');
                    },
                },
            ],
        },
        {
            xtype: 'container',
            bind: {
                hidden: '{currentUserPlan == "starter" && currentUserType !="principal" ? true:false}',
            },
            cls: 'w-50',
            hidden: true,
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Email settings</h1>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Setting up your email settings allows you to send emails via your own domain (i.e. reporting email).</p>',
                },
                {
                    xtype: 'div',
                    padding: '16 0 0 0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                                pack: 'space-between',
                            },
                            showNoPermissions: true,
                            slug: 'settingsCompanyEmail',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h3 class="m-0">Use custom email settings</h3>',
                                },
                                {
                                    xtype: 'togglefield',
                                    testId: 'smtpSettingsEmailTabTestId',
                                    reference: 'smtpSettings',
                                    publishes: ['value'],
                                    slug: 'settingsCompanyEmail',
                                    bind: {
                                        permission: '{userPermissions}',
                                        value: '{currentCompany.custom_email_server}',
                                    },
                                    listeners: {
                                        change: function (el, value) {
                                            let record = this.upVM().get('currentCompany');
                                            record.set('custom_email_server', value);
                                            record.save({
                                                success: function () {
                                                    Ext.Toast('Settings updated');
                                                },
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1,
                            slug: 'settingsCompanyEmail',
                            bind: {
                                permission: '{userPermissions}',
                                html: '<div class="a-info-box a-warning-box mb-16 {currentCompany.custom_email_server ? "" : "d-none"}"><i class="material-icons-outlined">report_problem</i>Leave this option enabled only if your connection test succeeds, <br>otherwise the system will not be able to send any emails.</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    slug: 'settingsCompanyEmail',
                    bind: {
                        permission: '{userPermissions}',
                        masked: {
                            hidden: '{currentCompany.custom_email_server ? true : false}',
                            // hidden: true,
                            cls: 'border-radius',
                            html: '<div class="c-white"><i class="a-no-pointer-events material-icons-outlined c-white" style="font-size: 58px !important">lock</i></div>',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-bordered-list',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-list-titles',
                                    html: '<div class="flex-3">Email accounts</div></div>',
                                },
                                {
                                    xtype: 'abraxa.formlist',
                                    bind: {
                                        store: '{emailSettings}',
                                    },
                                    itemConfig: {
                                        viewModel: true,
                                        xtype: 'container',
                                        cls: 'a-list-item',
                                        minHeight: 56,
                                        flex: 1,
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'a-list-values',
                                                flex: 1,
                                                bind: {
                                                    html: '<div class="flex-3"><div class="a-badge a-badge-email mr-12"><i class="md-icon-outlined">alternate_email</i></div><span class="fw-b">{record.email}</span>{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</div>',
                                                },
                                            },
                                            {
                                                xtype: 'container',
                                                cls: 'a-actions-hover',
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        iconCls: 'md-icon-outlined md-icon-edit',
                                                        ui: 'round tool-round-md',
                                                        slug: 'settingsCompanyEmail',
                                                        bind: {
                                                            permission: '{userPermissions}',
                                                        },
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            html: 'Edit',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (me) {
                                                            let company = me.upVM().get('currentCompany'),
                                                                disableDefault = false;

                                                            model = me.upVM().get('record');
                                                            model.getProxy().setExtraParams({
                                                                company_id: company.get('id'),
                                                            });
                                                            if (model.get('is_default')) {
                                                                disableDefault = true;
                                                            }
                                                            let dialog = Ext.create(
                                                                'Abraxa.view.settings.company.AddEmail',
                                                                {
                                                                    title: 'Edit email account',
                                                                    viewModel: {
                                                                        parent: me.upVM(),
                                                                        data: {
                                                                            record: model,
                                                                            disableDefault: disableDefault,
                                                                            editMode: true,
                                                                        },
                                                                    },
                                                                }
                                                            );
                                                            dialog.show();
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'round tool-round',
                                                        iconCls: 'md-icon-outlined md-icon-delete',
                                                        slug: 'settingsCompanyEmailDelete',
                                                        bind: {
                                                            permission: '{userPermissions}',
                                                            disabled: '{record.is_default}',
                                                        },
                                                        tooltip: {
                                                            anchorToTarget: true,
                                                            html: 'Delete',
                                                            align: 'bc-tc?',
                                                            showDelay: 0,
                                                            hideDelay: 0,
                                                            dismissDelay: 0,
                                                            allowOver: false,
                                                            closeAction: 'destroy',
                                                        },
                                                        handler: function (me) {
                                                            let store = me.upVM().get('emailSettings'),
                                                                offices = me.upVM().get('companyOffices'),
                                                                record = me.upVM().get('record');
                                                            Ext.Msg.confirm(
                                                                'Delete',
                                                                'Are you sure you would like to delete this entry?<br>All offices emails will be unassigned.',
                                                                function (answer) {
                                                                    if (answer == 'yes') {
                                                                        store.remove(record);
                                                                        store.sync({
                                                                            success: function () {
                                                                                offices.reload();
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
                                                                        ui: 'decline alt',
                                                                        text: 'Yes',
                                                                    },
                                                                ]
                                                            );
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            testId: 'smtpSettingsEmailTabTestIdAddEmailButton',
                            text: 'Add email',
                            ui: 'normal small',
                            margin: '8 0 0 0',
                            height: 28,
                            iconCls: 'md-icon-add',
                            slug: 'settingsCompanyEmailCreate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('currentCompany'),
                                    disableDefault = false,
                                    model = Ext.create('Abraxa.model.settings.company.EmailSettings', {
                                        company_id: record.get('id'),
                                        secure_connection: 'ssl',
                                    });

                                model.getProxy().setExtraParams({
                                    company_id: record.get('id'),
                                });
                                if (me.upVM().get('emailSettings').getCount() === 0) {
                                    model.set('is_default', true);
                                    disableDefault = true;
                                }
                                let dialog = Ext.create('Abraxa.view.settings.company.AddEmail', {
                                    viewModel: {
                                        parent: me.upVM(),
                                        data: {
                                            record: model,
                                            editMode: false,
                                            disableDefault: disableDefault,
                                        },
                                    },
                                });
                                dialog.show();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
