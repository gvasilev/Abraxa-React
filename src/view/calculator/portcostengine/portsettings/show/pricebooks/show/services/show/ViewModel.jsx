import '../../../../../../../../../store/calculator/ServiceDataField';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.pricebooks.show.services.show',
    stores: {
        calcservicedatafield: {
            type: 'calcservicedatafield',
            filters: [
                function(record) {
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
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (
                                this.getProxy().getExtraParams().portSettingsId &&
                                this.getProxy().getExtraParams().priceBookId &&
                                this.getProxy().getExtraParams().serviceId
                            ) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
        },
    },
    formulas: {
        recordCopy: {
            bind: '{calculatorPriceBookServicesGrid.selection}',
            get: function(value) {
                return value ? value.copy() : null;
            },
        },
        nomenclatureRegionComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'region');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'region');
                        me.notify();
                    });
                }

                return options;
            },
        },
        nomenclatureCargoComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'cargo');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'cargo');
                        me.notify();
                    });
                }

                return options;
            },
        },
        nomenclatureVesselComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'vessel');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'vessel');
                        me.notify();
                    });
                }

                return options;
            },
        },
        nomenclatureRegionItemsComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'region');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'region');
                        me.notify();
                    });
                }

                return options;
            },
        },
        nomenclatureCargoItemsComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'cargo');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'cargo');
                        me.notify();
                    });
                }

                return options;
            },
        },
        nomenclatureVesselItemsComboStore: {
            get: function(value) {
                let me = this;
                let options = [];
                let nomenclatureStore = Ext.getStore('calcnomenclature');

                if (nomenclatureStore && nomenclatureStore.isLoaded()) {
                    options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'vessel');
                    me.notify();
                } else {
                    nomenclatureStore.on('load', function() {
                        options = Abraxa.utils.Functions.traverseNomenclature(nomenclatureStore, 'vessel');
                        me.notify();
                    });
                }

                return options;
            },
        },
    },
});
