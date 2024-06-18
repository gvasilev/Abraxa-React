Ext.define('Abraxa.view.settings.lirbrary.CostCenterShareDialogController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.costcenterShareDialogController',
    comfirmCancel: function () {
        const confirmDialog = this.getView();
        const changes = confirmDialog.getViewModel().get('changes');
        if (changes) {
            Ext.Msg.confirm(
                'Confirmation',
                'Would you like to discard all changes?',
                function (answer) {
                    if (answer === 'yes') {
                        confirmDialog.close();
                    }
                },
                this,
                [
                    {
                        xtype: 'button',
                        itemId: 'no',
                        margin: '0 8 0 0',
                        text: 'Cancel',
                    },
                    {
                        xtype: 'button',
                        itemId: 'yes',
                        enableToggle: true,
                        ui: 'action loading',
                        text: 'Discard',
                    },
                ]
            );
        } else {
            confirmDialog.close();
        }
    },

    adjustComboStore: function (combo) {
        const selectedAgents = combo.up('dialog').getViewModel().get('selectedAgents');
        const comboStore = combo.getStore();
        selectedAgents.each((record) => {
            const comboStoreRecord = comboStore.findRecord('id', record.getId(), 0, false, true, true);
            if (comboStoreRecord) {
                comboStore.remove(comboStoreRecord);
            }
        });
    },

    addAgent: function (combo, selection) {
        const comboStore = combo.getStore();
        const dialogVm = combo.up('dialog').getViewModel();
        const selectedAgents = dialogVm.get('selectedAgents');
        selectedAgents.add(selection);

        const listItems = combo.up('dialog').down('#selectedAgentsList').getInnerItems();
        const lastListItem = listItems[listItems.length - 1];
        const lastOneButton = lastListItem ? lastListItem.query('button')[0] : null;
        if (selection) {
            dialogVm.set('changes', true);
            comboStore.remove(selection);
        }
        //Next lines Fix unexpected behaviour of the list, for some reason button  became hovered
        setTimeout(() => {
            combo.setValue(null);
            combo.setInputValue(null);
            if (lastOneButton) lastOneButton.removeCls('x-hovered');
        }, 0);
    },

    removeAgent: function (button) {
        const record = button.up('container').getRecord();
        const dialogVm = button.up('dialog').getViewModel();
        const selectedAgents = dialogVm.get('selectedAgents');
        const comboStore = button.up('dialog').down('combobox').getStore();
        comboStore.add(record);
        selectedAgents.remove(record);
        dialogVm.set('changes', true);
    },

    saveChanges: function (button) {
        const dialog = button.up('dialog');
        button.setDisabled(true);
        const dialogVm = dialog.getViewModel();
        const selectedAgents = dialogVm.get('selectedAgents');
        const selectedAgentsIds = selectedAgents.collect('id');
        dialog.count = selectedAgents.count();
        Ext.Ajax.request({
            url: Env.ApiEndpoint + 'cost-centers/shares/',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                'Content-Type': 'application/json',
            },
            jsonData: { companies_ids: selectedAgentsIds },
            success: function (response) {
                Ext.toast('Changes saved successfully', 1500);
                dialog.close();
            },
            failure: function (response) {
                let message = 'Error saving changes';
                if (response && response.responseText) {
                    message = JSON.parse(response.responseText).message + ', Error saving changes';
                    Ext.Msg.warning('Error', message);
                }

                Ext.Msg.warning('Error', message);
                dialog.setMasked(false);
                button.toggle();
            },
        });
    },
});
