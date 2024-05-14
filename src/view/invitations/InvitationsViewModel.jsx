import '../../store/invitations/Invitations.jsx';
Ext.define('Abraxa.view.invitations.InvitationViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.invitations-viewmodel',
    stores: {
        invitations: {
            type: 'invitations',
            autoLoad: true,
            filters: '{invitationFilter}',
            grouper: {
                groupFn: function groupFn(record) {
                    return record.get("object_name");
                }
            },
        },
    },
    formulas: {
        invitationFilter: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                console.log(user);
                if (user) {
                    if (this.get('invitations')) {
                        this.get('invitations').clearFilter();
                    }
                    return function (item) {
                        return item.get('tenant_id') == user.get('current_company_id');
                    };
                }
            },
        },
    },
});
