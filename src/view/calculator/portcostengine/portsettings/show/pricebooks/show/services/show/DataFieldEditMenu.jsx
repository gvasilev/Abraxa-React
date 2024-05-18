Ext.define('Abraxa.view.calculator.portcostengine.portsettings.show.pricebooks.show.services.show.DataFieldEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'calculator.portcostengine.portsettings.show.pricebooks.show.services.show.datafieldeditmenu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            handler: function (me) {
                event.stopPropagation();
                let store = me.upVM().get('store');
                let record = me.upVM().get('record');

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer === 'yes') {
                            store.remove(record);

                            store.sync({
                                success: function () {
                                    Ext.toast('Record deleted', 1000);
                                },
                                failure: function (batch, functions) {
                                    store.rejectChanges();
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
                            text: 'Delete',
                            ui: 'decline alt',
                            separator: true,
                        },
                    ]
                );
            },
        },
    ],
});
