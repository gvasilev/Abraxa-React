import Env from '../../env.jsx'; // Import Env from env.jsx

Ext.define('Abraxa.model.cdb.Department', {
    extend: 'Ext.data.Model',
    idProperty: 'dept_id',
    fields: [
        {
            type: 'auto',
            name: 'dept_id',
        },
        {
            type: 'string',
            name: 'dept_name',
            critical: true,
        },
        {
            type: 'string',
            name: 'dept_phone',
        },
        {
            type: 'string',
            name: 'dept_email',
        },
        {
            type: 'auto',
            name: 'dept_org_id',
            critical: true,
        },
        {
            type: 'date',
            name: 'updated_at',
        },
        {
            type: 'date',
            name: 'created_at',
        },
    ],

    proxy: {
        type: 'rest',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
        },
        url: Env.ApiEndpoint + 'organizations/${org_id}/departments',
        writer: {
            allowSingle: false,
            rootProperty: 'departments',
            clientIdProperty: 'departmentsId',
        },
    },
});
