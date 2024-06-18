Ext.define('Abraxa.field.ComboBox', {
    override: 'Ext.field.ComboBox',
    triggers: {
        clear: {
            handler: function (combo) {
                combo.setValue(null);
                combo.setInputValue(null);
                combo.collapse();
                this.fireEvent('clearicontap', this);
            },
        },
    },

    initialize: function () {
// this.callParent(arguments);
        const combo = this;

        // Ext.util.Observable.capture(this, function (evname) {
        //     console.log('combo: ', evname, arguments);
        // });

        this.on('beforequery', this.onBeforeQuery, this);

        if (combo.getStore() && combo.getQueryMode() === 'remote') {
            combo.getStore().on('load', function (store, records) {
                if (!store.getCount()) combo.collapse();
            });
        }
    },

    onBeforeQuery: function (queryPlan) {
        if (this.getQueryMode() === 'remote') {
            // Preserve the input value before triggering the query
            queryPlan.query = this.getInputValue();
        }
    },
});
