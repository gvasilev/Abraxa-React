Ext.define('Abraxa.view.error.404', {
    extend: 'Ext.Container',
    xtype: 'notfound',
    cls: 'a-main-container',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            flex: 1,
            cls: 'travolta-container bear-container',
        },
    ],
    // items: {
    //     centered: true,
    //     width: '100%',
    //     html: '<div class="travolta"><h1>404</h1><p>It seems you got lost...</p><a href="#dashboard">Go back</a></div>'
    // }
});
