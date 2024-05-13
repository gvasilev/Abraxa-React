
import '../../model/company/Company.jsx';
Ext.define('Abraxa.store.CompanyDatabase', {
    extend: 'Ext.data.Store',
    storeId: 'cdb',
    alias: 'store.organizations',
    model: 'Abraxa.model.company.Company',
    autoLoad: false,
    pageSize: 50,
    statefulFilters: true,
    remoteFilter: true,
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations',
        withCredentials: true,
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
    sorters: [
        {
            property: 'org_name',
        },
    ],
    grouper: {
        groupFn: function (record) {
            return record.get('abbr').toUpperCase();
        },
    },
});
