Ext.define('Abraxa.view.invitations.invite.InvitationMainBody', {
    extend: 'Ext.Container',
    xtype: 'invitaion.main.body',
    controller: 'invitation-controller',
    viewModel: 'invitation-main-viewmodel',
    itemId: 'mainBody',
    cls: 'a-portcall-info',
    layout: 'vbox',
    items: [
        {
            xtype: 'invitaion.content',
        },
        {
            xtype: 'toolbar',
            height: 64,
            cls: 'a-bt-100',
            border: true,
            padding: '12 16',
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            bind: {
                items: '{toolbarItems}',
            },
        },
    ],
});
