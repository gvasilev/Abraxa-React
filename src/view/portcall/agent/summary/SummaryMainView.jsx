import './SummaryLeftContainer.jsx';
import './SummaryMiddleContainer.jsx';
import './SummaryRightContainer.jsx';
Ext.define('Abraxa.view.portcall.summary.SummaryMainView', {
    extend: 'Ext.Container',
    xtype: 'summary.main',
    bodyCls: 'a-summary-main a-layout-card-wrap',
    layout: 'fit',
    flex: 1,
    items: [
        {
            layout: 'hbox',
            plugins: {
                lazyitems: {
                    items: [
                        {
                            xtype: 'container',
                            flex: 2,
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'portcall.summary.left.container',
                                },
                                {
                                    xtype: 'portcall.summary.middle.container',
                                },
                            ],
                        },
                        {
                            xtype: 'portcall.summary.right.container',
                        },
                    ],
                },
            },
        },
    ],
});
