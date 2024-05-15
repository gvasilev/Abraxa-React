import './OfficesGrid.jsx';
Ext.define('Abraxa.view.settings.offices.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.offices.main.container',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Office settings</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Set up and administrate your organizational offices and their corresponding details.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'button',
                                    testId: 'createOfficeButtonTestIdSettings',
                                    text: 'Office',
                                    ui: 'action small',
                                    iconCls: 'md-icon-add',
                                    slug: 'settingsOffice',
                                    bind: {
                                        permission: '{userPermissions}',
                                        hidden: '{offices.count ? false : true}',
                                    },
                                    handler: function (btn, e) {
                                        mixpanel.track('Office - button');
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
                        {
                            xtype: 'settings.offices.grid',
                            showNoPermissions: true,
                            slug: 'settingsOffice',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
