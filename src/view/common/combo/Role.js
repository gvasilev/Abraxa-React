Ext.define('Abraxa.view.common.combo.Role', {
    extend: 'Ext.field.ComboBox',
    xtype: 'role.combo',
    label: 'Role',
    selectable: true,
    forceSelection: true,
    placeholder: 'Search role',
    valueField: 'id',
    displayField: 'name',
    triggers: {
        search: null,
    },
    bind: {
        store: '{roles}',
    },
    queryMode: 'local',
});
