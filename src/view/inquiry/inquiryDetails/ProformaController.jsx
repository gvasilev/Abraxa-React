Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.proforma-controller',

    createProforma: function (btn) {
        let me = this,
            view = me.getView(),
            form = view.down('formpanel');

        if (form.validate()) {
            let store = btn.lookupViewModel().get('object_record').offers(),
                record = btn.upVM().get('offer'),
                object_record = btn.upVM().get('object_record');
            record.getProxy().setExtraParams({
                inquiry_id: object_record.get('id'),
            });

            const vesselName = btn.upVM('pda').get('selectedInquiry').get('vessel_name');
            const disbursementId = record.get('group_id');
            record.set('payment_reference', `${vesselName} - ${disbursementId}`);

            // Fix bug with template_id being set to empty string, causing server error
            if (record.get('template_id') === '') {
                record.set('template_id', undefined);
            }

            let banks = [];
            let user = btn.upVM('main-viewmodel').get('currentUser');

            if (user) {
                // First check if current user has office and banks
                if (user.get('current_office_id')) {
                    let office = user.getOffice();
                    if (office && office.get('banks') && office.get('banks').length) {
                        office.get('banks').forEach((bank) => {
                            let bankModel = bank.bank;
                            bankModel.is_default = Boolean(bank.is_default);
                            banks.push(bankModel);
                        });
                    }
                }

                // If no office, get banks from company
                let company = user.get('company');

                if (!banks.length && company && company.banks && company.banks.length) {
                    company.banks.forEach((bank) => {
                        banks.push(bank);
                    });
                }
            }

            let bankDefault;
            if (banks && banks.length) {
                bankDefault = banks.find((bank) => bank.is_default);
            }
            if (bankDefault) {
                record.set('bank_id', bankDefault.id);
                record.set('bank_name', bankDefault.bank_name);
            }

            record.save({
                success: function (rec) {
                    Ext.toast('Record created', 1000);
                    btn.toggle();
                    Abraxa.utils.Functions.updateInquiry(object_record);
                    Ext.getCmp('main-viewport')
                        .getController()
                        .redirectTo('inquiry/' + object_record.get('id') + '/pda/' + record.get('id'));
                    view.destroy();
                },
            });
        } else {
            btn.toggle();
            form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
        }
    },

    sendPriceBookDetails: function (inquiry, offer) {
        let params = offer.get('vessel_data');
        Object.keys(params).forEach((key) => {
            const value = params[key];
            delete params[key];
            params[key.toUpperCase()] = value;
        });
        return new Ext.Promise(function (resolve, reject) {
            let data = {
                port_id: offer.get('port_id'),
                exchange_rate: offer.get('exchange_rate'),
                vessel_params: params,
            };
            if (offer.get('template_id')) {
                data.template_id = offer.get('template_id');
            }
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'pc/calculations',
                jsonData: data,
                success: function (response) {
                    resolve(response);
                },
                failure: function failure(response) {
                    resolve(false);
                },
            });
        });
    },
});
