Ext.define('Abraxa.view.settings.company.CompanyMain', {
    extend: 'Ext.Container',
    xtype: 'settings.company.main',
    testId: 'settingsCompanyMain',
    controller: 'company.controller',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    plugins: {
        lazyitems: {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-bb-100',
                    weight: 1,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            items: [
                                {
                                    xtype: 'tabbar',
                                    testId: 'settingsCompanyMainTabbar',
                                    height: 64,
                                    padding: '0 8',
                                    animateIndicator: false,
                                    activeTab: 0,
                                    defaults: {
                                        ui: 'tab-lg',
                                        ripple: false,
                                    },
                                    reference: 'mainCompanyTabbar',
                                    publishes: {
                                        activeTab: true,
                                        activeTabIndex: true,
                                    },
                                    items: [
                                        {
                                            text: 'Company profile',
                                            testId: 'settingsCompanyMainCompProfileTab',
                                            type: 'company.profile',
                                        },
                                        {
                                            text: 'System settings',
                                            testId: 'settingsCompanyMainSystemSettingsTab',
                                            type: 'system.settings',
                                        },
                                        {
                                            text: 'Automations',
                                            testId: 'settingsCompanyMainAutomationsTab',
                                            type: 'automations',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'E-mail settings',
                                            testId: 'settingsCompanyEmailTab',
                                            type: 'email.settings',
                                        },
                                        {
                                            text: 'Security',
                                            testId: 'settingsCompanySecurityTab',
                                            type: 'SetingsCompanySecurity',
                                        },

                                        // {
                                        //     text: 'File numbering',
                                        //     type: 'file.numbering'
                                        // }
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'settings.company.profile',
                },
                {
                    xtype: 'settings.company.systems.settings',
                },
                {
                    xtype: 'settings.company.automations',
                },
                {
                    xtype: 'settings.company.systems.email.settings',
                },
                {
                    xtype: 'SettingsCompanySecurity',
                },

                // {
                // xtype: 'settings.company.systems.file.numbering'
                // }
            ],
        },
    },
});
