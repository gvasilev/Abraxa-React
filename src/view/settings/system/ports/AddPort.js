Ext.define('Abraxa.view.settings.ports.AddPort', {
    xtype: 'settings.system,ports.add',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'Add port',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 360,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    items: [
        {
            xtype: 'port.combo',
            testId: 'settingsSystemPortsAddPortComboTestId',
            label: 'Port',
            forceSelection: true,
            required: true,
            ui: '',
            cls: 'a-field-icon icon-place',
            placeholder: 'Choose port',
            labelAlign: 'top',
            bind: {
                value: '{record.port_id}',
            },
            listeners: {
                painted: function (me) {
                    me.focus();
                },
            },
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        // ui: 'toolbar-panel-bottom',
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
            text: 'Add',
            testId: 'settingsSystemPortsAddPortButtonTestId',
            ui: 'action',
            handler: function (me) {
                let store = me.upVM().get('portsserved'),
                    record = me.upVM().get('record');

                if (record.get('port_id')) {
                    store.add(record);
                    store.sync({
                        success: function () {
                            Ext.toast('Record created', 1000);
                            store.reload();
                            me.up('dialog').destroy();
                        },
                        failure: function (batch, functions) {
                            Ext.Msg.alert('Oops', batch.operations[0].error.response.responseJson.message);
                            store.rejectChanges();
                        },
                    });
                }
            },
        },
    ],
});
