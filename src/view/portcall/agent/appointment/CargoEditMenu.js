Ext.define('Abraxa.view.portcall.appointment.CargoEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'portcall.cargo.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            slug: 'portcallAppointmentCargo',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let cargo = me.upVM().get('cargo'),
                    store = me.upVM().get('cargoes');
                Ext.create('Abraxa.view.AddCargoPopup', {
                    title: '<div class="a-badge a-badge-cargo"><i></i></div>Edit cargo',
                    viewModel: {
                        parent: me.upVM(),
                        data: {
                            cargoAdvanced: false,
                            cargoStore: store,
                            cargoRecord: cargo,
                            editMode: true,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Delete',
            slug: 'portcallCargoDelete',
            ui: 'decline',
            separator: true,
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-delete',
            handler: function (button, el, data) {
                Ext.Msg.confirm(
                    'Confirmation',
                    'Are you sure you want to delete this record?',
                    function (answer) {
                        if (answer == 'yes') {
                            let store = button.upVM().get('cargoes'),
                                record = this.upVM().get('cargo');
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
                            enableToggle: true,
                            ui: 'decline alt loading',
                            text: 'Delete',
                        },
                    ]
                );
            },
        },
    ],
});
