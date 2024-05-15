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
                return conditions;
            },
        },
        {
            name: 'disbursement_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'disbursementTypes') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'label',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'disbursementLabels') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'port',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'ports') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'port_function',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'portFunctions') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'disbursement_amount',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator != 'in') {
                                    value = condition.operator;
                                }
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'agency_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'agencyTypes') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'vessel_type',
            type: 'auto',
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'vesselTypes') {
                                value = condition.data;
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'disbursement_value_min',
            type: 'number',
            allowNull: true,
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator === 'between') {
                                    value = condition.data[0];
                                } else {
                                    value = condition.data;
                                }
                            }
                        });
                    }
                }
                return value;
            },
        },
        {
            name: 'disbursement_value_max',
            type: 'number',
            allowNull: true,
            persist: false,
            mapping: function (data) {
                let value = null;
                if (data && data.rules_data) {
                    if (data.rules_data.rules && data.rules_data.rules[0].conditions) {
                        Ext.Array.each(data.rules_data.rules[0].conditions, function (condition) {
                            if (condition.type === 'disbursementAmount') {
                                if (condition.operator === 'between') {
                                    value = condition.data[1];
                                }
                            }
                        });
                    }
                }
                return value;
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
                    if (data.rules_data.rules) {
                        if (data.rules_data.rules[0].conditions) {
                            count = data.rules_data.rules[0].conditions.length;
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
