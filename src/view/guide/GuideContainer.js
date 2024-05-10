Ext.define('Abraxa.view.guide.GuideContainer', {
    extend: 'Ext.Container',
    xtype: 'guide.container',
    items: [
        {
            xtype: 'container',
            html: 'Hello Jordan',
        },
        {
            xtype: 'panel',
            html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/_FTujXYXLTo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        },
        // {
        //     xtype: 'video',
        //     minHeight: 185,
        //     maxHeight: 185,
        // url      : 'porsche911.mov',
        // }
    ],
});
