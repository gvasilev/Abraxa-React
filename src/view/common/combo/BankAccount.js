Ext.define('Abraxa.view.common.combo.BankAccount', {
    extend: 'Ext.field.ComboBox',
    xtype: 'bank.account.combo',
    valueField: 'id',
    displayField: 'bank_name',
    labelAlign: 'top',
    label: 'Bank account',
    placeholder: 'Choose',
    cls: 'a-field-icon icon-business-center icon-rounded',
    bind: {
        store: '{bankAccounts}',
    },
    itemCls: 'a-account-listitem',
    itemTpl:
        '<div class="hbox a-verification"><div class="a-badge a-badge-bank mr-12"><i class="md-icon-outlined">account_balance</i></div><div class="a-bank"><div class="a-bank-name">{bank_name}<i class="md-icon-outlined  ml-2"></i></div><div class="a-bank-iban sm-type">{number_type}: {iban}</div></div><div class="a-bank-currency">{currency}</div></div>',
    forceSelection: false,
    matchFieldWidth: true,
    queryMode: 'local',
    listeners: {
        painted: function (me) {
            let store = me.getStore();
            if (store) {
                let defaultRecord = store.findRecord('is_default', true, false, false, true);
                if (defaultRecord && !me.getValue()) {
                    me.setValue(defaultRecord.get('id'));
                }
            }
        },
    },
});
