import './AddSignature';

Ext.define('Abraxa.view.portcall.sof.SOFSignatures', {
    extend: 'Ext.Container',
    xtype: 'portcall.sof.signatures',
    cls: 'a-bnc-remarks',
    padding: '0 24 16 24',
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading fw-b',
                    html: '<div class="a-badge a-badge-general"><i class="md-icon-outlined">checklist_rtl</i></div>SOF Signatures',
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
                            text: 'Signature',
                            subObject: 'sof',
                            bind: {
                                cls: '{nonEditable ? "hidden" : ""}',
                                permission: '{userPermissions}',
                                objectPermission: '{objectPermissions}',
                            },
                            handler: function (button) {
                                let currentUser = button.upVM().get('currentUser'),
                                    dialog = Ext.create('Abraxa.view.portcall.sof.AddSignature', {
                                        viewModel: {
                                            parent: button.upVM(),
                                            data: {
                                                signature: Ext.create('Abraxa.model.sof.SofSignature', {}),
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
                    emptyText: 'No signatures yet',
                    cls: 'a-sof-section-list',
                    bind: {
                        store: '{signatures}',
                    },
                    ripple: false,
                    itemRipple: false,
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        bind: {
                            cls: 'a-sof-section-item border border-radius {record.disabled ? "x-disabled":""}',
                        },
                        padding: '8 24',
                        items: [
                            {
                                xtype: 'container',
                                cls: 'a-bb-100',
                                minHeight: 48,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'space-between',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'fs-16 fw-b',
                                        bind: {
                                            html: '{record.company_name}',
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
                                                        dialog = Ext.create('Abraxa.view.portcall.sof.AddSignature', {
                                                            viewModel: {
                                                                parent: button.upVM(),
                                                                data: {
                                                                    signature: record,
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
                                                bind: {
                                                    iconCls:
                                                        'md-icon-outlined {record.disabled ? "md-icon-visibility":"md-icon-visibility-off"}',
                                                    hidden: '{record.is_default ? false:true}',
                                                    tooltip: {
                                                        anchorToTarget: true,
                                                        html: '{record.disabled ? "Enable":"Disable"}',
                                                        align: 'bc-tc?',
                                                        anchor: true,
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                },
                                                handler: function (me) {
                                                    let signatures = me.upVM().get('signatures'),
                                                        record = me.upVM().get('record');
                                                    enableString = record.get('disabled') ? 'Enable' : 'Disable';

                                                    Ext.Msg.confirm(
                                                        enableString,
                                                        'Are you sure you want to ' +
                                                            enableString.toLowerCase() +
                                                            ' this signature?',
                                                        function (answer) {
                                                            if (answer == 'yes') {
                                                                record.set('disabled', !record.get('disabled'));
                                                                signatures.sync({
                                                                    success: function (err, msg) {
                                                                        Ext.toast('Record updated', 1000);
                                                                    },
                                                                    failure: function (batch) {
                                                                        Ext.Msg.alert(
                                                                            'Something went wrong',
                                                                            'Could not enable record!'
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
                                                                ui: 'action loading',
                                                                text: enableString,
                                                            },
                                                        ]
                                                    );
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
                                                    hidden: '{record.is_default ? true:false}',
                                                    objectPermission: '{objectPermissions}',
                                                },
                                                handler: function (cmp) {
                                                    let vm = this.upVM(),
                                                        store = vm.get('signatures'),
                                                        record = this.upVM().get('record');
                                                    Ext.Msg.confirm(
                                                        'Delete',
                                                        'Are you sure you want to delete this signature?',
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
                                cls: 'c-blue-grey',
                                bind: {
                                    html: '<i>{record.signature_label}</i>',
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],
});
