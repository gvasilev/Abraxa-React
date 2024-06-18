import '../common/User';
import '../rule/Rule';

Ext.define('Abraxa.model.team.Team', {
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
            name: 'description',
            type: 'string',
        },
        {
            name: 'auto_update',
            type: 'string',
            persist: false,
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'users',
            model: 'Abraxa.model.common.User',
            associatedKey: 'users',
        },
        {
            name: 'rules',
            model: 'Abraxa.model.rule.Rule',
            associatedKey: 'rules',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/teams',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'teams',
            clientIdProperty: 'teamId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
