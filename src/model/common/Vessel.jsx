import '../vessel/VesselCompliance';
import '../portcall/Attachment';

Ext.define('Abraxa.model.common.Vessel', {
    extend: 'Ext.data.Model',
    requires: ['Abraxa.model.vessel.VesselCompliance'],
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'imo',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'built',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
            convert: function (val, record) {
                if (val) return val.substring(0, 4);

                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'keel_laying_date',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            name: 'launching_date',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            name: 'registration_date',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            name: 'order_date',
            type: 'date',
            dateFormat: 'Y-m-d',
            dateWriteFormat: 'Y-m-d',
        },
        {
            name: 'vessel_type',
            depends: 'id',
            persist: false,
            mapping: function (data) {
                if (data && data.general_type) return data.general_type.name;
            },
        },
        {
            name: 'updated_at',
            type: 'auto',
            persist: false,
        },
        {
            name: 'is_verified',
            depends: ['updated_at'],
            persist: false,
            convert: function (val, record) {
                if (record.getCompliance() || record.get('compliance')) return true;

                return false;
            },
        },
    ],
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
    ],
    hasOne: [
        {
            model: 'Abraxa.model.vessel.VesselCompliance',
            name: 'compliance',
            associationKey: 'compliance',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'vessels',
        writer: {
            allowSingle: false,
            rootProperty: 'vessels',
            writeAllFields: true,
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
