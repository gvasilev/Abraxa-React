Ext.define('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthGeneral', {
    extend: 'Ext.Container',
    xtype: 'SuggestBerthGeneral',
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
                        const component = this.component;
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
                                    label: 'Terminal',
                                    name: 'Terminal',
                                    required: true,
                                    labelAlign: 'top',
                                    valueField: 'id',
                                    displayField: 'name',
                                    ui: 'classic field-md',
                                    placeholder: 'Terminal',
                                    bind: {
                                        store: '{selectedPort.terminals}',
                                        // value: '{record.parent_id}'
                                    },
                                    listeners: {
                                        painted: function (me, selection) {
                                            const childSettingsMainVM = me.upVM();
                                            const record = childSettingsMainVM.get('record');
                                            const legacyTerminals = childSettingsMainVM
                                                ?.get('terminalCollection')
                                                ?.getData().items;

                                            if (legacyTerminals) {
                                                const legacyTerminal = Ext.Array.findBy(
                                                    legacyTerminals,
                                                    function (rec) {
                                                        if (rec?.get('uuid') === record.get('parent_uuid')) {
                                                            return rec;
                                                        }
                                                    }
                                                );

                                                if (legacyTerminal) {
                                                    me.setValue(legacyTerminal.id);
                                                }
                                            }
                                        },
                                        select: function (me, selection) {
                                            const childSettingsMainVM = me.upVM();
                                            const record = childSettingsMainVM.get('record');
                                            const legacyTerminals = childSettingsMainVM
                                                ?.get('terminalCollection')
                                                ?.getData().items;
                                            if (legacyTerminals) {
                                                const legacyTerminal = Ext.Array.findBy(
                                                    legacyTerminals,
                                                    function (rec) {
                                                        if (rec.get('id') === selection.get('id')) {
                                                            return rec;
                                                        }
                                                    }
                                                );
                                                if (legacyTerminal) {
                                                    record.set('parent_uuid', legacyTerminal.get('uuid'));
                                                }
                                            }
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            cls: 'a-data-field-container alternative_names',
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
                                                    const store = record.store;
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
                                    const childSettingsMainVM = me.upVM();
                                    const record = childSettingsMainVM.get('record');
                                    const nameAlternatives = record?.get('meta_name_alternatives');
                                    if (nameAlternatives?.length) {
                                        const store = new Ext.data.Store({
                                            proxy: {
                                                type: 'memory',
                                            },
                                        });
                                        Ext.Array.each(nameAlternatives, function (name) {
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
                                    label: 'Berth type',
                                    name: 'Berth type',
                                    required: true,
                                    labelAlign: 'top',
                                    options: [
                                        {
                                            text: 'Berth',
                                            value: 'Berth',
                                        },
                                        {
                                            text: 'Floating berth',
                                            value: 'Floating berth',
                                        },
                                        {
                                            text: 'Dolphin',
                                            value: 'Dolphin',
                                        },
                                    ],
                                    ui: 'classic field-md',
                                    placeholder: 'Berth Type',
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
            ],
        },
    ],
});
