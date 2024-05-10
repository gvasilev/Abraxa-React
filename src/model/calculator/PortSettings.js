Ext.define('Abraxa.model.calculator.PortSettings', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'integer' },
        { name: 'name', mapping: 'port.name', type: 'string' },
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
            name: 'updated_by_user',
            type: 'auto',
            persist: false,
        },
    ],
});
