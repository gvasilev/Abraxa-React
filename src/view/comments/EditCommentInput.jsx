import '../../view/notes/MentionDiv';

Ext.define('Abraxa.view.comments.EditCommentInput', {
    extend: 'Ext.Container',
    alias: 'widget.EditCommentInput',
    xtype: 'EditCommentInput',
    testId: 'commentsEditInput',
    shadow: false,
    scrollable: true,
    // margin: '8 16 0 16',
    cls: 'a-chatter-input',
    flex: 1,
    items: [
        {
            xtype: 'container',
            cls: 'a-chatter-textarea',
            layout: 'hbox',
            flex: 1,
            items: [
                {
                    xtype: 'mention.div',
                },
            ],
        },
        {
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            docked: 'bottom',
            items: [
                {
                    // xtype: 'notes.notify'
                    hidden: true,
                    xtype: 'div',
                    testId: 'commentsEditInputNoNotesDiv',
                    cls: 'no_note_text',
                    html: '<div class="c-red">Please add some text.</div>',
                },
                {},
                {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            text: 'Cancel',
                            testId: 'commentsEditInputCancelBtn',
                            margin: '0 8',
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
                                            testId: 'commentsEditInputCancelConfirmNoBtn',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            testId: 'commentsEditInputCancelConfirmYesBtn',
                                            enableToggle: true,
                                            ui: 'action loading',
                                            text: 'Discard',
                                        },
                                    ]
                                );
                            },
                        },
                        {
                            xtype: 'button',
                            enableToggle: true,
                            ui: 'action loading',
                            alignSelf: 'right',
                            testId: 'commentsEditInputSaveBtn',
                            text: 'Save',
                            handler: function (me) {
                                // let notes = this.upVM().get('object_record').notes();
                                let commentsStore = this.upVM().get('comments');

                                let div = document.getElementById('mention'),
                                    note = div.innerHTML,
                                    record = this.upVM().get('record'),
                                    user_mentions_ids = [],
                                    object_record = this.upVM().get('object_record')
                                        ? this.upVM().get('object_record')
                                        : this.upVM().get('record'),
                                    ownerableId = object_record.get('id'),
                                    ownerableType = object_record.get('model_name');
                                if (object_record.get('model_name') == 'App\\Models\\Organization\\Organization') {
                                    ownerableId = object_record.get('org_id');
                                }
                                Array.from(Ext.fly(div).query('.user_mention')).forEach((el) =>
                                    user_mentions_ids.push(parseInt(el.getAttribute('data-object-id')))
                                );

                                if (note.length >= 1) {
                                    Ext.ComponentQuery.query('[cls~=no_note_text]')[0].hide();
                                    Ext.ComponentQuery.query('[cls~=input_with_mention_main]')[0].removeCls(
                                        'x-invalid'
                                    );
                                    if (!Ext.isNumber(record.get('id'))) {
                                        mixpanel.track('Created a note');
                                        record.set({
                                            note: note,
                                            user_mentions: user_mentions_ids
                                                ? JSON.stringify(Ext.Array.unique(user_mentions_ids))
                                                : [],
                                            ownerable_id: ownerableId,
                                            ownerable_type: ownerableType,
                                            editMode: false,
                                        });
                                    } else {
                                        record.set('note', note);
                                        record.set(
                                            'user_mentions',
                                            user_mentions_ids ? JSON.stringify(Ext.Array.unique(user_mentions_ids)) : []
                                        );
                                        record.set('ownerable_id', ownerableId);
                                        record.set('ownerable_type', ownerableType);
                                        record.set('editMode', false);
                                    }

                                    record.modified['note'] =
                                        record.get('note') === undefined ? null : record.get('note');
                                    record.modified['user_mentions'] =
                                        record.get('user_mentions') === undefined ? [] : record.get('user_mentions');
                                    // notes.getProxy().setExtraParams({
                                    //     object_meta_id: ownerableId,
                                    // });
                                    // commentsStore.getProxy().setExtraParams({
                                    //     object_meta_id: ownerableId,
                                    // });
                                    // notes.sync({
                                    //     success: function () {
                                    //         Ext.toast('Record updated', 1000);
                                    //         me.up('dialog').destroy();
                                    //         // object_record.save();
                                    //     },
                                    // });

                                    commentsStore.sync({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                            me.up('dialog').destroy();
                                        },
                                    });
                                } else {
                                    Ext.ComponentQuery.query('[cls~=no_note_text]')[0].show();
                                    Ext.ComponentQuery.query('[cls~=input_with_mention_main]')[0].addCls('x-invalid');
                                    me.toggle();
                                }
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
