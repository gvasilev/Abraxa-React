Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalLDRates', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalLDRates',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Loading and Discharging Rates',
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
                                    label: 'Bulk Cargo',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_bulk}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'tph',
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
                                    label: 'Liquid Cargo',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_liquid}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'tph',
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
                                    label: 'LNG',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_lng}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'm3/h',
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
                                    label: 'Containers',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_container}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'TEU/h',
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
                                    label: 'Gas',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_gas}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'm3/h',
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
                                    label: 'RoRo',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_roro}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'u/h',
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
                                    label: 'Passengers',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_passengers}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'p/h',
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
                                    label: 'Livestock',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.load_rate_livestock}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'u/h',
                                            });
                                        },
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
