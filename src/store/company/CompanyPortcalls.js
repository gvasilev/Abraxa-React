Ext.define('Abraxa.store.company.CompanyPortcalls', {
    extend: 'Ext.data.Store',
    alias: 'store.company_portcalls',
    model: 'Abraxa.model.portcall.Portcall',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations/${org_id}/portcalls/${month}',
        pageParam: false,
        startParam: false,
        limitParam: false,
    },
});
