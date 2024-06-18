Ext.define('Abraxa.Datefield', {
    extend: 'Ext.field.Date',
    xtype: 'abraxa.datefield',
    placeholder: 'dd/mm/yy',
    dateFormat: 'd/m/y',
    momentFormat: 'DD/MM/YY',
    // parseValidator: null,
    altFormats: 'j/m/Y|' + 'd/m/Y|' + 'dm|' + 'd/m|' + 'dmy|' + 'j|' + 'd|' + 'z',
    floatedPicker: {
        xtype: 'datepanel',
        autoConfirm: true,
        startDay: 1,
        floated: true,
    },
});
