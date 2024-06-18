Ext.define('Abraxa.model.settings.workflows.Workflow', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'type',
            type: 'string',
        },
        {
            name: 'rules_data_response',
            persist: false,
            type: 'auto',
            depends: [
                'disbursement_type',
                'label',
                'port',
                'disbursement_amount',
                'agency_type',
                'vessel_type',
                'disbursement_value_min',
                'disbursement_value_max',
                'port_function',
                'invitation_companies',
            ],
            convert: function (value, record) {
                //push disbursement type value
                let conditions = [];
                conditions.push({
                    type: 'disbursementTypes',
                    operator: 'in',
                    data: record.get('disbursement_type') || null,
                });
                //push disbursement labels values
                conditions.push({
                    type: 'disbursementLabels',
                    operator: 'in',
                    data: record.get('label') || null,
                });
                //push ports values
                conditions.push({
                    type: 'ports',
                    operator: 'in',
                    data: record.get('port') || null,
                });
                //push port functions values
                conditions.push({
                    type: 'portFunctions',
                    operator: 'in',
                    data: record.get('port_function') || null,
                });
                //push disbursement amount values
                if (record.get('disbursement_amount') === 'between') {
                    let range = [record.get('disbursement_value_min'), record.get('disbursement_value_max')];
                    conditions.push({
                        type: 'disbursementAmount',
                        operator: record.get('disbursement_amount'),
                        data: range,
                    });
                } else {
                    conditions.push({
                        type: 'disbursementAmount',
                        operator: record.get('disbursement_amount') || 'in',
                        data: record.get('disbursement_value_min'),
                    });
                }
                //push agency types values
                conditions.push({
                    type: 'agencyTypes',
                    operator: 'in',
                    data: record.get('agency_type') || null,
                });
                //push vessel types values
                conditions.push({
                    type: 'vesselTypes',
                    operator: 'in',
                    data: record.get('vessel_type') || null,
                });

                //push companies values
                conditions.push({
                    type: 'companies',
                    operator: 'in',
                    data: record.get('invitation_companies') || null,
                });
                return conditions;
            },
        },
        {
            name: 'disbursement_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'disbursement_type');
                }
                return null;
            },
        },
        {
            name: 'label',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'label');
                }
                return null;
            },
        },
        {
            name: 'port',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'port');
                }
                return null;
            },
        },
        {
            name: 'port_function',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'port_function');
                }
                return null;
            },
        },
        {
            name: 'disbursement_amount',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'disbursement_amount');
                }
                return null;
            },
        },
        {
            name: 'agency_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'agency_type');
                }
                return null;
            },
        },
        {
            name: 'vessel_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'vessel_type');
                }
                return null;
            },
        },
        {
            name: 'disbursement_value_min',
            type: 'number',
            allowNull: true,
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'disbursement_value_min');
                }
                return null;
            },
        },
        {
            name: 'disbursement_value_max',
            type: 'number',
            allowNull: true,
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'disbursement_value_max');
                }
                return null;
            },
        },
        {
            name: 'approve_automatically',
            type: 'boolean',
        },
        {
            name: 'is_enabled',
            type: 'boolean',
            defaultValue: true,
            mapping: function (data) {
                return Boolean(data.is_enabled);
            },
        },
        {
            name: 'rules_count',
            type: 'integer',
            persist: false,
            mapping: function (data) {
                let count = 0;
                if (data && data.rules_data) {
                    let rulesData = data.rules_data;
                    if (rulesData.rules) {
                        if (rulesData.rules[0].conditions) {
                            count = rulesData.rules[0].conditions.length;
                        }
                    }
                }
                return count;
            },
        },
        {
            name: 'approvers',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (!data.approve_automatically) {
                    if (data && data.approvers_data && data.approvers_data.approvers) {
                        return data.approvers_data.approvers;
                    }
                    return [
                        {
                            roles: null,
                            override: false,
                        },
                    ];
                }
            },
        },
        {
            name: 'invitation_companies',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                if (data && data.rules_data) {
                    return Abraxa.utils.Functions.getWorkflowConditionValue(data.rules_data, 'invitation_companies');
                }
                return null;
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'approval-workflows',
        pageParam: false,
        startParam: false,
        limitParam: false,
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
