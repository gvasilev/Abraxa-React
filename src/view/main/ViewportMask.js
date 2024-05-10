Ext.define('Abraxa.ViewportMask', {
    extend: 'Ext.Container',
    xtype: 'viewport.mask',
    cls: 'a-placeholder-mask abraxa-viewport',
    bodyCls: 'a-main-container-wrap',
    layout: 'fit',
    flex: 1,
    zIndex: 12,
    items: [
        {
            xtype: 'container',
            padding: '15 16 15 72',
            height: 73,
            cls: 'a-bgr-white a-main-header',
            docked: 'top',
            flex: 1,
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
                            html: '<div class="hbox"><div class="a-placeholder-tab mr-8"></div><div class="a-placeholder-tab mr-8"></div><div class="a-placeholder-tab mr-8"></div></div>',
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            cls: 'a-main-container',
            bodyCls: 'overflow-visible',
            items: [
                {
                    xtype: 'container',
                    padding: 16,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-placeholder-circle',
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'div',
                                            width: 240,
                                            cls: 'a-placeholder-row',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            flex: 1,
                        },
                    ],
                },
            ],
        },
    ],
});
