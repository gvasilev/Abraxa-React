Ext.define('Abraxa.view.registration.RgistrationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.registration-controller',

    init: function () {
        var bbar = this.lookup('regbbar'),
            card = this.getView().down('panel').getLayout(),
            // Lazily create the Indicator (wired to the card layout)
            indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(1, indicator);
    },

    onNext: function () {
        var card = this.getView().down('panel').getLayout(),
            container = Ext.ComponentQuery.query('registration\\.container')[0],
            personalForm = Ext.ComponentQuery.query('registration\\.personal')[0],
            companyForm = Ext.ComponentQuery.query('registration\\.company')[0],
            index = card.getIndicator().getActiveIndex();
        switch (index) {
            case 0:
                if (!personalForm.validate()) {
                    container.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                } else {
                    container.down('form\\.error').hide();
                    let values = personalForm.getValues();

                    if (values.password != values.password_confirmation) {
                        container.down('form\\.error').setHtml('Passwords do not match').show().addCls('error');
                    } else {
                        this.checkUserEmail(values.email).then(function (content) {
                            if (content) {
                                card.next();
                            } else {
                                container.down('form\\.error').setHtml('User already exists').show().addCls('error');
                            }
                        });
                    }
                }
                break;
            case 1:
                companyValues = companyForm.getValues();
                if (!companyForm.validate()) {
                    companyForm.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                } else if (!companyValues.authorized) {
                    companyForm
                        .down('form\\.error')
                        .setHtml('You must confirm that you are authorized to register this company')
                        .show()
                        .addCls('error');
                } else {
                    card.next();
                }
                break;
        }
    },

    onPrevious: function () {
        var card = this.getView().down('panel').getLayout();
        card.previous();
        return;
        if (!card.getIndicator().getActiveIndex()) {
            Ext.ComponentQuery.query('registration\\.container')[0].hide();
            Ext.ComponentQuery.query('login\\.dialog')[0].show();
            Ext.Viewport.getViewModel().set('registration_mode', false);
        } else {
            card.previous();
        }
    },

    onSubmit: function (cmp) {
        let companyForm = Ext.ComponentQuery.query('registration\\.company')[0],
            personalForm = Ext.ComponentQuery.query('registration\\.personal')[0],
            initialSetupForm = Ext.ComponentQuery.query('registration\\.initial\\.setup')[0],
            container = Ext.ComponentQuery.query('registration\\.container')[0],
            portServedStore = Ext.ComponentQuery.query('[cls~=ports_served_list]')[0].getStore(),
            companyValues = companyForm.getValues(),
            personalValues = personalForm.getValues(),
            setupValues = initialSetupForm.getValues(),
            me = this,
            linkData = me.getView().upVM().get('linkData'),
            signup_button = cmp;

        if (!initialSetupForm.validate()) {
            initialSetupForm.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        } else if (!setupValues.terms) {
            initialSetupForm
                .down('form\\.error')
                .setHtml('You must agree with our Terms of Service')
                .show()
                .addCls('error');
        } else {
            initialSetupForm.down('form\\.error').hide();
            signup_button.setDisabled(true);
            signup_button.toggle();
            let ports = [];

            portServedStore.each(function (record) {
                ports.push(record.get('port_id'));
            });
            if (!companyForm.validate() || !personalForm.validate()) {
                initialSetupForm.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
                return;
            }
            Object.assign(companyValues, setupValues);

            let data = {
                user: personalValues,
                company: companyValues,
                ports: ports,
            };

            this.register(data).then(function (response) {
                if (response.success) {
                    signup_button.toggle();
                    signup_button.setDisabled(false);
                    Ext.ComponentQuery.query('registration\\.container')[0].hide();
                    Ext.ComponentQuery.query('[cls=registration_complete]')[0].show();
                    if (linkData) me.updateTenant(linkData, response);
                } else {
                    container
                        .down('form\\.error')
                        .setHtml('Something went wrong with the registration. Please try again later.')
                        .show()
                        .addCls('error');
                    signup_button.setDisabled(false);
                    signup_button.toggle();
                }
            });
        }
    },

    checkUserEmail: function (email) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'check_user_email',
                method: 'POST',
                jsonData: {
                    email: email,
                },
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res.success);
                },
            });
        });
    },

    register: function (data) {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'register',
                method: 'POST',
                jsonData: data,
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    resolve(res);
                },
            });
        });
    },

    updateTenant: function (invitation, data) {
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'portcall-invitation/' + invitation.id + '/set_tenant/' + data.tenant_id,
            method: 'POST',
            jsonData: data,
            success: function (response, opts) {
                // var res = Ext.decode(response.responseText);
                // resolve(res.success);
            },
        });
    },
});
