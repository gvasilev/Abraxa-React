Ext.define('Abraxa.view.common.combo.Member', {
    extend: 'Ext.field.ComboBox',
    xtype: 'member.combo',
    selectable: false,
    forceSelection: true,
    placeholder: 'Search members',
    valueField: 'id',
    displayField: 'org_name',
    triggers: {
        search: null,
    },
    bind: {
        store: '{members_without_admin}',
    },
    queryMode: 'local',
    itemTpl:
        '<div class="party-item">' +
        '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
        '<a href="javascript:void(0);" class="sm-company fw-b">{org_name}</a><div class="sm-type">{org_email}</div>' +
        '</div>',
});
