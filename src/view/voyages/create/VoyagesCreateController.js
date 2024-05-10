Ext.define('Abraxa.view.voyages.create.VoyagesCreateController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.voyages-create-controller',

    init: function () {
        var bbar = this.lookup('voyagesCreateBbar'),
            card = this.getView().down('panel').getLayout(),
            // Lazily create the Indicator (wired to the card layout)
            indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(1, indicator);
    },

    onNext: function () {
        var panel = this.lookup('voyages_create_card'),
            card = panel.getLayout(),
            index = panel.getActiveItemIndex(),
            form = null;

        switch (index) {
            case 0:
                form = this.lookup('voyages_create_general');
                break;
            case 1:
                form = this.lookup('voyages_create_agent_information');
                break;
            default:
        }
        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            card.next();
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },

    onPrevious: function () {
        var card = this.getView().down('panel').getLayout();
        if (!card.getIndicator().getActiveIndex()) {
            Ext.ComponentQuery.query('registration\\.container')[0].hide();
            Ext.ComponentQuery.query('login\\.dialog')[0].show();
        } else {
            card.previous();
        }
    },

    onCreate: function () {
        let form = this.lookup('voyages_create_agent_information'),
            view = this.getView(),
            record = view.upVM().get('voyage'),
            store = view.upVM().get('voyages'),
            editMode = view.upVM().get('editMode');

        if (form.validate()) {
            this.getView().down('form\\.error').hide();
            record.setInquiry(view.upVM().get('inquiry'));
            if (editMode) {
                let cargoStore = record.getInquiry().cargoes(),
                    invitationStore = record.invitations();
                cargoStore.getProxy().setExtraParams({
                    object_id: 4,
                    object_meta_id: record.get('id'),
                });
                invitationStore.getProxy().setExtraParams({
                    object_id: 4,
                    object_meta_id: record.get('id'),
                });
                cargoStore.sync();
                invitationStore.sync();
            }
            record.save({
                callback: function (records, operation, success) {
                    if (success) {
                        if (editMode) {
                            record.load();
                            Ext.toast('Record updated', 1000);
                        } else {
                            Ext.toast('Record created', 1000);
                            record.load({
                                success: function () {
                                    store.add(record);
                                },
                            });
                        }
                        view.destroy();
                    } else {
                        Ext.Msg.alert('Error', operation.error.response.responseJson.message);
                    }
                },
            });
        } else {
            this.getView().down('form\\.error').setHtml('Please fill all required fields').show().addCls('error');
        }
    },
});
