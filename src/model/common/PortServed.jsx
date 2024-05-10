import Env from '../../env.jsx';

Ext.define('Abraxa.model.common.PortServed', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'port_id',
            type: 'auto',
        },
        {
            name: 'port_name',
            persist: false,
            convert: function (value, record) {
                if (record.get('port')) return record.get('port').name;
            },
        },
        {
            name: 'timezone',
            persist: false,
            convert: function (value, record) {
                if (record.get('port')) return record.get('port').time_zone;
            },
        },
    ],
    hasMany: [
        {
            name: 'terminals',
            model: 'Abraxa.model.common.Terminal',
            associationKey: 'terminals',
        },
        {
            name: 'berths',
            model: 'Abraxa.model.common.Berth',
            associationKey: 'berths',
        },
        {
            name: 'holidays',
            model: 'Abraxa.model.common.Holiday',
            associationKey: 'holidays',
        },
        {
            name: 'working_times',
            model: 'Abraxa.model.settings.port.WorkingTime',
            associationKey: 'working_times',
        },
        {
            name: 'port_services',
            model: 'Abraxa.model.settings.port.PortService',
            associationKey: 'port_services',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'ports_served',
    },
});
