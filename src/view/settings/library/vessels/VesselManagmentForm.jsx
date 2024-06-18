Ext.define('Abraxa.view.settings.library.vessels.VesselManagmentForm', {
    extend: 'Ext.Container',
    xtype: 'vessel.main.managmentform',
    items: [
        {
            xtype: 'abraxa.container',
            bodyPadding: 0,
            margin: 0,
            items: [
                {
                    xtype: 'div',
                    html: '<h2>Management Info</h2>',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        // wrap: true
                    },
                    cls: 'a-vessel-input-data',

                    items: [
                        {
                            // Left
                            xtype: 'container',
                            layout: {
                                type: 'vbox',
                            },
                            flex: 1,
                            defaults: {
                                cls: 'vesselmodal',
                                labelWidth: 200,
                                clearable: false,
                                labelAlign: 'left',
                                placeholder: AbraxaConstants.placeholders.emptyValue,
                                ui: 'hovered-underline',
                            },
                            items: [
                                {
                                    label: 'Managing Owner',
                                    xtype: 'vessel.owners',
                                    bind: {
                                        value: '{vessel.managing_owner}',
                                        inputValue: '{vessel.managing_owner_data.name}',
                                    },
                                },
                                {
                                    label: 'Fleet',
                                    xtype: 'textfield',
                                    disabled: true,
                                    value: AbraxaConstants.placeholders.emptyValue,
                                },
                                {
                                    label: 'Group Owner',
                                    xtype: 'vessel.owners',
                                    bind: {
                                        value: '{vessel.group_owner}',
                                        inputValue: '{vessel.group_owner_data.name}',
                                    },
                                },
                                {
                                    label: 'Operator',
                                    xtype: 'vessel.owners',
                                    bind: {
                                        value: '{vessel.operator}',
                                        inputValue: '{vessel.operator_data.name}',
                                    },
                                },
                                {
                                    label: 'Registered Owner',
                                    xtype: 'vessel.owners',
                                    bind: {
                                        value: '{vessel.registered_owner}',
                                        inputValue: '{vessel.registered_owner_data.name}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
