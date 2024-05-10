Ext.define('Abraxa.store.pda.PdaOfferServices', {
    extend: 'Ext.data.Store',
    alias: 'store.pda.offer.services',
    model: 'Abraxa.model.calculation.CalculationService',
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'pc/calculations/${calculation_id}/services',
        appendId: false,
        batchActions: true,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            allowSingle: false,
            rootProperty: 'data',
        },
    },
});
