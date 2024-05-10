Ext.define('Abraxa.view.directory.ports.PortDetailsMainView', {
    extend: 'Ext.Container',
    xtype: 'PortDetailsMainView',
    cls: 'a-directory-main-container',
    viewModel: 'PortDetailsViewModel',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-directory-inner-container a-port-details-container',
            layout: 'vbox',
            flex: 1,
            items: [
                // Port details header
                {
                    xtype: 'container',
                    cls: 'a-port-details-header',
                    docked: 'top',
                    flex: 1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-header-title-bar',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'tool',
                                    iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                                    ui: 'tool-lg',
                                    handler: function () {
                                        window.history.back();
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-header-title">{object_record.name}, {object_record.flag_abv_2_letters}</div><span class="a-status-badge a-status-md bg-light-blue">Port</span>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-header-info-bar',
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Country</div><div class="a-header-info-value">{object_record.country ? object_record.country:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Locode</div><div class="a-header-info-value">{object_record.locode ? object_record.locode:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Timezone</div><div class="a-header-info-value">{object_record.timezone ? object_record.timezone:"<span class=\'a-placeholder\'>---</span>"}</div>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '<div class="a-header-info-title sm-title">Port calls</div><div class="a-header-info-value">0</div>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'tabbar',
                            cls: 'a-header-tab-bar',
                            animateIndicator: false,
                            activeTab: 0,
                            centered: false,
                            defaults: {
                                ui: 'tab-lg',
                                ripple: false,
                            },
                            reference: 'portInfoTabbar',
                            publishes: {
                                activeTabIndex: true,
                            },
                            layout: {
                                type: 'hbox',
                                pack: 'start',
                            },
                            items: [
                                {
                                    text: 'Port info',
                                    hash: 'port',
                                },
                                {
                                    text: 'Terminals',
                                    hash: 'terminals',
                                },
                                {
                                    text: 'Berths',
                                    hash: 'berths',
                                },
                                {
                                    text: 'Holidays',
                                    hash: 'holidays',
                                },
                                {
                                    text: 'Agents',
                                    hash: 'agents',
                                },
                            ],
                            listeners: {
                                activeTabchange: function (tabbar, newTab) {
                                    if (newTab.hash === 'port') {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo('port-info/' + tabbar.upVM().get('object_record.id'));
                                    } else {
                                        Ext.getCmp('main-viewport')
                                            .getController()
                                            .redirectTo(
                                                'port-info/' + tabbar.upVM().get('object_record.id') + '/' + newTab.hash
                                            );
                                    }
                                },
                            },
                        },
                    ],
                },
                // Port details body
                {
                    xtype: 'container',
                    cls: 'a-port-details-body',
                    flex: 1,
                    layout: 'vbox',
                    scrollable: true,
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-directory-inner-wrapper',
                            layout: 'vbox',
                            bind: {
                                items: '{activeItemPerTab}',
                                flex: '{portInfoTabbar.activeTabIndex === 0 ? null:1}',
                            },
                        },
                    ],
                },
                // Port details footer
                {
                    xtype: 'container',
                    cls: 'a-port-details-footer',
                    docked: 'bottom',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            bind: {
                                html: '<span class="text-info">Last port updated:</span> {portInfoUpdated ? (portInfoUpdated:date("d M y")) :"---"}',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'PortInfoRightCard',
        },
    ],
    listeners: {
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'principal') {
                Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
