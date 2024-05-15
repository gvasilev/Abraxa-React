Ext.define('Abraxa.view.settings.offices.OfficeController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.settings.office.controller',

    uploadFile: function (element) {
        var files = event.target.files,
            uploadFileName = element.getName(),
            self = this; // the controller
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        var reader = new FileReader();
        // reader.onload = function (e) {
        //     // image content is in e.target.result
        //     // we can then put it into img.src, for example
        //     element.find('imageHead').setSrc(e.target.result);
        // };
        let office = this.getView().upVM().get('office');
        var uploadFiles = element.getFiles();
        var fd = new FormData();
        if (uploadFileName == 'squareOfficeLogo') {
            fd.append('type', 'square');
        } else {
            fd.append('type', 'original');
        }
        fd.append('files', uploadFiles[0]);
        fd.append('office_id', office.get('id'));
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'company/offices/upload_logo',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText);
                office.mergeData(result);
                office.commit();
                Ext.toast('Record updated', 1000);
                document.querySelector('#' + element.id).value = '';
                element.setValue(null);
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                document.querySelector('#' + element.id).value = '';
                element.setValue(null);
            },
        });
    },

    onFileNumberSave: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let store = vm.get('customFileNumberStore');
        let form = this.getView().down('formpanel'),
            currentUserPlan = vm.get('currentUserPlan');
        if (currentUserPlan == 'starter') {
            Ext.create('Abraxa.view.main.UpgradeDialog').show();
            return;
        }
        if (store.getCount() === 0) {
            //create
            let values = form.getValues(),
                regExp = /^0[0-9].*$/;
            let record = {
                prefix: values.prefix,
                sequence: values.sequence,
                suffix: values.suffix,
                pad: regExp.test(values.sequence) ? values.sequence.length : null,
            };
            if (form.validate()) {
                store.add(record);
                store.sync({
                    success: function (batch, opt) {
                        Ext.toast('Record updated', 1000);
                        store.reload();
                    },
                    failure: function (batch, operations) {
                        Ext.Msg.alert('Something went wrong', 'Cannot update settings!');
                    },
                });
            }
        } else {
            //update
            if (form.validate()) {
                let values = form.getValues(),
                    regExp = /^0[0-9].*$/;
                let record = store.getAt(0);

                record.set('pad', regExp.test(values.sequence) ? values.sequence.length : null);
                store.sync({
                    success: function (batch, opt) {
                        Ext.toast('Record updated', 1000);
                    },
                    failure: function (batch, operations) {
                        Ext.Msg.alert('Something went wrong', 'Cannot update settings!');
                    },
                });
            }
        }
    },
});
