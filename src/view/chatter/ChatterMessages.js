Ext.define('Abraxa.view.chatter.ChatterMessages', {
    extend: 'Ext.dataview.List',
    xtype: 'chatter.messages',
    cls: 'chatter',
    variableHeights: true,
    infinite: true,
    flex: 1,
    store: [],
    bind: {
        store: '{chatter_messages}',
    },
    emptyText:
        '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No Messages available</span></div></div>',
    scrollToToOnRefresh: false,
    itemConfig: {
        xtype: 'container',
        width: '100%',
        cls: 'x-listitem a-message-item white-space',
        padding: '16 24',
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
                    get: function (record) {
                        let currentUser = this.get('currentUser'),
                            object_record = this.get('object_record');
                        if (record.get('created_by') == currentUser.get('id')) {
                            return 'own';
                        }
                        return false;
                    },
                },
                isConsecutive: {
                    bind: {
                        bindTo: '{chatter_messages}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            store.each(function (record, idx) {
                                let previousRec = store.getData().getAt(idx - 1);
                                if (
                                    previousRec &&
                                    previousRec.get('created_by') == record.get('created_by') &&
                                    previousRec.get('receiver_id') == record.get('receiver_id')
                                ) {
                                    record.set('consecutive', true);
                                }
                            });
                        }
                    },
                },
                sender: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let members = this.get('members'),
                            object_record = this.get('object_record'),
                            res = null;

                        const user = record.get('user');
                        if (record) {
                            let company_name = '';
                            members.each(function (rec) {
                                if (rec.get('id') == record.get('sender_id')) {
                                    company_name = rec.get('org_name');
                                }
                            });

                            let abbr = user ? user.first_name[0] + user.last_name[0] : 'NA',
                                name = user ? user.first_name[0] + '.' + user.last_name : 'No such user',
                                img =
                                    '<div class="part_abbr a-badge-abbr"><span class="a-int">' + abbr + '</span></div>';
                            if (user ? user.profile_image && user.profile_image != '' : '') {
                                img =
                                    '<div class="part_abbr a-badge-abbr a-badge-img"><img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                    user.profile_image +
                                    '"></div>';
                            }
                            let companyName = 'No data available';
                            if (user) {
                                let company = user.company_info || user.company;
                                companyName = company.name;
                            }
                            return {
                                name: name,
                                img: img,
                                company_name: companyName,
                            };
                        }
                    },
                },
                likes: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) return record.likes();
                    },
                },
                tooltipText: {
                    bind: {
                        bindTo: '{record.likes}',
                        deep: true,
                    },
                    get: function (likes) {
                        let html = 'Like';
                        if (likes.getCount()) {
                            html = '<strong>Liked by</strong>';
                            let currentUser = this.get('currentUser'),
                                users = this.get('users'),
                                user = likes.queryBy(function (rec, id) {
                                    return rec.get('created_by') == currentUser.get('id');
                                }).items[0],
                                others = likes.queryBy(function (rec, id) {
                                    if (rec.get('created_by') != currentUser.get('id')) return rec;
                                }).items;

                            if (user) {
                                html += '<br>You';
                            }
                            if (others) {
                                Ext.each(others, function (u) {
                                    if (u.get('liker'))
                                        html += '<br>' + u.get('liker').first_name[0] + '.' + u.get('liker').last_name;
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
                    get: function (updatedAt) {
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
                    get: function (createdAt) {
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
                bind: {
                    top: '{record.consecutive ? 6 : 6}',
                },
                cls: 'chat-message-tools',
                items: [
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-edit',
                        tooltip: 'Edit',
                        handler: function () {
                            let vm = this.upVM(),
                                item = this.up('[cls~=x-listitem]'),
                                list = this.up('chatter\\.messages'),
                                chatterInput = item.down('[cls~=chatter-message-edit]'),
                                store = vm.get('chatter_messages'),
                                record = this.upVM().get('record');

                            store.each(function (record) {
                                record.set('editMode', false);
                            });
                            record.set('editMode', true);
                            list.select(record);

                            this.up('[cls~=chat-message-tools]').hide();
                            // chatterInput.down('froalaeditorfield').getEditor().html.set(record.get('message'));
                            list.refresh();
                            // list.ensureVisible(record, {
                            //     record: record,
                            //     select: true
                            // });
                            list.scrollToRecord(record);
                            chatterInput.down('textareafield').focus();
                        },
                    },
                    {
                        xtype: 'button',
                        ui: 'round tool-sm',
                        iconCls: 'md-icon-close md-icon-outlined',
                        tooltip: 'Delete',
                        handler: function () {
                            let vm = this.upVM(),
                                store = vm.get('chatter_messages'),
                                record = this.upVM().get('record');

                            Ext.Msg.confirm(
                                'Delete',
                                'Are you sure you want to delete this record?',
                                function (answer) {
                                    if (answer == 'yes') {
                                        store.remove(record);
                                        store.sync({
                                            success: function () {
                                                Ext.toast('Record updated', 1000);
                                            },
                                        });
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
                                ]
                            );
                        },
                    },
                ],
            },
            {
                xtype: 'public.updated.by',
                cls: 'chatter-avatar',
                bind: {
                    data: {
                        user: '{record.user}',
                        hide_tooltip: true,
                    },
                },
            },
            {
                xtype: 'container',
                flex: 1,
                cls: 'chatter-message-cont',
                bind: {
                    hidden: '{record.editMode ? true : false}',
                },
                items: [
                    {
                        xtype: 'div',
                        cls: 'chatter-title',
                        bind: {
                            html: '<a href="javascript:void(0)" class="a-user">{sender.name}</a><span class="a-company">({sender.company_name})</span><span class="a-date">{createdAtDateFormated}</span>',
                            style: 'text-align: {isOwn ? "right" : "left"}',
                            // hidden: '{record.consecutive ? true : false}'
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.a-user',
                                fn: function (el) {
                                    if (this.component.upVM().get('record.user')) {
                                        var user = this.component.upVM().get('record.user');
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
                        xtype: 'div',
                        bind: {
                            cls: 'chatter-message {isOwn}',
                            html: '{record.message}',
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
                                bind: {
                                    hidden: '{record.created_at != record.updated_at ? false : true}',
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
                                handler: function (btn) {
                                    let likes = btn.upVM().get('likes'),
                                        vm = btn.upVM(),
                                        record = btn.upVM().get('record'),
                                        currentUser = btn.upVM().get('currentUser'),
                                        like = likes.queryBy(function (rec, id) {
                                            return rec.get('created_by') == currentUser.get('id');
                                        }).items[0];

                                    if (like) {
                                        likes.remove(like);
                                        likes.sync();
                                    } else {
                                        likes.add({
                                            object_id: vm.get('object_id'),
                                            object_meta_id: vm.get('object_meta_id'),
                                            likable_type: record.get('model_name'),
                                            likable_id: record.get('id'),
                                        });
                                        likes.sync();
                                    }
                                },
                            },
                        ],
                    },
                ],
            },
            {
                xtype: 'container',
                cls: 'chatter-message-edit',
                flex: 1,
                hidden: true,
                bind: {
                    hidden: '{record.editMode ? false : true}',
                },
                items: [
                    {
                        xtype: 'textareafield',
                        ui: 'classic no-border',
                        placeholder: 'Comment or post an update',
                        label: false,
                        maxRows: 4,
                        flex: 1,
                        bind: {
                            value: '{record.message}',
                        },
                    },
                    {
                        xtype: 'container',
                        layout: {
                            type: 'hbox',
                            pack: 'end',
                        },
                        items: [
                            {
                                xtype: 'button',
                                margin: '0 8 0 0',
                                text: 'Cancel',
                                ui: 'solid-default default btn-sm round',
                                handler: function () {
                                    let store = this.upVM().get('chatter_messages'),
                                        list = this.up('chatter\\.messages'),
                                        record = this.upVM().get('record');

                                    record.set('editMode', false);
                                    store.rejectChanges();
                                    list.select(record);
                                },
                            },
                            {
                                xtype: 'button',
                                text: 'Save',
                                ui: 'normal solid-normal btn-sm round',
                                handler: function () {
                                    let store = this.upVM().get('chatter_messages'),
                                        list = this.up('chatter\\.messages'),
                                        record = this.upVM().get('record');

                                    store.sync({
                                        success: function () {
                                            record.set('editMode', false);
                                            list.select(record);
                                        },
                                    });
                                },
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
                        object_record = cmp.upVM().get('object_record');

                    if (object_record && !object_record.get('parent_id')) {
                        if (cmp.upVM().get('isOwn') && !cmp.upVM().get('record.editMode'))
                            cmp.down('[cls~=chat-message-tools]').show();
                    }

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
                fn: function (el) {
                    let type = el.currentTarget.getAttribute('data-object-type');
                    let vm = this.component.upVM();

                    switch (type) {
                        case 'user':
                            let tipExist = Ext.getCmp('chatterToolTip');
                            if (tipExist) {
                                tipExist.destroy();
                            }
                            Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                                id: 'chatterToolTip',
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        user_id: el.currentTarget.getAttribute('data-object-id'),
                                        clickedElement: el.target,
                                    },
                                },
                            }).showBy(el, 'bc-tc?');
                            break;
                        case 'cargo':
                            var commodity_id = parseInt(el.currentTarget.getAttribute('data-object-id'));
                            if (commodity_id) Abraxa.Global.showCommodityDialog(commodity_id);

                            break;

                        case 'file':
                            var file_id = parseInt(el.currentTarget.getAttribute('data-object-id'));
                            var selectedFile;
                            var files = vm.get('sortedFilesNoLimit');

                            Ext.each(files, function (file) {
                                if (file.id == parseInt(el.currentTarget.getAttribute('data-file-id')))
                                    selectedFile = file;
                            });

                            selectedFile = new Abraxa.model.adocs.DocumentFolderFile(selectedFile);

                            var data = {
                                file_id: file_id,
                                object_id: 3,
                                object_meta_id: vm.get('object_record.id'),
                            };
                            Abraxa.getApplication().getController('AbraxaController').previewFile(selectedFile, data);

                            break;
                    }
                },
            },
        },
    },
    listeners: {
        // select: 'onItemSelected',
        itemadd: 'onMessageAdd',
    },
});
