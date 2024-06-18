Ext.define('Abraxa.model.suggestions.Berth', {
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
            name: 'parent_uuid', //terminal id
            type: 'auto',
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
        },
        {
            name: 'meta_isps',
            type: 'integer',
            defaultValue: 1,
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
            name: 'restriction_berth_height',
            type: 'number',
            allowNull: true,
        },
        {
            name: 'restriction_wlthc.from',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'restriction_wlthc.to',
            type: 'auto',
            allowNull: true,
        },
        {
            name: 'restriction_other',
            type: 'auto',
            allowNull: true,
        },
    ],
    idProperty: 'submission_id',
    proxy: {
        type: 'rest',
        url: Env.nomenclatureEndPoint + 'api/submission/v1/berths/${submission_id}',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
