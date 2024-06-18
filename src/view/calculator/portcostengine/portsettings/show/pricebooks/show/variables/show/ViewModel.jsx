import '../../../../../../../../../store/calculator/TemplateRepeaterType';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.variables.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.pricebooks.show.variables.show',
    stores: {
        calctemplaterepeatertype: {
            type: 'calctemplaterepeatertype',
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
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (
                                this.getProxy().getExtraParams().portSettingsId &&
                                this.getProxy().getExtraParams().priceBookId
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
            bind: {
                bindTo: '{templateVariableRecord}',
                deep: true,
            },
            get: function(value) {
                return value ? value.copy() : null;
            },
        },
    },
});
