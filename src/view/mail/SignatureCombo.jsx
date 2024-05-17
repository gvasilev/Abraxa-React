Ext.define('Abraxa.view.mail.SignatureCombo', {
    extend: 'Ext.field.Select',
    xtype: 'sendmail-signature-combo',
    placeholder: 'Choose signature',
    displayField: 'name',
    valueField: 'id',
    queryMode: 'local',
    editable: false,
    cls: 'non-editable',
    forceSelection: true,
    bind: {
        store: '{currentUser.signatures}',
    },
    listeners: {
        painted: function (me) {
            let store = me.getStore();
            if (store) {
                let defaultRecord = store.findRecord('is_default', true, false, false, true);
                if (defaultRecord) {
                    me.setValue(defaultRecord.get('id'));
                }
            }
        },
    },
});
