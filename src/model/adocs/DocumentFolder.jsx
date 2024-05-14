import './DocumentFolderFile.jsx';
import './FolderMember.jsx';
Ext.define('Abraxa.model.adocs.DocumentFolder', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'auto',
            name: 'id',
        },
        {
            type: 'auto',
            name: 'name',
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
    hasMany: [
        {
            name: 'documents',
            model: 'Abraxa.model.adocs.DocumentFolderFile',
        },
        {
            name: 'members',
            model: 'Abraxa.model.adocs.FolderMember',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'folders',
    },
});
