Ext.define('Abraxa.view.portcall.MembersCombo', {
    extend: 'Ext.field.Select',
    xtype: 'members.combo',
    displayTpl: '{company.name}',
    itemTpl: '{company.name}',
    valueField: 'id',
    queryMode: 'local',
    placeholder: 'Choose member',
    editable: false,
    name: 'tenant_field',
    forceSelection: true,
    bind: {
        store: '{participants}',
    },
    emptyText: 'no members',
    itemTpl:
        '<div class="party-item">' +
        '<div class="sm-function function-A"><i class="md-icon md-18">business</i></div>' +
        '<a href="javascript:void(0);" class="sm-company fw-b" data-company-id="{record.org_id}">{record.org_name}</a><div class="sm-type">{record.org_email}</div>' +
        '</div>',
});
