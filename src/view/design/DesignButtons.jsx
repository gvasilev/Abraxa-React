Ext.define('Abraxa.view.design.DesignButtons', {
    extend: 'Ext.Container',
    xtype: 'design.buttons',
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
                    id: 'trigger_1',
                    minWidth: 360,
                    html: '<span>Buttons</span>',
                    listeners: {
                        click: {
                            element: 'element',
                            fn: function fn() {
                                Ext.getCmp('collapsible_1').toggleCls('is-collapsed');
                                Ext.getCmp('trigger_1').toggleCls('is-collapsed');
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
            id: 'collapsible_1',
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
                            html: '<span class="pl-52 c-blue">Button - Action</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action',
                                    text: 'Action',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'action',<br> text: 'Action' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Decline Alt</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'decline alt',
                                    text: 'Decline',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'decline alt',<br> text: 'Decline' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Confirm Alt</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'confirm alt',
                                    text: 'Confirm',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'confirm alt',<br> text: 'Confirm' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Default</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'default',
                                    text: 'Default',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'default',<br> text: 'Default' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Normal</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'normal',
                                    text: 'Normal',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'normal',<br> text: 'Normal' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Warning</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'warning',
                                    text: 'Warning',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'warning',<br> text: 'Warning' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Danger</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'danger',
                                    text: 'Danger',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'danger',<br> text: 'Danger' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Default Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'default-light',
                                    text: 'Default',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'default-light',<br> text: 'Default' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Normal Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'normal-light',
                                    text: 'Normal',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'normal-light',<br> text: 'Normal' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Success Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'success-light',
                                    text: 'Success',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'success-light',<br> text: 'Success' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Warning Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'warning-light',
                                    text: 'Warning',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'warning-light',<br> text: 'Warning' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Danger Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'danger-light',
                                    text: 'Danger',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'danger-light',<br> text: 'Danger' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Text & Icon Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-file-download',
                                    cls: 'a-has-counter x-has-menu',
                                    ui: 'indigo-light',
                                    text: 'Unaccounted <em>4</em>',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> iconCls: 'md-icon-outlined md-icon-file-download',<br> cls: 'a-has-counter x-has-menu',<br> ui: 'indigo-light',<br> text: 'Unaccounted <em>4</em>' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Text & Icon Light</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-outlined md-icon-file-copy',
                                    cls: 'a-has-counter',
                                    ui: 'blue-light',
                                    text: 'Invoices <em>12</em>',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> iconCls: 'md-icon-outlined md-icon-file-copy',<br> cls: 'a-has-counter',<br> ui: 'blue-light',<br> text: 'Vouchers <em>4</em>' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Text & Icon Light Small</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            // layout: {
                            //     type: 'hbox',
                            //     align: 'middle'
                            // },
                            items: [
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '8 8 8 0',
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'blue-light small',
                                            text: 'Button <em>12</em>',
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 8,
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'danger-light small',
                                            text: 'Button <em>12</em>',
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 8,
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'warning-light small',
                                            text: 'Button <em>12</em>',
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 8,
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'success-light small',
                                            text: 'Button <em>12</em>',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'button',
                                            margin: '8 8 8 0',
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'blue-light color-default small',
                                            text: 'Button <em>12</em>',
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 8,
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'completed-light color-default small',
                                            text: 'Button <em>12</em>',
                                        },
                                        {
                                            xtype: 'button',
                                            margin: 8,
                                            iconCls: 'md-icon-outlined md-icon-file-copy',
                                            cls: 'a-has-counter',
                                            ui: 'progress-light color-default small',
                                            text: 'Button <em>12</em>',
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
                            html: "<code>{ xtype: 'button',<br> iconCls: 'md-icon-outlined md-icon-file-copy',<br> cls: 'a-has-counter',<br> ui: 'blue-light small',<br> text: 'Vouchers <em>4</em>' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Outlined</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 16 0 0',
                                    height: 36,
                                    ui: 'normal outlined',
                                    text: 'Outlined',
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 16 0 0',
                                    iconCls: 'md-icon-file-copy md-icon-outlined',
                                    ui: 'normal outlined',
                                    text: 'Outlined',
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 16 0 0',
                                    iconCls: 'md-icon-file-copy md-icon-outlined',
                                    ui: 'normal outlined round',
                                    text: 'Rounded',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'normal outlined',<br> text: 'Outlined' }</code>",
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
                            html: '<span class="pl-52 c-blue">Custom Button - Total</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 16 0 0',
                                    iconCls: 'a-icon-total',
                                    ui: 'custom-total',
                                    text: 'Submit',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br>iconCls: 'a-icon-total',<br> ui: 'custom-total',<br> text: 'Submit' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Rounded</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action round',
                                    text: 'Rounded',
                                },
                                {
                                    xtype: 'button',
                                    margin: 16,
                                    ui: 'action round',
                                    iconCls: 'md-icon-add',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'action round',<br> text: 'Rounded' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Hovered</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action round hovered',
                                    iconCls: 'md-icon-add',
                                    text: 'Port call',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'action round hovered',<br> text: 'Rounded' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Raised</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '16 0',
                                    ui: 'default raised',
                                    text: 'Raised',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'default raised',<br> text: 'Raised' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Text & Icon</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'md-icon-notifications md-icon-outlined',
                                    ui: 'action',
                                    text: 'Button with icon',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br>iconCls: 'md-icon-notifications md-icon-outlined',<br> ui: 'action',<br> text: 'Button with icon' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Sizes</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            defaults: {
                                margin: '0 16 0 0',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action small',
                                    text: 'Small',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'action',
                                    text: 'Normal',
                                },
                                {
                                    xtype: 'button',
                                    ui: 'action large',
                                    text: 'Large',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ ..., ui: 'action small'},<br> { ..., ui: 'action'},<br> { ..., ui: 'action large'}</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Loading</span>',
                        },
                        {
                            xtype: 'container',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'action loading',
                                    cls: '',
                                    enableToggle: true,
                                    text: 'Click me',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'action loading',<br> enableToggle: true,<br> text: 'Click me' }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Tool</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            defaults: {
                                xtype: 'button',
                                margin: 16,
                                iconCls: 'md-icon-notifications md-icon-outlined',
                            },
                            items: [
                                {
                                    ui: 'tool-sm round',
                                    tooltip: {
                                        html: "Tool small - ui: 'tool-sm round'",
                                        align: 'bc-tc?',
                                    },
                                },
                                {
                                    ui: 'tool round',
                                    tooltip: {
                                        html: "Tool normal - ui: 'tool round'",
                                        align: 'bc-tc?',
                                    },
                                },
                                {
                                    ui: 'tool-lg round',
                                    tooltip: {
                                        html: "Tool large - ui: 'tool-lg round'",
                                        align: 'bc-tc?',
                                    },
                                },
                                {
                                    ui: 'tool toggle round',
                                    enableToggle: true,
                                    tooltip: {
                                        html: "Tool toggle - ui: 'tool toggle round', <br>enableToggle: true,",
                                        align: 'bc-tc?',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'tool round',<br>iconCls: 'md-icon-notifications md-icon-outlined'  }</code>",
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
                            html: '<span class="pl-52 c-blue">Button - Tool</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            defaults: {
                                xtype: 'button',
                                margin: 16,
                            },
                            items: [
                                {
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-filter-list md-icon-outlined',
                                    text: 'Filter',
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'button',<br> ui: 'tool-text-sm',<br>iconCls: 'md-icon-filter-list md-icon-outlined'  }</code>",
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
                            html: '<span class="pl-52 c-blue">Checkbox - Switch Basic</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch',
                                    label: false,
                                    checked: true,
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'checkboxfield',<br> ui: 'switch',<br> label: false,<br> checked: true }</code>",
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
                            html: '<span class="pl-52 c-blue">Checkbox - Switch with icon</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    checked: true,
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'checkboxfield',<br> ui: 'switch icon',<br> label: false,<br> checked: true }</code>",
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
                            html: '<span class="pl-52 c-blue">Checkbox - Switch disabled</span>',
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            flex: 2,
                            items: [
                                {
                                    xtype: 'checkboxfield',
                                    disabled: true,
                                    ui: 'switch icon',
                                    label: false,
                                    checked: true,
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            flex: 1.5,
                            padding: 16,
                            cls: 'a-bgr-50',
                            html: "<code>{ xtype: 'checkboxfield',<br> ui: 'switch icon',<br> label: false,<br> checked: true }</code>",
                        },
                    ],
                },
            ],
        },
    ],
});
