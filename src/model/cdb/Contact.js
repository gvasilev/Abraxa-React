Ext.define('Abraxa.model.cdb.Contact', {
    extend: 'Ext.data.Model',
    name: 'contact',
    alias: 'model.cdb-contact',

    fields: [
        {
            name: 'contact_id',
            type: 'auto',
        },
        {
            name: 'contact_first_name',
            type: 'auto',
        },
        {
            name: 'contact_last_name',
            type: 'auto',
        },
        {
            name: 'contact_full_name',
            type: 'auto',
        },
        {
            name: 'contact_created_by',
            type: 'auto',
        },
        {
            name: 'contact_record_owner',
            type: 'auto',
        },
        {
            name: 'contact_org_id',
            type: 'auto',
        },
        {
            name: 'contact_position',
            type: 'auto',
        },
        {
            name: 'contact_org_department',
            type: 'auto',
        },
        {
            name: 'contact_phone',
            type: 'auto',
        },
        {
            name: 'contact_mobile',
            type: 'auto',
        },
        {
            name: 'contact_email',
            type: 'auto',
            validators: 'email',
        },
        {
            name: 'contact_skype',
            type: 'auto',
        },
        {
            name: 'contact_description',
            type: 'auto',
        },
        {
            name: 'org_name',
            type: 'auto',
        },
        {
            name: 'id',
            convert: function (v, rec) {
                return rec.get('contact_id');
            },

            depends: ['contact_id'],

            // It should not be returned to the server - it's not a database field
            persist: false,
        },
        {
            name: 'is_checked',
            type: 'auto',
            persist: false,
        },
    ],
    idProperty: 'contact_id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'contacts',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
