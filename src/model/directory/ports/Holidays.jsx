Ext.define('Abraxa.model.directory.Holidays', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
    ],
    idProperty: 'id',
});
