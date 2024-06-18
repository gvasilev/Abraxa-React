import '../../model/company/Company';

Ext.define('Abraxa.store.common.OrganizationsRemote', {
    extend: 'Ext.data.Store',
    alias: 'store.organizations.remote',
    model: 'Abraxa.model.company.Company',
    pageSize: 10,
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
    remoteFilter: true,
});
