import './AddSignature';

Ext.define('Abraxa.view.profile.Signature', {
    extend: 'Ext.Container',
    xtype: 'profile.signature',
    cls: 'a-settings-main a-settings-profile',
    scrollable: true,
    plugins: {
        lazyitems: {
            items: [
                {
                    xtype: 'div',
                    html: '<h1 class="fw-n">Email signature</h1>',
                },
                {
                    xtype: 'div',
                    html: '<p class="text-info">Your signature will be used in emails sent through Abraxa platform as a personalization token.</p>',
                },
                {
                    xtype: 'div',
                    margin: '16 0',
                    html: '<hr>',
                },
                {
                    xtype: 'container',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'container',
                                    cls: 'a-bordered-list',
                                    items: [
                                        {
                                            xtype: 'div',
                                            cls: 'a-list-titles',
                                            html: '<div class="flex-3">Signatures</div></div>',
                                        },
                                        {
                                            xtype: 'abraxa.formlist',
                                            reference: 'signatureList',
                                            selectable: {
                                                deselectable: false,
                                            },
                                            bind: {
                                                store: '{userSignatures}',
                                            },
                                            itemConfig: {
                                                viewModel: true,
                                                xtype: 'container',
                                                cls: 'a-list-item cursor-pointer',
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
                                                            html: '<div class="flex-3"><div class="a-badge a-badge-signature mr-12"><i class="md-icon-outlined">gesture</i></div><span class="fw-b">{record.name}</span>{record.is_default ? "<i class=\'md-icon c-teal fs-18 ml-8\'>check</i>": ""}</div>',
                                                        },
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-actions-hover',
                                                        items: [
                                                            {
                                                                xtype: 'button',
                                                                iconCls: 'md-icon-more-horiz',
                                                                ui: 'tool-md round',
                                                                hidden: false,
                                                                arrow: false,
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    align: 'bc-tc?',
                                                                    html: 'More actions',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    closeAction: 'destroy',
                                                                },
                                                                menu: {
                                                                    cls: 'a-main-edit-menu',
                                                                    ui: 'has-icons medium',
                                                                    items: [
                                                                        {
                                                                            text: 'Set as default',
                                                                            hidden: true,
                                                                            bind: {
                                                                                hidden: '{record.is_default ? true:false}',
                                                                            },
                                                                            iconCls:
                                                                                'md-icon-outlined md-icon-done-all',
                                                                            handler: function (me) {
                                                                                Ext.Msg.confirm(
                                                                                    'Confirmation',
                                                                                    'Are you sure you want to set as default signature?',
                                                                                    function (answer) {
                                                                                        if (answer == 'yes') {
                                                                                            let store = me
                                                                                                    .upVM()
                                                                                                    .get(
                                                                                                        'userSignatures'
                                                                                                    ),
                                                                                                record = me
                                                                                                    .upVM()
                                                                                                    .get('record'),
                                                                                                defaultRecord =
                                                                                                    store.findRecord(
                                                                                                        'is_default',
                                                                                                        true,
                                                                                                        0,
                                                                                                        false,
                                                                                                        false,
                                                                                                        true
                                                                                                    );
                                                                                            if (defaultRecord) {
                                                                                                defaultRecord.set(
                                                                                                    'is_default',
                                                                                                    false
                                                                                                );
                                                                                            }
                                                                                            record.set('is_default', 1);
                                                                                            store.sync({
                                                                                                success: function () {
                                                                                                    Ext.toast(
                                                                                                        'Record deleted',
                                                                                                        1000
                                                                                                    );
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
                                                                                            text: 'No',
                                                                                        },
                                                                                        {
                                                                                            xtype: 'button',
                                                                                            itemId: 'yes',
                                                                                            enableToggle: true,
                                                                                            ui: 'action loading',
                                                                                            text: 'Yes',
                                                                                        },
                                                                                    ]
                                                                                );
                                                                            },
                                                                        },
                                                                        {
                                                                            text: 'Edit',
                                                                            iconCls: 'md-icon-outlined md-icon-edit',
                                                                            handler: function (me) {
                                                                                let record = me.upVM().get('record'),
                                                                                    dialog = Ext.create(
                                                                                        'Abraxa.view.profile.AddSignature',
                                                                                        {
                                                                                            title: 'Edit signature',
                                                                                            viewModel: {
                                                                                                parent: me.upVM(),
                                                                                                data: {
                                                                                                    record: record,
                                                                                                    editMode: true,
                                                                                                },
                                                                                            },
                                                                                        }
                                                                                    );
                                                                                dialog.show();
                                                                            },
                                                                        },
                                                                        {
                                                                            text: 'Delete',
                                                                            iconCls: 'md-icon-outlined md-icon-delete',
                                                                            ui: 'decline',
                                                                            hidden: false,
                                                                            bind: {
                                                                                hidden: '{record.is_default ? true:false}',
                                                                            },
                                                                            separator: true,
                                                                            handler: function (me) {
                                                                                let store = me
                                                                                        .upVM()
                                                                                        .get('userSignatures'),
                                                                                    record = me.upVM().get('record');
                                                                                Ext.Msg.confirm(
                                                                                    'Delete',
                                                                                    'Are you sure you would like to delete this entry?',
                                                                                    function (answer) {
                                                                                        if (answer == 'yes') {
                                                                                            store.remove(record);
                                                                                            store.sync({
                                                                                                success: function () {
                                                                                                    Ext.toast(
                                                                                                        'Record deleted',
                                                                                                        1000
                                                                                                    );
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
                                                                                            text: 'Yes',
                                                                                        },
                                                                                    ]
                                                                                );
                                                                            },
                                                                        },
                                                                    ],
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.select(me.getStore().getAt(0));
                                                },
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Add signature',
                                            ui: 'normal small',
                                            margin: '8 16 16 16',
                                            height: 28,
                                            iconCls: 'md-icon-add',
                                            handler: function (me) {
                                                let record = me.upVM().get('currentUser'),
                                                    disableDefault = false,
                                                    model = Ext.create('Abraxa.model.settings.company.EmailSignature', {
                                                        user_id: record.get('id'),
                                                    });

                                                model.getProxy().setExtraParams({
                                                    user_id: record.get('id'),
                                                });
                                                if (me.upVM().get('userSignatures').getCount() === 0) {
                                                    model.set('is_default', true);
                                                    disableDefault = true;
                                                }
                                                mixpanel.track('Add signature - button');
                                                let dialog = Ext.create('Abraxa.view.profile.AddSignature', {
                                                    viewModel: {
                                                        parent: me.upVM(),
                                                        data: {
                                                            record: model,
                                                            editMode: false,
                                                        },
                                                    },
                                                });
                                                dialog.show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '16 0 0 0',
                            flex: 1.5,
                            hidden: true,
                            bind: {
                                hidden: '{signatureList.selection ? false:true}',
                            },
                            cls: 'a-bordered-list',
                            items: [
                                {
                                    xtype: 'container',
                                    height: 64,
                                    cls: 'a-titlebar a-bb-100',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'title',
                                            bind: {
                                                title: '{signatureList.selection.name}',
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            align: 'middle',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    ui: 'round tool-round-md',
                                                    iconCls: 'md-icon-outlined md-icon-edit',
                                                    handler: function (me) {
                                                        let record = me.upVM().get('signatureList.selection'),
                                                            dialog = Ext.create('Abraxa.view.profile.AddSignature', {
                                                                title: 'Edit signature',
                                                                viewModel: {
                                                                    parent: me.upVM(),
                                                                    data: {
                                                                        record: record,
                                                                        editMode: true,
                                                                    },
                                                                },
                                                            });
                                                        dialog.show();
                                                    },
                                                },
                                                {
                                                    xtype: 'button',
                                                    ui: 'round tool-round-md',
                                                    hidden: false,
                                                    bind: {
                                                        hidden: '{signatureList.selection.is_default ? true:false}',
                                                    },
                                                    iconCls: 'md-icon-outlined md-icon-delete',
                                                    handler: function (me) {
                                                        let store = me.upVM().get('userSignatures'),
                                                            list = me
                                                                .up('settings\\.personal\\.signature')
                                                                .down('abraxa\\.formlist'),
                                                            record = me.upVM().get('signatureList.selection');
                                                        Ext.Msg.confirm(
                                                            'Delete',
                                                            'Are you sure you would like to delete this entry?',
                                                            function (answer) {
                                                                if (answer == 'yes') {
                                                                    store.remove(record);
                                                                    store.sync({
                                                                        success: function () {
                                                                            Ext.toast('Record deleted', 1000);
                                                                            list.select(store.getAt(0));
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
                                                                    text: 'Yes',
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
                                    xtype: 'div',
                                    padding: 24,
                                    bind: {
                                        html: '{signatureList.selection.signature}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
});
