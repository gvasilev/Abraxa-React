import '../../../store/common/Port';

Ext.define('Abraxa.core.components.combo.Port', {
    extend: 'Ext.field.ComboBox',
    xtype: 'port.combo',
    // itemId: 'portCombo',
    label: 'Ports',
    minChars: 3,
    forceSelection: true,
    placeholder: 'Enter port',
    clearable: true,
    autoFocus: true,
    itemTpl:
        '<div class="combo-item">' +
        '<div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>' +
        '<label class="sm-type">{code}</label>' +
        '<div class="sm-value">{port_name}</div>' +
        '</div>',
    valueField: 'port_id',
    displayField: 'port_name',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'port',
        autoLoad: false,
    },
    queryMode: 'remote',
    config: {
        initialStore: null,
        value: null,
    },
    listeners: {
        beforequery: function () {
            let store = this.getStore();
            if (!store.loadCount) store.load();
        },
    },
});
