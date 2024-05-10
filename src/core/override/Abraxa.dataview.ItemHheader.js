Ext.define('Abraxa.dataview.ItemHheader', {
    override: 'Ext.dataview.ItemHeader',
    privates: {
        onToggleCollapse: function () {
            let collapsed = this.getGroup().getCollapsed(),
                tool = this.getTools()[0];

            if (collapsed) {
                tool.setType('collapse');
            } else {
                tool.setType('expand');
            }

            this.getGroup().toggleCollapsed();
        },
    },
});
