import './MainController.js';
import './MainToolbar.js';
import './MainViewModel';
import '../../core/components/AbraxaDiv.jsx';
import '../../core/override/Abraxa.Component.js';
import './NotificationsMenu.jsx';
import './MainHeader';
import '../dashboard/DashboardMainContainer';
import '../cdb/MainView';
import '../inbox/InboxMainView';
import '../cdb/company/Company.jsx';
import '../profile/ProfileMainContainer';
import '../billing/BillingMainContainer';
import '../search/SearchPanel';
import '../tasks/TasksMainContainer';
import '../portnews/PortNewsMainContainer';
import '../inquiry/InquiryMainView';

Ext.define('Abraxa.view.main.MainViewport', {
    id: 'main-viewport',
    // itemId: "main-viewport",
    extend: 'Ext.Container',
    layout: 'fit',
    xtype: 'MainViewPort',
    cls: 'abraxa-viewport',
    testId: 'abxViewport',
    weighted: true,
    controller: 'main-controller',
    viewModel: 'main-viewmodel',
    // bind: {
    //     // bodyCls: '{fullscreen ? "" : "a-main-container-wrap"}',
    //     bodyCls: 'a-main-container-wrap',
    // },
    // flex: 1,
    masked: {
        xtype: 'viewport.mask'
    },
    items: [
        {
            xtype: 'main.toolbar',
        },
        {
            xtype: 'main.notificationmenu',
        },
        {
            xtype: 'sheet',
            // floated: true,
            id: 'uploadProgress',
            cls: 'a-bgr-transparent upload_sheet',
            padding: 16,
            bodyCls: 'a-bgr-transparent',
            // bottom: 60,
            shadow: false,
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'middle',
            },
            bottom: 32,
            hidden: true,
            modal: true,
            hideOnMaskTap: true,
            width: '100%',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-bgr-white border-radius file_upload_container',
                    width: 420,
                    html:
                        '<div class="sm-title">Uploading files...</div>' +
                        '<div class="a-uploading-progress">' +
                        '<div class="a-progress-bar a-bar-1"></div>' +
                        '<div class="a-progress-bar a-bar-2"></div>' +
                        '</div>',
                    padding: '12 16',
                    shadow: true,
                    // centered: true
                },
            ],
        },
    ],
});
