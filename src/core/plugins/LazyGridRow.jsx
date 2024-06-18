Ext.define('Abraxa.core.plugins.LazyGridRow', {
    extend: 'Ext.AbstractPlugin',

    alias: 'plugin.lazygridrow',

    init: function (comp) {
// this.callParent(arguments);

        if (this.items) {
            // Eager instantiation means create the child items now
            if (this.eagerInstantiation) {
                this.items = comp.prepareItems(this.items);
            }
        }

        // We need to jump in right before the beforeRender call
        if (comp.isHidden()) {
            comp.beforeShow = Ext.Function.createInterceptor(comp.beforeShow, this.beforeComponentRender, this);
        }
    },

    // Add the child items at the last possible moment.
    beforeComponentRender: function () {
        this.cmp.removeAll(true, true);
        this.cmp.add(this.items);

        // Remove the interceptor
        delete this.cmp.beforeComponentRender;
    },
});
