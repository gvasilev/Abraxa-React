// NOTE(boyan): created new class instead of editing Abraxa.view.comments.Comments
// in order to avoid breaking other components where it is used
import './CommentsInput';
import '../common/tooltips/PersonToolTip';
import './EditCommentPopup';

Ext.define('Abraxa.view.comments.CommentsList', {
    extend: 'Abraxa.core.AbraxaFormList',
    alias: 'widget.CommentsList',
    xtype: 'CommentsList',
    testId: 'commentsList',
    cls: 'chatter',
    variableHeights: true,
    scrollable: true,
    store: [],
    emptyText:
        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No comments available</span></div></div>',
    itemConfig: {
        xtype: 'container',
        // flex: 1,
        width: '100%',
        cls: 'x-listitem a-message-item white-space',
        viewModel: {
            data: {
                hovered: false,
            },
            formulas: {
                isOwn: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function(record) {
                        let currentUser = this.get('currentUser');

                        if (record.get('created_by') == currentUser.get('id')) {
                            return 'own';
                        }
                        return false;
                    },
                },
                user: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function(record) {
                        let commentator = record.get('commentator');

                        if (commentator) return commentator.first_name[0] + '.' + commentator.last_name;
                    },
                },
                edited: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function(record) {
                        if (record.get('created_at'))
                            return (
                                record.get('created_at').setSeconds('00') == record.get('updated_at').setSeconds('00')
                            );
                    },
                },
                likes: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function(record) {
                        if (record) return record.likes();
                    },
                },
                tooltipText: {
                    bind: {
                        bindTo: '{record.likes}',
                        deep: true,
                    },
                    get: function(likes) {
                        let html = 'Like';
                        if (likes.getCount()) {
                            html = '<strong>Liked by</strong>';
                            let currentUser = this.get('currentUser'),
                                users = this.get('users'),
                                user = likes.queryBy(function(rec, id) {
                                    return rec.get('created_by') == currentUser.get('id');
                                }).items[0],
                                others = likes.queryBy(function(rec, id) {
                                    return rec.get('created_by') != currentUser.get('id');
                                }).items;

                            if (user) {
                                html += '<br>You';
                            }
                            if (others) {
                                Ext.each(others, function(u) {
                                    let usr = users.queryBy(function(rec, id) {
                                        return rec.get('id') == u.get('created_by');
                                    }).items[0];
                                    if (usr) {
                                        html += '<br>' + usr.get('first_name')[0] + '.' + usr.get('last_name');
                                    }
                                });
                            }
                        }
                        return html;
                    },
                },
                updatedAtDateFormated: {
                    bind: {
                        bindTo: '{record.updated_at}',
                        deep: true,
                    },
                    get: function(updatedAt) {
                        if (updatedAt) {
                            return Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(updatedAt, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                        } else {
                            return '';
                        }
                    },
                },
                createdAtDateFormated: {
                    bind: {
                        bindTo: '{record.created_at}',
                        deep: true,
                    },
                    get: function(createdAt) {
                        if (createdAt) {
                            return Abraxa.getApplication()
                                .getController('AbraxaController')
                                .parseMomentDate(createdAt, AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                        } else {
                            return '';
                        }
                    },
                },
            },
        },
        layout: {
            type: 'hbox',
            pack: 'space-between',
        },
        items: [
            {
                xtype: 'abraxa.container',
                hidden: true,
                top: 6,
                cls: 'chat-message-tools',
                items: [
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-edit',
                        tooltip: 'Edit',
                        testId: 'commentsListEditCommentBtn',
                        bind: {
                            hidden: '{object_record.is_archived}',
                        },
                        handler: function() {
                            mixpanel.track('Button clicked', {
                                Type: 'Button',
                                Target: 'Edit comment button',
                                Tag: 'Secondary event',
                            });

                            let record = this.upVM().get('record');
                            // editContainer = Ext.ComponentQuery.query('[cls~=comment_edit]')[0],
                            // element = Ext.fly(editContainer.down('[cls~=input_with_mention_main]').el.dom).query('.mention_div')[0];

                            record.set('editMode', true);

                            let button = this;

                            // Check if a note is already opened
                            if (button.noteOpened) {
                                return;
                            }

                            button.noteOpened = true;

                            let commentsStore = this.up('CommentsList').getStore();

                            let note = Ext.create('Abraxa.view.comments.EditCommentPopup', {
                                title: 'Edit comment',

                                viewModel: {
                                    stores: {
                                        comments: { source: commentsStore },
                                    },
                                    data: {
                                        object_record: this.upVM().get('object_record'),
                                        users: this.upVM().get('users'),
                                        sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                        currentUser: this.upVM().get('currentUser'),
                                        editMode: true,
                                        record: record,
                                    },
                                },
                                // Add listeners to reset the flag when the note is closed
                                listeners: {
                                    destroy: () => {
                                        button.noteOpened = false; // Reset the flag
                                    },
                                },
                            });

                            // Show the note
                            note.show();
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-close md-icon-outlined',
                        tooltip: 'Delete comment',
                        testId: 'commentsListDeleteCommentBtn',
                        bind: {
                            hidden: '{object_record.is_archived}',
                        },
                        handler: function() {
                            mixpanel.track('Button clicked', {
                                Type: 'Button',
                                Target: 'Delete comment button',
                                Tag: 'Secondary event',
                            });

                            let vm = this.upVM(),
                                store = vm.get('comments'),
                                record = this.upVM().get('record');
                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this record?',
                                function(answer) {
                                    if (answer == 'yes') {
                                        store.remove(record);
                                        if (store.source) {
                                            store.getSource().sync({
                                                success: function() {
                                                    mixpanel.track('Record deleted', {
                                                        Type: 'Comment',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });

                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        } else {
                                            store.sync({
                                                success: function() {
                                                    mixpanel.track('Record deleted', {
                                                        Type: 'Comment',
                                                        Target: 'Right panel',
                                                        Tag: 'Primary event',
                                                    });

                                                    Ext.toast('Record updated', 1000);
                                                },
                                            });
                                        }
                                    }
                                },
                                this,
                                [
                                    {
                                        xtype: 'button',
                                        itemId: 'no',
                                        margin: '0 8 0 0',
                                        text: 'Cancel',
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'yes',
                                        ui: 'decline alt',
                                        text: 'Delete',
                                        separator: true,
                                    },
                                ],
                            );
                        },
                    },
                ],
            },
            {
                xtype: 'public.updated.by',
                cls: 'chatter-avatar',
                testId: 'commentsListCommentator',
                bind: {
                    data: {
                        user: '{record.commentator}',
                        hide_tooltip: true,
                    },
                },
            },
            {
                xtype: 'container',
                flex: 1,
                cls: 'chatter-message-cont',
                testid: 'commentsListCommentsChatterMessageContainer',
                items: [
                    {
                        xtype: 'div',
                        cls: 'chatter-title',
                        testId: 'commentsListCommentsChatterMessageContainerCommentatorName',
                        bind: {
                            html: '<a href="javascript:void(0)" class="a-user">{user}</a><span class="a-date">{createdAtDateFormated}</span>',
                            // style: 'text-align: "left"',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.a-user',
                                fn: function(el) {
                                    if (this.component.upVM().get('record.commentator')) {
                                        var user = this.component.upVM().get('record.commentator');
                                        let tipExist = Ext.getCmp('createdByTool');
                                        if (tipExist) {
                                            tipExist.destroy();
                                        }
                                        if (user) {
                                            Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                                target: el.target,
                                                id: 'createdByTool',
                                                viewModel: {
                                                    data: {
                                                        user: user,
                                                        clickedElement: el.target,
                                                    },
                                                },
                                            }).show();
                                        }
                                    }
                                },
                            },
                        },
                    },
                    {
                        xtype: 'container',
                        hidden: false,
                        items: [
                            {
                                xtype: 'div',
                                bind: {
                                    cls: 'chatter-message',
                                    html: '{record.note}',
                                },
                            },
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'hbox',
                                    pack: 'end',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        hidden: true,
                                        cls: 'text-right',
                                        margin: '0 16',
                                        testId: 'commentsListEditedOnDiv',
                                        bind: {
                                            hidden: '{edited}',
                                            html: '<small class="a-edited" title="Edited on {updatedAtDateFormated}">Edited</small>',
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        iconCls: 'md-icon-thumb-up md-icon-outlined',
                                        ui: 'default mini',
                                        iconAlign: 'right',
                                        cls: 'like_button',
                                        hidden: true,
                                        hideMode: 'opacity',
                                        testId: 'commentsListLikeCommentBtn',
                                        // text: 23,
                                        bind: {
                                            text: '{likes.count ? likes.count : null}',
                                            ui: '{likes.count ? "normal mini" : "default mini"}',
                                            hidden: '{likes.count || hovered ? false : true}',
                                            iconCls: 'md-icon-thumb-up {likes.count ? "" : "md-icon-outlined"}',
                                            tooltip: {
                                                html: '{tooltipText}',
                                                anchor: true,
                                                anchorToTarget: true,
                                                align: 'tc-bc?',
                                                showDelay: 0,
                                                hideDelay: 0,
                                                dismissDelay: 0,
                                                allowOver: false,
                                                closeAction: 'destroy',
                                            },
                                        },
                                        handler: function(btn) {
                                            mixpanel.track('Button clicked', {
                                                Type: 'Button',
                                                Target: 'Like comment button',
                                                Tag: 'Secondary event',
                                            });

                                            let likes = btn.upVM().get('likes'),
                                                vm = btn.upVM(),
                                                record = btn.upVM().get('record'),
                                                currentUser = btn.upVM().get('currentUser'),
                                                like = likes.queryBy(function(rec, id) {
                                                    return rec.get('created_by') == currentUser.get('id');
                                                }).items[0];

                                            if (like) {
                                                likes.remove(like);
                                                likes.sync();

                                                mixpanel.track('Record unliked', {
                                                    Type: 'Comment',
                                                    Target: 'Right panel',
                                                    Tag: 'Primary event',
                                                });
                                            } else {
                                                likes.add({
                                                    object_id: vm.get('object_id'),
                                                    object_meta_id: vm.get('object_meta_id'),
                                                    likable_type: record.get('model_name'),
                                                    likable_id: record.get('id'),
                                                });

                                                likes.sync();

                                                mixpanel.track('Record liked', {
                                                    Type: 'Comment',
                                                    Target: 'Right panel',
                                                    Tag: 'Primary event',
                                                });
                                            }
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
        listeners: {
            mouseenter: {
                element: 'element',
                fn: function fn() {
                    let cmp = this.component,
                        record = cmp.upVM().get('record');

                    if (cmp.upVM().get('isOwn') && !record.get('editMode'))
                        cmp.down('[cls~=chat-message-tools]').show();

                    cmp.upVM().set('hovered', true);
                },
            },
            mouseleave: {
                element: 'element',
                fn: function fn() {
                    let cmp = this.component;

                    cmp.down('[cls~=chat-message-tools]').hide();
                    if (!cmp.upVM().get('record').likes().count()) {
                        cmp.down('[cls~=like_button]').hide();
                    }
                    cmp.upVM().set('hovered', false);
                },
            },
            click: {
                element: 'element',
                delegate: 'a',
                fn: function(el) {
                    let type = el.currentTarget.getAttribute('data-object-type');
                    let vm = this.component.upVM();

                    switch (type) {
                        case 'user':
                            let tipExist = Ext.getCmp('createdCommentByTool');
                            if (tipExist) {
                                tipExist.destroy();
                            }
                            Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                                id: 'createdCommentByTool',
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        user_id: el.currentTarget.getAttribute('data-object-id'),
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                            break;
                    }
                },
            },
        },
    },
});
