Ext.define('Abraxa.core.plugins.LazyGridRowBody', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.lazyGridRowBody',

    init: function (comp) {
        // this.callParent(arguments);

        if (this.body) {
            // Eager instantiation means create the body now
            if (this.eagerInstantiation) {
                this.items = comp.prepareItems(this.items);
            }
        }

        // We need to jump in right before the beforeRender call
        comp.onAdded = Ext.Function.createInterceptor(comp.onAdded, this.beforeComponentRender, this);
    },

    // Add the child items at the last possible moment.
    beforeComponentRender: function () {
        this.cmp.setBody(this.body);

        // Remove the interceptor
        delete this.cmp.beforeComponentRender;
    },
});
