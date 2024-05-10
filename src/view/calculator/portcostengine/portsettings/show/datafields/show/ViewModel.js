Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.datafields.show.ViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.calculator.portcostengine.datafields.show',
    data: {
        choiceOptionSources: [
            {
                text: 'Custom (string)',
                value: 'manual',
            },
            {
                text: 'Custom (formula)',
                value: 'formula',
            },
            {
                text: 'Tariff table',
                value: 'tariff_table',
            },
            {
                text: 'Nomenclature regions',
                value: 'nomenclature_regions',
            },
            {
                text: 'Nomenclature vessels',
                value: 'nomenclature_vessels',
            },
            {
                text: 'Nomenclature cargoes',
                value: 'nomenclature_cargoes',
            },
            {
                text: 'Berth',
                value: 'port_berth',
            },
            {
                text: 'Vessel',
                value: 'vessel',
            },
            {
                text: 'Cargo',
                value: 'cargo',
            },
        ],
        nomenclatures: ['nomenclature_regions', 'nomenclature_vessels', 'nomenclature_cargoes'],
        nomenclatureValueTypes: [
            {
                text: 'Use categories',
                value: 'parents',
            },
            {
                text: 'Use items',
                value: 'leafs',
            },
        ],
        defaultOptions: [],
    },
    formulas: {
        recordCopy: {
            bind: {
                bindTo: '{calcDataFieldsList.selection}',
                deep: true,
            },
            get: function (value) {
                return value ? value.copy() : null;
            },
        },
        dataFieldActiveItemForm: {
            bind: '{calcDataFieldsList.selection.control}',
            get: function (value) {
                let xtype = 'calculator.portcostengine.portsettings.show.datafields.show.' + value + 'form';

                if (value) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        choiceFieldActiveItemForm: {
            bind: '{optionsSourceEdit.value}',
            get: function (value) {
                let xtype = null;

                switch (value) {
                    case 'manual':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.choiceformcustom';

                        break;
                    case 'formula':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.choiceformcustomformula';

                        break;
                    case 'tariff_table':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.choiceformtarifftable';

                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.choiceformnomenclature';

                        break;
                    case 'port_berth':
                    case 'vessel':
                    case 'cargo':
                        xtype = 'container';

                        break;
                }

                if (value) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        complexFieldPrefixActiveItemForm: {
            bind: '{prefix_optionsSourceEdit.value}',
            get: function (value) {
                let xtype = null;

                switch (value) {
                    case 'manual':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.complexprefixformcustom';

                        break;
                    case 'formula':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexprefixformcustomformula';

                        break;
                    case 'tariff_table':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexprefixformtarifftable';

                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexprefixformnomenclature';

                        break;
                    case 'port_berth':
                    case 'vessel':
                    case 'cargo':
                        xtype = 'container';

                        break;
                }

                if (value) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        complexFieldSuffixActiveItemForm: {
            bind: '{suffix_optionsSourceEdit.value}',
            get: function (value) {
                let xtype = null;

                switch (value) {
                    case 'manual':
                        xtype = 'calculator.portcostengine.portsettings.show.datafields.show.complexsuffixformcustom';

                        break;
                    case 'formula':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexsuffixformcustomformula';

                        break;
                    case 'tariff_table':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexsuffixformtarifftable';

                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        xtype =
                            'calculator.portcostengine.portsettings.show.datafields.show.complexsuffixformnomenclature';

                        break;
                    case 'port_berth':
                    case 'vessel':
                    case 'cargo':
                        xtype = 'container';

                        break;
                }

                if (value) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        optionSourceDropdownOptions: {
            bind: '{calcDataFieldsList.selection}',
            get: function (value) {
                if (value) {
                    let choiceOptionSources = this.data.choiceOptionSources;
                    let recordValidSources = value.get('validSources') ? value.get('validSources') : [];

                    return choiceOptionSources.filter(function (source) {
                        return recordValidSources.includes(source.value);
                    });
                }

                return [];
            },
        },
        prefix_optionSourceDropdownOptions: {
            bind: '{calcDataFieldsList.selection}',
            get: function (value) {
                if (value && value.get('subFields').length > 0) {
                    let choiceOptionSources = this.data.choiceOptionSources;
                    let recordValidSources = value.get('subFields')[0].data.validSources
                        ? value.get('subFields')[0].data.validSources
                        : [];

                    return choiceOptionSources.filter(function (source) {
                        return recordValidSources.includes(source.value);
                    });
                }

                return [];
            },
        },
        suffix_optionSourceDropdownOptions: {
            bind: '{calcDataFieldsList.selection}',
            get: function (value) {
                if (value && value.get('subFields').length > 0) {
                    let choiceOptionSources = this.data.choiceOptionSources;
                    let recordValidSources = value.get('subFields')[1].data.validSources
                        ? value.get('subFields')[1].data.validSources
                        : [];

                    return choiceOptionSources.filter(function (source) {
                        return recordValidSources.includes(source.value);
                    });
                }

                return [];
            },
        },
        tableDropdownOptions: {
            bind: {
                bindTo: '{tarifftable.data}',
                deep: true,
            },
            get: function (value) {
                let options = [];
                let tableStore = value;
                let tableRecords = (tableStore.getSource() || tableStore).getRange();

                if (tableRecords.length) {
                    tableRecords.forEach((table, index) => {
                        if (table.data.behaviour.xAxisAsChoiceSource || table.data.behaviour.yAxisAsChoiceSource) {
                            options.push({
                                text: table.data.label,
                                value: table.data.id,
                            });
                        }
                    });
                }

                return Ext.create('Ext.data.Store', {
                    data: options,
                });
            },
        },
        tableAxisDropdownOptions: {
            bind: {
                bindTo: '{recordCopy.sourceDataTableID}',
                deep: true,
            },
            get: function (value) {
                let options = [];
                let tableStore = this.getParent().getStore('tarifftable');
                let tableID = value;

                if (tableID) {
                    let table = tableStore.findRecord('id', tableID);

                    if (table && table.data.behaviour.xAxisAsChoiceSource) {
                        options.push({
                            text: 'X axis',
                            value: '_x',
                        });
                    }
                    if (table && table.data.behaviour.yAxisAsChoiceSource) {
                        options.push({
                            text: 'Y axis',
                            value: '_y',
                        });
                    }
                }

                return Ext.create('Ext.data.Store', {
                    data: options,
                });
            },
        },
        prefix_tableAxisDropdownOptions: {
            bind: {
                tableEdit: '{recordCopy.prefix_sourceDataTableID}',
            },
            get: function (value) {
                let options = [];
                let tableStore = this.getParent().getStore('tarifftable');
                let tableID = value.tableEdit;

                if (tableID) {
                    let table = tableStore.findRecord('id', tableID);

                    if (table && table.data.behaviour.xAxisAsChoiceSource) {
                        options.push({
                            text: 'X axis',
                            value: '_x',
                        });
                    }

                    if (table && table.data.behaviour.yAxisAsChoiceSource) {
                        options.push({
                            text: 'Y axis',
                            value: '_y',
                        });
                    }
                }

                return Ext.create('Ext.data.Store', {
                    data: options,
                });
            },
        },
        suffix_tableAxisDropdownOptions: {
            bind: {
                tableEdit: '{recordCopy.suffix_sourceDataTableID}',
            },
            get: function (value) {
                let options = [];
                let tableStore = this.getParent().getStore('tarifftable');
                let tableID = value.tableEdit;

                if (tableID) {
                    let table = tableStore.findRecord('id', tableID);

                    if (table && table.data.behaviour.xAxisAsChoiceSource) {
                        options.push({
                            text: 'X axis',
                            value: '_x',
                        });
                    }

                    if (table && table.data.behaviour.yAxisAsChoiceSource) {
                        options.push({
                            text: 'Y axis',
                            value: '_y',
                        });
                    }
                }

                return Ext.create('Ext.data.Store', {
                    data: options,
                });
            },
        },
    },
});
