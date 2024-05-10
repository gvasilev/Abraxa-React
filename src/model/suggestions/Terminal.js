Ext.define('Abraxa.model.suggestions.Terminal', {
    extend: 'Ext.data.Model',
    identifier: 'uuid',
    fields: [
        {
            name: 'submission_id',
            type: 'auto',
        },
        {
            name: 'uuid',
            type: 'auto',
        },
        {
            name: 'parent_uuid',
            type: 'auto',
        },
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'meta_name',
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
            allowNull: true,
        },
        {
            name: 'meta_isps',
            type: 'integer',
            defaultValue: 1,
            allowNull: true,
        },
        {
            name: 'info_work_days',
            depends: ['info_work_days_start', 'info_work_days_end'],
            convert: function (val, record) {
                return {
                    start: record.get('info_work_days_start'),
                    end: record.get('info_work_days_end'),
                };
            },
            type: 'auto',
        },
        {
            name: 'info_work_days_start',
            persist: false,
            type: 'string',
            allowNull: true,
        },
        {
            name: 'info_work_days_end',
            persist: false,
            type: 'string',
            allowNull: true,
        },
        {
            name: 'info_work_hours',
            depends: ['info_work_hours_start', 'info_work_hours_end'],
            convert: function (val, record) {
                let startValue = record.get('info_work_hours_start');
                let endValue = record.get('info_work_hours_end');
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
            name: 'info_work_hours_start',
            persist: false,
            type: 'date',
            allowNull: true,
        },
        {
            name: 'info_work_hours_end',
            persist: false,
            type: 'date',
            allowNull: true,
        },
        {
            name: 'info_overtime',
            type: 'boolean',
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
            name: 'restriction_max_beam',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_max_loa',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_max_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_channel_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_max_air_draft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_naabsa',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_daylight_navigation',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'restriction_tides',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'vessel_bulk',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_tanker',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_lng',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_container',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_cruise',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_roro',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_pleasure_craft',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_general_cargo',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'vessel_fishing',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'vessel_navy',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'vessel_special_purpose',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cargo_dangerous_goods',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'cargo_radioactive',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'livestock',
            type: 'boolean',
            allowNull: true,
        },
        {
            name: 'load_rate_bulk',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_liquid',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_lng',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_container',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_gas',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_roro',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_passengers',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'load_rate_livestock',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_bulk',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_liquid',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_cold_storage',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_gas',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_lng',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_container',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_roro',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'storage_capacity_livestock',
            type: 'number',
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
        url: Env.nomenclatureEndPoint + 'api/submission/v1/terminals/${submission_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
