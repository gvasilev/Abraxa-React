Ext.define('Abraxa.view.common.combo.AssignToCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'common-combo-assingtocombo',
    valueField: 'id',
    displayField: 'full_name',
    labelAlign: 'top',
    placeholder: 'Choose',
    bind: {
        store: '{users}',
    },
    editable: true,
    forceSelection: true,
    queryMode: 'local',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
    },
});
