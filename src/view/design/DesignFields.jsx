Ext.define('Abraxa.view.design.DesignFields', {
    extend: 'Ext.Container',
    xtype: 'design.fields',
    items: [
        {
            xtype: 'container',
            cls: 'a-design-header',
            padding: '16 0',
            layout: {
                type: 'hbox',
                align: 'middle',
            },
            defaults: {
                xtype: 'div',
            },
            items: [
                {
                    cls: 'h1 a-collapsible-trigger',
                    id: 'trigger_2',
                    minWidth: 360,
                    html: '<span>Fields</span>',
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                Ext.getCmp('collapsible_2').toggleCls('is-collapsed');
                                Ext.getCmp('trigger_2').toggleCls('is-collapsed');
                            },
                        },
                    },
                },
                {
                    cls: 'h5',
                    flex: 2,
                    html: 'Examples',
                },
                {
                    cls: 'h5',
                    flex: 1.5,
                    html: 'Usage',
                },
            ],
        },
        {
            xtype: 'container',
            id: 'collapsible_2',
            cls: 'a-collapsible-container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Underline</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Horizontal label',
                                    labelAlign: 'left',
                                    maxWidth: 440,
                                    ui: 'hovered-underline',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Horizontal label', labelAlign: 'left', ui: 'hovered-underline', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text'}</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Underline</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Horizontal label',
                                    labelAlign: 'left',
                                    maxWidth: 440,
                                    ui: 'hovered-underline',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Horizontal label', labelAlign: 'left', ui: 'hovered-underline', cls: 'a-field-icon icon-short icon-rounded', clearable: false, placeholder: 'Placeholder text'}</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Classic</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Horizontal label',
                                    labelAlign: 'left',
                                    maxWidth: 440,
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-port',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Horizontal label', labelAlign: 'left', ui: 'classic hovered-border', cls: 'a-field-icon icon-port icon-rounded', clearable: false, placeholder: 'Placeholder text'}</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Classic</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Horizontal label',
                                    labelAlign: 'left',
                                    maxWidth: 440,
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-person icon-rounded',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Horizontal label', labelAlign: 'left', ui: 'classic hovered-border', cls: 'a-field-icon icon-person icon-rounded', clearable: false, placeholder: 'Placeholder text'}</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Classic</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Horizontal label',
                                    labelAlign: 'left',
                                    maxWidth: 440,
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Horizontal label', labelAlign: 'left', ui: 'classic', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text'}</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Underline</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Vertical label placeholder',
                                    maxWidth: 320,
                                    ui: 'hovered-underline',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Vertical label placeholder', maxWidth: 320, ui: 'hovered-underline', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Underline</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Vertical label',
                                    labelAlign: 'top',
                                    maxWidth: 320,
                                    ui: 'hovered-underline',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Vertical label', labelAlign: 'top', maxWidth: 320, ui: 'hovered-underline', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Hovered / Classic</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Vertical label',
                                    labelAlign: 'top',
                                    maxWidth: 320,
                                    ui: 'hovered-border classic',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Vertical label', labelAlign: 'top', maxWidth: 320, ui: 'hovered-border classic', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Classic</span>',
                        },
                        {
                            xtype: 'container',
                            padding: '0 0 12 0',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Vertical label',
                                    labelAlign: 'top',
                                    maxWidth: 320,
                                    ui: 'classic',
                                    cls: 'a-field-icon icon-short',
                                    clearable: false,
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', label: 'Vertical label', labelAlign: 'top', maxWidth: 320, ui: 'hovered-underline', cls: 'a-field-icon icon-short', clearable: false, placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Outlined / Large</span>',
                        },
                        {
                            xtype: 'container',
                            padding: '0 0 16 0',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    ui: 'outlined field-lg',
                                    cls: 'a-field-icon icon-short',
                                    maxWidth: 320,
                                    clearable: false,
                                    label: 'Label',
                                    labelAlign: 'top',
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', ui: 'outlined field-lg', cls: 'a-field-icon icon-short', maxWidth: 320, clearable: false, label: 'Label', labelAlign: 'top', placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Field - Filled</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'textfield',
                                    ui: 'filled',
                                    cls: 'a-field-icon icon-short',
                                    maxWidth: 320,
                                    clearable: false,
                                    label: 'Label',
                                    labelAlign: 'top',
                                    placeholder: 'Placeholder text',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'textfield', ui: 'filled', cls: 'a-field-icon icon-short', maxWidth: 320, clearable: false, label: 'Label', labelAlign: 'top', placeholder: 'Placeholder text' }</code>",
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-design-row',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            minWidth: 360,
                            cls: 'h3 m-0',
                            html: '<span class="pl-52 c-blue">Permissions denied</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            height: 100,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-no-permissions',
                                    padding: 16,
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-no-permissions-inner',
                                            html: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="20" cy="20" r="20" fill="#0078D7" fill-opacity="0.08"/> <path d="M26 16H25V14C25 11.24 22.76 9 20 9C17.24 9 15 11.24 15 14V16H14C12.9 16 12 16.9 12 18V28C12 29.1 12.9 30 14 30H26C27.1 30 28 29.1 28 28V18C28 16.9 27.1 16 26 16ZM17 14C17 12.34 18.34 11 20 11C21.66 11 23 12.34 23 14V16H17V14ZM26 28H14V18H26V28ZM20 25C21.1 25 22 24.1 22 23C22 21.9 21.1 21 20 21C18.9 21 18 21.9 18 23C18 24.1 18.9 25 20 25Z" fill="#0078D7"/> </svg><div class="a-no-permissions-text">No permissions for this section</div>',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'container', cls: 'a-no-permissions', padding: 16, layout: { type: 'hbox', align: 'middle', pack: 'center' }, items: [{ xtype: 'div', cls: 'a-no-permissions-inner', html: '<svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'> <circle cx='20' cy='20' r='20' fill='#0078D7' fill-opacity='0.08'/> <path d='M26 16H25V14C25 11.24 22.76 9 20 9C17.24 9 15 11.24 15 14V16H14C12.9 16 12 16.9 12 18V28C12 29.1 12.9 30 14 30H26C27.1 30 28 29.1 28 28V18C28 16.9 27.1 16 26 16ZM17 14C17 12.34 18.34 11 20 11C21.66 11 23 12.34 23 14V16H17V14ZM26 28H14V18H26V28ZM20 25C21.1 25 22 24.1 22 23C22 21.9 21.1 21 20 21C18.9 21 18 21.9 18 23C18 24.1 18.9 25 20 25Z' fill='#0078D7'/> </svg><div class='fs-12 my-8 c-blue-grey'>No permissions for this section</div>' }] }</code>",
                        },
                    ],
                },
            ],
        },
    ],
});
