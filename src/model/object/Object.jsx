import './SubObject.jsx';
Ext.define('Abraxa.model.object.Object', {
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
    hasMany: [
        {
            name: 'sub_objects',
            model: 'Abraxa.model.object.SubObject',
        },
    ],
});
