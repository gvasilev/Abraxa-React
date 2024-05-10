Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsRightContent', {
    extend: 'Ext.Container',
    xtype: 'TerminalsRightContent',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch', //this is needed to stretch grid in last section berths
    },
    items: [
        {
            //General section
            xtype: 'TerminalsGeneral',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Coordinates section
            xtype: 'TerminalsCoordinates',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Additional terminal information section
            xtype: 'TerminalsAdditional',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Restriction section
            xtype: 'TerminalsRestrictions',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Max vessel size entries section
            xtype: 'TerminalsMaxVessel',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Special goods section
            xtype: 'TerminalsSpecialGoods',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Loading and Discharging Rates section
            xtype: 'TerminalsLDRates',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Storage Capacity section
            xtype: 'TerminalsStorageCapacity',
            ripple: true,
            cls: 'a-directory-section',
        },
        {
            //Berths section
            xtype: 'TerminalsBerths',
            ripple: true,
            cls: 'a-directory-section',
        },
    ],
});
