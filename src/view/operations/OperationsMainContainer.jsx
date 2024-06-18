import './OperationsMainContainerViewModel';
import './PortcallsPrincipal/PortcallsPrincipalMain';
import './DisbursementsPrincipal/DisbursementsPrincipalMain';
import './VoyagePrincipal/VoyagePrincipalMain';

Ext.define('Abraxa.view.operations.OperationsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'OperationsMainContainer',
    bodyCls: 'a-layout-card-wrap a-directory-main-container',
    id: 'operationsMainContainer',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'strech',
    },
    viewModel: 'OperationsMainContainerViewModel',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'PortcallsPrincipalMain',
            bind: {
                hidden: '{activeTabXtype !=="PortcallsPrincipalMain"}',
            },
        },
        {
            xtype: 'DisbursementsPrincipalMain',
            bind: {
                hidden: '{activeTabXtype!=="DisbursementsPrincipalMain"}',
            },
        },
        {
            xtype: 'VoyagePrincipalMain',
            bind: {
                hidden: '{activeTabXtype!=="VoyagePrincipalMain"}',
            },
        },
    ],
});
