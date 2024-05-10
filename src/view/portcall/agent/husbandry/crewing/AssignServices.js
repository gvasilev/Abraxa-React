Ext.define('Abraxa.view.portcall.husbandry.crewing.AssignServices', {
    xtype: 'husbandry.crewing.assign.service',
    extend: 'Ext.Dialog',
    scrollable: true,
    manageBorders: false,
    closable: true,
    maximizable: false,
    alwaysOnTop: true,
    resizable: true,
    title: 'Assign service',
    controller: 'crewing-controller',
    width: 480,
    minHeight: 480,
    maxHeight: 860,
    padding: '0 24',
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
            ui: 'default',
            handler: function () {
                // standard button (see below)
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Assign',
            ui: 'action',
            handler: 'assignService',
        },
    ],

    items: [
        {
            xtype: 'formpanel',
            header: false,
            padding: 0,
            items: [
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            margin: '24 0 0 0',
                            flex: 1,
                            showAnimation: {
                                type: 'slide',
                                direction: 'right',
                            },
                            bind: {
                                store: '{serviceStore}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-invite-company-item',
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                margin: '0 0 16 0',
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        ui: 'large',
                                        bind: {
                                            boxLabel: '{record.default_expense_item_name}',
                                            name: '{record.default_expense_item_name}',
                                            record: '{record}',
                                        },
                                        labelAlign: 'right',
                                        margin: '0',
                                    },
                                ],
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'normal',
                            iconCls: 'md-icon-add',
                            text: 'Add service',
                            handler: function (me) {
                                let controller = me.find('supplyMainGrid').getController();
                                controller.createService();
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
