Ext.define('Abraxa.model.portcall.Member', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'invitation_id',
            type: 'integer',
        },
        {
            name: 'object_id',
            type: 'integer',
        },
        {
            name: 'object_meta_id',
            type: 'integer',
        },
        {
            name: 'online',
            type: 'auto',
            defaultValue: 'offline',
        },
        {
            name: 'permissions',
        },
        {
            name: 'internal_chat_class',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'permissions',
            model: 'Abraxa.model.sharing.Permission',
            associationKey: 'permissions',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        appendId: false,
        url: Env.ApiEndpoint + 'member/${portcall_id}',
        writer: {
            allowSingle: false,
            rootProperty: 'members',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
