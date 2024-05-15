Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthRestrictions', {
    extend: 'Ext.Container',
    xtype: 'SuggestBerthRestrictions',
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
                                    label: 'Max berth beam',
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
                                    label: 'Max berth LOA',
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
                                    label: 'Max berth draft',
                                    labelAlign: 'top',
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
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Max berth air draft',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_max_air_draft}',
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
                            cls: 'a-field-container a-field-multiple',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Berth height',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '0.00',
                                    bind: {
                                        value: '{record.restriction_berth_height}',
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
                                    html: 'Water Line-To-Hatch Coaming',
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
                                            placeholder: '0.00',
                                            bind: {
                                                value: '{record.restriction_wlthc.from}',
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
                                            placeholder: '0.00',
                                            bind: {
                                                value: '{record.restriction_wlthc.to}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container a-field-switch',
                            layout: {
                                type: 'hbox',
                                align: 'center',
                                pack: 'space-between',
                            },
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
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'a-sep-form',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    cls: 'a-form-container',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Other',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter restrictions',
                                    bind: {
                                        value: '{record.restriction_other}',
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
