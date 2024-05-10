Ext.define('Abraxa.store.adocs.SofTemplates', {
    extend: 'Ext.data.Store',
    alias: 'store.sof-templates',
    fields: [
        {
            name: 'id',
            type: 'number',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'template_id',
            type: 'number',
        },
        {
            name: 'company_id',
            type: 'number',
            defaultValue: 0,
        },
    ],
    data: [
        {
            name: 'Statement of facts',
            original_name: 'Statement of facts',
            template_id: 1,
            id: 1,
        },
        {
            name: 'Notice of readiness',
            original_name: 'Notice of readiness',
            slug: 'noticeOfReadiness',
            category: {
                type: 'operational',
                system_extension: 'nor',
            },
            can_combine: 0,
            template_id: 2,
            id: 2,
        },
        {
            name: 'WSS - SOF',
            original_name: 'Statement of facts - WSS',
            template_id: 1,
            id: 3,
            company_id: 1, // replace with WSS company
        },
    ],
    autoLoad: true,
    proxy: {
        type: 'memory',
    },
});
