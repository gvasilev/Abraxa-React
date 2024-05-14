import './Event.jsx';
import './Remark.jsx';
import './SofSignature.jsx';
Ext.define('Abraxa.model.sof.SOF', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'parent_id',
            type: 'auto',
        },
    ],
    hasMany: [
        {
            name: 'events',
            model: 'Abraxa.model.sof.Event',
            associatedKey: 'id',
        },
        {
            name: 'remarks',
            model: 'Abraxa.model.sof.Remark',
        },
        {
            name: 'signatures',
            model: 'Abraxa.model.sof.SofSignature',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'sof',
    },
});
