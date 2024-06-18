Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'proforma.edit.menu',
    cls: 'a-main-edit-menu',
    width: 160,
    ui: 'has-icons medium',
    items: [
        {
            text: 'Rename',
            testId: 'renameProformaInquiryDetailsMenu',
            slug: 'portcallDocumentRename',
            bind: {
                permission: '{userPermissions}',
            },
            iconCls: 'md-icon-outlined md-icon-edit',
            handler: function (me) {
                let store = me.upVM().get('offers'),
                    object_record = me.upVM().get('object_record');
                Ext.create('Ext.Dialog', {
                    closable: true,
                    viewModel: {
                        parent: me.upVM(),
                    },
                    title: 'Rename',
                    items: [
                        {
                            xtype: 'textfield',
                            testId: 'renameProformaInquiryDetailsMenuTextField',
                            labelAlign: 'top',
                            label: 'Name',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: 'Proforma name',
                            clearable: false,
                            bind: {
                                value: '{offer.name}',
                            },
                            listeners: {
                                painted: function () {
                                    this.focus();
                                },
                            },
                        },
                    ],
                    buttons: [
                        {
                            text: 'Cancel',
                            margin: '0 8 0 0',
                            handler: function () {
                                store.rejectChanges();
                                this.up('dialog').destroy();
                            },
                        },
                        {
                            text: 'Save',
                            testId: 'renameProformaInquiryDetailsMenuSaveButton',
                            ui: 'action',
                            handler: function (me) {
                                store.sync({
                                    success: function () {
                                        Abraxa.utils.Functions.updateInquiry(object_record);
                                        Ext.toast('Record updated');
                                    },
                                });
                                this.up('dialog').destroy();
                            },
                        },
                    ],
                }).show();
            },
        },
        {
            text: 'Delete',
            testId: 'deleteProformaInquiryDetailsMenuButton',
            ui: 'decline',
            separator: true,
            iconCls: 'md-icon-outlined md-icon-delete',
            slug: 'cdbAgreementsDirectBillingDelete',
            bind: {
                permission: '{userPermissions}',
            },
            handler: function (me) {
                let store = me.upVM().get('offers'),
                    object_record = me.upVM().get('object_record'),
                    record = me.upVM().get('offer');
                Ext.Msg.confirm(
                    'Delete',
                    'Are you sure you would like to delete this entry?',
                    function (answer) {
                        if (answer == 'yes') {
                            store.getProxy().setExtraParams({
                                inquiry_id: object_record.get('id'),
                            });
                            store.remove(record);
                            store.sync({
                                success: function () {
                                    Abraxa.utils.Functions.updateInquiry(object_record);
                                    Ext.toast('Record deleted', 1000);
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
                            testId: 'deleteProformaInquiryDetailsMenuButtonConfirm',
                        },
                    ]
                );
            },
        },
    ],
});
