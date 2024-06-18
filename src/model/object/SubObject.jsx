import './ObjectComponents';

Ext.define('Abraxa.model.object.SubObject', {
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
            name: 'components',
            model: 'Abraxa.model.object.ObjectComponents',
        },
    ],
});
