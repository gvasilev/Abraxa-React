Ext.define('Abraxa.Container', {
    override: 'Ext.Container',

    applyItems: function (items, collection) {
        var me = this,
            activeItem;

        if (items) {
            me.getDefaultType();
            me.getDefaults();

            if (me.initialized && collection.length > 0) {
                me.removeAll();
            }

            // Read items from object properties back into the newItems array
            // unless the item is a Widget or is a config object with an xtype.
            if (me.weighted && !items.isWidget && !items.xtype) {
                items = Ext.convertKeyedItems(items);
            }

            me.add(items);

            // Don't need to call setActiveItem when Container is first initialized
            if (me.initialized) {
                activeItem = me.initialConfig.activeItem || me.getActiveItemIndex() || me.config.activeItem || 0;
                me.setActiveItem(activeItem);
            }
        }
    },

    updateActiveItemIndex: function (index) {
        this.config.activeItem = index;
        this.setActiveItem(index);
    },

    applyActiveItemIndex: function (activeItemIndex) {
        this.setActiveItem(activeItemIndex);
        return activeItemIndex;
    },
});
