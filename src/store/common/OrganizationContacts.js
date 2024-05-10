Ext.define('Abraxa.store.common.OrganizationContacts', {
    extend: 'Ext.data.Store',
    alias: 'store.organization.contacts',
    autoLoad: false,
    model: 'Abraxa.model.cdb.Contact',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'contacts',
    },
});
