Ext.define('Abraxa.view.chatter.ChatterInput', {
    extend: 'Ext.Container',
    xtype: 'chatter.input',
    shadow: false,
    scrollable: true,
    cls: 'a-chatter-input a-bt-100',
    bind: {
        hidden: '{object_record.is_archived}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-chatter-textarea',
            layout: 'hbox',
            flex: 1,
            items: [
                {
                    xtype: 'div',
                    cls: 'chatter-avatar',
                    viewModel: {
                        formulas: {
                            currentUserAvatar: {
                                bind: {
                                    bindTo: '{currentUser}',
                                    deep: true,
                                },
                                get: function (user) {
                                    let abbr = user.get('first_name')[0] + user.get('last_name')[0],
                                        name = user.get('first_name')[0] + '.' + user.get('last_name'),
                                        img =
                                            '<div class="part_abbr a-badge-abbr"><span class="a-int">' +
                                            abbr +
                                            '</span></div>';
                                    if (user.get('profile_image') && user.get('profile_image') != '') {
                                        img =
                                            '<div class="part_abbr a-badge-abbr a-badge-img"><img data-id="last_updated_by_appointments" class="a-profile-image" height="30" src="' +
                                            user.get('profile_image') +
                                            '"><span class="a-circle" style="box-shadow: 0 0 0 1.5px #FFC107"></span></div>';
                                    }

                                    return img;
                                },
                            },
                        },
                    },
                    bind: {
                        html: '{currentUserAvatar}',
                    },
                },
                {
                    xtype: 'textareafield',
                    ui: 'classic no-border',
                    slug: 'portcallPublicBoard',
                    reference: 'chatterMessage',
                    publishes: ['value'],
                    bind: {
                        permission: '{userPermissions}',
                        cls: '{chatterMessage.value ? "fake-focus" : ""}',
                    },
                    placeholder: 'Comment or post an update',
                    maxRows: 4,
                    flex: 1,
                },
                {
                    xtype: 'button',
                    width: 34,
                    height: 34,
                    margin: '2 0 2 8',
                    ui: 'normal-light round',
                    iconCls: 'md-icon-outlined md-icon-send',
                    slug: 'portcallPublicBoard',
                    tooltip: {
                        html: 'Send',
                        showDelay: 0,
                        hideDelay: 0,
                        align: 'bc-tc?',
                    },
                    bind: {
                        permission: '{userPermissions}',
                    },
                    handler: function () {
                        mixpanel.track('Public board – send button');
                        let cmp = Ext.ComponentQuery.query('chatter\\.input')[0],
                            list = Ext.ComponentQuery.query('chatter\\.messages')[0],
                            chatterMessagesStore = cmp.upVM().get('chatter_messages'),
                            editor = cmp.down('textareafield'),
                            input = editor.getValue(),
                            receiver = null,
                            sender = editor.upVM().get('currentUser.id'),
                            sender_id = this.upVM().get('member')
                                ? this.upVM().get('member').get('id')
                                : this.upVM().get('object_record').get('member_id'),
                            lastIndex = chatterMessagesStore.getCount();

                        if (input) {
                            let record = chatterMessagesStore.add({
                                message: input,
                                created_by: sender,
                                receiver_id: receiver,
                                sender_id: sender_id,
                                user: editor.upVM().get('currentUser').getData(),
                            });
                            editor.clearValue();
                            chatterMessagesStore.sync({
                                success: function () {
                                    list.scrollToRecord(chatterMessagesStore.getAt(lastIndex));
                                },
                            });
                        }
                        editor.removeCls('fake-focus');
                    },
                },
            ],
        },
    ],
});
