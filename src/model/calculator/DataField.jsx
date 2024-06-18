Ext.define('Abraxa.model.calculator.DataField', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id', type: 'integer' },
        { name: 'slug', type: 'string' },
        { name: 'label', type: 'string' },
        { name: 'control', type: 'string' },
        { name: 'showStepper', type: 'boolean' },
        { name: 'step', type: 'integer' },
        { name: 'min', type: 'auto' },
        { name: 'max', type: 'auto' },
        { name: 'required', type: 'boolean' },
        { name: 'tooltip', type: 'string' },
        { name: 'order', type: 'integer', critical: true },
        { name: 'created_at', type: 'auto' },
        { name: 'updated_at', type: 'auto' },
        { name: 'created_by', type: 'auto' },
        { name: 'updated_by_user', type: 'auto', persist: false },
        {
            name: 'alias',
            type: 'string',
            convert: function (value, model) {
                return value ? value.toUpperCase() : value;
            },
        },
        { name: 'visibilityFormula', type: 'string' },
        { name: 'source', type: 'string', critical: true },
        {
            name: 'defaultValue',
            type: 'string',
            critical: true,
            convert: function (value, model) {
                return value !== '' ? value : null;
            },
        },
        { name: 'multiply', type: 'boolean' },
        { name: 'behaviour' },
        { name: 'disabled', type: 'boolean' },
        { name: 'validSources' },
        {
            name: 'sourceData',
            depends: [
                'sourceDataChoices',
                'sourceDataTableID',
                'sourceDataAxis',
                'sourceDataType',
                'sourceDataValueType',
            ],
            convert: function (value, model) {
                let source = model.get('source');
                let returnValue = null;

                switch (source) {
                    case 'manual':
                        returnValue = {
                            choices: model.get('sourceDataChoices'),
                        };
                        break;
                    case 'formula':
                        returnValue = {
                            choices: model.get('sourceDataChoices'),
                        };
                        break;
                    case 'tariff_table':
                        returnValue = {
                            tableId: model.get('sourceDataTableID'),
                            tableAxis: model.get('sourceDataAxis'),
                        };
                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        returnValue = {
                            type: model.get('sourceDataType'),
                            nomenclatureItemsType: model.get('sourceDataValueType'),
                        };
                        break;
                }

                return returnValue;
            },
        },
        { name: 'sourceDataChoices', persist: false, mapping: 'sourceData.choices' },
        { name: 'sourceDataTableID', persist: false, mapping: 'sourceData.tableId', type: 'integer' },
        { name: 'sourceDataAxis', persist: false, mapping: 'sourceData.tableAxis', type: 'string' },
        { name: 'sourceDataType', persist: false, mapping: 'sourceData.type' },
        { name: 'sourceDataValueType', persist: false, mapping: 'sourceData.nomenclatureItemsType' },

        {
            name: 'subFields',
            depends: [
                'prefix_control',
                'prefix_source',
                'prefix_sourceData',
                'prefix_defaultValue',
                'prefix_showStepper',
                'prefix_step',
                'prefix_min',
                'prefix_max',
                'suffix_control',
                'suffix_source',
                'suffix_sourceData',
                'suffix_defaultValue',
                'suffix_showStepper',
                'suffix_step',
                'suffix_min',
                'suffix_max',
            ],
            convert: function (value, model) {
                let returnValue = [];

                if (value) {
                    returnValue = value.slice();

                    let prefix = returnValue[0];
                    let suffix = returnValue[1];

                    if (prefix) {
                        prefix.control = model.get('prefix_control');
                        prefix.data.source = model.get('prefix_source');
                        prefix.data.sourceData = model.get('prefix_sourceData');
                        prefix.data.defaultValue =
                            model.get('prefix_defaultValue') !== '' ? model.get('prefix_defaultValue') : null;
                        prefix.data.showStepper = model.get('prefix_showStepper');
                        prefix.data.step = model.get('prefix_step');
                        prefix.data.min = model.get('prefix_min');
                        prefix.data.max = model.get('prefix_max');
                    }

                    if (suffix) {
                        suffix.control = model.get('suffix_control');
                        suffix.data.source = model.get('suffix_source');
                        suffix.data.sourceData = model.get('suffix_sourceData');
                        suffix.data.defaultValue =
                            model.get('suffix_defaultValue') !== '' ? model.get('suffix_defaultValue') : null;
                        suffix.data.showStepper = model.get('suffix_showStepper');
                        suffix.data.step = model.get('suffix_step');
                        suffix.data.min = model.get('suffix_min');
                        suffix.data.max = model.get('suffix_max');
                    }
                }

                return returnValue;
            },
        },

        {
            name: 'prefix_control',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].control;
                }
            },
        },
        {
            name: 'prefix_source',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.source;
                }
            },
        },
        {
            name: 'prefix_defaultValue',
            persist: false,
            type: 'string',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.defaultValue;
                }
            },
        },
        {
            name: 'prefix_showStepper',
            persist: false,
            type: 'boolean',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.showStepper;
                }
            },
        },
        {
            name: 'prefix_step',
            persist: false,
            type: 'integer',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.step;
                }
            },
        },
        {
            name: 'prefix_min',
            persist: false,
            type: 'auto',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.min;
                }
            },
        },
        {
            name: 'prefix_max',
            persist: false,
            type: 'auto',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.max;
                }
            },
        },
        {
            name: 'prefix_behaviour',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.behaviour;
                }
            },
        },
        {
            name: 'prefix_sourceData',
            depends: [
                'prefix_sourceDataChoices',
                'prefix_sourceDataTableID',
                'prefix_sourceDataAxis',
                'prefix_sourceDataType',
                'prefix_sourceDataValueType',
            ],
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[0].data.sourceData;
                }
            },
            convert: function (value, model) {
                let source = model.get('prefix_source');
                let returnValue = null;

                switch (source) {
                    case 'manual':
                        returnValue = {
                            choices: model.get('prefix_sourceDataChoices'),
                        };
                        break;
                    case 'formula':
                        returnValue = {
                            choices: model.get('prefix_sourceDataChoices'),
                        };
                        break;
                    case 'tariff_table':
                        returnValue = {
                            tableId: model.get('prefix_sourceDataTableID'),
                            tableAxis: model.get('prefix_sourceDataAxis'),
                        };
                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        returnValue = {
                            type: model.get('prefix_sourceDataType'),
                            nomenclatureItemsType: model.get('prefix_sourceDataValueType'),
                        };
                        break;
                }

                return returnValue;
            },
        },
        {
            name: 'prefix_sourceDataChoices',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[0].data.sourceData) {
                    return data.subFields[0].data.sourceData.choices;
                }
            },
        },
        {
            name: 'prefix_sourceDataTableID',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[0].data.sourceData) {
                    return data.subFields[0].data.sourceData.tableId;
                }
            },
        },
        {
            name: 'prefix_sourceDataAxis',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[0].data.sourceData) {
                    return data.subFields[0].data.sourceData.tableAxis;
                }
            },
        },
        {
            name: 'prefix_sourceDataType',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[0].data.sourceData) {
                    return data.subFields[0].data.sourceData.type;
                }
            },
        },
        {
            name: 'prefix_sourceDataValueType',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[0].data.sourceData) {
                    return data.subFields[0].data.sourceData.nomenclatureItemsType;
                }
            },
        },

        {
            name: 'suffix_control',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].control;
                }
            },
        },
        {
            name: 'suffix_source',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.source;
                }
            },
        },
        {
            name: 'suffix_defaultValue',
            persist: false,
            type: 'string',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.defaultValue;
                }
            },
        },
        {
            name: 'suffix_showStepper',
            persist: false,
            type: 'boolean',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.showStepper;
                }
            },
        },
        {
            name: 'suffix_step',
            persist: false,
            type: 'integer',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.step;
                }
            },
        },
        {
            name: 'suffix_min',
            persist: false,
            type: 'auto',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.min;
                }
            },
        },
        {
            name: 'suffix_max',
            persist: false,
            type: 'auto',
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.max;
                }
            },
        },
        {
            name: 'suffix_behaviour',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.behaviour;
                }
            },
        },
        {
            name: 'suffix_sourceData',
            depends: [
                'suffix_sourceDataChoices',
                'suffix_sourceDataTableID',
                'suffix_sourceDataAxis',
                'suffix_sourceDataType',
                'suffix_sourceDataValueType',
            ],
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields)) {
                    return data.subFields[1].data.sourceData;
                }
            },
            convert: function (value, model) {
                let source = model.get('suffix_source');
                let returnValue = null;

                switch (source) {
                    case 'manual':
                        returnValue = {
                            choices: model.get('suffix_sourceDataChoices'),
                        };
                        break;
                    case 'formula':
                        returnValue = {
                            choices: model.get('suffix_sourceDataChoices'),
                        };
                        break;
                    case 'tariff_table':
                        returnValue = {
                            tableId: model.get('suffix_sourceDataTableID'),
                            tableAxis: model.get('suffix_sourceDataAxis'),
                        };
                        break;
                    case 'nomenclature_regions':
                    case 'nomenclature_vessels':
                    case 'nomenclature_cargoes':
                        returnValue = {
                            type: model.get('suffix_sourceDataType'),
                            nomenclatureItemsType: model.get('suffix_sourceDataValueType'),
                        };
                        break;
                }

                return returnValue;
            },
        },
        {
            name: 'suffix_sourceDataChoices',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[1].data.sourceData) {
                    return data.subFields[1].data.sourceData.choices;
                }
            },
        },
        {
            name: 'suffix_sourceDataTableID',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[1].data.sourceData) {
                    return data.subFields[1].data.sourceData.tableId;
                }
            },
        },
        {
            name: 'suffix_sourceDataAxis',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[1].data.sourceData) {
                    return data.subFields[1].data.sourceData.tableAxis;
                }
            },
        },
        {
            name: 'suffix_sourceDataType',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[1].data.sourceData) {
                    return data.subFields[1].data.sourceData.type;
                }
            },
        },
        {
            name: 'suffix_sourceDataValueType',
            persist: false,
            mapping: function (data) {
                if (Array.isArray(data.subFields) && data.subFields[1].data.sourceData) {
                    return data.subFields[1].data.sourceData.nomenclatureItemsType;
                }
            },
        },
    ],
});
