import '../portcall/Attachment';
import '../cdb/InstructionRule';

Ext.define('Abraxa.model.cdb.StandardInstructions', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'auto',
        },
        {
            name: 'title',
            type: 'string',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'org_id',
            type: 'number',
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
        },
        {
            name: 'rules',
            model: 'Abraxa.model.cdb.InstructionRule',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${org_id}/instructions',
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: true,
            },
        },
    },
});
