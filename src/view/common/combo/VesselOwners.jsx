Ext.define('Abraxa.view.common.combo.VesselOwners', {
    extend: 'Ext.field.ComboBox',
    xtype: 'vessel.owners',
    label: 'Managing owner',
    selectable: true,
    minChars: 3,
    forceSelection: true,
    placeholder: 'Enter managing owner',
    valueField: 'id',
    displayField: 'name',
    triggers: {
        search: {
            side: 'left',
            iconCls: 'md-icon-search',
            style: 'padding-left: 8px;',
        },
        expand: null,
    },
    store: {
        type: 'vesselOwners',
    },
});
