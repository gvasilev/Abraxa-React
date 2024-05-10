Ext.define('Abraxa.view.main.RecentlyOpenedMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'recently.opened.menu',
    ui: 'dropdown',
    cls: 'a-main-recent-menu is-animated',
    width: 320,
    hidden: true,
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'div',
            margin: '0 16',
            cls: 'h5',
            slug: 'portcall',
            showNoPermissions: true,
            bind: {
                permission: '{userPermissions}',
            },
            html: 'Recently viewed',
        },
        {
            xtype: 'list',
            minHeight: 100,
            scrollable: false,
            selectable: false,
            flex: 1,
            cls: 'a-list-recent',
            slug: 'portcall',
            bind: {
                store: '{recentlyOpened}',
                permission: '{userPermissions}',
            },
            itemConfig: {
                viewModel: {},
                bind: {
                    html: '<div class="row align-items-center"><div class="col-auto"><i class="{record.object.watching.length ? "is-active" : ""}"></i></div><div class="col text-truncate"><div class="a-vessel">{record.object.voyage.vessel_name}</div><div class="a-id">{record.object.file_id}</div></div><div class="col col-status text-right"><div class="a-status-badge status-{record.object.status_data.string}"><div class="text-truncate">{record.object.status_data.name}</div></div></div></div>',
                },
                listeners: {
                    click: {
                        element: 'element',
                        fn: function () {
                            if (this.component.getRecord().get('hash') != window.location.hash) {
                                window.location.hash = this.component.getRecord().get('hash');
                            }
                            this.component.up('list').up('menu').hide();
                        },
                    },
                },
            },
        },
    ],
});
