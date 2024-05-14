Ext.define('Abraxa.model.sof.Remark', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'remark_title',
            type: 'auto',
        },
        {
            name: 'remark_text',
            type: 'auto',
        },
        {
            name: 'remark_text_plain',
            type: 'auto',
            persist: false,
            depends: 'remark_text',
            convert: function (val, record) {
                if (record.get('remark_text')) {
                    return record.get('remark_text').replaceAll(/<\/?[^>]+(>|$)/gi, '');
                }
                return '';
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/${sof_id}/remarks',
    },
});
