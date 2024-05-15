Ext.define('Abraxa.model.sof.DefaultEvents', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'event_alias',
            type: 'auto',
            mapping: function (data) {
                if (data && data.alias) {
                    return data.alias.event_alias;
                }
            },
        },
        {
            name: 'reference',
            type: 'auto',
            mapping: function (data) {
                if (data && data.alias) {
                    return data.alias.reference;
                }
            },
        },
        {
            name: 'updated_by_user_alias',
            type: 'auto',
            mapping: function (data) {
                if (data && data.alias) {
                    return data.alias.updated_by_user;
                }
            },
        },
        {
            name: 'updated_at_alias',
            type: 'auto',
            mapping: function (data) {
                if (data && data.alias) {
                    return data.alias.updated_at;
                }
            },
        },
        {
            name: 'updated_at',
            type: 'date',
        },
        {
            name: 'search_index',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data) {
                    return this.buildSearchIndex(data);
                }
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof/default_events',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
