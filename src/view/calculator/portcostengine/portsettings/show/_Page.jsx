import '../index/_Page';
import './LeftMenu';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show._Page', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.portsettings.show.page',
    controller: 'portcostengine.portsettings.show.controller',
    flex: 1,
    layout: {
        type: 'hbox',
    },
    items: [
        {
            xtype: 'calculator.portcostengine.portsettings.show.leftmenu',
        },
        {
            flex: 1,
            layout: {
                type: 'card',
            },
            bind: {
                activeItem: '{subpageActiveItem}',
                items: '{subpages}',
            },
        },
    ],
});
