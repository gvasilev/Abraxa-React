import '../../../store/calculator/PortSettings';
import '../../../store/calculator/DataField';
import '../../../store/calculator/GlobalVariable';
import '../../../store/calculator/TariffTable';
import '../../../store/calculator/PriceBook';
import './portsettings/index/_Page';
import './PremiumPage';
import './portsettings/show/nomenclatures/show/_Subpage';
import './portsettings/show/datafields/show/_Subpage';
import '../../../store/calculator/Nomenclature';
import './portsettings/show/tarifftables/Grid';
import './portsettings/show/globalvariables/show/_Subpage';
import './portsettings/show/pricebooks/show/_Subpage';
import './portsettings/show/pricebooks/show/services/show/_Subpage';
import './portsettings/show/pricebooks/show/services/show/datafields/show/_Subpage';
import './portsettings/show/pricebooks/show/variables/show/_Subpage';
import './portsettings/show/DataFieldAddModal';
import './portsettings/show/GlobalVariableAddModal';
import './portsettings/show/PriceBookAddModal';
import './portsettings/show/TariffTableAddModal';
import '../../../store/calculator/PriceBookService';

Ext.define('Abraxa.view.calculator.portcostengine.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine',
    stores: {
        portsettings: {
            type: 'portsettings',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            proxy: {
                extraParams: {
                    company_id: 1,
                },
            },
        },
        calcdatafield: {
            type: 'calcdatafield',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (this.getProxy().getExtraParams().portSettingsId) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
        },
        calcglobalvariable: {
            type: 'calcglobalvariable',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (this.getProxy().getExtraParams().portSettingsId) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
        },
        tarifftable: {
            type: 'tarifftable',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            sorters: [
                {
                    sorterFn: function(tt1, tt2) {
                        return tt1.get('slug') > tt2.get('slug') ? 1 : tt1.get('slug') === tt1.get('slug') ? 0 : -1;
                    },
                    // transform: function (value) {

                    //     return value.replace('TT', '');
                    // },
                },
            ],
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (this.getProxy().getExtraParams().portSettingsId) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
        },
        calcpricebook: {
            type: 'calcpricebook',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (this.getProxy().getExtraParams().portSettingsId) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
        },
        calcpricebookservice: {
            type: 'calcpricebookservice',
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
        calcnomenclature: {
            type: 'calcnomenclature',
            filters: [
                function(record) {
                    return !record.phantom;
                },
            ],
            autoLoad: true,
            proxy: {
                extraParams: {
                    portSettingsId: '{calculatorPortSettingsGrid.selection.id}',
                },
            },
            updateProxy: function(proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function() {
                            if (this.getProxy().getExtraParams().portSettingsId) {
                                this.load();
                            }
                        },
                        this,
                    );
                }
            },
            listeners: {
                load: function() {
                    let nomenclatureList = Ext.ComponentQuery.query('list[reference=nomenclaturesList]')[0];

                    if (nomenclatureList && !nomenclatureList.getSelection()) {
                        nomenclatureList.select(nomenclatureList.getStore().getAt(0));
                    }
                },
            },
        },
    },
    data: {
        templateServiceRecord: null,
        templateVariableRecord: null,
        templateServiceDataFieldRecord: null,
        pageXtype: 'calculator.portcostengine.portsettings.index.page',
        pages: [
            { xtype: 'calculator.portcostengine.portsettings.index.page' },
            { xtype: 'calculator.portcostengine.portsettings.show.page' },
            { xtype: 'calculator.premium.page' },
        ],
        subpageXtype: 'calculator.portcostengine.portsettings.show.nomenclatures.show.subpage',
        subpages: [
            { xtype: 'calculator.portcostengine.portsettings.show.nomenclatures.show.subpage' },
            { xtype: 'calculator.portcostengine.portsettings.show.datafields.show.subpage' },
            { xtype: 'calculator.portcostengine.portsettings.show.tarifftables.grid' },
            { xtype: 'calculator.portcostengine.portsettings.show.globalvariables.show.subpage' },
            { xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.subpage' },
            { xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.subpage' },
            {
                xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafields.show.subpage',
            },
            { xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.variables.show.subpage' },
        ],
    },
    formulas: {
        pageActiveItem: {
            bind: '{pageXtype}',
            get: function(value) {
                let pages = this.data.pages;
                if (this.get('currentUserPlan') === 'starter') {
                    this.set('pageXtype', 'calculator.premium.page');
                }
                return pages.findIndex((page) => page.xtype === value);
            },
        },
        subpageActiveItem: {
            bind: '{subpageXtype}',
            get: function(value) {
                let subpages = this.data.subpages;
                return value ? subpages.findIndex((subpage) => subpage.xtype === value) : 0;
            },
        },
    },
});
