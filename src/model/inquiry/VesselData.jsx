Ext.define('Abraxa.model.inquiry.VesselData', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
        },
        {
            name: 'da_inquiry_id',
            type: 'int',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'beam',
            type: 'float',
        },
        {
            name: 'draft',
            type: 'float',
        },
        {
            name: 'dwt',
            type: 'float',
        },
        {
            name: 'gt',
            type: 'float',
        },
        {
            name: 'imo',
            type: 'int',
        },
        {
            name: 'lbp',
            type: 'float',
        },
        {
            name: 'loa',
            type: 'float',
        },
        {
            name: 'nt',
            type: 'float',
        },
    ],
});
