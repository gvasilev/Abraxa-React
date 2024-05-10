Ext.define('Abraxa.view.settings.company.Security', {
    extend: 'Ext.Container',
    xtype: 'SettingsCompanySecurity',
    testId: 'settingsCompSecurity',
    scrollable: true,
    cls: 'a-settings-main w-50',
    hidden: true,
    bind: {
        hidden: '{mainCompanyTabbar.activeTabIndex == 4  ? false: true}',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Security</h1>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">These system preferences will be applied globally for your <br> organization.</p>',
                },
                {
                    xtype: 'div',
                    padding: '16 0 0 0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    // bind: {
                    //     hidden: '{currentUserType == "principal" ? true : false}',
                    // },
                    items: [
                        {
                            xtype: 'div',
                            margin: '0 0 16 0',
                            bind: {
                                html: '<div class="hbox"><div class="h3">Multi-factor Authentication</div>{(currentUserPlan == "starter" && currentUserType !="principal") ? "<div class=\\"a-premium-link\\" style=\\"margin-left: 12px; margin-top: 14px;\\"><i class=\\"far fa-gem\\"></i>Premium feature</div>":""}</div><div class="text-info">Multi-factor Authentication works by requiring additional factors during the login process to prevent unauthorized access.</div>',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    delegate: 'div',
                                    fn: function (el) {
                                        let currentUserPlan = this.component.upVM().get('currentUserPlan');
                                        if (currentUserPlan == 'starter') {
                                            Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'togglefield',
                            testId: 'settingsMFAToggleField',
                            right: 0,
                            top: 4,
                            publishes: ['value'],
                            bind: {
                                value: '{currentCompany.use_mfa}',
                                disabled:
                                    '{currentUserPlan == "starter" && currentUserType !="principal" ? true : false}',
                            },
                            listeners: {
                                change: function (el, value) {
                                    let record = this.upVM().get('currentCompany');
                                    if (record.get('use_mfa') != value) {
                                        Ext.create('Ext.MessageBox', {
                                            ui: 'confirm',
                                            title: 'Confirm',
                                            message:
                                                'Are you sure you want to ' +
                                                (value ? 'enable' : 'disable') +
                                                ' <b>Multi-factor Authentication</b>?<br><div class="a-info-box a-warning-box mt-16"><i class="material-icons-outlined">report_problem</i><div class="a-info-text">This will affect all users in your organization.</div></div>',
                                            dataTitle: 'Warning',
                                            closable: false,
                                            bbar: {
                                                items: [
                                                    '->',
                                                    {
                                                        xtype: 'button',
                                                        text: 'Cancel',
                                                        ui: 'default',
                                                        margin: '0 8 0 0',
                                                        handler: function (me) {
                                                            record.reject();
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        text: 'Continue',
                                                        enableToggle: true,
                                                        ui: 'action loading',
                                                        handler: function (btn) {
                                                            record.set('use_mfa', value);
                                                            btn.setText('Saving...');
                                                            btn.setDisabled(true);
                                                            if (record.dirty) {
                                                                record.save({
                                                                    success: function () {
                                                                        btn.up('dialog').destroy();
                                                                        Ext.toast('Settings updated', 2000);
                                                                    },
                                                                });
                                                            }
                                                        },
                                                    },
                                                ],
                                            },
                                        }).show();
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    },
});
