import '../../../../../../../store/calculator/PriceBookVariable';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.pricebooks.show',
    stores: {
        calcpricebookvariable: {
            type: 'calcpricebookvariable',
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
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (
                                this.getProxy().getExtraParams().portSettingsId &&
                                this.getProxy().getExtraParams().priceBookId
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
            bind: '{priceBooksList.selection}',
            get: function (value) {
                return value ? value.copy() : null;
            },
        },
    },
});
