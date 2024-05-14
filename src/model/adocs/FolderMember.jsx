Ext.define('Abraxa.model.adocs.FolderMember', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'document_folder_id',
            type: 'integer',
        },
        {
            name: 'member_id',
            type: 'integer',
        },
        {
            type: 'auto',
            name: 'created_at',
        },
        {
            type: 'auto',
            name: 'updated_at',
        },
        {
            type: 'auto',
            name: 'created_by',
        },
        {
            type: 'auto',
            name: 'updated_by',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'folder/${folder_id}/members',
        batchActions: true,
        appendId: false,
        writer: {
            allowSingle: false,
        },
    },
});
