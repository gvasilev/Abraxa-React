Ext.define('Abraxa.view.directory.ports.TerminalsTab.TerminalsBerths', {
    extend: 'Ext.Container',
    xtype: 'TerminalsBerths',
    items: [
        {
            xtype: 'div',
            bind: {
                html: '<div class="hbox">Berths<span class="c-grey fw-n ml-2">({berthsPerTerminal.count})</span></div>',
            },
            cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right is-collapsed',
            listeners: {
                click: {
                    element: 'element',
                    fn: function fn() {
                        let component = this.component;
                        component.toggleCls('is-collapsed');
                        component.up('container').down('[cls~=a-collapsible-container]').toggleCls('is-collapsed');
                    },
                },
            },
        },
        {
            xtype: 'container',
            cls: 'a-collapsible-container is-collapsed',
            flex: 1,
            scrollable: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-bordered-list',
                    slug: 'settingsCompanyBankInformation',
                    showNoPermissions: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-list-titles a-bgr-white',
                            height: 48,
                            html: '<div class="flex-5">Berth</div><div class="flex-1">Type</div><div class="flex-1">Updated</div><div class="a-actions-hover"></div>',
                        },
                        {
                            xtype: 'abraxa.formlist',
                            bind: {
                                store: '{berthsPerTerminal}',
                            },
                            itemConfig: {
                                viewModel: true,
                                xtype: 'container',
                                cls: 'a-list-item',
                                minHeight: 56,
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'a-list-values',
                                        flex: 1,
                                        bind: {
                                            html: '<div class="flex-5"><span class="text-truncate fw-b c-blue">{record.name ? record.name : "<span class=\'a-placeholder\'>---</span>"}</span></div><div class="flex-1 fw-b"><span class="text-truncate fw-b">{record.type ? record.type : "<span class=\'a-placeholder\'>---</span>"}</span></div><div class="flex-1 fw-b"><span class="text-truncate fw-b">{record.updated_by ? (record.updated_by:date("d M y")) : "<span class=\'a-placeholder\'>---</span>"}</span></div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-actions-hover',
                                        items: [
                                            {
                                                xtype: 'button',
                                                margin: 8,
                                                iconCls: 'md-icon-navigate-next',
                                                ui: 'tool-sm round normal raised',
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    align: 'bc-tc?',
                                                    html: 'View details',
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    closeAction: 'destroy',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (me, selected, eOpts) {
                                    Ext.getCmp('main-viewport')
                                        .getController()
                                        .redirectTo(
                                            'port-info/' +
                                                me.upVM().get('object_record.id') +
                                                '/berths/' +
                                                selected.record.id
                                        );
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
