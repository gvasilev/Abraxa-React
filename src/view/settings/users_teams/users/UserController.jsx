Ext.define('Abraxa.view.settings.users.UserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings.users.controller',

    inviteUser: function (element) {
        let form = element.up('dialog').down('formpanel');
        if (form.validate()) {
            let data = form.getValues();
            const inviteStore = Ext.ComponentQuery.query('grid[reference=userGrid]')[0].getStore();

            if (element.up('dialog').upVM().get('users').findRecord('email', data.email)) {
                Ext.Msg.alert('Oops', 'This user is already part of your company');
                element.toggle();
                // element.up('dialog').down('form\\.error').setHtml('This user is already part of your company').show().addCls('warn');
                return;
            }
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'invite_user',
                method: 'POST',
                jsonData: data,
                success: function (response, opts) {
                    var res = Ext.decode(response.responseText);
                    if (res.success) {
                        element.up('dialog').destroy();
                        mixpanel.track('Invite user - button');
                        Ext.toast('Invite sent');
                        inviteStore.add(res.newUser);
                    } else {
                        element.up('dialog').down('form\\.error').setHtml(res.error_description).show().addCls('error');
                    }
                },
                failure: function failure(response) {
                    element.toggle();
                    let result = Ext.decode(response.responseText);
                    Ext.Msg.alert('Oops', result.message);
                },
            });
        } else {
            element.toggle();
            element
                .up('dialog')
                .down('form\\.error')
                .setHtml('Please fill in all required fields')
                .show()
                .addCls('error');
        }
    },
    changePassword: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let record = vm.get('userGrid').selection;
        let params = {
            userId: record.get('id'),
        };
        Ext.Msg.confirm(
            'Confirmation',
            'Do you want to request password change for ' + record.get('full_name') + ' ?',
            function (answer) {
                if (answer == 'yes') {
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'companies/users/request-change',
                        method: 'POST',
                        params: params,
                        success: function (response, opts) {
                            Ext.toast('Request sent', 2000);
                        },
                        failure: function (response, opts) {
                            Ext.Msg.alert('Something went wrong', 'Could not request password change!');
                        },
                    });
                }
            }
        );
    },
});
