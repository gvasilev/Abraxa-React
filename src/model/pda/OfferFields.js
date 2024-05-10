Ext.define('Abraxa.model.pda.OfferFields', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pda/${pda_id}/offer_fields',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
