import './ViewModel.jsx';
import './portsettings/show/Controller.jsx';
import './portsettings/show/_Page.jsx';
import './PremiumPage.jsx';
import '../../../store/calculator/Nomenclature.jsx';
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
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'agent') {
                Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
