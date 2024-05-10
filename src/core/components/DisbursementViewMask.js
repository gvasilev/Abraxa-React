Ext.define('Abraxa.DisbursementViewMask', {
    extend: 'Ext.Container',
    xtype: 'DisbursementViewMask',
    cls: 'a-placeholder-mask',
    // bodyCls: 'a-bgr-50',
    style: 'background-color: #f1f5fd;',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    flex: 1,
    items: [
        {
            xtype: 'container',
            margin: 11,
            padding: 0,
            // cls: 'a-bgr-white a-bb-100',
            // docked: 'top',
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
            cls: 'a-bgr-white border-radius',
            shadow: true,
            margin: '16 16 24',
            flex: 1,
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
