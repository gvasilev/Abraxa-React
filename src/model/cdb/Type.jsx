import Env from '../../env.jsx';

Ext.define('Abraxa.model.cdb.Type', {
    extend: 'Ext.data.Model',
    idProperty: 'org_t_id',
    fields: [
        {
            type: 'auto',
            name: 'org_t_id',
        },
        {
            type: 'string',
            name: 'org_t_company_id',
        },
        {
            type: 'string',
            name: 'org_t_name',
        },
    ],

    proxy: {
        type: 'rest',
        batchActions: true,
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'organizations/types',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
