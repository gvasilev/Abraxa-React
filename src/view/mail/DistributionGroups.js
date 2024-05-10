Ext.define('Abraxa.view.mail.DistributionGroups', {
    extend: 'Abraxa.core.AbraxaFormList',
    xtype: 'mail.distribution.groups',
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        minHeight: 160,
        layout: {
            type: 'vbox',
            pack: 'middle',
        },
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 124 124"><g transform="translate(-658 -388)"><g transform="translate(-176 43)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M21.6,29.5C15.048,29.5,2,32.776,2,39.3v4.9H41.2V39.3C41.2,32.776,28.152,29.5,21.6,29.5ZM8.552,38.6c2.352-1.624,8.036-3.5,13.048-3.5s10.7,1.876,13.048,3.5ZM21.6,24.6a9.8,9.8,0,1,0-9.8-9.8A9.811,9.811,0,0,0,21.6,24.6Zm0-14a4.2,4.2,0,1,1-4.2,4.2A4.194,4.194,0,0,1,21.6,10.6ZM41.312,29.668C44.56,32.02,46.8,35.156,46.8,39.3v4.9H58V39.3C58,33.644,48.2,30.424,41.312,29.668ZM38.4,24.6A9.8,9.8,0,1,0,38.4,5a9.647,9.647,0,0,0-4.2.98,15.291,15.291,0,0,1,0,17.64A9.647,9.647,0,0,0,38.4,24.6Z" transform="translate(690 425.4)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt"><span class="fs-16">No distribution groups</span></div></div>',
            },
        ],
    },
    bind: {
        store: '{distribution_groups}',
    },
    scrollable: true,
    itemConfig: {
        viewModel: {
            formulas: {
                htmlTpl: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            let members = 0;
                            let emails = record.get('dist_emails');
                            if (emails) {
                                var filtered = emails.filter(function (el) {
                                    return el.length;
                                });
                                if (filtered) {
                                    members = filtered.length;
                                    record.set('dist_emails', filtered);
                                }
                            }

                            return (
                                '<div class="hbox">' +
                                '<div class="a-badge a-badge-distribution"><i class="md-icon-outlined md-icon-group"></i></div>' +
                                '<div><div class="a-group-title">' +
                                record.get('name') +
                                '</div><div class="a-group-subtitle">' +
                                members +
                                ' members</div></div>' +
                                '</div>'
                            );
                        }
                    },
                },
            },
        },
        xtype: 'container',
        cls: 'a-distribution-item',
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'space-between',
        },
        flex: 1,
        items: [
            {
                xtype: 'div',
                // {record.name}
                flex: 1,
                bind: {
                    html: '{htmlTpl}',
                },
            },
            {
                xtype: 'container',
                cls: 'a-tools',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-edit md-icon-outlined',
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
                        handler: function (me) {
                            Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                viewModel: {
                                    parent: me.upVM(),
                                    data: {
                                        title: 'Edit distribution group',
                                        editMode: true,
                                        record: me.upVM().get('record'),
                                    },
                                },
                            }).show();
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-delete md-icon-outlined',
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
                        handler: function (button) {
                            let store = button.upVM().get('distribution_groups'),
                                record = button.upVM().get('record');
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this record?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        store.remove(record);
                                        store.sync({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
                                    }
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
                                        separator: true,
                                    },
                                ]
                            );
                        },
                    },
                ],
            },
        ],
    },
});
