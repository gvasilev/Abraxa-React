Ext.define('Abraxa.data.Store', {
    override: 'Ext.data.Store',
    autoLoad: false,
    onBatchException: function (batch, operation) {
        this.rejectChanges();
    },
});
