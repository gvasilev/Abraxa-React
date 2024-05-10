Ext.define('Abraxa.view.common.combo.GeneralVesselType', {
    extend: 'Ext.field.Select',
    xtype: 'vesseltype.combo',
    label: 'Vessel type',
    forceSelection: true,
    valueField: 'id',
    displayField: 'name',
    store: {
        type: 'vesselTypeStore',
    },
    minChars: 2,
    queryMode: 'local',
});
