Ext.define('Abraxa.model.company.CustomComponent', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'customComponentId',
            type: 'string',
        },
        {
            name: 'customComponenHoldertId',
            type: 'string',
        },
        {
            name: 'customComponenHoldertId',
            type: 'string',
        },
        {
            name: 'config',
            convert: function (value) {
                return Ext.decode(value);
            },
        },
        {
            name: 'bind',
            convert: function (value) {
                return Ext.decode(value);
            },
        },
    ],
});
