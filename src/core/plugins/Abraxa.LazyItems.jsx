Ext.define('Abraxa.core.plugins.LazyItems', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.lazyitems',

    init: function (comp) {
// this.callParent(arguments);

        if (this.items) {
            // Eager instantiation means create the child items now
            if (this.eagerInstantiation) {
                this.items = comp.prepareItems(this.items);
            }
        }

        // We need to jump in right before the beforeRender call
        comp.onRender = Ext.Function.createInterceptor(comp.onRender, this.beforeComponentRender, this);
    },

    // Add the child items at the last possible moment.
    beforeComponentRender: function () {
        this.cmp.add(this.items);

        // Remove the interceptor
        delete this.cmp.beforeComponentRender;
    },
});
