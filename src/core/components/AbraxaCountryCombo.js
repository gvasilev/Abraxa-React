Ext.define('Abraxa.core.components.AbraxaCountryCombo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'country.combo',
    label: 'Country',
    forceSelection: true,
    valueField: 'id',
    selectable: false,
    displayField: 'country_name',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
    },
    bind: {
        store: '{countryStore}',
    },
    // store: {
    //     type: 'countryStore',
    // },
    minChars: 2,
    queryMode: 'local',
});
