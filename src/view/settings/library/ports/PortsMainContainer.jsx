import './PortsServedGrid';

Ext.define('Abraxa.view.settings.library.PortsMainContaianer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.ports.main',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 0 ? false: true}',
    },
    items: [
        {
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    flex: 1,

                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'container',
                                    flex: 1,
                                    items: [
                                        {
                                            xtype: 'div',
                                            html: '<h1 class="fw-n">Ports served</h1>',
                                        },
                                        {
                                            xtype: 'div',
                                            html: '<p class="text-info">Set up  your main ports of operations.<br>These preferences will allow you to quickly create port calls for below mentioned ports.</p>',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'button',
                                            ui: 'normal-light small',
                                            iconCls: 'md-icon-add',
                                            text: 'Suggest new entry',
                                            testId: 'settingsLibrarySuggestNewPortBtn',
                                            handler: function (me) {
                                                const childSettingsMainVM = me.upVM(),
                                                    currentUser = childSettingsMainVM.get('currentUser');

                                                childSettingsMainVM.set(
                                                    'addEditPortTitle',
                                                    AbraxaConstants.titles.addPort
                                                );

                                                Ext.create(
                                                    'Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortDialog',
                                                    {
                                                        viewModel: {
                                                            parent: childSettingsMainVM,
                                                            data: {
                                                                currentUser: currentUser,
                                                                record: Ext.create('Abraxa.model.suggestions.Port', {}),
                                                            },
                                                        },
                                                    }
                                                ).show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            margin: '16 0 0 0',
                            html: '<hr>',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'settings.library.portsserved.grid',
            flex: 1,
            showNoPermissions: true,
            slug: 'settingsLibraryPortServed',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
