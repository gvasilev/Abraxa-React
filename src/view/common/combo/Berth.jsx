Ext.define('Abraxa.view.common.combo.Berth', {
    extend: 'Ext.field.ComboBox',
    xtype: 'port.berths',
    label: 'Berth',
    selectable: true,
    forceSelection: true,
    placeholder: 'Enter berth',
    valueField: 'id',
    displayField: 'name',
    // triggers: {
    //     search: {
    //         side: 'right',
    //         weight: 0,
    //         iconCls: 'md-icon-search'
    //     },
    //     expand: {
    //         side: 'right',
    //         weight: 1,
    //     }
    // },
    queryMode: 'local',
});
