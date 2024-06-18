Ext.define('Abraxa.model.suggestions.Port', {
    extend: 'Ext.data.Model',
    identifier: 'uuid',
    fields: [
        {
            name: 'submission_id',
            type: 'auto',
        },
        {
            name: 'uuid',
            critical: true,
            type: 'auto',
        },
        {
            name: 'meta_name',
            type: 'string',
        },
        {
            name: 'meta_locode',
            type: 'string',
        },
        {
            name: 'meta_name_alternatives',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'meta_type',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'meta_status',
            type: 'string',
            defaultValue: 'Operational',
        },
        {
            name: 'meta_region',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'meta_subregion',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'meta_country_id',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'meta_country_name',
            type: 'string',
        },
        {
            name: 'meta_subdivision',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'meta_isps',
            type: 'integer',
            defaultValue: 1,
        },
        {
            name: 'meta_time_zone',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'restriction_load_lines_summer',
            depends: ['load_lines', 'load_lines_start', 'load_lines_end'],
            convert: function (val, record) {
                let startValue = record.get('load_lines_start');
                let endValue = record.get('load_lines_start');
                if (startValue) {
                    startValue = Ext.Date.format(startValue, 'd M');
                }
                if (endValue) {
                    endValue = Ext.Date.format(endValue, 'd M');
                }
                return {
                    load_lines: record.get('load_lines'),
                    from: startValue,
                    to: endValue,
                };
            },
            type: 'auto',
        },
        {
            name: 'load_lines',
            persist: false,
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'load_lines_start',
            persist: false,
            type: 'date',
            allowNull: true,
        },
        {
            name: 'load_lines_end',
            persist: false,
            type: 'date',
            allowNull: true,
        },
        {
            name: 'coordinates_center',
            depends: ['coordinates_center_latitude', 'coordinates_center_longitude'],
            convert: function (val, record) {
                return {
                    latitude: record.get('coordinates_center_latitude'),
                    longitude: record.get('coordinates_center_longitude'),
                };
            },
            type: 'auto',
        },
        {
            name: 'coordinates_center_latitude',
            persist: false,
            type: 'number',
            allowNull: true,
        },
        {
            name: 'coordinates_center_longitude',
            persist: false,
            type: 'number',
            allowNull: true,
        },
        {
            name: 'coordinates_entrance',
            depends: ['coordinates_entrance_latitude', 'coordinates_entrance_longitude'],
            convert: function (val, record) {
                return {
                    latitude: record.get('coordinates_entrance_latitude'),
                    longitude: record.get('coordinates_entrance_longitude'),
                };
            },
            type: 'auto',
        },
        {
            name: 'coordinates_entrance_latitude',
            persist: false,
            type: 'number',
            allowNull: true,
        },
        {
            name: 'coordinates_entrance_longitude',
            persist: false,
            type: 'number',
            allowNull: true,
        },
        {
            name: 'coordinates_pilot_station',
            depends: ['coordinates_pilot_station_latitude', 'coordinates_pilot_station_longitude'],
            convert: function (val, record) {
                return {
                    latitude: record.get('coordinates_pilot_station_latitude'),
                    longitude: record.get('coordinates_pilot_station_longitude'),
                };
            },
            type: 'auto',
        },
        {
            name: 'coordinates_pilot_station_latitude',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'coordinates_pilot_station_longitude',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'info_harbour_size',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'info_harbour_type',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'info_salinity',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'info_water_density_min',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'info_water_density_max',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_min_anchorage_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_max_anchorage_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'info_noa_deadline',
            type: 'integer',
            allowNull: true,
        },
        {
            name: 'info_manifest_deadline',
            type: 'integer',
            allowNull: true,
        },
        {
            name: 'info_us_representative',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'pilotage_requirement',
            type: 'string',
        },
        {
            name: 'pilotage_availability',
            depends: ['pilotage_availability_start', 'pilotage_availability_end'],
            convert: function (val, record) {
                let startValue = record.get('pilotage_availability_start');
                let endValue = record.get('pilotage_availability_end');
                if (startValue) {
                    startValue = Ext.Date.format(startValue, 'H:i');
                }
                if (endValue) {
                    endValue = Ext.Date.format(endValue, 'H:i');
                }
                return {
                    start: startValue,
                    end: endValue,
                };
            },
            type: 'auto',
        },
        {
            name: 'pilotage_availability_start',
            type: 'date',
            persist: false,
            dateFormat: 'H:i',
            allowNull: true,
        },
        {
            name: 'pilotage_availability_end',
            type: 'date',
            persist: false,
            dateFormat: 'H:i',
            allowNull: true,
        },
        {
            name: 'pilotage_comments',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'towage_requirement',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'towage_availability',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'towage_availability',
            depends: ['towage_availability_start', 'towage_availability_end'],
            convert: function (val, record) {
                let startValue = record.get('towage_availability_start');
                let endValue = record.get('towage_availability_end');
                if (startValue) {
                    startValue = Ext.Date.format(startValue, 'H:i');
                }
                if (endValue) {
                    endValue = Ext.Date.format(endValue, 'H:i');
                }
                return {
                    start: startValue,
                    end: endValue,
                };
            },
            type: 'auto',
        },
        {
            name: 'towage_availability_start',
            type: 'date',
            persist: false,
            dateFormat: 'H:i',
            allowNull: true,
        },
        {
            name: 'towage_availability_end',
            type: 'date',
            persist: false,
            dateFormat: 'H:i',
            allowNull: true,
        },
        {
            name: 'towage_comments',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'restriction_channel_draft',
            type: 'number',
            allowNull: true,
        },

        {
            name: 'restriction_anchorage_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_inl',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'restriction_swell',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_piracy',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_war_area',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_seca',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_tides',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_first_port_of_entry',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_armed_guards',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'quarantine_pratique',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'quarantine_deratt_cert',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_daylight_navigation',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'quarantine_crew_vaccination',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'quarantine_other',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'load_offload_berth',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_offload_anchor',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_offload_buoy',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_offload_dolphin',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_offload_spm',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_offload_fsru',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_mobile',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_floating',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_grain_elevator',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_gantry',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_0_24_tons',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_25_49_tons',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_50_100_tons',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cranes_100_tons_plus',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_internet',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_medical_facilities',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_garbage_disposal',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_degauss',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_dirty_ballast',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_steam',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_wash_water',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_fumigation',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_underwater_inspection',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_underwater_cleaning',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_decontainerisation',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_navigation_repair',
            type: 'boolean',
            allowNull: true,
            allowNull: true,
        },
        {
            name: 'services_electrical_repair',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_engine_repair',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_bunkering',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'services_crew_changes',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_provisions',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_medical',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_water',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_fuel_oil',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_deck',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_engine',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'supplies_electricity',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'infrastructure_drydock',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_min_channel_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_max_channel_draft',
            type: 'number',
            allowNull: true,
        },
    ],
    idProperty: 'submission_id',
    proxy: {
        type: 'rest',
        url: Env.nomenclatureEndPoint + 'api/submission/v1/ports/${submission_id}',
        withCredentials: true,
        useDefaultXhrHeader: false,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
