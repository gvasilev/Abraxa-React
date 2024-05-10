Ext.define('Abraxa.view.settings.voyage.VoyageDocuments', {
    extend: 'Ext.Container',
    xtype: 'settings.voyage.documents',
    layout: 'hbox',
    padding: '24 24 12 24',
    items: [
        {
            xtype: 'div',
            flex: 2,
            padding: '16 96 16 16',
            html:
                '<div class="fs-18">Voyage Documents</div>' + '<p class="c-grey-500">Manage your Voyage documents</p>',
        },
        {
            xtype: 'abraxa.container',
            shadow: true,
            height: 'calc(100vh - 132px)',
            scrollable: true,
            flex: 10,
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    title: 'Documents',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Upload file',
                            iconCls: 'md-icon-add',
                            ui: 'confirm round raised btn-normal',
                            align: 'right',
                            disabled: false,
                            bind: {
                                disabled: '{folders.count > 0 ? false:true}',
                            },
                            handler: function (btn, e) {
                                Ext.create('AbraxaLive.view.settings.voyage.clauses.Create', {
                                    viewModel: {
                                        data: {
                                            clauseRecord: null,
                                        },
                                        stores: {
                                            voyageClause: btn.upVM().get('voyageClauses'),
                                        },
                                    },
                                }).show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'adocs.main',
                },
            ],
        },
    ],
});
