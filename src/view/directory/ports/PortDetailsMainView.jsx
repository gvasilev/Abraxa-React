import './PortInfoRightCard';
import './PortDetailsViewModel';

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
                                        html: '{getPortTitleBar}',
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
                                        html: '{getPortCountryBar}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '{getPortLocodeBar}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-header-info-item',
                                    bind: {
                                        html: '{getPortTimezoneBar}',
                                    },
                                },
                                // TODO: CORE-3125: Add port calls count per port
                                // {
                                //     xtype: 'div',
                                //     cls: 'a-header-info-item',
                                //     bind: {
                                //         html: '<div class="a-header-info-title sm-title">Port calls</div><div class="a-header-info-value">0</div>',
                                //     },
                                // },
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
                                html: '<span class="text-info">Port last updated:</span> {portInfoUpdated ? (portInfoUpdated:date("d M y")) :"---"}',
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
