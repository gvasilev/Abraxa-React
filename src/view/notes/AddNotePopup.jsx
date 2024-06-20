import './NotesInput';
import './MentionDiv';

Ext.define('Abraxa.view.notes.AddNotePopup', {
    extend: 'Ext.Dialog',
    xtype: 'add.note',
    title: 'New Note',
    testId: 'addNotePopup',
    right: 80,
    bottom: 0,
    alwaysOnTop: true,
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
    viewModel: {
        formulas: {
            objectRender: {
                bind: {
                    bindTo: '{object_record}',
                    deep: true,
                },
                get: function (record) {
                    if (record) {
                        let html = '';

                        var str = record.get('model_name');
                        var n = str.lastIndexOf('\\');
                        var result = str.substring(n + 1);

                        switch (result) {
                            case 'Portcall':
                                html =
                                    '<div class="x-chip a-chip-app"><i class="md-icon-outlined">business_center</i><div class="x-text-el">' +
                                    record.getVoyage().get('vessel_name') +
                                    ' <span class="sm-title">(' +
                                    record.get('file_id') +
                                    ')</span></div></div>';
                                break;

                            case 'Organization':
                                html =
                                    '<div class="x-chip a-chip-company"><i class="abraxa-icon-cdb"></i><div class="x-text-el">' +
                                    record.get('org_name') +
                                    ' <span class="sm-title">(CDB-' +
                                    record.get('org_id') +
                                    ')</span></div></div>';
                                break;
                        }
                        return html;
                    }
                },
            },
        },
    },
    height: 460,
    padding: '0 24 16 24',
    cls: 'a-dialog-add-note',
    reference: 'add_edit_note',
    publishes: ['collapsed'],
    requires: ['Ext.panel.Collapser'],
    tools: {
        expand: {
            iconCls: 'md-icon-remove',
            testId: 'addNotePopupMinimizeTooltip',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Minimize',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            bind: {
                hidden: '{add_edit_note.collapsed}',
            },
            handler: function () {
                this.up('dialog').collapse();
            },
        },
        collapse: {
            iconCls: 'md-icon-keyboard-capslock',
            testId: 'addNotePopupExpandTooltip',
            tooltip: {
                alwaysOnTop: true,
                anchorToTarget: true,
                html: 'Expand',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
            },
            bind: {
                hidden: '{!add_edit_note.collapsed}',
            },
            handler: function () {
                this.up('dialog').expand();
            },
        },
        close: {
            testId: 'addNotePopupCloseTooltip',
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
                let dialog = this.up('dialog'),
                    notes = dialog.upVM().get('object_record').notes();
                Ext.Msg.confirm(
                    'Confirmation',
                    'Would you like to discard all changes?',
                    function (answer) {
                        if (answer == 'yes') {
                            notes.rejectChanges();
                            dialog.destroy();
                        }
                    },
                    this,
                    [
                        {
                            xtype: 'button',
                            itemId: 'no',
                            margin: '0 8 0 0',
                            testId: 'addNotePopupConfirmCancelBtn',
                            text: 'Cancel',
                        },
                        {
                            xtype: 'button',
                            testId: 'addNotePopupConfirmDiscardBtn',
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
            xtype: 'notes.input',
        },
    ],
});
