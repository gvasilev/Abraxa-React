Ext.define('Abraxa.view.design.DesignMainContainer', {
    extend: 'Ext.Container',
    xtype: 'design',
    cls: 'a-main-container',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            scrollable: true,
            flex: 1,
            items: [
                {
                    xtype: 'design.buttons',
                },
                {
                    xtype: 'design.fields',
                },
            ],
        },
    ],
});
