import '../../../../../../../store/calculator/GlobalRepeaterType';

Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.globalvariables.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.globalvariables.show',
    stores: {
        calcglobalrepeatertype: {
            type: 'calcglobalrepeatertype',
            filters: [
                function (record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().portSettingsId) {
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
            bind: {
                bindTo: '{calcGlobalVariablesList.selection}',
                deep: true,
            },
            get: function (value) {
                return value ? value.copy() : null;
            },
        },
    },
});
