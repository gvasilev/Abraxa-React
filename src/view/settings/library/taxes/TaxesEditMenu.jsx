Ext.define('Abraxa.view.settings.library.taxes.TaxesEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.taxes.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            slug: 'settingsLibraryTaxDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (button, el, data) {
                let me = this,
                    record = me.upVM().get('tax'),
                    store = me.upVM().get('taxes');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this record?',
                    function (answer) {
                        if (answer != 'yes') return;
                        store.remove(record);
                        store.sync({
                            success: function (batch) {
                                Ext.toast('Record deleted', 1000);
                            },
                        });
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            itemId: 'yes',
                            ui: 'decline alt',
                            text: 'Delete',
                        },
                    ]
                );
            },
        },
    ],
});
