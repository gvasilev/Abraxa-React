Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show._Subpage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.datafields.show.subpage',
    viewModel: 'calculator.portcostengine.datafields.show',
    scrollable: true,
    flex: 1,
    bind: {
        items: '{dataFieldActiveItemForm}',
    },
});
