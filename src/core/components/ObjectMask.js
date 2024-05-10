Ext.define('Abraxa.ObjectMask', {
    extend: 'Ext.Container',
    xtype: 'object.mask',
    cls: 'a-placeholder-mask abraxa-viewport',
    // bodyCls: 'a-main-container-wrap',
    // margin: 0,
    layout: 'fit',
    flex: 1,
    zIndex: 12,
    items: [
        {
            xtype: 'container',
            padding: '16',
            height: 68,
            cls: 'a-bgr-white a-bb-100',
            docked: 'top',
            flex: 1,
            layout: {
                type: 'hbox',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-placeholder-circle',
                    height: 34,
                    width: 34,
                    margin: '0 12',
                },
                {
                    xtype: 'div',
                    cls: 'a-placeholder-badge',
                    margin: '0 12 0 0',
                    height: 34,
                    width: 34,
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'div',
                            width: 300,
                            margin: '0 0 8 0',
                            cls: 'a-placeholder-rect',
                            height: 14,
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
            cls: 'a-bgr-white',
            layout: 'fit',
            bodyCls: 'overflow-visible',
            padding: '0 8',
            masked: {
                xtype: 'loadmask',
            },
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
