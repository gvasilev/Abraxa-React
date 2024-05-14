Ext.define('Abraxa.model.adocs.DocumentFolderFile', {
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
            name: 'document_id',
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
        {
            name: 'approvals',
        },
        {
            type: 'auto',
            name: 'is_checked',
            persist: false,
        },
    ],
    // hasOne: [{
    //     name: 'document',
    //     model: 'Abraxa.model.document.Document',
    //     associationKey: 'document',
    //     // instanceName: 'document',
    // }],
    // hasMany: [{
    //     name: 'approvals',
    //     model: 'Abraxa.model.adocs.DocumentApproval',
    //     associationKey: 'approvals'
    // }],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'folders_files',
    },
});
