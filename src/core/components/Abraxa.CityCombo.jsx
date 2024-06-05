Ext.define('Abraxa.core.components.AbraxaCityCombo', {
    extend: 'Ext.form.field.ComboBox',
    requires: [
        'Ext.form.field.ComboBox',
    ],
    xtype: 'city.combo',
    label: 'City',
    required: true,
    disabled: true,
    forceSelection: true,
    valueField: 'id',
    displayField: 'city_name',
    triggers: {
        search: {
            side: 'right',
            iconCls: 'md-icon-search',
            style: 'padding-right: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'cityStore',
    },
    minChars: 3,
    queryMode: 'local',
    queryDelay: 500,
    listeners: {
        expand: function (combo) {
            combo.getPicker().element.dom.style.minHeight = 0;
        },
    },
});
