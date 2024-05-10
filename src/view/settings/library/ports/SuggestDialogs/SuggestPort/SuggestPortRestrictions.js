Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortRestrictions', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortRestrictions',
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
                                            name: 'Channel Draft min',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.restriction_min_channel_draft}',
                                            },
                                            listeners: {
                                                errorchange: function (me, err) {
                                                    me.getParent().up().getAt(0).removeCls('c-red');
                                                    if (err) {
                                                        me.getParent().up().getAt(0).addCls('c-red');
                                                    }
                                                },
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
                                            name: 'Channel Draft max',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.restriction_max_channel_draft}',
                                            },
                                            listeners: {
                                                errorchange: function (me, err) {
                                                    me.getParent().up().getAt(0).removeCls('c-red');
                                                    if (err) {
                                                        me.getParent().up().getAt(0).addCls('c-red');
                                                    }
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container a-field-multiple',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Anchorage Draft',
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
                                            name: 'Anchorage Draft min',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.restriction_min_anchorage_draft}',
                                            },
                                            listeners: {
                                                errorchange: function (me, err) {
                                                    me.getParent().up().getAt(0).removeCls('c-red');
                                                    if (err) {
                                                        me.getParent().up().getAt(0).addCls('c-red');
                                                    }
                                                },
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
                                            name: 'Anchorage Draft max',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.restriction_max_anchorage_draft}',
                                            },
                                            listeners: {
                                                errorchange: function (me, err) {
                                                    me.getParent().up().getAt(0).removeCls('c-red');
                                                    if (err) {
                                                        me.getParent().up().getAt(0).addCls('c-red');
                                                    }
                                                },
                                            },
                                        },
                                    ],
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
                                    label: 'Daylight navigation',
                                    name: 'Daylight navigation',
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
                                        value: '{record.restriction_daylight_navigation}',
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
                                    label: 'International navigating limits',
                                    name: 'International navigating limits',
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Arctic - 1a',
                                            value: 'Arctic - 1a',
                                        },
                                        {
                                            text: 'Arctic - 1b',
                                            value: 'Arctic - 1b',
                                        },
                                        {
                                            text: 'Northern Seas - 2a',
                                            value: 'Northern Seas - 2a',
                                        },
                                        {
                                            text: 'Northern Seas - 2b',
                                            value: 'Northern Seas - 2b',
                                        },
                                        {
                                            text: 'Baltic - 3a',
                                            value: 'Baltic - 3a',
                                        },
                                        {
                                            text: 'Baltic - 3b',
                                            value: 'Baltic - 3b',
                                        },
                                        {
                                            text: 'Baltic - 3c',
                                            value: 'Baltic - 3c',
                                        },
                                        {
                                            text: 'Baltic - 3d',
                                            value: 'Baltic - 3d',
                                        },
                                        {
                                            text: 'Baltic - 3e',
                                            value: 'Baltic - 3e',
                                        },
                                        {
                                            text: 'Greenland - 4',
                                            value: 'Greenland - 4',
                                        },
                                        {
                                            text: 'North America (East) - 5a',
                                            value: 'North America (East) - 5a',
                                        },
                                        {
                                            text: 'North America (East) - 5b',
                                            value: 'North America (East) - 5b',
                                        },
                                        {
                                            text: 'North America (East) - 5c',
                                            value: 'North America (East) - 5c',
                                        },
                                        {
                                            text: 'North America (East) - 5d',
                                            value: 'North America (East) - 5d',
                                        },
                                        {
                                            text: 'North America (East) - 5e',
                                            value: 'North America (East) - 5e',
                                        },
                                        {
                                            text: 'North America (West) - 6a',
                                            value: 'North America (West) - 6a',
                                        },
                                        {
                                            text: 'North America (West) - 6b',
                                            value: 'North America (West) - 6b',
                                        },
                                        {
                                            text: 'Southern Ocean - 7a',
                                            value: 'Southern Ocean - 7a',
                                        },
                                        {
                                            text: 'Southern Ocean - 7b',
                                            value: 'Southern Ocean - 7b',
                                        },
                                        {
                                            text: 'Southern Ocean - 7c',
                                            value: 'Southern Ocean - 7c',
                                        },
                                        {
                                            text: 'Kerguelen/Crozet - 8',
                                            value: 'Kerguelen/Crozet - 8',
                                        },
                                        {
                                            text: 'East Asia - 9a',
                                            value: 'East Asia - 9a',
                                        },
                                        {
                                            text: 'East Asia - 9b',
                                            value: 'East Asia - 9b',
                                        },
                                        {
                                            text: 'East Asia - 9c',
                                            value: 'East Asia - 9c',
                                        },
                                        {
                                            text: 'Bering Sea - 10a',
                                            value: 'Bering Sea - 10a',
                                        },
                                        {
                                            text: 'Bering Sea - 10b',
                                            value: 'Bering Sea - 10b',
                                        },
                                        {
                                            text: 'Bering Sea - 10c',
                                            value: 'Bering Sea - 10c',
                                        },
                                        {
                                            text: 'Bering Sea - 10d',
                                            value: 'Bering Sea - 10d',
                                        },
                                        {
                                            text: 'None',
                                            value: 'None',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.restriction_inl}',
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
                                    label: 'Swell',
                                    name: 'Swell',
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
                                        value: '{record.restriction_swell}',
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
                                    label: 'Piracy',
                                    name: 'Piracy',
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
                                        value: '{record.restriction_piracy}',
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
                                    label: 'War Area',
                                    name: 'War Area',
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
                                        value: '{record.restriction_war_area}',
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
                                    label: 'SECA',
                                    name: 'SECA',
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
                                        value: '{record.restriction_seca}',
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
                                    html: 'First Port of Entry',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{record.restriction_first_port_of_entry}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'Armed Guards',
                                },
                                {
                                    xtype: 'checkboxfield',
                                    ui: 'switch icon',
                                    label: false,
                                    bind: {
                                        checked: '{record.restriction_armed_guards}',
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
