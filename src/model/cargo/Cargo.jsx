import './CargoDocuments';
import './CargoAdditional';

Ext.define('Abraxa.model.cargo.Cargo', {
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
            name: 'da_berth_id',
            type: 'auto',
        },
        {
            name: 'function',
            type: 'auto',
        },
        {
            name: 'bl_quantity',
            type: 'auto',
        },
        {
            name: 'bl_unit',
            type: 'auto',
        },
        {
            name: 'quantity',
            type: 'auto',
        },
        {
            name: 'unit',
            type: 'auto',
        },
        {
            name: 'commodity_id',
            type: 'auto',
        },
        {
            name: 'charterer_id',
            type: 'auto',
        },
        {
            name: 'shipper_id',
            type: 'auto',
        },
        {
            name: 'nomination_id',
            type: 'auto',
        },
        {
            name: 'load_port_id',
            type: 'auto',
        },
        {
            name: 'load_port_name',
            type: 'auto',
        },
        {
            name: 'discharge_port_id',
            type: 'auto',
        },
        {
            name: 'discharge_port_name',
            type: 'auto',
        },
        {
            name: 'transshipment_from',
            type: 'auto',
        },
        {
            name: 'transshipment_from_name',
            type: 'auto',
        },
        {
            name: 'transshipment_to',
            type: 'auto',
        },
        {
            name: 'transshipment_to_name',
            type: 'auto',
        },
        {
            name: 'lightering_from',
            type: 'auto',
        },
        {
            name: 'lightering_from_name',
            type: 'auto',
        },
        {
            name: 'lightering_to',
            type: 'auto',
        },
        {
            name: 'lightering_to_name',
            type: 'auto',
        },
        {
            name: 'bl_number',
            type: 'auto',
        },
        {
            name: 'cp_date',
            type: 'date',
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'shipped_onboard',
            type: 'date',
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'bl_date',
            type: 'date',
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            type: 'auto',
            name: 'is_checked',
            persist: false,
        },
        {
            name: 'laycan_from',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'laycan_to',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'letter_of_credit_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'function_abbr',
            persist: false,
            depends: 'function',
            convert: function(v, record) {
                let str = '',
                    func = record.get('function');

                if (func) {
                    switch (func) {
                        case 'Loading':
                            str = 'L';
                            break;
                        case 'Discharging':
                            str = 'D';
                            break;
                        case 'Transshipment':
                            str = 'TS';
                            break;
                        case 'Lightering':
                            str = 'LT';
                            break;

                        default:
                            break;
                    }
                }
                return str;
            },
        },
    ],
    hasMany: [
        {
            name: 'documents',
            model: 'Abraxa.model.cargo.CargoDocument',
            associationKey: 'documents',
        },
        {
            name: 'cargo_additional_quantity',
            model: 'Abraxa.model.cargo.CargoAdditional',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        defaultExtraParams: true,
        appendId: false,
        url: Env.ApiEndpoint + 'portcall/${portcall_id}/cargo',
        writer: {
            allowSingle: false,
            rootProperty: 'cargoes',
            clientIdProperty: 'cargoId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
