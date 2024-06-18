Ext.define('Abraxa.model.Appointment', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'vessel_imo',
            type: 'auto',
        },
        {
            name: 'vessel_name',
            type: 'auto',
        },
        {
            name: 'port_requested',
            type: 'auto',
        },
        {
            name: 'function',
            type: 'auto',
        },
        {
            name: 'eta',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'etb',
            type: 'auto',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'etc',
            type: 'auto',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'etd',
            type: 'auto',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'other_ports',
            type: 'auto',
        },
        {
            name: 'cargo',
            type: 'auto',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'status',
            type: 'auto',
        },
        {
            name: 'is_dry',
            type: 'string',
            allowNull: true,
        },
        {
            name: 'archived_reason',
            type: 'auto',
        },
        {
            name: 'archived_comment',
            type: 'auto',
        },
        {
            name: 'cancel_reason',
            type: 'auto',
        },
        {
            name: 'cancel_comments',
            type: 'auto',
        },
        {
            name: 'assigned_to_full_name',
            type: 'auto',
        },
        {
            name: 'date_created',
            type: 'auto',
        },
        {
            name: 'port_id',
            type: 'auto',
        },
        {
            name: 'party_company_id',
            type: 'auto',
        },
        {
            name: 'party_operator_id',
            type: 'auto',
        },
        {
            name: 'party_type_id',
            type: 'auto',
        },
        {
            name: 'inquiry_searchfield_index',
            type: 'auto',
        },
        {
            name: 'next_port',
            type: 'auto',
        },
        {
            name: 'next_port_eta',
            type: 'date',
            dateWriteFormat: 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'funded',
            type: 'auto',
        },
        {
            name: 'balance_status',
            type: 'auto',
        },
        {
            name: 'balance_last_updated_at',
            type: 'auto',
            dateWriteFormat: 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'balance_last_updated_by',
            type: 'int',
        },
        {
            name: 'cp_date',
            type: 'date',
            dateWriteFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
            dateFormat: AbraxaConstants.formatters.date.dayMonthYearSlashNoLeading,
        },
        {
            name: 'sort',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portal/channel/record',
    },
});
