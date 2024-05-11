import Env from '../../env.jsx';

Ext.define('Abraxa.model.unit.DefaultUnit', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'type',
            type: 'string',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_unit',
    },
});
