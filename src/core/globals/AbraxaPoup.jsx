import '../../view/common/dialog/SuccessfullyDialog';

Ext.define('Abraxa.popup', {
    singleton: true,

    showSuccessDialog: function (title, content, storeForReload = null) {
        if (Ext.getCmp('showSuccessDialog')) {
            Ext.getCmp('showSuccessDialog').destroy();
        }
        let dialog = Ext.create('Abraxa.view.common.dialog.common.SuccessfullyDialog', {
            id: 'showSuccessDialog',
            cls: 'abraxa_success_dialog a-dialog-success',
            viewModel: {
                data: {
                    title: title,
                    content: content,
                    storeForReload: storeForReload,
                },
            },
            listeners: {
                show: function (me) {
                    if (me.upVM().get('storeForReload')) {
                        me.upVM().get('storeForReload').reload();
                    }
                },
            },
        });
        dialog.show();
    },
});
