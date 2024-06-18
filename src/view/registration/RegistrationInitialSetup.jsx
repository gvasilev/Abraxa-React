Ext.define('Abraxa.view.registration.RegistrationInitialSetup', {
    extend: 'Ext.form.Panel',
    xtype: 'registration.initial.setup',
    padding: 0,
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'div',
            cls: 'text-center login_subtitle',
            html: '<h1>Just a few more details</h1>',
        },
        {
            xtype: 'form.error',
            hidden: true,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            cls: 'mb-8',
            layout: 'hbox',
            defaults: {
                ui: 'outlined field-lg',
                clearable: false,
                margin: '0 12',
                labelAlign: 'top',
                required: true,
            },
            items: [
                {
                    xtype: 'country.combo',
                    label: 'Country',
                    placeholder: 'Start typing',
                    flex: 1,
                    triggers: {
                        search: false,
                    },
                    name: 'country',
                    listeners: {
                        select: function (me, selection) {
                            if (selection) {
                                me.up('container').down('hiddenfield').setValue(selection.get('country_name'));
                            }
                        },
                    },
                },
                {
                    xtype: 'hiddenfield',
                    name: 'country_name',
                },
                {
                    xtype: 'common-combo-currency',
                    label: 'Currency',
                    flex: 1,
                    displayField: 'currency',
                    valueField: 'currency',
                    name: 'default_currency',
                    cls: 'non-editable',
                    bind: {
                        store: '{currencies}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'vbox',
            defaults: {
                ui: 'outlined field-lg',
                clearable: false,
                margin: '0 12',
                labelAlign: 'top',
            },
            items: [
                {
                    xtype: 'port.combo',
                    label: 'Ports served',
                    placeholder: 'Choose ports',
                    cls: 'a-field-icon icon-port port_served_combo',
                    flex: 1,
                    required: true,
                    listeners: {
                        select: function (cmp, record) {
                            let store = Ext.ComponentQuery.query('[cls~=ports_served_list]')[0].getStore(),
                                me = this;

                            if (!record.phantom) {
                                store.add(record);
                                cmp.setRequired(false);
                                me.getValueCollection().remove(record);
                                me.focus();
                            }
                        },
                    },
                },
                {
                    xtype: 'dataview',
                    cls: 'ports_served_list a-port-served-list',
                    store: [],
                    inline: true,
                    layout: {
                        type: 'hbox',
                        // wrap: true
                    },
                    itemTpl:
                        '<div class="combo-item">' +
                        '<i class="md-icon icon-close">close</i>' +
                        '<div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>' +
                        '<label class="sm-type">{code}</label>' +
                        '<div class="sm-value text-truncate">{port_name}</div>' +
                        '</div>',

                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'i.icon-close',
                            fn: function () {
                                let store = this.component.getStore(),
                                    record = this.component.getSelection();

                                store.remove(record);
                                if (!store.getCount()) {
                                    Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].setRequired(true);
                                    Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].setError(false);
                                }
                            },
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'vbox',
            margin: '8 0 0 0',
            defaults: {
                ui: 'classic',
                margin: '6 12',
                bodyAlign: 'start',
            },
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            ui: 'large',
                            name: 'terms',
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            html: "I accept the <a target='_blank' href='https://abraxa.com/terms-and-conditions/'>Abraxa Customer Terms of Service.</>",
                            required: true,
                        },
                    ],
                },
            ],
        },
    ],
});
