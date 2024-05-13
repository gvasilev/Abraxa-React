

Ext.define('Abraxa.model.directory.Agents', {
    extend: 'Ext.data.Model',
    autoLoad: true,
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'name',
            // persist: false,
            type: 'string',
        },
        {
            name: 'ports_served',
            // persist: false,
            type: 'auto',
        },
        {
            name: 'country',
            // depends: 'ports_served',
            persist: false,
            mapping: function (data) {
                if (data && data.countries) return data.countries.country_name;
            },
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'profiles',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
