Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestTerminal.SuggestTerminalGeneral', {
    extend: 'Ext.Container',
    xtype: 'SuggestTerminalGeneral',
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
                                        placeholder: '',
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
                                    label: 'Terminal type',
                                    name: 'Terminal type',
                                    required: true,
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Terminal',
                                            value: 'Terminal',
                                        },
                                        {
                                            text: 'Offshore terminal',
                                            value: 'Offshore terminal',
                                        },
                                        {
                                            text: 'All weather terminal',
                                            value: 'All weather terminal',
                                        },
                                        {
                                            text: 'FPSO terminal',
                                            value: 'FPSO terminal',
                                        },
                                        {
                                            text: 'Anchorage',
                                            value: 'Anchorage',
                                        },
                                        {
                                            text: 'Shipyard',
                                            value: 'Shipyard',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Please select the terminal type',
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
                                    placeholder: 'Operational Status',
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
                                    xtype: 'selectfield',
                                    label: 'ISPS',
                                    name: 'ISPS',
                                    labelAlign: 'top',
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
                                    ui: 'classic field-md',
                                    placeholder: 'ISPS',
                                    bind: {
                                        value: '{record.meta_isps}',
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
                                    html: 'Work days',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'selectfield',
                                            name: 'Work days from',
                                            options: [
                                                {
                                                    text: 'Mon',
                                                    value: 'Mon',
                                                },
                                                {
                                                    text: 'Tue',
                                                    value: 'Tue',
                                                },
                                                {
                                                    text: 'Wed',
                                                    value: 'Wed',
                                                },
                                                {
                                                    text: 'Thu',
                                                    value: 'Thu',
                                                },
                                                {
                                                    text: 'Fri',
                                                    value: 'Fri',
                                                },
                                                {
                                                    text: 'Sat',
                                                    value: 'Sat',
                                                },
                                                {
                                                    text: 'Sun',
                                                    value: 'Sun',
                                                },
                                            ],
                                            labelAlign: 'top',
                                            ui: 'classic field-md',
                                            placeholder: 'Choose value',
                                            bind: {
                                                value: '{record.info_work_days_start}',
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
                                            xtype: 'selectfield',
                                            name: 'Work days to',
                                            options: [
                                                {
                                                    text: 'Mon',
                                                    value: 'Mon',
                                                },
                                                {
                                                    text: 'Tue',
                                                    value: 'Tue',
                                                },
                                                {
                                                    text: 'Wed',
                                                    value: 'Wed',
                                                },
                                                {
                                                    text: 'Thu',
                                                    value: 'Thu',
                                                },
                                                {
                                                    text: 'Fri',
                                                    value: 'Fri',
                                                },
                                                {
                                                    text: 'Sat',
                                                    value: 'Sat',
                                                },
                                                {
                                                    text: 'Sun',
                                                    value: 'Sun',
                                                },
                                            ],
                                            labelAlign: 'top',
                                            ui: 'classic field-md',
                                            placeholder: 'Choose value',
                                            bind: {
                                                value: '{record.info_work_days_end}',
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
                                    html: 'Work hours',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                    },
                                    items: [
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            name: 'Work hours from',
                                            placeholder: '00:00',
                                            bind: {
                                                value: '{record.info_work_hours_start}',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'a-spacer',
                                            html: '',
                                        },
                                        {
                                            xtype: 'abraxa.timefield',
                                            label: false,
                                            ui: 'classic field-md',
                                            name: 'Work hours to',
                                            placeholder: '00:00',
                                            bind: {
                                                value: '{record.info_work_hours_end}',
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
                                    xtype: 'selectfield',
                                    label: 'Overtime availability',
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
                                        value: '{record.info_overtime}',
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
