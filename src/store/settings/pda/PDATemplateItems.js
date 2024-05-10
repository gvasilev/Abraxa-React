Ext.define('Abraxa.store.settings.pda.PDATemplateItems', {
    extend: 'Ext.data.Store',
    alias: 'store.settings.pda.template.items',
    model: 'Abraxa.model.settings.pda.PDATemplateItem',
    autoLoad: false,
    autoSync: false,
    proxy: {
        type: 'rest',
        batchActions: true,
        batchOrder: 'destroy,update,create',
        appendId: false,
        url: Env.ApiEndpoint + 'pda_template_items/${pda_template_id}',
        writer: {
            writeAllFields: true,
            // allDataOptions: {
            //     persist: true,
            //     associated: true
            // },
            // partialDataOptions: {
            //     changes: true,
            //     critical: true,
            //     associated: true
            // }
        },
    },
    // grouper: {
    //     property: 'category',
    //     direction: 'DESC',
    //     sorterFn: function (a, b) {
    //         return a.get('id') < b.get('id') ? 1 : -1;
    //     }
    // },
    // sorters: [{
    //     property: 'id',
    //     direction: 'ASC'
    // }]
});
