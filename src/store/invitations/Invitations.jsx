import '../../model/invitation/Invitation.jsx';
Ext.define('Abraxa.store.invitations.Invitations', {
    extend: 'Ext.data.Store',
    alias: 'store.invitations',
    storeId: 'invitations',
    model: 'Abraxa.model.invitation.Invitation',
    autoLoad: false,
    config: {
        invitationId: null,
    },
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall-invitation',
    },

    onProxyLoad: function (operation) {
        //this.callParent([operation]);

        this.doSomething();
    },

    doSomething: function () {
        let id = this.invitation_id;
        if (id) {
            let record = this.getById(id);
            Abraxa.getApplication().getController('AbraxaController').showInviteDialog(record);
            this.invitation_id = null;
        }
    },
    sorters: [
        {
            property: 'id',
            direction: 'DESC',
        },
    ],
});
