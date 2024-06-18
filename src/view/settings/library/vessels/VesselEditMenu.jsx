Ext.define('Abraxa.view.settings.library.vessels.VesselEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.vessels.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            slug: 'settingsLibraryVessel',
            bind: {
                permission: '{userPermissions}',
                hidden: '{vessel.company_id ? true : false}',
            },
            handler: function (btn, e) {
                let me = this,
                    record = me.upVM().get('vessel'),
                    currentUser = Ext.Viewport.getViewModel().get('currentUser');
                let recordData = record.getData();
                delete recordData['id'];
                let newRecord = new Abraxa.model.common.Vessel(Object.assign({}, recordData));
                newRecord.set('parent_id', record.get('id'));
                newRecord.set('company_id', currentUser.get('current_company_id'));
                let dialog = Ext.create('Abraxa.view.settings.library.vessels.AddVessel', {
                    viewModel: {
                        parent: btn.upVM(),
                        data: {
                            vessel: newRecord,
                            file: null,
                            editMode: false,
                            duplicate: true,
                            isDefault: true,
                        },
                        formulas: {
                            vesselImg: {
                                bind: {
                                    bindTo: '{vessel}',
                                },
                                get: function (vessel) {
                                    if (vessel) {
                                        if (vessel.get('vessel_img')) {
                                            return vessel.get('vessel_img');
                                        }
                                        return ' //static.abraxa.com/ships/' + vessel.get('imo') + '.jpg';
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
            },
        },
        {
            text: 'Edit',
            iconCls: 'md-icon-outlined md-icon-edit',
            // separator: true,
            slug: 'settingsLibraryVessel',
            bind: {
                permission: '{userPermissions}',
                hidden: '{vessel.company_id ? false:true}',
            },
            handler: function (btn, e) {
                let me = this,
                    record = me.upVM().get('vessel');
                let dialog = Ext.create('Abraxa.view.settings.library.vessels.AddVessel', {
                    viewModel: {
                        parent: btn.upVM(),
                        data: {
                            vessel: record,
                            file: null,
                            editMode: true,
                            duplicate: true,
                            isDefault: false,
                        },
                        formulas: {
                            vesselImg: {
                                bind: {
                                    bindTo: '{vessel}',
                                },
                                get: function (vessel) {
                                    if (vessel) {
                                        if (vessel.get('vessel_img')) {
                                            return vessel.get('vessel_img');
                                        }
                                        return ' //static.abraxa.com/ships/' + vessel.get('imo') + '.jpg';
                                    }
                                },
                            },
                        },
                    },
                });
                dialog.show();
            },
        },
        {
            text: 'Delete',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            slug: 'settingsLibraryVesselDelete',
            bind: {
                permission: '{userPermissions}',
                hidden: '{vessel.company_id ? false:true}',
            },
            handler: function (button, el, data) {
                let me = this,
                    record = me.upVM().get('vessel'),
                    vessels = me.upVM().get('vessels');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this record?',
                    function (answer) {
                        if (answer != 'yes') return;
                        record.erase({
                            success: function (batch) {
                                vessels.load();
                                Ext.toast('Record deleted', 1000);
                            },
                            failure: function (batch) {
                                Ext.Msg.alert('Something went wrong', 'Unable to delete this record!');
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
