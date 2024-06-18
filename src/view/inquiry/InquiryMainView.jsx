import './InquiryViewModel';
import './agent/InquiryAgentMainContainer';
import './InquiryHeader';
import './forms/CreateInquiry';

Ext.define('Abraxa.view.inquiry.InquiryMainView', {
    extend: 'Ext.Container',
    xtype: 'inquiries.main',
    bodyCls: 'a-layout-card-wrap',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    viewModel: 'inquiry-viewmodel',
    bind: {
        items: '{inquiryMainContainer}',
    },
});
