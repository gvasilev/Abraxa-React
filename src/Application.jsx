/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */

Ext.define('Abraxa.Application', {
    extend: 'Ext.app.Application',

    name: 'Abraxa',
    appProperty: 'Abraxa',

    requires: [
        'Ext.direct.*',
        'Ext.data.proxy.Direct',
        'Ext.panel.Collapser',
        'Ext.grid.plugin.Exporter',
        'Ext.grid.plugin.Summary',
        'Ext.grid.rowedit.Plugin',
        'Ext.field.InputMask',
        'Ext.chart.*',
        'Ext.calendar.*',
        'Ext.field.Toggle',
        'Ext.field.Hidden',
        'Ext.field.Spinner',
        'Ext.field.trigger.Menu',
        'Ext.grid.plugin.CellEditing',
        'Ext.grid.plugin.RowExpander',
        'Ext.grid.plugin.GroupingPanel',
        'Ext.grid.plugin.Summaries',
        'Ext.Toast',
        'Ext.data.validator.*',
        'Ext.dataview.plugin.ListPaging',
        'Ext.grid.filters.*',
        'Ext.grid.Tree',
        'Ext.grid.plugin.ViewOptions',
        'Ext.froala.*',
        'Ext.Stateful',
        'Ext.state.*',
        'Ext.grid.plugin.RowDragDrop',
        'Ext.layout.overflow.Scroller',
        'Ext.carousel.*',
        'Abraxa.*',
        'Ext.panel.Accordion',
        'Ext.Video',
        'Ext.grid.plugin.filterbar.FilterBar',
        'Ext.grid.plugin.PagingToolbar',
        'Ext.data.TreeStore',
        'Ext.grid.plugin.TreeDragDrop',
        'Ext.grid.plugin.PagingToolbar',
        'Ext.data.identifier.Uuid',
        'Ext.tab.Panel',
    ],

    stores: [
        'View', // creates one global instance of the Menu store (Ext.getStore('Menu'))
    ],

    viewport: {
        controller: 'viewport',
        viewModel: 'viewport',
    },

    defaultToken: 'dashboard',

    launch: function (profile) {
        let me = this;
        moment.suppressDeprecationWarnings = true;
        document.getElementById('preloader').remove();

        Ext.FusionCharts.options.license({
            key: 'osC4C-9bhC2C5A5A5E6C4F5E3B3H2A2B2lF-11wE1G4xI-7lrgA3B4vbsH3B5D7C2B1F1F1B4E4H4B1C8A6C2A1E2juwB3B7D1F-11D1D3G4rqb1B9D2C6njyD3H4A9bzfE3D4A2I4E1A9B3D7E2B2G2yqsC2B2ZC7egvH4I3B8oD-13B5QD5D3jteD5B5B2E5B4E4D3H2C8B6E4E4D4D1B-8==',
            creditLabel: false,
        });

        function handleNetworkChange(event) {
            if (navigator.onLine) {
                const networkToolExist = Ext.getCmp('handleNetworkChange');
                if (networkToolExist && networkToolExist.hide) {
                    networkToolExist.hide();
                }
            } else {
                let networkToolExist = Ext.getCmp('handleNetworkChange');
                if (networkToolExist && networkToolExist.show) {
                    networkToolExist.show();
                } else {
                    Ext.create('Ext.Sheet', {
                        modal: false,
                        height: 40,
                        maxWidth: 486,
                        left: 0,
                        right: 0,
                        top: 12,
                        id: 'handleNetworkChange',
                        cls: 'a-sheet a-sheet-warning handleNetworkChange',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-sheet-message',
                                html: '<i class="material-icons-outlined">wifi_off</i>It seems that you are no longer connected to the Internet.',
                            },
                            {
                                xtype: 'div',
                                html: '<div class="three-dots-container"><span class="three-dots"><span class="middle-dot"></span></span></div>',
                            },
                        ],
                        showAnimation: {
                            type: 'slide',
                            direction: 'bottom',
                        },
                        hideAnimation: 'fade',
                    }).show();
                }
            }
        }

        window.addEventListener('online', handleNetworkChange);
        window.addEventListener('offline', handleNetworkChange);

        Ext.Ajax.on(
            'beforerequest',
            function (conn, options, eOptions) {
                let routeHash = Ext.Viewport.getViewModel().get('routeHash'),
                    object_id = null;
                if (routeHash == '#portcall') {
                    object_id = 3;
                } else if (routeHash == '#inquiry') {
                    object_id = 6;
                } else if (routeHash == '#company') {
                    object_id = 2;
                }
                conn.setDefaultHeaders({
                    'Object-Id': object_id,
                    'Object-Meta-Id': Ext.getCmp('main-viewport')
                        ? Ext.getCmp('main-viewport').getViewModel().get('object_meta_id')
                        : null,
                });
            },
            this
        );
        Ext.Viewport.getController().onLaunch();
        // this.callParent([profile]);
    },

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true,
        },
    },

    logout: function () {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'logout',
            method: 'POST',
            success: function (response, opts) {
                auth0Logout();
            },
        });
    },

    onAppUpdate: function () {
        let currentUser = Ext.Viewport.getViewModel().get('currentUser');

        Ext.Viewport.getViewModel().set('appHasUpdate', true);

        if (currentUser.get('current_company_id')) {
            Ext.Msg.show({
                width: 440,
                closable: false,
                title: false,
                cls: 'text-center',
                buttonToolbar: {
                    hidden: true,
                },
                items: [
                    {
                        xtype: 'div',
                        html:
                            "<div class='my-16'><img src='https://static.abraxa.com/images/logo.svg' alt='Abraxa' height='16' /></div>" +
                            "<div class='display-1 my-24'>Updates available</div>" +
                            "<div class='my-24'><img src='https://static.abraxa.com/images/img-hooray.png' alt='Abraxa' /></div>" +
                            "<div class='display-3 mt-24 text-left'><div class='pl-24'><span class='mb-16'>In a constant effort to improve your experience we have made a <b>new update</b> available.</span></div></div>",
                    },
                    {
                        xtype: 'container',
                        margin: '16 0 0 0',
                        layout: {
                            type: 'hbox',
                            pack: 'center',
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Update',
                                cls: 'a-no-content-btn',
                                iconCls: 'md-icon-refresh',
                                ui: 'action round',
                                handler: function (button) {
                                    Ext.Viewport.getViewModel().set('appHasUpdate', false);
                                    window.location.reload();
                                },
                            },
                        ],
                    },
                ],
            });
        }
    },
});
