Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortHealth', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortHealth',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Health Information',
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
                                    label: 'Free Pratique',
                                    name: 'Free Pratique',
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
                                        value: '{record.quarantine_pratique}',
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
                                    label: 'Deratting certificate',
                                    name: 'Deratting certificate',
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
                                        value: '{record.quarantine_deratt_cert}',
                                    },
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
                                    label: 'Crew vaccination required',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter vaccination',
                                    bind: {
                                        value: '{record.quarantine_crew_vaccination}',
                                    },
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
                                    label: 'Other',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter other information',
                                    bind: {
                                        value: '{record.quarantine_other}',
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
