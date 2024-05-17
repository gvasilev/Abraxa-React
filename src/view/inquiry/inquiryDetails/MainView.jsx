import './InquiryDetailsViewModel';
import './ProformaInquiry';
import './ProformaRightContainer';
import './InquiryDetailsHeader';

Ext.define('Abraxa.view.inquiry.inquiryDetails.MainView', {
    extend: 'Ext.Container',
    xtype: 'inquiry.main',
    //important alias to render view from roter handleDataRoute !
    alias: 'widget.inquiry',
    bodyCls: 'a-layout-card-wrap',
    flex: 1,
    scrollable: true,
    layout: {
        type: 'hbox',
        align: 'stretch',
    },
    viewModel: 'inquiry-details-viewmodel',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'proforma.inquiry',
        },
        {
            xtype: 'proforma.right.container',
        },
    ],
});
