import './HolidaysGrid';

Ext.define('Abraxa.view.common.dialog.port.PortHolidays', {
    extend: 'Ext.Container',
    xtype: 'port.dialog.holidays',
    items: [
        {
            xtype: 'abraxa.container',
            flex: 1,
            items: [
                {
                    xtype: 'div',
                    padding: '0 32',
                    html: '<h2>Holidays</h2>',
                },
                {
                    xtype: 'common.port.holidaysgrid',
                },
            ],
        },
    ],
});
