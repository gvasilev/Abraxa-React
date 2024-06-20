Ext.define('AbraxaLive.view.settings.system.templates.voyage.VoyageTemplateCreate', {
    extend: 'Ext.Dialog',
    xtype: 'settings.templates.voyage.create',
    title: 'Create PDA Template',
    bind: {
        title: '{templateRecord ? "Edit" : "Create"} Voyage Template',
    },
    minWidth: 380,
    closable: true,
    padding: 0,
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            ui: 'no-border-radius',
            items: [
                {
                    xtype: 'form.error',
                    docked: 'top',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'container',
                    padding: 16,
                    defaults: {
                        labelAlign: 'top',
                        ui: 'classic',
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            label: 'Template name',
                            name: 'name',
                            required: true,
                            bind: {
                                value: '{templateRecord.name}',
                            },
                        },
                        {
                            xtype: 'ports.served.combo',
                            label: 'Port',
                            name: 'port_id',
                            bind: {
                                value: '{templateRecord.port_id}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Create',
            hidden: true,
            bind: {
                hidden: '{templateRecord ? true : false}',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel');

                if (form.validate()) {
                    let store = btn.lookupViewModel().get('voyageTemplate');
                    store.add(form.getValues());
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record created', 1000);
                            btn.up('dialog').destroy();
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
        {
            text: 'Save',
            hidden: true,
            bind: {
                hidden: '{templateRecord ? false : true}',
            },
            handler: function (btn) {
                let form = this.up('dialog').down('formpanel');
                if (form.validate()) {
                    let store = btn.lookupViewModel().get('voyageTemplate');
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record updated', 1000);
                            btn.up('dialog').destroy();
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
