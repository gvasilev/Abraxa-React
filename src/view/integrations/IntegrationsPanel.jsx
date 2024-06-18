Ext.define('Abraxa.view.integrations.IntegrationsPanel', {
    extend: 'Ext.Sheet',
    xtype: 'integrations.panel',
    cls: 'a-notification-center a-bgr-white',
    bodyCls: 'a-bgr-white',
    width: 620,
    side: 'right',
    displayed: false,
    hideOnMaskTap: true,
    flex: 1,
    scrollable: 'y',
    header: false,
    collapsible: false,
    weighted: true,
    modal: false,
    hideMode: 'offsets',
    margin: '73 0 0 0',
    toggle: function () {
        if (this.isVisible()) {
            // Ext.query('[class=x-mask]')[0].classList.remove('no-opacity');
            this.hide();
        } else {
            this.show();
            // Ext.query('[class=x-mask]')[0].classList.add('no-opacity');
        }
    },
    showAnimation: {
        type: 'slide',
        direction: 'bottom',
    },
    hideAnimation: {
        type: 'slideOut',
        direction: 'right',
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: {
        stores: {
            integrations: {
                type: 'object-integrations',
                remoteFilter: true,
                autoLoad: false,
                proxy: {
                    extraParams: {
                        object_meta_id: '{object_record.id}',
                    },
                },
                listeners: {
                    beforeload: function (store, eOpts) {
                        // You may want to get panel reference dynamically
                        Ext.ComponentQuery.query('integration\\.data\\.container')[0].mask();
                    },
                    load: function (store, eOpts) {
                        // You may want to get panel reference dynamically
                        Ext.ComponentQuery.query('integration\\.data\\.container')[0].unmask();
                    },
                },
            },
        },
        formulas: {
            // integrations: {
            //     bind: {
            //         bindTo: '{object_record.integrations}',
            //     },
            //     get: function (integrations) {
            //         return integrations;
            //     },
            // },
            integrationFilter: {
                bind: {
                    bindTo: '{integrationList.selection}',
                },
                get: function (selection) {
                    if (selection) {
                        let integrationsStore = this.get('integrations');
                        integrationsStore.filter({
                            property: 'operator',
                            value: selection.get('integration').name,
                        });
                        integrationsStore.load();
                    }
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            height: 64,
            docked: 'top',
            weight: 1,
            items: [
                {
                    xtype: 'title',
                    bind: {
                        title: "<div class='hbox'><div class='a-badge a-badge-notes'><i class='md-icon md-icon-outlined'>electrical_services</i></div><div><span class='a-panel-title text-truncate' style='width: 260px;'>Connected apps</span></div></div>",
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round',
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            handler: function (me) {
                                me.up('[xtype=integrations\\.panel]').hide();
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: '<span class="tooltip_expand">Close <em>esc</em></span>',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'list',
            reference: 'integrationList',
            cls: 'integrations_list',
            bind: {
                data: '{currentUser.company.integrations}',
            },
            itemConfig: {
                viewModel: true,
                padding: '8 8',
                bind: {
                    html:
                        '<div class="hbox"><div class="a-obj-logo mr-16" style="width:42px; height:42px; border-radius:8px;"><img src="{record.integration.logo}" width="42px" style="border-radius:8px;"></div>' +
                        '<div class="a-info"><div class="h3 m-0">{record.integration.name}</div><div class="sm-title">{record.integration.category}</div></div></div>',
                },
            },
            listeners: {
                childtap: function (me, location, eOpts) {
                    me.up('sheet').down('panel').show();
                },
            },
        },
        {
            xtype: 'integration.data.container',
            hidden: true,
            width: '100%',
            hideMode: 'offsets',
            docked: 'right',
            weight: 0,
        },
    ],
});
