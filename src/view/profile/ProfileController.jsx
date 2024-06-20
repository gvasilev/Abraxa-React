Ext.define('Abraxa.view.profile.ProfileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.profile.controller',

    onFileChange: function (element) {
        var files = event.target.files,
            self = this; // the controller
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        var reader = new FileReader();
        reader.onload = function (e) {
            // image content is in e.target.result
            // we can then put it into img.src, for example
            element.find('imageHead').setSrc(e.target.result);
        };
        let userRecord = this.getView().upVM().get('currentUser');
        var uploadFiles = element.getFiles();
        var fd = new FormData();
        fd.append('files', uploadFiles[0]);
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'users/upload_logo',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText);
                userRecord.mergeData(result);
                Ext.toast('Record updated', 1000);
                document.querySelector('#' + element.id).value = '';
                element.setValue(null);
            },
            failure: function failure(response) {
                document.querySelector('#' + element.id).value = '';
                element.setValue(null);
            },
        });
    },

    changePassword: function (button) {
        let view = this.getView(),
            form = view.find('formChangePassword');
        if (form.validate()) {
            let values = form.getValues();
            if (values.newPassword === values.repeatPassword) {
                Ext.Msg.confirm('Confirmation', 'Do you want to change your password?', function (answer) {
                    if (answer == 'yes') {
                        view.down('form\\.error').setHtml('').hide().removeCls('error');
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'users/change_password',
                            params: values,
                            method: 'POST',
                            success: function (response) {
                                button.toggle();
                                Ext.toast('Record updated', 1000);
                            },
                            failure: function failure(response) {
                                let result = Ext.decode(response.responseText);
                                button.toggle();
                                view.down('form\\.error').setHtml(result.message).show().addCls('error');
                                form.lookupName('currentPassword').setError('Invalid user password');
                            },
                        });
                    } else {
                        button.toggle();
                        form.reset();
                        form.clearErrors();
                    }
                });
            } else {
                button.toggle();
                view.down('form\\.error').setHtml('Passwords did not match try again').show().addCls('error');
            }
        } else {
            button.toggle();
            view.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },
});
