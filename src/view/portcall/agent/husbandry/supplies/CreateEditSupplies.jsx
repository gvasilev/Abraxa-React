import './Service';

Ext.define('Abraxa.view.portcall.husbandry.supplies.CreateEditSupplies', {
    extend: 'Ext.Dialog',
    xtype: 'husbandry.supplies.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    closable: true,
    showAnimation: 'pop',
    scrollable: 'y',
    width: 580,
    alwaysOnTop: 2,
    // height: '100%',
    minHeight: 420,
    maxHeight: 800,
    draggable: false,
    padding: 0,
    testId: 'husbCreateEdidSupplies',
    bind: {
        title: '{dialogTitle}',
    },
    controller: 'supplies-controller',
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'husbandry.service',
                },
            ],
        },
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            // showAnimation: 'fadeIn',
            docked: 'top',
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            testId: 'husbCreateEdidSuppliesCancelBtn',
            handler: function () {
                let record = this.upVM().get('record');
                record.reject();
                this.up('dialog').destroy();
            },
        },
        {
            bind: {
                text: '{editMode ? "Save" : "Create"}',
            },
            testId: 'husbCreateEdidSuppliesCreateBtn',
            enableToggle: true,
            ui: 'action loading',
            handler: 'onCreate',
        },
    ],
});
