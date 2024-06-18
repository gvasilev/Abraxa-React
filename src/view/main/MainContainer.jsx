Ext.define('Abraxa.view.main.MainContainer', {
    id: 'main-container',
    itemId: 'main-container',
    extend: 'Ext.Container',
    layout: 'fit',
    xtype: 'main.container',
    bind: {
        items: '{currentItems}',
    },
    cls: 'has_mask a-main-container-wrap',
});
