Ext.define('Abraxa.view.portcalls.agent.DistributionContainer', {
    extend: 'Ext.Container',
    xtype: 'portcalls.distribution.container',
    cls: 'dist_list_container',
    hidden: true,
    showAnimation: {
        type: 'slide',
        direction: 'left',
    },
    flex: 1,
    scrollable: false,
    items: [
        {
            xtype: 'container',
            padding: '8 24',
            cls: 'a-actions',
            layout: {
                type: 'vbox',
                align: 'left',
            },
            items: [
                {
                    xtype: 'button',
                    iconCls: 'md-icon-outlined md-icon-group-add',
                    ui: 'normal small outlined',
                    margin: '0 18 0 0',
                    tooltip: {
                        html: 'Instantly share data with your clients',
                        showDelay: 0,
                        hideDelay: 0,
                        align: 'bc-tc?',
                    },
                    slug: 'reportAddDistributionGroup',
                    bind: {
                        permission: '{userPermissions}',
                    },
                    text: 'Add group',
                    handler: function (me) {
                        let store = me.upVM().get('object_record').distribution_groups();
                        store.add({
                            object_id: 3,
                        });
                    },
                },
            ],
        },
        {
            xtype: 'container',
            flex: 1,
            items: [
                {
                    xtype: 'abraxa.formlist',
                    margin: '24 0 0 0',
                    emptyText: {
                        xtype: 'container',
                        zIndex: 999,
                        minHeight: 290,
                        layout: {
                            type: 'vbox',
                            pack: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21.6,29.5C15.048,29.5,2,32.776,2,39.3v4.9H41.2V39.3C41.2,32.776,28.152,29.5,21.6,29.5ZM8.552,38.6c2.352-1.624,8.036-3.5,13.048-3.5s10.7,1.876,13.048,3.5ZM21.6,24.6a9.8,9.8,0,1,0-9.8-9.8A9.811,9.811,0,0,0,21.6,24.6Zm0-14a4.2,4.2,0,1,1-4.2,4.2A4.194,4.194,0,0,1,21.6,10.6ZM41.312,29.668C44.56,32.02,46.8,35.156,46.8,39.3v4.9H58V39.3C58,33.644,48.2,30.424,41.312,29.668ZM38.4,24.6A9.8,9.8,0,1,0,38.4,5a9.647,9.647,0,0,0-4.2.98,15.291,15.291,0,0,1,0,17.64A9.647,9.647,0,0,0,38.4,24.6Z" transform="translate(690 425.4)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No distribution groups!</div></div>',
                            },
                        ],
                    },
                    store: [],
                    bind: {
                        store: '{object_record.distribution_groups}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-invite-company-item',
                        layout: {
                            type: 'hbox',
                            pack: 'space-between',
                        },
                        flex: 1,
                        margin: '0 0 16 0',
                        items: [
                            {
                                xtype: 'div',
                                flex: 1,
                                cls: 'a-status-badge a-status-md status-default text-capitalize no-border',
                                bind: {
                                    html: '{record.name}',
                                },
                            },
                            {
                                xtype: 'container',
                                layout: 'hbox',
                                right: 0,
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'round tool-sm',
                                        iconCls: 'md-icon-edit',
                                        tooltip: 'Edit',
                                        handler: function () {},
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'round tool-sm',
                                        iconCls: 'md-icon-close md-icon-outlined',
                                        tooltip: 'Delete',
                                        handler: function () {},
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
    ],
});
