Ext.define('Abraxa.stateful.grid.Grid', {
    override: 'Ext.grid.Grid',

    showColumnsInMenu: false,

    privates: {
        updateHideHeaders: function (hideHeaders) {
            if (this.getHeaderContainer())
                this.getHeaderContainer().toggleCls(Ext.baseCSSPrefix + 'hidden-headers', hideHeaders);
        },
    },
});
