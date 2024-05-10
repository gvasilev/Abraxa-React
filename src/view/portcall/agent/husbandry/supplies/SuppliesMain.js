Ext.define('Abraxa.view.portcall.husbandry.supplies.SuppliesMain', {
    extend: 'Ext.Container',
    xtype: 'husbandry.supplies.main',
    controller: 'supplies-controller',
    itemId: 'supplyMain',
    layout: 'vbox',
    items: [
        {
            xtype: 'husbandry.supplies.grid',
            flex: 1,
        },
    ],
});
