Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.pricebooks.show.services.show',
    stores: {
        calcservicedatafield: {
            type: 'calcservicedatafield',
            filters: [
                function (record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                    priceBookId: '{priceBooksList.selection.id}',
                    serviceId: '{templateServiceRecord.id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (
                                this.getProxy().getExtraParams().portSettingsId &&
                                this.getProxy().getExtraParams().priceBookId &&
                                this.getProxy().getExtraParams().serviceId
                            ) {
                                this.load();
                            }
                        },
                        this
                    );
                }
            },
        },
    },
    formulas: {
        recordCopy: {
            bind: '{calculatorPriceBookServicesGrid.selection}',
            get: function (value) {
                return value ? value.copy() : null;
            },
        },
        nomenclatureRegionComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'region');

                    if (nomenclature) {
                        let categories = nomenclature.data.items.filter(function (item) {
                            return item.leaf === false;
                        });

                        categories.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
        nomenclatureCargoComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'cargo');

                    if (nomenclature) {
                        let categories = nomenclature.data.items.filter(function (item) {
                            return item.leaf === false;
                        });

                        categories.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
        nomenclatureVesselComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'vessel');

                    if (nomenclature) {
                        let categories = nomenclature.data.items.filter(function (item) {
                            return item.leaf === false;
                        });

                        categories.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
        nomenclatureRegionItemsComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'region');

                    if (nomenclature) {
                        let items = nomenclature.data.items.filter(function (item) {
                            return item.leaf === true;
                        });

                        items.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
        nomenclatureCargoItemsComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'cargo');

                    if (nomenclature) {
                        let items = nomenclature.data.items.filter(function (item) {
                            return item.leaf === true;
                        });

                        items.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
        nomenclatureVesselItemsComboStore: {
            get: function (value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore.isLoaded()) {
                    traverseNomenclature();
                } else {
                    nomenclatureStore.on('load', traverseNomenclature);
                }

                function traverseNomenclature() {
                    let nomenclature = nomenclatureStore.findRecord('type', 'vessel');

                    if (nomenclature) {
                        let items = nomenclature.data.items.filter(function (item) {
                            return item.leaf === true;
                        });

                        items.forEach((category, index) => {
                            options.push({
                                name: category.text,
                                value: category.id,
                            });
                        });
                    }

                    // Notify that the options are updated
                    me.notify();
                }

                return options;
            },
        },
    },
});
