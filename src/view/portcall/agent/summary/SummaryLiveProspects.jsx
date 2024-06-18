Ext.define('Abraxa.view.portcall.summary.SummaryLiveProspects', {
    extend: 'Abraxa.core.components.Container',
    xtype: 'portcall.summary.live.prospects',
    cls: 'a-summary-live-prospects',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'chatter',
        },
    ],
});
