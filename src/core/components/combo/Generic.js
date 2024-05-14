Ext.define('Abraxa.core.components.combo.Generic', {
    extend: 'Ext.field.ComboBox',
    xtype: 'abraxa.combo.generic',
    minChars: 1,
    queryMode: 'local',
    typeAhead: false,
    selectOnTab: true,
    editable: true,
    forceSelection: true,
    anyMatch: false,
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
    },
    labelAlign: 'top',
    valueField: 'id',
    displayField: 'name',
    floatedPicker: {
        xtype: 'boundlistex2',
        restoreFocus: false,
        infinite: true,
        height: 300,
        maxHeight: 300,
        minimumBufferSize: 5,
        bufferSize: 40,
        scrollToTopOnRefresh: false,
        disableSelection: true,
        navigationModel: {
            disabled: true,
        },
    },
});