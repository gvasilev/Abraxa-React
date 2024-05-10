Ext.define('Abraxa.view.operations.DisbursementsPrincipal.DisbursementsPrincipalMainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.DisbursementsPrincipalMainController',

    exportToExcel: function (button) {
        const gridSuffix = Ext.String.capitalize(
            this.getViewModel().get('currentTab').replace(/\s+/g, '').toLowerCase()
        );
        const grid = button.up('DisbursementsPrincipalMain').down('DisbursementsPrincipalGrid' + gridSuffix);
        grid.saveDocumentAs({
            type: 'xlsx',
            title: 'Disbursements' + gridSuffix,
            includeSummary: true, // Add this line to include the summary row
            fileName: 'Disbursements' + gridSuffix + '.xlsx',
        });
    },

    searchDisbursements: function (searchfield, newValue, oldValue, eOpts) {
        const store = searchfield.up('DisbursementsPrincipalMain').upVM().get('disbursementsPrincipal');
        if (newValue.length === 0) store.removeFilter('searchFilter');
        if (newValue.length <= 2) return;

        store.addFilter({
            id: 'searchFilter',
            property: 'search',
            value: newValue,
            operator: '=',
            exactMatch: true,
        });
    },

    activeTabchange: function (tabbar, newTab, oldTab) {
        const disbursementsPrincipalMainVm = tabbar.upVM();
        const store = Ext.getStore('disbursementsPrincipal');

        disbursementsPrincipalMainVm.set('currentTab', newTab.valueId);
        const activeFiltersIds = store
            .getFilters()
            .items.filter((id) => id.getId() !== 'searchFilter')
            .map((filter) => filter.getId());

        activeFiltersIds.forEach((filterId) => {
            store.removeFilter(filterId);
        });

        tabbar.query('button').forEach((button) => {
            button.setPressed(false);
            button.setDisabled(true);
        });

        store.addFilter({
            id: newTab.valueId,
            property: 'status',
            operator: '=',
            value: newTab.statusText,
            exactMatch: true,
        });

        store.on('load', () => {
            tabbar.query('button').forEach((button) => {
                //    if (button.getValue()) button.setDisabled(false);
                button.setDisabled(false);
            });
        });
    },
});
