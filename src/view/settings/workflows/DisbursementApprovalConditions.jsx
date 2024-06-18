Ext.define('Abraxa.view.settings.workflows.DisbursementApprovalConditions', {
    extend: 'Ext.Container',
    xtype: 'DisbursementApprovalConditions',
    padding: 32,
    hidden: true,
    cls: 'a-dialog-card',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            html: 'Approval conditions',
        },
        {
            xtype: 'div',
            cls: 'h3',
            html: 'Choose conditions',
        },
        {
            xtype: 'container',
            cls: 'a-dialog-card-form',
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'selectfield',
                    label: 'Disbursement type',
                    multiSelect: true,
                    options: [
                        {
                            value: 'pda',
                            text: 'PDA',
                        },
                        {
                            value: 'dda',
                            text: 'DDA',
                        },
                        {
                            value: 'fda',
                            text: 'FDA',
                        },
                        {
                            value: 'sda',
                            text: 'SDA',
                        },
                    ],
                    bind: {
                        value: '{workflow.disbursement_type}',
                        placeholder: '{workflow.disbursement_type ? "":"All types"}',
                    },
                    cls: 'a-field-icon icon-rounded icon-short',
                },
                {
                    xtype: 'selectfield',
                    label: 'Disbursement label',
                    cls: 'a-field-icon icon-rounded icon-label',
                    multiSelect: true,
                    displayField: 'tag_name',
                    valueField: 'tag_name',
                    store: {
                        type: 'default.disbursement.tags',
                        autoLoad: true,
                    },
                    bind: {
                        value: '{workflow.label}',
                        placeholder: '{workflow.label ? "":"All labels"}',
                    },
                },
                {
                    xtype: 'portRemoteCombo',
                    label: 'Port',
                    id: 'port',
                    cls: 'a-field-icon icon-rounded icon-port',
                    multiSelect: true,
                    forceSelection: true,
                    bind: {
                        value: '{workflow.port}',
                        placeholder: '{workflow.port ? "":"All ports"}',
                    },
                    listeners: {
                        painted: function (me) {
                            var store = me.getStore();
                            store.getProxy().setExtraParams({});
                            if (me.upVM().get('workflow').get('port')) {
                                store.getProxy().setExtraParams({
                                    ports: JSON.stringify(me.upVM().get('workflow').get('port')),
                                });
                            }
                            store.load({
                                callback: function (records, operation, success) {
                                    if (success) {
                                        me.setValue(me.upVM().get('workflow').get('port'));
                                    }
                                },
                            });
                        },
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Port call function',
                    cls: 'a-field-icon icon-rounded icon-short',
                    forceSelection: true,
                    multiSelect: true,
                    queryMode: 'local',
                    valueField: 'name',
                    displayField: 'name',
                    bind: {
                        value: '{workflow.port_function}',
                        placeholder: '{workflow.port_function ? "":"All functions"}',
                    },
                    store: {
                        type: 'berth.function',
                    },
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    padding: '2 0',
                    defaults: {
                        clearable: false,
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                        flex: 1,
                    },
                    items: [
                        {
                            xtype: 'selectfield',
                            label: 'Disbursement amount',
                            reference: 'disbursementAmount',
                            placeholder: 'Any amount',
                            value: 'Less than or equals to',
                            cls: 'a-prepend a-field-icon icon-rounded icon-short',
                            minWidth: 420,
                            options: [
                                {
                                    text: 'Less than or equals to',
                                    value: 'less_than_or_equals',
                                },
                                {
                                    text: 'Greater than',
                                    value: 'greater_than',
                                },
                                {
                                    text: 'Range',
                                    value: 'between',
                                },
                            ],
                            bind: {
                                value: '{workflow.disbursement_amount}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            cls: 'a-append',
                            label: false,
                            placeholder: '00.00',
                            hidden: false,
                            bind: {
                                hidden: '{workflow.disbursement_amount ? false:true}',
                                value: '{workflow.disbursement_value_min}',
                            },
                        },
                        {
                            xtype: 'numberfield',
                            cls: 'a-append',
                            label: false,
                            placeholder: '00.00',
                            hidden: true,
                            bind: {
                                value: '{workflow.disbursement_value_max}',
                                hidden: '{disbursementAmount.selection.value == "between" ? false:true}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'selectfield',
                    label: 'Agency type',
                    cls: 'a-field-icon icon-rounded icon-short',
                    forceSelection: true,
                    clearable: true,
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'id',
                    multiSelect: true,
                    bind: {
                        store: '{agencyTypes}',
                        value: '{workflow.agency_type}',
                        placeholder: '{workflow.agency_type ? "" : "All agency types"}',
                    },
                },
                {
                    xtype: 'vesseltype.combo',
                    label: 'Vessel type',
                    cls: 'a-field-icon icon-rounded icon-short',
                    multiSelect: true,
                    bind: {
                        value: '{workflow.vessel_type}',
                        placeholder: '{workflow.vessel_type ? "" : "All vessel types"}',
                    },
                },
            ],
        },
    ],
});
