Ext.define('Abraxa.model.invitation.Invitation', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'org_id',
            type: 'auto',
        },
        {
            name: 'org_name',
            type: 'string',
        },
        {
            name: 'org_phone',
            type: 'string',
        },
        {
            name: 'voyage_id',
            type: 'integer',
        },
        {
            name: 'invitable_type',
            critical: true,
            type: 'string',
        },
        {
            name: 'access_type',
            type: 'auto',
        },
        {
            name: 'invitable_id',
            critical: true,
            type: 'integer',
        },
        {
            name: 'invitation_role',
            type: 'auto',
        },
        {
            name: 'invitation_sent',
            type: 'integer',
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'invited_by',
            type: 'integer',
        },
        {
            name: 'tenant_id',
            type: 'integer',
        },
        {
            name: 'company_id',
            type: 'integer',
        },
        {
            name: 'color',
            type: 'auto',
        },
        {
            name: 'object_name',
            type: 'string',
            convert: function (v, record) {
                var object_id = record.get('object_id');
                if (object_id == 3) return 'appointment';

                return 'inquiry';
            },
        },
        {
            name: 'abbr',
            type: 'string',
            convert: function (v, record) {
                var company_name = record.get('org_name');
                var abbrArray = company_name.split(' ');
                var abbr = abbrArray[0][0];
                if (abbrArray[1]) abbr += abbrArray[1][0];
                return abbr;
            },
        },
        {
            name: 'new_object_id',
            type: 'integer',
            persist: false,
        },
        {
            name: 'status_order',
            persist: false,
            convert: function (v, record) {
                let order_id = 0;
                switch (record.get('status')) {
                    case 'Pending':
                        order_id = 1;
                        break;
                    case 'Accepted':
                        order_id = 2;
                        break;
                    case 'Declined':
                        order_id = 3;
                        break;
                    case 'Withdrawn':
                        order_id = 4;
                        break;
                    default:
                        order_id = 0;
                        break;
                }
                return order_id;
            },
        },
        {
            name: 'port_function',
            persist: false,
            mapping: function (data) {
                if (data.voyage && data.voyage.portcall && data.voyage.portcall.nomination)
                    return data.voyage.portcall.nomination.port_function;
            },
        },
    ],
    hasOne: [
        {
            name: 'voyage',
            model: 'Abraxa.model.voyage.Voyage',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'portcall-invitation',
    },
});
