Ext.define('Abraxa.grid.PagingToolbar', {
    override: 'Ext.grid.plugin.PagingToolbar',

    getPageData: function () {
        var grid = this.getGrid(),
            store = grid.getStore(),
            totalCount = store.getTotalCount() || store.getCount(),
            pageSize = this.getPageSize(),
            pageCount = Math.ceil(totalCount / pageSize);

        return {
            totalCount: totalCount,
            totalPages: Ext.Number.isFinite(pageCount) ? pageCount : 1,
            currentPage: store.currentPage,
            pageSize: pageSize,
        };
    },
});
