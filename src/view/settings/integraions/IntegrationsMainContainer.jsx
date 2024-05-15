Ext.define('Abraxa.view.settings.integrations.IntegrationsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.integrations.main.container',
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
                                    html: '<h1 class="fw-n">Integrations center</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Explore integrations that help your business do more with Abraxa.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '0 -16',
                            scrollable: true,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'abraxa.formlist',
                                    flex: 1,
                                    inline: true,
                                    layout: {
                                        type: 'hbox',
                                        wrap: true,
                                    },
                                    bind: {
                                        store: '{integrations}',
                                    },
                                    itemConfig: {
                                        viewModel: {},
                                        xtype: 'container',
                                        margin: 16,
                                        cls: 'bordered border-radius',
                                        width: 'calc(50% - 32px)',
                                        height: 220,
                                        items: [
                                            {
                                                xtype: 'container',
                                                padding: 16,
                                                items: [
                                                    {
                                                        xtype: 'div',
                                                        cls: 'hbox',
                                                        bind: {
                                                            html:
                                                                '<div class="a-obj-logo x-shadow mr-16" style="width:52px; height:52px; border-radius:12px;"><img src="{record.logo}" width="52px" style="border-radius:12px;"></div>' +
                                                                '<div class="a-info"><div class="h3 m-0">{record.name}</div><div class="sm-title">{record.category}</div></div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        margin: '22 0 0 0',
                                                        cls: 'text-info',
                                                        bind: {
                                                            html: '{record.info}',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        flex: 1,
                                                        cls: 'text-info',
                                                        margin: '6 0 0 0',
                                                        bind: {
                                                            html: '<a href="{record.website}" class="c-link"><strong>Learn more</strong></a>',
                                                        },
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'toolbar',
                                                docked: 'bottom',
                                                flex: 1,
                                                padding: 16,
                                                layout: {
                                                    type: 'hbox',
                                                    pack: 'end',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'default outlined small',
                                                        bind: {
                                                            hidden: '{record.company_integration || !record.available ? true : false}',
                                                        },
                                                        text: 'Contact us',
                                                        handler: function () {
                                                            window.open('https://www.abraxa.com/contact-us/');
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'tool-text-sm',
                                                        iconCls: 'md-icon-outlined md-icon-settings',
                                                        bind: {
                                                            hidden: '{record.company_integration && record.available ? false : true}',
                                                        },
                                                        text: 'Settings',
                                                    },
                                                    {
                                                        xtype: 'div',
                                                        html: 'Coming soon',
                                                        style: 'color: #6b7c93; font-weight: 500; font-size: 14px;',
                                                        bind: {
                                                            hidden: '{record.available ? true : false}',
                                                        },
                                                        disabled: true,
                                                    },
                                                ],
                                            },
                                            {
                                                xtype: 'div',
                                                top: 24,
                                                right: 24,
                                                bind: {
                                                    hidden: '{record.company_integration ? false : true}',
                                                },
                                                html: '<i class="material-icons" style="font-size: 32px; color:#009688;">check</i>',
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
