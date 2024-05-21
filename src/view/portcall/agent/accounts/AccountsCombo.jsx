Ext.define('Abraxa.view.portcall.accounts.AccountsCombo', {
    extend: 'Ext.field.Select',
    xtype: 'accounts.combo',
    label: 'Account',
    displayField: 'org_name',
    valueField: 'id',
    queryMode: 'local',
    bind: {
        store: '{accounts}',
    },
});
