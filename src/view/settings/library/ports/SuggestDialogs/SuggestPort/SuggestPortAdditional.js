Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortAdditional', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortAdditional',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'Additional Port Information',
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
                                    label: 'Harbour Size',
                                    name: 'Harbour Size',
                                    options: [
                                        {
                                            text: 'Small',
                                            value: 'small',
                                        },
                                        {
                                            text: 'Medium',
                                            value: 'medium',
                                        },
                                        {
                                            text: 'Large',
                                            value: 'large',
                                        },
                                    ],
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Harbour Size',
                                    bind: {
                                        value: '{record.info_harbour_size}',
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
                                    label: 'Harbour Type',
                                    name: 'Harbour Type',
                                    options: [
                                        {
                                            text: 'Coastal Natural',
                                            value: 'coastal natural',
                                        },
                                        {
                                            text: 'Coastal Breakwater',
                                            value: 'coastal breakwater',
                                        },
                                        {
                                            text: 'Coastal Tide Gate',
                                            value: 'coastal tide gate',
                                        },
                                        {
                                            text: 'Open Roadstead',
                                            value: 'open roadstead',
                                        },
                                        {
                                            text: 'River Basin',
                                            value: 'river basin',
                                        },
                                        {
                                            text: 'River Natural',
                                            value: 'river natural',
                                        },
                                        {
                                            text: 'River Tide Gate',
                                            value: 'river tide gate',
                                        },
                                        {
                                            text: 'Unknown',
                                            value: 'unknown',
                                        },
                                    ],
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.info_harbour_type}',
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
                                    label: 'Shelter',
                                    name: 'Shelter',
                                    options: [
                                        {
                                            text: 'None',
                                            value: 'none',
                                        },
                                        {
                                            text: 'Poor',
                                            value: 'poor',
                                        },
                                        {
                                            text: 'Fair',
                                            value: 'fair',
                                        },
                                        {
                                            text: 'Good',
                                            value: 'good',
                                        },
                                        {
                                            text: 'Excellent',
                                            value: 'excellent',
                                        },
                                    ],
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.info_shelter_afforded}',
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
                                    label: 'Water Salinity',
                                    name: 'Water Salinity',
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
                                    xtype: 'label',
                                    cls: 'water_label',
                                    html: 'Water Density',
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
                                            name: 'Water Density from',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.info_water_density_min}',
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
                                            name: 'Water Density to',
                                            ui: 'classic field-md',
                                            placeholder: '0.000',
                                            bind: {
                                                value: '{record.info_water_density_max}',
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
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    label: 'Notice of arrival deadline',
                                    name: 'Notice of arrival deadline',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '00',
                                    bind: {
                                        value: '{record.info_noa_deadline}',
                                    },
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
                                    name: 'Cargo manifest deadline',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: '00',
                                    bind: {
                                        value: '{record.info_manifest_deadline}',
                                    },
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
                                    xtype: 'selectfield',
                                    label: 'US Representative',
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
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.info_us_representative}',
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
