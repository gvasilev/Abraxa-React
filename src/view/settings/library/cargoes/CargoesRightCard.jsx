Ext.define('Abraxa.view.settings.library.cargoes.CargoesRightCard', {
    extend: 'Ext.Container',
    xtype: 'cargoes.right.card',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    viewModel: {
        formulas: {
            commodityImg: {
                bind: {
                    bindTo: '{cargoesGrid.selection}',
                    deep: true,
                },
                get: function (selection) {
                    if (selection) {
                        if (selection.get('image_name')) {
                            return 'https://static.abraxa.com/images/commodities/' + selection.get('image_name');
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
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            testId: 'settingsLibraryCargoRightCardBackButton',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('settings\\.library\\.cargoes\\.grid')[0];
                                if (grid) {
                                    Ext.ComponentQuery.query('cargoes\\.right\\.card')[0].hide();
                                    Ext.ComponentQuery.query('[itemId=main-right-container]')[0].show();
                                    grid.deselectAll();
                                }
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{cargoesGrid.selection.name} ({cargoesGrid.selection.type:capitalize})',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 16',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-edit',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryCargo',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{cargoesGrid.selection.company_id ? false:true}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Edit',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (btn, e) {
                                let me = this,
                                    record = me.upVM().get('cargoesGrid.selection');
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
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-edit',
                            ui: 'round tool-round-md',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Edit',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            slug: 'settingsLibraryCargo',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{cargoesGrid.selection.company_id ? true : false}',
                            },
                            handler: function (btn, e) {
                                let me = this,
                                    record = me.upVM().get('cargoesGrid.selection'),
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
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            slug: 'settingsLibraryCargoDelete',
                            bind: {
                                permission: '{userPermissions}',
                                hidden: '{cargoesGrid.selection.company_id ? false:true}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (button, el, data) {
                                let me = this,
                                    record = me.upVM().get('cargoesGrid.selection'),
                                    commodities = me.upVM().get('commodities');
                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this record?',
                                    function (answer) {
                                        if (answer != 'yes') return;
                                        record.erase({
                                            success: function (batch) {
                                                commodities.reload();
                                                let grid = Ext.ComponentQuery.query(
                                                    'settings\\.library\\.cargoes\\.grid'
                                                )[0];
                                                if (grid) {
                                                    grid.deselectAll();
                                                }
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
                },
            ],
        },
        {
            xtype: 'container',
            layout: 'hbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-cargo-left-panel',
                    width: 340,
                    padding: '24 24 16 32',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-img-wrap',
                            items: [
                                {
                                    xtype: 'image',
                                    itemId: 'imageHead',
                                    align: 'stretch',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    bind: {
                                        src: '{commodityImg}',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            defaults: {
                                xtype: 'displayfield',
                                labelAlign: 'left',
                                labelWidth: 180,
                                renderer: function (value, field) {
                                    var label = field.getLabel();
                                    if (value) {
                                        return value;
                                    } else {
                                        return AbraxaConstants.placeholders.emptyValue;
                                    }
                                },
                            },

                            items: [
                                {
                                    labelAlign: 'top',
                                    ui: 'field-xl',
                                    margin: '12 0 16 0',
                                    bind: {
                                        label: '{cargoesGrid.selection.type}',
                                        value: '{cargoesGrid.selection.name}',
                                    },
                                },
                                {
                                    label: 'UN Number',
                                    bind: {
                                        value: '{cargoesGrid.selection.un_number}',
                                    },
                                },
                                {
                                    label: 'Angle of repose',
                                    bind: {
                                        value: '{cargoesGrid.selection.angle_of_repose}',
                                    },
                                },
                                {
                                    label: 'SF m3/mt (from)',
                                    bind: {
                                        value: '{cargoesGrid.selection.sf_from}',
                                    },
                                },
                                {
                                    label: 'SF m3/mt (to)',
                                    bind: {
                                        value: '{cargoesGrid.selection.sf_to}',
                                    },
                                },
                                {
                                    label: 'Humidity Moisture % (from)',
                                    bind: {
                                        value: '{cargoesGrid.selection.humidity_moisture_from}',
                                    },
                                },
                                {
                                    label: 'Humidity Moisture % (to)',
                                    bind: {
                                        value: '{cargoesGrid.selection.humidity_moisture_to}',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    margin: '8 0',
                                    html: '<hr>',
                                },
                                {
                                    label: 'Reference ID',
                                    bind: {
                                        value: '{cargoesGrid.selection.reference}',
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '8 24 16 32',
                    flex: 1,
                    scrollable: true,
                    items: [
                        {
                            xtype: 'div',
                            html: '<h2>Description</h2>',
                        },
                        {
                            xtype: 'container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'div',
                                    // minHeight: 150,
                                    cls: 'text-break',
                                    bind: {
                                        html: '{(cargoesGrid.selection.description == "") ? "---" : cargoesGrid.selection.description}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '16 0',
                                    items: [
                                        {
                                            xtype: 'div',
                                            html: '<h2>Risk factors</h2>',
                                        },
                                        {
                                            xtype: 'div',
                                            cls: 'text-break',
                                            bind: {
                                                html: '{(cargoesGrid.selection.risk_factors == "") ? "---" : cargoesGrid.selection.risk_factors}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
