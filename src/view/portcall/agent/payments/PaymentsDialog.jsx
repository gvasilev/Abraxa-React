import './PaymentForm';

Ext.define('Abraxa.view.portcall.payments.PaymentsDialog', {
    extend: 'Ext.Dialog',
    xtype: 'payments.request.payment',
    testId: 'requestPaymentDialog',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 580,
    // height: '100%',
    minHeight: 580,
    maxHeight: '90%',
    padding: 0,
    alwaysOnTop: 2,
    closable: false,
    draggable: false,
    // maximizable: true,
    // maximized: false,
    controller: 'payments-controller',
    tools: {
        attach: {
            xtype: 'filebutton',
            testId: 'requestPaymentDialogAttachFileButton',
            margin: '0 0 0 8',
            ui: 'round tool-sm toggle',
            text: '',
            accept: '.pdf',
            iconCls: 'md-icon-attach-file',
            slug: 'portcallPaymentАttachment',
            bind: {
                hidden: '{nonEditable ? true : false}',
                permission: '{userPermissions}',
            },
            tooltip: {
                showOnTap: true,
                html: 'Attach file',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
                alwaysOnTop: 3,
            },
            listeners: {
                change: function (me, newValue) {
                    if (newValue) {
                        var files = this.getFiles(),
                            len = files.length,
                            ext,
                            fileStore = me.upVM().get('files'),
                            totalSize = 0;

                        for (var i = 0; i < len; i++) {
                            totalSize += files.item(i).size;
                            ext = files.item(i).name.split('.').pop();
                            let record = {
                                document: {
                                    extension: ext,
                                    original_name: files.item(i).name.split('.').slice(0, -1).join('.'),
                                    file: files.item(i),
                                    size: files.item(i).size,
                                },
                            };
                            fileStore.add(record);
                        }
                        if (totalSize > 10 * 1024 * 1024) {
                            Ext.Msg.warning(
                                'Upload Cancelled',
                                'Your file(s) payload size (' +
                                    (totalSize / 1024 / 1024).toFixed(2) +
                                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />'
                            );
                            return;
                        }
                    }
                    document.querySelector("input[type='file']").value = '';
                    me.setValue(null);
                },
            },
        },
        agreements: {
            xtype: 'button',
            margin: '0 0 0 8',
            padding: 0,
            maxHeight: 30,
            ui: 'progress-light color-default small',
            iconCls: 'md-icon-outlined md-icon-info',
            cls: 'a-has-counter x-has-menu',
            hidden: true,
            testId: 'requestPaymentDialogAgreementsButton',
            bind: {
                text: 'Agreements <em>{paymentAgreements.count}</em>',
                hidden: '{paymentAgreements.count ? false:true}',
            },
            menu: {
                minWidth: '320',
                items: [
                    {
                        xtype: 'div',
                        cls: 'h5',
                        margin: '8 16',
                        bind: {
                            html: 'Agreements',
                        },
                    },
                    {
                        xtype: 'agreements.list',
                        bind: {
                            store: '{paymentAgreements}',
                        },
                    },
                ],
            },
        },
        close: {
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    items: [
        {
            xtype: 'container',
            zIndex: '200',
            id: 'dropped-payment',
            cls: 'a-drop-container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'portcall.payment.form',
                },
            ],
            listeners: {
                element: 'element',
                drop: 'onDrop',
                dragleave: 'onDragLeaveListItem',
                dragover: 'onDragOverListItem',
            },
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            testId: 'requestPaymentDialogCancelButton',
            margin: '0 8 0 0',
            handler: function () {
                let record = this.upVM().get('crewing');
                if (record) {
                    record.reject();
                    record.services().rejectChanges();
                }
                this.up('dialog').destroy();
            },
        },
        {
            xtype: 'splitbutton',
            height: 34,
            text: 'Save',
            testId: 'requestPaymentDialogSaveButton',
            ui: 'action',
            handler: function (me) {
                me.up('dialog').getController().onCreate('normal');
            },
            menu: {
                items: [
                    {
                        iconCls: 'md-icon-outlined md-icon-save',
                        text: 'Save',
                        handler: function (me) {
                            me.up('dialog').getController().onCreate('normal');
                        },
                    },
                    {
                        iconCls: 'md-icon-outlined md-icon-send',
                        text: 'Save and send',
                        slug: 'portcallReport',
                        bind: {
                            permission: '{userPermissions}',
                        },
                        handler: function (me) {
                            me.up('dialog').getController().onCreate('send');
                        },
                    },
                    {
                        iconCls: 'md-icon-outlined md-icon-drive-file-rename-outline',
                        text: 'Save as draft',
                        hidden: true,
                        bind: {
                            hidden: '{hideDraftButton}',
                        },
                        handler: function (me) {
                            me.up('dialog').getController().onCreate('draft');
                        },
                    },
                ],
            },
        },
    ],
});
