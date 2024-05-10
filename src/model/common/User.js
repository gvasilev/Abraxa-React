Ext.define('Abraxa.model.common.User', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'first_name',
            type: 'string',
        },
        {
            name: 'last_name',
            type: 'string',
        },
        {
            name: 'email',
            type: 'string',
        },
        {
            name: 'auth0id',
            type: 'string',
        },
        {
            name: 'position',
            type: 'string',
        },
        {
            name: 'phone',
            type: 'string',
        },
        {
            name: 'skype',
            type: 'string',
        },
        {
            name: 'linked_in',
            type: 'string',
        },
        {
            name: 'current_company_id',
            type: 'integer',
        },
        {
            name: 'current_company_id',
            type: 'integer',
        },
        {
            name: 'old_role_id',
            type: 'integer',
            critical: true,
        },
        {
            name: 'profile_image',
            type: 'string',
        },
        {
            name: 'profile_image_url',
            type: 'string',
        },
        {
            name: 'notes',
            type: 'string',
        },
        {
            name: 'is_logged',
            type: 'boolean',
            persist: false,
        },
        {
            name: 'user_id',
            type: 'integer',
            depends: 'id',
            persist: false,
            convert: function (v, rec) {
                return rec.get('id');
            },
        },
        {
            name: 'previous_login',
            persist: false,
            convert: function (v, rec) {
                if (v) {
                    let newValue = JSON.parse(v);
                    newValue.time = new Date(newValue.time);
                    return newValue;
                }
            },
        },
        {
            name: 'update_user',
            type: 'date',
            persist: false,
        },
        {
            name: 'birthDay',
            type: 'date',
            dateWriteFormat: 'Y-m-d',
            dateFormat: 'Y-m-d',
        },
        {
            name: 'location',
            type: 'string',
        },
        {
            name: 'selected',
            persist: false,
        },
        {
            name: 'preferred_hub_agent',
            persist: false,
            type: 'auto',
        },
        {
            name: 'preferred_hub_agent_id',
            type: 'integer',
            depends: ['preferred_hub_agent'],
            persist: false,
            convert: function (val, record) {
                if (record && record.get('preferred_hub_agent')) {
                    return record.get('preferred_hub_agent').tenant_id;
                }
            },
        },
    ],
    hasOne: [
        {
            name: 'company',
            model: 'Abraxa.model.common.Company',
            associatedKey: 'company',
        },
        {
            name: 'office',
            model: 'Abraxa.model.office.Office',
            associatedKey: 'office',
        },
    ],
    hasMany: [
        {
            name: 'signatures',
            model: 'Abraxa.model.settings.company.EmailSignature',
            associatedKey: 'signatures',
        },
        {
            name: 'offices',
            model: 'Abraxa.model.common.UserOffices',
            associatedKey: 'offices',
        },
    ],

    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'users',
    },
});
