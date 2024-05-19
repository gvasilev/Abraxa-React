import '../../../store/portcalls/PortcallsPrincipal.js';
Ext.define('Abraxa.view.operations.PortcallsPrincipal.PortcallsPrincipalMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.PortcallsPrincipalMainViewModel',
    stores: {
        portcallsPrincipal: {
            type: 'portcallsPrincipal',
        },
    },
    data: {
        tabbarItems: [],
        totalPortCallRecords: 0,
        activeTabIndex: null,
        currentTab: 'All',
    },

    formulas: {
        setCurrentButton: {
            bind: {
                bindTo: '{tabbarItems}',
                deep: true,
            },
            get: function (buttons) {
                if (buttons.length === 0) return;
                const stateProvider = Ext.state.Provider.get();
                let record = stateProvider.get('portcall-principal-tabbar');

                if (record) {
                    this.set('activeTabIndex', record.$.activeTabIndex);
                    buttons.forEach((button, index) => {
                        if (index === record.$.activeTabIndex && button.valueId !== 'all') {
                            this.get('portcallsPrincipal').addFilter({
                                id: button.valueId,
                                property: 'custom_status',
                                operator: '=',
                                value: button.valueId,
                                exactMatch: true,
                            });
                        }
                    });
                }
                this.get('portcallsPrincipal').load();
            },
        },
        filterButtons: {
            bind: {
                bindTo: '{portcallsPrincipal}',
            },
            get: function (store) {
                let filterButtons = [];

                const vm = this;
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'portcall-company-statuses',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    success: function (response, opts) {
                        const res = JSON.parse(response.responseText);
                        filterButtons.push(
                            ...res.map((item) => {
                                return {
                                    text: item.name,
                                    valueId: item.name,
                                    value: item.portcalls_count,
                                    html:
                                        item.name +
                                        ' <em ' +
                                        (item.name === 'Pending appointments' ? 'class="a-bg-orange-300"' : '') +
                                        '>' +
                                        item.portcalls_count +
                                        '</em>',
                                };
                            })
                        );
                        const totalPortCallRecords = res.map((item) => item.portcalls_count).reduce((a, b) => a + b, 0);

                        vm.set('totalPortCallRecords', totalPortCallRecords);
                        vm.set('tabbarItems', filterButtons);
                    },
                    failure: function (response, opts) {
                        // Ext.Msg.warning('Warning', 'The right data could not be loaded. Please try again later.');
                        // return response;
                    },
                });

                return filterButtons;
            },
        },
    },
});
