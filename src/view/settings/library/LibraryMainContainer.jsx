import './SharedCostCentersButton.jsx';
import './ports/PortsMainContainer.jsx';
import './sof/SofMainContainer.jsx';
import './expenses/ExpensesMainContainer.jsx';
import './costcenter/CostCenterMainContainer.jsx';
import './cargoes/CargoesMainContainer.jsx';
import './vessels/VesselsMainContainer.jsx';
import './taxes/TaxesMainContainer.jsx';
import './ports/PortsRightCard.jsx';
import './cargoes/CargoesRightCard.jsx';
import './vessels/VesselsRightCard.jsx';
import './ports/FilesInfo.jsx';
import './ports/TerminalsRightCard.jsx';
import './ports/BerthsRightCard.jsx';
import './ports/HolidaysRightCard.jsx';
import './taxes/TaxesRightCard.jsx';
import './expenses/ServiceRightPanel.jsx';
import './costcenter/CostCenterDetails.jsx';
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
            legacyPort: null,
            //hardcoded email for use Dimo Dimitrov to send submissions to nomenclature module
            //must be remove in feature!!
            userSubmissions: [
                'dimitrov@abraxa.com',
                'zapryanov@abraxa.com',
                'marin.zapryanov@gmail.com',
                'test503@abv.bg',
                'boyan.stoyanov@abraxa.com',
            ],
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
            portFlag: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port}',
                },
                get: function (port) {
                    if (port && port.flag_abv_2_letters) {
                        return 'https://static.abraxa.com/flags/1x1/' + port.flag_abv_2_letters.toLowerCase() + '.svg';
                    }
                },
            },

            point: {
                bind: {
                    bindTo: '{portsServerGrid.selection.port.point}',
                    deep: true,
                },
                get: function (point) {
                    if (point) {
                        return JSON.parse(point);
                    }
                },
            },
            lat: {
                bind: {
                    bindTo: '{point}',
                    deep: true,
                },
                get: function (point) {
                    if (point) return convertLatDDtoDMS(null, point.coordinates[1]);
                },
            },
            lon: {
                bind: {
                    bindTo: '{point}',
                    deep: true,
                },
                get: function (point) {
                    if (point) return convertLatDDtoDMS(null, point.coordinates[0]);
                },
            },
            portserveRecord: {
                bind: {
                    bindTo: '{portsServerGrid.selection}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        return record;
                    }
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
            terminalCollection: {
                bind: {
                    bindTo: '{legacyPort}',
                    deep: true,
                },
                get: function (legacyPort) {
                    if (legacyPort) {
                        return legacyPort.terminals;
                    }
                    return null;
                },
            },

            //Uncoment when BE is ready
            // selectedAgents: function (get) {
            //     const vm = this;
            //     Ext.Ajax.request({
            //         url: Env.ApiEndpoint + 'cost-structure-shares/',
            //         method: 'GET',
            //         headers: {
            //             Authorization: 'Bearer ' + localStorage.getItem('id_token'),
            //             'Content-Type': 'application/json',
            //         },
            //         jsonData: {},
            //         success: function (response) {
            //             const data = JSON.parse(response.responseText).data;
            //             vm.set('agentsCounts', data.length);
            //         },
            //         failure: function (response) {},
            //     });
            // },
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
                                            if (value && value.getText() == 'Services') {
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
