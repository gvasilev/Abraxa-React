Ext.define('Abraxa.model.calculator.TableSource', {
    extend: 'Ext.data.Model',

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/tables',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
