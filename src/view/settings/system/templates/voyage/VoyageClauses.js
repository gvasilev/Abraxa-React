Ext.define('Abraxa.view.settings.voyage.VoyageClauses', {
    extend: 'Ext.Container',
    xtype: 'settings.voyage.clauses',
    viewModel: {
        type: 'settings-voyage-clause',
    },
    layout: 'hbox',
    padding: '24 24 12 24',
    items: [
        {
            xtype: 'div',
            flex: 2,
            padding: '16 96 16 16',
            html: '<div class="fs-18">Voyage Clauses</div>' + '<p class="c-grey-500">Manage your Voyage clauses</p>',
        },
        {
            xtype: 'abraxa.container',
            shadow: true,
            height: 'calc(100vh - 132px)',
            scrollable: true,
            cls: 'a-bgr-100 border-radius',
            flex: 10,
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    title: 'Clauses',
                    docked: 'top',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Add clause',
                            iconCls: 'md-icon-add',
                            ui: 'confirm round raised btn-normal',
                            align: 'right',
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
                    xtype: 'settings.voyage.clause.list',
                },
            ],
        },
    ],
});
