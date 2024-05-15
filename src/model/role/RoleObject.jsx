import '../object/Object.jsx';
Ext.define('Abraxa.model.role.RoleObject', {
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
    ],
    hasOne: [
        {
            name: 'object',
            model: 'Abraxa.model.object.Object',
        },
    ],
});
