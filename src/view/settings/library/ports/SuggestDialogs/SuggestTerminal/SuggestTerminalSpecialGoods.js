Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalSpecialGoods', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalSpecialGoods',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Special Goods',
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
                                    label: 'Hazardous goods',
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
                                        value: '{record.cargo_dangerous_goods}',
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
                                    label: 'Radioactive goods',
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
                                        value: '{record.cargo_radioactive}',
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
                                    label: 'Livestock goods',
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
                                        value: '{record.livestock}',
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
