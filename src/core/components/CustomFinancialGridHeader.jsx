Ext.define('Abraxa.core.components.CustomFinancialGridHeader', {
    extend: 'Ext.dataview.ItemHeader',
    xtype: 'custom-financial-grouper',
    updateGroup: function (group) {
        var me = this,
            data,
            grouper,
            html,
            list,
            tpl;

        if (group) {
            list = me.parent;
            grouper = list.getStore().getGrouper();

            // See if the grouper belongs to this list and has a headerTpl override
            // in place (see Ext.grid.Column).
            tpl = (grouper && grouper.owner === list && grouper.headerTpl) || me.getTpl();

            if (tpl) {
                data = me.getGroupHeaderTplData();
                me.setCls('row-status row-status-' + data.name);
                html = tpl.apply(data);
            }
        }
        me.setHtml(html || '\xa0');
    },
});
