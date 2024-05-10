Ext.define('Abraxa.core.components.combo.SettingsTerminal', {
    extend: 'Ext.field.ComboBox',
    xtype: 'settingsterminal.combo',

    selectable: true,
    forceSelection: true,
    valueField: 'id',
    displayField: 'title',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
    },
    // store: {
    //     type: 'settingsCompanyPortsServedTerminals'
    // },

    queryMode: 'local',
    minChars: 2,

    autoLoad: false,
});
