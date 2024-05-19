import '../DirectoryController.jsx';
import './AgentDetailsViewModel.jsx';
import './AgentPublicProfile.jsx';
Ext.define('Abraxa.view.directory.agents.DirectoryAgentsContainer', {
    extend: 'Ext.Container',
    xtype: 'DirectoryAgentsContainer',
    reference: 'DirectoryAgentsContainer',
    controller: 'DirectoryController',
    viewModel: 'AgentDetailsViewModel',
    flex: 1,
    cls: 'a-directory-main-container',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'AgentPublicProfile',
                    hidden: false,
                    showAnimation: 'slide',
                    flex: 1,
                },
            ],
        },
    },
});
