import './PortInfoTab/PortInfoMain';
import './TerminalsTab/TerminalsTab';
import './BerthsTab/BerthsTabMain';
import './HolidaysTab/HolidaysMain';
import './AgentsTab/AgentsMain';

Ext.define('Abraxa.view.directory.ports.PortDetailsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.PortDetailsViewModel',
    data: {
        subTab: null,
        subTabId: null,
    },
    stores: {
        tabXtypes: {
            data: [
                {
                    id: 0,
                    tabXtype: 'PortInfoMain',
                },
                {
                    id: 1,
                    tabXtype: 'TerminalsMain',
                },
                {
                    id: 2,
                    tabXtype: 'BerthsTabMain',
                },
                {
                    id: 3,
                    tabXtype: 'HolidaysMain',
                },
                {
                    id: 4,
                    tabXtype: 'AgentsMain',
                },
            ],
        },
        terminals: {
            source: '{object_record.terminals}',
        },
        berths: {
            source: '{object_record.berths}',
        },
        holidays: {
            source: '{object_record.holidays}',
        },
        agents: {
            source: '{object_record.agents}',
        },
        berthsPerTerminal: {
            source: '{berths}',
            filters: '{berthPerTerminalFilter}',
        },
    },
    formulas: {
        alternativeNames: {
            bind: '{object_record.meta_name_alternatives}',
            get: AbraxaFunctions.getAlternativeNames,
        },

        activeItemPerSubTab: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function (subTab) {
                let tabbar = Ext.ComponentQuery.query('[xtype=PortDetailsMainView]')[0].down('tabbar');
                let tabIndex = 0;
                if (tabbar.getItems().items && tabbar.getItems().items.length) {
                    Ext.Array.each(tabbar.getItems().items, function (item, index) {
                        if (item.hash === subTab) {
                            tabIndex = index;
                        }
                    });
                }
                if (!this.get('subTabId')) {
                    tabbar.setActiveTab(tabIndex);
                }
            },
        },
        activeItemPerTab: {
            bind: {
                bindTo: '{portInfoTabbar.activeTabIndex}',
                deep: true,
            },
            get: function (activeTab) {
                let xtype = null;
                let tabXtypes = this.get('tabXtypes');
                let tabXtypeRecord = tabXtypes.getById(activeTab);
                if (tabXtypeRecord) {
                    xtype = tabXtypeRecord.get('tabXtype');
                }

                if (xtype) {
                    return {
                        xtype: xtype,
                    };
                }
            },
        },
        badgeString: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function (tab) {
                if (tab === 'terminals') return 'terminal';
                if (tab === 'berths') return 'berth';
                return '';
            },
        },
        berthPerTerminalFilter: {
            bind: {
                badgeString: '{badgeString}',
                terminalId: '{subTabId}',
            },
            get: function (data) {
                if (data && data.badgeString && data.terminalId) {
                    let store = this.get('berthsPerTerminal');
                    if (store) store.clearFilter();
                    return function (rec) {
                        if (data.badgeString === 'terminal') {
                            if (rec.get('terminal_id') && rec.get('terminal_id') === data.terminalId) {
                                return true;
                            }
                        }
                    };
                } else {
                    return function () {
                        return false;
                    };
                }
            },
        },
        doDefaults: {
            bind: {
                bindTo: '{execPortDefaults}',
                deep: true,
            },
            get: function (rec) {
                if (rec) {
                    Ext.getCmp('main-viewport').setMasked(false);
                    return rec;
                }
            },
        },
        entranceCoordinates: {
            bind: '{object_record.coordinates_entrance}',
            get: (coordinates) => AbraxaFunctions.getCoordinatesString(coordinates),
        },
        fromToLoadLines: {
            bind: {
                bindTo: '{object_record.restriction_load_lines_summer}',
                deep: true,
            },
            get: function (loadLinesObject) {
                return AbraxaFunctions.getFromToStringValue(loadLinesObject, 'from', 'to', '');
            },
        },
        fromToPilotageAvailability: {
            bind: {
                bindTo: '{object_record.pilotage_availability}',
                deep: true,
            },
            get: function (data) {
                return AbraxaFunctions.getFromToStringValue(data, 'start', 'end', '');
            },
        },
        fromToTowageAvailability: {
            bind: {
                bindTo: '{object_record.towage_availability}',
                deep: true,
            },
            get: function (data) {
                return AbraxaFunctions.getFromToStringValue(data, 'start', 'end', '');
            },
        },
        getLoadLines: {
            bind: {
                loadLines: '{object_record.restriction_load_lines_summer}',
                fromTo: '{fromToLoadLines}',
            },
            get: function (loadLinesObject) {
                const season = loadLinesObject?.loadLines?.load_lines;
                const fromTo = loadLinesObject?.fromTo;
                if (!season || !fromTo) return AbraxaConstants.placeholders.emptySpan;
                const htmlString = `${season} / ${fromTo}`;
                return htmlString;
            },
        },
        getPortCountryBar: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portRecord) {
                const emptyValue = AbraxaConstants.placeholders.emptySpan;
                if (!portRecord) return emptyValue;
                const countryName = portRecord.get('meta_country_name') || emptyValue;
                return `<div class="a-header-info-title sm-title">Country</div><div class="a-header-info-value">${countryName}</div>`;
            },
        },
        getPortLocodeBar: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portRecord) {
                const emptyValue = AbraxaConstants.placeholders.emptySpan;
                if (!portRecord) return emptyValue;

                const locode = portRecord.get('meta_locode') || emptyValue;
                return `<div class="a-header-info-title sm-title">Locode</div><div class="a-header-info-value">${locode}</div>`;
            },
        },
        getPortTimezoneBar: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portRecord) {
                const emptyValue = AbraxaConstants.placeholders.emptySpan;
                if (!portRecord) return emptyValue;

                const timezone = portRecord.get('meta_time_zone') || emptyValue;
                return `<div class="a-header-info-title sm-title">Timezone</div><div class="a-header-info-value">${timezone}</div>`;
            },
        },

        getPortTitleBar: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portRecord) {
                let htmlString = '';
                if (portRecord) {
                    const portName = portRecord.get('name') || '';
                    const countryId = portRecord.get('meta_country_id') || '';
                    const portType = portRecord.get('meta_type') || '';
                    htmlString = `<div class="a-header-title">${portName}, ${countryId}</div><span class="a-status-badge a-status-md bg-light-blue">${portType}</span>`;
                }
                return htmlString;
            },
        },
        minMaxAnchorageDraft: {
            bind: {
                min: '{object_record.restriction_min_anchorage_draft}',
                max: '{object_record.restriction_max_anchorage_draft}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 1, 'm');
            },
        },
        minMaxChannelDraft: {
            bind: {
                min: '{object_record.restriction_min_channel_draft}',
                max: '{object_record.restriction_max_channel_draft}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 1, 'm');
            },
        },
        minMaxWaterDensity: {
            bind: {
                min: '{object_record.info_water_density_min}',
                max: '{object_record.info_water_density_max}',
            },
            get: function (data) {
                return AbraxaFunctions.getMinMaxValue(data, 'min', 'max', 3, '');
            },
        },
        portImg: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (port) {
                if (port) {
                    if (port.get('code')) {
                        return 'https://static.abraxa.com/ports/' + port.get('code') + '.jpg';
                    } else {
                        return 'https://static.abraxa.com/images/no-image-port.svg';
                    }
                }
            },
        },
        portCoordinates: {
            bind: '{object_record.center}',
            get: (coordinates) => AbraxaFunctions.getCoordinatesString(coordinates),
        },
        portInfoUpdated: {
            bind: '{object_record.updated_at}',
            get: function (date) {
                if (date) {
                    return date;
                }
            },
        },
        yesNoInfrastructureDrydock: {
            bind: '{object_record.infrastructure_drydock}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        pilotStationCoordinates: {
            bind: '{object_record.coordinates_pilot_station}',
            get: (coordinates) => AbraxaFunctions.getCoordinatesString(coordinates),
        },
        showRightCard: {
            bind: {
                bindTo: '{subTabId}',
                deep: true,
            },
            get: function (subTabId) {
                if (subTabId) {
                    Ext.ComponentQuery.query('[xtype=PortInfoRightCard]')[0].setHidden(false);
                } else {
                    Ext.ComponentQuery.query('[xtype=PortInfoRightCard]')[0].setHidden(true);
                }
            },
        },
        selectedRecord: {
            bind: {
                subTabId: '{subTabId}',
                terminalsCount: '{terminals.count}',
                berthsCount: '{berths.count}',
            },
            get: function (data) {
                if (data.subTabId) {
                    let store = this.get('terminals');
                    if (this.get('subTab') == 'berths') {
                        store = this.get('berths');
                    }
                    if (store) {
                        return store.getById(parseInt(data.subTabId));
                    }
                }
            },
        },
        selectionContent: {
            bind: {
                bindTo: '{subTab}',
                deep: true,
            },
            get: function (section) {
                if (section) {
                    Ext.ComponentQuery.query('[cls~=right_card_content]')[0].removeAll(true, false);
                    if (section === 'terminals') {
                        //return terminal right content
                        return {
                            xtype: 'TerminalsRightContent',
                        };
                    }
                    if (section === 'berths') {
                        //return berth right content
                        return {
                            xtype: 'BerthsRightContent',
                        };
                    }
                }
            },
        },
        // Boolean values with or without icons (green icons for Yes with positive meaning, red icons for No in negative sense, no icons for neutral answers);
        yesNoArmedGuards: {
            bind: '{object_record.restriction_armed_guards}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranes0_24Tons: {
            bind: '{object_record.cranes_0_24_tons}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranes25_49Tons: {
            bind: '{object_record.cranes_25_49_tons}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranes50_100Tons: {
            bind: '{object_record.cranes_50_100_tons}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranes100TonsPlus: {
            bind: '{object_record.cranes_100_tons_plus}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranesFloating: {
            bind: '{object_record.cranes_floating}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranesGantry: {
            bind: '{object_record.cranes_gantry}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranesGrainElevator: {
            bind: '{object_record.cranes_grain_elevator}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoCranesMobile: {
            bind: '{object_record.cranes_mobile}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoDaylightNavigation: {
            bind: '{object_record.restriction_daylight_navigation}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoDerattingCertificate: {
            bind: '{object_record.quarantine_deratt_cert}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoFirstPortOfEntry: {
            bind: '{object_record.restriction_first_port_of_entry}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadAnchor: {
            bind: '{object_record.load_offload_anchor}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadBerth: {
            bind: '{object_record.load_offload_berth}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadBuoy: {
            bind: '{object_record.load_offload_buoy}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadDolphin: {
            bind: '{object_record.load_offload_dolphin}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadFSRU: {
            bind: '{object_record.load_offload_fsru}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoLoadOffloadSPM: {
            bind: '{object_record.load_offload_spm}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoPiracy: {
            bind: '{object_record.restriction_piracy}',
            get: AbraxaFunctions.getYesNoWithoutIcon,
        },
        yesNoQuarantinePratique: {
            bind: '{object_record.quarantine_pratique}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSeca: {
            bind: '{object_record.restriction_seca}',
            get: AbraxaFunctions.getYesNoWithoutIcon,
        },
        yesNoServicesBunkering: {
            bind: '{object_record.services_bunkering}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesCrewChanges: {
            bind: '{object_record.services_crew_changes}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesDecontainerisation: {
            bind: '{object_record.services_decontainerisation}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesDegauss: {
            bind: '{object_record.services_degauss}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesDirtyBallast: {
            bind: '{object_record.services_dirty_ballast}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSercicesElectricalRepair: {
            bind: '{object_record.services_electrical_repair}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesEngineRepair: {
            bind: '{object_record.services_engine_repair}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesFumigation: {
            bind: '{object_record.services_fumigation}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesGarbageDisposal: {
            bind: '{object_record.services_garbage_disposal}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesInternet: {
            bind: '{object_record.services_internet}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesMedicalFacilities: {
            bind: '{object_record.services_medical_facilities}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesNavigationRepair: {
            bind: '{object_record.services_navigation_repair}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesSteam: {
            bind: '{object_record.services_steam}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesUnderwaterCleaning: {
            bind: '{object_record.services_underwater_cleaning}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesUnderwaterInspection: {
            bind: '{object_record.services_underwater_inspection}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoServicesWashWater: {
            bind: '{object_record.services_wash_water}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesDeck: {
            bind: '{object_record.supplies_deck}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesElectricity: {
            bind: '{object_record.supplies_electricity}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesEngine: {
            bind: '{object_record.supplies_engine}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesFuelOil: {
            bind: '{object_record.supplies_fuel_oil}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesProvisions: {
            bind: '{object_record.supplies_provisions}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesMedical: {
            bind: '{object_record.supplies_medical}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSuppliesWater: {
            bind: '{object_record.supplies_water}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoSwell: {
            bind: '{object_record.restriction_swell}',
            get: AbraxaFunctions.getYesNoWithoutIcon,
        },
        yesNoTides: {
            bind: '{object_record.restriction_tides}',
            get: AbraxaFunctions.getYesNoWithoutIcon,
        },
        yesNoUsRepresentative: {
            bind: '{object_record.info_us_representative}',
            get: AbraxaFunctions.getYesNoWithIcon,
        },
        yesNoWarArea: {
            bind: '{object_record.restriction_war_area}',
            get: AbraxaFunctions.getYesNoWithoutIcon,
        },
        waterSalinity: {
            bind: '{object_record.info_salinity}',
            get: function (salinity) {
                if (salinity && salinity[0]) {
                    return salinity[0];
                }
                return AbraxaConstants.placeholders.emptySpan;
            },
        },
    },
});
