Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalRestrictions', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalRestrictions',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Restrictions',
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
                                    label: 'Max terminal beam',
                                    name: 'Max terminal beam',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_max_beam}',
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
                                    label: 'Max terminal LOA',
                                    name: 'Max terminal LOA',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_max_loa}',
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
                                    label: 'Max terminal draft',
                                    labelAlign: 'top',
                                    name: 'Max terminal draft',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_max_draft}',
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
                                    html: 'Channel Draft',
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
                                                value: '{record.restriction_min_channel_draft}',
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
                                                value: '{record.restriction_max_channel_draft}',
                                            },
                                        },
                                    ],
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
                                    label: 'Max terminal air draft',
                                    name: 'Air Draft',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_max_air_draft}',
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
                                    label: 'Tides',
                                    name: 'Tides',
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
                                        {
                                            text: 'Undefined',
                                            value: null,
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.restriction_tides}',
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
                    defaults: {
                        cls: 'a-field-container a-field-switch',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                            pack: 'space-between',
                        },
                    },
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'NAABSA',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{record.restriction_naabsa}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Daylight Navigation',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{record.restriction_daylight_navigation}',
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
