Ext.define('Abraxa.view.settings.users.UserInvitationGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'settings.user.invitation.grid',
    flex: 1,
    ui: 'bordered',
    cls: 'a-detailed-grid abraxa-grid',
    shadow: false,
    padding: 0,
    bind: {
        store: '{userInvitations}',
    },
    height: '100%',
    columns: [
        {
            text: 'ID',
            dataIndex: 'id',
            width: 80,
            hidden: true,
            cell: {
                cls: 'a-cell-id',
            },
            renderer: function renderer(value, metaData, record, row, col, store, gridView) {
                return value;
            },
        },
        {
            text: 'Name',
            dataIndex: 'first_name',
            groupable: false,
            width: 260,
            cell: {
                cls: 'a-cell-person',
                encodeHtml: false,
            },
            renderer: function (value, record) {
                var assigned_to = record.get('first_name')[0] + '. ' + record.get('last_name');
                return (
                    '<a class="a-person a_grid_action a-vessel-name" href="javascript:void(0)"><i class="md-icon-outlined">person</i>' +
                    assigned_to +
                    '</a>'
                );
            },
        },
        {
            text: 'Email',
            dataIndex: 'email',
            groupable: false,
            width: 240,
            cell: {
                cls: 'a-cell-email',
                encodeHtml: false,
            },
            renderer: function renderer(val) {
                return '<a class="a_grid_action a-mail"><span class="text-truncate">' + val + '</span></a>';
            },
        },
        {
            text: 'Invited by',
            dataIndex: 'invited_by',
            width: 260,
            cell: {
                cls: 'a-cell-person',
                encodeHtml: false,
            },
            renderer: function (user_id) {
                if (user_id) {
                    var userStore = this.upVM().get('users'),
                        user = userStore.getById(user_id);

                    if (user.data.profile_image == '') {
                        return [
                            '<div class="a-person a-icon-round"><div class="x-icon-el x-font-icon md-icon-person"></div>' +
                                user.data.first_name[0] +
                                '. ' +
                                user.data.last_name +
                                '</div>',
                        ].join('');
                    } else {
                        return [
                            '<div class="a-person a-icon-round"><img height="24" src="' +
                                user.data.profile_image +
                                '" /> ' +
                                user.data.first_name[0] +
                                '. ' +
                                user.data.last_name +
                                '</div>',
                        ].join('');
                    }
                }
            },
        },
        {
            dataIndex: 'created_at',
            text: 'Sent',
            minWidth: 180,
            flex: 1,
            renderer: function (value, record) {
                if (value) {
                    return Abraxa.getApplication()
                        .getController('AbraxaController')
                        .parseMomentDate(value, AbraxaConstants.formatters.date.dayAbbrMonYearHyphenTime24);
                } else {
                    return AbraxaConstants.placeholders.emptyValue;
                }
            },
        },
    ],
});
