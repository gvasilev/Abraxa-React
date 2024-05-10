Ext.define('Abraxa.view.common.dialog.common.SuccessfullyDialog', {
    extend: 'Ext.Dialog',
    xtype: 'successfully.dialog',
    ui: 'dialog-md type3',
    cls: 'a-dialog-success',
    margin: 0,
    padding: 0,
    closable: true,
    draggable: false,
    manageBorders: false,
    minWidth: 420,
    maxWidth: 420,
    minHeight: 240,
    items: [
        {
            xtype: 'container',
            flex: 1,
            showAnimation: 'pop',
            layout: {
                type: 'vbox',
                pack: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'text-center',
                    style: 'margin: 0 auto',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="none"/><path d="M50.24,28.8A21.457,21.457,0,1,1,34.7,8.191L38.9,3.983A26.323,26.323,0,0,0,28.8,2,26.8,26.8,0,1,0,55.6,28.8M17.839,23.655,14.06,27.46,26.12,39.52l26.8-26.8L49.141,8.914,26.12,31.936Z" transform="translate(3.36 3.36)" fill="#009688"/></svg>',
                    width: 180,
                },
                {
                    xtype: 'div',
                    margin: '16 0 0 0',
                    cls: 'text-center a-success-heading',
                    bind: {
                        html: '<h1 class="m-0">{title}</h1>',
                    },
                },
                {
                    xtype: 'div',
                    cls: 'text-center a-success-text',
                    margin: '16 0',
                    padding: '0 32 32 32',
                    bind: {
                        html: '<span style="font-size: 16px; color: #6B7C93; line-height: 1.4;">{content}</span>',
                    },
                },
            ],
        },
    ],
});
