import '../../../store/voyage/VoyagesPrincipal';

Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyagePrincipalMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.VoyagePrincipalMainViewModel',
    data: {
        tabChanged: false,
        currentVoyage: null,
        tabbarItems: [],
        totalRecords: 0,
        activeTabIndex: null,
    },
    stores: {
        voyagesPrincipal: {
            type: 'voyagesPrincipal',
            // autoLoad: true,
            sorters: [
                {
                    property: 'id',
                    direction: 'DESC',
                },
            ],
        },
    },
    formulas: {
        totalRecordsPaggination: {
            bind: {
                bindTo: '{voyagesPrincipal}',
                deep: true,
            },
            get: function (store) {
                return store.getTotalCount();
            },
        },

        setCurrentButton: {
            bind: {
                bindTo: '{tabbarItems}',
                deep: true,
            },
            get: function (buttons) {
                if (buttons.length === 0) return;
                const stateProvider = Ext.state.Provider.get();
                let record = stateProvider.get('voyages-tabbar-principal');

                if (record) {
                    this.set('activeTabIndex', record.$.activeTabIndex);
                    buttons.forEach((button, index) => {
                        if (index === record.$.activeTabIndex && button.valueId !== 'All') {
                            this.get('voyagesPrincipal').addFilter({
                                id: button.valueId,
                                property: 'status',
                                operator: '=',
                                value: button.valueId,
                                exactMatch: true,
                            });
                        }
                    });
                }
                this.get('voyagesPrincipal').load();
            },
        },

        filterButtons: function (get) {
            let filterButtons = [];
            // filterButtons.push({
            //     text: 'All',
            //     valueId: 'all',
            //     value: 1,
            //     pressed: true,
            //     bind: {
            //         html: 'All <em>  {totalRecords}</em>',
            //     },
            // });

            const vm = this;
            const voyagesGridStore = this.getView().down('VoyagesGrid').getStore();
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'voyage-statuses',
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                success: function (response, opts) {
                    const res = JSON.parse(response.responseText).data;
                    const buttonsToAdd = res.map((item) => ({
                        text: item.name,
                        valueId: item.name,
                        value: item.voyage_count,
                        html: item.voyage_count
                            ? item.name + ' <em>' + item.voyage_count + '</em>'
                            : item.name + ' <em>' + 0 + '</em>',
                    }));

                    filterButtons.push(...buttonsToAdd);

                    const totalVoaygeRecords = res.map((item) => item.voyage_count).reduce((a, b) => a + b, 0);
                    vm.set('totalRecords', totalVoaygeRecords);
                    vm.set('tabbarItems', filterButtons);
                },
            });
        },
    },
});
