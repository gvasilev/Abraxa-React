Ext.define('Abraxa.view.mail.RecepientsMultiselect', {
    extend: 'Ext.field.Select',
    xtype: 'abraxa-recepients-multiselect',
    editable: true,
    multiSelect: true,
    onInput: function (e) {
        var me = this,
            value = me.inputElement.dom.value,
            store = me.getStore();
        if (value) {
            store.addFilter(
                new Ext.data.Query({
                    source: 'name like "' + value + '" or email like"' + value + '"',
                })
            );
        } else {
            store.clearFilter();
        }
        me.expand();
    },
});
