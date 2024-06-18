Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestPort.SuggestPortGeneral', {
    extend: 'Ext.Container',
    xtype: 'SuggestPortGeneral',
    cls: 'a-card-form',
    items: [
        {
            xtype: 'div',
            ripple: true,
            html: 'General information',
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
                                    xtype: 'textfield',
                                    label: 'UN/Locode',
                                    maxLength: 5,
                                    required: true,
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    name: 'UN/Locode',
                                    placeholder: 'Please enter the UN/Locode',
                                    bind: {
                                        value: '{record.meta_locode}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            cls: 'a-data-field-container',
                            layout: {
                                type: 'hbox',
                                wrap: true,
                            },
                            store: [
                                {
                                    name: null,
                                },
                            ],
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        recordIndex: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record) {
                                                    let store = record.store;
                                                    return store.indexOf(record) + 1;
                                                }
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                cls: 'a-field-container',
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'end',
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        labelAlign: 'top',
                                        ui: 'classic field-md',
                                        placeholder: 'Enter name',
                                        bind: {
                                            value: '{record.name}',
                                            label: 'Alternative name {recordIndex}',
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'normal small round',
                                        iconCls: 'md-icon-add-circle',
                                        hidden: true,
                                        bind: {
                                            hidden: '{recordIndex === 1 ? false:true}',
                                        },
                                        tooltip: {
                                            anchorToTarget: true,
                                            anchor: true,
                                            html: 'Add alternative name',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (me) {
                                            me.up('componentdataview').getStore().add({
                                                name: null,
                                            });
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'default small round',
                                        iconCls: 'md-icon-remove-circle',
                                        hidden: true,
                                        bind: {
                                            hidden: '{recordIndex !== 1 ? false:true}',
                                        },
                                        tooltip: {
                                            anchorToTarget: true,
                                            anchor: true,
                                            html: 'Remove alternative name',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (me) {
                                            me.up('componentdataview').getStore().remove(me.upVM().get('record'));
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                painted: function (me) {
                                    let record = me.upVM().get('record');
                                    if (record.get('meta_name_alternatives')) {
                                        let store = new Ext.data.Store({
                                            proxy: {
                                                type: 'memory',
                                            },
                                        });
                                        Ext.Array.each(record.get('meta_name_alternatives'), function (name) {
                                            store.add({
                                                name: name,
                                            });
                                        });
                                        me.setStore(store);
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Port type',
                                    name: 'Port type',
                                    placeholder: 'Please select the port type',
                                    required: true,
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Port',
                                            value: 'Port',
                                        },
                                        {
                                            text: 'Offshore port',
                                            value: 'Offshore port',
                                        },
                                        {
                                            text: 'Dry port',
                                            value: 'Dry port',
                                        },
                                        {
                                            text: 'Anchorage port',
                                            value: 'Anchorage port',
                                        },
                                        {
                                            text: 'FPSO port',
                                            value: 'FPSO port',
                                        },
                                        {
                                            text: 'Canal',
                                            value: 'Canal',
                                        },
                                        {
                                            text: 'Strait',
                                            value: 'Strait',
                                        },
                                        {
                                            text: 'Service zone',
                                            value: 'Service zone',
                                        },
                                        {
                                            text: 'Cruise destination',
                                            value: 'Cruise destination',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    bind: {
                                        value: '{record.meta_type}',
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
                                    label: 'Operational status',
                                    name: 'Operational status',
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Operational',
                                            value: 'Operational',
                                        },
                                        {
                                            text: 'Currently offline',
                                            value: 'Currently offline',
                                        },
                                        {
                                            text: 'Permanently offline',
                                            value: 'Permanently offline',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.meta_status}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Region',
                                    name: 'Region',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Please enter the region of the port',
                                    bind: {
                                        value: '{record.meta_region}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'textfield',
                                    label: 'Subregion',
                                    name: 'Subregion',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter subregion',
                                    bind: {
                                        value: '{record.meta_subregion}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'country.combo',
                                    label: 'Country name',
                                    name: 'Country name',
                                    required: true,
                                    forceSelection: true,
                                    labelAlign: 'top',
                                    valueField: 'country_code',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.meta_country_id}',
                                        inputValue: '{record.meta_country_name}',
                                    },
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                me.upVM()
                                                    .get('record')
                                                    .set('meta_country_name', selection.get('country_name'));
                                            }
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
                                    xtype: 'textfield',
                                    label: 'UN Country subdivision',
                                    name: 'UN Country subdivision',
                                    maxLength: 3,
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Enter UN Country subdivision',
                                    bind: {
                                        value: '{record.meta_subdivision}',
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
                                    label: 'ISPS',
                                    name: 'ISPS',
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    options: [
                                        {
                                            text: 1,
                                            value: 1,
                                        },
                                        {
                                            text: 2,
                                            value: 2,
                                        },
                                        {
                                            text: 3,
                                            value: 3,
                                        },
                                    ],
                                    bind: {
                                        value: '{record.meta_isps}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'timezone.combo',
                                    label: 'Time Zone',
                                    name: 'Time Zone',
                                    required: true,
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Please enter the time zone',
                                    valueField: 'timezone',
                                    bind: {
                                        value: '{record.meta_time_zone}',
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
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-field-container',
                            items: [
                                {
                                    xtype: 'selectfield',
                                    label: 'Load lines',
                                    name: 'Load lines',
                                    options: [
                                        {
                                            text: 'Tropical Fresh',
                                            value: 'Tropical Fresh',
                                        },
                                        {
                                            text: 'Fresh',
                                            value: 'Fresh',
                                        },
                                        {
                                            text: 'Tropical',
                                            value: 'Tropical',
                                        },
                                        {
                                            text: 'Summer',
                                            value: 'Summer',
                                        },
                                        {
                                            text: 'Winter',
                                            value: 'Winter',
                                        },
                                        {
                                            text: 'Winter North Atlantic',
                                            value: 'Winter North Atlantic',
                                        },
                                    ],
                                    labelAlign: 'top',
                                    ui: 'classic field-md',
                                    placeholder: 'Choose value',
                                    bind: {
                                        value: '{record.load_lines}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            cls: 'a-field-container a-field-multiple',
                            flex: 2,
                            items: [
                                {
                                    xtype: 'label',
                                    html: 'From/To',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            //TODO to be cleared
                                            xtype: 'abraxa.datefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            placeholder: 'dd/mm',
                                            name: 'From',
                                            dateFormat: 'd M',
                                            bind: {
                                                value: '{record.load_lines_start}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-spacer',
                                            html: '',
                                        },
                                        {
                                            xtype: 'abraxa.datefield',
                                            dateFormat: 'd M',
                                            label: false,
                                            name: 'To',
                                            ui: 'classic field-md',
                                            placeholder: 'dd/mm',
                                            bind: {
                                                value: '{record.load_lines_end}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            // Spacer
                            xtype: 'div',
                            cls: 'a-field-container',
                            flex: 1,
                        },
                    ],
                },
            ],
        },
    ],
});
