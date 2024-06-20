import './Terminals';
import './Berths';
import './Holidays';
import '../../company/Company';

Ext.define('Abraxa.model.directory.Ports', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'string',
        },
        {
            name: 'countries',
            type: 'auto',
        },
        {
            name: 'country',
            type: 'string',
            convert: function (value) {
                if (value) {
                    return value;
                }
                return null;
            },
        },
        {
            name: 'timezone',
            type: 'string',
            convert: function (value) {
                if (value && value != 'NULL') {
                    return value;
                }
                return null;
            },
        },
    ],
    hasMany: [
        {
            name: 'terminals',
            model: 'Abraxa.model.directory.ports.Terminals',
        },
        {
            name: 'berths',
            model: 'Abraxa.model.directory.ports.Berths',
        },
        {
            name: 'holidays',
            model: 'Abraxa.model.directory.ports.Holidays',
        },
        {
            name: 'agents',
            model: 'Abraxa.model.company.Company',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'port-info',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
