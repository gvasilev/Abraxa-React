Ext.define('Abraxa.tab.Bar', {
    override: 'Ext.tab.Bar',

    config: {
        activeTabIndex: null,
        animateIndicator: false,
    },

    applyActiveTab: function (newActiveTab, oldActiveTab) {
        if (!newActiveTab && newActiveTab !== 0) {
            return;
        }

        var newTabInstance = this.parseActiveTab(newActiveTab);

        if (!newTabInstance) {
            if (oldActiveTab) {
                //  Ext.Logger.warn('Trying to set a non-existent activeTab');
            }
            return;
        }
        var me = this;

        var newActiveTabIndex = me.items.indexOf(newTabInstance);
        this.setActiveTabIndex(newActiveTabIndex);

        return newTabInstance;
    },

    updateActiveTabIndex: function (newActiveTabIndex, oldActiveTabIndex) {
        this.setActiveTab(newActiveTabIndex);
    },
});
