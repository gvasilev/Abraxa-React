import Env from '../../env.jsx'; // Import Env from env.jsx
import '../../model/cdb/Department.jsx';

Ext.define('Abraxa.store.cdb.Departments', {
    extend: 'Ext.data.Store',
    alias: 'store.company-departments',
    model: 'Abraxa.model.cdb.Department',
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations/departments',
        writer: {
            allowSingle: false,
        },
    },
});
