Ext.define('Abraxa.view.inquiry.agent.AttachmentContainer', {
    extend: 'Ext.Container',
    xtype: 'inquiry.attachment.container',
    cls: 'a-attachments-wrap',
    slug: 'portcallAttachments',
    bind: {
        hidden: '{showFiles}',
        // permission: '{userPermissions}'
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
                '<div class="a-attachment"><div class="file-icon-new file-icon-sm-new" data-type="{ext}"></div><div><a class="file_name" href="javascript:void(0);">{firstName}</a><span class="sm-title">{size}</span></div><span style="cursor: pointer;"><i class="remove_attachment material-icons md-14" style="position: absolute; right:4px; top:4px;">close</i></span></div>',
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
});
