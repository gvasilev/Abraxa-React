Ext.define('Abraxa.model.calculator.Variable', {
    extend: 'Ext.data.Model',

    fields: [
        { name: 'id', type: 'integer' },
        { name: 'label', type: 'string' },
        { name: 'slug', type: 'string' },
        { name: 'control', type: 'string' },
        { name: 'formula', type: 'string' },
        { name: 'repeater' },
        { name: 'repeater_type', type: 'string' },
        { name: 'created_at', type: 'auto' },
        { name: 'updated_at', type: 'auto' },
        { name: 'created_by', type: 'auto' },
        { name: 'updated_by_user', type: 'auto', persist: false },

        { name: 'repeater_id', mapping: 'repeater.id', type: 'integer' },
    ],
});
