import './RoleObject';

Ext.define('Abraxa.model.role.Role', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'parent_role_id',
            type: 'auto',
        },
    ],
    hasMany: [
        {
            name: 'roles_objects',
            model: 'Abraxa.model.role.RoleObject',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'companies/roles',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
        },
    },
});
