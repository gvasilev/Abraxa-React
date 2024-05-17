Ext.define('Abraxa.view.mail.TemplateCombo', {
    extend: 'Ext.field.Select',
    xtype: 'sendmail-template-combo',
    placeholder: 'Choose template',
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    flex: 1,
    editable: false,
    cls: 'non-editable',
    forceSelection: true,
    bind: {
        store: '{mailTemplates}',
    },
});
