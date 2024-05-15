Ext.define('Abraxa.view.settings.user_teams.teams.UsersHeads', {
    extend: 'Ext.dataview.DataView',
    xtype: 'teams.users.heads',
    inline: true,
    deferEmptyText: false,
    emptyTextDefaults: null,
    itemTpl: new Ext.XTemplate(
        '<div class="cursor-pointer"><div class="a-person a-icon-round no_show"  data-qtip="{[this.displayTooltip(values)]}" data-qoverflow="true" data-qalign="b-t?" data-qanchor="true">{[this.parceString(values)]}</div></div>',
        {
            parceString: function (user) {
                if (user) {
                    if (user.profile_image && user.profile_image != '') {
                        let img = user.profile_image;
                        return (
                            '<img data-id="last_updated_by_appointments" class="no_show a-profile-image" height="30" src="' +
                            img +
                            '">'
                        );
                    } else {
                        let abbr = user.first_name[0] + user.last_name[0];
                        return '<span class="a-int no_show">' + abbr + '</span>';
                    }
                }
            },
            displayTooltip: function (user) {
                if (user) {
                    return user.first_name + ' ' + user.last_name;
                }
                return;
            },
        }
    ),
});
