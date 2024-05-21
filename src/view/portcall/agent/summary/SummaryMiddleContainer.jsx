import './SummaryEventsChart.jsx';
Ext.define('Abraxa.view.portcall.summary.SummaryMiddleContainer', {
    extend: 'Ext.Container',
    xtype: 'portcall.summary.middle.container',
    cls: 'a-summary-middle-container',
    scrollable: true,
    layout: 'vbox',
    items: [
        {
            xtype: 'portcall.summary.events.chart',
        },
    ],
});
