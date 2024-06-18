import './IncomingFormContent';
import './OutgoingFormContent';
import './RequestFormContent';

Ext.define('Abraxa.view.portlog.payment.PaymentForm', {
    extend: 'Ext.form.Panel',
    xtype: 'portcall.payment.form',
    flex: 1,
    scrollable: 'y',
    layout: 'vbox',
    reference: 'createPayment',
    items: [
        {
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            docked: 'top',
        },
        {
            xtype: 'container',
            scrollable: 'y',
            flex: 1,
            cls: 'general_data_container',
            bind: {
                items: '{paymentContent}',
            },
        },
        {
            xtype: 'container',
            cls: 'a-attachments-wrap',
            slug: 'portcallPaymentАttachment',
            bind: {
                hidden: '{showFiles}',
                permission: '{userPermissions}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-titlebar',
                    html: '<div class="x-title">Attachments</div>',
                },
                {
                    xtype: 'list',
                    layout: {
                        type: 'hbox',
                        wrap: true,
                    },
                    bind: {
                        store: '{files}',
                    },
                    cls: 'a-voyage-attachments',
                    itemTpl:
                        '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{document.extension}"></div><div><a class="file_name" href="javascript:void(0);">{document.original_name}</a><span class="sm-title">{document.size} kb</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
                    itemConfig: {
                        cls: 'a-attachment-item',
                        minWidth: 0,
                        layout: {
                            type: 'hbox',
                            pack: 'space-between',
                        },
                    },
                    listeners: {
                        click: {
                            element: 'element',
                            delegate: 'i.remove_attachment',
                            fn: function (cmp, a) {
                                var store = this.component.getStore();
                                var record = this.component.getSelection();
                                store.remove(record);
                            },
                        },
                    },
                },
            ],
        },
    ],
});
