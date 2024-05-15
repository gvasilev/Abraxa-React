Ext.define('Abraxa.model.rule.Rule', {
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
            name: 'team_id',
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
            depends: [
                'property',
                'port_value',
                'port_function_value',
                'office_value',
                'organization_value',
                'agency_type_value',
            ],
            type: 'auto',
            convert: function (val, record) {
                let type = record.get('property');
                switch (type) {
                    case 'port_id':
                        val = record.get('port_value');
                        break;
                    case 'port_function':
                        val = record.get('port_function_value');
                        break;
                    case 'principal_org_id':
                        val = record.get('organization_value');
                        break;
                    case 'agency_type':
                        val = record.get('agency_type_value');
                        break;
                    case 'appointing_party_email':
                        val = record.get('office_value');
                        break;

                    default:
                        val = null;
                        break;
                }
                return val;
            },
        },
        {
            name: 'port_names',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let portNames = [];
                if (data && data.property === 'port_id' && data.ports) {
                    Ext.Array.each(data.ports, function (port) {
                        portNames.push(port.name);
                    });
                }
                return portNames;
            },
        },
        {
            name: 'organization_names',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let organizationNames = [];
                if (data && data.property === 'principal_org_id' && data.organizations) {
                    Ext.Array.each(data.organizations, function (organization) {
                        organizationNames.push(organization.org_name);
                    });
                }
                return organizationNames;
            },
        },
        {
            name: 'office_names',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let officeNames = [];
                if (data && data.property === 'appointing_party_email' && data.offices) {
                    Ext.Array.each(data.offices, function (office) {
                        officeNames.push(office.office_name);
                    });
                }
                return officeNames;
            },
        },
        {
            name: 'port_value',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.property === 'port_id') {
                    return data.value;
                }
            },
        },
        {
            name: 'port_function_value',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.property === 'port_function') {
                    return data.value;
                }
            },
        },
        {
            name: 'office_value',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.property === 'appointing_party_email') {
                    return data.value;
                }
            },
        },
        {
            name: 'organization_value',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.property === 'principal_org_id') {
                    return data.value;
                }
            },
        },
        {
            name: 'agency_type_value',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.property === 'agency_type') {
                    return data.value;
                }
            },
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'team/${team_id}/rules',
        pageParam: false,
        startParam: false,
        limitParam: false,
        appendId: false,
        writer: {
            allowSingle: false,
            rootProperty: 'team_rules',
            clientIdProperty: 'teamRulesId',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
