Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortPilotage', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortPilotage',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Pilotage and Towage',
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left fs-14',
            listeners: {
                click: {
                    element: 'element',
                    fn: function fn() {
                        let component = this.component;
                        component.toggleCls('is-collapsed');
                        component.up('container').down('[cls~=a-collapsible-container]').toggleCls('is-collapsed');
                    },
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-form-container a-form-4cols',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Pilotage Requirement',
                                    name: 'Pilotage Requirement',
                                    labelAlign: 'top',
                                    required: true,
                                    options: [
                                        {
                                            text: 'Pilotage compulsory',
                                            value: 'pilotage compulsory',
                                        },
                                        {
                                            text: 'Pilotage advisable',
                                            value: 'pilotage advisable',
                                        },
                                        {
                                            text: 'Pilotage available',
                                            value: 'pilotage available',
                                        },
                                        {
                                            text: 'Not available',
                                            value: 'not available',
                                        },
                                        {
                                            text: 'Not required',
                                            value: 'not required',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Please select Pilotage Requirement',
                                    bind: {
                                        value: '{record.pilotage_requirement}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container a-field-multiple',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Pilotage Availability',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '00:00',
                                            bind: {
                                                value: '{record.pilotage_availability_start}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-spacer',
                                            html: '',
                                        },
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '24:00',
                                            bind: {
                                                value: '{record.pilotage_availability_end}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Pilotage Comments',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter comments',
                                    bind: {
                                        value: '{record.pilotage_comments}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-form-container a-form-4cols',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Towage Requirement',
                                    name: 'Towage Requirement',
                                    labelAlign: 'top',
                                    required: true,
                                    options: [
                                        {
                                            text: 'Towage compulsory',
                                            value: 'towage compulsory',
                                        },
                                        {
                                            text: 'Towage advisable',
                                            value: 'towage advisable',
                                        },
                                        {
                                            text: 'Towage available',
                                            value: 'towage available',
                                        },
                                        {
                                            text: 'Not available',
                                            value: 'not available',
                                        },
                                        {
                                            text: 'Not required',
                                            value: 'not required',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Please select Towage Requirement',
                                    bind: {
                                        value: '{record.towage_requirement}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container a-field-multiple',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Towage Availability',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '00:00',
                                            bind: {
                                                value: '{record.towage_availability_start}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-spacer',
                                            html: '',
                                        },
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '24:00',
                                            bind: {
                                                value: '{record.towage_availability_end}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Towage Comments',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter comments',
                                    bind: {
                                        value: '{record.towage_comments}',
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
