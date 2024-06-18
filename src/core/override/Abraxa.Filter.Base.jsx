Ext.define('Abraxa.Filter.Base', {
    override: 'Ext.grid.plugin.filterbar.filters.Date',

    setValue: function (value) {
        if (Ext.isDate(value)) {
            value = Abraxa.getApplication().getController('AbraxaController').parseMomentDate(value, 'YYYY-MM-DD');
        }
        var me = this,
            operator = me.getOperator(),
            emptyOp = operator === 'empty' || operator === 'nempty';

        me.filter.setValue(value);
        me.value = value;

        if (Ext.isEmpty(value) && !emptyOp) {
            me.setActive(false);
        } else if (me.active) {
            me.updateStoreFilter();
        } else {
            me.setActive(true);
        }
    },
});
