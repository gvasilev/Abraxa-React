import './InvitationsViewModel.jsx'
Ext.define('Abraxa.view.invitations.InvitationsLayout', {
    extend: 'Ext.Container',
    xtype: 'invitations.layout',
    viewModel: 'invitations-viewmodel',
    controller: 'invitation-controller',
    cls: 'a-brg-100',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    plugins: {
        lazyitems: {
            items: [
                //     {
                //     xtype: "main.header",
                //     weight: 2,
                //     docked: 'top'
                // },
                {
                    xtype: 'invitations.grid',
                },
            ],
        },
    },
});
