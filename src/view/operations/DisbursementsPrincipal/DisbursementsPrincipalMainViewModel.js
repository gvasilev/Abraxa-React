Ext.define('Abraxa.view.operations.DisbursementsPrincipal.DisbursementsPrincipalMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.DisbursementsPrincipalMainViewModel',
    stores: {
        disbursementsPrincipal: {
            type: 'disbursementsPrincipal',
        },
        balanceExposure: {
            type: 'balance.exposure',
            autoLoad: true,
        },
    },
    data: {
        tabbarItems: [],
        totalPortCallRecords: 0,
        activeTabIndex: null,
        currentTab: 'all',
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
                let record = stateProvider.get('disbursements-principal-tabbar');

                if (record) {
                    this.set('activeTabIndex', record.$.activeTabIndex);
                    buttons.forEach((button, index) => {
                        if (index === record.$.activeTabIndex && button.valueId !== 'all') {
                            this.get('disbursementsPrincipal').addFilter({
                                id: button.valueId,
                                property: 'status',
                                operator: '=',
                                value: button.statusText,
                                exactMatch: true,
                            });
                        }
                    });
                }

                this.get('disbursementsPrincipal').load();
            },
        },
        filterButtons: {
            bind: {
                bindTo: '{disbursementsPrincipal}',
            },
            get: function () {
                const filterButtons = [];
                const vm = this;
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'disbursement-company-statuses',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    success: function (response, opts) {
                        const res = JSON.parse(response.responseText).data;
                        const filteredButtons = res.filter((item) => !item.hidden);
                        filterButtons.push(
                            ...filteredButtons.map((item) => {
                                return {
                                    text: item.name.trim(),
                                    value: item.disbursement_count,
                                    statusText: item.name,
                                    valueId: item.name,
                                    html:
                                        item.name +
                                        ' <em ' +
                                        (item.name === 'Awaiting approval' ? 'class="a-bg-orange-300"' : '') +
                                        '>' +
                                        item.disbursement_count +
                                        '</em>',
                                };
                            })
                        );
                        const totalPortCallRecords = res
                            .map((item) => item.disbursement_count)
                            .reduce((a, b) => a + b, 0);

                        vm.set('totalPortCallRecords', totalPortCallRecords);
                        vm.set('tabbarItems', filterButtons);
                    },
                });
                return filterButtons;
            },
        },
    },
});
