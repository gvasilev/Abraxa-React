Ext.define('Abraxa.view.settings.library.vessels.VesselDialogInfoForm', {
    extend: 'Ext.Container',
    xtype: 'vessel.dialog.infoform',
    layout: {
        type: 'card',
        animation: null,
    },
    margin: '56 32 0',
    items: [
        {
            xtype: 'vessel.main.detailsform',
        },
        {
            xtype: 'vessel.main.technicalform',
        },
        {
            xtype: 'vessel.main.managmentform',
        },
    ],
});
