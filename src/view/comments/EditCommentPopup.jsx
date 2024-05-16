import './EditCommentInput';

Ext.define('Abraxa.view.comments.EditCommentPopup', {
    extend: 'Ext.Dialog',
    alias: 'widget.EditCommentPopup',
    xtype: 'EditCommentPopup',
    title: 'Edit Note',
    testId: 'editCommentPopup',
    right: 80,
    bottom: 0,
    alwaysOnTop: true,
    viewModel: true,
    showAnimation: {
        type: 'slide',
        direction: 'up',
    },
    modal: false,
    width: 480,
    collapsible: {
        tool: false,
    },
    closable: false,
    draggable: false,
    height: 460,
    padding: '0 24 16 24',
    cls: 'a-dialog-add-note',
    reference: 'add_edit_note',
    publishes: ['collapsed'],
    requires: ['Ext.panel.Collapser'],
    tools: {
        close: {
            testId: 'editCommentPopupCloseTooltip',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            handler: function (me) {
                let dialog = this.up('dialog');
                // let notes = dialog.upVM().get('object_record').notes();

                let commentsStore = dialog.upVM().get('comments');
                Ext.Msg.confirm(
                    'Confirmation',
                    'Would you like to discard all changes?',
                    function (answer) {
                        if (answer == 'yes') {
                            // notes.rejectChanges();
                            commentsStore.rejectChanges();
                            dialog.destroy();
                        }
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            testId: 'editCommentPopupConfirmCancelBtn',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            testId: 'editCommentPopupConfirmDiscardBtn',
                            itemId: 'yes',
                            enableToggle: true,
                            ui: 'action loading',
                            text: 'Discard',
                        },
                    ]
                );
            },
        },
    },
    items: [
        {
            xtype: 'EditCommentInput',
        },
    ],
});
