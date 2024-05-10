Ext.define('AbraxaLive.view.settings.system.templates.PDATemplateCreate', {
    extend: 'Ext.Dialog',
    xtype: 'settings.templates.pda.create',
    title: 'Create PDA Template',
    bind: {
        title: '{templateRecord ? "Edit" : "Create"} PDA Template',
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
                            xtype: 'container',
                            layout: 'hbox',
                            margin: '8 0 0 0',
                            defaults: {
                                ui: 'classic',
                                labelAlign: 'top',
                            },
                            items: [
                                {
                                    xtype: 'ports.served.combo',
                                    label: 'Port',
                                    name: 'port_id',
                                    flex: 9,
                                    margin: '0 4 0 0',
                                    bind: {
                                        value: '{templateRecord.port_id}',
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    label: 'Currency',
                                    name: 'currency',
                                    valueField: 'name',
                                    displayField: 'name',
                                    margin: '0 0 0 4',
                                    flex: 3,
                                    value: 'EUR',
                                    bind: {
                                        value: '{templateRecord.currency}',
                                    },
                                    options: [
                                        {
                                            name: 'EUR',
                                        },
                                        {
                                            name: 'USD',
                                        },
                                        {
                                            name: 'GBP',
                                        },
                                    ],
                                },
                            ],
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
                    let store = btn.lookupViewModel().get('pdaTemplate');
                    store.add(form.getValues());
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record created', 1000);
                            btn.up('dialog').destroy();
                        },
                        failure: function (batch, operations) {
                            form.down('form\\.error').setHtml('').show().addCls('error');
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
                    let store = btn.lookupViewModel().get('pdaTemplate');
                    store.sync({
                        success: function (batch, opt) {
                            Ext.toast('Record updated', 1000);
                            btn.up('dialog').destroy();
                        },
                        failure: function (batch, operations) {
                            form.down('form\\.error').setHtml('laino').show().addCls('error');
                        },
                    });
                } else {
                    form.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                }
            },
        },
    ],
});
