Ext.define('Abraxa.view.main.MainHeaderPlaceHolder', {
    extend: 'Ext.Container',
    xtype: 'main.header.placeholder',
    zIndex: 12,
    layout: 'hbox',
    padding: 0,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-placeholder-badge',
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    width: 300,
                                    margin: '0 0 8 0',
                                    cls: 'a-placeholder-rect',
                                },
                                {
                                    xtype: 'div',
                                    html: '<div class="hbox"><div class="a-placeholder-tab"></div><div class="a-placeholder-tab"></div><div class="a-placeholder-tab"></div></div>',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
