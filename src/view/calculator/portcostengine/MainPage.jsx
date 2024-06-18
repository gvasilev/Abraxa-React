import './ViewModel';
import './portsettings/show/Controller';
import './portsettings/show/_Page';
import './PremiumPage';
import '../../../store/calculator/Nomenclature';

Ext.define('Abraxa.view.calculator.portcostengine.MainPage', {
    extend: 'Ext.Container',
    xtype: 'calculator.portcostengine.main',
    itemId: 'calculator.portcostengine.main',
    viewModel: 'calculator.portcostengine',
    layout: 'fit',
    bodyCls: 'a-layout-card-wrap a-portcostengine',
    items: [
        {
            xtype: 'main.header',
        },
        {
            controller: 'portcostengine.portsettings.show.controller',
            flex: 1,
            layout: {
                type: 'card',
            },
            bind: {
                activeItem: '{pageActiveItem}',
                items: '{pages}',
            },
        },
    ],
    listeners: {
        painted: function(me) {
            if (me.upVM().get('currentUserType') !== 'agent') {
                Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
