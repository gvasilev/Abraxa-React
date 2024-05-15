Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalMaxVessel', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalMaxVessel',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Max vessel size entries',
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
                                    xtype: 'numberfield',
                                    label: 'Bulk carriers',
                                    name: 'Bulk carriers',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_bulk}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Tankers',
                                    name: 'Tankers',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_tanker}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'LNG carriers',
                                    name: 'LNG carriers',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_lng}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Container ships',
                                    name: 'Container ships',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_container}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
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
                                    xtype: 'numberfield',
                                    label: 'Cruise ships',
                                    name: 'Cruise ships',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_cruise}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'RoRo vessels',
                                    name: 'RoRo vessels',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_roro}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Pleasure craft',
                                    name: 'Pleasure craft',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_pleasure_craft}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'General cargo ships',
                                    name: 'General cargo ships',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.vessel_general_cargo}',
                                    },
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'dwt',
                                            });
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-form',
                    html: '<hr>',
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
                                    label: 'Fishing ships',
                                    name: 'Fishing ships',
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Yes',
                                            value: true,
                                        },
                                        {
                                            text: 'No',
                                            value: false,
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.vessel_fishing}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Navy ships',
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Yes',
                                            value: true,
                                        },
                                        {
                                            text: 'No',
                                            value: false,
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.vessel_navy}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Special purpose vessels',
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Yes',
                                            value: true,
                                        },
                                        {
                                            text: 'No',
                                            value: false,
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.vessel_special_purpose}',
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
