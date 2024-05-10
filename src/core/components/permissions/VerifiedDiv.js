Ext.define('Abraxa.core.permissions.VerifiedDiv', {
    extend: 'Abraxa.core.components.Div',
    xtype: 'verified.div',
    cls: 'hbox a-verified-div',
    bind: {
        hidden: '{currentCompany.verified}',
        html: '{verifiedCompany}',
    },
    listeners: {
        click: {
            element: 'element',
            fn: function (el) {
                let vm = this.component.goUp().upVM(),
                    currentUser = vm.get('currentUser'),
                    validated,
                    currentCompany = vm.get('currentCompany');
                if (currentUser.getCompany() && currentUser.getCompany().get('verified')) {
                    validated = true;
                } else if (currentUser.getCompany() && currentUser.getCompany().get('verification')) {
                    validated = 'pending';
                } else {
                    validated = false;
                }
                if (!validated) {
                    Ext.create('Abraxa.view.settings.company.VerifyCompany', {
                        viewModel: {
                            parent: vm,
                            data: {
                                record: Ext.create('Abraxa.model.settings.company.Verification', {
                                    company_id: currentCompany.get('id'),
                                    company_name: currentCompany.get('name'),
                                    registered_name: currentCompany.get('name'),
                                    country: currentCompany.get('country'),
                                    city: currentCompany.get('city'),
                                    company_email: currentCompany.get('email'),
                                    full_registered_address: currentCompany.get('address'),
                                    vat_number: currentCompany.get('vat'),
                                }),
                                file: null,
                                uploadedFile: null,
                                is_global: true,
                            },
                        },
                    }).show();
                }

                if (validated == 'pending') {
                    let title = '',
                        content =
                            'Thank you for submitting your verification request. We are currently working on your application and will get back to you very shortly.';
                    Abraxa.popup.showSuccessDialog(title, content);
                }
            },
        },
    },
});
