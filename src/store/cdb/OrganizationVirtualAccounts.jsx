Ext.define('Abraxa.store.cdb.OrganizationVirtualAccounts', {
    extend: 'Ext.data.Store',
    alias: 'store.organizationVirtualAccounts',
    autoLoad: false,
    pageSize: 20,
    model: 'Abraxa.model.cdb.VirtualAccount',
    proxy: {
        type: 'rest',
        api: {
            update: Env.ApiEndpoint + 'cdb/${org_id}/virtual-accounts',
            create: Env.ApiEndpoint + 'cdb/${org_id}/virtual-accounts',
            destroy: Env.ApiEndpoint + 'cdb/${org_id}/virtual-accounts',
            read: Env.ApiEndpoint + 'organizations/${org_id}/virtual-accounts',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
