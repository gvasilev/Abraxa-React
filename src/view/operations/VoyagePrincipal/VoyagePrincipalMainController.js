Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePrincipalMainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.VoyagePrincipalMainController',

    exportToExcel: function (button) {
        const grid = button.up('OperationsMainContainer').down('VoyagesGrid');
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Voyages',
            includeSummary: true, // Add this line to include the summary row
            fileName: 'Voyages' + '.xlsx',
        });
    },

    openNewVoyageForm: function (btn) {
        Ext.getCmp('main-viewport').getController().redirectTo('voyage/create');

        // Ext.create('Abraxa.view.voyage.CreateVoyage', {
        //     viewModel: {
        //         parent: vm,
        //         data: {
        //             isEdit: false,
        //         },
        //         links: {
        //             voyage: {
        //                 type: 'Abraxa.model.voyage.VoyagePrincipal',
        //                 create: {
        //                     assigned_to: vm.get('currentUser.id'),
        //                 },
        //             },
        //         },
        //         stores: {
        //             portcalls: Ext.create('Ext.data.Store', {
        //                 model: 'Abraxa.model.portcall.Portcall',
        //                 data: [{}],
        //             }),
        //         },
        //     },
        // }).show();
    },

    manageColumns: function (button) {
        button.up('VoyagePrincipalMain').down('#voyagesGrid').getPlugin('gridviewoptions').showViewOptions();
    },

    activeTabchange: function (tabbar, newTab, oldTab) {
        const voyagePrincipalMainVm = tabbar.up('VoyagePrincipalMain').getViewModel();

        voyagePrincipalMainVm.set('currentVoyage', null);

        tabbar
            .up('VoyagePrincipalMain')
            .down('VoyagesGrid')
            .query('#voyageDetailsMoreInfoButton')
            .forEach((button) => {
                button.setIconCls('md-icon-navigate-next');
                button.getTooltip().html = 'View details';
            });

        const store = tabbar.up('VoyagePrincipalMain').down('VoyagesGrid').getStore();
        const activeFiltersIds = store
            .getFilters()
            .items.filter((id) => id.getId() !== 'searchFilter')
            .map((filter) => filter.getId());

        activeFiltersIds.forEach((filterId) => {
            store.removeFilter(filterId);
        });

        // if (newTab.valueId === 'All') {
        //     return;
        // }
        tabbar.query('button').forEach((button) => {
            button.setPressed(false);
            button.setDisabled(true);
        });

        store.addFilter({
            id: newTab.valueId,
            property: 'status',
            operator: '=',
            value: newTab.valueId,
            exactMatch: true,
        });

        store.on('load', () => {
            voyagePrincipalMainVm.set('tabChanged', !voyagePrincipalMainVm.get('tabChanged'));
            voyagePrincipalMainVm.set('currentVoyage', null);

            tabbar.query('button').forEach((button) => {
                button.setDisabled(false);
            });
        });
    },
});
