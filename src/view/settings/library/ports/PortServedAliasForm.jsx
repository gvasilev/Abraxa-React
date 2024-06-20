Ext.define('Abraxa.view.settings.library.ports.PortServedAliasForm', {
    xtype: 'settings.lybrary.port.served.alias.form',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    cls: 'a-dialog-has-icon',
    bind: {
        title: '<div class="a-badge a-badge-default"><i class="material-icons-outlined">numbers</i></div>{title}',
    },
    manageBorders: false,
    closable: true,
    centered: true,
    width: 480,
    padding: '8 24 8 72',
    viewModel: true,
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            defaults: {
                clearable: false,
                labelAlign: 'left',
                ui: 'classic hovered-border',
            },
            items: [
                {
                    xtype: 'textfield',
                    label: 'Name',
                    labelAlign: 'left',
                    disabled: true,
                    ui: 'viewonly classic',
                    cls: 'a-field-icon icon-short icon-rounded',
                    bind: {
                        value: '{record.port_name}',
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Reference ID',
                    placeholder: 'Refenrece ID',
                    cls: 'a-field-icon icon-numbers icon-rounded',
                    bind: {
                        value: '{record.reference}',
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                margin: '0 8 0 0',
                handler: function (me) {
                    let vm = me.upVM(),
                        store = vm.get('portsServed');

                    store.rejectChanges();
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{editMode ? "Save" : "Create"}',
                    disabled: '{!record.dirty}',
                },
                handler: function (me) {
                    let dialog = me.up('dialog'),
                        form = dialog.down('formpanel'),
                        vm = me.upVM(),
                        store = vm.get('portsServed'),
                        port = vm.get('record');

                    if (form.validate()) {
                        dialog.down('form\\.error').setHtml('').hide().removeCls('error');

                        store.sync({
                            success: function (rec, operation) {
                                port.load({
                                    success: function () {
                                        Ext.toast('Record updated', 1000);
                                    },
                                });
                                dialog.destroy();
                            },
                            failure: function (batch, operations) {
                                me.toggle();
                            },
                        });
                    } else {
                        dialog
                            .down('form\\.error')
                            .setHtml('Please fill in all required fields')
                            .show()
                            .addCls('error');
                        me.toggle();
                    }
                },
            },
        ],
    },
});
