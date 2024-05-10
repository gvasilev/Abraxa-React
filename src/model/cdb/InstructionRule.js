Ext.define('Abraxa.model.cdb.InstructionRule', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'instruction_id',
            type: 'integer',
        },
        {
            name: 'property',
            type: 'string',
        },
        {
            name: 'condition',
            type: 'string',
        },
        {
            name: 'value',
            type: 'auto',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'cdb/${org_id}/instructions/${instruction_id}/rules',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'rules',
            clientIdProperty: 'instructionRulesId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
