Ext.define('Abraxa.view.inquiry.forms.PortsContainerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portsContainerController',

    filterComboStore: function (query) {
        let store = this.getView().upVM().get('object_record').ports();
        let selectedPortIds = store.collect('port_id');
        let comboBox = query.combo;
        let comboStore = comboBox.getStore();

        // Reset the store state to its initial values
        comboStore.clearFilter();

        // Filter the store by selectedPortIds
        comboStore.filterBy(function (rec) {
            let id = rec.get('port_id');
            if (
                selectedPortIds.includes(id) &&
                comboBox.getSelection() &&
                comboBox.getSelection().get('port_id') === id
            ) {
                return true;
            }

            return !selectedPortIds.includes(id);
        });
    },
});
