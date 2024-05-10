Ext.define('Abraxa.view.adocs.CreateEditFolder', {
    xtype: 'adocs.createeditfolder',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'Create folder',
    ui: 'dialog-sm type3',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 520,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    defaults: {
        labelWidth: 60,
        labelSeparator: '',
        ui: 'classic',
        labelAlign: 'top',
    },
    items: [
        {
            xtype: 'formpanel',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-form',
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Folder',
                            required: true,
                            ui: '',
                            placeholder: 'Folder name',
                            labelAlign: 'top',
                            width: '100%',
                            clearable: false,
                            bind: {
                                value: '{record.folder_name}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Cancel',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Save',
            ui: 'action',
            handler: function (item, el) {
                let me = this,
                    dialog = this.up('dialog'),
                    form = dialog.down('formpanel'),
                    record = me.upVM().get('record'),
                    folderStore = me.upVM().get('folders'),
                    action = me.upVM().get('action');
                if (form.validate()) {
                    if (action === 'edit') {
                        let storeRecord = store.findRecord('id', record.get('id'));
                        if (storeRecord) {
                            storeRecord.set(record.getData());
                            if (store.needsSync) {
                                store.sync({
                                    success: function (err, msg) {
                                        store.reload();
                                        dialog.destroy();
                                        Ext.toast('Record updated', 1000);
                                    },
                                    failure: function (batch) {
                                        var response = batch.operations[0].error.response.responseJson;
                                        Ext.Msg.alert('Something went wrong', response.message);
                                    },
                                });
                            } else {
                                dialog.destroy();
                            }
                        }
                    } else {
                        folderStore.add(record);
                        folderStore.sync({
                            success: function (err, msg) {
                                dialog.destroy();
                                Ext.toast('Record created', 1000);
                            },
                            failure: function (batch) {
                                var response = batch.operations[0].error.response.responseJson;
                                Ext.Msg.alert('Something went wrong', response.message);
                            },
                        });
                    }
                }
            },
        },
    ],
});
