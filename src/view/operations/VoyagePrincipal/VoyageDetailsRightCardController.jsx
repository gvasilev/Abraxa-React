Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyageDetailsRightCardController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.VoyageDetailsRightCardController',
    listen: {
        global: {
            addDeleteTaskEvent: function () {
                if (this.getView().getViewModel()) {
                    const vm = this.getView().getViewModel();
                    vm.get('selectedVoyage').load();
                }
            },
            changeTaskVoyagePrincipalStatus: function () {
                if (this.getView().getViewModel()) {
                    const vm = this.getView().getViewModel();
                    vm.get('selectedVoyage').set('dirty', !vm.get('selectedVoyage').set('dirty'));
                    vm.get('selectedVoyage').set('dirty', true);
                }
            },
        },
    },
    closeVoyageDetailsRightCard: function (button) {
        const vm = button.up('VoyagePrincipalMain').getViewModel();
        button
            .up('VoyagePrincipalMain')
            .down('VoyagesGrid')
            .query('#voyageDetailsMoreInfoButton')
            .forEach((button) => {
                button.setIconCls('md-icon-navigate-next');
                button.getTooltip().html = 'View details';
            });
        vm.set('currentVoyage', null);
    },

    tabChange: function (me, value) {
        const activeTab = me.getActiveTab();
        const tabBar = me.up('VoyageDetailsRightCard').down('#rightCardTabsContainer');
        tabBar.setActiveItem(me.items.indexOf(activeTab));
    },

    onEditVoyageClick: function (button) {
        let vm = this.getView().upVM();
        let selectedVoyage = vm.get('selectedVoyage');
        if (selectedVoyage) {
            Ext.getCmp('main-viewport')
                .getController()
                .redirectTo('voyage/' + selectedVoyage.get('id') + '/update');
        }
    },

    onShow: function (card) {
        card.setMasked({
            xtype: 'loadmask',
            message: 'Loading...',
        });
        card.down('tabbar').setActiveTab(0);
    },
});
