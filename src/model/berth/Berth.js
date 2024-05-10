Ext.define('Abraxa.model.berth.Berth', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'da_inquiry_id',
            type: 'auto',
        },
        {
            name: 'berth_id',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'function',
            type: 'auto',
        },
        {
            name: 'isps',
            type: 'auto',
        },
        {
            name: 'arrival_drafts_fore',
            type: 'auto',
        },
        {
            name: 'arrival_drafts_fore_unit',
            type: 'auto',
        },
        {
            name: 'arrival_drafts_mean',
            type: 'auto',
        },
        {
            name: 'arrival_drafts_mean_unit',
            type: 'auto',
        },
        {
            name: 'arrival_drafts_aft',
            type: 'auto',
        },
        {
            name: 'departure_drafts_aft_unit',
            type: 'auto',
        },
        {
            name: 'departure_drafts_fore',
            type: 'auto',
        },
        {
            name: 'departure_drafts_fore_unit',
            type: 'auto',
        },
        {
            name: 'departure_drafts_mean',
            type: 'auto',
        },
        {
            name: 'departure_drafts_mean_unit',
            type: 'auto',
        },
        {
            name: 'departure_drafts_aft',
            type: 'auto',
        },
        {
            name: 'departure_drafts_aft_unit',
            type: 'auto',
        },
        {
            name: 'etb',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'etc',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'etd',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'berthed',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'completed',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'departed',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'sailed',
            type: 'auto',
        },
        {
            name: 'sort',
            type: 'auto',
        },
        {
            name: 'prospects',
            type: 'auto',
        },
        {
            name: 'side_alongside',
            type: 'auto',
        },
        {
            name: 'bolder_number',
            type: 'auto',
        },
        {
            name: 'etb_hours',
            type: 'auto',
        },
        {
            name: 'etc_hours',
            type: 'auto',
        },
        {
            name: 'etd_hours',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'auto',
        },
        {
            name: 'created_by',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'auto',
        },
        {
            name: 'updated_by',
            type: 'auto',
        },
        {
            name: 'berth_sequence',
            persist: false,
        },
    ],
    hasMany: [
        {
            name: 'cargoes',
            model: 'Abraxa.model.cargo.Cargo',
            associatedKey: 'id',
        },
        {
            name: 'services',
            model: 'Abraxa.model.berth.Service',
            associatedKey: 'id',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall/${portlog_id}/berth',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
