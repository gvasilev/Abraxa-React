Ext.define('Abraxa.view.common.dialog.PortDialogInfo', {
    extend: 'Ext.Container',
    xtype: 'port.dialog.info',
    ui: 'transparent',
    margin: '42 0 0 0',
    layout: {
        type: 'card',
        animation: 'fade',
    },
    items: [
        {
            xtype: 'port.dialog.generalinfo',
        },
        {
            xtype: 'port.dialog.terminals',
        },
        {
            xtype: 'port.dialog.berths',
        },
        {
            xtype: 'port.dialog.holidays',
        },
    ],
});
