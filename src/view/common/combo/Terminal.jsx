Ext.define('Abraxa.view.common.combo.Terminal', {
    extend: 'Ext.field.ComboBox',
    xtype: 'port.terminals',
    label: 'Terminals',
    selectable: true,
    forceSelection: true,
    placeholder: 'Enter terminal',
    valueField: 'id',
    displayField: 'name',
    // triggers: {
    //     search: {
    //         side: 'right',
    //         iconCls: 'md-icon-search',
    //         style: 'padding: 0px 16px;',
    //     }
    // },
    queryMode: 'local',
});
