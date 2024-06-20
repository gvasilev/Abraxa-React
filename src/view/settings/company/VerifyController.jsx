Ext.define('Abraxa.view.settings.company.VerifyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings.verifycontroller',

    verify: function (me) {
        let controller = this,
            dialog = this.getView(),
            record = dialog.getVM().get('record'),
            file = dialog.getVM().get('file'),
            currentCompany = dialog.getVM().get('currentCompany'),
            currentUser = dialog.getVM().get('currentUser'),
            uploadedFile = dialog.getVM().get('uploadedFile'),
            is_global = dialog.getVM().get('is_global'),
            form = dialog.down('formpanel');
        if (form.validate()) {
            if (form.getValues().user_authorize) {
                dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                record.getProxy().setExtraParams({
                    company_id: record.get('company_id'),
                });
                if (file) {
                    record.set('attach_file', true);
                } else {
                    record.set('attach_file', false);
                }
                record.save({
                    success: function (rec) {
                        if (file) {
                            controller.upload(uploadedFile, record).then(function (result) {
                                if (result) {
                                    Ext.toast('Record created', 1000);
                                    if (currentCompany && currentCompany.isModel) {
                                        currentCompany.load();
                                    }
                                    if (currentUser) {
                                        currentUser.load();
                                    }
                                    me.toggle();
                                    dialog.destroy();
                                } else {
                                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                                }
                            });
                        } else {
                            Ext.toast('Record created', 1000);
                            if (currentCompany && currentCompany.isModel) {
                                currentCompany.load();
                            }
                            if (currentUser) {
                                currentUser.load();
                            }
                            me.toggle();
                            dialog.destroy();
                        }
                    },
                });
            } else {
                me.toggle();
                form.down('checkboxfield').setError('This field is required');
                dialog
                    .down('form\\.error')
                    .setHtml('You must confirm that you are authorized to register and verify this company')
                    .show()
                    .addCls('error');
            }
        } else {
            dialog.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
            me.toggle();
        }
    },

    upload: function (file, record) {
        return new Ext.Promise(function (resolve, reject) {
            let fd = new FormData();
            fd.append('company_id', record.get('record'));
            fd.append('verification_id', record.get('id'));
            fd.append('file', file);
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'company/upload_verification',
                rawData: fd,
                headers: {
                    'Content-Type': null,
                },
                success: function (response) {
                    resolve(true);
                },
                failure: function failure(response) {
                    resolve(false);
                },
            });
        });
    },
});
