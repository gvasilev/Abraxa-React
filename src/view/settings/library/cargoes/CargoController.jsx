Ext.define('Abraxa.view.settings.library.cargoes.CargoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cargoes.cargocontroller',

    onCreate: function (btn) {
        let form = this.lookup('createCargo'),
            view = this.getView(),
            me = this,
            record = view.upVM().get('cargo'),
            cargoes = view.upVM().get('commodities'),
            file = view.upVM().get('file'),
            currentUserType = view.upVM().get('currentUserType'),
            editMode = view.upVM().get('editMode');
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.save({
                success: function (rec) {
                    if (editMode) {
                        Ext.toast('Record updated', 1000);
                        if (cargoes) {
                            cargoes.load({
                                callback: function (records, operation, success) {
                                    // // the operation object
                                    // // contains all of the details of the load operation

                                    let grid = Ext.ComponentQuery.query('settings\\.library\\.cargoes\\.grid')[0];
                                    grid.select(record);
                                },
                            });
                        }
                        btn.toggle();
                        view.destroy();
                    } else {
                        if (file) {
                            me.upload(file, record).then(function (result) {
                                if (result) {
                                    Ext.toast('Record created', 1000);
                                    if (cargoes) {
                                        cargoes.load({
                                            callback: function (records, operation, success) {
                                                // // the operation object
                                                // // contains all of the details of the load operation
                                                // let grid = Ext.ComponentQuery.query('settings\\.library\\.cargoes\\.grid')[0];
                                            },
                                        });
                                    }
                                    btn.toggle();
                                    view.destroy();
                                } else {
                                    Ext.Msg.alert('Something went wrong', 'Something went wrong');
                                }
                            });
                        } else {
                            Ext.toast('Record created', 1000);
                            if (cargoes) {
                                cargoes.load({
                                    callback: function (records, operation, success) {
                                        if (success == true) {
                                            Ext.Array.each(records, function (value) {
                                                if (value.get('id') === rec.get('id')) {
                                                    let grid = Ext.ComponentQuery.query(
                                                        'settings\\.library\\.cargoes\\.grid'
                                                    )[0];
                                                    grid.select(value);
                                                }
                                            });
                                        }
                                    },
                                });
                            }
                            btn.toggle();
                            view.destroy();
                        }
                    }
                },
            });
        } else {
            btn.toggle();
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    upload: function (file, record) {
        return new Ext.Promise(function (resolve, reject) {
            let fd = new FormData();
            fd.append('files[]', file[0]);

            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'companies/commodity_upload_image/' + record.get('id'),
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
    onFileChange: function (element) {
        var files = event.target.files,
            self = this; // the controller
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        for (var i = 0; i < files.length; i++) {
            self.getView().upVM().set('file', element.getFiles());
            Ext.ComponentQuery.query('#imageHeadCommodity')[0].setSrc(URL.createObjectURL(files[i]));
        }
    },
});
