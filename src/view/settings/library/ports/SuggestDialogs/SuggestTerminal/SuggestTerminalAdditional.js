Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalAdditional', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalAdditional',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Additional Terminal Information',
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
                                    label: 'Water salinity',
                                    multiSelect: true,
                                    options: [
                                        {
                                            text: 'Salt',
                                            value: 'salt',
                                        },
                                        {
                                            text: 'Brackish',
                                            value: 'brackish',
                                        },
                                        {
                                            text: 'Fresh',
                                            value: 'fresh',
                                        },
                                    ],
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.info_salinity}',
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
                                    html: 'Water density',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.info_water_density_min}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-spacer',
                                            html: '',
                                        },
                                        {
                                            xtype: 'numberfield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.info_water_density_max}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'NOA deadline',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '00',
                                    bind: {
                                        value: '{record.info_noa_deadline}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'hours',
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
                                    label: 'Cargo manifest deadline',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Cargo manifest deadline',
                                    bind: {
                                        value: '{record.info_manifest_deadline}',
                                    },
                                    // Data attributes
                                    listeners: {
                                        initialize: function () {
                                            this.afterInputElement.set({
                                                'data-suffix': 'hours',
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
