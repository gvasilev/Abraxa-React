Ext.define('Abraxa.view.registration.RegistrationCompanyDetails', {
    extend: 'Ext.form.Panel',
    xtype: 'registration.company',
    padding: 0,
    flex: 1,
    viewModel: {
        formulas: {
            parsedUrl: {
                bind: {
                    bindTo: '{personalEmail.value}',
                    deep: true,
                },
                get: function (value) {
                    if (value) return value.split('@')[1];
                },
            },
        },
    },
    items: [
        {
            xtype: 'div',
            cls: 'text-center login_subtitle',
            html: '<h1>Company information</h1>',
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
                    xtype: 'textfield',
                    label: 'Company',
                    flex: 1,
                    placeholder: 'Company name',
                    name: 'name',
                    bind: {
                        value: '{linkData ? linkData.org_name : null}',
                    },
                },
                {
                    xtype: 'selectfield',
                    label: 'Registration type',
                    placeholder: 'Choose registration type',
                    flex: 1,
                    name: 'type',
                    displayField: 'name',
                    valueField: 'value',
                    cls: 'non-editable',
                    value: 'agent',
                    options: [
                        {
                            value: 'agent',
                            name: 'Agent',
                        },
                    ],
                    listeners: {
                        change: function (me, newValue, oldValue) {
                            Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].setRequired(true);
                            Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].show();
                            if (newValue && newValue == 'principal') {
                                Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].hide();
                                Ext.ComponentQuery.query('[cls~=port_served_combo]')[0].setRequired(false);
                            }
                        },
                    },
                },
            ],
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
                    xtype: 'emailfield',
                    label: 'Company email',
                    placeholder: 'Email address',
                    validators: 'email',
                    flex: 1,
                    name: 'email',
                    listeners: {
                        focusleave: function () {
                            if (this.getValue() && this.isValid()) {
                                let domain = this.upVM().get('parsedUrl'),
                                    email = this.getValue().split('@')[1];

                                if (domain != email) {
                                    this.clearValue();
                                    this.clearInvalid();
                                    this.focus();
                                    let formError =
                                        Ext.ComponentQuery.query('registration\\.container')[0].down('form\\.error');

                                    formError
                                        .setHtml(
                                            'Company email must be of the same domain as your personal email - <b>' +
                                                domain +
                                                '</b>'
                                        )
                                        .show()
                                        .addCls('error');
                                }
                            }
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Company domain',
                    placeholder: 'domain.com',
                    disabled: true,
                    flex: 1,
                    bind: {
                        value: '{parsedUrl}',
                    },
                    name: 'company_domain',
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'vbox',
            margin: '16 0 0 0',
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
                        align: 'center',
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            ui: 'large',
                            name: 'authorized',
                        },
                        {
                            xtype: 'div',
                            margin: '0 0 0 12',
                            html: "I'm authorized to register the above company",
                        },
                    ],
                },
            ],
        },
    ],
});
