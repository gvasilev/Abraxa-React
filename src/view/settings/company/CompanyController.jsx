Ext.define('Abraxa.view.settings.company.SettingsCompanyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.company.controller',

    onCompanySave: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let record = vm.get('currentCompany');
        record.save({
            success: function (batch, opt) {
                Ext.toast('Record updated', 1000);
            },
            failure: function (batch, operations) {
                Ext.Msg.alert('Something went wrong', 'Cannot update company!');
            },
        });
    },

    onBillingDetailsSave: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let record = vm.get('currentCompany');
        record.billings().sync({
            success: function (batch, opt) {
                Ext.toast('Record updated', 1000);
            },
            failure: function (batch, operations) {
                Ext.Msg.alert('Something went wrong', 'Cannot update company!');
            },
        });
    },

    onEmailSave: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let store = vm.get('emailSettingsStore');
        let form = this.getView().down('formpanel');
        if (store.getCount() === 0) {
            //create
            let values = form.getValues();
            let record = {
                email: values.smtp_email,
                smtp_username: values.smtp_username,
                smtp_password: values.smtp_password,
                smtp_server: values.smtp_server,
                smtp_port: values.smtp_port,
                secure_connection: this.getView().find('sslTls').getValue(),
            };
            // if (this.getView().find('sslTls').getValue()) {
            //     record.secure_connection = 'ssl';
            // } else if (this.getView().find('ttlField').getChecked()) {
            //     record.secure_connection = 'ttl';
            // } else {
            //     record.secure_connection = '';
            // }
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

    onEmailTest: function (btn, e, eOpts) {
        let vm = this.getView().upVM();
        let store = vm.get('emailSettingsStore');
        let form = this.getView().down('formpanel');
        //create
        let values = form.getValues();
        let record = {
            email: values.smtp_email,
            smtp_username: values.smtp_username,
            smtp_password: values.smtp_password,
            smtp_server: values.smtp_server,
            smtp_port: values.smtp_port,
            secure_connection: Ext.ComponentQuery.query('[itemId~=sslTls]')[0].getValue(),
        };
        if (form.validate()) {
            Ext.ComponentQuery.query('[cls~=smtp_test_failed]')[0].setHidden(true);
            Ext.ComponentQuery.query('[cls~=smtp_test_success]')[0].setHidden(true);
            Ext.ComponentQuery.query('[cls~=smtp_test_button]')[0].setText('Connecting...');
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'company/test_email_settings',
                jsonData: record,
                success: function (response) {
                    let result = Ext.decode(response.responseText);
                    Ext.ComponentQuery.query('[cls~=smtp_test_button]')[0].toggle();
                    Ext.ComponentQuery.query('[cls~=smtp_test_success]')[0].setHidden(false);
                    Ext.ComponentQuery.query('[cls~=smtp_test_button]')[0].setText('Test connection');
                },
                failure: function failure(response) {
                    let result = Ext.decode(response.responseText);
                    Ext.ComponentQuery.query('[cls~=smtp_test_button]')[0].toggle();
                    Ext.ComponentQuery.query('[cls~=smtp_test_failed]')[0].setHidden(false);
                    Ext.ComponentQuery.query('[cls~=smtp_test_button]')[0].setText('Test connection');
                },
            });
        }
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

    uploadFile: function (element) {
        var files = event.target.files,
            uploadFileName = element.getName(),
            self = this; // the controller
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        var reader = new FileReader();
        reader.onload = function (e) {
            // image content is in e.target.result
            // we can then put it into img.src, for example
            element.find('imageHead').setSrc(e.target.result);
        };
        let companyRecord = this.getView().upVM().get('currentCompany');
        var uploadFiles = element.getFiles();
        var fd = new FormData();
        if (uploadFileName == 'squareCompanyLogo') {
            fd.append('type', 'square');
        } else {
            fd.append('type', 'original');
        }
        fd.append('files', uploadFiles[0]);
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'company/upload_logo',
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                let result = Ext.decode(response.responseText);
                companyRecord.mergeData(result);
                Ext.toast('Record updated', 1000);
                document.querySelector('#' + element.id).value = '';
                self.clearFileUpload(element.id);
                element.setValue(null);
            },
            failure: function failure(response) {
                let result = Ext.decode(response.responseText);
                Ext.Msg.alert('Something went wrong', result.message);
                document.querySelector('#' + element.id).value = '';
                self.clearFileUpload(element.id);
                element.setValue(null);
            },
        });
    },
    clearFileUpload(id) {
        // get the file upload element
        fileField = document.getElementById(id);
        // get the file upload parent element
        parentNod = fileField.parentNode;
        // create new element
        tmpForm = document.createElement('form');
        parentNod.replaceChild(tmpForm, fileField);
        tmpForm.appendChild(fileField);
        tmpForm.reset();
        parentNod.replaceChild(fileField, tmpForm);
    },
    onCurrencyCreate: function (btn, e, eOpts) {
        let vm = this.getView().upVM(),
            dialog = this.getView(),
            store = vm.get('companyCurrencies'),
            record = vm.get('record'),
            editMode = vm.get('editMode'),
            form = this.getView().down('formpanel');
        if (form.validate()) {
            if (editMode) {
                record.save({
                    callback: function (record, operation, success) {
                        if (success) {
                            Ext.toast('Record updated', 1000);
                            store.reload();
                            dialog.destroy();
                        }
                    },
                    failure: function (batch, operations) {
                        Ext.Msg.alert('Something went wrong', 'Cannot update company!');
                    },
                });
            } else {
                if (record.dirty) {
                    record.save({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.toast('Record created', 1000);
                                store.reload();
                                dialog.destroy();
                            }
                        },
                        failure: function (batch, operations) {
                            Ext.Msg.alert('Something went wrong', 'Cannot update company!');
                        },
                    });
                } else {
                    dialog.destroy();
                }
            }
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },
    onBankCreate: function (btn, e, eOpts) {
        let vm = this.getView().upVM(),
            dialog = this.getView(),
            store = vm.get('companyBankDetails'),
            record = vm.get('record'),
            editMode = vm.get('editMode'),
            currentUser = vm.get('currentUser'),
            currentCompany = vm.get('currentCompany'),
            form = this.getView().down('formpanel');
        if (form.validate()) {
            if (editMode) {
                record.save({
                    callback: function (record, operation, success) {
                        if (success) {
                            Ext.toast('Record updated', 1000);
                            store.reload();
                            if (currentCompany && currentCompany.banks()) {
                                let rec = currentCompany.banks().getById(record.get('id'));
                                if (rec) {
                                    rec.mergeData(record.getData());
                                    rec.commit(true);
                                    currentUser.set('update_user', new Date());
                                }
                            }
                            dialog.destroy();
                        }
                    },
                    failure: function (batch, operations) {
                        Ext.Msg.alert('Something went wrong', 'Cannot update company!');
                    },
                });
            } else {
                if (record.dirty) {
                    record.save({
                        callback: function (record, operation, success) {
                            if (success) {
                                Ext.toast('Record created', 1000);
                                store.reload();
                                if (currentCompany && currentCompany.banks()) {
                                    currentCompany.banks().add(record);
                                    currentCompany.banks().commitChanges();
                                    currentUser.set('update_user', new Date());
                                }
                                dialog.destroy();
                            }
                        },
                        failure: function (batch, operations) {
                            Ext.Msg.alert('Something went wrong', 'Cannot update company!');
                        },
                    });
                } else {
                    dialog.destroy();
                }
            }
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    addPreferredHubAgent: function (combo, newValue) {
        const vm = this.getView().upVM();
        const currentUser = vm.get('currentUser');
        const comboSelection = combo.getSelection();
        const companyAppointmentFlowSettings = vm.get('companyAppointmentFlowSettings');

        if (newValue && comboSelection && !currentUser.get('preferred_hub_agent')) {
            companyAppointmentFlowSettings.add({
                tenant_id: currentUser.get('current_company_id'),
                preferred_tenant_id: comboSelection.get('id'),
            });
            companyAppointmentFlowSettings.sync({
                success: function () {
                    Ext.toast('Record updated', 1000);
                    currentUser.set('preferred_hub_agent', {
                        tenant_id: comboSelection.get('id'),
                        tenant_name: comboSelection.get('name'),
                        tenant_email: comboSelection.get('email'),
                    });
                },
                failure: function (batch, operations) {
                    Ext.Msg.alert('Something went wrong', 'Cannot create preferred hub agent!');
                },
            });
        }
    },
    removePreferredHubAgent: function () {
        const companyController = this;
        const vm = companyController.getView().upVM();
        const currentUser = vm.get('currentUser');
        const appointmentFlowSettingModel = vm.get('appointmentFlowSettingModel');
        const companyAppointmentFlowSettings = vm.get('companyAppointmentFlowSettings');
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete this record?', function (answer) {
            if (answer === 'yes') {
                companyAppointmentFlowSettings.remove(appointmentFlowSettingModel);
                companyAppointmentFlowSettings.sync({
                    success: function () {
                        Ext.toast('Record updated', 1000);
                        currentUser.set('preferred_hub_agent', null);
                    },
                    failure: function (batch, operations) {
                        Ext.Msg.alert('Something went wrong', 'Cannot delete preferred hub agent!');
                    },
                });
            }
        });
    },
});
