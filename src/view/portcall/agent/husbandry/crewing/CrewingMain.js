Ext.define('Abraxa.view.portcall.husbandry.crewing.CrewingMain', {
    extend: 'Ext.Container',
    xtype: 'husbandry.crewing.main',
    controller: 'crewing-controller',
    itemId: 'crewingMain',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'husbandry.crewing.grid',
        },
    ],
});
