import '../settings/port/WorkingTime.jsx';
import '../settings/port/PortService.jsx';
Ext.define('Abraxa.model.common.Terminal', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'location',
            type: 'string',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'port_id',
            type: 'integer',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'terminals',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'terminals',
            writeAllFields: true,
        },
    },
    hasMany: [
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
    ],
});
