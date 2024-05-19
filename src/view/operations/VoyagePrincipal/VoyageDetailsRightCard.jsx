import './VoyageDetailsRightCardController.jsx';
import './VoyageDetailsRightCardViewModel.jsx';
import './VoyagePortItineryPanel.jsx';
import './VoyageTasksRightPanel.jsx';
Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyageDetailsRightCard', {
    extend: 'Ext.Container',
    cls: 'a-right-container a-right-container-voyage-planer a-right-container-sticky',
    xtype: 'VoyageDetailsRightCard',
    itemId: 'voyageDetailsRightCard',
    controller: 'VoyageDetailsRightCardController',
    viewModel: 'VoyageDetailsRightCardViewModel',

    setSelectedVoyage: function (record) {
        const vm = this.getViewModel();
        vm.set('selectedVoyage', record);
    },

    listeners: {
        show: 'onShow',
    },

    layout: {
        type: 'vbox',
    },
    items: [
        {
            xtype: 'tabbar',
            cls: 'a-bb-100',
            border: true,
            manageBorders: false,
            height: 64,
            padding: '0 24',
            animateIndicator: false,
            activeTab: 0,
            defaults: {
                ui: 'tab-lg',
                ripple: false,
            },
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'start',
            },
            items: [
                {
                    text: 'Voyage itinerary',
                },
                {
                    text: `To-Do's`,
                    bind: {
                        text: `To-Do's ({activePortCallCount})`,
                    },
                },
                {
                    xtype: 'button',
                    style: 'position: absolute; right: 16px; top: 14px;',
                    ui: 'round tool-round-md toggle',
                    iconCls: 'md-icon-close',
                    handler: 'closeVoyageDetailsRightCard',
                },
            ],
            listeners: {
                activeTabchange: 'tabChange',
            },
        },
        {
            xtype: 'container',
            itemId: 'rightCardTabsContainer',
            flex: 1,
            layout: {
                type: 'card',
                animation: null,
            },
            items: [
                {
                    xtype: 'VoyagePortItineryPanel',
                },
                {
                    xtype: 'VoyageTasksRightPanel',
                },
            ],
        },
    ],
});
