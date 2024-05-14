Ext.define('Abraxa.model.sof.SofSignature', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'company_name',
            type: 'auto',
        },
        {
            name: 'signature_label',
            type: 'auto',
        },
        {
            name: 'is_default',
            type: 'boolean',
            defaultValue: false,
        },
        {
            name: 'is_manual_edit',
            type: 'boolean',
            defaultValue: false,
        },
        {
            name: 'disabled',
            type: 'boolean',
            defaultValue: false,
        },
        {
            name: 'type',
            type: 'auto',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/${sof_id}/signatures',
    },
});
