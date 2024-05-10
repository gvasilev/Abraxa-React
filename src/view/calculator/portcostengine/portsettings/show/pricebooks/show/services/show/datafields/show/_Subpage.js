Ext.define(
    'Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show._Subpage',
    {
        extend: 'Ext.Container',
        xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.subpage',
        viewModel: 'calculator.portcostengine.pricebooks.show.services.show.datafields.show',
        scrollable: true,
        flex: 1,
        layout: {
            type: 'card',
            flex: 1,
        },
        bind: {
            items: '{dataFieldActiveItemForm}',
        },
    }
);
