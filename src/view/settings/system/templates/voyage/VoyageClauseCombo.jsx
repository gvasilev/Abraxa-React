Ext.define('Abraxa.view.settings.voyage.VoyageClauseCombo', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'settings.voyage.clause.combo',
    label: 'Choose clause',
    forceSelection: true,
    valueField: 'id',
    displayField: 'name',
    store: {
        type: 'settings.voyage.clause',
        autoLoad: true,
    },
    minChars: 2,
    queryMode: 'local',
});
