Ext.define('Abraxa.view.portcall.NotesInput', {
    extend: 'Ext.Container',
    xtype: 'notes.input',
    testId: 'notesInput',
    shadow: false,
    scrollable: true,
    // margin: '8 16 0 16',
    cls: 'a-chatter-input',
    flex: 1,
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'start',
            },
            margin: '8 0',
            items: [
                {
                    xtype: 'label',
                    cls: 'c-blue-grey fs-13 mr-16',
                    width: 140,
                    html: 'Record',
                },
                {
                    xtype: 'div',
                    cls: 'a-note-subheader',
                    bind: {
                        html: '{objectRender}',
                        hidden: '{object_record ? false : true}',
                    },
                },
            ],
        },
        {
            xtype: 'subobjects.combo',
            margin: '0 0 4 0',
            hidden: false,
            placeholder: 'Choose record',
            testId: 'notesInputChooseRecordField',
            clearable: true,
            forceSelection: true,
            bind: {
                disabled: '{relatedObject ? true : false}',
                hidden: '{noSubObjects ? true : false}',
                value: '{selectedSubObject}',
                store: {
                    data: '{subObjects}',
                },
            },
            label: 'Related to',
            labelAlign: 'left',
            ui: 'classic hovered-border',
            // cls: 'a-subobject-combo',
            listeners: {
                painted: function () {
                    this.setValue(this.upVM().get('selectedSubObject'));
                },
                change: function (me, newValue, oldValue, eOpts) {
                    if (!newValue) {
                        let record = this.upVM().get('record');

                        if (record) {
                            record.set('noteable_type', null);
                            record.set('noteable_id', null);
                            record.set('sub_object_name', null);
                        }
                    }
                },
                select: function (cmp, value) {
                    let record = this.upVM().get('record');

                    record.set('noteable_type', value.get('model'));
                    record.set('noteable_id', value.get('id'));
                    record.set('sub_object_name', value.get('name'));
                },
            },
        },
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
                    testId: 'notesInputNoNotesDiv',
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
                            testId: 'notesInputCancelBtn',
                            margin: '0 8',
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
                                            testId: 'notesInputCancelConfirmNoBtn',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            testId: 'notesInputCancelConfirmYesBtn',
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
                            testId: 'notesInputSaveBtn',
                            // iconCls: 'md-icon-send md-icon-outlined',
                            bind: {
                                text: '{record ? "Save" : "Add"}',
                            },
                            handler: function (me) {
                                let notes = this.upVM().get('object_record').notes(),
                                    div = document.getElementById('mention'),
                                    note = div.innerHTML,
                                    record = this.upVM().get('record'),
                                    user_mentions_ids = [],
                                    object_record = this.upVM().get('object_record'),
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
                                            user_mentions: JSON.stringify(Ext.Array.unique(user_mentions_ids)),
                                            ownerable_id: ownerableId,
                                            ownerable_type: ownerableType,
                                        });
                                    } else {
                                        record.set('note', note);
                                        record.set(
                                            'user_mentions',
                                            JSON.stringify(Ext.Array.unique(user_mentions_ids))
                                        );
                                        record.set('ownerable_id', ownerableId);
                                        record.set('ownerable_type', ownerableType);
                                    }
                                    notes.getProxy().setExtraParams({
                                        object_meta_id: ownerableId,
                                    });

                                    notes.sync({
                                        success: function () {
                                            Ext.toast('Record updated', 1000);
                                            me.up('dialog').destroy();
                                        },
                                        failure: function (batch, options) {
                                            me.toggle();
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
