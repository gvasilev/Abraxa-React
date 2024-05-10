import Env from '../../env.jsx'; // Import Env from env.jsx
import '../../model/company/Company.jsx'; // Import 'src/model/company/Company.jsx

Ext.define('Abraxa.store.common.OrganizationsRemote', {
    extend: 'Ext.data.Store',
    alias: 'store.organizations.remote',
    model: 'Abraxa.model.company.Company',
    pageSize: 10,
    // leadingBufferZone: 5,
    autoDestroy: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations-remote',
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
    // sorters: {
    //     property: 'org_name'
    // },
    remoteFilter: true,
    // grouper: {
    //     groupFn: function (record) {
    //         return record.get('company_id');
    //     }
    // },
});
