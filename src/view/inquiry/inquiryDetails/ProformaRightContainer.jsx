import './ProformaGrid';
import '../../attachments/AttachmentsDialog';
import '../../portcall/agent/appointment/AddInstructions';
Ext.define('Abraxa.view.inquiry.inquiryDetails.ProformaRightContainer', {
    extend: 'Ext.Container',
    xtype: 'proforma.right.container',
    testId: 'proformaRightContainer',
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            cls: 'a-bb-100',
            weight: 2,
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    height: 64,
                    items: [
                        {
                            xtype: 'div',
                            margin: '0 16 0 0',
                            hidden: true,
                            bind: {
                                html: "<div class='a-badge a-badge-{inquiryMenu.selection.slug}'><i class='md-icon-outlined'>{inquirySectionIcon}</i></div>",
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '<span>Proforma estimates</span>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '8 16 8 24',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Instructions',
                            testId: 'proformaRightContainerInstructionsButton',
                            ui: 'blue-light color-default bgr-light-grey small',
                            iconCls: 'md-icon-outlined md-icon-description',
                            bind: {
                                ui: '{isEmptyInstruction ? "blue-light color-default bgr-light-grey small":"default color-default bgr-light-grey small"}',
                                permission: '{userPermissions}',
                            },
                            handler: function (me) {
                                let record = me.upVM().get('object_record'),
                                    instruction = me.upVM().get('instruction');

                                Ext.create('Abraxa.view.portcall.appointment.AddInstructions', {
                                    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">description</i></div>View instructions',
                                    tools: [],
                                    viewModel: {
                                        parent: me.upVM(),
                                        stores: {
                                            files: Ext.create('Ext.data.Store'),
                                        },
                                        data: {
                                            editMode: true,
                                            inquiry: record,
                                            instruction: instruction,
                                        },
                                    },
                                    buttons: [
                                        {
                                            text: 'Cancel',
                                            margin: '0 8 0 0',
                                            handler: function () {
                                                let record = this.upVM().get('instruction');
                                                if (record) {
                                                    record.reject();
                                                }
                                                this.up('dialog').destroy();
                                            },
                                        },
                                        {
                                            enableToggle: true,
                                            ui: 'action loading',
                                            bind: {
                                                text: '{editMode ? "Save" : "Create"}',
                                                hidden: '{object_record.is_archived ? true:false}',
                                            },
                                            handler: function (me) {
                                                let dialog = me.up('dialog');
                                                let store = dialog.upVM().get('inquiry').instructions();
                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
                                                        Abraxa.utils.Functions.updateInquiry(
                                                            dialog.upVM().get('inquiry')
                                                        );
                                                        dialog.destroy();
                                                    },
                                                });
                                            },
                                        },
                                    ],
                                }).show();
                            },
                        },
                        {
                            xtype: 'div',
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'blue-light color-default bgr-light-grey small',
                                    cls: 'a-has-counter',
                                    iconCls: 'md-icon-outlined md-icon-file-copy',
                                    margin: '0 0 0 8',
                                    testId: 'proformaRightContainerAttachmentsButton',
                                    bind: {
                                        ui: '{object_record.attachments.count ? "blue-light color-default bgr-light-grey small":"default color-default bgr-light-grey small"}',
                                        text: 'Attachments <em>{object_record.attachments.count}</em>',
                                    },
                                    handler: function () {
                                        let vm = this.upVM(),
                                            attachments = vm.get('object_record').attachments();
                                        Ext.create('Abraxa.view.attachments.AttachmentsDialog', {
                                            viewModel: {
                                                parent: vm,
                                                data: {
                                                    selectedAttachment: null,
                                                    attachments: attachments,
                                                },
                                                formulas: {
                                                    selectedAttachment: {
                                                        bind: {
                                                            bindTo: '{attachmentsList.selection}',
                                                            deep: true,
                                                        },
                                                        get: function (record) {
                                                            if (record) {
                                                                return record;
                                                            }
                                                        },
                                                    },
                                                    dragListeners: {
                                                        bind: {
                                                            bindTo: '{nonEditable}',
                                                            deeP: true,
                                                        },
                                                        get: function (nonEditable) {
                                                            if (!nonEditable) {
                                                                return {
                                                                    element: 'element',
                                                                    drop: 'onDrop',
                                                                    dragleave: 'onDragLeaveListItem',
                                                                    dragover: 'onDragOverListItem',
                                                                };
                                                            } else {
                                                                return {};
                                                            }
                                                        },
                                                    },
                                                },
                                            },
                                        }).show();
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'proforma.grid',
        },
        {
            xtype: 'toolbar',
            padding: '8 16',
            height: 64,
            border: true,
            hidden: true,
            bind: {
                hidden: '{nonEditable}',
            },
            weight: 3,
            docked: 'bottom',
            cls: 'a-bt-100',
            layout: {
                type: 'hbox',
                pack: 'end',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '8 0 8 8',
                    ui: 'accent',
                    text: 'Appoint',
                    testId: 'proformaRightContainerAppointButton',
                    hidden: true,
                    bind: {
                        hidden: '{nonEditable}',
                    },
                    handler: function (me) {
                        let vm = me.upVM();
                        let inquiry = vm.get('object_record');
                        Ext.create('Abraxa.view.inquiry.appoint.AppointList', {
                            viewModel: {
                                parent: vm,
                                data: {
                                    inquiryOffers: inquiry.offers().setSorters([
                                        {
                                            property: 'created_at',
                                            direction: 'DESC',
                                        },
                                    ]),
                                    inquiry: inquiry,
                                },
                            },
                        }).show();
                    },
                },
            ],
        },
    ],
});
