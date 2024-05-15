Ext.define('Abraxa.model.common.TimeZone', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'country_code',
            type: 'string',
        },
        {
            name: 'time_zone',
            type: 'string',
        },
        {
            name: 'time_zone_format',
            depends: 'time_zone',
            persist: false,
            type: 'string',
            mapping: function (data) {
                if (data.timezone) {
                    let offsetString = moment.tz(data.timezone).format('Z');
                    let offsetNumber = parseInt(offsetString.match(/([-+]\d+)/)[0], 10);
                    return offsetNumber;
                }
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'time_zones',
    },
});
