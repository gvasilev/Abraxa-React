Ext.define('Abraxa.view.portcall.sof.SOFRemarks', {
    extend: 'Ext.Container',
    xtype: 'portcall.sof.remarks',
    cls: 'a-bnc-remarks',
    padding: '24 24 16 24',
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading fw-b',
                    html: '<div class="a-badge a-badge-general"><i class="md-icon-outlined">notes</i></div>SOF Remarks',
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'w-50',
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-add',
                            ui: 'normal small',
                            slug: 'portcallSofRemarks',
                            text: 'Remark',
                            subObject: 'sof',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            handler: function (button) {
                                let currentUser = button.upVM().get('currentUser'),
                                    dialog = Ext.create('Abraxa.view.portcall.sof.AddRemark', {
                                        viewModel: {
                                            parent: button.upVM(),
                                            data: {
                                                remark: Ext.create('Abraxa.model.sof.Remark', {}),
                                                editMode: false,
                                            },
                                        },
                                    });
                                dialog.show();
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.componentdataview',
                    minHeight: 40,
                    flex: 1,
                    itemId: 'sofRemarks',
                    emptyText: 'No remarks yet',
                    cls: 'a-sof-section-list',
                    bind: {
                        store: '{remarks}',
                    },
                    ripple: false,
                    itemRipple: false,
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-sof-section-item border border-radius',
                        padding: '8 24 16 24',
                        items: [
                            {
                                xtype: 'container',
                                cls: 'a-bb-100',
                                minHeight: 54,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'space-between',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'h2',
                                        bind: {
                                            html: '{record.remark_title}',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            aling: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'button',
                                                ui: 'round tool-round-md',
                                                iconCls: 'md-icon-outlined md-icon-edit',
                                                slug: 'portcallSofRemarks',
                                                subObject: 'sof',
                                                bind: {
                                                    cls: '{nonEditable ? "hidden": ""}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    html: 'Edit',
                                                    align: 'bc-tc?',
                                                    anchor: true,
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                                handler: function (button) {
                                                    let record = this.upVM().get('record'),
                                                        dialog = Ext.create('Abraxa.view.portcall.sof.AddRemark', {
                                                            viewModel: {
                                                                parent: button.upVM(),
                                                                data: {
                                                                    remark: record,
                                                                    editMode: true,
                                                                },
                                                            },
                                                        });
                                                    dialog.show();
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-outlined md-icon-delete',
                                                ui: 'round',
                                                slug: 'portcallSofRemarks',
                                                subObject: 'sof',
                                                bind: {
                                                    cls: '{nonEditable ? "hidden": ""}',
                                                    permission: '{userPermissions}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                                handler: function (cmp) {
                                                    let vm = this.upVM(),
                                                        store = vm.get('remarks'),
                                                        record = this.upVM().get('record');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you want to delete this remark?',
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
                                                tooltip: {
                                                    anchorToTarget: true,
                                                    html: 'Delete',
                                                    align: 'bc-tc?',
                                                    anchor: true,
                                                    showDelay: 0,
                                                    hideDelay: 0,
                                                    dismissDelay: 0,
                                                    allowOver: false,
                                                    closeAction: 'destroy',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                xtype: 'div',
                                margin: '12 0',
                                bind: {
                                    html: '{record.remark_text_plain:substr(0, 320)}...<a href="javascript:void(0);" class="fw-b c-link instruction_link">view more</a>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'a.instruction_link',
                                        fn: function () {
                                            var record = this.component.upVM().get('record');
                                            dialog = Ext.create('Abraxa.view.portcall.sof.AddRemark', {
                                                viewModel: {
                                                    parent: this.component.upVM(),
                                                    data: {
                                                        remark: record,
                                                        editMode: true,
                                                    },
                                                },
                                            });
                                            dialog.show();
                                        },
                                    },
                                },
                            },
                            {
                                xtype: 'public.updated.by',
                                margin: '24 0 0 0',
                                maxWidth: 164,
                                bind: {
                                    data: {
                                        user: '{record.updated_by_user}',
                                        updated_at: '{record.updated_at}',
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],
});
