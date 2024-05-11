import Env from "../../env.jsx";

Ext.define('Abraxa.model.common.Commodity', {
    extend: 'Ext.data.Model',

    fields: ['id', 'name', 'type', 'sf_from', 'sf_to'],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'commodities',
        writer: {
            allowSingle: false,
            rootProperty: 'commodities',
            writeAllFields: true,
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
            totalProperty: 'total',
        },
    },
});
