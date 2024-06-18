import './SharedCostCentersButton';
import './ports/PortsMainContainer';
import './sof/SofMainContainer';
import './expenses/ExpensesMainContainer';
import './costcenter/CostCenterMainContainer';
import './cargoes/CargoesMainContainer';
import './vessels/VesselsMainContainer';
import './taxes/TaxesMainContainer';
import './ports/PortsRightCard';
import './cargoes/CargoesRightCard';
import './vessels/VesselsRightCard';
import './ports/FilesInfo';
import './ports/TerminalsRightCard';
import './ports/BerthsRightCard';
import './ports/HolidaysRightCard';
import './taxes/TaxesRightCard';
import './expenses/ServiceRightPanel';
import './costcenter/CostCenterDetails';

Ext.define('Abraxa.view.settings.lirbrary.LibraryMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.main',
    layout: 'vbox',
    flex: 1,
    itemId: 'libraryMainContainer',
    viewModel: {
        data: {
            dialogHasBeenShown: false,
            agentsCounts: 0,
            LibraryServicesGrid: null,
            portFlag: null,
        },
        stores: {
            portServedBerths: {
                source: '{portsServerGrid.selection.berths}',
            },
            portServedTerminals: {
                source: '{portsServerGrid.selection.terminals}',
            },
        },
        formulas: {
            portImg: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (port) {
                        if (port.code) {
                            return 'https://static.abraxa.com/ports/' + port.code + '.jpg';
                        } else {
                            return 'https: //static.abraxa.com/images/no-image-port.svg';
                        }
                    }
                },
            },
            portTitleComponent: {
                bind: {
                    bindTo: '{portsServerGrid.selection}',
                },
                get: function (selectedPort) {
                    if (!selectedPort) return AbraxaConstants.placeholders.emptySpan;
                    const libraryMainVM = this;
                    let countryObj = null;
                    if (selectedPort.get('port') && selectedPort.get('port').countries)
                        countryObj = selectedPort.get('port').countries;

                    let country = AbraxaConstants.placeholders.emptyValue;
                    if (countryObj && countryObj.country_name) {
                        country = countryObj.country_name;
                    }
                    let countryCode = '';
                    if (countryObj && countryObj.country_code) {
                        countryCode = `(${countryObj.country_code})`;
                    }
                    let portName = AbraxaConstants.placeholders.emptyValue;
                    if (selectedPort.get('port_name')) portName = selectedPort.get('port_name');

                    let htmlString =
                        `<div class="hbox">` +
                        `<img data-qtip="${country}" data-qalign="bc-tc" height="24" class="a-img-round mr-16" src="${libraryMainVM.get('portFlag')}"/>` +
                        `${portName} <span class="text-uppercase ml-2">${countryCode}</span></div>`;

                    return htmlString;
                },
            },

            portFlag: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (!port || !port.countries || !port.countries.country_code) return null;

                    return 'https://static.abraxa.com/flags/1x1/' + port.countries.country_code.toLowerCase() + '.svg';
                },
            },
            portWaterType: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (!port || !port.water || !port.water[0]) return AbraxaConstants.placeholders.emptyValue;
                    return port.water[0];
                },
            },

            portSeason: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (!port || !port.season) return AbraxaConstants.placeholders.emptyValue;
                    return port.season;
                },
            },

            portCoordinates: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port.center}',
                    deep: true,
                },
                get: function (coordinates) {
                    if (coordinates) {
                        return coordinates;
                    }
                    return null;
                },
            },
            lat: {
                bind: {
                    bindTo: '{portCoordinates}',
                    deep: true,
                },
                get: (coordinates) => AbraxaFunctions.getPortLatitude(coordinates),
            },
            lon: {
                bind: {
                    bindTo: '{portCoordinates}',
                    deep: true,
                },
                get: (coordinates) => AbraxaFunctions.getPortLongitude(coordinates),
            },
            portServedRecord: {
                bind: {
                    bindTo: '{portsServerGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    }
                    return null;
                },
            },
            portServedHolidays: {
                bind: {
                    bindTo: '{portsServerGrid.selection.holidays}',
                    deep: true,
                },
                get: function (store) {
                    if (store) {
                        store.sort('date', 'ASC');
                        return store;
                    }
                },
            },
            shelterAffordedCode: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (port) {
                        return port.shelter_afforded_code;
                    }
                    return '';
                },
            },
            terminalCollection: {
                bind: {
                    bindTo: '{portsServerGrid.selection}',
                },
                get: function (portSelected) {
                    return portSelected?.terminals() ?? null;
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            hidden: false,
            itemId: 'main-right-container',
            bind: {
                hidden: '{portsServerGrid.selection || cargoesGrid.selection || vesselsGrid.selection ? true : false}',
            },
            items: [
                {
                    xtype: 'container',
                    docked: 'top',
                    cls: 'a-bb-100',
                    weight: 1,
                    layout: {
                        type: 'hbox',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-titlebar',
                            docked: 'top',
                            layout: {
                                type: 'hbox',
                                pack: 'space-between',
                            },
                            items: [
                                {
                                    xtype: 'tabbar',
                                    height: 64,
                                    padding: '0 8',
                                    bind: {
                                        activeTab: '{currentUserType == "principal" ? 2 : 0}',
                                    },
                                    reference: 'library_tabbar',
                                    publishes: {
                                        activeTab: true,
                                        activeTabIndex: true,
                                    },
                                    defaults: {
                                        ui: 'tab-lg',
                                        ripple: false,
                                    },
                                    items: [
                                        {
                                            text: 'Ports served',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'SOF',
                                            testId: 'librarySofTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Services',
                                            testId: 'libraryServicesTabTestId',
                                        },
                                        {
                                            text: 'Cost center',
                                            testId: 'libraryServicesTabTestId',
                                        },
                                        {
                                            text: 'Cargoes',
                                            testId: 'libraryCargoesTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Vessels',
                                            testId: 'libraryVesselsTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                        {
                                            text: 'Taxes',
                                            testId: 'libraryTaxesTabTestId',
                                            bind: {
                                                hidden: '{currentUserType == "principal" ? true : false}',
                                            },
                                        },
                                    ],
                                    listeners: {
                                        activeTabchange: function (me, value) {
                                            //DEV-2926
                                            if (value && value.getText() === 'Services') {
                                                Ext.ComponentQuery.query('#LibraryServicesGrid')[0].getStore().load();
                                            }

                                            Ext.ComponentQuery.query('#taxGrid')[0].deselectAll();
                                            Ext.ComponentQuery.query('#LibraryServicesGrid')[0].deselectAll();
                                        },
                                    },
                                },
                                {
                                    xtype: 'SharedCostCentersButton',
                                    bind: {
                                        hidden: '{currentUserType !== "principal"}',
                                        text: 'Share with agents <em style="background-color: white; color: #0078D7">{agentsCounts}</em>',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'settings.library.ports.main',
                },
                {
                    xtype: 'settings.library.sof.main',
                },
                {
                    xtype: 'settings.library.expenses.main',
                },
                {
                    xtype: 'CostCenterMainContainer',
                },
                {
                    xtype: 'settings.library.cargoes.main',
                },
                {
                    xtype: 'settings.library.vessels.main',
                },
                {
                    xtype: 'settings.library.taxes.taxes.main',
                },
            ],
        },
        {
            xtype: 'ports.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{portsServerGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'cargoes.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{cargoesGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'vessels.right.card',
            hidden: true,
            showAnimation: 'slide',
            bind: {
                hidden: '{vesselsGrid.selection ? false : true}',
            },
        },
        {
            xtype: 'settings.library.port.files.info',
            showAnimation: {
                type: 'slide',
                direction: 'left',
            },
            hideAnimation: null,
            flex: 1,
            height: '100%',
            zIndex: 998,
            weight: 0,
            docked: 'right',
        },
        {
            xtype: 'settings.library.terminals.right.card',
        },
        {
            xtype: 'settings.library.berths.right.card',
        },
        {
            xtype: 'settings.library.holidays.right.card',
        },
        {
            xtype: 'taxes.right.card',
        },
        {
            xtype: 'ServiceRightPanel',
        },
        {
            xtype: 'CostCenterDetails',
            width: '100%',
            docked: 'right',
            hidden: true,
            bind: {
                hidden: '{costCenterGrid.selection ? false : true}',
            },
        },
    ],
});
