Ext.define('Abraxa.view.common.combo.PortsServed', {
    extend: 'Ext.field.ComboBox',
    xtype: 'ports.served.combo',
    label: 'Ports',
    selectable: true,
    forceSelection: true,
    placeholder: 'Choose port',
    itemTpl:
        '<div class="combo-item">' +
        '<div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>' +
        '<label class="sm-type">{port.code}</label>' +
        '<div class="sm-value">{port.name}</div>' +
        '</div>',
    valueField: 'port_id',
    displayField: 'port_name',
    // triggers: {
    //     search: {
    //         side: 'right',
    //         iconCls: 'md-icon-search',
    //         style: 'padding-right: 8px;',
    //     },
    //     expand: null,
    // },
    queryMode: 'local',
    store: {
        type: 'ports.served.all',
        autoLoad: true,
    },
});
