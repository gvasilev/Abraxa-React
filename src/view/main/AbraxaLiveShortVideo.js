Ext.define('AbraxaLiveShortVideo', {
    extend: 'Ext.Dialog',
    xtype: 'shortvideodialog',
    viewModel: {
        data: {
            pip: false,
        },
    },
    modal: true,
    draggable: true,
    floated: true,
    ui: 'dark',
    padding: 0,
    width: 720,
    hideOnMaskTap: false,
    bodyCls: 'negative_nine',
    listeners: {
        mouseenter: {
            element: 'element',
            fn: function fn() {
                let cmp = this.component;

                cmp.upVM().set('hovered', true);
            },
        },
        mouseleave: {
            element: 'element',
            fn: function fn() {
                let cmp = this.component;

                cmp.upVM().set('hovered', false);
            },
        },
    },
    items: [
        {
            xtype: 'toolbar',
            top: 0,
            left: 0,
            hidden: true,
            bind: {
                hidden: '{hovered ? false : true}',
            },
            items: [
                {
                    xtype: 'tool',
                    cls: 'a-tool-rotate',
                    iconCls: 'md-icon-launch',
                    ui: 'dark',
                    bind: {
                        hidden: '{pip ? false : true}',
                    },
                    handler: function () {
                        let vm = this.upVM(),
                            dialog = this.up('dialog');

                        vm.set('pip', false);
                        dialog.setHeight('auto');
                        dialog.setWidth(720);
                        dialog.setDraggable(true);
                        dialog.setModal(true);
                        dialog.alignTo('main-viewport', 'c-c');
                    },
                },
            ],
        },
        {
            xtype: 'toolbar',
            top: 0,
            right: 0,
            hidden: true,
            bind: {
                hidden: '{hovered ? false : true}',
            },
            items: [
                {
                    xtype: 'tool',
                    iconCls: 'md-icon-picture-in-picture-alt',
                    ui: 'dark',
                    bind: {
                        hidden: '{pip ? true : false}',
                    },
                    handler: function () {
                        let vm = this.upVM(),
                            dialog = this.up('dialog');

                        vm.set('pip', true);
                        dialog.setHeight(225);
                        dialog.setWidth(400);
                        dialog.setDraggable(false);
                        dialog.setModal(false);
                        dialog.alignTo('main-viewport', 'bl-br', [10, 10]);
                    },
                },
                {
                    xtype: 'tool',
                    iconCls: 'md-icon-close',
                    ui: 'dark',
                    handler: function () {
                        this.up('dialog').destroy();
                    },
                },
            ],
        },
        {
            xtype: 'div',
            html: "<video controls poster='https://static.abraxa.com/videos/a-live-short-poster.png' disablePictureInPicture autoplay controlsList='nodownload' width='100%' height='auto'><source src='https://static.abraxa.com/videos/wellerman.mp4' type='video/mp4'></source></video>",
        },
    ],
});
