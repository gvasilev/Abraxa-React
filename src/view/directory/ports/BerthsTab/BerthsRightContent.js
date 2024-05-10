Ext.define('Abraxa.view.directory.ports.BerthsTab.BerthsRightContent', {
    extend: 'Ext.Container',
    xtype: 'BerthsRightContent',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch', //this is needed to stretch grid in last section berths
    },
    items: [
        {
            //General section
            xtype: 'BerthsGeneral',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Coordinates section
            xtype: 'BerthsCoordinates',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Restriction section
            xtype: 'BerthsRestrictions',
            ripple: true,
            cls: 'a-directory-section',
        },
    ],
});
