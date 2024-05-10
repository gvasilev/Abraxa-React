Ext.define('Abraxa.store.common.DefaultUnits', {
    extend: 'Ext.data.Store',
    alias: 'store.default-units',
    autoLoad: true,
    model: 'Abraxa.model.unit.DefaultUnit',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'default_units',
    },
});
