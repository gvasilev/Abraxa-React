import './InquiryViewModel';
import './agent/InquiryAgentMainContainer';
import './InquiryHeader';
import './forms/CreateInquiry';

Ext.define('Abraxa.view.inquiry.InquiryMainView', {
    extend: 'Ext.Container',
    xtype: 'inquiries.main',
    layout: 'fit',
    bodyCls: 'a-layout-card-wrap',
    viewModel: 'inquiry-viewmodel',
    bind: {
        items: '{inquiryMainContainer}',
    },
});
