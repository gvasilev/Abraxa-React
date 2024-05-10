Ext.define('Abraxa.view.settings.library.vessels.VesselsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.library.vessels.main',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 5 ? false: true}',
    },
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Vessels</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Set up  your vessels</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0 0 0',
                                    html: '<hr>',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            padding: '0 24 0 32',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Vessel',
                    ui: 'action small',
                    iconCls: 'md-icon-add',
                    hidden: true,
                    handler: function (btn, e) {
                        let dialog = Ext.create('Abraxa.view.settings.library.vessels.AddVessel', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    vessel: Ext.create('Abraxa.model.common.Vessel'),
                                    file: null,
                                    editMode: false,
                                    duplicate: false,
                                },
                                formulas: {
                                    vesselImg: {
                                        bind: {
                                            bindTo: '{vessel}',
                                            deep: true,
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
                {},
                {
                    xtype: 'searchfield',
                    ui: 'hovered-underline',
                    cls: 'a-field-icon icon-search',
                    width: 280,
                    placeholder: 'Search...',
                    clearable: true,
                    slug: 'settingsLibraryVessel',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            let vesselsGrid = Ext.ComponentQuery.query('grid[reference=vesselsGrid]')[0];
                            let vessels = vesselsGrid.getStore();
                            if (newValue == '') {
                                vessels.removeFilter('searchVessels');
                                vessels.reload();
                            }
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue();
                            let vesselsGrid = Ext.ComponentQuery.query('grid[reference=vesselsGrid]')[0];
                            let vessels = vesselsGrid.getStore();
                            if (query.length > 2) {
                                vessels.addFilter({
                                    id: 'searchVessels',
                                    property: 'name',
                                    operator: 'like',
                                    value: query,
                                    exactMatch: false,
                                });

                                vessels.reload();
                            } else {
                                vessels.removeFilter('searchVessels');
                                vessels.reload();
                            }
                        },
                    },
                },
                {
                    xtype: 'div',
                },
            ],
        },
        {
            xtype: 'settings.library.vessels.grid',
            flex: 1,
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryVessel',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
