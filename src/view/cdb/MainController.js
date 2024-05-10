Ext.define('Abraxa.view.cdb.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cdb.maincontroller',

    init: function () {},

    onTabChange: function (tabs, tab) {
        var mainVM = Ext.getCmp('main-viewport').getVM();
        mainVM.set('routeParams', tab.tab);
        window.history.replaceState({}, '', '#companydatabase/' + tab.tab);
    },

    onCompanyFormSubmit: function (btn) {
        let view = this.getView(),
            form = view.queryById('mainForm'),
            isGlobal = view.getVM().get('isGlobal'),
            is_created = view.getVM().get('is_created'),
            departaments = view.getVM().get('departaments'),
            store,
            combo = view.getVM().get('targetCombo');
        if (isGlobal) {
            if (combo.getStore().source) {
                store = combo.getStore().getSource();
            } else {
                store = combo.getStore();
            }
        } else {
            store = view.upVM().get('organizations');
        }
        if (form.validate()) {
            view.down('form\\.error').setHtml('').hide().removeCls('error');
            if (is_created) {
                let record = view.upVM().get('selectedCompany');
                record.save({
                    success: function (record) {
                        if (combo) {
                            combo.setValue(record.org_id);
                            combo.setInputValue(record.org_name);
                        }
                        record.load();
                        store.add(record);
                        store.sort();
                        Ext.toast('Record created', 1000);
                        mixpanel.track('Created a company');
                        if (!isGlobal) {
                            window.location.hash = '#company/' + record.get('org_id');
                        }
                        view.destroy();
                    },
                    failure: function (record, batch) {
                        var msg = batch.error.response.responseJson.message;
                        btn.toggle();
                        if (combo) {
                            store.rejectChanges();
                        }
                        Ext.Msg.alert('Oops', msg);
                    },
                });
            }
            if (!is_created) {
                let record = view.upVM().get('selectedCompany'),
                    store_record = store.findRecord('org_id', record.get('org_id'), 0, false, false, true),
                    contactStore = view.upVM().get('organizationContacts');
                store_record.set(record.getData());

                if (store_record.isValid()) {
                    if (store.needsSync) {
                        store.sync({
                            success: function (batch) {
                                contactStore.reload();
                                view.destroy();
                                Ext.toast('Record updated', 1000);
                            },
                            failure: function (batch) {
                                var msg = batch.operations[0].error.response.responseJson.message;
                                if (combo) {
                                    store.rejectChanges();
                                }
                                btn.toggle();
                                Ext.Msg.alert('Oops', msg);
                            },
                        });
                    }
                } else {
                    btn.toggle();
                    Ext.Msg.alert('Something went wrong', 'Unable to update record!');
                }
            }
        } else {
            btn.toggle();
            view.down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onContactChangeOwnerFormSubmit: function () {
        var form = this.getView();
        var values = form.getValues();
        var viewModel = form.lookupViewModel();
        var store = viewModel.get('contactdatabase');
        var record = store.findRecord(
            'contact_id',
            viewModel.getData().selectedContact.data.contact_id,
            0,
            false,
            false,
            true
        );

        record.set('org_record_owner', values.org_record_owner);

        store.sync({
            success: function (batch) {
                store.reload();
                form.destroy();
            },
            failure: function (batch) {
                Ext.Msg.alert('Something went wrong', 'Unable to update record!');
            },
        });
    },

    onContactChangeOwnerCancel: function () {
        var form = this.getView();
        form.destroy();
    },
});
