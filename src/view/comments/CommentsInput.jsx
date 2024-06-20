Ext.define('Abraxa.view.comments.CommentsInput', {
    extend: 'Ext.Container',
    xtype: 'comments.input',
    testId: 'tasksCommentsInput',
    shadow: false,
    scrollable: true,
    cls: 'a-chatter-input a-bt-100',
    items: [
        {
            xtype: 'container',
            cls: 'a-chatter-textarea',
            testId: 'tasksCommentsInputChatterArea',
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
                    xtype: 'div',
                    testId: 'tasksCommentsInputChatterAreaLeaveNoteDiv',
                    ui: 'classic no-border',
                    placeholder: 'Leave a note',
                    flex: 1,
                    cls: 'mention_enabled input_with_mention_main',
                    html: '<div contenteditable="true" class="content_editable_element mention_div" data-placeholder="Leave a note"></div>',
                    listeners: {
                        painted: function (el) {
                            const textarea = Ext.fly(
                                this.up('comments\\.input').down('[cls~=input_with_mention_main]').el.dom
                            ).query('.content_editable_element')[0];
                            textarea.innerHTML = '';
                            textarea.classList.remove('fake-focus');
                        },
                        click: {
                            element: 'element',
                            single: true,
                            fn: function (component, el, eOpt) {
                                el.classList.add('fake-focus');
                                const upVM = this.component.lookupViewModel();
                                var users = upVM.get('users'),
                                    data = [],
                                    record = upVM.get('record');

                                // if (record)
                                //     document.getElementById('mention').innerHTML = record.get('note');

                                users.each(function (record) {
                                    let user = record.getData();

                                    user.name = user.first_name + user.last_name;
                                    user.type = 'user';

                                    data.push({
                                        name: user.first_name + user.last_name,
                                        type: 'user',
                                        profile_image: user.profile_image,
                                        abbr: user.abbr,
                                        full_name: user.full_name,
                                        id: user.id,
                                    });
                                });

                                var editor = this,
                                    users = this.component.upVM().get('users'),
                                    fieldId = 'mention';

                                let myMention = new Mention({
                                    input: Ext.fly(this.el.dom).query('.content_editable_element')[0],
                                    reverse: true,
                                    options: data,
                                    // update: function () {
                                    //     document.querySelector('#data').innerHTML = JSON.stringify(this.findMatches(), null, '\t')
                                    // },
                                    match: function (word, option) {
                                        return (
                                            option.name.startsWith(word) ||
                                            option.description.toLowerCase().indexOf(word.toLowerCase()) >= 0
                                        );
                                    },
                                    template: function (option) {
                                        switch (option.type) {
                                            case 'user':
                                                let avatar =
                                                    '<div class="a-person a-icon-round"><span class="a-int">' +
                                                    option.abbr +
                                                    '</span></div>';
                                                if (option.profile_image && option.profile_image != '') {
                                                    let img = option.profile_image;
                                                    avatar =
                                                        '<div class="a-person a-icon-round"><img data-id="last_updated_by_appointments" class="a-profile-image" height="22" src="' +
                                                        img +
                                                        '"></div>';
                                                }
                                                return (
                                                    avatar +
                                                    ' ' +
                                                    option.full_name +
                                                    (option.description
                                                        ? ' <span class="mention_description">(' +
                                                          option.description +
                                                          ')</span>'
                                                        : '') +
                                                    '<span class="menition_type">' +
                                                    option.type +
                                                    '</span>'
                                                );
                                        }
                                    },
                                });
                            },
                        },
                        keyup: {
                            element: 'element',
                            fn: function (component, el, eOpt) {
                                if (el.innerHTML !== '') {
                                    el.classList.add('fake-focus');
                                } else {
                                    el.classList.remove('fake-focus');
                                }
                            },
                        },
                    },
                },
                {
                    xtype: 'button',
                    testId: 'tasksCommentsInputChatterAreaLeaveNoteDivSendBtn',
                    width: 34,
                    height: 34,
                    margin: '2 0 2 8',
                    ui: 'normal-light round',
                    iconCls: 'md-icon-outlined md-icon-send',
                    tooltip: {
                        html: 'Send',
                        showDelay: 0,
                        hideDelay: 0,
                        align: 'bc-tc?',
                    },
                    handler: function () {
                        mixpanel.track('Button clicked', {
                            Type: 'Button',
                            Target: 'Create comment button',
                            Tag: 'Secondary event',
                        });

                        let textarea = Ext.fly(
                                this.up('comments\\.input').down('[cls~=input_with_mention_main]').el.dom
                            ).query('.content_editable_element')[0],
                            value = textarea.innerHTML,
                            store = this.upVM().get('comments'),
                            subObjects = this.upVM().get('subObjects'),
                            tab = this.upVM().get('husbandryMenu.selection.tab'),
                            user_mentions_ids = [],
                            record = this.upVM().get('record'),
                            object_record = this.upVM().get('object_record');

                        Array.from(Ext.fly(textarea).query('.user_mention')).forEach((el) =>
                            user_mentions_ids.push(parseInt(el.getAttribute('data-object-id')))
                        );

                        let subObjectName = '';

                        if (record.$className == 'Abraxa.model.task.Task') {
                            subObjectName = record.get('sub_object_name');
                        } else if (subObjects && subObjects.length) {
                            let subObjectRecord = Ext.Array.findBy(subObjects, function (rec) {
                                if (rec.model_name === record.get('model_name') && rec.id === record.get('id')) {
                                    return rec;
                                }
                            });
                            if (subObjectRecord) {
                                subObjectName = subObjectRecord.name;
                            }
                        }
                        if (value && value.length > 0) {
                            store.add({
                                note: value,
                                user_mentions: JSON.stringify(Ext.Array.unique(user_mentions_ids)),
                                noteable_id: record.get('id'),
                                noteable_type: record.get('model_name'),
                                ownerable_id: object_record
                                    ? object_record.get('id')
                                        ? object_record.get('id')
                                        : object_record.get('org_id')
                                    : record.get('id'),
                                ownerable_type: object_record
                                    ? object_record.get('model_name')
                                    : record.get('model_name'),
                                sub_object_name: subObjectName,
                            });
                            store.sync({
                                success: function () {
                                    mixpanel.track('Record created', {
                                        Type: 'Comment',
                                        Target: 'Right panel',
                                        Tag: 'Primary event',
                                    });

                                    Ext.toast('Record updated', 1000);
                                },
                            });
                        }
                        textarea.innerHTML = '';
                        textarea.classList.remove('fake-focus');
                    },
                },
            ],
        },
    ],
});
