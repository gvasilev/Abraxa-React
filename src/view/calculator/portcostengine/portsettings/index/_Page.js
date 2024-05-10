Ext.define('Abraxa.view.calculator.portcostengine.pricebooks.index._Page', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.index.page',
    flex: 1,
    layout: {
        type: 'hbox',
    },
    items: [{ xtype: 'calculator.portcostengine.portsettings.index.grid' }],
});
