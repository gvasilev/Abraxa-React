Ext.define('Abraxa.view.portcall.husbandry.crewing.CrewingEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcall.crewing.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            slug: 'portcallCrewingDelete',
            ui: 'decline',
            separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (me) {
                let store = me.upVM().get('crewings'),
                    container = this.find('crewingRightCard'),
                    record = me.upVM().get('crewing');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            container.hide();
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    Ext.toast('Record deleted', 1000);
                                },
                            });
                        }
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
