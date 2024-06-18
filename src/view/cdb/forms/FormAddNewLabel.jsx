Ext.define('Abraxa.view.cdb.forms.FormAddNewLabel', {
    xtype: 'companydabata.createlabel',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'Create label',
    ui: 'dialog-sm type3',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 360,
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
            padding: 0,
            items: [
                {
                    xtype: 'textfield',
                    label: 'Type/Label',
                    required: true,
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-label icon-rounded',
                    clearable: false,
                    placeholder: 'Enter type/label',
                    labelAlign: 'top',
                    maxRows: 8,
                    bind: '{record.org_t_name}',
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
            margin: '0 8 0 0',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Create',
            ui: 'action',
            handler: function (item, el) {
                var me = this;
                let dialog = this.up('dialog');
                let record = dialog.getViewModel().get('record');
                let form = dialog.down('formpanel');
                let combo = dialog.getViewModel().get('targetCombo');
                let companyRecord = this.upVM().get('companyRecord');
                if (form.validate()) {
                    if (Ext.getCmp('main-viewport').find('cdbMainView')) {
                        var store = Ext.getCmp('main-viewport').find('cdbMainView').getVM().get('types');
                    } else {
                        var store = combo.getStore();
                    }
                    store.add({
                        org_t_name: record.get('org_t_name'),
                    });
                    store.sync({
                        success: function (batch) {
                            var response = batch.operations[0]._response.responseJson;
                            if (combo.getValue()) {
                                combo.getStore().reload({
                                    callback: function (records, operation, success) {
                                        let currentValue = combo.getValue();
                                        var index = currentValue.indexOf(response.org_t_name);
                                        if (index !== -1) {
                                            currentValue.splice(index, 1);
                                        }
                                        currentValue.push(response.org_t_id);
                                        combo.clearValue();
                                        combo.setValue(Ext.Array.unique(currentValue));
                                        companyRecord.set('org_types', Ext.Array.unique(currentValue));
                                        combo.focus();
                                        combo.select();
                                        dialog.destroy();
                                        Ext.toast('Record created');
                                    },
                                });
                            } else {
                                combo.getStore().reload({
                                    callback: function (records, operation, success) {
                                        let currentValue = [];
                                        currentValue.push(response.org_t_id);
                                        combo.clearValue();
                                        combo.setValue(Ext.Array.unique(currentValue));
                                        companyRecord.set('org_types', Ext.Array.unique(currentValue));
                                        combo.focus();
                                        combo.select();
                                        dialog.destroy();
                                        Ext.toast('Record created');
                                    },
                                });
                            }
                        },
                    });
                }
            },
        },
    ],
});
