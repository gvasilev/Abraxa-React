import './UserMenu.js';

Ext.define('Abraxa.view.main.MainHeader', {
    extend: 'Ext.Container',
    xtype: 'main.header',
    itemId: 'mainHeader',
    reference: 'header',
    testId: 'mainTopBar',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    padding: 0,
    docked: 'top',
    bind: {
        cls: 'a-main-wrap  {routeHash == "#portcall" ? "a-main-has-tools" : ""}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-main-header',
            flex: 1,
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-main-object',
                            hidden: false,
                            bind: {
                                html: '<div class="a-obj-logo a-logo-lg {headerIcon.cls} a-shadow"><i class="{headerIcon.icon}"></i></div>',
                            },
                        },
                        {
                            xtype: 'container',
                            layout: 'vbox',
                            cls: 'a-main-heading',
                            flex: 1,
                            bind: {
                                items: '{object_header}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'user.header.menu',
                    cls: 'a-user-header-menu',
                },
            ],
        },
    ],
});
