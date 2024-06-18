import './TariffTableColumn';

Ext.define('Abraxa.model.calculator.TariffTable', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'integer' },
        { name: 'label', type: 'string' },
        { name: 'slug', type: 'string' },
        { name: 'pc_configuration_id', type: 'integer' },
    ],

    hasMany: [
        {
            name: 'columns',
            model: 'Abraxa.model.calculator.TariffTableColumn',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/${portSettingsId}/tables',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
