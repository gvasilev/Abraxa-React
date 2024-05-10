Ext.define('Abraxa.view.portnews.PortNewsTypes', {
    extend: 'Ext.dataview.Component',
    xtype: 'PortNewsTypes',
    cls: 'a-tags-group',
    config: {
        editable: false,
    },

    viewModel: {
        data: {
            editable: false,
        },
    },

    setEditable(editable) {
        this.getViewModel().set('editable', editable);
    },

    layout: {
        type: 'hbox',
        align: 'middle',
        wrap: true,
    },

    itemConfig: {
        xtype: 'PortNewsType',
        cls: 'a-tag-badge',
    },
});
