Ext.define('Abraxa.view.settings.library.ports.BerthEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.berth.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function () {
                let me = this,
                    berth = me.upVM().get('berth'),
                    currentUser = me.upVM().get('currentUser'),
                    selectedPort = me.upVM().get('portsServerGrid.selection');
                Ext.create('Abraxa.view.settings.library.ports.SuggestDialogs.SuggestBerth.SuggestBerthDialog', {
                    viewModel: {
                        parent: me.upVM(),
                        data: {
                            selectedPort: selectedPort,
                            record: Ext.create('Abraxa.model.suggestions.Berth', {
                                id: berth.get('id'),
                                meta_name: berth.get('name'),
                                legacy_parent_id: berth.get('terminal').id,
                            }),
                            currentUser: currentUser,
                        },
                    },
                }).show();
            },
        },
    ],
});
