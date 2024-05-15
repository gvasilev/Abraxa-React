Ext.define('Abraxa.view.settings.library.cargoes.CargoesEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'settings.library.cargoes.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Edit',
            testId: 'settingsLibraryCargoGridEditButton1',
            iconCls: 'md-icon-outlined md-icon-edit',
            slug: 'settingsLibraryCargo',
            bind: {
                permission: '{userPermissions}',
                hidden: '{cargo.company_id ? true : false}',
            },
            handler: function (btn, e) {
                let me = this,
                    record = me.upVM().get('cargo'),
                    currentUser = Ext.Viewport.getViewModel().get('currentUser');
                let recordData = record.getData();
                delete recordData['id'];
                let newRecord = new Abraxa.model.commodity.Commodity(Object.assign({}, recordData));
                newRecord.set('parent_id', record.get('id'));
                newRecord.set('company_id', currentUser.get('current_company_id'));
                let dialog = Ext.create('Abraxa.view.settings.library.cargoes.AddCargoes', {
                    viewModel: {
                        parent: btn.upVM(),
                        data: {
                            cargo: newRecord,
                            file: null,
                            editMode: false,
                        },
                        formulas: {
                            commodityImg: {
                                bind: {
                                    bindTo: '{cargo}',
                                    deep: true,
                                },
                                get: function (selection) {
                                    if (selection) {
                                        if (selection.get('image_name')) {
                                            return (
                                                'https://static.abraxa.com/images/commodities/' +
                                                selection.get('image_name')
                                            );
                                        } else {
                                            if (selection.get('image_url')) {
                                                return selection.get('image_url');
                                            }
                                            return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                                        }
                                    } else {
                                        return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
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
            testId: 'settingsLibraryCargoGridEditButton2',
            iconCls: 'md-icon-outlined md-icon-edit',
            slug: 'settingsLibraryCargo',
            bind: {
                permission: '{userPermissions}',
                hidden: '{cargo.company_id ? false : true}',
            },
            handler: function (btn, e) {
                let me = this,
                    record = me.upVM().get('cargo');
                let dialog = Ext.create('Abraxa.view.settings.library.cargoes.AddCargoes', {
                    viewModel: {
                        parent: btn.upVM(),
                        data: {
                            cargo: record,
                            file: null,
                            editMode: true,
                        },
                        formulas: {
                            commodityImg: {
                                bind: {
                                    bindTo: '{cargo}',
                                    deep: true,
                                },
                                get: function (selection) {
                                    if (selection) {
                                        if (selection.get('image_name')) {
                                            return (
                                                'https://static.abraxa.com/images/commodities/' +
                                                selection.get('image_name')
                                            );
                                        } else {
                                            if (selection.get('image_url')) {
                                                return selection.get('image_url');
                                            }
                                            return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
                                        }
                                    } else {
                                        return 'https://static.abraxa.com/images/bgr-no-cargo.svg';
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
            testId: 'settingsLibraryCargoGridDeleteButton',
            iconCls: 'md-icon-outlined md-icon-delete',
            ui: 'decline',
            separator: true,
            slug: 'settingsLibraryCargoDelete',
            bind: {
                permission: '{userPermissions}',
                hidden: '{cargo.company_id ? false:true}',
            },
            handler: function (button, el, data) {
                let me = this,
                    record = me.upVM().get('cargo'),
                    commodities = me.upVM().get('commodities');

                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this record?',
                    function (answer) {
                        if (answer != 'yes') return;

                        // commodities.remove(record);
                        record.erase({
                            success: function (batch) {
                                commodities.load();
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
                            testId: 'settingsLibraryCargoGridDeleteButtonConfirm',
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
