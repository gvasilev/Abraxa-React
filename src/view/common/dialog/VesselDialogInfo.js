import './VesselMainDetails';
import './VesselTechnical';
import './VesselManagment';

Ext.define('Abraxa.view.common.dialog.VesselDialogInfo', {
    extend: 'Ext.Container',
    xtype: 'vessel.dialog.info',
    ui: 'transparent',
    margin: '56 0 0',
    testId: 'vesselDialogInfo',
    layout: {
        type: 'card',
        animation: 'fade',
    },
    items: [
        {
            xtype: 'vessel.main.details',
            padding: '0 32',
        },
        {
            xtype: 'vessel.main.technical',
            padding: '0 32',
        },
        {
            xtype: 'vessel.main.managment',
            padding: '0 32',
        },
    ],
});
