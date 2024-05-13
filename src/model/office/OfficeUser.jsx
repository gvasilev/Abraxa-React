Ext.define('Abraxa.model.office.OfficeUser', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'office_id',
            type: 'integer',
        },
        {
            name: 'user_id',
            type: 'integer',
        },
    ],
    idProperty: 'id',
    hasOne: [
        {
            name: 'user',
            model: 'Abraxa.model.common.User',
            associatedKey: 'user',
            reference: 'user_id',
        },
    ],
});
