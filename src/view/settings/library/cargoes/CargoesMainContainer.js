Ext.define('Abraxa.view.settings.library.CargoesMainContaine', {
    extend: 'Ext.Container',
    xtype: 'settings.library.cargoes.main',
    hidden: true,
    layout: 'vbox',
    flex: 1,
    bind: {
        hidden: '{library_tabbar.activeTabIndex == 4 ? false: true}',
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
                                    html: '<h1 class="fw-n">Cargoes</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Set up  your cargoes</p>',
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
                    testId: 'settingsLibraryCargoCreateButton',
                    text: 'Cargo',
                    ui: 'action small',
                    iconCls: 'md-icon-add',
                    slug: 'settingsLibraryCargoCreate',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function (btn, e) {
                        let dialog = Ext.create('Abraxa.view.settings.library.cargoes.AddCargoes', {
                            viewModel: {
                                parent: btn.upVM(),
                                data: {
                                    cargo: Ext.create('Abraxa.model.commodity.Commodity'),
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
                    xtype: 'searchfield',
                    testId: 'settingsLibraryCargoSearchField',
                    ui: 'hovered-underline',
                    cls: 'a-field-icon icon-search',
                    width: 280,
                    placeholder: 'Search...',
                    clearable: true,
                    slug: 'settingsLibraryCargo',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            let commodities = this.upVM().get('commodities');
                            if (newValue == '') commodities.removeFilter(8787);
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue();
                            let commodities = this.upVM().get('commodities');
                            commodities.removeFilter(8787);
                            if (query.length > 2) {
                                commodities.addFilter({
                                    id: 8787,
                                    property: 'name',
                                    operator: '=',
                                    value: query,
                                    exactMatch: true,
                                });
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
            xtype: 'settings.library.cargoes.grid',
            flex: 1,
            showNoPermissions: true,
            skipEditPermission: true,
            slug: 'settingsLibraryCargo',
            bind: {
                permission: '{userPermissions}',
            },
        },
    ],
});
