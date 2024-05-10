Ext.define('Abraxa.view.settings.SettingsMenu', {
    extend: 'Ext.Container',
    xtype: 'settings.menu',
    margin: '8 0 0 0',
    items: [
        {
            xtype: 'list',
            cls: 'settings_menu',
            selectable: {
                deselectable: false,
            },
            reference: 'settingsMenu',
            itemConfig: {
                viewModel: {
                    formulas: {
                        selectFirst: function (get) {
                            var store = get('settingsMenuStore');
                            if (store && !this.get('settingsMenu.selection')) {
                                Ext.ComponentQuery.query('[cls~=settings_menu]')[0].select(0);
                            }
                        },
                        routeChangeSelect: {
                            bind: {
                                bindTo: '{routeHash}',
                                deep: true,
                            },
                            get: function (hash) {
                                if (hash == '#settings') {
                                    if (!this.get('settingsMenu.selection')) {
                                        Ext.ComponentQuery.query('[cls~=settings_menu]')[0].select(0);
                                    }
                                }
                            },
                        },
                        testId: function (get) {
                            const name = get('record').get('name');
                            const testIdPrefix = 'settingsMenuTestId';
                            return name ? `${testIdPrefix}${name.replace(/[^\w\s]/gi, '').replace(/\s/g, '')}` : null;
                        },
                    },
                },
                cls: 'a-item',
                xtype: 'container',
                bind: {
                    slug: '{record.slug}',
                    permission: '{userPermissions}',
                    tooltip: {
                        html: '{settingsLeftMenu.userCls ? "" : record.name}',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        allowOver: false,
                        closeAction: 'destroy',
                        // anchorToTarget: false,
                        align: 'bc-tc?',
                        anchor: true,
                    },
                },
                items: [
                    {
                        layout: {
                            type: 'hbox',
                        },
                        bind: {
                            html: '<div class="hbox" data-testid={testId}><i class="md-icon-outlined">{record.icon}</i><span>{record.name}</span></div>',
                            cls: 'a-tab {record.cls}',
                        },
                    },
                ],
            },
            bind: {
                store: '{settingsMenuStore}',
            },

            listeners: {
                childtap: function (cmp, location) {
                    let record = location.record;
                    if (record) {
                        window.history.replaceState({}, '', '#settings/' + record.get('hash'));
                        let containersToHide = Ext.ComponentQuery.query('[cls~=needs_hide]'),
                            containersToShow = Ext.ComponentQuery.query('[cls~=needs_show]');
                        Ext.Array.each(containersToHide, function (value) {
                            if (!value.isHidden()) {
                                // value.hide();
                                value.setHidden(true);
                            }
                        });
                        Ext.Array.each(containersToShow, function (value) {
                            if (value.isHidden()) {
                                value.setHidden(false);
                            }
                        });
                        if (location.record && location.record.get('hash') == 'users') {
                            if (Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0].isHidden()) {
                                Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0].setHidden(false);
                            }
                        }
                        if (location.record && location.record.get('hash') == 'templates') {
                            if (Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0].isHidden()) {
                                Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0].setHidden(false);
                            }
                        }
                        if (location.record && location.record.get('hash') == 'offices') {
                            if (Ext.ComponentQuery.query('[itemId=officesMainContainer]')[0].isHidden()) {
                                Ext.ComponentQuery.query('[itemId=officesMainContainer]')[0].setHidden(false);
                            }
                        }
                        // if (!Ext.ComponentQuery.query('[itemId=userDetalsContainer]')[0].isHidden()) {
                        //     Ext.ComponentQuery.query('[itemId=userDetalsContainer]')[0].hide();
                        // }
                        // if (!Ext.ComponentQuery.query('[itemId=rolesDetalsContainer]')[0].isHidden()) {
                        //     Ext.ComponentQuery.query('[itemId=rolesDetalsContainer]')[0].hide();
                        //     Ext.ComponentQuery.query('[itemId=usersMainContainer]')[0].show();
                        // }
                    }
                },
                painted: function () {
                    const me = this;
                    const section = me.lookupViewModel().get('routeParams');
                    const store = me.getStore();

                    if (!store) return;

                    if (store.isLoaded()) {
                        let record = store.findRecord('hash', section);
                        if (record) {
                            me.select(record);
                        }
                    } else {
                        store.on('load', function (store, records) {
                            Ext.Array.each(records, function (value, index) {
                                if (value.get('hash') == section) {
                                    me.select(value);
                                }
                            });
                        });
                    }
                },
            },
        },
    ],
});
